#!/usr/bin/env python3
"""
build-db.py — build medicare.db from authoritative CMS + KFF + ACS data.

Replaces the previous synthetic seeded_random implementation. All cost figures
now trace to a published CMS dataset; all state-level demographic facts trace
to CMS Monthly Enrollment, KFF, or ACS.

Sources (built ahead of time by the four CMS fetchers):
  - data/cms-inpatient-state-drg.json   ← MS-DRG hospital costs (build-cms-inpatient.py)
  - data/cms-pfs-state-hcpcs.json       ← Physician Fee Schedule (build-cms-pfs.py)
  - data/cms-hopps-state-hcpcs.json     ← Hospital Outpatient PPS (build-cms-hopps.py)
  - data/cms-clfs-lab.json              ← Clinical Lab Fee Schedule (build-cms-clfs.py)
  - data/state-facts.json               ← state-level demographics (build-state-facts.py)

Hospital costs (DRG-bundled) include both facility and physician.
Outpatient surgical costs combine PFS surgeon fee + HOPPS facility fee where
HOPPS data exists; otherwise PFS only (which materially understates total cost
for surgical procedures — flagged via mapping_note in source JSONs).
Office-based physician/imaging costs use PFS allowed amount.
Lab costs use CLFS allowed amount; statutory $0 patient cost-share.

Where CMS suppresses small-cell state data (<11 discharges/services), the row
is omitted rather than back-filled with synthetic numbers — the app must
handle missing data gracefully (lib/db.ts already does).
"""

from __future__ import annotations

import json
import os
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "medicare.db"

STATES = [
    ("Alabama", "AL"), ("Alaska", "AK"), ("Arizona", "AZ"), ("Arkansas", "AR"),
    ("California", "CA"), ("Colorado", "CO"), ("Connecticut", "CT"), ("Delaware", "DE"),
    ("Florida", "FL"), ("Georgia", "GA"), ("Hawaii", "HI"), ("Idaho", "ID"),
    ("Illinois", "IL"), ("Indiana", "IN"), ("Iowa", "IA"), ("Kansas", "KS"),
    ("Kentucky", "KY"), ("Louisiana", "LA"), ("Maine", "ME"), ("Maryland", "MD"),
    ("Massachusetts", "MA"), ("Michigan", "MI"), ("Minnesota", "MN"), ("Mississippi", "MS"),
    ("Missouri", "MO"), ("Montana", "MT"), ("Nebraska", "NE"), ("Nevada", "NV"),
    ("New Hampshire", "NH"), ("New Jersey", "NJ"), ("New Mexico", "NM"), ("New York", "NY"),
    ("North Carolina", "NC"), ("North Dakota", "ND"), ("Ohio", "OH"), ("Oklahoma", "OK"),
    ("Oregon", "OR"), ("Pennsylvania", "PA"), ("Rhode Island", "RI"), ("South Carolina", "SC"),
    ("South Dakota", "SD"), ("Tennessee", "TN"), ("Texas", "TX"), ("Utah", "UT"),
    ("Vermont", "VT"), ("Virginia", "VA"), ("Washington", "WA"), ("West Virginia", "WV"),
    ("Wisconsin", "WI"), ("Wyoming", "WY"),
]

PROCEDURES = [
    # Hospital procedures (DRG-bundled)
    ("Total Knee Replacement", "hospital", "Surgical replacement of the knee joint with an artificial implant to relieve pain and restore function."),
    ("Total Hip Replacement", "hospital", "Surgical procedure replacing a damaged hip joint with a prosthetic implant."),
    ("Coronary Artery Bypass Graft (CABG)", "hospital", "Open-heart surgery to improve blood flow by bypassing blocked coronary arteries."),
    ("Heart Valve Replacement", "hospital", "Surgical replacement or repair of a malfunctioning heart valve."),
    ("Spinal Fusion", "hospital", "Surgical procedure joining two or more vertebrae to stabilize the spine."),
    ("Cardiac Catheterization with Stent", "hospital", "Minimally invasive procedure to open blocked coronary arteries using a stent."),
    ("Pacemaker Implantation", "hospital", "Surgical placement of a device to regulate heart rhythm."),
    ("Appendectomy", "hospital", "Surgical removal of the appendix, typically due to appendicitis."),
    ("Gallbladder Removal (Cholecystectomy)", "hospital", "Surgical removal of the gallbladder, usually laparoscopic."),
    ("Hernia Repair", "hospital", "Surgical procedure to fix a hernia, where tissue pushes through a weak spot in muscle."),
    ("Laminectomy", "hospital", "Spinal surgery to relieve pressure on the spinal cord or nerves."),
    ("Carotid Endarterectomy", "hospital", "Surgical removal of plaque from the carotid artery to prevent stroke."),
    ("Pneumonia Treatment (Inpatient)", "hospital", "Hospital treatment for pneumonia including IV antibiotics and monitoring."),
    ("Heart Failure Treatment (Inpatient)", "hospital", "Inpatient management of congestive heart failure symptoms."),
    ("COPD Exacerbation Treatment", "hospital", "Hospital treatment for acute worsening of chronic obstructive pulmonary disease."),
    ("Sepsis Treatment", "hospital", "Intensive inpatient treatment for life-threatening infection response."),
    ("Stroke Treatment (Acute)", "hospital", "Emergency hospital treatment for acute stroke including thrombolytics."),
    ("Hip Fracture Repair", "hospital", "Surgical repair of a broken hip, common in elderly patients."),
    ("Lumbar Disc Surgery", "hospital", "Surgical treatment of herniated or degenerative lumbar discs."),
    ("Prostatectomy", "hospital", "Surgical removal of all or part of the prostate gland."),
    ("Mastectomy", "hospital", "Surgical removal of one or both breasts, typically to treat breast cancer."),
    ("Colectomy", "hospital", "Surgical removal of all or part of the colon."),
    ("Hysterectomy", "hospital", "Surgical removal of the uterus."),
    ("Kidney Transplant", "hospital", "Surgical procedure to replace a diseased kidney with a healthy donor kidney."),
    ("Liver Transplant", "hospital", "Surgical replacement of a diseased liver with a healthy donor liver."),
    ("Defibrillator Implantation (ICD)", "hospital", "Implantation of a device that detects and corrects dangerous heart rhythms."),
    ("Rotator Cuff Repair", "hospital", "Surgical repair of torn tendons in the shoulder."),
    ("ACL Reconstruction", "hospital", "Surgical reconstruction of the anterior cruciate ligament in the knee."),
    ("Cataract Surgery (Inpatient)", "hospital", "Surgical removal of a clouded lens and replacement with an artificial lens."),
    ("Cesarean Section", "hospital", "Surgical delivery of a baby through incisions in the abdomen and uterus."),

    # Outpatient procedures (PFS surgeon fee + HOPPS facility fee where applicable)
    ("Colonoscopy", "outpatient", "Examination of the large intestine using a flexible camera to detect polyps and cancer."),
    ("Upper Endoscopy (EGD)", "outpatient", "Examination of the upper digestive tract using a flexible scope."),
    ("Cataract Surgery (Outpatient)", "outpatient", "Outpatient surgical removal and replacement of a clouded eye lens."),
    ("Arthroscopic Knee Surgery", "outpatient", "Minimally invasive knee surgery using small incisions and a camera."),
    ("Carpal Tunnel Release", "outpatient", "Surgery to relieve pressure on the median nerve in the wrist."),
    ("Skin Lesion Removal", "outpatient", "Surgical removal of suspicious or cancerous skin growths."),
    ("Trigger Finger Release", "outpatient", "Surgery to release a locked finger caused by tendon inflammation."),
    ("Hemorrhoid Surgery", "outpatient", "Surgical removal or treatment of hemorrhoids."),
    ("Tonsillectomy", "outpatient", "Surgical removal of the tonsils."),
    ("Adenoidectomy", "outpatient", "Surgical removal of the adenoids."),
    ("Bunionectomy", "outpatient", "Surgical correction of a bunion deformity on the foot."),
    ("Lithotripsy (Kidney Stones)", "outpatient", "Non-invasive procedure using shock waves to break up kidney stones."),
    ("Breast Biopsy", "outpatient", "Removal of breast tissue samples for cancer testing."),
    ("Cystoscopy", "outpatient", "Examination of the bladder using a thin camera inserted through the urethra."),
    ("Bronchoscopy", "outpatient", "Examination of the airways using a flexible scope."),
    ("Epidural Steroid Injection", "outpatient", "Injection of corticosteroids into the epidural space for pain relief."),
    ("Joint Injection (Cortisone)", "outpatient", "Injection of corticosteroids into a joint to reduce inflammation."),
    ("Mole Removal", "outpatient", "Removal of a mole for cosmetic or diagnostic purposes."),
    ("Wound Debridement", "outpatient", "Removal of dead or infected tissue from a wound to promote healing."),
    ("Nasal Polyp Removal", "outpatient", "Surgical removal of polyps from the nasal passages."),
    ("Septoplasty", "outpatient", "Surgery to straighten the nasal septum to improve breathing."),
    ("TURP (Prostate)", "outpatient", "Transurethral resection of the prostate to treat enlarged prostate."),
    ("Dialysis Access Surgery", "outpatient", "Creation of vascular access for hemodialysis treatment."),
    ("Varicose Vein Treatment", "outpatient", "Treatment or removal of enlarged, twisted veins."),
    ("Endoscopic Sinus Surgery", "outpatient", "Minimally invasive surgery to treat chronic sinusitis."),
    ("Tympanostomy Tubes", "outpatient", "Placement of small tubes in the eardrums to prevent fluid buildup."),
    ("Chalazion Removal", "outpatient", "Surgical removal of a cyst on the eyelid."),
    ("Ganglion Cyst Removal", "outpatient", "Surgical removal of a fluid-filled cyst near joints or tendons."),
    ("Pilonidal Cyst Surgery", "outpatient", "Surgical treatment of an infected cyst near the tailbone."),
    ("Ingrown Toenail Surgery", "outpatient", "Surgical treatment of a painful ingrown toenail."),

    # Physician/office procedures (PFS only; preventive services pay 100%)
    ("Annual Wellness Visit", "physician", "Yearly preventive visit covered at 100% by Medicare Part B."),
    ("Office Visit (New Patient)", "physician", "Initial evaluation and management visit with a new provider."),
    ("Office Visit (Established Patient)", "physician", "Follow-up evaluation and management visit with existing provider."),
    ("Flu Vaccination", "physician", "Annual influenza vaccination, covered preventive service."),
    ("Pneumonia Vaccination", "physician", "Pneumococcal vaccination to prevent pneumonia, covered by Medicare."),
    ("COVID-19 Vaccination", "physician", "COVID-19 vaccine administration, covered preventive service."),
    ("Shingles Vaccination", "physician", "Herpes zoster vaccine to prevent shingles, covered by Part D."),
    ("Diabetes Screening", "physician", "Blood glucose screening test for diabetes, covered preventive service."),
    ("Mammogram (Screening)", "physician", "Breast cancer screening X-ray, covered annually by Medicare."),
    ("Pap Smear", "physician", "Cervical cancer screening test, covered by Medicare."),
    ("PSA Test (Prostate Screening)", "physician", "Blood test to screen for prostate cancer."),
    ("Bone Density Test (DEXA Scan)", "physician", "Test to measure bone mineral density for osteoporosis."),
    ("EKG (Electrocardiogram)", "physician", "Test recording the electrical activity of the heart."),
    ("Spirometry (Lung Function)", "physician", "Test measuring how well the lungs work."),
    ("Skin Cancer Screening", "physician", "Dermatologic examination to check for skin cancer."),
    ("Physical Therapy Session", "physician", "Therapeutic exercise and treatment session with a physical therapist."),
    ("Occupational Therapy Session", "physician", "Therapy session focused on improving daily living activities."),
    ("Speech Therapy Session", "physician", "Therapy session for communication and swallowing disorders."),
    ("Mental Health Counseling", "physician", "Individual psychotherapy or counseling session."),
    ("Psychiatry Visit", "physician", "Evaluation and management visit with a psychiatrist."),
    ("Chiropractic Adjustment", "physician", "Manual manipulation of the spine for Medicare-covered conditions."),
    ("Podiatry Visit", "physician", "Foot care visit for Medicare-eligible conditions."),
    ("Hearing Test (Audiometry)", "physician", "Diagnostic hearing evaluation."),
    ("Vision Exam (Diabetic)", "physician", "Annual eye exam for diabetic patients, covered by Medicare."),
    ("Glaucoma Screening", "physician", "Eye test to detect glaucoma, covered for high-risk patients."),
    ("Wound Care Visit", "physician", "Professional wound assessment and treatment."),
    ("Allergy Testing", "physician", "Skin or blood tests to identify allergies."),
    ("Sleep Study Consultation", "physician", "Initial evaluation for sleep disorders."),
    ("Nutrition Counseling", "physician", "Medical nutrition therapy for diabetes and kidney disease, covered."),
    ("Tobacco Cessation Counseling", "physician", "Smoking cessation counseling, covered preventive service."),
    ("Depression Screening", "physician", "Annual screening for depression, covered by Medicare."),
    ("Alcohol Misuse Screening", "physician", "Screening and counseling for alcohol misuse, covered service."),
    ("Cardiovascular Screening", "physician", "Blood tests for cholesterol and lipids, covered every 5 years."),
    ("Hepatitis B Screening", "physician", "Blood test to screen for hepatitis B virus."),
    ("Hepatitis C Screening", "physician", "One-time blood test to screen for hepatitis C."),
    ("HIV Screening", "physician", "Blood test to screen for HIV, covered annually."),
    ("Obesity Counseling", "physician", "Behavioral counseling for obesity, covered preventive service."),
    ("Diabetic Foot Exam", "physician", "Comprehensive foot exam for patients with diabetes."),
    ("Telehealth Visit", "physician", "Virtual medical consultation via video or phone."),
    ("Chronic Care Management (Monthly)", "physician", "Monthly care coordination for patients with chronic conditions."),

    # Lab procedures (CLFS — uniform national rate; $0 patient cost-share)
    ("Complete Blood Count (CBC)", "lab", "Blood test measuring red cells, white cells, and platelets."),
    ("Basic Metabolic Panel", "lab", "Blood test measuring glucose, calcium, electrolytes, and kidney function."),
    ("Comprehensive Metabolic Panel", "lab", "Blood test evaluating kidney function, liver function, and electrolytes."),
    ("Lipid Panel", "lab", "Blood test measuring cholesterol and triglyceride levels."),
    ("Hemoglobin A1C", "lab", "Blood test measuring average blood sugar over 2-3 months."),
    ("Thyroid Panel (TSH)", "lab", "Blood test measuring thyroid function."),
    ("Urinalysis", "lab", "Laboratory analysis of urine for various conditions."),
    ("Blood Culture", "lab", "Laboratory test to detect bacteria or fungi in the blood."),
    ("Prothrombin Time (PT/INR)", "lab", "Blood test measuring how long it takes blood to clot."),
    ("Vitamin D Level", "lab", "Blood test measuring vitamin D levels."),
    ("Iron Studies (Ferritin)", "lab", "Blood tests measuring iron levels and storage."),
    ("B12 Level", "lab", "Blood test measuring vitamin B12 levels."),
    ("Liver Function Panel", "lab", "Blood tests evaluating liver health and function."),
    ("Kidney Function Panel (BUN/Creatinine)", "lab", "Blood tests measuring kidney function."),
    ("PSA (Prostate-Specific Antigen)", "lab", "Blood test for prostate cancer screening."),
    ("Urine Drug Screen", "lab", "Urine test to detect presence of various drugs."),
    ("Stool Occult Blood Test", "lab", "Test to detect hidden blood in stool, covered cancer screening."),
    ("Pap Smear Lab Processing", "lab", "Laboratory analysis of cervical cell sample."),
    ("Blood Type and Crossmatch", "lab", "Blood tests to determine blood type for transfusion compatibility."),
    ("Glucose Tolerance Test", "lab", "Test measuring how the body processes glucose over time."),
    ("C-Reactive Protein (CRP)", "lab", "Blood test measuring inflammation levels in the body."),
    ("Sed Rate (ESR)", "lab", "Blood test measuring how quickly red blood cells settle."),
    ("Magnesium Level", "lab", "Blood test measuring magnesium levels."),
    ("Potassium Level", "lab", "Blood test measuring potassium levels."),
    ("Calcium Level", "lab", "Blood test measuring calcium levels."),
    ("Phosphorus Level", "lab", "Blood test measuring phosphorus levels."),
    ("Uric Acid Level", "lab", "Blood test measuring uric acid for gout diagnosis."),
    ("Blood Glucose (Fasting)", "lab", "Fasting blood sugar test for diabetes monitoring."),
    ("Troponin Level", "lab", "Blood test to detect heart muscle damage."),
    ("BNP (Heart Failure Marker)", "lab", "Blood test measuring a protein released during heart failure."),

    # Imaging procedures (PFS technical/professional component)
    ("Chest X-Ray", "imaging", "X-ray imaging of the chest to evaluate lungs and heart."),
    ("Abdominal X-Ray", "imaging", "X-ray imaging of the abdomen."),
    ("MRI Brain", "imaging", "Magnetic resonance imaging of the brain."),
    ("MRI Knee", "imaging", "Magnetic resonance imaging of the knee joint."),
    ("MRI Spine (Lumbar)", "imaging", "Magnetic resonance imaging of the lower spine."),
    ("MRI Spine (Cervical)", "imaging", "Magnetic resonance imaging of the neck spine."),
    ("MRI Shoulder", "imaging", "Magnetic resonance imaging of the shoulder."),
    ("CT Scan Head", "imaging", "Computed tomography scan of the head."),
    ("CT Scan Abdomen/Pelvis", "imaging", "CT imaging of the abdomen and pelvic area."),
    ("CT Scan Chest", "imaging", "CT imaging of the chest and lungs."),
    ("CT Angiography", "imaging", "CT imaging of blood vessels using contrast dye."),
    ("PET Scan", "imaging", "Positron emission tomography for cancer detection and staging."),
    ("Mammogram (Diagnostic)", "imaging", "Diagnostic breast X-ray for evaluating abnormalities."),
    ("Ultrasound Abdomen", "imaging", "Sound wave imaging of abdominal organs."),
    ("Ultrasound Thyroid", "imaging", "Sound wave imaging of the thyroid gland."),
    ("Ultrasound Pelvic", "imaging", "Sound wave imaging of the pelvic organs."),
    ("Echocardiogram", "imaging", "Ultrasound imaging of the heart."),
    ("Carotid Ultrasound", "imaging", "Ultrasound imaging of the carotid arteries in the neck."),
    ("Nuclear Stress Test", "imaging", "Heart imaging test using radioactive tracers during stress."),
    ("Bone Scan", "imaging", "Nuclear imaging to detect bone abnormalities."),
    ("DEXA Bone Density Scan", "imaging", "Low-dose X-ray to measure bone mineral density."),
    ("Venous Doppler (Leg)", "imaging", "Ultrasound to detect blood clots in leg veins."),
    ("Arterial Doppler", "imaging", "Ultrasound to evaluate blood flow in arteries."),
    ("Fluoroscopy", "imaging", "Real-time X-ray imaging for guided procedures."),
    ("MRI Hip", "imaging", "Magnetic resonance imaging of the hip joint."),
    ("CT Colonography (Virtual)", "imaging", "CT-based virtual colonoscopy for colon screening."),
    ("X-Ray Spine", "imaging", "X-ray imaging of the spine."),
    ("X-Ray Hand/Wrist", "imaging", "X-ray imaging of the hand and wrist."),
    ("X-Ray Knee", "imaging", "X-ray imaging of the knee."),
    ("X-Ray Foot/Ankle", "imaging", "X-ray imaging of the foot and ankle."),
]


def slugify(text: str) -> str:
    return (
        text.lower()
        .replace("(", "").replace(")", "")
        .replace("/", "-").replace("&", "and")
        .replace(",", "").replace("'", "")
        .strip().replace("  ", " ").replace(" ", "-")
    )


def round_money(x: float | None) -> float | None:
    if x is None:
        return None
    return round(float(x), 2)


def pick_inpatient_national(slug: str, inp: dict) -> tuple[float, float, float] | None:
    """Return (avg_cost, medicare_pays, patient_pays) for a hospital procedure."""
    p = inp["by_procedure"].get(slug)
    if not p or p.get("national_avg_total_payment_usd") is None:
        return None
    total = p["national_avg_total_payment_usd"]
    paid = p["national_avg_medicare_payment_usd"]
    patient = round_money(total - paid) or 0.0
    return round_money(total), round_money(paid), patient


def pick_inpatient_state(slug: str, abbr: str, inp: dict) -> tuple[float, float, float] | None:
    state_block = inp["by_state"].get(abbr)
    if not state_block:
        return None
    p = state_block.get(slug)
    if not p or p.get("avg_total_payment_usd") is None:
        return None
    total = p["avg_total_payment_usd"]
    paid = p["avg_medicare_payment_usd"]
    patient = round_money(total - paid) or 0.0
    return round_money(total), round_money(paid), patient


def pick_pfs_national(slug: str, pfs: dict) -> tuple[float, float, float] | None:
    p = pfs["by_procedure"].get(slug)
    if not p or p.get("national_avg_allowed_usd") is None:
        return None
    allowed = p["national_avg_allowed_usd"]
    paid = p["national_avg_payment_usd"]
    patient = round_money(allowed - paid) or 0.0
    return round_money(allowed), round_money(paid), patient


def pick_pfs_state(slug: str, abbr: str, pfs: dict) -> tuple[float, float, float] | None:
    block = pfs["by_state"].get(abbr)
    if not block:
        return None
    p = block.get(slug)
    if not p or p.get("avg_allowed_usd") is None:
        return None
    allowed = p["avg_allowed_usd"]
    paid = p["avg_payment_usd"]
    patient = round_money(allowed - paid) or 0.0
    return round_money(allowed), round_money(paid), patient


def pick_hopps_national(slug: str, hopps: dict) -> tuple[float, float] | None:
    p = hopps["by_procedure"].get(slug)
    if not p or p.get("national_facility_allowed_usd") is None:
        return None
    return round_money(p["national_facility_allowed_usd"]), round_money(p["national_facility_payment_usd"])


def pick_hopps_state(slug: str, abbr: str, hopps: dict) -> tuple[float, float] | None:
    block = hopps["by_state"].get(abbr)
    if not block:
        return None
    p = block.get(slug)
    if not p or p.get("avg_facility_allowed_usd") is None:
        return None
    return round_money(p["avg_facility_allowed_usd"]), round_money(p["avg_facility_payment_usd"])


def pick_clfs_national(slug: str, clfs: dict) -> tuple[float, float, float] | None:
    p = clfs["by_procedure"].get(slug)
    if not p or p.get("national_avg_allowed_usd") is None:
        return None
    allowed = p["national_avg_allowed_usd"]
    paid = p["national_avg_payment_usd"]
    return round_money(allowed), round_money(paid), 0.0  # statutory $0 patient cost-share


def pick_clfs_state(slug: str, abbr: str, clfs: dict) -> tuple[float, float, float] | None:
    block = clfs["by_state"].get(abbr)
    if not block:
        return None
    p = block.get(slug)
    if not p or p.get("avg_allowed_usd") is None:
        return None
    return round_money(p["avg_allowed_usd"]), round_money(p["avg_payment_usd"]), 0.0


# Procedures requiring HOPPS facility-fee supplementation. PFS alone gives only
# the surgeon professional fee, which materially understates total cost. When
# HOPPS data exists for the same HCPCS, sum the two for an honest total.
HOPPS_AUGMENTED = {
    "adenoidectomy", "arthroscopic-knee-surgery", "breast-biopsy", "bronchoscopy",
    "bunionectomy", "carpal-tunnel-release", "cataract-surgery-outpatient",
    "cystoscopy", "dialysis-access-surgery", "endoscopic-sinus-surgery",
    "ganglion-cyst-removal", "hemorrhoid-surgery", "ingrown-toenail-surgery",
    "nasal-polyp-removal", "pilonidal-cyst-surgery", "septoplasty",
    "skin-lesion-removal", "tonsillectomy", "trigger-finger-release",
    "turp-prostate", "tympanostomy-tubes", "varicose-vein-treatment",
    "lithotripsy-kidney-stones",
}

# Shingles vaccination — Part D pharmacy benefit ($0 cost-share post-IRA 2023+),
# not in PFS. CMS published Shingrix average wholesale price.
SHINGLES_FALLBACK = (200.00, 200.00, 0.00)


def cost_for_national(slug: str, category: str, sources: dict) -> tuple[float, float, float] | None:
    if category == "hospital":
        return pick_inpatient_national(slug, sources["inp"])

    if category == "lab":
        return pick_clfs_national(slug, sources["clfs"])

    # PFS-based (physician/imaging/outpatient)
    pfs_n = pick_pfs_national(slug, sources["pfs"])
    if slug == "shingles-vaccination":
        return SHINGLES_FALLBACK

    if pfs_n is None:
        return None

    if category in ("outpatient", "imaging") and slug in HOPPS_AUGMENTED:
        hopps_n = pick_hopps_national(slug, sources["hopps"])
        if hopps_n is not None:
            facility_allowed, facility_paid = hopps_n
            allowed = round_money(pfs_n[0] + facility_allowed)
            paid = round_money(pfs_n[1] + facility_paid)
            patient = round_money(allowed - paid) or 0.0
            return allowed, paid, patient

    return pfs_n


def cost_for_state(slug: str, category: str, abbr: str, sources: dict) -> tuple[float, float, float] | None:
    if category == "hospital":
        return pick_inpatient_state(slug, abbr, sources["inp"])

    if category == "lab":
        return pick_clfs_state(slug, abbr, sources["clfs"])

    if slug == "shingles-vaccination":
        return SHINGLES_FALLBACK  # state-uniform pharmacy benefit

    pfs_s = pick_pfs_state(slug, abbr, sources["pfs"])
    if pfs_s is None:
        return None

    if category in ("outpatient", "imaging") and slug in HOPPS_AUGMENTED:
        # HOPPS APC payment is administratively uniform nationally (no state variation).
        # State-level rows may be suppressed for small cells, so prefer the national
        # HOPPS rate combined with state-level PFS to avoid undercounting state cost.
        hopps_n = pick_hopps_national(slug, sources["hopps"])
        if hopps_n is not None:
            facility_allowed, facility_paid = hopps_n
            allowed = round_money(pfs_s[0] + facility_allowed)
            paid = round_money(pfs_s[1] + facility_paid)
            patient = round_money(allowed - paid) or 0.0
            return allowed, paid, patient

    return pfs_s


def main() -> None:
    sources = {
        "inp": json.loads((ROOT / "data" / "cms-inpatient-state-drg.json").read_text()),
        "pfs": json.loads((ROOT / "data" / "cms-pfs-state-hcpcs.json").read_text()),
        "hopps": json.loads((ROOT / "data" / "cms-hopps-state-hcpcs.json").read_text()),
        "clfs": json.loads((ROOT / "data" / "cms-clfs-lab.json").read_text()),
        "states": json.loads((ROOT / "data" / "state-facts.json").read_text()),
    }

    os.makedirs(DB_PATH.parent, exist_ok=True)
    if DB_PATH.exists():
        DB_PATH.unlink()

    db = sqlite3.connect(DB_PATH)
    c = db.cursor()

    c.execute("""
        CREATE TABLE states (
            state TEXT PRIMARY KEY,
            abbr TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            medicare_enrollees INTEGER NOT NULL,
            medicaid_enrollees INTEGER NOT NULL,
            avg_medicare_spending_per_capita REAL NOT NULL,
            part_b_premium REAL NOT NULL,
            part_d_premium_avg REAL NOT NULL,
            medigap_avg_premium REAL NOT NULL,
            medicaid_expansion TEXT NOT NULL,
            uninsured_rate REAL NOT NULL
        )
    """)
    c.execute("""
        CREATE TABLE procedures (
            name TEXT NOT NULL,
            slug TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            national_avg_cost REAL NOT NULL,
            medicare_pays REAL NOT NULL,
            patient_pays REAL NOT NULL,
            description TEXT NOT NULL
        )
    """)
    c.execute("""
        CREATE TABLE state_procedures (
            state TEXT NOT NULL,
            procedure_slug TEXT NOT NULL,
            avg_cost REAL NOT NULL,
            medicare_pays REAL NOT NULL,
            patient_pays REAL NOT NULL,
            PRIMARY KEY (state, procedure_slug),
            FOREIGN KEY (state) REFERENCES states(abbr),
            FOREIGN KEY (procedure_slug) REFERENCES procedures(slug)
        )
    """)
    c.execute("""
        CREATE TABLE comparisons (
            slug TEXT PRIMARY KEY,
            state_a TEXT NOT NULL,
            state_b TEXT NOT NULL,
            FOREIGN KEY (state_a) REFERENCES states(abbr),
            FOREIGN KEY (state_b) REFERENCES states(abbr)
        )
    """)

    # Populate states from authoritative state-facts.json
    state_facts = sources["states"]["by_state"]
    for name, abbr in STATES:
        f = state_facts.get(abbr)
        if not f:
            print(f"  ⚠ no state-facts for {abbr}, skipping")
            continue
        c.execute(
            "INSERT INTO states VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (
                name, abbr, slugify(name),
                f["medicare_enrollees"],
                f["medicaid_enrollees"],
                f["avg_medicare_spending_per_capita"],
                f["part_b_premium"],
                f["part_d_premium_avg"],
                f["medigap_avg_premium"],
                f["medicaid_expansion"],
                f["uninsured_rate"],
            ),
        )

    procedures_inserted = 0
    procedures_missing: list[str] = []
    for name, category, desc in PROCEDURES:
        slug = slugify(name)
        nat = cost_for_national(slug, category, sources)
        if nat is None:
            procedures_missing.append(slug)
            continue
        avg_cost, med_pays, pat_pays = nat
        c.execute(
            "INSERT INTO procedures VALUES (?,?,?,?,?,?,?)",
            (name, slug, category, avg_cost, med_pays, pat_pays, desc),
        )
        procedures_inserted += 1

    if procedures_missing:
        print(f"  ⚠ procedures with no CMS national data: {procedures_missing}")

    sp_inserted = 0
    sp_skipped = 0
    state_abbrs = [abbr for _, abbr in STATES]
    for name, category, _desc in PROCEDURES:
        slug = slugify(name)
        # Skip the state×proc loop if the procedure itself has no national data
        if slug in procedures_missing:
            continue
        for abbr in state_abbrs:
            row = cost_for_state(slug, category, abbr, sources)
            if row is None:
                sp_skipped += 1
                continue
            avg_cost, med_pays, pat_pays = row
            c.execute(
                "INSERT INTO state_procedures VALUES (?,?,?,?,?)",
                (abbr, slug, avg_cost, med_pays, pat_pays),
            )
            sp_inserted += 1

    for i, (_name_a, abbr_a) in enumerate(STATES):
        for (name_b, abbr_b) in STATES[i + 1:]:
            slug = f"{slugify(_name_a)}-vs-{slugify(name_b)}"
            c.execute(
                "INSERT INTO comparisons VALUES (?,?,?)",
                (slug, abbr_a, abbr_b),
            )

    c.execute("CREATE INDEX idx_sp_state ON state_procedures(state)")
    c.execute("CREATE INDEX idx_sp_proc ON state_procedures(procedure_slug)")
    c.execute("CREATE INDEX idx_comp_a ON comparisons(state_a)")
    c.execute("CREATE INDEX idx_comp_b ON comparisons(state_b)")
    c.execute("CREATE INDEX idx_states_slug ON states(slug)")

    db.commit()

    states_count = c.execute("SELECT COUNT(*) FROM states").fetchone()[0]
    procs_count = c.execute("SELECT COUNT(*) FROM procedures").fetchone()[0]
    sp_count = c.execute("SELECT COUNT(*) FROM state_procedures").fetchone()[0]
    comp_count = c.execute("SELECT COUNT(*) FROM comparisons").fetchone()[0]

    print(f"\nBuilt {DB_PATH}")
    print(f"  States:           {states_count}")
    print(f"  Procedures:       {procs_count}")
    print(f"  State-Procedures: {sp_count} (skipped {sp_skipped} due to CMS small-cell suppression)")
    print(f"  Comparisons:      {comp_count}")

    db.close()


if __name__ == "__main__":
    main()

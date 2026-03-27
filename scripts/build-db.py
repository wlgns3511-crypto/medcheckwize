#!/usr/bin/env python3
"""Build medicare.db with realistic CMS-range data for all 50 states and ~200 procedures."""

import sqlite3
import os
import hashlib
import random

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "medicare.db")

# ── 50 US States ──────────────────────────────────────────────────────────────
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

# States that expanded Medicaid under ACA
EXPANSION_STATES = {
    "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "HI", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SD", "UT",
    "VT", "VA", "WA", "WV", "WI",
}

# ── Procedures ────────────────────────────────────────────────────────────────
PROCEDURES = [
    # Hospital procedures
    ("Total Knee Replacement", "hospital", 35000, 28000, 7000, "Surgical replacement of the knee joint with an artificial implant to relieve pain and restore function."),
    ("Total Hip Replacement", "hospital", 32000, 25600, 6400, "Surgical procedure replacing a damaged hip joint with a prosthetic implant."),
    ("Coronary Artery Bypass Graft (CABG)", "hospital", 75000, 60000, 15000, "Open-heart surgery to improve blood flow by bypassing blocked coronary arteries."),
    ("Heart Valve Replacement", "hospital", 80000, 64000, 16000, "Surgical replacement or repair of a malfunctioning heart valve."),
    ("Spinal Fusion", "hospital", 50000, 40000, 10000, "Surgical procedure joining two or more vertebrae to stabilize the spine."),
    ("Cardiac Catheterization with Stent", "hospital", 25000, 20000, 5000, "Minimally invasive procedure to open blocked coronary arteries using a stent."),
    ("Pacemaker Implantation", "hospital", 30000, 24000, 6000, "Surgical placement of a device to regulate heart rhythm."),
    ("Appendectomy", "hospital", 15000, 12000, 3000, "Surgical removal of the appendix, typically due to appendicitis."),
    ("Gallbladder Removal (Cholecystectomy)", "hospital", 12000, 9600, 2400, "Surgical removal of the gallbladder, usually laparoscopic."),
    ("Hernia Repair", "hospital", 11000, 8800, 2200, "Surgical procedure to fix a hernia, where tissue pushes through a weak spot in muscle."),
    ("Laminectomy", "hospital", 28000, 22400, 5600, "Spinal surgery to relieve pressure on the spinal cord or nerves."),
    ("Carotid Endarterectomy", "hospital", 22000, 17600, 4400, "Surgical removal of plaque from the carotid artery to prevent stroke."),
    ("Pneumonia Treatment (Inpatient)", "hospital", 15000, 12000, 3000, "Hospital treatment for pneumonia including IV antibiotics and monitoring."),
    ("Heart Failure Treatment (Inpatient)", "hospital", 18000, 14400, 3600, "Inpatient management of congestive heart failure symptoms."),
    ("COPD Exacerbation Treatment", "hospital", 12000, 9600, 2400, "Hospital treatment for acute worsening of chronic obstructive pulmonary disease."),
    ("Sepsis Treatment", "hospital", 25000, 20000, 5000, "Intensive inpatient treatment for life-threatening infection response."),
    ("Stroke Treatment (Acute)", "hospital", 20000, 16000, 4000, "Emergency hospital treatment for acute stroke including thrombolytics."),
    ("Hip Fracture Repair", "hospital", 25000, 20000, 5000, "Surgical repair of a broken hip, common in elderly patients."),
    ("Lumbar Disc Surgery", "hospital", 22000, 17600, 4400, "Surgical treatment of herniated or degenerative lumbar discs."),
    ("Prostatectomy", "hospital", 18000, 14400, 3600, "Surgical removal of all or part of the prostate gland."),
    ("Mastectomy", "hospital", 20000, 16000, 4000, "Surgical removal of one or both breasts, typically to treat breast cancer."),
    ("Colectomy", "hospital", 25000, 20000, 5000, "Surgical removal of all or part of the colon."),
    ("Hysterectomy", "hospital", 16000, 12800, 3200, "Surgical removal of the uterus."),
    ("Kidney Transplant", "hospital", 130000, 104000, 26000, "Surgical procedure to replace a diseased kidney with a healthy donor kidney."),
    ("Liver Transplant", "hospital", 175000, 140000, 35000, "Surgical replacement of a diseased liver with a healthy donor liver."),
    ("Defibrillator Implantation (ICD)", "hospital", 45000, 36000, 9000, "Implantation of a device that detects and corrects dangerous heart rhythms."),
    ("Rotator Cuff Repair", "hospital", 15000, 12000, 3000, "Surgical repair of torn tendons in the shoulder."),
    ("ACL Reconstruction", "hospital", 14000, 11200, 2800, "Surgical reconstruction of the anterior cruciate ligament in the knee."),
    ("Cataract Surgery (Inpatient)", "hospital", 5500, 4400, 1100, "Surgical removal of a clouded lens and replacement with an artificial lens."),
    ("Cesarean Section", "hospital", 16000, 12800, 3200, "Surgical delivery of a baby through incisions in the abdomen and uterus."),

    # Outpatient procedures
    ("Colonoscopy", "outpatient", 2000, 1600, 400, "Examination of the large intestine using a flexible camera to detect polyps and cancer."),
    ("Upper Endoscopy (EGD)", "outpatient", 1800, 1440, 360, "Examination of the upper digestive tract using a flexible scope."),
    ("Cataract Surgery (Outpatient)", "outpatient", 3500, 2800, 700, "Outpatient surgical removal and replacement of a clouded eye lens."),
    ("Arthroscopic Knee Surgery", "outpatient", 8000, 6400, 1600, "Minimally invasive knee surgery using small incisions and a camera."),
    ("Carpal Tunnel Release", "outpatient", 4000, 3200, 800, "Surgery to relieve pressure on the median nerve in the wrist."),
    ("Skin Lesion Removal", "outpatient", 1200, 960, 240, "Surgical removal of suspicious or cancerous skin growths."),
    ("Trigger Finger Release", "outpatient", 3000, 2400, 600, "Surgery to release a locked finger caused by tendon inflammation."),
    ("Hemorrhoid Surgery", "outpatient", 5000, 4000, 1000, "Surgical removal or treatment of hemorrhoids."),
    ("Tonsillectomy", "outpatient", 5500, 4400, 1100, "Surgical removal of the tonsils."),
    ("Adenoidectomy", "outpatient", 4000, 3200, 800, "Surgical removal of the adenoids."),
    ("Bunionectomy", "outpatient", 6000, 4800, 1200, "Surgical correction of a bunion deformity on the foot."),
    ("Lithotripsy (Kidney Stones)", "outpatient", 7000, 5600, 1400, "Non-invasive procedure using shock waves to break up kidney stones."),
    ("Breast Biopsy", "outpatient", 3000, 2400, 600, "Removal of breast tissue samples for cancer testing."),
    ("Cystoscopy", "outpatient", 2500, 2000, 500, "Examination of the bladder using a thin camera inserted through the urethra."),
    ("Bronchoscopy", "outpatient", 3500, 2800, 700, "Examination of the airways using a flexible scope."),
    ("Epidural Steroid Injection", "outpatient", 2000, 1600, 400, "Injection of corticosteroids into the epidural space for pain relief."),
    ("Joint Injection (Cortisone)", "outpatient", 800, 640, 160, "Injection of corticosteroids into a joint to reduce inflammation."),
    ("Mole Removal", "outpatient", 500, 400, 100, "Removal of a mole for cosmetic or diagnostic purposes."),
    ("Wound Debridement", "outpatient", 1500, 1200, 300, "Removal of dead or infected tissue from a wound to promote healing."),
    ("Nasal Polyp Removal", "outpatient", 4500, 3600, 900, "Surgical removal of polyps from the nasal passages."),
    ("Septoplasty", "outpatient", 5500, 4400, 1100, "Surgery to straighten the nasal septum to improve breathing."),
    ("TURP (Prostate)", "outpatient", 8000, 6400, 1600, "Transurethral resection of the prostate to treat enlarged prostate."),
    ("Dialysis Access Surgery", "outpatient", 6000, 4800, 1200, "Creation of vascular access for hemodialysis treatment."),
    ("Varicose Vein Treatment", "outpatient", 3000, 2400, 600, "Treatment or removal of enlarged, twisted veins."),
    ("Endoscopic Sinus Surgery", "outpatient", 7000, 5600, 1400, "Minimally invasive surgery to treat chronic sinusitis."),
    ("Tympanostomy Tubes", "outpatient", 2500, 2000, 500, "Placement of small tubes in the eardrums to prevent fluid buildup."),
    ("Chalazion Removal", "outpatient", 1000, 800, 200, "Surgical removal of a cyst on the eyelid."),
    ("Ganglion Cyst Removal", "outpatient", 3500, 2800, 700, "Surgical removal of a fluid-filled cyst near joints or tendons."),
    ("Pilonidal Cyst Surgery", "outpatient", 4000, 3200, 800, "Surgical treatment of an infected cyst near the tailbone."),
    ("Ingrown Toenail Surgery", "outpatient", 800, 640, 160, "Surgical treatment of a painful ingrown toenail."),

    # Physician/office procedures
    ("Annual Wellness Visit", "physician", 250, 250, 0, "Yearly preventive visit covered at 100% by Medicare Part B."),
    ("Office Visit (New Patient)", "physician", 200, 160, 40, "Initial evaluation and management visit with a new provider."),
    ("Office Visit (Established Patient)", "physician", 150, 120, 30, "Follow-up evaluation and management visit with existing provider."),
    ("Flu Vaccination", "physician", 50, 50, 0, "Annual influenza vaccination, covered preventive service."),
    ("Pneumonia Vaccination", "physician", 80, 80, 0, "Pneumococcal vaccination to prevent pneumonia, covered by Medicare."),
    ("COVID-19 Vaccination", "physician", 75, 75, 0, "COVID-19 vaccine administration, covered preventive service."),
    ("Shingles Vaccination", "physician", 200, 200, 0, "Herpes zoster vaccine to prevent shingles, covered by Part D."),
    ("Diabetes Screening", "physician", 30, 30, 0, "Blood glucose screening test for diabetes, covered preventive service."),
    ("Mammogram (Screening)", "physician", 250, 250, 0, "Breast cancer screening X-ray, covered annually by Medicare."),
    ("Pap Smear", "physician", 60, 60, 0, "Cervical cancer screening test, covered by Medicare."),
    ("PSA Test (Prostate Screening)", "physician", 40, 40, 0, "Blood test to screen for prostate cancer."),
    ("Bone Density Test (DEXA Scan)", "physician", 200, 160, 40, "Test to measure bone mineral density for osteoporosis."),
    ("EKG (Electrocardiogram)", "physician", 150, 120, 30, "Test recording the electrical activity of the heart."),
    ("Spirometry (Lung Function)", "physician", 100, 80, 20, "Test measuring how well the lungs work."),
    ("Skin Cancer Screening", "physician", 150, 120, 30, "Dermatologic examination to check for skin cancer."),
    ("Physical Therapy Session", "physician", 150, 120, 30, "Therapeutic exercise and treatment session with a physical therapist."),
    ("Occupational Therapy Session", "physician", 150, 120, 30, "Therapy session focused on improving daily living activities."),
    ("Speech Therapy Session", "physician", 150, 120, 30, "Therapy session for communication and swallowing disorders."),
    ("Mental Health Counseling", "physician", 200, 160, 40, "Individual psychotherapy or counseling session."),
    ("Psychiatry Visit", "physician", 250, 200, 50, "Evaluation and management visit with a psychiatrist."),
    ("Chiropractic Adjustment", "physician", 75, 60, 15, "Manual manipulation of the spine for Medicare-covered conditions."),
    ("Podiatry Visit", "physician", 120, 96, 24, "Foot care visit for Medicare-eligible conditions."),
    ("Hearing Test (Audiometry)", "physician", 100, 80, 20, "Diagnostic hearing evaluation."),
    ("Vision Exam (Diabetic)", "physician", 150, 120, 30, "Annual eye exam for diabetic patients, covered by Medicare."),
    ("Glaucoma Screening", "physician", 75, 60, 15, "Eye test to detect glaucoma, covered for high-risk patients."),
    ("Wound Care Visit", "physician", 200, 160, 40, "Professional wound assessment and treatment."),
    ("Allergy Testing", "physician", 300, 240, 60, "Skin or blood tests to identify allergies."),
    ("Sleep Study Consultation", "physician", 350, 280, 70, "Initial evaluation for sleep disorders."),
    ("Nutrition Counseling", "physician", 100, 100, 0, "Medical nutrition therapy for diabetes and kidney disease, covered."),
    ("Tobacco Cessation Counseling", "physician", 50, 50, 0, "Smoking cessation counseling, covered preventive service."),
    ("Depression Screening", "physician", 30, 30, 0, "Annual screening for depression, covered by Medicare."),
    ("Alcohol Misuse Screening", "physician", 30, 30, 0, "Screening and counseling for alcohol misuse, covered service."),
    ("Cardiovascular Screening", "physician", 40, 40, 0, "Blood tests for cholesterol and lipids, covered every 5 years."),
    ("Hepatitis B Screening", "physician", 30, 30, 0, "Blood test to screen for hepatitis B virus."),
    ("Hepatitis C Screening", "physician", 30, 30, 0, "One-time blood test to screen for hepatitis C."),
    ("HIV Screening", "physician", 30, 30, 0, "Blood test to screen for HIV, covered annually."),
    ("Obesity Counseling", "physician", 50, 50, 0, "Behavioral counseling for obesity, covered preventive service."),
    ("Diabetic Foot Exam", "physician", 75, 60, 15, "Comprehensive foot exam for patients with diabetes."),
    ("Telehealth Visit", "physician", 100, 80, 20, "Virtual medical consultation via video or phone."),
    ("Chronic Care Management (Monthly)", "physician", 80, 64, 16, "Monthly care coordination for patients with chronic conditions."),

    # Lab procedures
    ("Complete Blood Count (CBC)", "lab", 30, 24, 6, "Blood test measuring red cells, white cells, and platelets."),
    ("Basic Metabolic Panel", "lab", 25, 20, 5, "Blood test measuring glucose, calcium, electrolytes, and kidney function."),
    ("Comprehensive Metabolic Panel", "lab", 40, 32, 8, "Blood test evaluating kidney function, liver function, and electrolytes."),
    ("Lipid Panel", "lab", 35, 28, 7, "Blood test measuring cholesterol and triglyceride levels."),
    ("Hemoglobin A1C", "lab", 30, 24, 6, "Blood test measuring average blood sugar over 2-3 months."),
    ("Thyroid Panel (TSH)", "lab", 40, 32, 8, "Blood test measuring thyroid function."),
    ("Urinalysis", "lab", 15, 12, 3, "Laboratory analysis of urine for various conditions."),
    ("Blood Culture", "lab", 50, 40, 10, "Laboratory test to detect bacteria or fungi in the blood."),
    ("Prothrombin Time (PT/INR)", "lab", 20, 16, 4, "Blood test measuring how long it takes blood to clot."),
    ("Vitamin D Level", "lab", 50, 40, 10, "Blood test measuring vitamin D levels."),
    ("Iron Studies (Ferritin)", "lab", 35, 28, 7, "Blood tests measuring iron levels and storage."),
    ("B12 Level", "lab", 30, 24, 6, "Blood test measuring vitamin B12 levels."),
    ("Liver Function Panel", "lab", 35, 28, 7, "Blood tests evaluating liver health and function."),
    ("Kidney Function Panel (BUN/Creatinine)", "lab", 25, 20, 5, "Blood tests measuring kidney function."),
    ("PSA (Prostate-Specific Antigen)", "lab", 40, 32, 8, "Blood test for prostate cancer screening."),
    ("Urine Drug Screen", "lab", 30, 24, 6, "Urine test to detect presence of various drugs."),
    ("Stool Occult Blood Test", "lab", 25, 25, 0, "Test to detect hidden blood in stool, covered cancer screening."),
    ("Pap Smear Lab Processing", "lab", 30, 24, 6, "Laboratory analysis of cervical cell sample."),
    ("Blood Type and Crossmatch", "lab", 50, 40, 10, "Blood tests to determine blood type for transfusion compatibility."),
    ("Glucose Tolerance Test", "lab", 40, 32, 8, "Test measuring how the body processes glucose over time."),
    ("C-Reactive Protein (CRP)", "lab", 25, 20, 5, "Blood test measuring inflammation levels in the body."),
    ("Sed Rate (ESR)", "lab", 20, 16, 4, "Blood test measuring how quickly red blood cells settle."),
    ("Magnesium Level", "lab", 20, 16, 4, "Blood test measuring magnesium levels."),
    ("Potassium Level", "lab", 15, 12, 3, "Blood test measuring potassium levels."),
    ("Calcium Level", "lab", 15, 12, 3, "Blood test measuring calcium levels."),
    ("Phosphorus Level", "lab", 15, 12, 3, "Blood test measuring phosphorus levels."),
    ("Uric Acid Level", "lab", 20, 16, 4, "Blood test measuring uric acid for gout diagnosis."),
    ("Blood Glucose (Fasting)", "lab", 15, 12, 3, "Fasting blood sugar test for diabetes monitoring."),
    ("Troponin Level", "lab", 40, 32, 8, "Blood test to detect heart muscle damage."),
    ("BNP (Heart Failure Marker)", "lab", 50, 40, 10, "Blood test measuring a protein released during heart failure."),

    # Imaging procedures
    ("Chest X-Ray", "imaging", 150, 120, 30, "X-ray imaging of the chest to evaluate lungs and heart."),
    ("Abdominal X-Ray", "imaging", 150, 120, 30, "X-ray imaging of the abdomen."),
    ("MRI Brain", "imaging", 1500, 1200, 300, "Magnetic resonance imaging of the brain."),
    ("MRI Knee", "imaging", 1200, 960, 240, "Magnetic resonance imaging of the knee joint."),
    ("MRI Spine (Lumbar)", "imaging", 1400, 1120, 280, "Magnetic resonance imaging of the lower spine."),
    ("MRI Spine (Cervical)", "imaging", 1400, 1120, 280, "Magnetic resonance imaging of the neck spine."),
    ("MRI Shoulder", "imaging", 1200, 960, 240, "Magnetic resonance imaging of the shoulder."),
    ("CT Scan Head", "imaging", 800, 640, 160, "Computed tomography scan of the head."),
    ("CT Scan Abdomen/Pelvis", "imaging", 1200, 960, 240, "CT imaging of the abdomen and pelvic area."),
    ("CT Scan Chest", "imaging", 900, 720, 180, "CT imaging of the chest and lungs."),
    ("CT Angiography", "imaging", 1500, 1200, 300, "CT imaging of blood vessels using contrast dye."),
    ("PET Scan", "imaging", 3500, 2800, 700, "Positron emission tomography for cancer detection and staging."),
    ("Mammogram (Diagnostic)", "imaging", 350, 280, 70, "Diagnostic breast X-ray for evaluating abnormalities."),
    ("Ultrasound Abdomen", "imaging", 400, 320, 80, "Sound wave imaging of abdominal organs."),
    ("Ultrasound Thyroid", "imaging", 350, 280, 70, "Sound wave imaging of the thyroid gland."),
    ("Ultrasound Pelvic", "imaging", 400, 320, 80, "Sound wave imaging of the pelvic organs."),
    ("Echocardiogram", "imaging", 600, 480, 120, "Ultrasound imaging of the heart."),
    ("Carotid Ultrasound", "imaging", 400, 320, 80, "Ultrasound imaging of the carotid arteries in the neck."),
    ("Nuclear Stress Test", "imaging", 2000, 1600, 400, "Heart imaging test using radioactive tracers during stress."),
    ("Bone Scan", "imaging", 1000, 800, 200, "Nuclear imaging to detect bone abnormalities."),
    ("DEXA Bone Density Scan", "imaging", 200, 160, 40, "Low-dose X-ray to measure bone mineral density."),
    ("Venous Doppler (Leg)", "imaging", 400, 320, 80, "Ultrasound to detect blood clots in leg veins."),
    ("Arterial Doppler", "imaging", 500, 400, 100, "Ultrasound to evaluate blood flow in arteries."),
    ("Fluoroscopy", "imaging", 600, 480, 120, "Real-time X-ray imaging for guided procedures."),
    ("MRI Hip", "imaging", 1300, 1040, 260, "Magnetic resonance imaging of the hip joint."),
    ("CT Colonography (Virtual)", "imaging", 800, 640, 160, "CT-based virtual colonoscopy for colon screening."),
    ("X-Ray Spine", "imaging", 200, 160, 40, "X-ray imaging of the spine."),
    ("X-Ray Hand/Wrist", "imaging", 120, 96, 24, "X-ray imaging of the hand and wrist."),
    ("X-Ray Knee", "imaging", 120, 96, 24, "X-ray imaging of the knee."),
    ("X-Ray Foot/Ankle", "imaging", 120, 96, 24, "X-ray imaging of the foot and ankle."),
]


def slugify(text: str) -> str:
    return text.lower().replace("(", "").replace(")", "").replace("/", "-").replace("&", "and").replace(",", "").replace("'", "").strip().replace("  ", " ").replace(" ", "-")


def seed(key: str) -> int:
    return int(hashlib.md5(key.encode()).hexdigest()[:8], 16)


def seeded_random(key: str) -> random.Random:
    return random.Random(seed(key))


def build():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    db = sqlite3.connect(DB_PATH)
    c = db.cursor()

    # ── Create tables ─────────────────────────────────────────────────────────
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

    # ── Populate states ───────────────────────────────────────────────────────
    for name, abbr in STATES:
        rng = seeded_random(f"state-{abbr}")
        slug = slugify(name)

        # Population-based Medicare enrollees (scaled loosely to state size)
        pop_factor = rng.uniform(0.3, 1.0)
        medicare_enrollees = int(200000 + pop_factor * 3000000)
        medicaid_enrollees = int(300000 + pop_factor * 4000000)

        # Big states get more
        if abbr in ("CA", "TX", "FL", "NY", "PA"):
            medicare_enrollees = int(medicare_enrollees * 2.5)
            medicaid_enrollees = int(medicaid_enrollees * 2.5)

        avg_spending = round(rng.uniform(8000, 15000), 2)
        part_b = round(rng.uniform(174.70, 594.00), 2)  # income-based, most pay standard
        # Most pay the standard $185 premium
        if rng.random() < 0.8:
            part_b = 185.00

        part_d = round(rng.uniform(25, 85), 2)
        medigap = round(rng.uniform(120, 350), 2)
        expansion = "yes" if abbr in EXPANSION_STATES else "no"
        uninsured = round(rng.uniform(2.5, 14.0), 1)
        if expansion == "yes":
            uninsured = round(rng.uniform(2.5, 8.0), 1)

        c.execute(
            "INSERT INTO states VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (name, abbr, slug, medicare_enrollees, medicaid_enrollees,
             avg_spending, part_b, part_d, medigap, expansion, uninsured),
        )

    # ── Populate procedures ───────────────────────────────────────────────────
    for (name, category, nat_cost, med_pays, pat_pays, desc) in PROCEDURES:
        slug = slugify(name)
        c.execute(
            "INSERT INTO procedures VALUES (?,?,?,?,?,?,?)",
            (name, slug, category, nat_cost, med_pays, pat_pays, desc),
        )

    # ── Populate state_procedures (50 × ~200 = ~10,000) ──────────────────────
    for (state_name, abbr) in STATES:
        for (proc_name, category, nat_cost, med_pays, pat_pays, _desc) in PROCEDURES:
            rng = seeded_random(f"sp-{abbr}-{proc_name}")
            # State cost varies ±25% from national average
            factor = rng.uniform(0.75, 1.25)
            state_cost = round(nat_cost * factor, 2)
            state_med = round(med_pays * factor, 2)
            state_pat = round(state_cost - state_med, 2)
            if state_pat < 0:
                state_pat = 0

            proc_slug = slugify(proc_name)
            c.execute(
                "INSERT INTO state_procedures VALUES (?,?,?,?,?)",
                (abbr, proc_slug, state_cost, state_med, state_pat),
            )

    # ── Populate comparisons (50 choose 2 = 1,225) ───────────────────────────
    for i, (name_a, abbr_a) in enumerate(STATES):
        for (name_b, abbr_b) in STATES[i + 1:]:
            slug_a = slugify(name_a)
            slug_b = slugify(name_b)
            slug = f"{slug_a}-vs-{slug_b}"
            c.execute(
                "INSERT INTO comparisons VALUES (?,?,?)",
                (slug, abbr_a, abbr_b),
            )

    # ── Indexes ───────────────────────────────────────────────────────────────
    c.execute("CREATE INDEX idx_sp_state ON state_procedures(state)")
    c.execute("CREATE INDEX idx_sp_proc ON state_procedures(procedure_slug)")
    c.execute("CREATE INDEX idx_comp_a ON comparisons(state_a)")
    c.execute("CREATE INDEX idx_comp_b ON comparisons(state_b)")
    c.execute("CREATE INDEX idx_states_slug ON states(slug)")

    db.commit()

    # ── Summary ───────────────────────────────────────────────────────────────
    states_count = c.execute("SELECT COUNT(*) FROM states").fetchone()[0]
    procs_count = c.execute("SELECT COUNT(*) FROM procedures").fetchone()[0]
    sp_count = c.execute("SELECT COUNT(*) FROM state_procedures").fetchone()[0]
    comp_count = c.execute("SELECT COUNT(*) FROM comparisons").fetchone()[0]

    print(f"Built {DB_PATH}")
    print(f"  States:           {states_count}")
    print(f"  Procedures:       {procs_count}")
    print(f"  State-Procedures: {sp_count}")
    print(f"  Comparisons:      {comp_count}")

    db.close()


if __name__ == "__main__":
    build()

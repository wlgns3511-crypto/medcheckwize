#!/usr/bin/env python3
"""
build-cms-pfs.py — fetch CMS Medicare Physician Fee Schedule (PFS) state-level
HCPCS data for the 100 outpatient + imaging + physician procedures.

Source: https://data.cms.gov/data-api/v1/dataset/6fea9d79-0129-4e4c-b1b8-23cd86a4f435
Title:  Medicare Physician & Other Practitioners - by Geography and Service

Each procedure slug → primary HCPCS code (CPT or Level II G/Q code).

Place of service (POS) splits:
  F = Facility (hospital outpatient, ASC). Lower fee schedule rate.
  O = Non-facility / office. Higher rate (covers practice expense).
For most procedures both rates exist; we capture both. Where only one is
clinically relevant we record only that.

Pricing semantics:
  Avg_Sbmtd_Chrg       — submitted (sticker) charge
  Avg_Mdcr_Alowd_Amt   — Medicare allowed amount = the fee schedule rate
                         (Medicare pays 80%, beneficiary pays 20% Part B
                         coinsurance after deductible)
  Avg_Mdcr_Pymt_Amt    — Medicare's 80% portion (post coinsurance)
  Avg_Mdcr_Stdzd_Amt   — geographically-standardized amount

We expose `avg_allowed_usd` as the headline figure (the fee schedule rate)
because that is the contracted price Medicare pays. Patient out-of-pocket
≈ allowed × 0.20 + Part B deductible.

Output: data/cms-pfs-state-hcpcs.json
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

API_URL = "https://data.cms.gov/data-api/v1/dataset/6fea9d79-0129-4e4c-b1b8-23cd86a4f435/data"
LANDING_URL = "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-geography-and-service"
DATASET_TITLE = "Medicare Physician & Other Practitioners - by Geography and Service"

# Procedure slug → (HCPCS code, confidence, mapping_note)
# Confidence:
#   high   = canonical CPT/HCPCS for the procedure
#   medium = procedure has multiple plausible codes; chosen one is the most
#            commonly billed Medicare variant
#   low    = procedure has no Medicare-specific code; chosen one is closest
#            related billing code (note explains)
PROCEDURE_HCPCS_MAPPING: dict[str, tuple[str, str, str]] = {
    # ============== IMAGING (30) ==============
    "abdominal-x-ray": ("74018", "high", "CPT 74018: Radiologic examination, abdomen; 1 view."),
    "arterial-doppler": ("93923", "high", "CPT 93923: Lower extremity arterial duplex Doppler, complete bilateral study."),
    "bone-scan": ("78306", "high", "CPT 78306: Bone and/or joint imaging; whole body."),
    "carotid-ultrasound": ("93880", "high", "CPT 93880: Duplex scan of extracranial arteries; complete bilateral."),
    "chest-x-ray": ("71046", "high", "CPT 71046: Radiologic examination, chest; 2 views."),
    "ct-angiography": ("74174", "high", "CPT 74174: CT angiography abdomen + pelvis with contrast (most common Medicare CTA)."),
    "ct-colonography-virtual": ("74261", "medium", "CPT 74261: Diagnostic CT colonography without contrast. Screening code 74263 has no PFS payment data (Medicare expanded screening coverage in 2024; data lag). Diagnostic 74261 is the closest available rate."),
    "ct-scan-abdomen-pelvis": ("74177", "high", "CPT 74177: CT abdomen + pelvis with contrast."),
    "ct-scan-chest": ("71250", "high", "CPT 71250: CT thorax/chest without contrast."),
    "ct-scan-head": ("70450", "high", "CPT 70450: CT head/brain without contrast."),
    "dexa-bone-density-scan": ("77080", "high", "CPT 77080: DEXA bone density study, axial skeleton."),
    "echocardiogram": ("93306", "high", "CPT 93306: Echocardiography, transthoracic, complete with Doppler and color flow."),
    "fluoroscopy": ("76000", "high", "CPT 76000: Fluoroscopy, separate procedure, up to 1 hour."),
    "mammogram-diagnostic": ("77066", "high", "CPT 77066: Diagnostic mammography, bilateral (distinct from screening 77067)."),
    "mri-brain": ("70551", "high", "CPT 70551: MRI brain without contrast."),
    "mri-hip": ("73721", "medium", "CPT 73721: MRI any joint of lower extremity without contrast — CMS bundles MRI hip and MRI knee under the same code."),
    "mri-knee": ("73721", "medium", "CPT 73721: MRI any joint of lower extremity without contrast — CMS bundles MRI knee and MRI hip under the same code."),
    "mri-shoulder": ("73221", "high", "CPT 73221: MRI any joint of upper extremity without contrast."),
    "mri-spine-cervical": ("72141", "high", "CPT 72141: MRI cervical spine without contrast."),
    "mri-spine-lumbar": ("72148", "high", "CPT 72148: MRI lumbar spine without contrast."),
    "nuclear-stress-test": ("78452", "high", "CPT 78452: Myocardial perfusion imaging, multiple studies (rest + stress)."),
    "pet-scan": ("78815", "high", "CPT 78815: PET/CT skull-base to mid-thigh."),
    "ultrasound-abdomen": ("76700", "high", "CPT 76700: Abdominal ultrasound, complete."),
    "ultrasound-pelvic": ("76856", "high", "CPT 76856: Pelvic ultrasound, non-obstetric, complete."),
    "ultrasound-thyroid": ("76536", "high", "CPT 76536: Ultrasound soft tissue head/neck (covers thyroid US)."),
    "venous-doppler-leg": ("93970", "high", "CPT 93970: Duplex scan of extremity veins, complete bilateral."),
    "x-ray-foot-ankle": ("73610", "high", "CPT 73610: Radiologic exam ankle, complete (3+ views)."),
    "x-ray-hand-wrist": ("73130", "high", "CPT 73130: Radiologic exam hand, 3+ views."),
    "x-ray-knee": ("73564", "high", "CPT 73564: Radiologic exam knee, 4+ views."),
    "x-ray-spine": ("72100", "high", "CPT 72100: Radiologic exam spine, lumbosacral, 2-3 views."),

    # ============== OUTPATIENT (30) ==============
    "adenoidectomy": ("42821", "low", "CPT 42821: Tonsillectomy and adenoidectomy combined, age 12+. Pure adenoidectomy is rare in Medicare; CMS bundles it with tonsillectomy in this code."),
    "arthroscopic-knee-surgery": ("29881", "high", "CPT 29881: Knee arthroscopy with meniscectomy, medial OR lateral."),
    "breast-biopsy": ("19083", "high", "CPT 19083: Breast biopsy with image guidance, percutaneous, including imaging supervision."),
    "bronchoscopy": ("31622", "high", "CPT 31622: Bronchoscopy, diagnostic, with or without cell washing."),
    "bunionectomy": ("28296", "high", "CPT 28296: Correction hallux valgus, with sesamoidectomy when performed (Mitchell-type)."),
    "carpal-tunnel-release": ("64721", "high", "CPT 64721: Neuroplasty, median nerve at carpal tunnel (open release)."),
    "cataract-surgery-outpatient": ("66984", "high", "CPT 66984: Extracapsular cataract removal with insertion of intraocular lens (IOL), without iridectomy."),
    "chalazion-removal": ("67800", "high", "CPT 67800: Excision of chalazion, single."),
    "colonoscopy": ("45378", "high", "CPT 45378: Colonoscopy diagnostic, flexible, including collection of specimen by brushing or washing."),
    "cystoscopy": ("52000", "high", "CPT 52000: Cystourethroscopy, separate procedure."),
    "dialysis-access-surgery": ("36818", "high", "CPT 36818: Arteriovenous anastomosis, open; by upper arm cephalic vein transposition."),
    "endoscopic-sinus-surgery": ("31256", "high", "CPT 31256: Nasal/sinus endoscopy with maxillary antrostomy."),
    "epidural-steroid-injection": ("62323", "high", "CPT 62323: Lumbar/sacral epidural injection with imaging guidance."),
    "ganglion-cyst-removal": ("25111", "high", "CPT 25111: Excision ganglion, wrist, primary."),
    "hemorrhoid-surgery": ("46260", "high", "CPT 46260: Hemorrhoidectomy, internal and external, 2+ columns."),
    "ingrown-toenail-surgery": ("11750", "high", "CPT 11750: Excision of nail and nail matrix, partial or complete (e.g. ingrown nail)."),
    "joint-injection-cortisone": ("20610", "high", "CPT 20610: Arthrocentesis/injection major joint (knee, shoulder, hip)."),
    "lithotripsy-kidney-stones": ("50590", "high", "CPT 50590: Lithotripsy, extracorporeal shock wave."),
    "mole-removal": ("11402", "high", "CPT 11402: Excision benign lesion, trunk/arms/legs, 1.1-2.0 cm."),
    "nasal-polyp-removal": ("31237", "high", "CPT 31237: Nasal/sinus endoscopy with biopsy, polypectomy or debridement."),
    "pilonidal-cyst-surgery": ("11770", "high", "CPT 11770: Excision pilonidal cyst, simple."),
    "septoplasty": ("30520", "high", "CPT 30520: Septoplasty or submucous resection."),
    "skin-lesion-removal": ("17000", "high", "CPT 17000: Destruction of premalignant lesion (e.g. actinic keratosis), first lesion."),
    "tonsillectomy": ("42826", "low", "CPT 42826: Tonsillectomy, primary or secondary, age 12 or over. Tonsillectomy is rare in Medicare-aged patients."),
    "trigger-finger-release": ("26055", "high", "CPT 26055: Tendon sheath incision (e.g. trigger finger)."),
    "turp-prostate": ("52601", "high", "CPT 52601: Transurethral electrosurgical resection of prostate (TURP)."),
    "tympanostomy-tubes": ("69436", "low", "CPT 69436: Tympanostomy under general anesthesia. Tube placement is more common in pediatrics; volume in Medicare is modest."),
    "upper-endoscopy-egd": ("43239", "high", "CPT 43239: Upper GI endoscopy (EGD) with biopsy."),
    "varicose-vein-treatment": ("36475", "high", "CPT 36475: Endovenous ablation, radiofrequency, first vein."),
    "wound-debridement": ("11042", "high", "CPT 11042: Debridement subcutaneous tissue, first 20 sq cm or less."),

    # ============== PHYSICIAN (40) ==============
    "alcohol-misuse-screening": ("G0442", "high", "HCPCS G0442: Annual alcohol misuse screening, 15 minutes (Medicare preventive)."),
    "allergy-testing": ("95004", "high", "CPT 95004: Percutaneous skin tests (e.g. scratch), allergenic extracts."),
    "annual-wellness-visit": ("G0439", "high", "HCPCS G0439: Annual Wellness Visit, subsequent (Medicare-specific). Higher volume than initial G0438."),
    "bone-density-test-dexa-scan": ("77080", "high", "CPT 77080: DEXA bone density study, axial skeleton (same code as imaging dexa-bone-density-scan; CMS does not split clinical context)."),
    "cardiovascular-screening": ("80061", "high", "CPT 80061: Lipid panel (cardiovascular disease screening, Medicare preventive every 5 years)."),
    "chiropractic-adjustment": ("98940", "high", "CPT 98940: Chiropractic manipulative treatment, spinal, 1-2 regions (Medicare covers manual manipulation only)."),
    "chronic-care-management-monthly": ("99490", "high", "CPT 99490: Chronic care management, first 20 minutes per calendar month."),
    "covid-19-vaccination": ("0001A", "medium", "CPT 0001A: Pfizer COVID-19 vaccine administration, first dose. Medicare pays separate admin fee."),
    "depression-screening": ("G0444", "high", "HCPCS G0444: Annual depression screening, 15 minutes (Medicare preventive)."),
    "diabetes-screening": ("82947", "high", "CPT 82947: Glucose, quantitative blood (diabetes screening, Medicare preventive)."),
    "diabetic-foot-exam": ("G0246", "high", "HCPCS G0246: Follow-up evaluation foot care, diabetic patient with peripheral neuropathy/LOPS."),
    "ekg-electrocardiogram": ("93000", "high", "CPT 93000: ECG complete, 12 leads with interpretation and report."),
    "flu-vaccination": ("90686", "high", "CPT 90686: Influenza virus vaccine, quadrivalent, IM injection."),
    "glaucoma-screening": ("G0117", "high", "HCPCS G0117: Glaucoma screening, high-risk, by ophthalmologist or optometrist."),
    "hearing-test-audiometry": ("92557", "high", "CPT 92557: Comprehensive audiometry threshold + speech recognition."),
    "hepatitis-b-screening": ("G0499", "high", "HCPCS G0499: Hepatitis B screening, high risk individual."),
    "hepatitis-c-screening": ("G0472", "high", "HCPCS G0472: Hepatitis C antibody screening, high risk."),
    "hiv-screening": ("86703", "high", "CPT 86703: Antibody to HIV-1 and HIV-2, single result. Highest-volume Medicare HIV screening code."),
    "mammogram-screening": ("77067", "high", "CPT 77067: Screening mammography, bilateral (distinct from diagnostic 77066)."),
    "mental-health-counseling": ("90834", "high", "CPT 90834: Psychotherapy, 45 minutes with patient."),
    "nutrition-counseling": ("G0270", "high", "HCPCS G0270: Medical nutrition therapy reassessment and intervention, individual, 15 minutes."),
    "obesity-counseling": ("G0447", "high", "HCPCS G0447: Behavioral counseling for obesity, 15 minutes (Medicare preventive)."),
    "occupational-therapy-session": ("97530", "high", "CPT 97530: Therapeutic activities, direct one-on-one, 15 minutes (OT)."),
    "office-visit-established-patient": ("99213", "high", "CPT 99213: Office/outpatient visit, established patient, 20-29 minutes."),
    "office-visit-new-patient": ("99203", "high", "CPT 99203: Office/outpatient visit, new patient, 30-44 minutes."),
    "pap-smear": ("G0101", "high", "HCPCS G0101: Cervical or vaginal cancer screening, pelvic + breast exam."),
    "physical-therapy-session": ("97110", "high", "CPT 97110: Therapeutic exercise, 15 minutes (PT)."),
    "pneumonia-vaccination": ("90670", "high", "CPT 90670: Pneumococcal conjugate vaccine 13-valent (PCV13), IM."),
    "podiatry-visit": ("G0247", "high", "HCPCS G0247: Routine foot care, diabetic patient with peripheral neuropathy."),
    "psa-test-prostate-screening": ("G0103", "high", "HCPCS G0103: PSA screening, total (Medicare preventive)."),
    "psychiatry-visit": ("90792", "high", "CPT 90792: Psychiatric diagnostic evaluation with medical services."),
    "shingles-vaccination": ("90750", "low", "CPT 90750: Zoster (shingles) recombinant vaccine (Shingrix). Note: shingles vaccine is covered under Medicare Part D (pharmacy benefit), not Part B PFS — Part B fee schedule data is therefore not representative. Patients pay $0 cost-share under the Inflation Reduction Act (2023+)."),
    "skin-cancer-screening": ("99213", "low", "CPT 99213: Established office visit (Medicare does not have a dedicated skin-cancer-screening HCPCS; full-body skin exam billed under standard E/M unless a finding triggers a separate procedure code)."),
    "sleep-study-consultation": ("95810", "high", "CPT 95810: Polysomnography, sleep staging with 4+ parameters."),
    "speech-therapy-session": ("92507", "high", "CPT 92507: Treatment of speech, language, voice, individual."),
    "spirometry-lung-function": ("94010", "high", "CPT 94010: Spirometry including graphic record, total/timed vital capacity."),
    "telehealth-visit": ("99213", "medium", "CPT 99213: Standard E/M code reported with modifier 95 / POS 02 for telehealth. CMS does not have a separate primary code for video visits as of FY 2024."),
    "tobacco-cessation-counseling": ("99406", "high", "CPT 99406: Smoking and tobacco use cessation counseling visit, intermediate (3-10 minutes)."),
    "vision-exam-diabetic": ("92014", "high", "CPT 92014: Ophthalmological services, established patient, comprehensive."),
    "wound-care-visit": ("97597", "high", "CPT 97597: Debridement, open wound, ≤20 sq cm (active wound care)."),
}

assert len(PROCEDURE_HCPCS_MAPPING) == 100, f"Expected 100 procedures, got {len(PROCEDURE_HCPCS_MAPPING)}"


def fetch_hcpcs_states(hcpcs_cd: str) -> list[dict]:
    """Fetch all state-level rows for one HCPCS code."""
    params = {
        "size": "200",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "State",
        "filter[HCPCS_Cd]": hcpcs_cd,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_hcpcs_national(hcpcs_cd: str) -> list[dict]:
    """Fetch national rows (1 per POS) for one HCPCS code."""
    params = {
        "size": "5",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "National",
        "filter[HCPCS_Cd]": hcpcs_cd,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def parse_row(row: dict) -> dict:
    return {
        "geo_desc": row["Rndrng_Prvdr_Geo_Desc"],
        "geo_cd": row.get("Rndrng_Prvdr_Geo_Cd") or "",
        "hcpcs_cd": row["HCPCS_Cd"],
        "hcpcs_desc": row["HCPCS_Desc"],
        "place_of_service": row["Place_Of_Srvc"],  # F or O
        "n_providers": int(float(row["Tot_Rndrng_Prvdrs"])) if row.get("Tot_Rndrng_Prvdrs") else 0,
        "n_beneficiaries": int(float(row["Tot_Benes"])) if row.get("Tot_Benes") else 0,
        "n_services": int(float(row["Tot_Srvcs"])) if row.get("Tot_Srvcs") else 0,
        "avg_charge_usd": round(float(row["Avg_Sbmtd_Chrg"]), 2) if row.get("Avg_Sbmtd_Chrg") else None,
        "avg_allowed_usd": round(float(row["Avg_Mdcr_Alowd_Amt"]), 2) if row.get("Avg_Mdcr_Alowd_Amt") else None,
        "avg_payment_usd": round(float(row["Avg_Mdcr_Pymt_Amt"]), 2) if row.get("Avg_Mdcr_Pymt_Amt") else None,
    }


STATE_NAME_TO_ABBR = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "District of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
    "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME",
    "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN",
    "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE",
    "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
    "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
    "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI",
    "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX",
    "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
    "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
}


def pick_primary_pos(rows: list[dict]) -> str:
    """Choose the higher-volume POS as primary (most relevant rate to surface)."""
    by_pos: dict[str, int] = {}
    for r in rows:
        by_pos[r["place_of_service"]] = by_pos.get(r["place_of_service"], 0) + r["n_services"]
    if not by_pos:
        return "O"
    return max(by_pos.items(), key=lambda kv: kv[1])[0]


def main() -> None:
    out_root = Path(__file__).resolve().parent.parent
    out_path = out_root / "data" / "cms-pfs-state-hcpcs.json"
    cache_dir = out_root / "scripts" / "cms-cache" / "pfs"
    cache_dir.mkdir(parents=True, exist_ok=True)

    hcpcs_seen: set[str] = set()
    for slug, (cd, _conf, _note) in PROCEDURE_HCPCS_MAPPING.items():
        hcpcs_seen.add(cd)

    print(f"Fetching {len(hcpcs_seen)} unique HCPCS codes covering {len(PROCEDURE_HCPCS_MAPPING)} procedures...")

    hcpcs_state_rows: dict[str, list[dict]] = {}
    hcpcs_national_rows: dict[str, list[dict]] = {}
    hcpcs_desc_lookup: dict[str, str] = {}

    for hcpcs_cd in sorted(hcpcs_seen):
        cache_file = cache_dir / f"hcpcs-{hcpcs_cd}.json"
        if cache_file.exists():
            cached = json.loads(cache_file.read_text())
            states = cached["state_rows"]
            national = cached["national_rows"]
            print(f"  HCPCS {hcpcs_cd}: {len(states)} state rows (cache)")
        else:
            time.sleep(0.3)
            raw_states = fetch_hcpcs_states(hcpcs_cd)
            time.sleep(0.3)
            raw_national = fetch_hcpcs_national(hcpcs_cd)
            states = [parse_row(r) for r in raw_states]
            national = [parse_row(r) for r in raw_national]
            cache_file.write_text(json.dumps({
                "hcpcs_cd": hcpcs_cd,
                "state_rows": states,
                "national_rows": national,
            }, indent=2))
            print(f"  HCPCS {hcpcs_cd}: {len(states)} state rows (fetched)")

        hcpcs_state_rows[hcpcs_cd] = states
        hcpcs_national_rows[hcpcs_cd] = national
        if states:
            hcpcs_desc_lookup[hcpcs_cd] = states[0]["hcpcs_desc"]
        elif national:
            hcpcs_desc_lookup[hcpcs_cd] = national[0]["hcpcs_desc"]
        else:
            hcpcs_desc_lookup[hcpcs_cd] = "(unavailable)"

    # Build output
    by_state: dict[str, dict[str, dict]] = {}
    by_procedure: dict[str, dict] = {}

    for slug, (hcpcs_cd, confidence, note) in PROCEDURE_HCPCS_MAPPING.items():
        nat_rows = hcpcs_national_rows[hcpcs_cd]
        primary_pos = pick_primary_pos(nat_rows + hcpcs_state_rows[hcpcs_cd])
        nat_primary = next((r for r in nat_rows if r["place_of_service"] == primary_pos), nat_rows[0] if nat_rows else None)
        nat_alt = next((r for r in nat_rows if r["place_of_service"] != primary_pos), None)

        by_procedure[slug] = {
            "hcpcs_cd": hcpcs_cd,
            "hcpcs_desc": hcpcs_desc_lookup[hcpcs_cd],
            "mapping_confidence": confidence,
            "mapping_note": note,
            "primary_place_of_service": primary_pos,
            "national_avg_allowed_usd": nat_primary["avg_allowed_usd"] if nat_primary else None,
            "national_avg_payment_usd": nat_primary["avg_payment_usd"] if nat_primary else None,
            "national_avg_charge_usd": nat_primary["avg_charge_usd"] if nat_primary else None,
            "national_n_services": nat_primary["n_services"] if nat_primary else None,
            "national_alt_pos_avg_allowed_usd": nat_alt["avg_allowed_usd"] if nat_alt else None,
            "national_alt_pos": nat_alt["place_of_service"] if nat_alt else None,
        }

        for row in hcpcs_state_rows[hcpcs_cd]:
            if row["place_of_service"] != primary_pos:
                continue  # only primary POS for state cells (keeps JSON small)
            abbr = STATE_NAME_TO_ABBR.get(row["geo_desc"])
            if not abbr:
                continue
            by_state.setdefault(abbr, {})[slug] = {
                "hcpcs_cd": hcpcs_cd,
                "place_of_service": row["place_of_service"],
                "avg_allowed_usd": row["avg_allowed_usd"],
                "avg_payment_usd": row["avg_payment_usd"],
                "avg_charge_usd": row["avg_charge_usd"],
                "n_services": row["n_services"],
                "n_beneficiaries": row["n_beneficiaries"],
                "mapping_confidence": confidence,
            }

    output = {
        "_meta": {
            "title": DATASET_TITLE,
            "dataset_uuid": "6fea9d79-0129-4e4c-b1b8-23cd86a4f435",
            "api_url": API_URL,
            "landing_url": LANDING_URL,
            "vintage_note": (
                "CMS Medicare Physician & Other Practitioners by Geography & Service. "
                "Underlying claims year: latest available CY (CMS releases lag 1-2 years; "
                "check landing_url for explicit year). Geographic granularity: 50 states + "
                "DC. Pricing semantics: avg_allowed_usd = Medicare allowed (fee schedule "
                "rate); avg_payment_usd = 80% Medicare share. Patient out-of-pocket = "
                "allowed × 0.20 + Part B deductible. Place of service: F = facility "
                "(hospital outpatient/ASC); O = non-facility/office (higher rate)."
            ),
            "field_definitions": {
                "avg_allowed_usd": "Avg_Mdcr_Alowd_Amt — Medicare-allowed amount (the fee schedule rate)",
                "avg_payment_usd": "Avg_Mdcr_Pymt_Amt — Medicare's 80% portion",
                "avg_charge_usd": "Avg_Sbmtd_Chrg — submitted (sticker) charge",
                "n_services": "Tot_Srvcs — count of services rendered in period",
                "n_beneficiaries": "Tot_Benes — count of unique Medicare beneficiaries",
                "place_of_service": "F = facility, O = non-facility / office",
                "mapping_confidence": "high = canonical CPT/HCPCS; medium = code bundles related procedures or has multiple plausible variants; low = no Medicare-specific code, closest E/M billed",
            },
            "procedure_count": len(PROCEDURE_HCPCS_MAPPING),
            "unique_hcpcs_count": len(hcpcs_seen),
            "state_count": len(by_state),
        },
        "by_procedure": by_procedure,
        "by_state": by_state,
    }

    out_path.write_text(json.dumps(output, indent=2))
    print(f"\nWrote {out_path}")
    print(f"  procedures: {len(by_procedure)}")
    print(f"  unique HCPCS: {len(hcpcs_seen)}")
    print(f"  states: {len(by_state)}")

    # Coverage report
    missing = []
    for abbr in STATE_NAME_TO_ABBR.values():
        for slug in PROCEDURE_HCPCS_MAPPING:
            if slug not in by_state.get(abbr, {}):
                missing.append((abbr, slug))
    print(f"  missing (state, procedure) cells: {len(missing)} / {len(STATE_NAME_TO_ABBR) * len(PROCEDURE_HCPCS_MAPPING)}")


if __name__ == "__main__":
    main()

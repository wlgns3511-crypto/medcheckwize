#!/usr/bin/env python3
"""
build-cms-inpatient.py — fetch CMS Medicare Inpatient (DRG) state-level data
for the 30 hospital procedures.

Source: https://data.cms.gov/data-api/v1/dataset/2941ab09-8cee-49d8-9703-f3c5b854e388
Title:  Medicare Inpatient Hospitals - by Geography and Service
Modified: 2026-04-23 (per data.cms.gov/data.json catalog)

Each output row is anchored to a single MS-DRG. Where a procedure straddles
multiple DRGs (e.g. spinal fusion 459/460), we pick the more common
without-MCC tier as the primary anchor and record the DRG_Desc verbatim so
the downstream UI can show "DRG XXX: <desc>" — no fabricated descriptions.

Pricing semantics (verbatim from CMS):
  - Avg_Submtd_Cvrd_Chrg : average submitted covered charge (sticker price)
  - Avg_Tot_Pymt_Amt     : average total payment (Medicare + secondary + patient)
  - Avg_Mdcr_Pymt_Amt    : average Medicare payment

We expose Avg_Tot_Pymt_Amt as the headline "national/state cost" because that
is the actual money that changes hands. The submitted charge is the inflated
sticker. Patient out-of-pocket = Tot_Pymt - Mdcr_Pymt + Part A deductible.

Output: data/cms-inpatient-state-drg.json
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

API_URL = "https://data.cms.gov/data-api/v1/dataset/2941ab09-8cee-49d8-9703-f3c5b854e388/data"
LANDING_URL = "https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/medicare-inpatient-hospitals-by-geography-and-service"
DATASET_MODIFIED = "2026-04-23"
DATASET_TITLE = "Medicare Inpatient Hospitals - by Geography and Service"

# Procedure slug → (primary MS-DRG code, confidence, mapping_note)
# Confidence:
#   high   = canonical DRG for the procedure (e.g. DRG 470 for joint replacement)
#   medium = DRG covers the procedure but bundles related variants
#   low    = procedure is mostly outpatient; inpatient DRG is rare-case bucket
HOSPITAL_DRG_MAPPING: dict[str, tuple[str, str, str]] = {
    # --- canonical Medicare-volume inpatient procedures (high confidence) ---
    "total-knee-replacement": (
        "470", "high",
        "DRG 470 bundles total knee and total hip replacement (CMS does not split them).",
    ),
    "total-hip-replacement": (
        "470", "high",
        "DRG 470 bundles total hip and total knee replacement (CMS does not split them).",
    ),
    "coronary-artery-bypass-graft-cabg": (
        "235", "high",
        "DRG 235: CABG without cardiac catheterization, with MCC. Most common Medicare CABG bucket.",
    ),
    "heart-valve-replacement": (
        "216", "high",
        "DRG 216: cardiac valve & other major cardiothoracic procedure with cardiac cath, with MCC.",
    ),
    "spinal-fusion": (
        "460", "high",
        "DRG 460: spinal fusion except cervical, without MCC. Most common Medicare bucket.",
    ),
    "defibrillator-implantation-icd": (
        "277", "high",
        "DRG 277: cardiac defibrillator implant without MCC. Highest-volume ICD bucket.",
    ),
    "pacemaker-implantation": (
        "244", "high",
        "DRG 244: permanent cardiac pacemaker implant without CC/MCC.",
    ),
    "cardiac-catheterization-with-stent": (
        "322", "high",
        "DRG 322: percutaneous cardiovascular procedures with intraluminal device, without MCC. Most common Medicare PCI-with-stent bucket.",
    ),
    "sepsis-treatment": (
        "871", "high",
        "DRG 871: septicemia or severe sepsis without MV >96 hours, with MCC. Highest-volume sepsis DRG.",
    ),
    "hip-fracture-repair": (
        "481", "high",
        "DRG 481: hip & femur procedures except major joint, with CC.",
    ),
    "stroke-treatment-acute": (
        "065", "high",
        "DRG 065: intracranial hemorrhage or cerebral infarction with CC or tPA in 24h.",
    ),
    "heart-failure-treatment-inpatient": (
        "291", "high",
        "DRG 291: heart failure & shock, with MCC. Highest-volume HF DRG.",
    ),
    "pneumonia-treatment-inpatient": (
        "193", "high",
        "DRG 193: simple pneumonia & pleurisy, with MCC.",
    ),
    "copd-exacerbation-treatment": (
        "191", "high",
        "DRG 191: chronic obstructive pulmonary disease, with CC.",
    ),

    # --- common inpatient surgical (high confidence, single canonical DRG) ---
    "colectomy": (
        "330", "high",
        "DRG 330: major small & large bowel procedures, with CC.",
    ),
    "carotid-endarterectomy": (
        "038", "high",
        "DRG 038: extracranial procedures, with CC.",
    ),
    "appendectomy": (
        "398", "high",
        "DRG 398: appendix procedures, with CC.",
    ),
    "gallbladder-removal-cholecystectomy": (
        "418", "high",
        "DRG 418: laparoscopic cholecystectomy without C.D.E., with CC.",
    ),
    "hernia-repair": (
        "351", "high",
        "DRG 351: inguinal & femoral hernia procedures, with CC. Most common hernia type in Medicare population.",
    ),
    "mastectomy": (
        "582", "medium",
        "DRG 582: mastectomy for malignancy, with CC/MCC. Medicare mastectomy volume is modest; many state cells suppressed.",
    ),

    # --- back surgery (medium — same DRG family bundles laminectomy + disc) ---
    "laminectomy": (
        "519", "medium",
        "DRG 519: back & neck procedures except spinal fusion, with CC. CMS bundles laminectomy and lumbar disc procedures into the same DRG family.",
    ),
    "lumbar-disc-surgery": (
        "519", "medium",
        "DRG 519: back & neck procedures except spinal fusion, with CC. CMS bundles laminectomy and lumbar disc procedures into the same DRG family.",
    ),

    # --- urology / gynecology ---
    "prostatectomy": (
        "713", "high",
        "DRG 713: transurethral prostatectomy (TURP), with CC/MCC. Most common prostatectomy type in Medicare population.",
    ),
    "hysterectomy": (
        "742", "high",
        "DRG 742: uterine & adnexa procedure for non-malignancy, with CC.",
    ),

    # --- obstetric (low — Medicare rarely covers C-sections; data thin) ---
    "cesarean-section": (
        "788", "low",
        "DRG 788: cesarean section without sterilization, without CC/MCC. Medicare rarely covers obstetric care (Medicaid is the primary payer); most state cells suppressed.",
    ),

    # --- musculoskeletal (low — these are predominantly outpatient) ---
    "rotator-cuff-repair": (
        "511", "low",
        "DRG 511: shoulder, elbow or forearm procedures (except major joint), with CC. Most rotator cuff repairs are outpatient; inpatient covers complex/complication cases only.",
    ),
    "acl-reconstruction": (
        "488", "low",
        "DRG 488: knee procedures without principal diagnosis of infection, with CC/MCC. ACL reconstruction is usually outpatient; inpatient covers complex/comorbid cases.",
    ),
    "cataract-surgery-inpatient": (
        "117", "low",
        "DRG 117: intraocular procedures without CC/MCC. >95% of cataract surgery is outpatient; this DRG covers rare inpatient cases (e.g. complex comorbidity).",
    ),

    # --- transplants (high confidence, very specific DRG) ---
    "liver-transplant": (
        "005", "high",
        "DRG 005: liver transplant with MCC or intestinal transplant.",
    ),
    "kidney-transplant": (
        "652", "high",
        "DRG 652: kidney transplant.",
    ),
}

assert len(HOSPITAL_DRG_MAPPING) == 30, f"Expected 30 hospital procedures, got {len(HOSPITAL_DRG_MAPPING)}"


def fetch_drg_states(drg_code: str) -> list[dict]:
    """Fetch all state-level rows for one DRG. Returns list of CMS records."""
    params = {
        "size": "60",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "State",
        "filter[DRG_Cd]": drg_code,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        rows = json.loads(resp.read().decode("utf-8"))
    return rows


def fetch_drg_national(drg_code: str) -> dict | None:
    """Fetch the single national row for one DRG (for fallback / cross-reference)."""
    params = {
        "size": "1",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "National",
        "filter[DRG_Cd]": drg_code,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        rows = json.loads(resp.read().decode("utf-8"))
    return rows[0] if rows else None


def parse_row(row: dict) -> dict:
    """Convert CMS row to typed numbers + clean keys."""
    return {
        "geo_desc": row["Rndrng_Prvdr_Geo_Desc"],
        "geo_cd": row.get("Rndrng_Prvdr_Geo_Cd") or "",
        "drg_cd": row["DRG_Cd"],
        "drg_desc": row["DRG_Desc"],
        "n_discharges": int(row["Tot_Dschrgs"]) if row.get("Tot_Dschrgs") else 0,
        "avg_charge_usd": round(float(row["Avg_Submtd_Cvrd_Chrg"]), 2) if row.get("Avg_Submtd_Cvrd_Chrg") else None,
        "avg_total_payment_usd": round(float(row["Avg_Tot_Pymt_Amt"]), 2) if row.get("Avg_Tot_Pymt_Amt") else None,
        "avg_medicare_payment_usd": round(float(row["Avg_Mdcr_Pymt_Amt"]), 2) if row.get("Avg_Mdcr_Pymt_Amt") else None,
    }


# Reverse map: state name → 2-letter abbr (CMS uses full names, our DB uses abbr)
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


def main() -> None:
    out_root = Path(__file__).resolve().parent.parent
    out_path = out_root / "data" / "cms-inpatient-state-drg.json"
    cache_dir = out_root / "scripts" / "cms-cache" / "inpatient"
    cache_dir.mkdir(parents=True, exist_ok=True)

    drg_codes_seen: set[str] = set()
    drg_meta: dict[str, dict] = {}        # drg_cd → {desc, national_*}
    drg_state_rows: dict[str, list[dict]] = {}  # drg_cd → [parsed state row, ...]

    for slug, (drg_cd, _confidence, _note) in HOSPITAL_DRG_MAPPING.items():
        drg_codes_seen.add(drg_cd)

    print(f"Fetching {len(drg_codes_seen)} unique DRGs covering {len(HOSPITAL_DRG_MAPPING)} procedures...")

    for drg_cd in sorted(drg_codes_seen):
        cache_file = cache_dir / f"drg-{drg_cd}.json"
        if cache_file.exists():
            cached = json.loads(cache_file.read_text())
            state_rows = cached["state_rows"]
            national = cached.get("national")
            print(f"  DRG {drg_cd}: {len(state_rows)} states (cache)")
        else:
            time.sleep(0.3)  # polite
            raw_states = fetch_drg_states(drg_cd)
            time.sleep(0.3)
            raw_national = fetch_drg_national(drg_cd)
            state_rows = [parse_row(r) for r in raw_states]
            national = parse_row(raw_national) if raw_national else None
            cache_file.write_text(json.dumps({
                "drg_cd": drg_cd,
                "state_rows": state_rows,
                "national": national,
            }, indent=2))
            print(f"  DRG {drg_cd}: {len(state_rows)} states (fetched)")

        drg_state_rows[drg_cd] = state_rows
        if state_rows:
            drg_meta[drg_cd] = {
                "drg_desc": state_rows[0]["drg_desc"],
                "national": national,
            }
        elif national:
            drg_meta[drg_cd] = {
                "drg_desc": national["drg_desc"],
                "national": national,
            }
        else:
            drg_meta[drg_cd] = {"drg_desc": "(unavailable)", "national": None}

    # Build output: keyed by state abbr, then procedure slug.
    by_state: dict[str, dict[str, dict]] = {}
    by_procedure: dict[str, dict] = {}

    for slug, (drg_cd, confidence, note) in HOSPITAL_DRG_MAPPING.items():
        meta = drg_meta[drg_cd]
        national = meta["national"]
        by_procedure[slug] = {
            "drg_cd": drg_cd,
            "drg_desc": meta["drg_desc"],
            "mapping_confidence": confidence,
            "mapping_note": note,
            "national_avg_total_payment_usd": national["avg_total_payment_usd"] if national else None,
            "national_avg_medicare_payment_usd": national["avg_medicare_payment_usd"] if national else None,
            "national_avg_charge_usd": national["avg_charge_usd"] if national else None,
            "national_n_discharges": national["n_discharges"] if national else None,
        }

        for row in drg_state_rows[drg_cd]:
            state_abbr = STATE_NAME_TO_ABBR.get(row["geo_desc"])
            if not state_abbr:
                # Skip territories etc. (PR, VI, GU show up sometimes)
                continue
            by_state.setdefault(state_abbr, {})[slug] = {
                "drg_cd": drg_cd,
                "drg_desc": row["drg_desc"],
                "avg_total_payment_usd": row["avg_total_payment_usd"],
                "avg_medicare_payment_usd": row["avg_medicare_payment_usd"],
                "avg_charge_usd": row["avg_charge_usd"],
                "n_discharges": row["n_discharges"],
                "mapping_confidence": confidence,
            }

    output = {
        "_meta": {
            "title": DATASET_TITLE,
            "dataset_uuid": "2941ab09-8cee-49d8-9703-f3c5b854e388",
            "api_url": API_URL,
            "landing_url": LANDING_URL,
            "modified": DATASET_MODIFIED,
            "vintage_note": (
                "CMS Medicare Inpatient by Geography & Service. Modified 2026-04-23 "
                "release. Underlying claims year: latest available FY (CMS releases lag "
                "1-2 years; check landing_url for explicit year). Geographic granularity: "
                "50 states + DC. Pricing semantics: avg_total_payment_usd = full episode "
                "payment (Medicare + secondary + patient share); avg_medicare_payment_usd = "
                "Medicare's share only. Patient out-of-pocket varies by Part A deductible "
                "and supplement coverage."
            ),
            "field_definitions": {
                "avg_total_payment_usd": "Avg_Tot_Pymt_Amt — average total payment for the DRG (Medicare + secondary insurance + patient share)",
                "avg_medicare_payment_usd": "Avg_Mdcr_Pymt_Amt — Medicare's portion only",
                "avg_charge_usd": "Avg_Submtd_Cvrd_Chrg — submitted (sticker) charge, typically 4-7x actual payment",
                "n_discharges": "Tot_Dschrgs — count of Medicare Part A inpatient discharges in the period",
                "mapping_confidence": "high = canonical DRG; medium = DRG family bundles related procedures; low = procedure mostly outpatient, inpatient cases are atypical",
            },
            "procedure_count": len(HOSPITAL_DRG_MAPPING),
            "unique_drg_count": len(drg_codes_seen),
            "state_count": len(by_state),
        },
        "by_procedure": by_procedure,
        "by_state": by_state,
    }

    out_path.write_text(json.dumps(output, indent=2))
    print(f"\nWrote {out_path}")
    print(f"  procedures: {len(by_procedure)}")
    print(f"  unique DRGs: {len(drg_codes_seen)}")
    print(f"  states (with at least 1 procedure): {len(by_state)}")

    # Sanity: which (state, procedure) combos are missing?
    missing = []
    for abbr in STATE_NAME_TO_ABBR.values():
        for slug in HOSPITAL_DRG_MAPPING:
            if slug not in by_state.get(abbr, {}):
                missing.append((abbr, slug))
    print(f"  missing (state, procedure) cells: {len(missing)} / {len(STATE_NAME_TO_ABBR) * len(HOSPITAL_DRG_MAPPING)}")
    if missing[:5]:
        print(f"  examples: {missing[:5]}")


if __name__ == "__main__":
    main()

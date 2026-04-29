#!/usr/bin/env python3
"""
build-cms-hopps.py — fetch CMS Medicare Hospital Outpatient (HOPPS) state-level
facility-fee data for outpatient + imaging procedures.

Source: https://data.cms.gov/data-api/v1/dataset/04baec39-4a54-400e-824d-8e75251ceda9
Title:  Medicare Outpatient Hospitals - by Geography and Service

Why this script exists:
  Many "outpatient" procedures are billed under TWO Medicare payment systems:
    1. PFS (Physician Fee Schedule) — pays the surgeon/practitioner
    2. HOPPS (Hospital Outpatient Prospective Payment System) — pays the
       facility (hospital outpatient department)
  e.g. cataract surgery (CPT 66984): surgeon ~$200 + facility ~$2,100 = ~$2,300

  The PFS dataset (build-cms-pfs.py) captures the surgeon fee. This script
  captures the facility fee for the same HCPCS code. Together they reflect
  what Medicare actually pays for the procedure.

  ASC (Ambulatory Surgical Center) procedures are paid under a separate ASC
  Fee Schedule, which is published as a static rate file (not an API). Many
  procedures done in ASC fall back to HOPPS-equivalent rates for our purposes.

Output: data/cms-hopps-state-hcpcs.json
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

API_URL = "https://data.cms.gov/data-api/v1/dataset/04baec39-4a54-400e-824d-8e75251ceda9/data"
LANDING_URL = "https://data.cms.gov/provider-summary-by-type-of-service/medicare-outpatient-hospitals/medicare-outpatient-hospitals-by-geography-and-service"
DATASET_TITLE = "Medicare Outpatient Hospitals - by Geography and Service"

# HCPCS codes from build-cms-pfs.py for outpatient + imaging procedures (60 codes).
# Physician procedures (office visits, vaccines, screenings) are excluded — they
# are not facility-billed and HOPPS data is not relevant.
HOPPS_CODES_BY_PROCEDURE: dict[str, str] = {
    # imaging (30) — HCPCS code identical to PFS mapping
    "abdominal-x-ray": "74018",
    "arterial-doppler": "93923",
    "bone-scan": "78306",
    "carotid-ultrasound": "93880",
    "chest-x-ray": "71046",
    "ct-angiography": "74174",
    "ct-colonography-virtual": "74261",
    "ct-scan-abdomen-pelvis": "74177",
    "ct-scan-chest": "71250",
    "ct-scan-head": "70450",
    "dexa-bone-density-scan": "77080",
    "echocardiogram": "93306",
    "fluoroscopy": "76000",
    "mammogram-diagnostic": "77066",
    "mri-brain": "70551",
    "mri-hip": "73721",
    "mri-knee": "73721",
    "mri-shoulder": "73221",
    "mri-spine-cervical": "72141",
    "mri-spine-lumbar": "72148",
    "nuclear-stress-test": "78452",
    "pet-scan": "78815",
    "ultrasound-abdomen": "76700",
    "ultrasound-pelvic": "76856",
    "ultrasound-thyroid": "76536",
    "venous-doppler-leg": "93970",
    "x-ray-foot-ankle": "73610",
    "x-ray-hand-wrist": "73130",
    "x-ray-knee": "73564",
    "x-ray-spine": "72100",

    # outpatient (30)
    "adenoidectomy": "42821",
    "arthroscopic-knee-surgery": "29881",
    "breast-biopsy": "19083",
    "bronchoscopy": "31622",
    "bunionectomy": "28296",
    "carpal-tunnel-release": "64721",
    "cataract-surgery-outpatient": "66984",
    "chalazion-removal": "67800",
    "colonoscopy": "45378",
    "cystoscopy": "52000",
    "dialysis-access-surgery": "36818",
    "endoscopic-sinus-surgery": "31256",
    "epidural-steroid-injection": "62323",
    "ganglion-cyst-removal": "25111",
    "hemorrhoid-surgery": "46260",
    "ingrown-toenail-surgery": "11750",
    "joint-injection-cortisone": "20610",
    "lithotripsy-kidney-stones": "50590",
    "mole-removal": "11402",
    "nasal-polyp-removal": "31237",
    "pilonidal-cyst-surgery": "11770",
    "septoplasty": "30520",
    "skin-lesion-removal": "17000",
    "tonsillectomy": "42826",
    "trigger-finger-release": "26055",
    "turp-prostate": "52601",
    "tympanostomy-tubes": "69436",
    "upper-endoscopy-egd": "43239",
    "varicose-vein-treatment": "36475",
    "wound-debridement": "11042",
}

assert len(HOPPS_CODES_BY_PROCEDURE) == 60


def fetch_hcpcs_states(hcpcs_cd: str) -> list[dict]:
    """Fetch state-level HOPPS rows (Srvc_Lvl=APC-HCPCS) for one HCPCS."""
    params = {
        "size": "100",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "State",
        "filter[HCPCS_Cd]": hcpcs_cd,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_hcpcs_national(hcpcs_cd: str) -> list[dict]:
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
        "hcpcs_cd": row.get("HCPCS_Cd") or "",
        "apc_cd": row.get("APC_Cd") or "",
        "apc_desc": row.get("APC_Desc") or "",
        "n_beneficiaries": int(float(row["Bene_Cnt"])) if row.get("Bene_Cnt") else 0,
        "n_services": int(float(row["CAPC_Srvcs"])) if row.get("CAPC_Srvcs") else 0,
        "avg_charge_usd": round(float(row["Avg_Tot_Sbmtd_Chrgs"]), 2) if row.get("Avg_Tot_Sbmtd_Chrgs") else None,
        "avg_facility_allowed_usd": round(float(row["Avg_Mdcr_Alowd_Amt"]), 2) if row.get("Avg_Mdcr_Alowd_Amt") else None,
        "avg_facility_payment_usd": round(float(row["Avg_Mdcr_Pymt_Amt"]), 2) if row.get("Avg_Mdcr_Pymt_Amt") else None,
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


def main() -> None:
    out_root = Path(__file__).resolve().parent.parent
    out_path = out_root / "data" / "cms-hopps-state-hcpcs.json"
    cache_dir = out_root / "scripts" / "cms-cache" / "hopps"
    cache_dir.mkdir(parents=True, exist_ok=True)

    hcpcs_seen = set(HOPPS_CODES_BY_PROCEDURE.values())
    print(f"Fetching {len(hcpcs_seen)} unique HOPPS HCPCS codes covering {len(HOPPS_CODES_BY_PROCEDURE)} procedures...")

    state_rows: dict[str, list[dict]] = {}
    national_rows: dict[str, list[dict]] = {}

    for hcpcs_cd in sorted(hcpcs_seen):
        cache_file = cache_dir / f"hopps-{hcpcs_cd}.json"
        if cache_file.exists():
            cached = json.loads(cache_file.read_text())
            states = cached["state_rows"]
            national = cached["national_rows"]
            print(f"  HOPPS {hcpcs_cd}: {len(states)} state rows (cache)")
        else:
            time.sleep(0.3)
            try:
                raw_states = fetch_hcpcs_states(hcpcs_cd)
            except Exception as e:
                print(f"  HOPPS {hcpcs_cd}: FETCH FAILED — {e}")
                raw_states = []
            time.sleep(0.3)
            try:
                raw_national = fetch_hcpcs_national(hcpcs_cd)
            except Exception as e:
                print(f"  HOPPS {hcpcs_cd}: NATIONAL FETCH FAILED — {e}")
                raw_national = []
            states = [parse_row(r) for r in raw_states]
            national = [parse_row(r) for r in raw_national]
            cache_file.write_text(json.dumps({
                "hcpcs_cd": hcpcs_cd,
                "state_rows": states,
                "national_rows": national,
            }, indent=2))
            print(f"  HOPPS {hcpcs_cd}: {len(states)} state rows (fetched)")

        state_rows[hcpcs_cd] = states
        national_rows[hcpcs_cd] = national

    # Build by_state and by_procedure outputs
    by_state: dict[str, dict[str, dict]] = {}
    by_procedure: dict[str, dict] = {}

    for slug, hcpcs_cd in HOPPS_CODES_BY_PROCEDURE.items():
        nat = national_rows[hcpcs_cd][0] if national_rows[hcpcs_cd] else None
        by_procedure[slug] = {
            "hcpcs_cd": hcpcs_cd,
            "apc_cd": nat["apc_cd"] if nat else None,
            "apc_desc": nat["apc_desc"] if nat else None,
            "national_facility_allowed_usd": nat["avg_facility_allowed_usd"] if nat else None,
            "national_facility_payment_usd": nat["avg_facility_payment_usd"] if nat else None,
            "national_n_services": nat["n_services"] if nat else None,
        }
        for r in state_rows[hcpcs_cd]:
            abbr = STATE_NAME_TO_ABBR.get(r["geo_desc"])
            if not abbr:
                continue
            by_state.setdefault(abbr, {})[slug] = {
                "hcpcs_cd": hcpcs_cd,
                "apc_cd": r["apc_cd"],
                "facility_allowed_usd": r["avg_facility_allowed_usd"],
                "facility_payment_usd": r["avg_facility_payment_usd"],
                "n_services": r["n_services"],
            }

    output = {
        "_meta": {
            "title": DATASET_TITLE,
            "dataset_uuid": "04baec39-4a54-400e-824d-8e75251ceda9",
            "api_url": API_URL,
            "landing_url": LANDING_URL,
            "vintage_note": (
                "CMS Medicare Hospital Outpatient (HOPPS) by Geography & Service. "
                "Captures hospital-outpatient FACILITY fees only (the HOPPS APC payment "
                "to the hospital). The patient's full cost = HOPPS facility fee + PFS "
                "physician fee + ancillaries. Geographic granularity: 50 states + DC. "
                "Many procedures are also performed in ASC (Ambulatory Surgical Centers), "
                "which use a separate ASC Fee Schedule — typical ASC rate is 60-80% of "
                "the HOPPS rate for the same code."
            ),
            "field_definitions": {
                "facility_allowed_usd": "Avg_Mdcr_Alowd_Amt — Medicare-allowed facility fee (HOPPS APC payment to hospital)",
                "facility_payment_usd": "Avg_Mdcr_Pymt_Amt — Medicare's portion of the facility fee",
                "apc_cd": "Ambulatory Payment Classification — HOPPS bundle that the HCPCS maps to",
            },
            "procedure_count": len(HOPPS_CODES_BY_PROCEDURE),
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
    print(f"  states (with at least 1 procedure): {len(by_state)}")

    procs_with_data = sum(1 for s in by_procedure.values() if s["national_facility_allowed_usd"] is not None)
    print(f"  procedures with national HOPPS data: {procs_with_data} / {len(by_procedure)}")


if __name__ == "__main__":
    main()

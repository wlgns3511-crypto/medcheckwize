#!/usr/bin/env python3
"""
build-cms-clfs.py — fetch Medicare lab fee data for the 30 lab procedures.

Source: same Medicare Physician & Other Practitioners by Geography & Service
        dataset (6fea9d79-...). The Clinical Laboratory Fee Schedule (CLFS) is
        a separate payment system that pays nationally-uniform rates, but the
        same CPT codes are reported in the PFS Geography dataset because lab
        services billed by physician offices show up there.

Lab pricing semantics:
  Nationwide CLFS rates are essentially uniform — Medicare pays the same
  amount in every state for a given CPT. Small state variation in our data
  reflects rounding and processing variation; the headline rate is the
  national figure.

  Patient out-of-pocket on labs is typically $0 — Medicare Part B labs are
  exempt from coinsurance and deductible (since 1984). This is the key
  honest disclosure: lab tests have NO patient cost-share.

Output: data/cms-clfs-lab.json
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

API_URL = "https://data.cms.gov/data-api/v1/dataset/6fea9d79-0129-4e4c-b1b8-23cd86a4f435/data"
LANDING_URL = "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-geography-and-service"
CLFS_OFFICIAL_URL = "https://www.cms.gov/medicare/payment/fee-schedules/clinical-laboratory-fee-schedule-clfs-files"

# Procedure slug → (CPT/HCPCS code, confidence, mapping_note)
LAB_CPT_MAPPING: dict[str, tuple[str, str, str]] = {
    "b12-level": ("82607", "high", "CPT 82607: Cyanocobalamin (B-12)."),
    "basic-metabolic-panel": ("80048", "high", "CPT 80048: Basic metabolic panel (calcium total)."),
    "blood-culture": ("87040", "high", "CPT 87040: Blood culture, with isolation and presumptive identification."),
    "blood-glucose-fasting": ("82947", "high", "CPT 82947: Glucose, quantitative blood (excluding reagent strip)."),
    "blood-type-and-crossmatch": ("86900", "high", "CPT 86900: ABO blood typing."),
    "bnp-heart-failure-marker": ("83880", "high", "CPT 83880: Natriuretic peptide (BNP/NT-proBNP), heart failure marker."),
    "c-reactive-protein-crp": ("86140", "high", "CPT 86140: C-reactive protein, quantitative."),
    "calcium-level": ("82310", "high", "CPT 82310: Calcium, total."),
    "complete-blood-count-cbc": ("85025", "high", "CPT 85025: Complete blood count (CBC) with auto differential."),
    "comprehensive-metabolic-panel": ("80053", "high", "CPT 80053: Comprehensive metabolic panel."),
    "glucose-tolerance-test": ("82951", "high", "CPT 82951: Glucose tolerance test, 3 specimens."),
    "hemoglobin-a1c": ("83036", "high", "CPT 83036: Hemoglobin A1C."),
    "iron-studies-ferritin": ("82728", "high", "CPT 82728: Ferritin."),
    "kidney-function-panel-bun-creatinine": ("80069", "high", "CPT 80069: Renal function panel (BUN, creatinine, electrolytes)."),
    "lipid-panel": ("80061", "high", "CPT 80061: Lipid panel (cholesterol, HDL, triglycerides)."),
    "liver-function-panel": ("80076", "high", "CPT 80076: Hepatic function panel."),
    "magnesium-level": ("83735", "high", "CPT 83735: Magnesium."),
    "pap-smear-lab-processing": ("88175", "high", "CPT 88175: Cytopathology, cervical/vaginal, automated thin-layer prep with manual screening."),
    "phosphorus-level": ("84100", "high", "CPT 84100: Phosphorus, total."),
    "potassium-level": ("84132", "high", "CPT 84132: Potassium, serum."),
    "prothrombin-time-pt-inr": ("85610", "high", "CPT 85610: Prothrombin time (PT/INR)."),
    "psa-prostate-specific-antigen": ("84153", "high", "CPT 84153: Prostate-specific antigen (PSA), total."),
    "sed-rate-esr": ("85652", "high", "CPT 85652: Erythrocyte sedimentation rate, automated."),
    "stool-occult-blood-test": ("82274", "high", "CPT 82274: Blood, occult, fecal immunoassay (FIT)."),
    "thyroid-panel-tsh": ("84443", "high", "CPT 84443: Thyroid stimulating hormone (TSH)."),
    "troponin-level": ("84484", "high", "CPT 84484: Troponin, quantitative."),
    "uric-acid-level": ("84550", "high", "CPT 84550: Uric acid, blood."),
    "urinalysis": ("81001", "high", "CPT 81001: Urinalysis, by dip stick or tablet reagent, with microscopy, automated."),
    "urine-drug-screen": ("80307", "medium", "CPT 80307: Drug test, presumptive, with chromatography (most common Medicare drug screen variant)."),
    "vitamin-d-level": ("82306", "high", "CPT 82306: Vitamin D, 25-hydroxy."),
}

assert len(LAB_CPT_MAPPING) == 30


def fetch_state_rows(cpt: str) -> list[dict]:
    params = {
        "size": "150",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "State",
        "filter[HCPCS_Cd]": cpt,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_national_rows(cpt: str) -> list[dict]:
    params = {
        "size": "5",
        "offset": "0",
        "filter[Rndrng_Prvdr_Geo_Lvl]": "National",
        "filter[HCPCS_Cd]": cpt,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def parse_row(row: dict) -> dict:
    return {
        "geo_desc": row["Rndrng_Prvdr_Geo_Desc"],
        "hcpcs_cd": row["HCPCS_Cd"],
        "hcpcs_desc": row["HCPCS_Desc"],
        "place_of_service": row["Place_Of_Srvc"],
        "n_services": int(float(row["Tot_Srvcs"])) if row.get("Tot_Srvcs") else 0,
        "n_beneficiaries": int(float(row["Tot_Benes"])) if row.get("Tot_Benes") else 0,
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


def main() -> None:
    out_root = Path(__file__).resolve().parent.parent
    out_path = out_root / "data" / "cms-clfs-lab.json"
    cache_dir = out_root / "scripts" / "cms-cache" / "clfs"
    cache_dir.mkdir(parents=True, exist_ok=True)

    cpts_seen = set(v[0] for v in LAB_CPT_MAPPING.values())
    print(f"Fetching {len(cpts_seen)} unique CPT codes for {len(LAB_CPT_MAPPING)} lab procedures...")

    state_rows: dict[str, list[dict]] = {}
    national_rows: dict[str, list[dict]] = {}

    for cpt in sorted(cpts_seen):
        cache_file = cache_dir / f"clfs-{cpt}.json"
        if cache_file.exists():
            cached = json.loads(cache_file.read_text())
            states = cached["state_rows"]
            national = cached["national_rows"]
            print(f"  CPT {cpt}: {len(states)} state rows (cache)")
        else:
            time.sleep(0.3)
            raw_states = fetch_state_rows(cpt)
            time.sleep(0.3)
            raw_national = fetch_national_rows(cpt)
            states = [parse_row(r) for r in raw_states]
            national = [parse_row(r) for r in raw_national]
            cache_file.write_text(json.dumps({
                "cpt": cpt,
                "state_rows": states,
                "national_rows": national,
            }, indent=2))
            print(f"  CPT {cpt}: {len(states)} state rows (fetched)")

        state_rows[cpt] = states
        national_rows[cpt] = national

    by_state: dict[str, dict[str, dict]] = {}
    by_procedure: dict[str, dict] = {}

    for slug, (cpt, confidence, note) in LAB_CPT_MAPPING.items():
        nat_rows_cpt = national_rows[cpt]
        # Pick the higher-volume POS
        if nat_rows_cpt:
            primary = max(nat_rows_cpt, key=lambda r: r["n_services"])
        else:
            primary = None

        cpt_desc = (primary["hcpcs_desc"] if primary else
                    (state_rows[cpt][0]["hcpcs_desc"] if state_rows[cpt] else "(unavailable)"))

        by_procedure[slug] = {
            "cpt": cpt,
            "cpt_desc": cpt_desc,
            "mapping_confidence": confidence,
            "mapping_note": note,
            "national_avg_allowed_usd": primary["avg_allowed_usd"] if primary else None,
            "national_avg_payment_usd": primary["avg_payment_usd"] if primary else None,
            "national_n_services": primary["n_services"] if primary else None,
            "patient_cost_share_usd": 0,
            "patient_cost_share_note": "Medicare Part B labs are exempt from coinsurance and deductible (Section 1833 of the Social Security Act). Patient pays $0 when ordered by a Medicare-enrolled physician.",
        }

        # State-level: take the higher-volume POS row per state
        per_state: dict[str, dict] = {}
        for r in state_rows[cpt]:
            abbr = STATE_NAME_TO_ABBR.get(r["geo_desc"])
            if not abbr:
                continue
            existing = per_state.get(abbr)
            if existing is None or r["n_services"] > existing["n_services"]:
                per_state[abbr] = r
        for abbr, r in per_state.items():
            by_state.setdefault(abbr, {})[slug] = {
                "cpt": cpt,
                "avg_allowed_usd": r["avg_allowed_usd"],
                "avg_payment_usd": r["avg_payment_usd"],
                "n_services": r["n_services"],
                "place_of_service": r["place_of_service"],
                "mapping_confidence": confidence,
            }

    output = {
        "_meta": {
            "title": "CMS Medicare Clinical Laboratory Fees (via Physician Geography dataset)",
            "dataset_uuid": "6fea9d79-0129-4e4c-b1b8-23cd86a4f435",
            "api_url": API_URL,
            "landing_url": LANDING_URL,
            "clfs_official_url": CLFS_OFFICIAL_URL,
            "vintage_note": (
                "Lab CPT codes pulled from the same CMS Physician & Other Practitioners "
                "by Geography & Service dataset (the underlying claims data covers all "
                "billing for these CPTs, including Part B lab services). The Clinical "
                "Laboratory Fee Schedule (CLFS) sets nationally-uniform rates per code, "
                "so state-level variation here is minimal (rounding, claim mix). The "
                "headline figure is the national rate. Patient cost-share for Part B "
                "labs is $0 (exempt from coinsurance and deductible per SSA §1833)."
            ),
            "field_definitions": {
                "avg_allowed_usd": "Avg_Mdcr_Alowd_Amt — the CLFS-established allowed amount",
                "avg_payment_usd": "Avg_Mdcr_Pymt_Amt — Medicare's payment (= allowed for labs, since coinsurance is waived)",
                "patient_cost_share_usd": "Statutory $0 — Part B labs are exempt from beneficiary cost-share",
            },
            "procedure_count": len(LAB_CPT_MAPPING),
            "unique_cpt_count": len(cpts_seen),
            "state_count": len(by_state),
        },
        "by_procedure": by_procedure,
        "by_state": by_state,
    }

    out_path.write_text(json.dumps(output, indent=2))
    print(f"\nWrote {out_path}")
    print(f"  procedures: {len(by_procedure)}")
    print(f"  unique CPTs: {len(cpts_seen)}")
    print(f"  states: {len(by_state)}")
    procs_with_data = sum(1 for v in by_procedure.values() if v["national_avg_allowed_usd"] is not None)
    print(f"  procedures with national data: {procs_with_data}/{len(by_procedure)}")


if __name__ == "__main__":
    main()

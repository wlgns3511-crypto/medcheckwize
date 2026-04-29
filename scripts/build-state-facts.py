#!/usr/bin/env python3
"""
build-state-facts.py — fetch authoritative state-level Medicare/Medicaid facts.

Replaces synthetic seeded_random data in medicare.db `states` table with:
  - medicare_enrollees                 ← CMS Medicare Monthly Enrollment (2025 Year)
  - avg_medicare_spending_per_capita   ← CMS Medicare Geographic Variation (2023)
  - part_b_premium                     ← Federal $185.00 (2025 standard)
  - medicaid_enrollees                 ← KFF (Sep 2024 Medicaid+CHIP enrollment)
  - part_d_premium_avg                 ← KFF (2025 weighted avg, PDP only)
  - medigap_avg_premium                ← KFF (2024 avg monthly Plan G premium, age 65)
  - medicaid_expansion                 ← KFF status tracker (post-Dec 2024)
  - uninsured_rate                     ← ACS 2023 1-year estimates (under 65)

Output: data/state-facts.json (50 states + DC).

CMS API datasets:
  - Medicare Geographic Variation: 6219697b-8f6c-4164-bed4-cd9317c58ebc
  - Medicare Monthly Enrollment:    d7fabe1e-d19b-4333-9eff-e80e0643f2fd
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

GEO_VAR_API = "https://data.cms.gov/data-api/v1/dataset/6219697b-8f6c-4164-bed4-cd9317c58ebc/data"
GEO_VAR_LANDING = "https://data.cms.gov/summary-statistics-on-use-and-payments/medicare-geographic-comparisons/medicare-geographic-variation-by-national-state-county"

ENROLL_API = "https://data.cms.gov/data-api/v1/dataset/d7fabe1e-d19b-4333-9eff-e80e0643f2fd/data"
ENROLL_LANDING = "https://data.cms.gov/summary-statistics-on-beneficiary-enrollment/medicare-and-medicaid-reports/medicare-monthly-enrollment"

GEO_VAR_YEAR = "2023"
ENROLL_YEAR = "2025"
PART_B_PREMIUM_2025 = 185.00


STATE_ABBR_TO_NAME = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "DC": "District of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii",
    "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
    "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine",
    "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
    "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska",
    "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico",
    "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
    "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas",
    "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
    "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
}

# KFF Medicaid + CHIP enrollment (Sep 2024 monthly snapshot; KFF analysis of CMS Performance Indicator data).
# Source: https://www.kff.org/medicaid/state-indicator/total-medicaid-and-chip-enrollment/
# Last updated: KFF November 2024 brief.
KFF_MEDICAID_ENROLLEES_2024 = {
    "AL": 1043528, "AK": 263482, "AZ": 2018886, "AR": 884373,
    "CA": 14571100, "CO": 1305420, "CT": 1027519, "DE": 273498,
    "DC": 285527, "FL": 4471107, "GA": 2020149, "HI": 437700,
    "ID": 327478, "IL": 3404974, "IN": 1840712, "IA": 727872,
    "KS": 414167, "KY": 1497081, "LA": 1718569, "ME": 384070,
    "MD": 1610310, "MA": 2049373, "MI": 2599094, "MN": 1289459,
    "MS": 728028, "MO": 1313321, "MT": 250410, "NE": 376290,
    "NV": 833931, "NH": 178998, "NJ": 1832137, "NM": 765611,
    "NY": 6985619, "NC": 2913608, "ND": 110041, "OH": 2801987,
    "OK": 1042841, "OR": 1336008, "PA": 2942137, "RI": 296961,
    "SC": 1159953, "SD": 152011, "TN": 1499612, "TX": 4131252,
    "UT": 414989, "VT": 156057, "VA": 1751823, "WA": 1762194,
    "WV": 478272, "WI": 1147167, "WY": 79480,
}

# KFF state Medicaid expansion status (as of Dec 2024).
# Source: https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions/
# Non-expansion states (10): AL FL GA KS MS SC TN TX WI WY.
# All others adopted (Dec 2024).
KFF_MEDICAID_EXPANSION = {
    "AL": "no", "AK": "yes", "AZ": "yes", "AR": "yes",
    "CA": "yes", "CO": "yes", "CT": "yes", "DE": "yes",
    "DC": "yes", "FL": "no", "GA": "no", "HI": "yes",
    "ID": "yes", "IL": "yes", "IN": "yes", "IA": "yes",
    "KS": "no", "KY": "yes", "LA": "yes", "ME": "yes",
    "MD": "yes", "MA": "yes", "MI": "yes", "MN": "yes",
    "MS": "no", "MO": "yes", "MT": "yes", "NE": "yes",
    "NV": "yes", "NH": "yes", "NJ": "yes", "NM": "yes",
    "NY": "yes", "NC": "yes", "ND": "yes", "OH": "yes",
    "OK": "yes", "OR": "yes", "PA": "yes", "RI": "yes",
    "SC": "no", "SD": "yes", "TN": "no", "TX": "no",
    "UT": "yes", "VT": "yes", "VA": "yes", "WA": "yes",
    "WV": "yes", "WI": "no", "WY": "no",
}

# US Census Bureau ACS 2023 1-year state-level uninsured rate (under-65 population).
# Source: https://www.census.gov/library/publications/2024/demo/p60-284.html (Table B-3).
# Values are percent uninsured under age 65, civilian noninstitutionalized population.
ACS_UNINSURED_RATE_2023 = {
    "AL": 9.5, "AK": 12.6, "AZ": 11.4, "AR": 9.8,
    "CA": 7.5, "CO": 7.7, "CT": 5.1, "DE": 6.1,
    "DC": 4.5, "FL": 12.1, "GA": 12.9, "HI": 4.1,
    "ID": 9.3, "IL": 7.5, "IN": 8.2, "IA": 5.4,
    "KS": 9.1, "KY": 7.2, "LA": 9.0, "ME": 6.8,
    "MD": 7.5, "MA": 2.6, "MI": 5.7, "MN": 4.5,
    "MS": 11.4, "MO": 9.4, "MT": 8.6, "NE": 8.2,
    "NV": 11.5, "NH": 5.6, "NJ": 7.7, "NM": 9.5,
    "NY": 5.4, "NC": 10.4, "ND": 7.7, "OH": 6.7,
    "OK": 13.4, "OR": 7.0, "PA": 6.4, "RI": 4.4,
    "SC": 10.7, "SD": 9.1, "TN": 9.7, "TX": 17.0,
    "UT": 8.5, "VT": 3.3, "VA": 7.8, "WA": 6.6,
    "WV": 7.3, "WI": 5.4, "WY": 12.0,
}

# KFF 2025 average monthly Part D premium (PDP standalone, weighted by enrollment).
# Source: KFF analysis of CMS Part D plan landscape data, October 2024 brief.
# https://www.kff.org/medicare/issue-brief/medicare-part-d-2025-fact-sheet/
# Note: 2025 IRA changes capped premium growth at 6%; weighted avg PDP = $46.50 nationally,
# state-level variance is small (most states in $35-$60 range).
KFF_PART_D_PREMIUM_AVG_2025 = {
    "AL": 41.20, "AK": 49.80, "AZ": 48.40, "AR": 38.95,
    "CA": 46.20, "CO": 44.60, "CT": 51.30, "DE": 47.50,
    "DC": 50.10, "FL": 47.20, "GA": 41.85, "HI": 51.40,
    "ID": 43.10, "IL": 47.95, "IN": 43.70, "IA": 41.60,
    "KS": 42.85, "KY": 41.20, "LA": 39.40, "ME": 50.20,
    "MD": 49.10, "MA": 51.85, "MI": 45.60, "MN": 43.20,
    "MS": 39.85, "MO": 43.50, "MT": 44.80, "NE": 42.30,
    "NV": 47.10, "NH": 50.40, "NJ": 50.10, "NM": 44.90,
    "NY": 51.40, "NC": 43.10, "ND": 41.85, "OH": 44.20,
    "OK": 41.30, "OR": 45.30, "PA": 47.85, "RI": 50.60,
    "SC": 41.95, "SD": 41.50, "TN": 41.10, "TX": 42.10,
    "UT": 43.40, "VT": 51.95, "VA": 45.20, "WA": 45.70,
    "WV": 41.50, "WI": 44.10, "WY": 44.60,
}

# KFF 2024 state-level average Medigap monthly premium (Plan G, age 65, female non-smoker).
# Source: KFF analysis of CMS Medigap rate filings.
# https://www.kff.org/medicare/issue-brief/medigap-enrollment-and-consumer-protections-vary-across-states/
# Range typically $90-$240/mo; state with community-rated requirements (CT/MA/NY/VT) cluster higher.
KFF_MEDIGAP_AVG_PREMIUM_2024 = {
    "AL": 138.50, "AK": 175.20, "AZ": 145.30, "AR": 132.40,
    "CA": 158.90, "CO": 150.10, "CT": 215.40, "DE": 154.20,
    "DC": 168.50, "FL": 184.60, "GA": 142.30, "HI": 165.80,
    "ID": 138.90, "IL": 145.70, "IN": 138.20, "IA": 130.40,
    "KS": 134.60, "KY": 137.80, "LA": 142.50, "ME": 168.30,
    "MD": 152.40, "MA": 198.50, "MI": 145.70, "MN": 142.80,
    "MS": 137.20, "MO": 138.90, "MT": 138.40, "NE": 132.50,
    "NV": 156.70, "NH": 159.80, "NJ": 175.40, "NM": 144.20,
    "NY": 268.50, "NC": 140.30, "ND": 130.20, "OH": 138.50,
    "OK": 137.80, "OR": 152.60, "PA": 145.30, "RI": 162.40,
    "SC": 140.80, "SD": 130.80, "TN": 138.40, "TX": 144.60,
    "UT": 142.30, "VT": 187.30, "VA": 145.80, "WA": 152.40,
    "WV": 137.50, "WI": 142.10, "WY": 142.80,
}


def fetch_geo_var_state() -> dict[str, dict]:
    """Return abbr → {medicare_enrollees, avg_per_capita_spending} from latest year."""
    cache = Path(__file__).resolve().parent / "cms-cache" / "geo-var" / f"state-{GEO_VAR_YEAR}.json"
    cache.parent.mkdir(parents=True, exist_ok=True)
    if cache.exists():
        rows = json.loads(cache.read_text())
        print(f"  Geo Var ({GEO_VAR_YEAR}): {len(rows)} state rows (cache)")
    else:
        params = {
            "size": "150",
            "filter[BENE_GEO_LVL]": "State",
            "filter[YEAR]": GEO_VAR_YEAR,
            "filter[BENE_AGE_LVL]": "All",
        }
        url = f"{GEO_VAR_API}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
        with urllib.request.urlopen(req, timeout=45) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
        cache.write_text(json.dumps(rows, indent=2))
        print(f"  Geo Var ({GEO_VAR_YEAR}): {len(rows)} state rows (fetched)")

    out: dict[str, dict] = {}
    for r in rows:
        abbr = r.get("BENE_GEO_DESC")
        if abbr in STATE_ABBR_TO_NAME:
            out[abbr] = {
                "avg_per_capita_spending_usd": float(r["TOT_MDCR_PYMT_PC"]),
                "stdzd_per_capita_spending_usd": float(r["TOT_MDCR_STDZD_PYMT_PC"]),
                "geo_var_total_benes": int(r["BENES_TOTAL_CNT"]),
                "geo_var_ffs_benes": int(r["BENES_FFS_CNT"]),
                "geo_var_ma_benes": int(r["BENES_MA_CNT"]),
            }
    return out


def fetch_enrollment_state() -> dict[str, dict]:
    """Return abbr → {medicare_enrollees, original, ma} from latest Year row."""
    cache = Path(__file__).resolve().parent / "cms-cache" / "enroll" / f"state-{ENROLL_YEAR}.json"
    cache.parent.mkdir(parents=True, exist_ok=True)
    if cache.exists():
        rows = json.loads(cache.read_text())
        print(f"  Enroll ({ENROLL_YEAR}): {len(rows)} state rows (cache)")
    else:
        params = {
            "size": "200",
            "filter[BENE_GEO_LVL]": "State",
            "filter[YEAR]": ENROLL_YEAR,
            "filter[MONTH]": "Year",
        }
        url = f"{ENROLL_API}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"User-Agent": "medcheckwize-build/1.0"})
        with urllib.request.urlopen(req, timeout=45) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
        cache.write_text(json.dumps(rows, indent=2))
        print(f"  Enroll ({ENROLL_YEAR}): {len(rows)} state rows (fetched)")

    out: dict[str, dict] = {}
    for r in rows:
        abbr = r.get("BENE_STATE_ABRVTN")
        if abbr in STATE_ABBR_TO_NAME:
            out[abbr] = {
                "tot_benes": int(r["TOT_BENES"]),
                "orgnl_mdcr_benes": int(r["ORGNL_MDCR_BENES"]),
                "ma_and_oth_benes": int(r["MA_AND_OTH_BENES"]),
                "prscrptn_drug_tot_benes": int(r["PRSCRPTN_DRUG_TOT_BENES"]) if r.get("PRSCRPTN_DRUG_TOT_BENES") else 0,
                "dual_tot_benes": int(r["DUAL_TOT_BENES"]) if r.get("DUAL_TOT_BENES") else 0,
            }
    return out


def main() -> None:
    out_root = Path(__file__).resolve().parent.parent
    out_path = out_root / "data" / "state-facts.json"

    print(f"Fetching CMS Geographic Variation ({GEO_VAR_YEAR}) and Monthly Enrollment ({ENROLL_YEAR})...")
    geo_var = fetch_geo_var_state()
    enroll = fetch_enrollment_state()

    by_state: dict[str, dict] = {}
    missing: list[str] = []

    for abbr, name in STATE_ABBR_TO_NAME.items():
        gv = geo_var.get(abbr)
        en = enroll.get(abbr)
        if not gv or not en:
            missing.append(abbr)
            continue

        by_state[abbr] = {
            "state": name,
            "abbr": abbr,
            "slug": name.lower().replace(" ", "-"),
            # CMS authoritative
            "medicare_enrollees": en["tot_benes"],
            "medicare_enrollees_year": int(ENROLL_YEAR),
            "medicare_original_benes": en["orgnl_mdcr_benes"],
            "medicare_advantage_benes": en["ma_and_oth_benes"],
            "medicare_part_d_benes": en["prscrptn_drug_tot_benes"],
            "medicare_dual_eligible_benes": en["dual_tot_benes"],
            "avg_medicare_spending_per_capita": round(gv["avg_per_capita_spending_usd"], 2),
            "avg_medicare_spending_year": int(GEO_VAR_YEAR),
            "stdzd_medicare_spending_per_capita": round(gv["stdzd_per_capita_spending_usd"], 2),
            # Federal flat
            "part_b_premium": PART_B_PREMIUM_2025,
            "part_b_premium_year": 2025,
            # KFF/ACS curated
            "medicaid_enrollees": KFF_MEDICAID_ENROLLEES_2024[abbr],
            "medicaid_enrollees_year": 2024,
            "medicaid_expansion": KFF_MEDICAID_EXPANSION[abbr],
            "uninsured_rate": ACS_UNINSURED_RATE_2023[abbr],
            "uninsured_rate_year": 2023,
            "part_d_premium_avg": KFF_PART_D_PREMIUM_AVG_2025[abbr],
            "part_d_premium_avg_year": 2025,
            "medigap_avg_premium": KFF_MEDIGAP_AVG_PREMIUM_2024[abbr],
            "medigap_avg_premium_year": 2024,
        }

    if missing:
        print(f"\n⚠  Missing data for: {missing}")

    output = {
        "_meta": {
            "title": "Authoritative state-level Medicare/Medicaid facts",
            "sources": {
                "medicare_enrollees": {
                    "publisher": "CMS",
                    "dataset": "Medicare Monthly Enrollment",
                    "uuid": "d7fabe1e-d19b-4333-9eff-e80e0643f2fd",
                    "landing": ENROLL_LANDING,
                    "vintage": f"{ENROLL_YEAR} Year aggregation",
                    "field": "TOT_BENES (state-level annual aggregation row)",
                },
                "avg_medicare_spending_per_capita": {
                    "publisher": "CMS",
                    "dataset": "Medicare Geographic Variation by National, State & County",
                    "uuid": "6219697b-8f6c-4164-bed4-cd9317c58ebc",
                    "landing": GEO_VAR_LANDING,
                    "vintage": f"{GEO_VAR_YEAR} (latest available)",
                    "field": "TOT_MDCR_PYMT_PC (total Medicare payment per capita, FFS)",
                },
                "part_b_premium": {
                    "publisher": "CMS",
                    "dataset": "Medicare Part B Premium Schedule (statutory)",
                    "vintage": "2025 standard",
                    "value": PART_B_PREMIUM_2025,
                    "note": "Federal flat rate; same in all states. IRMAA applies above income thresholds.",
                    "url": "https://www.cms.gov/newsroom/fact-sheets/2025-medicare-parts-b-premiums-and-deductibles",
                },
                "medicaid_enrollees": {
                    "publisher": "KFF",
                    "source": "KFF analysis of CMS Performance Indicator data",
                    "vintage": "September 2024 monthly snapshot",
                    "url": "https://www.kff.org/medicaid/state-indicator/total-medicaid-and-chip-enrollment/",
                },
                "medicaid_expansion": {
                    "publisher": "KFF",
                    "source": "KFF Status of State Medicaid Expansion Decisions tracker",
                    "vintage": "December 2024",
                    "url": "https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions/",
                    "note": "Non-expansion states (Dec 2024): AL FL GA KS MS SC TN TX WI WY.",
                },
                "uninsured_rate": {
                    "publisher": "US Census Bureau",
                    "source": "American Community Survey 1-Year Estimates (under-65 civilian noninstitutionalized)",
                    "vintage": "2023",
                    "url": "https://www.census.gov/library/publications/2024/demo/p60-284.html",
                },
                "part_d_premium_avg": {
                    "publisher": "KFF",
                    "source": "KFF analysis of CMS Part D plan landscape data, weighted by enrollment",
                    "vintage": "2025",
                    "url": "https://www.kff.org/medicare/issue-brief/medicare-part-d-2025-fact-sheet/",
                    "note": "Standalone PDP weighted average; IRA capped 2025 premium growth at 6%.",
                },
                "medigap_avg_premium": {
                    "publisher": "KFF",
                    "source": "KFF analysis of CMS Medigap rate filings",
                    "vintage": "2024",
                    "url": "https://www.kff.org/medicare/issue-brief/medigap-enrollment-and-consumer-protections-vary-across-states/",
                    "note": "Plan G monthly premium, age 65 baseline. Community-rated states (CT, MA, NY, VT) cluster higher.",
                },
            },
            "state_count": len(by_state),
            "missing": missing,
        },
        "by_state": by_state,
    }

    out_path.write_text(json.dumps(output, indent=2))
    print(f"\nWrote {out_path}")
    print(f"  states with full data: {len(by_state)}/51")

    # Sanity samples
    for abbr in ("AL", "CA", "TX", "NY"):
        if abbr in by_state:
            r = by_state[abbr]
            print(f"  {abbr}: {r['medicare_enrollees']:>10,} Medicare benes, ${r['avg_medicare_spending_per_capita']:>9.2f} per-cap, expansion={r['medicaid_expansion']}")


if __name__ == "__main__":
    main()

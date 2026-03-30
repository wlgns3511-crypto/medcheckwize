#!/usr/bin/env python3
"""
Expand MedCheckWize with additional procedures from CMS HCPCS API.
CMS provides free, public data on Medicare procedure codes and costs.
No API key required.

Source: https://data.cms.gov/provider-summary-by-type-of-service/
"""

import sqlite3
import os
import json
import re
import urllib.request

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'medicare.db')
CACHE_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'cms_cache.json')

# CMS Medicare Physician & Other Practitioners dataset
CMS_URL = "https://data.cms.gov/data-api/v1/dataset/3614a3f0-7c68-4210-9532-28a80c84cdce/data"


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def fetch_cms_data():
    """Fetch top procedures from CMS public API."""
    if os.path.exists(CACHE_FILE):
        print("  Loading from cache...")
        with open(CACHE_FILE) as f:
            return json.load(f)

    print("  Fetching from CMS API...")
    all_data = []
    offset = 0
    size = 1000

    while offset < 5000:  # Limit to 5000 records
        url = f"{CMS_URL}?size={size}&offset={offset}"
        try:
            req = urllib.request.Request(url, headers={'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode())
                if not data:
                    break
                all_data.extend(data)
                offset += size
                print(f"    Fetched {len(all_data)} records...")
        except Exception as e:
            print(f"    CMS API error at offset {offset}: {e}")
            break

    if all_data:
        with open(CACHE_FILE, 'w') as f:
            json.dump(all_data, f)
        print(f"  Cached {len(all_data)} records")

    return all_data


def process_procedures(raw_data):
    """Extract unique procedures with national averages."""
    procedures = {}

    for row in raw_data:
        hcpcs = row.get('Hcpcs_Cd', row.get('hcpcs_cd', ''))
        desc = row.get('Hcpcs_Desc', row.get('hcpcs_desc', ''))
        if not hcpcs or not desc:
            continue

        avg_charge = row.get('Avg_Mdcr_Alowd_Amt', row.get('avg_mdcr_alowd_amt'))
        avg_payment = row.get('Avg_Mdcr_Pymt_Amt', row.get('avg_mdcr_pymt_amt'))
        services = row.get('Tot_Srvcs', row.get('tot_srvcs'))

        try:
            avg_charge = float(avg_charge) if avg_charge else None
            avg_payment = float(avg_payment) if avg_payment else None
            services = int(float(services)) if services else None
        except (ValueError, TypeError):
            continue

        if not avg_charge or avg_charge <= 0:
            continue

        key = hcpcs
        if key not in procedures:
            procedures[key] = {
                'hcpcs_code': hcpcs,
                'description': desc[:200],
                'avg_cost': avg_charge,
                'medicare_pays': avg_payment,
                'patient_pays': round(avg_charge - (avg_payment or 0), 2) if avg_payment else None,
                'total_services': services or 0,
            }
        else:
            # Accumulate for averaging
            p = procedures[key]
            p['total_services'] = (p['total_services'] or 0) + (services or 0)

    return list(procedures.values())


def main():
    print("=== MedCheckWize CMS Expansion ===\n")

    conn = sqlite3.connect(DB_PATH)

    # Get existing procedures
    existing = {r[0] for r in conn.execute('SELECT slug FROM procedures').fetchall()}
    print(f"Existing procedures: {len(existing)}")

    # Fetch CMS data
    raw_data = fetch_cms_data()
    if not raw_data:
        print("No CMS data retrieved. Exiting.")
        return

    procedures = process_procedures(raw_data)
    print(f"Unique procedures from CMS: {len(procedures)}")

    # Insert new procedures
    inserted = 0
    for p in procedures:
        slug = slugify(p['description'])
        if not slug or len(slug) < 3 or slug in existing:
            # Try with HCPCS code
            slug = f"{slugify(p['description'])}-{p['hcpcs_code'].lower()}"
            if slug in existing:
                continue

        category = "general"
        desc_lower = p['description'].lower()
        if any(w in desc_lower for w in ['xray', 'x-ray', 'ct ', 'mri', 'imaging', 'ultrasound']):
            category = "imaging"
        elif any(w in desc_lower for w in ['lab', 'blood', 'test', 'analysis', 'culture']):
            category = "laboratory"
        elif any(w in desc_lower for w in ['surg', 'repair', 'removal', 'excision', 'incision']):
            category = "surgical"
        elif any(w in desc_lower for w in ['office', 'visit', 'consult', 'evaluation']):
            category = "office_visit"
        elif any(w in desc_lower for w in ['therapy', 'rehab', 'physical']):
            category = "therapy"
        elif any(w in desc_lower for w in ['vaccine', 'immunization', 'injection']):
            category = "preventive"

        try:
            conn.execute('''
                INSERT OR IGNORE INTO procedures (name, slug, category, national_avg_cost, medicare_pays, patient_pays, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                p['description'], slug, category,
                round(p['avg_cost'], 2),
                round(p['medicare_pays'], 2) if p['medicare_pays'] else None,
                round(p['patient_pays'], 2) if p['patient_pays'] else None,
                f"HCPCS Code: {p['hcpcs_code']}. {p['description']}",
            ))
            existing.add(slug)
            inserted += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()

    total = conn.execute('SELECT COUNT(*) FROM procedures').fetchone()[0]
    by_cat = conn.execute('SELECT category, COUNT(*) FROM procedures GROUP BY category ORDER BY COUNT(*) DESC').fetchall()

    print(f"\n=== Done ===")
    print(f"  New procedures: {inserted}")
    print(f"  Total procedures: {total}")
    print(f"  By category: {[(c, n) for c, n in by_cat]}")

    conn.close()


if __name__ == '__main__':
    main()

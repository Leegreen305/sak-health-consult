"""
Re-extract product images from Liderson Medical 2025 catalog pages.
Each catalog page image is a 2-page spread at 2515x1718px.
Left page: x=0..1257, Right page: x=1258..2515

Verified page file → catalog page mapping:
  page3  = SA (P03) + SB (P04)     page4_img1 = duplicate of page3
  page4_img2 = SC (P05-06)         page5 = duplicate of page4_img2
  page6  = SD (P07) + SE (P08)
  page7  = SF (P11-12)             page8  = SF (P13) + SG (P14)
  page9  = SG (P15-16)             page10 = SH (P17-18)
  page11 = SI (P19-20)             page12 = SJ (P21-22)
  page13 = SJ (P23-24)             page14 = SK (P25-26)
  page15 = SL (P27-28)             page16 = SM (P29-30)
  page17 = SM (P31-32)             page18 = SM (P33-34)
  page19 = SM (P35) + SN (P36)     page20 = SN (P37-38)
  page21 = SO (P39-40)             page22 = SO (P41-42)
  page23 = SP (P43-44)             page24 = SP (P45-46)
  page25 = SP (P47-48)             page26 = SQ (P49-50)
  page27 = SQ (P51-52)             page28 = SQ (P53) + SR (P54)
  page29 = SR (P55-56)             page30 = SR (P57-58)
  page31 = SR (P59) + SS (P60)     page32 = SS (P61-62)
  page33 = SS (P63-64)             page34 = ST (P65-66)
  page35 = ST (P67-68)             page36 = Production Bases
"""

import os
from PIL import Image, ImageFilter, ImageEnhance

CATALOG_DIR = os.path.join(os.path.dirname(__file__), "images", "catalog")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "images", "products")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------- grid helpers ----------
# Column x-ranges for 3-column layout per page side
L3 = [(20, 410), (410, 830), (830, 1245)]
R3 = [(1275, 1680), (1680, 2090), (2090, 2500)]

# 4-column layout per page side
L4 = [(20, 320), (320, 630), (630, 940), (940, 1245)]
R4 = [(1275, 1580), (1580, 1890), (1890, 2200), (2200, 2500)]

# 2-column layout (wider products)
L2 = [(20, 630), (630, 1245)]
R2 = [(1275, 1890), (1890, 2500)]

# Row photo regions — crop ONLY the product photo, not text below
# Header bar: y=0..~150, product photos in 3 rows, footer y=1660..1718
# Verified via diagnostic strip crops on page7 (SF Advanced Wound Dressing)
ROWS = [
    (260, 500),    # Row 1 photo region (below header ~150px, above Row1 text ~500px)
    (660, 900),    # Row 2 photo region (below Row1 text, above Row2 text)
    (1060, 1370),  # Row 3 photo region (below Row2 text, above Row3 text)
]


def grid(cols, row_idx, col_idx):
    """Return (x1, y1, x2, y2) for a grid cell photo area."""
    x1, x2 = cols[col_idx]
    y1, y2 = ROWS[row_idx]
    return (x1, y1, x2, y2)


# ---------- product definitions ----------
# Each entry: (output_filename, source_page_file, crop_box)

PRODUCTS = [
    # ===== BANDAGES =====
    # 1. High Elastic Bandage – SA01, page3 P03 left, R1 C1
    ("high-elastic-bandage.jpg", "page3_img1.jpeg", grid(L3, 0, 0)),
    # 2. PBT Elastic Bandage – SA05 Conforming Bandage (Thin PBT), page3 P03 left, R2 C2 (4-col row)
    ("pbt-elastic-bandage.jpg", "page3_img1.jpeg", grid(L4, 1, 1)),
    # 3. Orthopedic Casting Tape – SB02, page3 P04 right, R1 C2
    ("orthopedic-casting-tape.jpg", "page3_img1.jpeg", grid(R3, 0, 1)),

    # ===== WOUND CARE =====
    # 4. Hydrocolloid Dressing – SF01, page7 P11 left, R1 C1
    ("hydrocolloid-dressing.jpg", "page7_img1.jpeg", grid(L3, 0, 0)),
    # 5. Silicone Foam Dressing – SF15, page7 P12 right, R3 C3
    ("silicone-foam-dressing.jpg", "page7_img1.jpeg", grid(R3, 2, 2)),
    # 6. Alginate Dressing with Silver – SF10, page7 P12 right, R1 C3
    ("alginate-dressing-silver.jpg", "page7_img1.jpeg", grid(R3, 0, 2)),

    # ===== GAUZE & COTTON =====
    # 7. Absorbent Gauze Roll – SG01, page8 P14 right, R1 C1
    ("absorbent-gauze-roll.jpg", "page8_img1.jpeg", grid(R3, 0, 0)),
    # 8. Absorbent Cotton Wool – SH01, page10 P17 left, R1 C1
    ("absorbent-cotton-wool.jpg", "page10_img1.jpeg", grid(L3, 0, 0)),
    # 9. Sterile Gauze Swabs – SG08, page8 P14 right, R3 C2
    ("sterile-gauze-swabs.jpg", "page8_img1.jpeg", grid(R3, 2, 1)),

    # ===== SURGICAL TAPES =====
    # 10. Zinc Oxide Plaster – SD01, page6 P07 left, R1 C1 (4-col)
    ("zinc-oxide-plaster.jpg", "page6_img1.jpeg", grid(L4, 0, 0)),
    # 11. Non-Woven Surgical Tape – SD05, page6 P07 left, R2 C1
    ("non-woven-surgical-tape.jpg", "page6_img1.jpeg", grid(L3, 1, 0)),
    # 12. Waterproof Adhesive Tape – SD08, page6 P07 left, R3 C1
    ("waterproof-adhesive-tape.jpg", "page6_img1.jpeg", grid(L3, 2, 0)),

    # ===== PPE =====
    # 13. Nitrile Examination Gloves – SS0802, page32 P61 left, R3 C2
    ("nitrile-examination-gloves.jpg", "page32_img1.jpeg", grid(L3, 2, 1)),
    # 14. 3-Ply Surgical Face Mask – SJ05, page12 P21 left, R2 C3
    ("3-ply-surgical-face-mask.jpg", "page12_img1.jpeg", grid(L3, 1, 2)),
    # 15. Isolation Gown – SJ13, page12 P22 right, R2 C2
    ("isolation-gown.jpg", "page12_img1.jpeg", grid(R3, 1, 1)),

    # ===== SYRINGES & IV =====
    # 16. Disposable Syringes – SN01, page19 P36 right, R1 C1
    ("disposable-syringes.jpg", "page19_img1.jpeg", grid(R3, 0, 0)),
    # 17. IV Administration Set – SN04, page19 P36 right, R2 wide crop
    ("iv-administration-set.jpg", "page19_img1.jpeg", (1275, 660, 2400, 900)),
    # 18. Insulin Syringe – SN01 (insulin variant), page19 P36 right, R1 C1 (same product line)
    ("insulin-syringe.jpg", "page19_img1.jpeg", grid(R3, 0, 0)),

    # ===== RESPIRATORY =====
    # 19. Oxygen Mask with Reservoir – SP0205, page23 P44 right, R1 C1
    ("oxygen-mask-reservoir.jpg", "page23_img1.jpeg", grid(R3, 0, 0)),
    # 20. Nebulizer Mask – SP0204, page23 P43 left, R3 C3
    ("nebulizer-mask.jpg", "page23_img1.jpeg", grid(L3, 2, 2)),
    # 21. CPAP Mask – SP0304, page23 P44 right, R2 C3
    ("cpap-mask.jpg", "page23_img1.jpeg", grid(R3, 1, 2)),

    # ===== SURGICAL =====
    # 22. Polyglactin Absorbable Sutures – SQ0102, page26 P50 right, R1 C2
    ("polyglactin-absorbable-sutures.jpg", "page26_img1.jpeg", grid(R3, 0, 1)),
    # 23. Surgical Blade Set – SQ0201, page27 P51 left, R1 C1
    ("surgical-blade-set.jpg", "page27_img1.jpeg", grid(L3, 0, 0)),
    # 24. Sterile Dressing Set – SQ0603, page27 P52 right, R1 C2
    ("sterile-dressing-set.jpg", "page27_img1.jpeg", grid(R3, 0, 1)),

    # ===== LABORATORY =====
    # 25. Blood Collection Tubes – SR24, page30 P58 right, top R1 wide area
    ("blood-collection-tubes.jpg", "page30_img1.jpeg", (1275, 260, 2500, 500)),
    # 26. Specimen Containers – SR1301, page29 P56 right, R1 C1 (4-col)
    ("specimen-containers.jpg", "page29_img1.jpeg", grid(R4, 0, 0)),
    # 27. Transfer Pipettes – SR04 Pasteur, page28 P54 right, R2 C4 (4-col)
    ("transfer-pipettes.jpg", "page28_img1.jpeg", grid(R4, 1, 3)),

    # ===== UROLOGY =====
    # 28. Latex Foley Catheter – SO0102, page21 P39 left, R1 C2
    ("latex-foley-catheter.jpg", "page21_img1.jpeg", grid(L3, 0, 1)),
    # 29. Urine Drainage Bag – SO1201, page22 P41 left, R3 C1
    ("urine-drainage-bag.jpg", "page22_img1.jpeg", grid(L3, 2, 0)),
    # 30. Thoracic Drainage Tube – SO1003, page22 P41 left, R2 C1
    ("thoracic-drainage-tube.jpg", "page22_img1.jpeg", grid(L3, 1, 0)),

    # ===== SPORTS & REHAB =====
    # 31. Knee Support Brace – SM0509 (neoprene + metal spring), page17 P32 right, R2 C3
    ("knee-support-brace.jpg", "page17_img1.jpeg", grid(R3, 1, 2)),
    # 32. Wrist Support – SM0802 (aluminium alloy holder), page18 P34 right, R2 C3
    ("wrist-support.jpg", "page18_img1.jpeg", grid(R3, 1, 2)),
    # 33. Lumbar Back Support – SM0806, page19 P35 left, R1 C1
    ("lumbar-back-support.jpg", "page19_img1.jpeg", grid(L3, 0, 0)),

    # ===== NURSING CARE =====
    # 34. Absorbent Underpads – SK01, page14 P25 left, R1 C1 (2-col)
    ("absorbent-underpads.jpg", "page14_img1.jpeg", grid(L2, 0, 0)),
    # 35. Adult Diapers – SK07, page14 P26 right, R1 C1 (2-col)
    ("adult-diapers.jpg", "page14_img1.jpeg", grid(R2, 0, 0)),
    # 36. Dental Bibs – SK09, page14 P26 right, R2 C1 (2-col)
    ("dental-bibs.jpg", "page14_img1.jpeg", grid(R2, 1, 0)),
]


def crop_and_save(output_name, source_file, crop_box):
    src_path = os.path.join(CATALOG_DIR, source_file)
    if not os.path.exists(src_path):
        print(f"  [SKIP] Source not found: {source_file}")
        return False

    img = Image.open(src_path).convert("RGB")
    w, h = img.size

    # Clamp crop box to image bounds
    x1 = max(0, crop_box[0])
    y1 = max(0, crop_box[1])
    x2 = min(w, crop_box[2])
    y2 = min(h, crop_box[3])

    cropped = img.crop((x1, y1, x2, y2))

    # Resize to fit within 1000x1000 maintaining aspect ratio
    cw, ch = cropped.size
    scale = min(960 / cw, 960 / ch)  # 960 to leave 20px padding each side
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped.resize((new_w, new_h), Image.LANCZOS)

    # Sharpen
    resized = resized.filter(ImageFilter.SHARPEN)
    enhancer = ImageEnhance.Sharpness(resized)
    resized = enhancer.enhance(1.3)

    # Place on white 1000x1000 background
    canvas = Image.new("RGB", (1000, 1000), (255, 255, 255))
    offset_x = (1000 - new_w) // 2
    offset_y = (1000 - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))

    out_path = os.path.join(OUTPUT_DIR, output_name)
    canvas.save(out_path, "JPEG", quality=95, optimize=True)
    print(f"  [OK] {output_name}  ({cw}x{ch} -> {new_w}x{new_h})")
    return True


def main():
    print(f"Catalog dir: {CATALOG_DIR}")
    print(f"Output dir:  {OUTPUT_DIR}")
    print(f"Processing {len(PRODUCTS)} products...\n")

    ok = 0
    fail = 0
    for output_name, source_file, crop_box in PRODUCTS:
        print(f"  {output_name}")
        if crop_and_save(output_name, source_file, crop_box):
            ok += 1
        else:
            fail += 1

    print(f"\nDone: {ok} succeeded, {fail} failed")


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
"""Parse official 600-question GPLX PDF into database/content/B2/."""
from __future__ import annotations

import sys
from pathlib import Path

import fitz

from pdf_parse_common import (
    assign_and_export_images,
    build_papers,
    parse_questions,
    write_parse_output,
)

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "database" / "content" / "B2"
IMAGES_DIR = OUT_DIR / "images"
PUBLIC_IMAGES = ROOT / "frontend" / "public" / "content" / "B2" / "images"
TOTAL_QUESTIONS = 600
QUESTIONS_PER_PAPER = 30
PAPER_COUNT = 20
CRITICAL_NUMBERS = set(range(1, 61))


def find_pdf() -> Path:
    matches = list(ROOT.glob("B*.pdf"))
    if not matches:
        for p in ROOT.glob("*.pdf"):
            if "250" not in p.name and "A1" not in p.name.upper():
                matches.append(p)
    if not matches:
        raise FileNotFoundError("No B2 PDF found in project root (expected B*.pdf)")
    return matches[0]


def main() -> int:
    pdf_path = find_pdf()
    doc = fitz.open(pdf_path)
    questions = parse_questions(doc)
    assign_and_export_images(doc, questions, IMAGES_DIR, PUBLIC_IMAGES)
    doc.close()

    payload = build_papers(
        questions,
        total_questions=TOTAL_QUESTIONS,
        questions_per_paper=QUESTIONS_PER_PAPER,
        paper_count=PAPER_COUNT,
        critical_numbers=CRITICAL_NUMBERS,
        image_url_prefix="/content/B2/images",
    )

    return write_parse_output(
        OUT_DIR,
        payload,
        pdf_name=pdf_path.name,
        min_parsed=598,
        sample_numbers=[1, 5, 12, 100, 439, 541, 600],
        log_notes=["Note: PDF gốc có thể thiếu Câu 507 (506 -> 508)."],
    )


if __name__ == "__main__":
    sys.exit(main())

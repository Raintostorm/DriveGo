# -*- coding: utf-8 -*-
"""Parse 250-question motorcycle GPLX PDF into database/content/A1/."""
from __future__ import annotations

import sys
from pathlib import Path

import fitz

from pdf_parse_common import (
    assign_and_export_images,
    build_papers,
    build_papers_sequential,
    parse_questions,
    write_parse_output,
)

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "database" / "content" / "A1"
IMAGES_DIR = OUT_DIR / "images"
PUBLIC_IMAGES = ROOT / "frontend" / "public" / "content" / "A1" / "images"
TOTAL_QUESTIONS = 250
QUESTIONS_PER_PAPER = 25
PAPER_COUNT = 10
# 25 câu điểm liệt trong bộ 250 câu xe máy
CRITICAL_NUMBERS = set(range(1, 26))


def find_pdf() -> Path:
    patterns = ["*250*", "*A1*", "*xe*may*", "*motor*"]
    matches: list[Path] = []
    for pat in patterns:
        matches.extend(ROOT.glob(f"{pat}.pdf"))
        matches.extend(ROOT.glob(f"{pat}.PDF"))
    matches = [p for p in matches if p.is_file()]
    if not matches:
        for p in ROOT.glob("*.pdf"):
            if "B" not in p.name[:2].upper() or "250" in p.name:
                matches.append(p)
    if not matches:
        raise FileNotFoundError(
            "No 250-question PDF found in project root (expected *250*.pdf or *A1*.pdf)",
        )
    matches.sort(key=lambda p: (0 if "250" in p.name else 1, p.name))
    return matches[0]


def main() -> int:
    pdf_path = find_pdf()
    doc = fitz.open(pdf_path)
    questions = parse_questions(doc)
    assign_and_export_images(doc, questions, IMAGES_DIR, PUBLIC_IMAGES)
    doc.close()

    by_number = build_papers(
        questions,
        total_questions=TOTAL_QUESTIONS,
        questions_per_paper=QUESTIONS_PER_PAPER,
        paper_count=PAPER_COUNT,
        critical_numbers=CRITICAL_NUMBERS,
        image_url_prefix="/content/A1/images",
    )
    full_papers = [p for p in by_number["papers"] if p["questionCount"] == QUESTIONS_PER_PAPER]
    if len(full_papers) >= 9:
        payload = {
            "papers": full_papers[:PAPER_COUNT],
            "missing": by_number["missing"],
            "parsedCount": by_number["parsedCount"],
        }
        pack_mode = "by_number"
    else:
        payload = build_papers_sequential(
            questions,
            questions_per_paper=QUESTIONS_PER_PAPER,
            critical_numbers=CRITICAL_NUMBERS,
            image_url_prefix="/content/A1/images",
        )
        pack_mode = "sequential"

    return write_parse_output(
        OUT_DIR,
        payload,
        pdf_name=pdf_path.name,
        min_parsed=225,
        sample_numbers=[1, 25, 50, 100, 200, 250],
        log_notes=[
            "Critical: câu 1–25 trong bộ 250 (điểm liệt).",
            f"Pack mode: {pack_mode}, papers={len(payload['papers'])}.",
            "A2: chạy npm run bootstrap:content để clone sang A2.",
        ],
    )


if __name__ == "__main__":
    sys.exit(main())

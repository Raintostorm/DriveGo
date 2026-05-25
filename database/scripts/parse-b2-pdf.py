# -*- coding: utf-8 -*-
"""
Parse official 600-question GPLX PDF into database/content/B2/papers.json + images/.

Correct answers: short horizontal underline strokes in PDF (not font flags).
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "database" / "content" / "B2"
IMAGES_DIR = OUT_DIR / "images"
PUBLIC_IMAGES = ROOT / "frontend" / "public" / "content" / "B2" / "images"
QUESTIONS_PER_PAPER = 30
PAPER_COUNT = 20
SCORE_THRESHOLD = 55
# 60 câu điểm liệt — theo bộ 600 câu CSGT 2025 (câu 1–60)
CRITICAL_NUMBERS = set(range(1, 61))


def find_pdf() -> Path:
    matches = list(ROOT.glob("B*.pdf"))
    if not matches:
        matches = list(ROOT.glob("*.pdf"))
    if not matches:
        raise FileNotFoundError("No PDF found in project root")
    return matches[0]


def is_answer_underline_stroke(rect: fitz.Rect) -> bool:
    return rect.height < 4 and 40 < rect.width < 420


def underline_score(page: fitz.Page, bbox: fitz.Rect) -> float:
    """Lower score = stronger underline match."""
    best = 1e9
    expanded = fitz.Rect(bbox.x0, bbox.y0 - 48, bbox.x1, bbox.y1 + 14)
    for d in page.get_drawings():
        r = d.get("rect")
        if r is None or not is_answer_underline_stroke(r):
            continue
        if r.y1 < expanded.y0 or r.y0 > expanded.y1:
            continue
        overlap = min(r.x1, bbox.x1) - max(r.x0, bbox.x0)
        if overlap < 25:
            continue
        dist = abs((r.y0 + r.y1) / 2 - bbox.y1)
        best = min(best, dist)
    return best


@dataclass
class TextLine:
    page: int
    y0: float
    text: str
    bbox: fitz.Rect
    ul_score: float = 1e9


@dataclass
class Question:
    number: int
    body: str
    answers: list[str] = field(default_factory=list)
    correct_index: int = 0
    image_file: str | None = None
    page: int = 0
    y0: float = 0


def extract_page_lines(page: fitz.Page, page_no: int) -> list[TextLine]:
    lines: list[TextLine] = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = "".join(span["text"] for span in line["spans"]).strip()
            if not text:
                continue
            bbox = fitz.Rect(line["bbox"])
            lines.append(
                TextLine(
                    page=page_no,
                    y0=bbox.y0,
                    text=text,
                    bbox=bbox,
                    ul_score=underline_score(page, bbox),
                )
            )
    lines.sort(key=lambda l: l.y0)
    return lines


def merge_answer_lines(
    doc: fitz.Document,
    lines: list[TextLine],
    start: int,
) -> tuple[list[tuple[str, float]], int]:
    answers: list[tuple[str, float]] = []
    i = start
    current_num: int | None = None
    current_parts: list[str] = []
    current_score = 1e9

    def flush():
        nonlocal current_num, current_parts, current_score
        if current_num is None:
            return
        body = re.sub(r"\s+", " ", " ".join(p.strip() for p in current_parts if p.strip())).strip()
        if body:
            answers.append((body, current_score))
        current_num = None
        current_parts = []
        current_score = 1e9

    while i < len(lines):
        t = lines[i].text
        m = re.match(r"^([1-4])\.\s*(.*)$", t)
        if m:
            flush()
            current_num = int(m.group(1))
            rest = m.group(2).strip()
            current_parts = [rest] if rest else []
            current_score = lines[i].ul_score
            i += 1
            continue
        if re.match(r"^Câu\s+\d+\.", t, re.I):
            flush()
            break
        if current_num is not None:
            current_parts.append(t)
            current_score = min(current_score, lines[i].ul_score)
            i += 1
            continue
        i += 1
    flush()
    return answers, i


def pick_correct_index(scores: list[float]) -> int:
    if not scores:
        return 0
    best = min(range(len(scores)), key=lambda i: scores[i])
    if scores[best] >= SCORE_THRESHOLD:
        return 0
    return best


def parse_questions(doc: fitz.Document) -> list[Question]:
    all_lines: list[TextLine] = []
    for pno in range(doc.page_count):
        all_lines.extend(extract_page_lines(doc[pno], pno))

    questions: list[Question] = []
    i = 0
    while i < len(all_lines):
        m = re.match(r"^Câu\s+(\d+)\.\s*(.*)$", all_lines[i].text, re.I)
        if not m:
            i += 1
            continue
        num = int(m.group(1))
        body_parts = [m.group(2).strip()] if m.group(2).strip() else []
        page = all_lines[i].page
        y0 = all_lines[i].y0
        i += 1
        while i < len(all_lines):
            t = all_lines[i].text
            if re.match(r"^Câu\s+\d+\.", t, re.I):
                break
            if re.match(r"^[1-4]\.\s", t):
                break
            body_parts.append(t)
            i += 1
        body = re.sub(r"\s+", " ", " ".join(body_parts)).strip()
        raw_answers, i = merge_answer_lines(doc, all_lines, i)
        answers = [a[0] for a in raw_answers]
        scores = [a[1] for a in raw_answers]
        questions.append(
            Question(
                number=num,
                body=body,
                answers=answers,
                correct_index=pick_correct_index(scores),
                page=page,
                y0=y0,
            )
        )
    return questions


def assign_and_export_images(doc: fitz.Document, questions: list[Question]) -> None:
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)
    used_xrefs: dict[int, set[int]] = {}

    for q in questions:
        page = doc[q.page]
        best_xref = None
        best_dist = 1e9
        used = used_xrefs.setdefault(q.page, set())

        for img in page.get_images(full=True):
            xref = img[0]
            if xref in used:
                continue
            try:
                rects = page.get_image_rects(xref)
            except Exception:
                continue
            for rect in rects:
                if rect.width < 50 or rect.height < 50:
                    continue
                dist = abs(rect.y1 - q.y0) if rect.y1 <= q.y0 + 20 else abs(rect.y0 - q.y0)
                if dist < best_dist and dist < 500:
                    best_dist = dist
                    best_xref = xref

        if best_xref is None:
            continue

        fname = f"cau-{q.number:03d}.png"
        q.image_file = fname
        used.add(best_xref)
        for dest in (IMAGES_DIR / fname, PUBLIC_IMAGES / fname):
            try:
                pix = fitz.Pixmap(doc, best_xref)
                if pix.n - pix.alpha > 3:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                pix.save(str(dest))
                pix = None
            except Exception:
                pass


def build_papers(questions: list[Question]) -> dict:
    by_num = {q.number: q for q in questions}
    missing = [n for n in range(1, 601) if n not in by_num]
    papers = []
    for p in range(PAPER_COUNT):
        start = p * QUESTIONS_PER_PAPER + 1
        qs_out = []
        for n in range(start, start + QUESTIONS_PER_PAPER):
            q = by_num.get(n)
            if not q:
                continue
            answers = q.answers[:4]
            while len(answers) < 4:
                answers.append("—")
            image_url = f"/content/B2/images/{q.image_file}" if q.image_file else None
            qs_out.append(
                {
                    "body": q.body,
                    "answers": answers,
                    "correctIndex": min(q.correct_index, len(answers) - 1),
                    "isCritical": n in CRITICAL_NUMBERS,
                    "imageUrl": image_url,
                }
            )
        papers.append(
            {
                "paperNumber": p + 1,
                "questionCount": len(qs_out),
                "isMock": True,
                "questions": qs_out,
            }
        )
    return {"papers": papers, "missing": missing, "parsedCount": len(questions)}


def main() -> int:
    pdf_path = find_pdf()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    questions = parse_questions(doc)
    assign_and_export_images(doc, questions)
    doc.close()

    payload = build_papers(questions)
    missing = payload.pop("missing")
    parsed = payload.pop("parsedCount")

    with (OUT_DIR / "papers.json").open("w", encoding="utf-8") as f:
        json.dump({"papers": payload["papers"]}, f, ensure_ascii=False, indent=2)

    samples = []
    for n in [1, 5, 12, 100, 439, 541, 600]:
        q = next((x for x in questions if x.number == n), None)
        if q and q.answers:
            samples.append(
                f"#{n} -> {q.correct_index + 1}: {q.answers[q.correct_index][:50]}"
            )

    log = [
        f"pdf={pdf_path.name}",
        f"parsed={parsed}",
        f"missing={missing}",
        f"images={sum(1 for q in questions if q.image_file)}",
        *samples,
        "",
        "Note: PDF gốc thiếu Câu 507 (nhảy 506 -> 508).",
    ]
    (OUT_DIR / "parse-log.txt").write_text("\n".join(log), encoding="utf-8")

    print(
        json.dumps(
            {"ok": True, "parsed": parsed, "missing": missing, "images": sum(1 for q in questions if q.image_file)},
            ensure_ascii=True,
        )
    )
    return 0 if parsed >= 598 else 1


if __name__ == "__main__":
    sys.exit(main())

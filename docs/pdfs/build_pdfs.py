"""Build TPC Group 14 project-preparation PDFs."""

from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
OUT = Path(__file__).resolve().parent

NAVY = colors.HexColor("#1B365D")
TEAL = colors.HexColor("#2A6F97")
GOLD = colors.HexColor("#C9A227")
LIGHT = colors.HexColor("#F4F7FB")
GREY = colors.HexColor("#5C6770")

FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_MONO = "Courier"

ARIAL = Path(r"C:\Windows\Fonts\arial.ttf")
ARIAL_BD = Path(r"C:\Windows\Fonts\arialbd.ttf")
COUR = Path(r"C:\Windows\Fonts\cour.ttf")
if ARIAL.exists() and ARIAL_BD.exists():
    pdfmetrics.registerFont(TTFont("Body", str(ARIAL)))
    pdfmetrics.registerFont(TTFont("Body-Bold", str(ARIAL_BD)))
    FONT = "Body"
    FONT_BOLD = "Body-Bold"
if COUR.exists():
    pdfmetrics.registerFont(TTFont("Mono", str(COUR)))
    FONT_MONO = "Mono"


def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle("CoverTitle", fontName=FONT_BOLD, fontSize=22, leading=26, textColor=NAVY, alignment=TA_CENTER, spaceAfter=8))
    s.add(ParagraphStyle("CoverSub", fontName=FONT, fontSize=12, leading=16, textColor=TEAL, alignment=TA_CENTER, spaceAfter=4))
    s.add(ParagraphStyle("CoverMeta", fontName=FONT, fontSize=10, leading=14, textColor=GREY, alignment=TA_CENTER, spaceAfter=2))
    s.add(ParagraphStyle("H1", fontName=FONT_BOLD, fontSize=16, leading=20, textColor=NAVY, spaceBefore=14, spaceAfter=8))
    s.add(ParagraphStyle("H2", fontName=FONT_BOLD, fontSize=13, leading=17, textColor=TEAL, spaceBefore=12, spaceAfter=6))
    s.add(ParagraphStyle("H3", fontName=FONT_BOLD, fontSize=11.5, leading=15, textColor=NAVY, spaceBefore=10, spaceAfter=4))
    s.add(ParagraphStyle("BodyText2", fontName=FONT, fontSize=10, leading=14, textColor=colors.HexColor("#1F2933"), alignment=TA_JUSTIFY, spaceAfter=6))
    s.add(ParagraphStyle("BulletBody", fontName=FONT, fontSize=10, leading=14, textColor=colors.HexColor("#1F2933"), leftIndent=12, spaceAfter=3))
    s.add(ParagraphStyle("NumberBody", fontName=FONT, fontSize=10, leading=14, textColor=colors.HexColor("#1F2933"), leftIndent=18, spaceAfter=3))
    s.add(ParagraphStyle("MetaLine", fontName=FONT, fontSize=10, leading=14, textColor=GREY, spaceAfter=3))
    s.add(ParagraphStyle("CodeBlock", fontName=FONT_MONO, fontSize=8.5, leading=11.5, textColor=colors.HexColor("#111827"), backColor=LIGHT, leftIndent=6, rightIndent=6, spaceBefore=6, spaceAfter=8))
    s.add(ParagraphStyle("Footer", fontName=FONT, fontSize=8, textColor=GREY, alignment=TA_CENTER))
    s.add(ParagraphStyle("TableCell", fontName=FONT, fontSize=8.5, leading=11, textColor=colors.HexColor("#1F2933")))
    s.add(ParagraphStyle("TableHead", fontName=FONT_BOLD, fontSize=8.5, leading=11, textColor=colors.white))
    s.add(ParagraphStyle("Caption", fontName=FONT_BOLD, fontSize=9, leading=12, textColor=TEAL, spaceBefore=8, spaceAfter=4))
    return s


S = styles()


def clean(text: str) -> str:
    return (
        text.replace("\u2019", "'")
        .replace("\u2018", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2026", "...")
        .replace("\xa0", " ")
    )


def inline(text: str) -> str:
    text = clean(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<i>\1</i>", text)
    text = re.sub(r"`(.+?)`", r"<font face='%s' size='9'>\1</font>" % FONT_MONO, text)
    return text


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 16 * mm, A4[0], 16 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, A4[1] - 17.2 * mm, A4[0], 1.2 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont(FONT_BOLD, 9)
    canvas.drawString(18 * mm, A4[1] - 10 * mm, "TPCgroup14  |  Learner Support Portal")
    canvas.setFont(FONT, 8)
    canvas.drawRightString(A4[0] - 18 * mm, A4[1] - 10 * mm, "Project preparation")
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], 12 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, 12 * mm, A4[0], 1 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont(FONT, 8)
    canvas.drawString(18 * mm, 5 * mm, "SkillsTrack Training Centre  |  Group 14")
    canvas.drawRightString(A4[0] - 18 * mm, 5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def cover(title: str, subtitle: str) -> list:
    return [
        Spacer(1, 18 * mm),
        Paragraph("TPC GROUP 14", S["CoverSub"]),
        Spacer(1, 4 * mm),
        Paragraph(title, S["CoverTitle"]),
        Paragraph(subtitle, S["CoverSub"]),
        Spacer(1, 8 * mm),
        Paragraph("Client: SkillsTrack Training Centre", S["CoverMeta"]),
        Paragraph("Project: Learner Support Portal", S["CoverMeta"]),
        Paragraph("Programme: Technical Programming Cycle  |  September 2026", S["CoverMeta"]),
        Spacer(1, 10 * mm),
        Table(
            [[""]],
            colWidths=[40 * mm],
            rowHeights=[2],
            style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), GOLD)]),
        ),
        Spacer(1, 8 * mm),
    ]


def md_to_flowables(md: str) -> list:
    flow = []
    lines = clean(md).replace("\r\n", "\n").split("\n")
    i = 0
    in_code = False
    code_lines: list[str] = []

    def flush_code():
        nonlocal code_lines
        if code_lines:
            block = "\n".join(code_lines).rstrip() + "\n"
            flow.append(Preformatted(block, S["CodeBlock"]))
            code_lines = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        if stripped.startswith("# "):
            flow.append(Paragraph(inline(stripped[2:]), S["H1"]))
        elif stripped.startswith("## "):
            flow.append(Paragraph(inline(stripped[3:]), S["H2"]))
        elif stripped.startswith("### "):
            flow.append(Paragraph(inline(stripped[4:]), S["H3"]))
        elif re.match(r"^\d+\.\s+", stripped):
            flow.append(Paragraph(inline(stripped), S["NumberBody"]))
        elif stripped.startswith(("- ", "* ")):
            flow.append(Paragraph("&bull;  " + inline(stripped[2:]), S["BulletBody"]))
        elif stripped.startswith("\t") or stripped.startswith("    "):
            # indented notes
            flow.append(Paragraph(inline(stripped), S["BulletBody"]))
        else:
            style = S["MetaLine"] if stripped.startswith("* ") is False and stripped.startswith("*") and stripped.endswith("*") else S["BodyText2"]
            if stripped.startswith("*") and stripped.endswith("*") and stripped.count("*") == 2:
                flow.append(Paragraph(inline(stripped.strip("*")), S["MetaLine"]))
            else:
                flow.append(Paragraph(inline(stripped), S["BodyText2"]))
        i += 1

    flush_code()
    return flow


def simple_table(headers, rows, col_widths):
    head = [Paragraph(h, S["TableHead"]) for h in headers]
    data = [head]
    for row in rows:
        data.append([Paragraph(str(c), S["TableCell"]) for c in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
                ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#D0D7DE")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def build_pdf(filename: str, title: str, subtitle: str, body):
    path = OUT / filename
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=24 * mm,
        bottomMargin=18 * mm,
        title=title,
        author="TPC Group 14",
        subject="Learner Support Portal - Project preparation",
    )
    story = cover(title, subtitle) + body
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    return path


def read_doc(name: str) -> str:
    return (DOCS / name).read_text(encoding="utf-8")


DATA_MODEL = r"""
## Purpose
This document describes the Firebase Realtime Database data model for the Learner Support Portal. Firebase stores data as a JSON tree, not SQL tables. Each top-level node is a collection. Record keys are unique IDs.

## Database tree
```
Students Portal (Realtime Database)
|-- users/          who can log in (learner / assessor)
|-- tasks/          learning tasks
|-- bookings/       support session requests
|-- resources/      guides, documents and links
|-- gameScores/     coding mini-game results
|-- preferences/    theme and filter settings
```

## Relationships
```
users (1) ---- (many) tasks          via userId
users (1) ---- (many) gameScores     via userId
users (1) ---- (1)    preferences    uid is the record key
users (learner)  -- (many) bookings  via learnerId
users (assessor) -- (many) bookings  via assessorId
resources -- shared (no owner field; assessors write, signed-in users read)
```

Progress is not stored as a field. It is calculated from tasks: completed tasks divided by total tasks.

## Collection: users
One profile per person. The record key should be the Firebase Authentication uid.

Required fields: email, displayName, role, createdAt.
Role values: learner or assessor.

## Collection: tasks
Learning work items owned by a learner.

Required fields: userId, title, category, dueDate, priority, status, createdAt, updatedAt.
Priority values: low, medium, high.
Status values: todo, in-progress, done.

## Collection: bookings
Support session requests linking a learner to an assessor.

Required fields: learnerId, topic, preferredDate, status, createdAt.
Optional fields: assessorId, notes.
Status values: pending, confirmed, completed, cancelled.

## Collection: resources
Learning materials uploaded by an assessor.

Required fields: title, type, url, description, category.
Type values: document, link, guide.

## Collection: gameScores
Mini-game results for a learner.

Required fields: userId, score, playedAt.
Optional field: level.

## Collection: preferences
UI preferences keyed by uid.

Required field: theme (light or dark).
Optional field: taskFilter.

## Security (role-based)
- A learner may read and write their own profile, tasks, bookings, scores and preferences.
- An assessor may read learner profiles, tasks, bookings and scores, update booking status, and upload resources.
- Passwords are never stored in this database. Firebase Authentication holds login credentials.

## Sample records
Demo learner: learnerDemo001 (Lucia Ashler Mahlangu, role learner).
Demo assessor: assessorDemo001 (Londeka Zikalala, role assessor).
Tasks task001 and task002 belong to learnerDemo001.
Booking booking001 links learnerDemo001 to assessorDemo001.
"""


INDEX_BODY = """
## How to use this pack
These PDFs are the Month 1 / project-preparation documents for TPC Group 14. Print or upload each file for the assessor review. Source files live in the docs folder of the GitHub repository.

## Document list
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    created = []

    docs = [
        (
            "01-Client-Brief.pdf",
            "Client Brief",
            "Project preparation pack",
            md_to_flowables(read_doc("Client Brief.md")),
        ),
        (
            "02-Requirements.pdf",
            "Client Requirements",
            "Functional, technical and success criteria",
            md_to_flowables(read_doc("Requirements.md")),
        ),
        (
            "03-Problem-Statement-and-Scope.pdf",
            "Problem Statement and Scope",
            "Week 1 planning",
            md_to_flowables("# Problem Statement and Project Scope\n" + read_doc("Week-1-Planning.md")),
        ),
        (
            "04-User-Stories.pdf",
            "User Stories and Acceptance Criteria",
            "Learner and assessor stories",
            md_to_flowables(read_doc("User-Stories.docs")),
        ),
        (
            "05-Use-Cases.pdf",
            "Use Cases",
            "UC-1 to UC-11",
            md_to_flowables(read_doc("Use Case")),
        ),
        (
            "06-Programming-Life-Cycle.pdf",
            "Programming Life Cycle",
            "Analysis through evaluation",
            md_to_flowables(read_doc("programming_life_cycle.md")),
        ),
        (
            "07-Pseudocode.pdf",
            "Pseudocode",
            "Login, tasks, progress and delete",
            md_to_flowables("# Pseudocode\n\n```\n" + read_doc("Pseudocode").strip() + "\n```"),
        ),
        (
            "08-Research.pdf",
            "Research and Formative Questions",
            "Architecture investigation and Month 1 questions",
            md_to_flowables("# Research\n" + read_doc("Research.md")),
        ),
        (
            "09-Meeting-Minutes.pdf",
            "Meeting Minutes",
            "Group 14 planning meetings",
            md_to_flowables("# Meeting Minutes\n" + read_doc("Meeting Minute.md")),
        ),
        (
            "10-Data-Modelling.pdf",
            "Data Modelling",
            "Firebase Realtime Database design",
            md_to_flowables("# Data Modelling\n" + DATA_MODEL)
            + [
                Paragraph("Field summary", S["H2"]),
                Paragraph("Users", S["Caption"]),
                simple_table(
                    ["Field", "Type / values", "Notes"],
                    [
                        ["email", "string", "Login email (not the password)"],
                        ["displayName", "string", "Full name shown in the portal"],
                        ["role", "learner | assessor", "Controls dashboard and security rules"],
                        ["createdAt", "ISO date-time", "When the profile was created"],
                    ],
                    [40 * mm, 50 * mm, 84 * mm],
                ),
                Paragraph("Tasks", S["Caption"]),
                simple_table(
                    ["Field", "Type / values", "Notes"],
                    [
                        ["userId", "uid", "Owner (learner)"],
                        ["title", "string", "Task name"],
                        ["category", "string", "e.g. frontend, backend"],
                        ["dueDate", "date", "YYYY-MM-DD"],
                        ["priority", "low | medium | high", "Validated by security rules"],
                        ["status", "todo | in-progress | done", "Used to calculate progress"],
                    ],
                    [40 * mm, 50 * mm, 84 * mm],
                ),
                Paragraph("Bookings", S["Caption"]),
                simple_table(
                    ["Field", "Type / values", "Notes"],
                    [
                        ["learnerId", "uid", "Who requested support"],
                        ["assessorId", "uid or null", "Assigned assessor"],
                        ["topic", "string", "Help topic"],
                        ["preferredDate", "ISO date-time", "Requested session time"],
                        ["status", "pending | confirmed | completed | cancelled", "Updated by the assessor"],
                        ["notes", "string", "Optional extra detail"],
                    ],
                    [40 * mm, 55 * mm, 79 * mm],
                ),
                Spacer(1, 6 * mm),
                Paragraph("Source files: database/schema.json (sample data) and database/database.rules.json (access rules).", S["BodyText2"]),
            ],
        ),
    ]

    index_rows = []
    for i, (fn, title, subtitle, body) in enumerate(docs, start=1):
        path = build_pdf(fn, title, subtitle, body)
        created.append(path)
        index_rows.append([str(i).zfill(2), title, subtitle, fn])

    index_story = md_to_flowables("# Project Preparation Pack\n" + INDEX_BODY)
    index_story.append(
        simple_table(
            ["No.", "Document", "Description", "File name"],
            index_rows,
            [16 * mm, 52 * mm, 55 * mm, 51 * mm],
        )
    )
    index_story.extend(
        md_to_flowables(
            """
## Related links
- Wireframes (Figma): https://www.figma.com/design/eTDuNbnaarUAvA5qCaJJLl/TPCgroup14
- Flowcharts: see docs/Flowcharts (Google Drive link in that file)
- Repository: https://github.com/Sheilahlophe/TPCgroup14
"""
        )
    )
    created.insert(0, build_pdf("00-Project-Preparation-Index.pdf", "Project Preparation Pack", "Index of submission documents", index_story))

    print("Created:")
    for p in created:
        print(p)


if __name__ == "__main__":
    main()

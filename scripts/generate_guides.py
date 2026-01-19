"""
Utility script to convert Markdown guides into downloadable PDFs.

Usage:
    python scripts/generate_guides.py
"""

from pathlib import Path
from textwrap import wrap

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "resources" / "guides"
OUTPUT_DIR = ROOT / "public" / "resources"

GUIDES = [
    ("knowledge-base-overview.md", "algotradingwith-knowledge-base.pdf"),
    ("ea-installation-guide.md", "ea-installation-guide.pdf"),
    ("account-configuration-guide.md", "account-configuration-guide.pdf"),
    ("risk-management-guide.md", "risk-management-guide.pdf"),
    ("quick-start-guide.md", "quick-start-guide.pdf"),
    ("vps-setup-guide.md", "vps-setup-guide.pdf"),
    ("troubleshooting-guide.md", "troubleshooting-guide.pdf"),
    ("community-forum-guide.md", "community-forum-guide.pdf"),
]


def read_markdown(path: Path) -> list[str]:
    """Return markdown lines stripped of front-matter delimiters."""
    lines = path.read_text(encoding="utf-8").splitlines()
    cleaned: list[str] = []
    in_front_matter = False
    for line in lines:
        if line.strip() == "---":
            in_front_matter = not in_front_matter
            continue
        if in_front_matter:
            continue
        cleaned.append(line.rstrip())
    return cleaned


def write_pdf(lines: list[str], destination: Path, title: str | None = None) -> None:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    if title:
        pdf.set_font("Arial", "B", 16)
        pdf.multi_cell(0, 10, title)
        pdf.ln(4)

    pdf.set_font("Arial", size=11)

    for raw_line in lines:
        line = raw_line.replace("\t", "    ")
        if not line.strip():
            pdf.ln(4)
            continue

        if line.startswith("#"):
            level = line.count("#", 0, len(line) - len(line.lstrip("#")))
            text = line[level:].strip()
            size = max(16 - (level - 1) * 2, 12)
            pdf.set_font("Arial", "B", size)
            pdf.multi_cell(0, 8, text.upper())
            pdf.ln(2)
            pdf.set_font("Arial", size=11)
            continue

        if line.startswith(("-", "*")):
            content = line[1:].strip()
            pdf.multi_cell(0, 6, f"• {content}")
            continue

        pdf.multi_cell(0, 6, line)

    destination.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(destination))


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for source_name, output_name in GUIDES:
        source_path = SOURCE_DIR / source_name
        if not source_path.exists():
            print(f"[WARN] Missing source file: {source_path}")
            continue
        title = source_path.stem.replace("-", " ").title()
        lines = read_markdown(source_path)
        output_path = OUTPUT_DIR / output_name
        write_pdf(lines, output_path, title=title)
        print(f"[OK] Generated {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()






















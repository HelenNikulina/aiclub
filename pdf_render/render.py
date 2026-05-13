#!/usr/bin/env python3
"""Render a markdown guide to a branded Formula AI PDF."""

import argparse
import re
from pathlib import Path

import mistune
from weasyprint import HTML, CSS

ROOT = Path(__file__).parent


COVER_HTML = """
<section class="cover">
  <img src="{logo}" alt="Formula AI" class="logo" />
  <div class="label">Formula AI · Гайд</div>
  <h1 class="title">{title}</h1>
  <div class="accent-bar"></div>
  <p class="subtitle">{subtitle}</p>
  <div class="footer">
    <div>myformula.ai</div>
    <div class="right">
      <div class="ed">Видання для підписників</div>
      <div>© {year} Formula AI</div>
    </div>
  </div>
</section>
"""


_MD_INLINE = re.compile(r"(\*\*|__|\*|_|`)")


def strip_md_inline(s: str) -> str:
    """Remove inline markdown markers (**bold**, *italic*, `code`) for cover use."""
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"__(.+?)__", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    s = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    return s


def extract_title_and_body(md_text: str):
    """Pull first H1 as document title; first paragraph after it as subtitle."""
    lines = md_text.splitlines()
    title = "Гайд Formula AI"
    subtitle = ""
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title = strip_md_inline(line[2:].strip())
            body_start = i + 1
            break
    # find first non-empty non-hr paragraph for subtitle
    j = body_start
    while j < len(lines) and (not lines[j].strip() or lines[j].strip().startswith("---")):
        j += 1
    if j < len(lines):
        buf = []
        while j < len(lines) and lines[j].strip() and not lines[j].startswith("#"):
            buf.append(lines[j].strip())
            j += 1
        subtitle = strip_md_inline(" ".join(buf))
        if len(subtitle) > 180:
            subtitle = subtitle[:177].rsplit(" ", 1)[0] + "…"
    body_md = "\n".join(lines[body_start:])
    return title, subtitle, body_md


_renderer = mistune.create_markdown(
    plugins=["table", "strikethrough", "url", "task_lists"],
    escape=False,
)


def md_to_html_body(md_text: str) -> str:
    return _renderer(md_text)


def build_html(md_path: Path, username: str) -> str:
    md_text = md_path.read_text(encoding="utf-8")
    title, subtitle, body_md = extract_title_and_body(md_text)
    body_html = md_to_html_body(body_md)
    logo_basic = (ROOT / "logo_basic.svg").as_uri()
    logo_horizontal = (ROOT / "logo_horizontal.svg").as_uri()
    year = 2026

    cover = COVER_HTML.format(
        logo=logo_basic, title=title, subtitle=subtitle, year=year
    )

    watermark_text = f"FORMULA AI · {username}"

    html = f"""<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
</head>
<body>
  {cover}
  <div class="brand-header">
    <img src="{logo_horizontal}" alt="Formula AI" />
  </div>
  <div class="watermark">{watermark_text}</div>
  <div class="diag-watermark">{username}</div>
  <main>
    {body_html}
  </main>
</body>
</html>
"""
    return html


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("markdown", help="Path to .md guide")
    ap.add_argument("-o", "--output", help="Output PDF path", default=None)
    ap.add_argument("-u", "--user", help="Subscriber username for watermark",
                    default="@username")
    args = ap.parse_args()

    md_path = Path(args.markdown).resolve()
    out_path = Path(args.output) if args.output else (
        ROOT / "output" / (md_path.stem + ".pdf")
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)

    html_str = build_html(md_path, args.user)
    css_path = ROOT / "template.css"

    HTML(string=html_str, base_url=str(ROOT)).write_pdf(
        target=str(out_path),
        stylesheets=[CSS(filename=str(css_path))],
    )

    print(f"PDF written: {out_path}")


if __name__ == "__main__":
    main()

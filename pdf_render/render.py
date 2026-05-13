#!/usr/bin/env python3
"""Render a markdown guide to a branded Formula AI PDF, plus commands.txt."""

import argparse
import re
from html import escape
from pathlib import Path

import mistune
from mistune.renderers.html import HTMLRenderer
from weasyprint import HTML, CSS

ROOT = Path(__file__).parent


COVER_HTML = """
<section class="cover">
  <img src="{logo}" alt="Formula AI" class="logo" />
  <div class="label">Formula AI · Гайд</div>
  <h1 class="title">{title}</h1>
  <div class="accent-bar"></div>
  <p class="subtitle">{subtitle}</p>
  <p class="cover-attach">До гайду додається файл <code>{commands_filename}</code> — усі команди готові до копіювання.</p>
  <div class="footer">
    <div>myformula.ai</div>
    <div class="right">
      <div class="ed">Видання для підписників</div>
      <div>© {year} Formula AI</div>
    </div>
  </div>
</section>
"""


def strip_md_inline(s: str) -> str:
    """Remove inline markdown markers for cover-page use."""
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"__(.+?)__", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    s = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    return s


def extract_title_and_body(md_text: str):
    lines = md_text.splitlines()
    title = "Гайд Formula AI"
    subtitle = ""
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title = strip_md_inline(line[2:].strip())
            body_start = i + 1
            break
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


class FormulaRenderer(HTMLRenderer):
    """HTML renderer that numbers fenced code blocks and wraps them as cards."""

    def __init__(self, commands_filename: str = "commands.txt"):
        super().__init__()
        self.code_counter = 0
        self.commands_filename = commands_filename

    def block_code(self, code: str, info=None) -> str:
        self.code_counter += 1
        n = self.code_counter
        lang = ""
        if info:
            lang = info.strip().split(None, 1)[0]
        lang_html = (
            f'<span class="card-lang"><code>{escape(lang)}</code></span>'
            if lang else ""
        )
        return (
            f'<div class="code-card">'
            f'<div class="code-label">'
            f'<span class="card-num">Команда {n}</span>'
            f'{lang_html}'
            f'<span class="card-hint">також у {escape(self.commands_filename)}</span>'
            f'</div>'
            f'<pre><code>{escape(code)}</code></pre>'
            f'</div>\n'
        )


def md_to_html_body(md_text: str, commands_filename: str) -> str:
    renderer = FormulaRenderer(commands_filename=commands_filename)
    md = mistune.create_markdown(
        renderer=renderer,
        plugins=["table", "strikethrough", "url", "task_lists"],
        escape=False,
    )
    return md(md_text)


# ---------------------------------------------------------------------------
# commands.txt extraction
# ---------------------------------------------------------------------------

_FENCE_RE = re.compile(r"^(?P<quote>(?:>\s?)*)```(?P<lang>\S*)\s*$")
_FENCE_END_RE = re.compile(r"^(?:>\s?)*```\s*$")
_QUOTE_PREFIX_RE = re.compile(r"^(?:>\s?)+")


def extract_commands(md_text: str, guide_title: str) -> str:
    """Find all fenced code blocks; return a plain-text companion file."""
    lines = md_text.splitlines()
    h2 = h3 = h4 = ""
    blocks = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = _QUOTE_PREFIX_RE.sub("", line)
        if stripped.startswith("## "):
            h2 = strip_md_inline(stripped[3:].strip()); h3 = h4 = ""
        elif stripped.startswith("### "):
            h3 = strip_md_inline(stripped[4:].strip()); h4 = ""
        elif stripped.startswith("#### "):
            h4 = strip_md_inline(stripped[5:].strip())
        elif stripped.startswith("# "):
            h2 = h3 = h4 = ""

        m = _FENCE_RE.match(line)
        if m:
            lang = m.group("lang") or ""
            code_lines = []
            i += 1
            while i < len(lines) and not _FENCE_END_RE.match(lines[i]):
                code_lines.append(_QUOTE_PREFIX_RE.sub("", lines[i]))
                i += 1
            ctx = " / ".join(p for p in (h2, h3, h4) if p)
            blocks.append((ctx, lang, "\n".join(code_lines)))
        i += 1

    out = []
    out.append(guide_title)
    out.append("=" * len(guide_title))
    out.append("")
    out.append("Усі команди з гайду — готові до копіювання.")
    out.append("Номери відповідають міткам у PDF (Команда 1, Команда 2, …).")
    out.append("")

    if not blocks:
        out.append("(у цьому гайді немає окремих блоків команд)")
        out.append("")
    else:
        for n, (ctx, lang, code) in enumerate(blocks, 1):
            out.append("-" * 64)
            header = f"# Команда {n}"
            if lang:
                header += f"  ·  {lang}"
            out.append(header)
            if ctx:
                out.append(f"# Контекст: {ctx}")
            out.append("")
            out.append(code.rstrip())
            out.append("")

    return "\n".join(out).rstrip() + "\n"


# ---------------------------------------------------------------------------
# HTML assembly
# ---------------------------------------------------------------------------

def build_html(md_path: Path, username: str, commands_filename: str) -> str:
    md_text = md_path.read_text(encoding="utf-8")
    title, subtitle, body_md = extract_title_and_body(md_text)
    body_html = md_to_html_body(body_md, commands_filename=commands_filename)
    logo_basic = (ROOT / "logo_basic.svg").as_uri()
    logo_horizontal = (ROOT / "logo_horizontal.svg").as_uri()
    year = 2026

    cover = COVER_HTML.format(
        logo=logo_basic,
        title=escape(title),
        subtitle=escape(subtitle),
        commands_filename=escape(commands_filename),
        year=year,
    )

    watermark_text = f"FORMULA AI · {escape(username)}"

    return f"""<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>{escape(title)}</title>
</head>
<body>
  {cover}
  <div class="brand-header">
    <img src="{logo_horizontal}" alt="Formula AI" />
  </div>
  <div class="watermark">{watermark_text}</div>
  <div class="diag-watermark">{escape(username)}</div>
  <main>
    {body_html}
  </main>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("markdown", help="Path to .md guide")
    ap.add_argument("-o", "--output", help="Output PDF path", default=None)
    ap.add_argument("-u", "--user", help="Subscriber username for watermark",
                    default="@username")
    args = ap.parse_args()

    md_path = Path(args.markdown).resolve()
    stem = md_path.stem
    out_dir = (Path(args.output).parent if args.output
               else ROOT / "output")
    out_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = Path(args.output) if args.output else out_dir / f"{stem}.pdf"
    commands_filename = f"{stem}_commands.txt"
    commands_path = out_dir / commands_filename

    title, _, _ = extract_title_and_body(md_path.read_text(encoding="utf-8"))

    commands_path.write_text(
        extract_commands(md_path.read_text(encoding="utf-8"), title),
        encoding="utf-8",
    )

    html_str = build_html(md_path, args.user, commands_filename)
    css_path = ROOT / "template.css"

    HTML(string=html_str, base_url=str(ROOT)).write_pdf(
        target=str(pdf_path),
        stylesheets=[CSS(filename=str(css_path))],
    )

    print(f"PDF written:      {pdf_path}")
    print(f"Commands written: {commands_path}")


if __name__ == "__main__":
    main()

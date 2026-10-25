#!/usr/bin/env python3
"""Check local HTML/CSS dependencies and fragment targets without external services."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

PROJECT_ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.duplicates = []
        self.references = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        identifier = attributes.get("id")
        if identifier:
            if identifier in self.ids:
                self.duplicates.append(identifier)
            self.ids.add(identifier)
        for key in ("href", "src"):
            if attributes.get(key):
                self.references.append(attributes[key])


def check_site(root):
    root = root.resolve()
    errors = []
    pages = {path.resolve(): Page(path) for path in root.rglob("*.html")
             if not any(part in {"archive", "node_modules", "dist", "_site", ".git"}
                        for part in path.relative_to(root).parts)}
    if root / "index.html" not in pages:
        errors.append("Missing index.html")
    references = []
    for path, page in pages.items():
        errors.extend(f"{path.relative_to(root)}: duplicate id #{value}" for value in page.duplicates)
        references.extend((path, reference) for reference in page.references)
    css_root = root / "assets/css"
    for path in css_root.rglob("*.css"):
        references.extend((path, reference.strip().strip("\"'")) for reference in
                          re.findall(r"url\(([^)]+)\)", path.read_text(encoding="utf-8")))
    for source, reference in references:
        url = urlsplit(reference)
        if url.scheme or url.netloc:
            continue
        target = ((root / unquote(url.path).lstrip("/")) if url.path.startswith("/") else
                  (source.parent / unquote(url.path)) if url.path else source).resolve()
        if not target.is_relative_to(root):
            errors.append(f"{source.relative_to(root)}: reference escapes site: {reference}")
            continue
        if target.is_dir():
            target /= "index.html"
        if not target.is_file():
            errors.append(f"{source.relative_to(root)}: missing {reference}")
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f"{source.relative_to(root)}: missing fragment {reference}")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", nargs="?", type=Path, default=PROJECT_ROOT)
    root = parser.parse_args().directory.resolve()
    errors = check_site(root)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        raise SystemExit(1)
    print(f"Site checks passed: {root}")


if __name__ == "__main__":
    main()

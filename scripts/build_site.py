#!/usr/bin/env python3
"""Validate and copy the public site into dist/ for deployment."""
from pathlib import Path
import shutil

from check_site import PROJECT_ROOT, check_site

PUBLIC_FILES = (
    "index.html", "about.html", "projects.html",
    "favicon.svg", "favicon-32.png", "apple-touch-icon.png",
)


def main():
    errors = check_site(PROJECT_ROOT)
    if errors:
        raise SystemExit("\n".join(errors))
    output = PROJECT_ROOT / "dist"
    if output.is_symlink():
        raise SystemExit("Refusing to replace a symlink at dist/")
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    for name in PUBLIC_FILES:
        shutil.copy2(PROJECT_ROOT / name, output / name)
    shutil.copytree(
        PROJECT_ROOT / "assets", output / "assets",
        ignore=shutil.ignore_patterns("*.md", ".DS_Store", "legacy"),
    )
    # Keep future branch-based deployments from processing the generated site with Jekyll.
    (output / ".nojekyll").touch()
    errors = check_site(output)
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Built and checked {output}")


if __name__ == "__main__":
    main()

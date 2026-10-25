# Akarsh Raj — portfolio & Agent Fieldnotes

A static website hosted on GitHub Pages. The three HTML entry points stay at the repository root to preserve the existing page URLs and current root-based publishing setup.

```text
.
├── index.html                 # Agent Fieldnotes blog landing page
├── about.html                 # Portfolio and CV
├── projects.html              # Professional and personal projects
├── favicon.svg                # Browser icon; PNG fallback and Apple icon also at root
├── assets/
│   ├── css/
│   │   ├── base.css           # Shared base styles
│   │   ├── portfolio.css      # Shared portfolio theme
│   │   └── pages/             # Blog and Projects page styles
│   ├── js/main.js             # Theme and shared behavior
│   ├── images/
│   │   ├── portraits/         # Current portrait
│   │   ├── logos/             # Official employer logos and source notes
│   │   └── legacy/            # Older tracked artwork; excluded from builds
│   ├── documents/resume.pdf
│   └── brand/                 # Favicon source notes and font license
├── content/posts/             # Reserved for future Markdown blog posts
├── docs/                      # Development and publishing notes
├── scripts/                   # Dependency-free checks and deployment build
└── archive/                   # Local prototypes/reference sites; ignored
```

## Preview

Python 3.10+ is sufficient; no package install is needed.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Serve the repository root, not an individual page folder.

## Check and build

```sh
python3 scripts/check_site.py
python3 scripts/build_site.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

The checker validates local HTML/CSS dependencies, duplicate HTML IDs, and links to HTML fragments. It does not require network access. The build copies only the public pages, icons, and active assets into `dist/`, then checks that output again. `dist/` is generated and ignored by Git. Documentation, future Markdown sources, prototypes, and legacy artwork are not deployed by the build.

See [the publishing notes](docs/publishing.md) for the intended CI/CD and blog workflow. No deployment settings or GitHub Actions workflows have been changed by this reorganization.

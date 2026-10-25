# Publishing and future CI/CD

## Current site

The live pages are static HTML at the repository root. Styles, JavaScript, portraits, company logos, and the CV now live under `assets/`; their references in all pages have been updated. Keep the root as the publishing source while using the current GitHub Pages setup.

The CV is now at `/assets/documents/resume.pdf`. The About page download link uses this path. Older direct links to `/resume.pdf` will need updating.

## Future pipeline

A later GitHub Actions workflow can live at `.github/workflows/site.yml` and use these steps:

1. Check out the repository and set up Python 3.10 or newer.
2. Run `python3 scripts/check_site.py`.
3. Run `python3 scripts/build_site.py`.
4. On pull requests, stop after validation/build.
5. On pushes to `main`, upload **only `dist/`** as the Pages artifact and deploy it.

When enabling that workflow, change repository Settings → Pages → Source to GitHub Actions. The build command is ready; the workflow and remote publishing setting are not configured yet. Until then, normal root-based GitHub Pages publishing continues to use the root HTML and assets.

Do not upload the entire checkout as a Pages artifact: the clean output excludes authoring files and local experiments.

## Future Markdown posts

`content/posts/` is reserved for article sources, separate from browser JavaScript and website assets. A Markdown generator such as Eleventy can be introduced later, preserving the current styling. Simply adding a Markdown file does not yet publish an article or update the blog index.

Suggested post structure after that generator is configured:

```text
content/posts/agent-workflows/
├── index.md
└── architecture.svg
```

Suggested front matter:

```yaml
---
title: "When does a workflow need an agent?"
date: 2026-10-25
description: "Choosing between predictable workflows and agents."
topics: [agents, architecture]
draft: true
---
```

The future generator should exclude drafts, render article pages, and update the listing. Its output should flow into the same `dist/` deployment directory.

## Archived work

The unused JSON app and reference checkout remain locally under `archive/`. They are ignored by Git and are not inputs to the site build. In particular, `archive/local-prototypes/blogs.json` and `blog.js` are not part of the current blog.

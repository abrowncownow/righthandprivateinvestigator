# Right Hand Private Investigator

A fast, accessible Astro site for Right Hand Private Investigator. It is built as a static site, works at a repository subpath on GitHub Pages, and is intentionally safe by default: local and Pages builds are marked `noindex, nofollow`, and the inquiry form is disabled until an explicit production configuration is supplied.

## Requirements

- Node.js 24 or newer
- npm 11 or newer

## Local setup

```powershell
npm.cmd ci
npm.cmd run test:browsers
npm.cmd run dev
```

Astro prints the local URL, normally `http://localhost:4321/`. The default preview shows a proof-of-concept notice and does not submit or store inquiry data.

If PowerShell has not refreshed its `PATH` after installing Node, open a new terminal before running these commands. The examples use `npm.cmd` so they work with Windows' default restricted script policy without changing that security setting. In other shells, `npm` works normally.

## Build modes

```powershell
# Safe, noindex preview with a representative GitHub Pages subpath
npm.cmd run build:preview

# Indexable build for the intended production domain
npm.cmd run build:production
```

The `build` package script respects the current environment and is what the Astro GitHub Action calls. For intentional local builds, prefer the explicit commands above.

The generated site is written to `dist/`. The verification and Lighthouse scripts deliberately restore the safe preview build to `dist/` when they finish.

Public configuration is documented in [.env.example](.env.example):

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical origin, without a trailing path |
| `PUBLIC_BASE_PATH` | Hosting subpath, normally `/` on the final domain |
| `PUBLIC_PREVIEW_MODE` | `true` disables intake and emits `noindex, nofollow` |
| `PUBLIC_FORM_ENDPOINT` | HTTPS form-handler endpoint; required for active intake |

Everything prefixed with `PUBLIC_` is embedded in browser-visible output. Never put credentials or private tokens in these values.

## Quality checks

```powershell
# Astro type checking, secret scan, production and preview static verification
npm.cmd test

# Playwright route, link, responsive, mobile-menu, and axe checks
npm.cmd run test:e2e

# Production-form rendering and CTA prefill checks (never submits)
npm.cmd run test:e2e:production

# Accessibility subset only
npm.cmd run test:a11y

# Desktop Lighthouse checks against an indexable local build
npm.cmd run lighthouse
```

The first browser-test run needs Chromium, installed by `npm.cmd run test:browsers`. CI installs it automatically.

Static verification builds both configurations. It checks required routes, metadata, the custom 404, sitemap behavior, local asset and link targets, repository-subpath safety, and the preview's lack of an active form.

## GitHub Pages preview

The workflow in `.github/workflows/deploy-pages.yml` runs checks, builds the site with `PUBLIC_PREVIEW_MODE=true`, and deploys it on pushes to `main` or a manual run. Pull requests run checks without deploying.

Before the first deployment:

1. Push this project to a GitHub repository whose default branch is `main`.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Push `main` or run **Test and deploy preview to GitHub Pages** from the Actions tab.

The Astro configuration derives the Pages origin and repository base path from GitHub's environment, so internal navigation and assets work for both `owner.github.io/repository/` projects and root user sites.

GitHub Pages is appropriate here only as a temporary, non-indexed proof of concept. Before launching the business site publicly, move it to a host whose terms and form-processing controls fit commercial use, set the real domain and HTTPS form endpoint, review the privacy and terms copy, and explicitly use `PUBLIC_PREVIEW_MODE=false`.

## Content and launch safeguards

- Keep first-contact messages high level; sensitive case information should not be sent through an unvetted form service.
- Do not publish licensing, insurance, credential, or coverage claims until the exact jurisdiction and current status are verified.
- Before accepting employment background-screening assignments, confirm the FCRA-compliant operating workflow, required client certifications and authorizations, and whether Right Hand or a screening partner is acting as the consumer reporting agency.
- Confirm the exact IME-related tasks and electronic-surveillance-detection equipment, training, and inspection scope before making more specific capability claims.
- The process-service link points to the separate Right Hand Professional Process Service website.
- Review the phone number, email address, legal entity name, service area, policy dates, analytics/consent needs, and form data-retention terms before production.

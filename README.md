# Right Hand Private Investigator

A fast, accessible Astro site for Right Hand Private Investigator, published at https://righthandpi.com. Local previews are marked `noindex, nofollow` and disable the inquiry form; the Pages workflow explicitly builds production at the domain root.

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

# Production-form and CTA checks (submission intercepted locally)
npm.cmd run test:e2e:production

# Accessibility subset only
npm.cmd run test:a11y

# Desktop Lighthouse checks against an indexable local build
npm.cmd run lighthouse
```

The first browser-test run needs Chromium, installed by `npm.cmd run test:browsers`. CI installs it automatically.

Static verification builds both configurations. It checks required routes, metadata, the custom 404, sitemap behavior, local asset and link targets, repository-subpath safety, and the preview's lack of an active form.

## GitHub Pages production deployment

The workflow in `.github/workflows/deploy-pages.yml` runs checks and deploys on pushes to `main` or a manual run. Pull requests run checks without deploying. Production uses `PUBLIC_SITE_URL=https://righthandpi.com`, `PUBLIC_BASE_PATH=/`, and `PUBLIC_PREVIEW_MODE=false`. The explicit root base is required for the custom domain; a repository subpath breaks CSS, images, and navigation there.

Before the first deployment:

1. Push this project to a GitHub repository whose default branch is `main`.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Set the custom domain to `righthandpi.com`, then push `main` or run **Test and deploy website to GitHub Pages** from the Actions tab.

The Astro configuration still supports repository-subpath previews when the production overrides are absent.

## Contact form delivery

Production posts to `https://formsubmit.co/righthandpi.id@gmail.com`. A repository or `github-pages` environment variable named `PUBLIC_FORM_ENDPOINT` can override that endpoint. The form retains FormSubmit's default CAPTCHA, uses its `_honey` spam field, and returns visitors to `https://righthandpi.com/thank-you/`. Phone and email links remain available.

FormSubmit requires one-time mailbox activation. Submit the deployed form once and click the confirmation link sent to `righthandpi.id@gmail.com` (check spam as well). Then send a test inquiry and confirm receipt. Browser checks intercept submission locally and do not send email or prove inbox delivery. See [FormSubmit setup](https://formsubmit.co/) and [documentation](https://formsubmit.co/documentation).

## Content and launch safeguards

- Keep first-contact messages high level; sensitive case information should not be sent through an unvetted form service.
- Do not publish licensing, insurance, credential, or coverage claims until the exact jurisdiction and current status are verified.
- Before accepting employment background-screening assignments, confirm the FCRA-compliant operating workflow, required client certifications and authorizations, and whether Right Hand or a screening partner is acting as the consumer reporting agency.
- Confirm the exact IME-related tasks and electronic-surveillance-detection equipment, training, and inspection scope before making more specific capability claims.
- The process-service link points to the separate Right Hand Professional Process Service website.
- Review the phone number, email address, legal entity name, service area, policy dates, analytics/consent needs, and form data-retention terms before production.

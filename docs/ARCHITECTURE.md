# WAW website architecture (as built)

Status: describes the repository as it is on 14 October 2026. It replaces the earlier proposal (Next.js, TypeScript, Tailwind,
next-intl, `/api/contact`), which was never built. The PRD's stack was explicitly "a proposal, not a verified match"
(`PRD.md` section 2). Routes: [SITEMAP](SITEMAP.md). Open decisions and blockers: [LAUNCH_BLOCKERS](LAUNCH_BLOCKERS.md).

## 1. Decision record

| Question | Decision | Why |
|---|---|---|
| Framework | None. A dependency-free Node static generator (`website/src/build.mjs`) | Small marketing site, infrequent edits, no server or database needed (PRD section 11) |
| Languages | `/en/` and `/ar/`, shared route slugs, `lang`/`dir` per page | PRD section 10 |
| Content | Typed local module `website/src/content.mjs`, one block per locale | No CMS justified yet; revisit only if non-developers must edit often |
| Interactivity | One small script (`main.js`), no libraries | Menu, slider, video control, form |
| Contact | Front-end form that posts JSON to `CONTACT_ENDPOINT`; no endpoint yet | Provider is an owner decision (D10, LB-03) |
| Hosting | Not selected (LB-01, LB-02) | Owner decision |

Not present, and not needed for the current scope: a framework runtime, a database, authentication, a CMS, an API server.

## 2. Repository layout (`website/`)

```
src/build.mjs        generator: pages, routing, SEO output, build modes, asset copy
src/content.mjs      all copy (EN + AR), product/project/partner/testimonial records, social links
src/origin.mjs       pure validator for the production origin
src/art.mjs          built-in brand illustrations used when no photo is supplied
src/assets/          css, js (boot, main, redirect, config is generated), fonts, img, video  -> copied to dist/assets
tests/               node:test suites (see section 6)
serve.mjs            local static preview server (not for production)
tools/               optional tooling (fonts, hero video) and archived one-off patch scripts; not part of the build
dist/                generated output (git-ignored). dist-demo/ is the demo build (git-ignored, never deploy)
```

## 3. Build modes

| Mode | Command | Behaviour |
|---|---|---|
| Default | `node src/build.mjs` | Local build. Canonical/hreflang/sitemap/robots only if `SITE_ORIGIN` is set |
| Staging | `node src/build.mjs --staging` | Every page `noindex` plus a staging marker meta; ignores `SITE_ORIGIN`; no sitemap, robots or canonical |
| Production | `npm run build:prod` | Requires a valid public https `SITE_ORIGIN`, otherwise refuses and writes nothing |
| Demo | `node src/build.mjs --demo` | Writes `dist-demo/` with sample partners/testimonials; always `noindex`; ignores `SITE_ORIGIN` |

`--staging` conflicts with `--prod` and `--demo` and is refused before anything is written. `npm run release` runs the tests and
then the production build, so a release cannot skip the origin check.

## 4. Routing and content gates

- Routes are defined once in `ROUTES` in `build.mjs`; the locale prefix is added per page. Relative links are computed per depth,
  so the output also works from a sub-folder, except the 404 pages, which use root-absolute paths (LB-20).
- Content gates: products and projects carry a `publish` flag; partners and testimonials render only if the array has entries.
  The Projects route, navigation and footer links exist only while a project is published.
- The root `/` page is a language redirect: Arabic by default, or the language saved in the browser (`redirect.js`);
  without JavaScript a `<noscript>` meta refresh goes to `/ar/`.

## 5. Contact form contract

The browser posts JSON `{name, email, company, interest, message, locale}` to `CONTACT_ENDPOINT` with a 15 s timeout.
Success is shown only for an HTTP 2xx whose JSON body is exactly `{"ok": true}`. Anything else keeps the input and offers the
company mailbox. With no endpoint configured nothing is sent and the page says so. Validation, honeypot and a 10 s client
throttle run in the browser only; server-side validation, rate limiting and spam control belong to the endpoint (LB-03).

## 6. Quality gates

`npm test` builds the default output, then runs: build invariants (`check-build`), form behaviour (`form-behavior`),
hidden projects (`projects-hidden`), production origin guard (`origin-guard`), output hygiene (`output-hygiene`),
staging mode (`staging-build`), heading hierarchy (`heading-hierarchy`) and release quality (`release-quality`: no inline
script/style, root redirect, language tagging, hero video rules, metadata lengths). Tests build into temp folders where they
need other modes. They do not replace rendered accessibility, performance or security-header testing (LB-12, LB-09).

## 7. Known constraints

- No CI or hosting configuration exists (LB-02); nothing enforces `npm run release` yet.
- Security headers and CSP are a host task. The pages contain no inline script or style, and the one inline data block
  (JSON-LD) is not executable.
- Images are temporary stock photos until the owner supplies approved media (LB-18).

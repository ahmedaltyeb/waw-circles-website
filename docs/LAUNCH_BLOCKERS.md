# WAW website launch blockers register

Status: working register for owner review. As of 12 October 2026.
Scope: decisions, evidence gaps and production blockers for the static site in `website/`.
Sources: [PRD](PRD.md) (decision table D01–D13, §16), [ASSET_INVENTORY](ASSET_INVENTORY.md), [IMPLEMENTATION_PLAN](IMPLEMENTATION_PLAN.md), [WEBSITE_TECHNICAL_AUDIT](../WEBSITE_TECHNICAL_AUDIT.md) (findings F1–F16), and the repository state after hardening Steps 1–5.

This register records and tracks. It does not resolve blockers and makes no legal, privacy, product-ownership or permission decisions.

## How to read this

**Status**
- **Open**: work or a decision is needed; nothing outside the owner is waiting on it.
- **Blocked**: cannot proceed until a named external decision, evidence or vendor choice exists.
- **Verified**: acceptance criteria were checked against repository or production evidence. Passing automated tests alone does not clear a blocker; tests protect a state, they do not supply approvals.

No owner-dependent blocker (LB-01 to LB-21) is currently **Verified**. The purely technical items LB-22, LB-25, LB-27 and LB-28 are marked "Verified fixed" because their acceptance criteria were checked by tests and rendered captures (details below). Items protected by tests are listed separately in "Guarded states" and remain blockers where owner evidence is still missing.

**Priority**: P0 = must be resolved before launch · P1 = needed for a complete, defensible launch · P2 = improvement or optional expansion.

**IDs**
- `D01`–`D13` are the owner decisions defined in PRD §16 (`docs/PRD.md:317-331`). Their meaning is quoted verbatim in the appendix; this register does not reinterpret them.
- `LB-nn` are this register's own IDs.
- `B1`–`B7` were shorthand used in the hardening plan during the working session. They are **not defined in any repository document** before this file. They map to register IDs as follows: B1 → LB-05 (D05), B2 → LB-02, B3 → LB-01, B4 → LB-06 (D07), B5 → LB-04 (D11), B6 → LB-07 (D03), B7 → LB-08.
- `F1`–`F16` are findings in `WEBSITE_TECHNICAL_AUDIT.md` §4.

**Responsible party** is given only where the PRD names a proposed role. The PRD states these are "proposed accountable owners, not claims about existing staff" (`docs/PRD.md:315`). No individual is named anywhere in the repository.

## Summary

| ID | P | Status | Blocker | Depends on |
|---|---|---|---|---|
| LB-01 | P0 | Blocked | Production domain not confirmed (B3) | owner |
| LB-02 | P0 | Blocked | Hosting and CI/deployment approach, enforcement of `build:prod` (B2) | LB-01 |
| LB-03 | P0 | Blocked | No enquiry delivery backend or mail provider | LB-02, D10 |
| LB-04 | P0 | Blocked | Privacy notice unreviewed and tied to undecided delivery | LB-03, D11 |
| LB-05 | P0 | Blocked | Project permission and evidence (D05) | owner |
| LB-06 | P0 | Blocked | Sales/accounting and pharmacy entries unconfirmed (D07) | owner |
| LB-07 | P0 | Blocked | Arabic copy not natively reviewed (D03) | reviewer named |
| LB-08 | P0 | Open | No recorded D01 approval in repo; no commit; Git identity unset (B7) | owner |
| LB-09 | P1 | Blocked | No security headers or hosting configuration | LB-02 |
| LB-10 | P1 | Open | Documentation described a different stack and a Projects page. README, ARCHITECTURE, SITEMAP and IMPLEMENTATION_PLAN updated 14 Oct; PRD and CONTENT_SPECIFICATION still describe the proposal | none |
| LB-11 | P1 | Open | Output hygiene: asset exclusions verified (README/CREDITS/`proj-*`); stale `dist-demo/` on disk and wholesale asset copy remain | none |
| LB-12 | P1 | Open | No rendered QA: accessibility, RTL, responsive, performance | LB-02 (preview) |
| LB-13 | P1 | Blocked | Terms and cookie decision (conditional P0) | LB-04, D11 |
| LB-14 | P1 | Blocked | Service deliverables and operational commitments unapproved (D09) | owner |
| LB-15 | P1 | Blocked | Lead handling process undefined (D12) | LB-03 |
| LB-16 | P1 | Blocked | WAW Circles app description approval (D08) | owner |
| LB-17 | P1 | Blocked | Brand, font licence and media rights unverified (D04) | owner |
| LB-18 | P1 | Open | Real imagery missing; temporary Unsplash stock photos are live on About, Products and the slider (corrected 14 Oct) | LB-05, LB-06, D04 |
| LB-19 | P2 | Open | Tooling debt: one-off patch scripts, no CI checks beyond tests | LB-02 |
| LB-20 | P2 | Open | 404 pages use root-absolute paths | LB-02 |
| LB-21 | P2 | Blocked | Car rental case study and optional trust evidence (D06, D13) | owner |
| LB-22 | P2 | Verified fixed | Heading order: h1 to h3 skips on How we work, Products, Your next stage (14 Oct) | none |
| LB-23 | P2 | Open | No `og:image`/Twitter card, SVG-only favicon; needs approved derived brand assets (D04) | D04 |
| LB-24 | P3 | Open (mitigated) | Hero video no longer autoplays for reduced motion, data-saver or phone viewports; not yet measured | LB-12 |
| LB-25 | P3 | Verified fixed | Arabic name on English About page tagged `lang="ar"`; decorative stock photos use empty alt (14 Oct) | none |
| LB-26 | P3 | Open (mitigated) | Root redirect: meta-refresh race removed (script, `<noscript>` fallback); host redirects and trailing-slash behaviour undocumented | LB-02 |
| LB-27 | P3 | Verified fixed | `engines` (`>=20`) and `.nvmrc` added; only Node 25 exercised | none |
| LB-28 | P1 | Verified fixed | Staging build mode (`--staging`): noindex on every page, no SEO output (13 Oct) | none |

## P0 blockers

### LB-01 · Production domain not confirmed (B3)
- **Category**: SEO / deployment
- **Issue and impact**: No approved production domain exists in the repository. Without `SITE_ORIGIN` the default build emits no canonical, hreflang, sitemap or robots files, so language alternates and indexing are unspecified. PRD risk: "Unknown domain/live-site history" (`docs/PRD.md:344`).
- **Evidence**: `website/src/build.mjs:18` (origin from env), `:142-145` (canonical/hreflang only if origin set), `:535` build message; generated `dist/` has no `sitemap.xml`/`robots.txt` (verified by listing `dist/`); `website/src/origin.mjs` and `website/tests/origin-guard.mjs` validate syntax only; PRD D02 (`docs/PRD.md:320`).
- **Required decision/action**: Owner confirms the real production domain in writing, and whether any live site or legacy routes exist (D02).
- **Responsible**: PRD proposes "Company + technical owner" (D02).
- **Acceptance**: `SITE_ORIGIN=https://<confirmed-domain> npm run build:prod` succeeds; output has self-canonical and reciprocal hreflang on every page, `sitemap.xml` listing only published routes, and `robots.txt`; domain ownership and HTTPS confirmed by the owner.
- **Status**: Blocked.
- **Dependencies**: none upstream; blocks LB-02, LB-09.
- **Note (fact)**: the guard cannot confirm that a domain is real, owned, resolving or TLS-enabled.

### LB-02 · Hosting and CI/deployment approach; enforcement of `build:prod` (B2)
- **Category**: deployment / operations
- **Issue and impact**: No hosting choice, deployment pipeline or CI exists. Nothing stops a default (non-production) `dist/` from being deployed, and the repo has no mechanism that runs `npm test` and then `npm run build:prod` before release. Preview/staging indexing control is also undefined.
- **Evidence**: no hosting or CI files found (no `.github/`, netlify/vercel/headers config) in repo root or `website/`; `website/package.json:7-8,11` (`build`, `build:prod`, `test` uses the default build); `docs/ASSET_INVENTORY.md` row "Domain / hosting / analytics / email delivery: Unselected"; PRD D10 (`docs/PRD.md:328`); `docs/IMPLEMENTATION_PLAN.md` Phase 0 (hosting row) and Phase 5.
- **Required decision/action**: Choose hosting, region and release process; require the release job to run `npm test` then `npm run build:prod` with the confirmed `SITE_ORIGIN`, deploy only that output, protect preview environments (noindex or access control), and document rollback.
- **Responsible**: PRD proposes "Technical + company owner" (D10).
- **Acceptance**: Release pipeline definition exists and is reviewed; a pipeline run fails when `SITE_ORIGIN` is invalid; deployed output contains canonical/sitemap/robots; preview is not indexable; rollback tested once.
- **Status**: Blocked.
- **Dependencies**: LB-01.

### LB-03 · Enquiry delivery: no backend endpoint or mail provider (audit F1)
- **Category**: functionality / lead capture
- **Issue and impact**: The form is now honest but cannot deliver. With no endpoint it tells the visitor nothing was sent and shows the email address; every enquiry depends on visitors writing to the mailbox themselves. No server-side validation, rate limiting or spam control exists because no server exists.
- **Evidence**: `dist/assets/js/config.js` → `"endpoint":""`; `website/src/assets/js/main.js:176-180` (not configured path), `:183-197` (success only for HTTP 2xx and `{"ok":true}`); `website/src/content.mjs:250,457` (`notConfigured`); behavior tests in `website/tests/form-behavior.mjs`; PRD §12 contract (`docs/PRD.md:224`), acceptance scenarios 5–6 (`docs/PRD.md:290-291`); `docs/ARCHITECTURE.md` §6.
- **Required decision/action**: Select a mail/form provider and endpoint approach; verify sender domain and recipient mailbox; set rate-limit and failure policy (D10). The endpoint must return JSON `{"ok": true}` only on provider acceptance.
- **Responsible**: PRD proposes "Technical + company owner" (D10).
- **Acceptance**: A real test enquiry in English and in Arabic reaches the production mailbox; failure, timeout and rate-limited cases show the fallback and keep input; success shown only on provider acceptance; no message body or full email in logs (`docs/ARCHITECTURE.md` §6).
- **Status**: Blocked.
- **Dependencies**: LB-02 (host for any function), D10 provider choice. Blocks LB-04, LB-15.
- **Limitation (fact)**: front-end behavior was verified with a simulated DOM and stub `fetch`; nothing was sent to a real service.

### LB-04 · Privacy notice unreviewed and not matched to real processing (audit F7)
- **Category**: legal / privacy
- **Issue and impact**: The notice states it is "pending final review" and says enquiries are delivered "through the email service configured for the site", a service that does not exist yet. It must match the final vendors, retention and transfers before the form is launched. PRD risk: "Privacy copy does not match processing" (`docs/PRD.md:345`).
- **Evidence**: `website/src/content.mjs:255-267` (EN), `:257` banner, `:263` "Who receives it"; AR `:462-` and banner `:464`; PRD D11 (`docs/PRD.md:329`). Statement "no analytics or advertising cookies" matches current code (language preference in `localStorage`, `website/src/assets/js/main.js` top) and the no-third-party-request test in `website/tests/check-build.mjs`; this is a technical fact, not a legal review.
- **Required decision/action**: Decide processing purposes, vendors, retention and transfers; have a qualified reviewer approve the notice in both languages; then update the text.
- **Responsible**: PRD proposes "Company + qualified reviewer" (D11).
- **Acceptance**: Reviewer sign-off recorded; notice names actual recipients and retention; "pending" banner removed by the owner; text re-checked after LB-03 provider is final.
- **Status**: Blocked.
- **Dependencies**: LB-03, D11.

### LB-05 · Project publication: permission and evidence (D05; B1; audit F2)
- **Category**: content / authorization
- **Issue and impact**: Four projects (Hajin Al Khaleej, Baytech, Flowrz, Mohmaina) were previously published without recorded client permission or evidence. They are now unpublished and absent from output, but cannot return until evidence exists. The fifth record's name ("barking me") is unconfirmed; the documents say not to auto-correct it to "Parking Me".
- **Evidence**: `website/src/content.mjs:24-29` (all `publish:false`); `website/src/build.mjs:33` (`HAS_PROJECTS`); `website/tests/projects-hidden.mjs`; PRD D05 (`docs/PRD.md:323`); `docs/ASSET_INVENTORY.md` rows "Project screenshots: Missing", "Client logos: Unconfirmed"; `docs/IMPLEMENTATION_PLAN.md` Phase 6 ("Resolve the 'barking me' name…"); source list in `waw.md` §5 ("Details to be added").
- **Required decision/action**: For each project, supply client/sector, written permission to name and show it, scope and WAW role, media rights, approved outcomes, and bilingual copy (per `docs/CASE_STUDY_TEMPLATE.md`); confirm the exact name for the fifth record.
- **Responsible**: PRD proposes "Project owners" (D05).
- **Acceptance**: Evidence recorded per project; only projects with complete evidence set to `publish:true`; the delivery-claim strings in `content.mjs` (projects `lead`, `note`, meta, home `projectsText`) reviewed at that time; `tests/projects-hidden.mjs` updated deliberately.
- **Status**: Blocked (the hidden state itself is guarded; the authorization evidence is missing).
- **Dependencies**: none; feeds LB-18, LB-21.

### LB-06 · Sales/accounting and pharmacy product entries unconfirmed (D07; B4; audit F6)
- **Category**: content / product claims
- **Issue and impact**: Both products are published ("Sales, invoicing, inventory and accounting in one system", "Pharmacy operations: sales, stock and reporting") although ownership, model, features and availability are unconfirmed. PRD requires that no unverified system capabilities render (acceptance scenario 4). Retained temporarily by owner decision during hardening (D-C).
- **Evidence**: `website/src/content.mjs:14-15` (`publish:true`), `:236-237` (EN copy), AR equivalents near `:442-443`; `website/README.md:30-31` ("need owner confirmation (PRD D07)"); PRD D07 (`docs/PRD.md:325`), scenario 4 (`docs/PRD.md:289`), risk row (`docs/PRD.md:340`).
- **Required decision/action**: Owner confirms ownership/model, features, availability and support, or sets the entries unpublished.
- **Responsible**: PRD proposes "Product owner" (D07).
- **Acceptance**: Written owner confirmation on file; public copy matches only confirmed capabilities; alternatively `publish:false` for the unconfirmed entry.
- **Status**: Blocked.
- **Dependencies**: none.

### LB-07 · Arabic copy not natively reviewed (D03; B6; audit F8)
- **Category**: content quality
- **Issue and impact**: All Arabic copy, including form states added in hardening, is a working draft. Arabic is the default locale (root redirects to `/ar/`), so unreviewed text is the first impression. Several Arabic project/product names are Latin transliterations pending decision.
- **Evidence**: `website/src/content.mjs:2` ("Arabic is a working draft that needs native review (PRD D03)"), `:452` (AR-REVIEW marker for form strings); `website/README.md:29-30`; PRD D03 (`docs/PRD.md:321`); EN/AR key parity is machine-checked in `website/tests/check-build.mjs`, which says nothing about linguistic quality.
- **Required decision/action**: Name a native Arabic reviewer; approve vocabulary, shared slugs and the Arabic-default root.
- **Responsible**: PRD proposes "Company + Arabic reviewer" (D03).
- **Acceptance**: Reviewer sign-off on every Arabic string and the form/error states; review marker removed by the owner after sign-off.
- **Status**: Blocked.
- **Dependencies**: reviewer availability.

### LB-08 · Approval record, commit and Git identity (D01; B7; audit F3)
- **Category**: governance / version control
- **Issue and impact**: PRD D01 (approve scope and permission to begin implementation) has no written record in the repository, and `docs/README.md:34` says implementation does not start without it. The hardening work was authorized in the working session, not in a repository document. The repository has no commits, the global Git identity is a placeholder, and all work is uncommitted, so there is no history or rollback.
- **Evidence**: `docs/README.md:34`; PRD D01 (`docs/PRD.md:319`); `git log` reports no commits on `main`; global `user.name` is `Your Name`; staged baseline of 41 files plus unstaged and untracked changes.
- **Required decision/action**: Owner records D01 (scope and permission) in writing, supplies an approved commit name and email, and approves the first commit after reviewing the staged diff.
- **Responsible**: PRD proposes "Company owner" (D01).
- **Acceptance**: Written D01 recorded in `docs/`; baseline committed with the approved identity; `git status` clean apart from ignored files; the PDF and WhatsApp JPEG inclusion decided (see LB-17).
- **Status**: Open.
- **Dependencies**: none.

## P1 blockers

### LB-09 · No security headers or hosting configuration (audit F9)
- **Category**: security
- **Issue and impact**: CSP, `X-Content-Type-Options`, referrer policy, HTTPS enforcement and cache rules are undefined because no host is chosen; the static site ships without any header configuration.
- **Evidence**: no headers/host config files in repo; `docs/ARCHITECTURE.md` §9 (requirements); PRD §13 "Security and privacy" (`docs/PRD.md:265`).
- **Required action**: After LB-02, add host-specific header configuration and test it against fonts, scripts and the chosen mail endpoint.
- **Responsible**: Not known (PRD: technical owner under D10).
- **Acceptance**: `curl -I` on production and preview shows the agreed headers; site works under the CSP; HTTPS only.
- **Status**: Blocked. **Depends on**: LB-02, LB-03.

### LB-10 · Stale documentation (audit F5)
- **Category**: documentation
- **Issue and impact**: Docs describe a stack and pages that do not match the build: Next.js/TypeScript/Tailwind/next-intl, an `/api/contact` route and a `validate-content.ts` gate that do not exist; Projects listed as a core route although hidden; a "pages" list that includes Projects.
- **Evidence**: `docs/ARCHITECTURE.md:12-15,53,57,96,128`; `website/README.md:12,22` (Projects page and list); `docs/SITEMAP.md:27-28`; `docs/IMPLEMENTATION_PLAN.md` (Phase 1 scaffolding steps); actual stack in `website/package.json` and `website/src/`.
- **Required action**: Update architecture, implementation plan, sitemap and README to the real static Node build, or record an ADR for the deviation; document `build:prod`, `npm test` and the hidden-projects rule.
- **Responsible**: Not known.
- **Acceptance**: A reader following the docs can build, test and release without referencing a stack that is not present.
- **Status**: Open. **Depends on**: none (final text depends on LB-02/LB-03 outcomes).

### LB-11 · Internal notes shipped in public output (audit F10; F11, F12 context)
- **Category**: output hygiene
- **Issue and impact**: `src/assets` is copied wholesale, so two internal instruction files are publicly reachable on the deployed site: `dist/assets/video/README.txt` and `dist/assets/img/slides/README.txt`. Related: a `dist-demo/` folder with sample partners/testimonials exists beside `dist/` (ignored by Git, still on disk), and dormant projects copy containing an internal note ("Images shown are illustrative and are replaced with approved screenshots") remains in source though not rendered.
- **Evidence**: `website/src/build.mjs:504` (`cpSync` of `assets`); `website/src/assets/video/README.txt`, `website/src/assets/img/slides/README.txt`; `website/src/content.mjs:229,435` (dormant note); `.gitignore:5-6`; tests `no placeholder, demo or sample content` and `projects-hidden` do not inspect `.txt` files for this purpose.
- **Required action**: Keep demo output out of any deploy directory; decide whether the dormant internal note in `content.mjs` should be reworded before projects return. (The README exclusion from the asset copy was made in Step 7.)
- **Responsible**: Not known.
- **Acceptance**: `find dist -name "*.txt"` returns only `robots.txt` when `SITE_ORIGIN` is set; deploy job takes only `dist/`.
- **Update (Step 7, 13 October 2026)**: `website/src/build.mjs:504-505` now filters files named `README.txt` (case-insensitive) out of the asset copy. `website/tests/output-hygiene.mjs` verifies, in a throw-away temp build, that no README is present in default or production output and that every other source asset is copied byte for byte. The generated `dist/` listing confirmed both files absent. The exposure was removed in the build only; no deployment has been inspected. Remaining: the asset copy is still wholesale (any other file placed in `src/assets/` will be published), the `dist-demo/` folder, and the dormant note.
- **Update (Step 8, 13 October 2026)**: Evidence on `website/dist-demo/` (read-only inspection, not modified): it is a stale build from 12 October 16:49, older than Steps 3–7. It still contains the four unpublished project names and `/en/projects/`, `/ar/projects/` pages, both internal README.txt files, sample partners/testimonials, and only 4 of 28 pages are noindex (404s and the root page); it has no canonical, sitemap or robots.txt. It is produced by `npm run demo` / `node src/build.mjs --demo` (`website/package.json:12`, `website/src/build.mjs:13`) as a sibling of `dist/`, is excluded from Git (`.gitignore:6`), and is served by `node serve.mjs --demo` (`website/serve.mjs:7`). The repo names `dist/` as the folder to deploy (`website/README.md:7`) but no deployment configuration exists, so nothing in the repo prevents a folder-based upload of `website/` or `dist-demo/`. Build change made: demo builds now mark every page `noindex`, ignore `SITE_ORIGIN` (no canonical, hreflang, og:url, sitemap or robots.txt) and exclude the READMEs; protected by `website/tests/output-hygiene.mjs`. Further evidence found while testing: untracked files added to `website/src/assets/img/` on 13 October (`CREDITS.md`, `about-1/2.jpg`, `prod-*.jpg`, `proj-*.jpg`, `slides/slide-1..4.jpg`; `CREDITS.md` states they are temporary Unsplash stock photos and not WAW work) were being copied wholesale into `dist/assets/img/`, including `CREDITS.md` and four `proj-*.jpg` files named after unpublished projects. The asset filter now also excludes exactly `CREDITS.md` and, only while no project is published, `proj-*.jpg|png|webp`; the page-referenced images are still copied. Not changed: the stale `dist-demo/` folder itself (a rebuild or removal is an owner action); wholesale asset copy; deployment settings.
- **Status**: Open. **Depends on**: none.

### LB-12 · Rendered QA not performed (accessibility, RTL, responsive, performance)
- **Category**: quality
- **Issue and impact**: All checks to date are static or simulated. Contrast, keyboard flow, screen-reader behavior, RTL visual layout, 320–1440 px layouts, 200% zoom, reduced motion and performance were never measured in a real browser. The documented Gold/Night 9.43:1 contrast figure was not re-measured.
- **Evidence**: audit §6 (`WEBSITE_TECHNICAL_AUDIT.md`), PRD §15 QA checklist (`docs/PRD.md:297-311`: "No website QA, browser performance score… has been performed"); structural checks only in `website/tests/check-build.mjs`.
- **Required action**: Run the PRD §15 checklist on a preview deployment; record results.
- **Responsible**: Not known.
- **Acceptance**: Checklist completed and recorded; no critical accessibility finding; mobile and RTL pass.
- **Status**: Open. **Depends on**: LB-02 (preview), LB-07 (final Arabic copy).

### LB-13 · Terms and cookie decision (conditional P0; D11)
- **Category**: legal
- **Issue and impact**: Only a Privacy page exists. Whether Terms of Use or cookie controls are required depends on the chosen features and vendors.
- **Evidence**: `docs/SITEMAP.md:37` ("Terms of Use… Conditional P0"); `docs/PRD.md:280` (Conditional P0); no terms route in `website/src/build.mjs` ROUTES.
- **Required decision/action**: Qualified reviewer decides requirement after provider and analytics choices.
- **Responsible**: PRD proposes "Company + qualified reviewer" (D11).
- **Acceptance**: Written decision recorded; pages built only if required.
- **Status**: Blocked. **Depends on**: LB-03, LB-04.

### LB-14 · Service deliverables and operational commitments unapproved (D09)
- **Category**: content / commitments
- **Issue and impact**: Public copy states process and commercial commitments (scope, costs and milestones "agreed in writing before build starts", "Clear scope, clear costs", four stages with approval points, support boundaries) without recorded delivery-owner approval.
- **Evidence**: `website/src/content.mjs:122,138,144` and the process/stage/service blocks; PRD D09 (`docs/PRD.md:327`); `docs/IMPLEMENTATION_PLAN.md:98` and Phase 2 row "How We Work… operational commitments reviewed (D09)".
- **Required decision/action**: Delivery owner approves or edits the stated commitments.
- **Responsible**: PRD proposes "Delivery owner" (D09).
- **Acceptance**: Written approval of the process, scope-change and support wording in both languages.
- **Status**: Blocked. **Depends on**: none.

### LB-15 · Lead handling process undefined (D12)
- **Category**: operations
- **Issue and impact**: No reply owner, qualification rule or response commitment is defined; enquiries have no operating process, and success measures cannot start.
- **Evidence**: PRD D12 (`docs/PRD.md:330`); `docs/IMPLEMENTATION_PLAN.md:98,121`.
- **Required decision/action**: Define who replies, how leads are qualified and any response-time statement (do not publish a commitment until decided).
- **Responsible**: PRD proposes "Company owner" (D12).
- **Acceptance**: Documented owner and process before launch; no unapproved response-time promise on the site.
- **Status**: Blocked. **Depends on**: LB-03.

### LB-16 · WAW Circles app description approval (D08)
- **Category**: content
- **Issue and impact**: The gifting-app entry is shown "In development"; its description and any media need owner approval, with no release schedule assumed.
- **Evidence**: `website/src/content.mjs:238` (EN entry; AR `~:444`); PRD D08 (`docs/PRD.md:326`); `waw.md` §4 (status "In development").
- **Required decision/action**: Product owner approves description, status and media.
- **Responsible**: PRD proposes "Product owner" (D08).
- **Acceptance**: Written approval; no download badge, date or capability claim beyond approved text.
- **Status**: Blocked. **Depends on**: none.

### LB-17 · Brand, font licence and media rights unverified (D04; audit F16)
- **Category**: brand / rights
- **Issue and impact**: Authoritative logo variants are not approved; font licences are not formally verified; the WhatsApp image has unknown owner/rights; the company profile PDF's repository inclusion is undecided.
- **Evidence**: PRD D04 (`docs/PRD.md:322`); `docs/ASSET_INVENTORY.md:16` (IMG-01 rights not verified) and row "Space Grotesk / Cairo font files"; `website/tools/fetch-fonts.mjs:1` (comment states Google Fonts, OFL; an assertion, not a verification); `.gitignore:13-16` (JPEG and PDF excluded from Git temporarily).
- **Required decision/action**: Brand owner approves logo variants and favicon/social derivatives; verify font licences; decide the fate of the PDF and the WhatsApp image.
- **Responsible**: PRD proposes "Brand owner" (D04).
- **Acceptance**: Written brand sign-off and licence record; rights decision for each source file.
- **Status**: Blocked. **Depends on**: none.

## P2 blockers

### LB-18 · Real imagery missing (severity raised to P1, 14 Oct 2026)
- **Issue**: About, product and slider imagery is temporary Unsplash stock photography, not WAW work. The sales card shows an analytics dashboard laptop and the pharmacy card a photo of pills, which can read as the product itself while LB-06 is unconfirmed. (Earlier text said "generated illustrations"; that was true until 13 Oct.)
- **Evidence**: `website/src/assets/img/CREDITS.md` ("temporary stock photos"); `dist/assets/img/{about-1,about-2,prod-sales,prod-pharmacy,prod-waw}.jpg` and `slides/slide-1..4.jpg`; `website/src/art.mjs` is the fallback when a file is absent.
- **Action**: Owner supplies licensed or owned images (or approves the stock photos in writing), or removes the files so the built-in illustrations return; drop replacements into `src/assets/img/` (README names the keys).
- **Acceptance**: Rights recorded (LB-17); no image implies a product UI or client work that is unconfirmed; alt text reviewed in both languages.
- **Status**: Open. **Depends on**: LB-05, LB-06, LB-17.

### LB-19 · Tooling debt
- **Issue**: Four one-off patch scripts that mutate `content.mjs` by string replacement and fail if re-run sit beside real tooling; no CI beyond local `npm test`.
- **Evidence**: `website/tools/social-proof.cjs`, `statements.cjs`, `upgrade-content.cjs`, `work-content.cjs`; no CI files.
- **Action**: Retire or archive scripts once content is final; run tests in the LB-02 pipeline.
- **Acceptance**: `website/tools/` contains only reusable tooling; CI runs `npm test`.
- **Status**: Open. **Depends on**: LB-02.

### LB-20 · Root-absolute paths on 404 pages (audit F14)
- **Issue**: Localized 404 pages reference `/assets/…` and `/en/…`; they break under sub-path hosting.
- **Evidence**: `website/src/build.mjs:518`; `website/src/origin.mjs` rejects origins with a path, consistent with root hosting only.
- **Action**: Confirm hosting is at the domain root (LB-01/LB-02); otherwise change path generation.
- **Acceptance**: 404 renders correctly at the production URL.
- **Status**: Open. **Depends on**: LB-02.

### LB-21 · Car rental case study and optional trust evidence (D06, D13)
- **Issue**: No case-study evidence, partners, certifications, client logos or testimonials exist; sections are correctly hidden.
- **Evidence**: PRD D06, D13 (`docs/PRD.md:324,331`); `website/src/content.mjs:47-48` (`partners`, `testimonials` empty); `waw.md` §6–7; `docs/CASE_STUDY_TEMPLATE.md`.
- **Action**: Owners supply evidence and permission per template; otherwise leave unpublished.
- **Acceptance**: Per-item evidence and permission recorded before any publication.
- **Status**: Blocked. **Depends on**: LB-05 pattern. Not required for core launch (`docs/IMPLEMENTATION_PLAN.md:121`).

## Findings added 14 October 2026 (production-readiness audit, reconciled)

IDs `AUD-01`..`AUD-13` from the audit map as follows and are not used elsewhere: AUD-01 → LB-18; AUD-02 → LB-02, LB-10
(`website/README.md` told operators to deploy the default build; rewritten); AUD-03 → LB-14 (copy says "Arabic, English and other languages"
at `website/src/content.mjs:110,136`; owner to confirm or narrow); AUD-04 → LB-22; AUD-05 → LB-23; AUD-06 → LB-09; AUD-07 → LB-12, LB-19;
AUD-08 → LB-24; AUD-09 → LB-25; AUD-11 → LB-26; AUD-12 → LB-27; AUD-13 → this section. **AUD-10 is withdrawn**: the "Arabic titles up to
100 characters" figure was a byte count; measured in characters every title is at most 55 (only the English "Your next stage" title, 64, exceeded 60 and was shortened).

### LB-22 · Heading order (verified fixed)
- **Evidence before**: h1 followed by h3 on `en|ar/how-we-work`, `products`, `your-next-stage` (`website/src/build.mjs` card helpers). **After**: card titles are h2 on those pages, visually unchanged (pixel-identical card regions at 1440 and 500 px, EN and AR); `website/tests/heading-hierarchy.mjs` checks the generated HTML, including the dormant Projects template.
- **Not changed**: the root `index.html` redirect page has no heading (content decision).

### LB-23 · Social share metadata and icons
- **Issue**: no `og:image`/`twitter:*`, favicon is SVG only (`website/src/build.mjs` head template).
- **Action**: needs a share image and PNG/apple-touch icons derived from the approved symbol (D04), then absolute `og:image` URLs from `SITE_ORIGIN`.
- **Acceptance**: link preview renders on a staging URL; no unapproved brand derivation.
- **Status**: Open. **Depends on**: D04, LB-01.

### LB-24 · Hero video loading
- **Change**: no `autoplay`/`preload` attributes; `main.js` starts the video only without reduced motion, without `saveData`, and above 699 px. Behaviour covered by `website/tests/release-quality.mjs` (simulated browser).
- **Open**: transfer size and Core Web Vitals are not measured in a real browser.

### LB-25 · Language tagging and alt text (verified fixed)
- **Evidence**: only untagged Arabic run on English pages was the company's Arabic name in the About facts; now `lang="ar"`; test scans all English pages. About photos use empty alt (adjacent text carries the meaning); test forbids alt text that repeats a heading.

### LB-26 · Root redirect and routing
- **Change**: `index.html` uses `assets/js/redirect.js` (saved language, default Arabic) and a `<noscript>` meta refresh, so the earlier refresh/script race is gone (tested with a simulated `localStorage`/`location`).
- **Open**: trailing-slash and 404-status behaviour are host settings (LB-02); a host-level redirect is still preferable to a client redirect.

### LB-27 · Runtime version
- **Change**: `engines.node >=20`, `.nvmrc` 20 (`website/package.json`, `website/.nvmrc`).
- **Open**: the suite has only been run on Node 25.9; run it on 20 and 22 in CI (LB-02).

### LB-28 · Staging build mode (verified fixed)
- **Evidence**: `node src/build.mjs --staging` (`website/src/build.mjs`); 17 tests in `website/tests/staging-build.mjs`. Host-layer access control is still required (documented in `website/README.md`); `noindex` does not cover images or video.

## Guarded states (protected by tests; not a substitute for the decisions above)

| State | Evidence | What it does not prove |
|---|---|---|
| No inline script or style on any page (CSP-ready); root redirect, language tagging, hero video rules, metadata lengths | `website/tests/release-quality.mjs` | That a real CSP header is configured or passes in a browser (LB-09) |
| Staging build is noindex everywhere and refuses incompatible flags | `website/tests/staging-build.mjs` | That the staging host is access-protected (LB-02) |
| Heading levels never skip on generated pages | `website/tests/heading-hierarchy.mjs` | Screen-reader experience (LB-12) |
| Projects are unpublished and absent from output in EN and AR | `website/tests/projects-hidden.mjs`, `website/src/content.mjs:24-29` | That permission or evidence exists (LB-05) |
| Form never reports success without HTTP 2xx and `{"ok":true}`; no auto-send without endpoint | `website/tests/form-behavior.mjs`, `website/src/assets/js/main.js:176-197` | That any real backend delivers mail (LB-03) |
| `build:prod` refuses missing, malformed, HTTP, placeholder, localhost and IP origins | `website/src/origin.mjs`, `website/tests/origin-guard.mjs` | That the domain is real or that releases actually use the command (LB-01, LB-02) |
| Pages, titles, H1, `lang`/`dir`, alt text, internal links and no third-party requests | `website/tests/check-build.mjs` | Rendering, accessibility or performance quality (LB-12) |

Last recorded full run: 133 tests, all passing (14 October 2026, Node 25.9). Re-run `npm test` in `website/` to refresh.

## Decisions required before implementation can continue

Remaining engineering work is limited by owner decisions, not by code. Hardening can continue only on items that need none of these:

1. **Production domain** (LB-01) and **hosting and release pipeline** (LB-02): needed to finish SEO output, headers, preview protection and release enforcement.
2. **Mail/form provider and sender/recipient** (LB-03, D10): needed before any endpoint can be built or tested.
3. **Project permissions** (LB-05, D05) and **product confirmation** (LB-06, D07): needed before the site can truthfully show work or product capabilities.
4. **Native Arabic reviewer** (LB-07, D03) and **qualified privacy reviewer** (LB-04, LB-13, D11).
5. **Written D01 approval and commit identity** (LB-08).

Work that needs no new decision: LB-10 (documentation alignment), LB-11 (output hygiene), and the QA design for LB-12.

## Open questions (not answerable from the repository)

- Is there an existing live site, domain or set of legacy URLs? (PRD D02)
- Who are the named accountable owners for each role? None are named in the repository.
- Which parts of the Step 1–5 hardening work does the owner consider covered by D01?
- Were the Hajin, Baytech, Flowrz and Mohmaina projects ever delivered by WAW, and under what client permission? The repository holds only names from `waw.md`.

## Appendix: owner decisions D01–D13, verbatim from PRD §16 (`docs/PRD.md:319-331`)

| ID | Decision / evidence needed | Proposed owner | Blocks |
|---|---|---|---|
| D01 | Approve this five-document scope, P0/P1/P2 priorities and permission to begin implementation | Company owner | All implementation |
| D02 | Identify actual code repository/live-site URL, legacy routes and desired domain; approve proposed stack after compatibility check | Company + technical owner | Final architecture, migration and SEO origin |
| D03 | Approve Arabic-default root, shared slugs, proposed vocabulary and both-language copy reviewer | Company + Arabic reviewer | Routing/content launch |
| D04 | Approve authoritative logo/wordmark variants, minimum size/clear space and derived icon/social assets; verify font licences | Brand owner | Final visual system |
| D05 | Confirm each project name/type/classification/scope, client/media permission, approved outcomes and translations | Project owners | Portfolio pages; especially “barking me” name |
| D06 | Supply full car rental case evidence, responsibilities, permission and project association if any | Case owner | Car rental and case-study launch |
| D07 | Confirm sales/accounting and pharmacy product ownership/model, features, availability, support and media | Product owner | Those two public product entries |
| D08 | Confirm WAW Circles approved description/status/media; no assumed release schedule | Product owner | Gifting-app entry approval |
| D09 | Approve service deliverables, process approvals, scope-change handling, support boundaries and pathways | Delivery owner | Public operational commitments |
| D10 | Select hosting/region and mail provider, verify sender/domain and recipient, rate limits, monitoring and failure policy | Technical + company owner | Secure working enquiry delivery |
| D11 | Decide processing purposes/vendors/retention/transfers; review Privacy, conditional Terms/cookies and optional analytics | Company + qualified reviewer | Privacy/legal launch gate |
| D12 | Define lead qualification, reply owner and any response commitment; set commercial targets after baseline | Company owner | Enquiry operations and meaningful measurement |
| D13 | Supply optional partner/certification/logo/testimonial evidence; decide Industries/Insights owner/value | Company/content owners | Optional trust and P2 expansion only |

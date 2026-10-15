# WAW website implementation plan

Status: build proposal for approval. Updated: 12 October 2026.
Authority: [PRD](PRD.md) sections 14–17. Technical detail: [ARCHITECTURE](ARCHITECTURE.md). Visuals: [DESIGN_SYSTEM](DESIGN_SYSTEM.md).

> **Superseded in part (14 October 2026):** the site was built as a dependency-free Node static generator, not with the
> framework scaffolding described in Phase 1, and the Projects/case-study items in Phase 6 are on hold pending owner evidence.
> Use [LAUNCH_BLOCKERS](LAUNCH_BLOCKERS.md) for the current list of open decisions and technical work, and
> [ARCHITECTURE](ARCHITECTURE.md) for what exists. The phase order below is kept as the original dependency reasoning.

Implementation may not start until the company owner approves the documentation and authorizes build (D01). Phases are ordered by dependency, not by calendar; no duration estimates are made because team size and approval turnaround are unknown.

## Phase 0: Approvals and prerequisites

| Task | Output | Decision |
|---|---|---|
| Owner approves docs scope and P0 launch | Written approval | D01 |
| Identify any existing repo, live URL, domain, old routes | Facts recorded in ASSET_INVENTORY | D02 |
| Choose compatible framework/tool versions and lock them | Pinned manifest in the new repo | D02 |
| Approve Arabic-default root, shared slugs, vocabulary; name Arabic reviewer | Approved vocabulary table | D03 |
| Approve logo variants, clear space, minimum size; verify font licences | Brand sign-off | D04 |
| Select hosting, region, mail provider; verify sender and recipient mailbox | Environment plan | D10 |
| Decide data purposes, vendors, retention; start privacy review | Data inventory | D11 |

Exit gate: D01–D04, D10 and D11 answered. Others may proceed in parallel.

## Phase 1: Foundation

1. Create the repository and initial commit; add `.gitignore`, `.env.example`, README.
2. Scaffold the app with the selected stack and TypeScript strict mode.
3. Configure locale routing `/en`, `/ar`, root redirect, `lang` and `dir` on `<html>`.
4. Add design tokens (colour, type, spacing) from DESIGN_SYSTEM; load self-hosted fonts.
5. Build layout shell: Header, MobileMenu, LanguageSwitch, Footer, skip link.
6. Add content schema, loaders and `validate-content` build step.
7. Add lint, type-check, unit-test and accessibility-scan scripts to CI.

Acceptance: empty bilingual shell builds, switches language, passes automated accessibility scan, and fails the build on invalid content.

## Phase 2: Core pages (P0)

| Order | Page | Dependencies |
|---|---|---|
| 1 | Home | Approved tagline, service groups, pathways, stages, product status |
| 2 | Services overview | All nine records S01–S09 bilingual |
| 3 | How We Work | Four stages; operational commitments reviewed (D09) |
| 4 | Your Next Stage | START/GROW/IMPROVE copy; no packages or prices |
| 5 | About | Company facts, values; no unverified team |
| 6 | Products | WAW Circles "In development"; other two only after D07 |
| 7 | Custom 404 | Localized recovery links |

Acceptance: PRD scenarios 1, 3, 4, 8 and 10 hold for these routes.

## Phase 3: Contact and privacy (P0)

1. Build ContactForm with accessible validation and localized states.
2. Implement `POST /api/contact` per ARCHITECTURE section 6.
3. Add honeypot and shared-store rate limiting; add challenge only if abuse justifies it.
4. Integrate the selected mail provider; implement the `mailto:` fallback.
5. Write and review Privacy page against the actual data inventory; decide Terms and cookie controls (D11).
6. Send authorized real test enquiries in English and Arabic and confirm mailbox receipt.

Acceptance: PRD scenarios 5, 6 and 9. Success is shown only on provider acceptance.

## Phase 4: SEO, quality and hardening

1. Metadata, canonical, hreflang, sitemap, robots, Open Graph, JSON-LD.
2. Security headers tested against chosen third parties.
3. Image sizing, font loading and layout-shift pass; mobile lab checks recorded.
4. Manual QA across PRD section 15: keyboard, screen reader, RTL, widths, zoom, reduced motion.
5. Preview environment protected and noindex; production environment variables set.

Exit gate: PRD QA checklist complete, owner signs off, rollback tested.

## Phase 5: Launch

1. Deploy to production from the approved repository.
2. Verify HTTPS, DNS, canonical origin and sender domain.
3. Submit one authorized live enquiry per language and confirm receipt.
4. Submit sitemap to search consoles the owner controls.
5. Begin the 30-day baseline measurement window (PRD section 3).

## Phase 6: Evidence-gated expansion (P1)

Each item ships independently when its gate passes. None blocks launch.

| Item | Gate | Records |
|---|---|---|
| Group service detail pages | Distinct approved content and FAQs | S01–S09 |
| Projects listing + details | Name, type, client permission, media rights, bilingual copy | project-hajin, project-baytech, project-flowrz, project-name-pending, project-mohmaina |
| Car rental case study | Full evidence and permission per CASE_STUDY_TEMPLATE | case-car-rental |
| Case studies listing | At least one approved case study | |

Resolve the "barking me" name before anything is published for that record; do not auto-correct to "Parking Me".

## Phase 7: Optional (P2)

Individual capability pages, Industries, Insights, analytics. Each requires an owner, evidence or maintenance capacity, and for analytics a privacy approval. Do not start without a stated user value.

## Work breakdown by role

| Role | Responsibilities |
|---|---|
| Company owner | Approvals D01, D12; release sign-off |
| Brand owner | Logo variants, icons, social image (D04) |
| Arabic reviewer | Vocabulary, all Arabic copy, form states |
| Project / product / case owners | Evidence, permissions, media (D05–D08) |
| Delivery owner | Process and support commitments (D09) |
| Technical owner | Stack versions, hosting, mail, security (D02, D10) |
| Qualified reviewer | Privacy, Terms, cookies (D11) |

Roles are proposed, not claims about existing staff.

## Definition of done (per page)

- [ ] Bilingual approved content with no placeholders.
- [ ] Unique localized title and description; one H1.
- [ ] Canonical and reciprocal hreflang; present in sitemap only if published.
- [ ] Responsive 320–1440px; RTL verified.
- [ ] Keyboard and screen-reader pass; contrast measured.
- [ ] No unsupported claim, price, timeline or logo.
- [ ] Links resolve; language switch lands on the equivalent page.
- [ ] Reviewed and signed off by the named owner.

## Open blockers carried from the PRD

D05 project details, D06 car rental evidence, D07 product models, D08 WAW Circles copy, D12 lead handling and D13 optional trust evidence remain unanswered. Core launch can proceed without D05, D06 and D13.

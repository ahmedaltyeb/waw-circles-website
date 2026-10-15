# WAW website sitemap

Status: implementation proposal for approval. Updated: 10 October 2026.
Authority: [PRD](PRD.md). Content contracts: [CONTENT_SPECIFICATION](CONTENT_SPECIFICATION.md).

> **Current state (14 October 2026):** the Projects, Project detail, Case Studies and car rental routes below are **not built**.
> The Projects route exists in the generator but is generated only while a project has `publish: true`, and none does
> ([LAUNCH_BLOCKERS](LAUNCH_BLOCKERS.md) LB-05). Terms and cookie pages are not built (LB-13). The 12 routes that are built are
> listed in [ARCHITECTURE](ARCHITECTURE.md) and `website/README.md`.

## Locale and route rules

- Use `/en` and `/ar` prefixes with matching, stable English route slugs and shared content IDs. Set document language and direction per locale.
- `/` redirects to `/ar` by default (recommended, requires approval). An explicit saved language preference can override this; avoid automatic geographic redirects.
- Language switching maps the same content ID to its published translation. If unavailable, show a localized explanation and link to the corresponding listing; never silently send users to Home.
- Only approved, bilingual, published entries appear in navigation, related links, sitemap, canonical/hreflang sets or structured data. Draft paths are not public.
- Normalize trailing slashes and redirect aliases to one canonical route. Unknown paths return HTTP 404 with localized UI, including unknown service/project slugs.

## Route inventory

`{locale}` means `en` or `ar`. P0 is the core launch; P1 is evidence-dependent expansion; P2 is optional. P1 pages may launch alongside P0 when their gates pass.

| Page | Route | Priority | Publication gate |
|---|---|---|---|
| Home | `/{locale}` | P0 | Approved bilingual copy and brand assets |
| About WAW | `/{locale}/about` | P0 | Company facts approved; omit unverified team information |
| Services overview | `/{locale}/services` | P0 | All nine capabilities described |
| Think & Design | `/{locale}/services/think-design` | P1 | Distinct needs, deliverables, process and FAQs approved |
| Build & Connect | `/{locale}/services/build-connect` | P1 | Distinct needs, deliverables, process and FAQs approved |
| Support & Continuity | `/{locale}/services/support-continuity` | P1 | Support scope and limits approved |
| Further individual services | `/{locale}/services/{slug}` | P2 | Substantive distinct content; no thin or duplicated pages |
| Projects / Portfolio | `/{locale}/projects` | P1 | At least one approved publishable project |
| Project detail | `/{locale}/projects/{slug}` | P1 | Evidence, media rights and permission complete |
| Case Studies | `/{locale}/case-studies` | P1 | At least one complete approved case study |
| Car rental mobile application | `/{locale}/case-studies/car-rental-mobile-app` | P1 | Full editorial template and permission complete |
| Other case study detail | `/{locale}/case-studies/{slug}` | P1 | Same evidence gate as car rental |
| Products | `/{locale}/products` | P0 | WAW Circles development status approved; other entries gated below |
| How We Work | `/{locale}/how-we-work` | P0 | Operational commitments reviewed |
| START / GROW / IMPROVE | `/{locale}/your-next-stage` | P0 | Pathway descriptions approved; no fixed package claims |
| Contact | `/{locale}/contact` | P0 | Valid delivery route, privacy notice and error handling |
| Privacy Policy | `/{locale}/privacy` | P0 | Actual processing inventory and qualified review |
| Terms of Use | `/{locale}/terms` | Conditional P0 | Include when reviewed site terms are required for chosen features |
| Cookie preferences | Dialog linked in footer; no dedicated URL required | Conditional P0 | Non-essential cookies/storage selected; meaningful controls implemented |
| Custom 404 | Any unmatched path | P0 | HTTP 404, localized recovery links, no indexable error content |
| Industries | `/{locale}/industries` and optional detail routes | P2 | Sector-specific evidence and maintained content |
| Insights | `/{locale}/insights` and `/{locale}/insights/{slug}` | P2 | Named editorial owner and approved useful articles |

Do not expose empty project/case-study indexes. Preserve their specifications for later release. Products may launch with WAW Circles alone; sales/accounting and pharmacy entries require availability, delivery-model and supported-feature approval.

## Navigation and linking

- Header: Home through logo, Services, Products, How We Work, About, language switch, primary “Discuss your project / ناقش مشروعك” contact CTA. Add Projects when its gate passes; mobile menu contains the same destinations.
- Footer: legal identity, supplied email and address, licence number, About, Services, Products, How We Work, Your Next Stage, Contact, Privacy; conditional Terms and Cookie preferences. Add Case Studies when available.
- Home: service groups → Services; pathways → Your Next Stage; products → Products; approved work → project/case detail; final CTA → Contact.
- Service details → related service group, approved projects/cases, Contact with a validated interest preselection.
- Project details → related services and, if linked by evidence, a case study. Case studies → associated project and Contact.
- Pathway cards use `#start`, `#grow`, `#improve` within Your Next Stage. Contact can preserve these interests without placing enquiry text or email in URLs.
- No partner page, product downloads, app-store badges, empty logo grids or blog links at launch without evidence.

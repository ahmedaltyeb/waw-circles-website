# WAW Circles website product requirements

Version: 1.0 documentation draft for approval. Updated: 10 October 2026.
Company: Waw Circles Technologies FZE LLC / واو سيركلز للتقنيات.
Phase: documentation only. Implementation is not authorized by this document; obtain approval before starting website work.

## 1. Executive summary

Create a premium, clear, bilingual Arabic/English website that presents WAW as a UAE technology company, explains services and delivery, and generates qualified enquiries. Build credibility through accurate company information and approved work, never invented proof. Match the supplied identity and support Arabic RTL from the start.

The launch should use a small maintainable architecture: a proposed Next.js App Router, TypeScript, Tailwind CSS and next-intl frontend with local reviewed content and a server-side enquiry delivery endpoint. No database, CMS or custom business backend is justified by current requirements. This stack is a proposal, not a verified match to an existing application: the inspected workspace contains source materials only.

Core pages may launch once bilingual content, enquiry delivery and privacy handling are approved. Projects, case studies and detailed service pages have separate content gates. The required car rental case study remains an editorial draft until its actual story and permission are supplied. WAW Circles must always be described as in development until its owner approves a status change.

## 2. Evidence, authority and repository assessment

### Status convention

- **Confirmed/supplied:** facts supplied by the user's task, supported where applicable by the company sources; not an independent licence or external verification.
- **Recommendation:** proposed product/technical decision for approval; not an existing company practice.
- **Assumption:** planning basis to validate before implementation.
- **Unresolved:** missing evidence or decision; cannot become a public claim.

Source precedence: user task → supplied company materials → future verified evidence. The task overrides `waw.md` suggestions to add pricing or partners. Its instruction to confirm availability overrides the source's “Offered” status for two system products. Source examples of car rental booking/fleet/payments/admin are editorial prompts, not delivered features. Source market-landscape lists are unverified and excluded from website claims.

Inspected: `waw.md` in full; SVG source; eight-page profile text; user-visible PNG references; root file inventory. JPEG content and PDF visual layout were not audited. No application files, `package.json`, lockfile, `docs`, `.git` or `AGENTS.md` were present. Initial Git check: not a Git repository. No packages were installed. No live-site URL was supplied; the claim in `waw.md` that an Arabic landing page exists is not a live-site audit. No stack versions or current deployment compatibility can be confirmed here.

Documentation map:

| Document | Responsibility |
|---|---|
| [SITEMAP.md](SITEMAP.md) | Authoritative route inventory, priorities, navigation and locale mapping |
| [CONTENT_SPECIFICATION.md](CONTENT_SPECIFICATION.md) | Page content contracts, nine service records, bilingual vocabulary and publishing model |
| [CASE_STUDY_TEMPLATE.md](CASE_STUDY_TEMPLATE.md) | Evidence-based case study template and car rental editorial tasks |
| [ASSET_INVENTORY.md](ASSET_INVENTORY.md) | Source/asset inventory, five project records and rights checklist |

## 3. Business objectives and success measures

| Objective | Measure | Definition and launch treatment |
|---|---|---|
| Professional company presentation | Content/fact completeness | 100% of public company facts, brand uses and claims approved in both languages |
| Qualified enquiries | Qualified enquiries per month; qualified share | Business owner labels accepted enquiries against defined need, scope fit and real contactability; no lead target invented |
| Clear services and pathways | Service-to-contact and pathway-to-contact journeys | Measure anonymous CTA events if analytics approved; review enquiry relevance with owner |
| Demonstrate verified work | Published approved references | Count permission/evidence-complete projects and case studies; zero fabricated claims |
| Explain products honestly | Product enquiries and status accuracy | All published status/features approved; no gifting-app availability ambiguity |
| Bilingual usability | Task completion and parity checks | Both languages support discovering services, switching pages and sending an enquiry |
| Transparent expectations | Scope/process review | No unapproved prices, timelines, support commitments or package inclusions |

Proposed evaluation: establish first 30 days of valid measurement after launch, review monthly, then agree commercial targets. Conversion denominator is measured visits to Contact; numerator is accepted form submissions. Report provider acceptance separately from qualified leads. Exclude known bots/internal traffic where feasible. Without approved analytics, use owner-reviewed enquiries and delivery logs; do not pretend unmeasured traffic is known.

## 4. Target audiences and needs

These are recommended audience hypotheses, not verified customer demographics.

| Audience | Need | Main journey |
|---|---|---|
| Founder / new venture | Clear first step, feasibility and scoped first release | Home → START → relevant service → Contact |
| SME owner / marketing lead | Credible digital presence and useful customer journeys | Services → websites/design → approved work → Contact |
| Operations / technology lead | Systems, integrations, QA and workflow improvement | Services → Build & Connect / IMPROVE → Contact |
| Existing system owner | Support scope, maintenance and improvement expectations | Support → How We Work → Contact |
| Product buyer | Understand system fit, availability and delivery model | Products → product interest → Contact |
| Prospective collaborator/client evaluator | Identity, values, actual evidence and approach | About → verified work → How We Work → Contact |

Arabic and English are equally supported across journeys. Validate audience priorities and enquiry qualification with the company owner before final copy approval.

## 5. Company identity, brand and content principles

| Fact | Supplied value |
|---|---|
| Legal name | Waw Circles Technologies FZE LLC |
| Arabic name | واو سيركلز للتقنيات |
| Country | United Arab Emirates |
| Address | Business Centre, Sharjah Publishing City Free Zone, Sharjah |
| Trade licence | 4431661.01 |
| Email | wawcircles.tech@outlook.com |
| Main tagline | Make your next move a WAW. |
| Arabic tagline | خطوتك القادمة تستحق «واو». |
| Supporting tagline | Ideas. People. Possibilities. |
| Brand line | Connection, by design. |

Palette: Night `#052E30`, Pine `#07534C`, Mint `#B8E6D5`, Gold `#FFC75B`, Paper `#F4F7F5`. Use Night/Pine as main brand surfaces, Paper as light background, Mint as support, and Gold selectively for actions and connection points. Never assume every palette pairing is accessible; measure each actual foreground/background/state. Avoid white text on Gold without a passing contrast check; Night is the proposed Gold-button text color.

Fonts: Space Grotesk for English, Cairo for Arabic, with suitable fallback stacks and mixed-script handling. Preserve existing logo/symbol proportions; do not redraw or redesign. Obtain authoritative-variant approval before icon/social asset derivation. The supplied PNG backgrounds are baked in; the white SVG is a candidate for dark surfaces. Logo clear space and minimum size remain a brand decision.

Tone: direct, useful, confident and specific. State agreed scope and dependencies. Avoid “best,” “leading,” guaranteed outcomes, invented staff credentials, testimonials, ratings or partner claims. Proposed deliverables require company approval. Omit empty trust sections entirely. Proposed Arabic translations in the content specification need linguistic approval.

## 6. Scope and complete page requirements

The complete route inventory is in SITEMAP. Required core pages are Home, About, Services, Products, How We Work, Your Next Stage, Contact, Privacy and custom 404. Required evidence-dependent specifications cover group/individual service pages, Projects/details, Case Studies/details and the dedicated car rental case study. Terms and cookie preferences are conditional on reviewed features/data processing. Industries and Insights are P2: neither has enough supplied sector evidence or editorial capacity to justify launch now.

Shared acceptance for every public page: bilingual approved content, localized CTA and metadata, responsive layout, semantic headings, working links, accessible keyboard interaction, meaningful alt text, no editorial placeholders, no unsupported claims, no broken/empty evidence sections. All indexable routes have canonical/hreflang and appear in the sitemap only when published. Specific requirements below add to this baseline.

| Page | Purpose and required content | Primary CTA | SEO requirements | Specific acceptance |
|---|---|---|---|---|
| Home | Explain company, three service groups, pathways, four stages and eligible products; approved work optional | Discuss your project → Contact | Brand/UAE proposition; unique localized metadata; verified Organization facts only | Visitor can identify offer and next step; supplied tagline/identity preserved; no empty portfolio/partner grid |
| About WAW | Company facts, values and approach; team only if approved | Discuss your project | Company identity and About metadata | Legal spelling/address/licence correct; no fabricated biographies or founding dates |
| Services overview | Show all nine capabilities in three supplied groups; explain needs and scope boundaries | Discuss your project | Actual service categories; no keyword-stuffed duplicate pages | Every service in content specification represented; details linked only when published |
| Individual service/group | Distinct problem, scope/outputs, stages, use cases, FAQs, conditional work links | Discuss this service | Unique service intent/title/description and breadcrumbs | Distinct useful content approved; no blanket inclusion, timeline or guarantee; all nine fields per service covered |
| Projects / Portfolio | Verified cards with type and client/internal/prototype/concept classification | Discuss your project | Portfolio metadata and approved names | At least one complete approved entry; filters only if useful; drafts excluded |
| Project detail | Name, permitted client/sector, problem, WAW role, delivered features, conditional stack/results and media | Discuss a similar project | Project-specific metadata; no fake review/award schema | Permission/evidence complete; image rights/redaction checked; outcomes traceable |
| Case Studies | Help buyers assess evidenced delivery stories | Discuss your project | Case-study index metadata | At least one approved complete story; never link the unfinished car rental record |
| Individual case study | Follow dedicated template including car rental when ready | Discuss a similar project | Story-specific metadata; no assumed metrics | Core sections substantiated, conditional sections omitted if unverified; bilingual review and permission complete |
| Products | Explain sales/accounting, pharmacy and gifting-app editorial records with clear status/model | Ask about a product | Category/status-specific metadata; no unverified Product/Offer pricing schema | Only eligible entries render; WAW Circles visibly in development; no public download implication |
| How We Work | Explain four stages, client inputs, WAW role, outputs and approval points | Discuss your next step | Process metadata with accurate stage names | Scope/cost approval described without amounts; operational commitments reviewed |
| START / GROW / IMPROVE | Help users select an engagement pathway, not a package | Discuss your next step | Pathway metadata; no fixed-price Offer markup | Clear fit/possible outputs; interest preselection works; no promised inclusions or prices |
| Contact | Collect qualified enquiry with supplied facts, privacy link and email fallback | Send enquiry | Contact metadata; verified business data only | Valid submission accepted by provider; localized validation/failure/retry; no false success |
| Privacy | Describe actual site/enquiry data practices after review | Contact about privacy | Localized legal metadata; no promotional schema | Matches actual selected vendors, fields, retention, transfers and contact; qualified review complete |
| Terms (if required) | Reviewed conditions appropriate to actual site features | Contact WAW | Descriptive legal metadata | Requirement decision recorded; reviewed bilingual text published if needed |
| Cookie preferences (if applicable) | Control selected non-essential technologies | Save preferences | Dialog not indexable | Rejection/withdrawal works; no non-essential processing before valid choice where required; keyboard accessible |
| Custom 404 | Recover from unknown/removed routes | Return home | Noindex; HTTP 404 | Localized Home/Services/Contact links; no 200 soft-404 or sitemap entry |
| Industries (P2) | Explain evidenced sector-specific relevance | Discuss your sector | Distinct sector intent | Sector evidence, distinct content and maintenance owner exist |
| Insights (P2) | Publish useful maintained expertise | Related service / Contact | Article-specific metadata and verified author/date | Approved original articles and accountable owner; no empty blog |

## 7. Service catalogue and detail templates

Authoritative service records S01–S09 in CONTENT_SPECIFICATION contain target need, problem, proposed scope/deliverables, delivery stages, illustrative use cases, evidence-linked work policy, FAQs, CTA and bilingual requirements.

| Group | Capabilities |
|---|---|
| Think & Design | S01 Product strategy and technology consultancy; S02 Customer journey and experience design |
| Build & Connect | S03 Websites and e-commerce; S04 Mobile app design and development; S05 Applications and business systems; S06 Connected systems and automation; S07 AI-assisted workflows where justified; S08 Software testing and quality assurance |
| Support & Continuity | S09 Technical support, maintenance, updates, troubleshooting and continuous improvement within agreed scope |

AI-assisted work is explicit but conditional on suitability; it is not a default promise for every integration. Group detail pages are the recommended initial expansion. Separate capability pages only when approved content differs enough to solve a distinct buyer need. A project link requires evidence that WAW performed that service; project type alone does not establish every role.

## 8. Products, projects and case studies

### Products

- Sales/accounting systems: supplied category includes sales, invoicing, inventory and accounting. Confirm whether proprietary, reseller, configured third-party or custom delivery; actual features, availability, hosting, licences, integrations and support before public specifics.
- Pharmacy management systems: supplied category includes pharmacy sales, stock and reporting. Apply the same checks; do not infer insurance/e-claims, tax, clinical or other compliance capabilities.
- WAW Circles: company's own gifting app, in development. Approved descriptive copy may explain its gifting idea; no release date, platform availability, pricing, waitlist or app-store/download CTA without separate approval. Use Contact for enquiries.

Use a reusable product card with ID, approved bilingual name/summary, explicit status, ownership/model when verified, approved media and Contact CTA. No separate product detail routes are justified yet.

### Project inventory

| Stable record | Supplied name | Type confirmed by brief | All remaining fields |
|---|---|---|---|
| project-hajin | Hajin Al Khaleej / هجن الخليج | Mobile app | Pending |
| project-baytech | Baytech | Mobile app | Pending |
| project-flowrz | Flowrz | Project; type unresolved | Pending |
| project-name-pending | “barking me” | Project; type unresolved | Name pending; possible “Parking Me” not confirmed |
| project-mohmaina | Mohmaina | Project; type unresolved | Pending |

Every project record must capture approved name, client/sector with permission, type/classification/status, business problem, WAW scope/role, delivered features, verified stack, approved screenshots, evidenced outcomes if used, publication permission and English/Arabic status. No record currently satisfies publication readiness. Source heading “Projects Delivered” does not supply missing delivery evidence or rights.

Listing template: factual card with approved image, name, type/classification, short summary and detail link. Detail template: context/problem → WAW scope → delivered work → approved screenshots → conditional stack/results → related published services/case study → Contact. No filters until enough entries make them useful. Internal products and concept/prototype work must be visibly identified rather than mixed into delivered client claims.

### Case studies

Use CASE_STUDY_TEMPLATE for reusable structure and evidence requirements. The car rental mobile app has its own stable draft record and future route. Its client, challenge, objectives/constraints, solution, actual workflows, stack, WAW role, QA and outcomes remain editorial tasks. Do not infer its association with any of the five projects. No fabricated narrative, booking/payment feature claim or “available on request” promise. Both case-study index and detail remain unpublished until gates pass.

## 9. How We Work and engagement pathways

Stage names are supplied. Detailed inputs, deliverables and approval mechanics below are recommendations requiring operational review; they are not established company commitments.

| Stage | Expected client inputs | WAW responsibilities | Proposed deliverables | Approval point |
|---|---|---|---|---|
| Listen & Discover / نسمع ونفهم | Goals, users, context, existing assets/systems, constraints and stakeholders | Clarify needs, risks and assumptions; identify gaps | Discovery summary, initial priorities and questions | Client confirms shared understanding |
| Shape & Agree / نخطط ونتفق | Priorities, feedback, responsible approver, access constraints | Define scope/exclusions, costs, milestones, responsibilities and change process | Agreed scope/proposal and delivery plan; design direction where scoped | Written scope/cost/milestone approval before build |
| Build & Test / نطوّر ونختبر | Approved content/assets/access, consolidated feedback | Design/develop agreed work, test scoped flows, track defects and dependencies | Reviewable increments, test findings, acceptance candidate | Design/release review at agreed points; changes assessed before acceptance |
| Launch & Improve / نطلق ونواصل التحسين | Acceptance, deployment/store account access where needed, handover recipient | Coordinate agreed release/handover and separately scoped support/improvement | Release checklist, handover materials and agreed support plan | Client accepts release/handover and any ongoing support scope |

Confirm contracts, payment milestones, IP/ownership, warranties, review cadence, sign-off method, support response expectations, hosting/store ownership and change-request process before claiming them publicly. Site copy may state scope and costs are agreed, but must not imply universal prices or timelines.

| Pathway | Need | Possible scoped outputs | Boundary |
|---|---|---|---|
| START | Move an idea into a sensible next step | Plan, prototype or first release | Alternatives, not all guaranteed inclusions |
| GROW | Strengthen digital presence and customer journeys; connect tools | Scoped presence improvements, integrations or journey work | No guaranteed business growth |
| IMPROVE | Improve an existing website, app or workflow | Agreed audit/change/testing/handover work | Existing-system access/condition assessed first |

Pathways are not fixed-price packages. Any future price range must specify approved scope, assumptions, exclusions and commercial terms before publication.

## 10. Bilingual, RTL, UX and responsive requirements

- Route prefixes `/en` and `/ar`; matching shared content IDs and stable slugs. Arabic-default root redirect is a recommendation requiring approval.
- Set root `lang` and `dir`; localize all visible interface, error, success, navigation, legal and SEO content. No untranslated route or form state at launch.
- Preserve corresponding page on language switch. Missing unpublished translation gets a localized explanation and parent-listing link. Core launch content must exist in both languages.
- Use logical CSS spacing/alignment; mirror directional navigation arrows and breadcrumb order. Do not mirror logos, photos, playback controls, numerals or icons with no directional meaning.
- Isolate email, URLs, code-like licence numbers and Latin proper names as appropriate for mixed-direction display; never reverse their stored values. Use `dir="auto"` where user-input direction varies.
- Mobile-first layout; verify at 320, 375/390, 768, 1024 and 1440 CSS px and intermediate widths. No horizontal scrolling at 320px except genuinely necessary labeled content regions.
- Flexible grids and cards; navigation becomes an accessible mobile menu without hiding destinations. Long Arabic headings/errors and 200% zoom must not clip content; verify reflow at 400% where applicable.
- Clear hierarchy: one main proposition, service group discovery and primary contact action. Do not make animation necessary for reading, navigation or conversion.
- Minimum proposed primary-control touch target 44×44 CSS px; accessible spacing for other controls. Visible focus, hover, active and disabled states. Reduced-motion respects user preference.
- Forms have programmatic labels, instructions and associated errors; error summary focuses appropriately, retains input and announces state. Status/live regions do not repeatedly interrupt users.

## 11. Technical architecture proposal

### Compatibility and simplicity

Recommended stack: Next.js App Router + TypeScript + Tailwind CSS + next-intl. Compatibility is unresolved because there is no application or package manifest. Before implementation, inspect any real repository, select mutually compatible supported versions and lock them; confirm next-intl routing/rendering integration against selected framework documentation and deployment runtime. No version claims or package installation occurred in this phase.

Render marketing pages from local approved content with static generation where supported. Use minimal client JavaScript for menu, language controls, form and conditional preferences. A small server endpoint/function handles enquiries. A fully static host requires a separate reviewed serverless form service/function; browser-only delivery cannot protect credentials. Do not add a database, login, customer portal, store checkout, app backend or CMS for this marketing scope. Reconsider CMS only if nontechnical editors need frequent independent updates with governance.

Proposed future module responsibilities: localized route layouts/pages; content/schema modules; messages; templates/components; asset references; server enquiry handler and validation. Exact folder/API conventions depend on approved versions. Reusable components: Header, Footer, language switch, mobile menu, CTA, service group/card, product/status card, project card/detail, case template, process steps, pathway cards, FAQ, form fields/errors/status, breadcrumbs, social metadata and optional consent dialog.

### Content and errors

Content publishing follows CONTENT_SPECIFICATION's state/evidence model. Validate unique IDs/slugs, translations, asset paths and related links before build. Unknown locale/slugs return appropriate redirects or true 404; draft records never render. Error boundaries show localized recovery, no stack traces. Contact endpoint returns stable error codes mapped to localized copy, not vendor internals. Secrets, enquiry content and evidence notes stay server-side.

### Hosting and deployment

Assume a managed HTTPS host supporting the chosen rendering strategy and serverless request handling. Domain, host, region and vendors are unresolved. Confirm email outbound support, quotas, rate-limit storage, region/data handling and runtime limits before selection. Establish preview/staging and production environments, protected preview access/noindex, environment validation, tested rollback and DNS/TLS ownership. Deploy only from the approved future repository with documented release and rollback process. Validate production email delivery and canonical origin after deployment; do not use preview URLs as canonicals.

### Proposed environment contract

Names below describe responsibilities, not existing configured variables:

| Variable | Visibility | Purpose |
|---|---|---|
| SITE_ORIGIN | Build/server; origin is public in rendered links | Approved production HTTPS canonical origin |
| CONTACT_TO_EMAIL | Server only | Supplied company enquiry mailbox |
| CONTACT_FROM_EMAIL | Server only | Approved verified sender on delivery provider; never visitor-controlled |
| MAIL_PROVIDER_API_KEY | Secret/server only | Selected delivery credential, least privilege |
| MAIL_PROVIDER_ENDPOINT | Server config if required | Allowlisted provider destination |
| RATE_LIMIT_STORE_URL / RATE_LIMIT_STORE_TOKEN | Server config/secret if needed | Shared enforcement across serverless instances; vendor-dependent |
| CHALLENGE_SECRET_KEY | Secret/server only, conditional | Spam challenge verification if chosen |
| CHALLENGE_SITE_KEY | Public, conditional | Challenge widget identity; never its secret |
| ANALYTICS_SITE_ID | Public, conditional | Approved analytics property, no secret credential |

Use placeholder-only example environment files; keep real secrets outside source control and frontend bundles. Production/staging credentials separated; keys rotated and access restricted. Missing mail config fails safely with email fallback, never false success. Do not assume Microsoft/Outlook SMTP access is enabled for the supplied mailbox.

## 12. Contact form: functional and secure delivery contract

Proposed fields and constraints for approval:

| Field | Required | Validation |
|---|---|---|
| Name | Yes | Trim Unicode-aware text; 1–100 characters; accept Arabic and international names |
| Email | Yes | Reasonable syntax validation; maximum 254 characters; no client-only trust |
| Company | No | Maximum 150 characters |
| Interest | No | Allowlisted service/product/pathway ID plus “not sure”; no arbitrary hidden target |
| Message | Yes | 10–3000 characters after trimming; plain text; no sensitive-data request |
| Locale | System | `en` / `ar` only |

No attachments, phone, newsletter or budget requirement at launch. Budget ranges may be added only if approved and should not be fabricated pricing. Present a short processing notice and Privacy link; do not treat a checkbox as automatic legal justification. Any required acknowledgement wording depends on qualified review of actual processing.

Submission sequence: accessible client validation → POST to server endpoint → enforce method/origin/size/schema/spam controls → compose plain-text or safely escaped message → provider accepts delivery → return accepted status → clear form on success only. Server repeats all validation. Proposed body cap 16 KB; reject oversized requests. Rate limits proposed at 5 attempts per 10 minutes per risk key plus global controls, tuned for shared networks and valid users; shared storage/vendor decision required. Use honeypot and basic abuse signals first; add an accessible challenge only if abuse justifies it. Do not rely on in-memory limits alone in distributed/serverless deployments.

Set a fixed verified From and recipient. A validated visitor email may be Reply-To; reject CR/LF/header injection, never concatenate user text into mail headers or log it. Interest IDs and locale are validated. Enquiry content never appears in query strings, analytics events or public caches. Same-origin/CSRF protection appropriate to the selected endpoint; CORS closed to unrelated origins. A honeypot alone is insufficient protection.

States: idle, invalid, sending, accepted, rate limited, delivery failed and timeout. Prevent double clicks while sending; bounded timeouts, safe retry and duplicate/idempotency handling chosen with provider capabilities. If delivery acceptance is uncertain after timeout, avoid silently claiming success or automatically sending repeatedly. Preserve input and offer supplied mailto fallback. Log only operational request IDs, time, outcome and minimal abuse metadata with approved retention; never credentials, message bodies or full email by default. Provider acceptance is not proof of inbox receipt or a human response.

Email delivery provider, verified sender/domain, recipient access, reply ownership, retention and response commitment require approval. End-to-end QA must send a real authorized test to the selected destination and confirm mailbox receipt in both language workflows before launch.

## 13. SEO, accessibility, performance, privacy and analytics

### SEO

Unique approved titles/descriptions in English and Arabic; one H1 with orderly headings. Self-canonical URLs per locale, reciprocal `hreflang` `en`/`ar` for published equivalents and a consistent `x-default` aligned with the approved root strategy. XML sitemap includes published canonical pages only; exclude 404s, drafts, previews and the preferences dialog. Production robots directives allow intended content; staging is access-protected and noindex. Robots is not a confidentiality control.

Localized Open Graph/social title, description, URL, image and locale; avoid assuming an exact Arabic regional variant until approved. Approved Organization/WebSite and appropriate breadcrumb structured data may use supplied company facts; no fake ratings, awards, reviews, prices or app-download claims. Product and Article schemas only when verified content supports them. Approved alt/captions in both languages; no keyword stuffing. Redirect old-site routes only after an actual URL inventory is provided.

### Accessibility and quality target

Recommended target: WCAG 2.2 AA; this is a target requiring implementation verification, not a present certification. Text contrast at least 4.5:1 for normal text and 3:1 for large text; relevant controls/non-text state contrast at least 3:1. Keyboard access, visible unobscured focus, skip link, semantic landmarks, accessible mobile menu/dialog and screen-reader form announcements. Do not encode product status/errors solely by color. Respect reduced motion and zoom/reflow. Verify native Arabic typography, joined glyphs, punctuation, mixed scripts and RTL reading/focus order.

### Performance

Optimize correctly sized images with reserved dimensions, responsive sources and modern formats where supported. Avoid lazy loading the primary above-fold image; lazy load below-fold media. Use approved scalable logo, limited font weights, suitable fallbacks and font-loading behavior to reduce shifts. Minimize third-party scripts and client bundles; no stock-heavy carousel or background video requirement.

Proposed post-launch field goals at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Before field data exists, use documented mobile lab checks on representative pages as risk indicators, not proof of field performance. Investigate asset/JS/layout regressions and record device/network settings. No invented Lighthouse score or guarantee.

### Security and privacy

HTTPS, least-privilege secrets, server-side validation, escaped rendering, mail-header protection and spam controls. Configure appropriate CSP, framing restrictions, MIME-sniffing protection and referrer policy for selected integrations; test third-party/font/challenge needs rather than prescribe untested headers. No sensitive business/personal data requested through the public form. Public screenshots require redaction.

Map actual contact fields, hosting logs, abuse identifiers, mail provider, analytics and optional preference storage. Company owner plus qualified reviewer approve purposes, retention/deletion, vendor/region/transfer disclosures, visitor requests and notice text appropriate to actual obligations. This PRD does not assert UAE legal compliance or invent a retention period. Do not publish generic boilerplate disconnected from selected systems. No non-essential analytics/cookies by default; determine legal/consent requirements once vendors and behavior are chosen. If non-essential technology is introduced, add real rejection/withdrawal controls and prevent premature processing as required by reviewed policy. Essential-only configuration requires accurate disclosure, not a decorative consent banner.

### Analytics recommendation

Start with owner-reviewed enquiries and minimal delivery monitoring. Optional privacy-conscious aggregate analytics requires vendor/data/consent approval. Proposed events: `contact_cta_click`, `service_view`, `pathway_select`, `product_enquiry_click`, `form_submit_accepted`, `form_submit_failed`, `language_switch`. Allowed properties: locale, published page/service/product/pathway IDs, generic error code. No names, emails, message content, raw URLs containing enquiry data or fingerprinting. Record purpose and retention; condition event emission on approved consent behavior. Avoid double-counting accepted submissions. User qualification occurs in the owner's private workflow, not a new website CRM/database.

## 14. Launch priorities and release acceptance

| Priority | Scope | Gate |
|---|---|---|
| P0 | Core routes, bilingual/RTL navigation/content, supplied identity, nine service summaries, pathways/process, eligible products, working Contact/email fallback, Privacy, SEO/accessibility/security/404 | Owner content/architecture approvals, selected delivery/data handling, QA complete |
| Conditional P0 | Terms and/or cookie controls | Required by reviewed chosen features/processing |
| P1 | Three useful group service details, verified project listing/details, case-study listing/details including car rental | Evidence, media rights, bilingual approval and publication permission |
| P2 | Distinct capability detail pages, Industries, Insights, approved richer trust/media, optional analytics | Demonstrable user value, owner/maintenance capacity, evidence and privacy approval |

Required implementation acceptance scenarios:

1. On each core English/Arabic route, switching languages opens its equivalent with correct content, `lang`, `dir`, canonical and reciprocal links.
2. A draft project/case cannot be reached publicly or appear in navigation, relations, sitemap or schema; nonexistent slugs return HTTP 404.
3. Services represents all nine capabilities in the right groups, with meaningful scoped copy and no unsupported separate page.
4. Products identifies WAW Circles as in development in both languages; no download badge/link/date or unverified system capabilities render.
5. Valid contact submission reaches the approved provider and test mailbox; success is shown only on acceptance. Invalid/spam/oversized/rate-limited submissions do not trigger delivery.
6. Delivery failure/timeout preserves form input, announces localized recovery and exposes email fallback without secrets/vendor internals.
7. All public project and outcome claims have evidence/permission; client/internal/prototype/concept classification is explicit.
8. Logo/palette/fonts match approved identity; palette pairings, keyboard flows, forms and mobile/RTL layouts pass checks.
9. Actual processing matches reviewed privacy and conditional consent controls; no enquiry personal data reaches analytics/public logs.
10. No broken internal link, placeholder, empty trust grid, untranslated visible state or indexable preview remains. Company owner signs off release.

## 15. QA checklist for implementation handover

- [ ] Content: exact supplied company/legal/contact facts; evidence and permissions; product availability; no unapproved prices or commitments.
- [ ] Bilingual: all page/UI/legal/SEO states, service FAQ answers, alt/captions and proper names reviewed; Arabic shaping and mixed-direction identifiers correct.
- [ ] Routes: direct links, locale switching, published/draft/unknown paths, redirects, 404 status, related IDs, mobile navigation and footer.
- [ ] Responsive: representative mobile/tablet/desktop widths, long Arabic content, zoom/reflow, portrait/landscape; record browser/device coverage.
- [ ] Accessibility: automated scan plus manual keyboard and screen-reader review in both locales; focus, menu/dialog, errors/live regions, contrast, targets and reduced motion.
- [ ] Form: client/server validation, Arabic input, length/body limits, spam/rate limits, injection tests, duplicate attempt, failure/timeout, mail acceptance and mailbox receipt.
- [ ] Security: no client/source secrets, restrictive endpoint origin policy, selected headers, no sensitive logs, redacted media and protected previews.
- [ ] Privacy: field/vendor inventory, retention/deletion owner, approved bilingual notice, conditional consent/reject/withdraw behavior and analytics payload checks.
- [ ] SEO: unique metadata/H1, canonical/hreflang, sitemap/robots, social previews, factual schema and production origin.
- [ ] Performance: image sizes/loading, font loading, layout shift and representative mobile lab checks; field monitoring when available.
- [ ] Deployment: preview/production configuration, HTTPS, DNS/sender ownership, build validation, rollback and release owner sign-off.

This checklist describes future implementation verification. No website QA, browser performance score, deployment or functional form test has been performed during documentation-only work.

## 16. Open decisions and required approvals

Role names are proposed accountable owners, not claims about existing staff.

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

Next approval: company owner reviews the documentation and selects the core launch scope, then explicitly authorizes implementation. Missing portfolio evidence can defer P1 without blocking a truthful core site. Secure contact delivery, bilingual core content and actual privacy handling cannot be deferred if the form launches.

## 17. Risks, assumptions and dependencies

| Type | Item | Effect / handling |
|---|---|---|
| Risk | Missing project/case evidence and permission | Keep P1 unpublished; use accurate company/process information rather than invented proof |
| Risk | Product “Offered” interpreted as verified availability | Require D07; omit unapproved public specifics/entries |
| Risk | Arabic translation or RTL defects | Native-language review plus manual bilingual QA before release |
| Risk | Unsupported support/pricing/feature commitments | Approve scope; clearly distinguish proposed deliverables and agreed work |
| Risk | Mailbox/provider limitations and spam | Verify delivery configuration, abuse controls and fallback; test actual mailbox receipt |
| Risk | Unknown domain/live-site history | Obtain old routes and ownership before migrations/canonicals |
| Risk | Privacy copy does not match processing | Choose vendors first; record data map and review before launch |
| Assumption | Small reviewed marketing site with infrequent content changes | Local content first; revisit CMS only with documented editorial need |
| Assumption | No accounts, checkout, CRM or database needed | Exclude until a separately approved requirement justifies complexity |
| Dependency | Company/product/project/brand and Arabic reviewers available | Needed for accurate publishable content and final sign-off |
| Dependency | Future compatible runtime/hosting, verified email sender and font/assets rights | Validate before implementation and production release |

## 18. Documentation completion record

Created five requested Markdown files in `docs`; original sources/assets unchanged. Documents cross-reference a shared route inventory, service catalogue, status model and publishing gates. Git status was checked before and after authoring; the folder is not a Git repository, so Git cannot provide a tracked diff. Documentation checks cover required files, internal links and source preservation. Stop here; no website implementation, source changes, package installation or deployment is part of this phase.

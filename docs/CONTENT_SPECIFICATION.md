# WAW bilingual content specification

Updated: 10 October 2026. Status: implementation contract proposed for owner approval.
Related: [PRD](PRD.md), [sitemap](SITEMAP.md), [case study template](CASE_STUDY_TEMPLATE.md), [asset inventory](ASSET_INVENTORY.md).

## Editorial rules and bilingual vocabulary

Use user-supplied company facts verbatim. Write clear, credible B2B copy about customer needs and scoped delivery. Proposed deliverables below describe what a service engagement could include; they are not claims about past work or guaranteed inclusions. No pricing, turnaround times, SLAs, certifications or measured benefits without approval and evidence.

| English | Arabic | Status |
|---|---|---|
| Waw Circles Technologies FZE LLC | واو سيركلز للتقنيات | Supplied; retain exact English legal name in legal/contact context |
| Make your next move a WAW. | خطوتك القادمة تستحق «واو». | Supplied main tagline |
| Ideas. People. Possibilities. | أفكار. أشخاص. إمكانات. | English supplied; Arabic proposed for linguistic approval |
| Connection, by design. | تواصل، بتصميم مدروس. | English supplied; Arabic proposed |
| Think & Design | نفكّر ونصمّم | Proposed group translation |
| Build & Connect | نطوّر ونربط | Proposed group translation |
| Support & Continuity | الدعم والاستمرارية | Proposed group translation |
| Listen & Discover | نسمع ونفهم | Supplied |
| Shape & Agree | نخطط ونتفق | Supplied |
| Build & Test | نطوّر ونختبر | Supplied |
| Launch & Improve | نطلق ونواصل التحسين | Supplied |
| START / GROW / IMPROVE | ابدأ / توسّع / حسّن | English supplied; Arabic labels proposed |
| Discuss your project | ناقش مشروعك | Proposed primary CTA |
| In development | قيد التطوير | Product status |

Arabic copy must be written/reviewed for natural meaning, not mechanically transliterated. Proper names require approved Arabic forms; preserve a Latin proper name when none is approved. Dates, numbers, punctuation and mixed-direction text need native review. Do not copy reversed/presentation-form Arabic from extracted PDF text.

## Shared content schema and update workflow

Recommended source: typed local content modules or JSON in the future application, with shared IDs and per-locale fields. No CMS or database is needed for the documented launch. Proposed entry fields:

`id`, `kind`, `slug`, `classification`, `status`, `locales.en`, `locales.ar`, `relatedIds`, `assetIds`, `evidenceRefs`, `publicationApproval`, `reviewedAt`.

Localized fields: `title`, `summary`, `bodySections`, `ctaLabel`, `seoTitle`, `seoDescription`, `imageAlt`, `captions`, `faq`. Shared factual fields: availability, classification, feature IDs and approval state. Evidence references and approval notes stay out of public payloads.

Draft → evidence review → bilingual review → owner approval → publish. Content owner checks facts; project/product owners confirm scope; Arabic reviewer checks language; implementation owner checks schema, links and previews. Public build includes only approved entries with both locales complete. A withdrawn entry loses links and sitemap inclusion; use 410 or an appropriate redirect only when the removal policy is approved, otherwise 404. Keep reviewed source history in the future repository.

## Page content contracts

All indexable pages require unique localized title/description, one descriptive H1, canonical and reciprocal hreflang, approved social preview, semantic sections, and localized CTA. All related-content blocks are conditional on approved records. The PRD defines page acceptance criteria.

| Page | Required sections | Primary CTA | SEO content focus |
|---|---|---|---|
| Home | Main tagline, concise company proposition, three service groups, pathways, four stages, products; optional approved work; closing contact | Discuss your project | WAW company identity and UAE technology services; no unsupported superlatives |
| About | Company overview, values, identity, approach; optional approved team | Discuss your project | Brand, UAE identity and exact company facts |
| Services overview | Three groups with all nine capabilities, customer needs, boundaries, links to eligible details | Discuss your project | Service categories and actual offered scope |
| Individual service/group | Need/problem, scope, proposed deliverables, stages, use cases, related verified work, FAQs, contact | Discuss this service | Distinct service intent; no duplicated thin content |
| Projects | Introduction, verified cards, classification and optional useful filters | Discuss your project | Approved portfolio; no claims implied by unapproved client logos |
| Project detail | Summary, permitted client/sector, type, problem, scope, features, conditional stack/outcomes, approved media, related links | Discuss a similar project | Approved project name and evidenced work |
| Case Studies | Introduction and approved case summaries | Discuss your project | Evidence-backed delivery stories |
| Case study detail | Use dedicated template | Discuss a similar project | Verified subject, challenge and WAW scope |
| Products | Three editorial entries; publish only eligible ones, clear ownership/status/scope and limitations | Ask about a product | Product category and confirmed status |
| How We Work | Four stages with inputs, responsibilities, outputs and approvals; scope-change explanation | Discuss your next step | Delivery approach without unsupported speed/cost guarantees |
| Your Next Stage | START/GROW/IMPROVE needs, possible outputs, fit and contact interest | Discuss your next step | Engagement pathways; no package/pricing markup |
| Contact | Email, legal identity/address/licence, form, privacy link, errors/success, email fallback | Send enquiry | Business contact identity; no unverified opening hours/map pin |
| Privacy | Actual processing purposes, fields, vendors, retention, transfers, rights/contact and update date after review | Contact about privacy | Descriptive legal-page metadata |
| Terms (conditional) | Reviewed site-use scope, IP, external links and applicable provisions | Contact WAW | Descriptive legal-page metadata |
| Cookie preferences (conditional) | Categories, purposes/vendors, accept/reject/manage and withdrawal | Save preferences | Dialog excluded from sitemap; no separate indexable page required |
| Custom 404 | Localized message, Home/Services/Contact recovery, language control | Return home | `noindex`; correct HTTP 404 |
| Industries (optional) | Specific sector needs, distinct scope and evidence | Discuss your sector | Publish only with differentiated sector content |
| Insights (optional) | Useful articles, byline, reviewed date and maintenance owner | Related service / Contact | Article-specific intent; no empty blog or invented expertise |

## Service catalogue

Nine capabilities belong to three groups. Initially keep them as overview sections; group detail pages are P1 if useful content is approved. Separate capability pages are P2 and require a distinct need, actual scope, deliverables, process, use cases and FAQs. Shared stage shorthand: Discover → Agree → Build/Test → Launch/Improve, expanded in PRD.

### Think & Design

**S01 Product strategy and technology consultancy / استراتيجية المنتج والاستشارات التقنية**
- Need/problem: founders and business decision-makers need priorities, feasibility and a sensible first release; unclear requirements or technology choices.
- Proposed scope/outputs: goals/constraints workshop, requirements summary, prioritized roadmap, first-release scope and technology options with tradeoffs; research depth agreed individually.
- Stages: discover goals/users → agree decision criteria → shape and review options/prototype where scoped → hand over roadmap and next steps.
- Use cases: new product planning, evaluating an existing platform, deciding what to build first.
- Related evidence: none ready; add only approved project IDs matching verified strategy work.
- FAQ prompts: What should we bring? Can you review an existing idea? Does consultancy include development? Answers must explain scoped inputs and separate implementation without quoting unapproved costs.
- CTA: Discuss your idea / ناقش فكرتك. Both locales need equivalent deliverables, exclusions, FAQ answers and SEO.

**S02 Customer journey and experience design / رحلة العميل وتصميم التجربة**
- Need/problem: product/operations teams face confusing onboarding, purchase or support journeys.
- Proposed scope/outputs: journey map, friction assessment, user flows, wireframes/prototype and design handover; user research and testing only if agreed.
- Stages: understand users/context → agree journeys → design/review/test scoped flows → hand over decisions and implementation priorities.
- Use cases: onboarding, checkout, self-service, support experience.
- Related evidence: none ready; project/case links require verified design scope.
- FAQs: Can you improve an existing journey? Will users be interviewed? Does this include development? State scoped research and separate build agreement.
- CTA: Discuss your customer journey / ناقش رحلة عميلك. Both locales need the same research boundaries and design deliverables.

### Build & Connect

**S03 Websites and e-commerce / المواقع والمتاجر الإلكترونية**
- Need/problem: businesses need a credible site or clearer purchasing journey; outdated content and disconnected channels.
- Proposed scope/outputs: approved page/commerce requirements, responsive UI, implementation, scoped integrations, testing and handover. Payments, catalog migration, hosting and ongoing content management require explicit agreement.
- Stages: discover audience/content → agree pages/features → build and test → launch and hand over.
- Use cases: company website, online store, customer portal, web platform.
- Related evidence: none ready; no named commerce platform or conversion claim without evidence.
- FAQs: Who supplies content? Are payments/integrations included? Who manages hosting? Document responsibility allocation and scope dependencies.
- CTA: Discuss your website / ناقش موقعك. Both locales specify page, content and commerce responsibilities.

**S04 Mobile app design and development / تصميم تطبيقات الجوال وتطويرها**
- Need/problem: businesses need useful mobile journeys and a feasible first release.
- Proposed scope/outputs: flows, prototype, agreed platform build, integrations, test evidence and release handover; app-store submission and ownership are scoped.
- Stages: discover use/context → agree platforms/release → build/test → approved distribution and handover.
- Use cases: customer-facing mobile service, booking experience, business field tool; examples are illustrative.
- Related evidence: Hajin Al Khaleej and Baytech are type-confirmed candidates, still unpublished. Car rental requires full case evidence.
- FAQs: Which platforms? Who owns store accounts? Is maintenance included? Answer only after operational approval; no assumed native/cross-platform stack.
- CTA: Discuss your app / ناقش تطبيقك. Both locales distinguish prototype, release and support commitments.

**S05 Applications and business systems / التطبيقات وأنظمة الأعمال**
- Need/problem: operations teams need clearer workflows and access to business information.
- Proposed scope/outputs: process/role requirements, scoped application or dashboard, access design, data/import plan, testing and handover; migration and training agreed.
- Stages: map operations → agree users/data/scope → build/test workflows → hand over and scoped improvement.
- Use cases: operations tools, dashboards, web apps and tested prototypes.
- Related evidence: no validated project mapping; products are separate records, not client-work proof.
- FAQs: Can existing data be migrated? Which systems integrate? Who manages user access? Confirm constraints rather than promise universal compatibility.
- CTA: Discuss your business system / ناقش نظام أعمالك. Both locales include data, access and migration boundaries.

**S06 Connected systems and automation / تكامل الأنظمة والأتمتة**
- Need/problem: repetitive handoffs and disconnected tools create operational friction.
- Proposed scope/outputs: workflow map, integration feasibility, agreed connectors, exception handling, test plan and handover; third-party access/licences required.
- Stages: discover systems/data → agree integration boundaries → build/test normal and failure flows → release and monitor within scope.
- Use cases: transferring approved data between tools, reducing manual handoffs, notifications.
- Related evidence: none ready; omit unsupported time-saving metrics.
- FAQs: Can you connect our tools? What happens when an external API fails? Who pays third-party fees? Answer based on verified access and agreed responsibility.
- CTA: Discuss your workflow / ناقش إجراءات عملك. Both locales explain dependencies and failure handling.

**S07 AI-assisted workflows where justified / إجراءات عمل مدعومة بالذكاء الاصطناعي عند الحاجة**
- Need/problem: teams need help with suitable repetitive knowledge tasks, with clear data and review boundaries.
- Proposed scope/outputs: suitability assessment, scoped pilot, evaluation criteria, human review and fallback design; provider/data handling and limits approved before work.
- Stages: assess need/data → agree pilot and success criteria → build/evaluate with representative cases → hand over approved workflow and limitations.
- Use cases: draft assistance or document triage, explicitly illustrative and subject to suitability.
- Related evidence: none ready; no model, accuracy, autonomy or confidentiality guarantees.
- FAQs: Is AI necessary? Who reviews outputs? Where is data processed? Explain assessment and approval, not automatic AI adoption.
- CTA: Explore a suitable workflow / ناقش إجراء عمل مناسباً. Both locales explain human review, limits and third-party dependencies.

**S08 Software testing and quality assurance / اختبار البرمجيات وضمان الجودة**
- Need/problem: teams need confidence in agreed critical flows and visibility into defects before release.
- Proposed scope/outputs: scoped test plan, selected functional/responsive/regression checks, defect report and retest summary. Security audits, load tests and certification are separate unless agreed.
- Stages: discover release risks → agree coverage/environments → test/report/retest → summarize release evidence and remaining risks.
- Use cases: pre-launch review, changed critical flows, existing-app assessment.
- Related evidence: car rental only if QA responsibilities are verified; none ready now.
- FAQs: What is covered? Will issues be fixed? Does testing guarantee zero defects? Explain coverage, separate remediation scope and no absolute guarantee.
- CTA: Discuss testing needs / ناقش احتياجات الاختبار. Both locales state coverage and exclusions identically.

### Support & Continuity

**S09 Technical support, maintenance and continuous improvement / الدعم التقني والصيانة والتحسين المستمر**
- Need/problem: owners need help troubleshooting, updating and improving an existing system within agreed boundaries.
- Proposed scope/outputs: initial review, agreed support scope, issue/change log, fixes or updates, verification and handover notes. Hours, response targets, emergency coverage, monitoring and backup responsibilities are unresolved.
- Stages: understand system/access → agree support limits → diagnose/change/test → review outcomes and further improvements.
- Use cases: maintenance, updates, troubleshooting, user guidance and incremental improvements.
- Related evidence: none ready; do not imply all prior projects have ongoing support.
- FAQs: Can you support an existing system? What is included? How quickly will you respond? Explain assessment/scope; omit response promise until approved.
- CTA: Discuss support needs / ناقش احتياجات الدعم. Both locales carry identical limits and no implied 24/7 support.

## Products and project contracts

| Product ID | Supplied scope | Safe publication treatment | Missing decisions |
|---|---|---|---|
| product-sales-accounting | Sales, invoicing, inventory, accounting | Editorial category description only after owner approval; no assumed bundled feature, compliance or availability claims | Delivery model, ownership/vendor relationship, supported features, deployment, availability, support, pricing and approved screenshots |
| product-pharmacy | Pharmacy sales, stock, reporting | Same evidence gate; no insurance/e-claims, clinical, tax or regulatory compliance assertions | Same as above plus pharmacy-specific integration/feature evidence |
| product-waw-circles | Company's own gifting app; in development | Explicit “In development / قيد التطوير”; Contact enquiry CTA only | Final supported features, release/platform/distribution plans, approved media; no download buttons/date promises |

Project card contract: approved name, verified type/classification, one factual summary, approved image/alt, detail link. Detail contract: inventory fields in ASSET_INVENTORY plus related services, localized metadata and CTA. No fabricated metrics/testimonials or technologies. Do not force every project into a case study; a case study requires the deeper evidence contract.

## Forms and system copy

All labels, instructions, validation, pending/success/failure, spam-retry states, privacy links and fallback copy must exist in both locales. Proposed examples for review:

| State | English | Arabic |
|---|---|---|
| Submit | Send enquiry | أرسل استفسارك |
| Pending | Sending your enquiry… | جارٍ إرسال استفسارك… |
| Accepted | Your enquiry was received. | تم استلام استفسارك. |
| Failure | We could not send your enquiry. Please try again or email us. | تعذّر إرسال استفسارك. حاول مرة أخرى أو راسلنا بالبريد الإلكتروني. |
| Invalid email | Enter a valid email address. | أدخل عنوان بريد إلكتروني صالحاً. |
| Rate limited | Please wait a moment before trying again. | يرجى الانتظار قليلاً قبل المحاولة مرة أخرى. |

Success copy appears only after delivery service accepts the message. Do not claim a human read it or promise a response time. No newsletter checkbox or marketing consent at launch unless separately requested and reviewed.

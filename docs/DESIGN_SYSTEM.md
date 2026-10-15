# WAW website design system

Status: build proposal for approval. Updated: 12 October 2026.
Authority: [PRD](PRD.md) sections 5, 10 and 13. Implementation: [ARCHITECTURE](ARCHITECTURE.md).

Rules here derive only from the supplied identity (palette, fonts, symbol). Logo clear space, minimum size and derived icons need brand-owner approval (D04).

## 1. Colour tokens

| Token | Hex | Role |
|---|---|---|
| `night` | `#052E30` | Primary dark surface, text on light, text on Gold |
| `pine` | `#07534C` | Secondary dark surface, headings on light |
| `mint` | `#B8E6D5` | Support surface, text on dark surfaces |
| `gold` | `#FFC75B` | Actions and connection points only |
| `paper` | `#F4F7F5` | Light page background |

### Measured contrast (WCAG relative luminance)

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| Night | Paper | 13.52 | Body text on light |
| Pine | Paper | 8.28 | Headings, links on light |
| Night | Mint | 10.64 | Text on mint panels |
| Night | Gold | 9.43 | Button label |
| Mint | Night | 10.64 | Body text on dark |
| Gold | Night | 9.43 | Links/accents on dark |
| Gold | Pine | 5.77 | Large or bold accents on Pine |
| Mint | Pine | 6.52 | Body text on Pine |
| White | Pine | 8.93 | Body text on Pine |

Do not use:

- White or Paper text on Gold (1.43–1.55:1).
- Gold, Mint or Paper as text on each other (1.13–1.43:1).
- Night on Pine for text (1.63:1); use it only as a decorative layered surface.

Targets: 4.5:1 normal text, 3:1 large text and UI component boundaries. Re-measure any new pairing, state (hover, disabled, focus) or gradient before use. Never signal status by colour alone.

## 2. Typography

| Role | English | Arabic |
|---|---|---|
| Family | Space Grotesk | Cairo |
| Fallback | system sans-serif stack | system Arabic sans-serif stack |
| Weights | 400, 500, 700 (limit to what is used) | 400, 600, 700 |

Proposed scale (fluid between mobile and desktop; confirm in design review):

| Style | Mobile | Desktop | Line height |
|---|---|---|---|
| Display / H1 | 32px | 56px | 1.15 |
| H2 | 26px | 40px | 1.2 |
| H3 | 20px | 28px | 1.3 |
| Body | 16px | 18px | 1.6 |
| Small | 14px | 14px | 1.5 |

Arabic text gets roughly 5–10% more line height than Latin and is never letter-spaced or italicized. Do not apply uppercase or tracking transforms to Arabic. Self-host subsets, use `font-display: swap` with metric-matched fallbacks, and test joined glyphs and mixed-script lines.

## 3. Spacing, layout and shape

- 4px base unit; scale 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Container max width about 1200px; side gutter 16px on mobile, 24px tablet, 32px desktop.
- Breakpoints: 640, 768, 1024, 1280. Mobile-first. Verify at 320, 375/390, 768, 1024, 1440.
- Radius: 8px controls, 16px cards, full circle for the brand circle motif.
- Use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`, `text-start`) everywhere so RTL needs no overrides.

## 4. Brand use

- Symbol: "W/A" mark in a circle with a tail and a gold dot. Do not redraw, recolour the dot, rotate or stretch.
- On Night/Pine surfaces use the supplied white SVG (`waw-white.svg`). Light-surface variant is not yet supplied; request it before building a light header.
- Gold is reserved for actions and the connection dot. Do not use it as a large background.
- Circle motif: use circles as quiet decorative shapes (Mint/Pine at low emphasis), `aria-hidden`, no text overlap that harms contrast.
- Do not mirror the logo in RTL.

## 5. Components

### Button

| Variant | Fill | Label | Use |
|---|---|---|---|
| Primary | Gold | Night | One per view region: "Discuss your project" |
| Secondary | Transparent, 2px Night or Mint border | Night or Mint | Supporting actions |
| Text link | none | Pine on light, Gold on dark, underlined | Inline navigation |

Minimum target 44×44 CSS px. States: default, hover, focus-visible (2px Gold ring with 2px Night offset on dark; Pine ring on light), active, disabled (not the only cue), loading (label changes, button inert).

### Cards

Service card, product card, project card, pathway card share one frame: surface, 16px radius, 24px padding, title, summary, optional status chip, optional link. Product cards always show the status chip ("In development / قيد التطوير" for WAW Circles). Whole-card links need one accessible name and one focusable target.

### Header and navigation

- Logo, Services, Products, How We Work, About, language switch, primary CTA.
- Mobile menu: button with `aria-expanded`, focus trapped while open, Escape closes, same destinations as desktop.
- Skip-to-content link is the first focusable element.
- Current page marked with `aria-current="page"` and a non-colour cue.

### Forms

- Visible labels above fields; no placeholder-only labels.
- Required marked in text, not only an asterisk colour.
- Inline error below the field, linked with `aria-describedby`; error summary at top receives focus on submit failure.
- Input keeps its value on failure. Direction `dir="auto"` for free-text fields; email and URL fields stay LTR.
- Status region is polite and announces once.

### Process steps, FAQ, breadcrumbs

- Process: four numbered steps in a list; vertical on mobile, horizontal on wide screens; numerals do not mirror.
- FAQ: native `details`/`summary` or a button-controlled accordion with correct ARIA.
- Breadcrumbs: ordered list; separator icon flips in RTL.

## 6. RTL rules

- Mirror: layout order, chevrons and arrows, breadcrumb order, slide/carousel direction, text alignment.
- Do not mirror: logo, photographs, media playback controls, numerals, checkmarks, icons with no directional meaning.
- Isolate email, URLs, licence number `4431661.01` and Latin names with `<bdi>` or `dir="ltr"` so values never display reversed.
- Test with long Arabic headings, wrapped CTAs and 200% zoom.

## 7. Motion

- Subtle only: fade/translate under 250ms for entrance, focus and hover feedback.
- Respect `prefers-reduced-motion`: remove transforms and parallax, keep instant state changes.
- Nothing essential depends on animation. No autoplay carousels or background video at launch.

## 8. Imagery and iconography

- Only approved, rights-cleared assets. No stock-photo trust signals, no placeholder logo grids.
- One icon set, 24px grid, 1.5–2px stroke, inherits `currentColor`.
- Every informative image has English and Arabic alt text; decorative images use `alt=""`.
- Provide explicit width and height; do not lazy load the primary above-the-fold image.

## 9. Accessibility checklist for components

- [ ] Contrast measured for every state.
- [ ] Keyboard operable in DOM order that matches visual order in LTR and RTL.
- [ ] Visible, unobscured focus.
- [ ] Name, role, value exposed to assistive technology.
- [ ] Touch target at least 44×44 CSS px for primary controls.
- [ ] Works at 320px width and 400% reflow without two-dimensional scrolling.
- [ ] No information conveyed by colour alone.

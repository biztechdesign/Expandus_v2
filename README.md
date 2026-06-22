# Expandus Business Coaching — Homepage Handoff

## Overview
Developer handoff for the **Expandus Business Coaching** homepage — a premium, responsive marketing homepage for an SME business coaching firm. Includes 10 sections: sticky header, hero with animated SVG diagram, interactive journey track, horizontal carousel, sticky-scroll approach sequence, industries, testimonials, resources, and footer.

## About the files
The files in this bundle are **HTML/CSS/JS design references** — prototypes showing intended look and behavior. Your task is to recreate these designs in your target codebase (React, Next.js, Vue, etc.) using its established patterns, or build from scratch using these files as the spec.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are fully specified. Match the visual reference as closely as possible.

---

## Files in this package

| File | Description |
|---|---|
| `index.html` | Full static HTML — open in any browser to see the design |
| `styles.css` | All CSS — design tokens, section layouts, responsive breakpoints |
| `script.js` | All JS — menu, journey selector, approach counter, carousel, reveal |
| `assets/expandus-logo.svg` | Wordmark (purple + coral, for light backgrounds) |
| `assets/expandus-logo-footer.svg` | Wordmark (white + coral, for dark backgrounds) |

### Image files (in parent project folder, reference with `../`)

| Filename | Used in |
|---|---|
| `listening-meeting-graph-people-laptop-re-mqhv6ttp.jpg` | Events section right panel |
| `coworkers-having-work-meeting-mqhv61ku.jpg` | What We Do — photo 1 |
| `21542-mqhv85o0.jpg` | What We Do — photo 2 |
| `629-3--mqglreew.jpg` | Success stories — client avatar |
| `1488-mqglrztb.jpg` | Video testimonial thumbnail |
| `dhananjay_cleanergy-mqglsc51.jpeg` | Logo 1 |
| `samin-tekmindz-india-pvt-ltd-mqgluhy3.jpg` | Logo 2 |
| `kuro_bots_logo-mqgltaos.jpeg` | Logo 3 |
| `ssd20technologies-mqgltqd6.jpg` | Logo 4 |
| `promact20infotech20private20limited-mqglu0h9.jpg` | Logo 5 |
| `uploads/industry-it.jpg` | Industries — IT card |
| `uploads/industry-manufacturing.jpg` | Industries — Manufacturing card |

---

## Design Tokens

### Colors
| Name | Value | Usage |
|---|---|---|
| Primary purple | `#643695` | Buttons, links, focus rings, icon tiles |
| Coral accent | `#F04F53` | Eyebrows, red dot, hover highlights |
| Deep plum | `#221331` | Dark section backgrounds, footer |
| Light gray | `#F7F7F7` | Alternating section backgrounds |
| Gray border | `#E0E0E0` | Card borders, dividers |

### Typography
- **Headings / UI labels:** Montserrat (Google Fonts), 600–700 weight
- **Body / Buttons:** Mulish (Google Fonts — stands in for Gordita, a commercial font not included)

| Role | Desktop | Tablet | Mobile |
|---|---|---|---|
| H1 | 56px | 48px | 36px |
| H2 | 48px | 40px | 28px |
| H3 | 40px | 32px | 24px |
| Body | 16px | 16px | 16px |
| Eyebrow | 13px / 700 / 0.16em tracking / UPPERCASE | — | — |

### Spacing
- Section padding: **80px** top/bottom (100px hero)
- Container max-width: **1400px**, horizontal padding: **24px** each side
- Card padding: 24–32px

### Shadows
- sm: `0 2px 8px rgba(34,19,49,0.07)`
- md: `0 8px 24px rgba(34,19,49,0.12)`
- Hover lift: `translateY(-3px)` + shadow-md

### Border radius
- Standard cards: 8px | Feature cards/panels: 12px | Chips: 6px | Pills: 999px | Buttons: 3px

---

## Sections

### 1. Header (sticky, 68px)
Light bg, bottom border. Logo left, nav center, primary CTA right. Mobile (≤900px): hamburger → slide-in panel from right.

### 2. Hero
Light gradient bg + subtle square grid overlay. Two columns (1.05fr / 0.95fr).
- Left: "Move The Red Dot™" pill → H1 (coral accent on last words) → lead → two CTAs
- Right: glassmorphism card (`backdrop-filter:blur(16px)`) + 6-stage SVG staircase with animated red dot (`animateMotion`)

### 3. Transforms strip
Deep plum, 5-col grid. Each item: "From → To" in white/coral + description. Right border divider except last.

### 4. Red Dot Journey (interactive)
Light gray bg. Horizontal track of 6 stage circles + chasm separator. Click a stage → updates detail panel below (cluster SVG, stage name, description, signals). Mobile: horizontal scroll.

### 5. Events (floating split)
Background splits: top 50% = `#F7F7F7`, bottom 50% = white (section appears to float between sections).
Left 70%: dark purple panel, event list (date block + title + meta + register button), CTA.
Right 30%: image. Mobile: stacks vertically.

### 6. What We Do
White bg. Top: 2-col (photo collage left, content right). Bottom: full-width bleed carousel of 11 build-area cards. Auto-scrolls every 3.2s, pauses on hover.

### 7. Our Approach (sticky scroll)
Dark plum bg (`#221331`) + dot grid. Centered header. Two columns:
- Left (sticky `top:88px`): SVG progress ring + 01/04 counter + active step name
- Right: 4 stacked `position:sticky;top:88px` cards (z-index 1–4). Left+bottom border, last card no bottom border.
Ring formula: `strokeDashoffset = 615.75 * (1 - step/4)`.
Mobile (≤760px): 2-col hidden, accordion shown.

### 8. Industries
Light gray. 2-col image cards (340px). Dark → coral overlay on hover. Content at bottom of each card.

### 9. Success Stories
White. 2-col (testimonial quote card + video thumbnail with play button). Logo grid (5 cols) below.

### 10. Resources
Light gray. 5-col card grid: Blogs, Articles, Ebooks, Guides, Assessments.

### 11. Final CTA
Dark plum + coral radial gradient + grid overlay. Centered H2 + lead + 2 buttons.

### 12. Footer
Deep plum. 4-col grid. Bottom bar: copyright + tagline.

---

## Interactions

### Mobile menu
Hamburger → CSS `translateX(100%) → translateX(0)` slide-in panel. Overlay overlay click closes it.

### Journey track
Click stage circle → JS adds `.active` class, updates detail panel innerHTML (description, signals, cluster SVG, badges).

### Approach scroll counter
`window.scroll` listener → check each `.ap-cs` card's `getBoundingClientRect().top`. If ≤ 100 → active. Updates ring `stroke-dashoffset` and counter text.

### Build carousel
`scrollBy()` on track element. Auto-scrolls every 3.2s, wraps back to start. Pauses on hover/touch.

### Scroll reveal
`IntersectionObserver` on `[data-reveal]` elements → adds `.in` class → CSS `opacity:0 + translateY(24px)` → `opacity:1 + translateY(0)`.

---

## Responsive breakpoints

| Breakpoint | Key changes |
|---|---|
| ≤1024px | Resources 5→3 cols; footer 4→3 cols |
| ≤900px | Nav hidden, hamburger shown; hero single-col; WWD single-col; stories single-col |
| ≤760px | Events stack; industries single-col; transforms 2-col; approach: sticky cols hidden, accordion shown |
| ≤600px | CTA buttons stack full-width |
| ≤480px | Resources 1-col; logos 2-col; footer 1-col |

---

## Notes
- Body font is **Mulish** standing in for **Gordita** (commercial). Add `@font-face` with Gordita `.woff2` files when available — no other code changes needed.
- All buttons use **sentence case** — never `text-transform: uppercase` on CTAs.
- The Our Approach sticky layout requires the right column to have natural height — do not apply `overflow:hidden` to it.
- The hero diagram is pure inline SVG with `<animateMotion>` — no JS needed for the animation.

# Design renovation plan — Dentist for you

**Live site:** [https://www.dentistforyou.in/](https://www.dentistforyou.in/)  
**Codebase:** Astro + Tailwind CSS v4, hosted on Vercel  
**Date:** 15 August 2026  
**Goal:** Make every page readable first — then polish layout. The current look is premium but type is often too small, too thin, too faded, or fighting the background.

This plan is based on a full pass of Home, About, Treatments, Contact, and the four legal pages in the local project (the live domain may still be an older deploy until the latest `main` is pushed).

---

## 1. What’s going wrong

### Type system is not a system

There is no shared type scale. Each section invents sizes (`text-[9px]` through `text-[clamp(48px,8vw,140px)]`), weights (`font-black` / `extrabold` / `semibold` / `medium` / `normal`), and opacities (`/30`, `/50`, `/60`, `/70`, `/80`). Headings and body do not have a consistent relationship.

**Manrope is incomplete.** The site loads only weights **400, 600, 700, 800**. Many headings use `font-black` (900), which is **not loaded**. The browser fakes it, so titles look muddy. `font-medium` (500) is also missing.

### Contrast is below a clinic standard

| Pattern | Where | Problem |
|---|---|---|
| `text-card-blue/70` + `tracking-[0.38em]` at 11px | Almost every section eyebrow | Letter-spacing + small size + faded blue = hard to read |
| `text-heading/70` and `/80` on body | Heroes, legal, forms | Navy at 70% on white is grey, not navy |
| `text-slate-400` at 10px | Team card highlights | Fails WCAG for supporting text |
| `text-white/30`–`/50` on navy | Calculator, footer labels | Fine for decoration, not for real content |
| White text on photos/video | Highlights band, journey video | Relies on drop-shadow; still fails on bright frames |
| Huge watermark `rgba(41,64,115,0.08)` | Home, under hero | Decorative only — OK, but it crowds real copy |

### Weight and size fight each other

- Nav is `text-[20px] font-extrabold` — heavy for a header.
- Body copy is often 13–15px with `/70` opacity — too light for 40+ patients.
- Eyebrows are 11px with 0.38em tracking — looks like a watermark, not a label.
- Team supporting lines are **10px**.
- Calculator disclaimer is **9px** at `white/30`.

### Live vs local

[dentistforyou.in](https://www.dentistforyou.in/) is the production hostname. Readability work must ship there via GitHub → Vercel after this renovation, or visitors will still see the old type.

---

## 2. Page-by-page notes

### Global (header, footer, layout)

- **Header:** 20px extrabold nav is loud; logo is large. Pair a slightly smaller nav (`16–17px`, `font-semibold`) with clearer hover/active states. Frosted `bg-white/40` can wash out navy links on bright video — use a more opaque bar (`bg-white/85`).
- **Footer:** Structure is good. Keep `font-medium` on links. Labels at 11px / 55% white are the next contrast fix (`text-white/80`, 12px).
- **Layout:** Load Manrope **400, 500, 600, 700, 800**. Stop using 900 unless it is added to the Google Fonts URL.

### Home (`/`)

| Section | Issue | Direction |
|---|---|---|
| Hero video | No on-video headline (by request). Curve under header was clipping — keep the extra top offset. | Do not put body copy on the video. |
| “Not All Smiles…” | Huge `font-black` clamp to 68px. Watermark “Dentist For You” at 140px / 8% opacity. | Cap H2 at ~48–56px. Shrink or remove watermark on mobile. |
| Highlights (blue photo band) | Strong white titles, but overlay + photo can still flash. | Darken overlay slightly; keep body at 18px+ and opacity 1. |
| Services cards | Overlay copy on images (`text-[11px]` / `14px` white). | Minimum 14px; stronger scrim behind text. |
| Team card | 10px highlight subcopy; 10px “Principal Specialist”. | 13–14px body, 12px labels. |
| Calculator | 9–11px chrome; USD estimates for an India clinic. | 13px+ UI text; consider **INR**; raise disclaimer to 12px and `white/70`. |
| Testimonials | Tab + body mix of sizes; captions can go small. | Body ≥16px; captions ≥14px. |
| FAQ | Questions OK; answers 14px `/80`. | Answers 16px, full `#294073` or `/90`. |
| Booking | 11px eyebrow; 11px privacy line. | Privacy ≥13px. |

### About (`/about`)

- Hero: same 11px / 0.38em eyebrow as everywhere — standardise.
- **Journey:** Text over a 28% opacity looping video. This is a top readability risk. Add a solid/frosted panel behind copy, or drop the video under a stronger wash.
- Values / Why choose: check overlay text on photos (`IMG_6704`, `IMG_6929`).
- Team: same as Home.

### Treatments (`/treatments`)

- Hero is the most readable pattern (dark navy on white, 18–22px lead). **Use this as the template.**
- Categories / guarantees: 11px eyebrows; body `/70`–`/75`.
- Process: **9–10px “Step” labels**, 13px descriptions. Raise to 12px labels, 15–16px descriptions.
- Tags/pills: keep, but not below 12px.

### Contact (`/contact-us`)

- Hero contact rows at 13px `/70` — make 16px, full contrast.
- Form labels are OK; placeholders `/50` are faint — `/65` minimum.
- Helper under the form is 12px `/60`.

### Legal (`/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/patient-consent`)

- Body 15px `/80` is close. Target **17–18px**, line-height 1.7, color `#294073` or `#1f2a44`.
- “Last updated” `/50` is too weak.

---

## 3. Proposed type system

Put tokens in `global.css` / `@theme` and reuse classes (or a small set of utilities) instead of one-off `text-[Npx]` everywhere.

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Display / page H1 | clamp(32px, 4vw, 48px) | 700 | `#294073` | Not 68–76px except one hero if needed |
| Section H2 | clamp(28px, 3.2vw, 40px) | 700 | `#294073` | |
| Card H3 | 20–24px | 700 | `#294073` | |
| Eyebrow | 12px | 600 | `#2b5d9e` | Tracking **0.16em**, not 0.38em |
| Lead / intro | 18px / 1.6 | 400–500 | `#294073` | No `/70` |
| Body | 16px / 1.65 | 400 | `#334155` or `#294073` | |
| Small / meta | 13–14px | 500 | `#475569` | Never below 12px for real content |
| Inverse on navy | 16px | 500 | `#ffffff` | Labels `white/85`, not `/40` |
| Nav | 16–17px | 600 | `#294073` | |

**Contrast targets:** WCAG AA — body 4.5:1, large titles 3:1. Ban `opacity` on body/heading text; use solid hex.

**Font file:**  
`Manrope:wght@400;500;600;700;800`  
Map headings to `font-bold` (700) or `font-extrabold` (800) only.

---

## 4. Design renovation (beyond type)

Do this **after** the type tokens, so layout does not fight new sizes.

1. **One overlay recipe** for photo/video bands: gradient ≥ 0.75 dark on the text side; never pale text on a moving video.
2. **Header** more opaque; keep hero top radius visible (already started).
3. **Calculator** — India-facing: rupees, larger output type, readable disclaimer.
4. **Services** — if overlay copy stays, add a consistent dark gradient; otherwise move titles below the image.
5. **Mobile** — re-check every `clamp()` at 360px. Watermarks and 68px titles wrap badly.
6. **Legal** — keep the current layout; only type and line length (`max-w-3xl` is fine).
7. **Brand words** — pick one: “Dentist for you” vs “Dentist For You” vs “Dental for u”; apply in titles, footer, and alt text.

---

## 5. Implementation phases

### Phase A — Foundation (1 pass, all pages)

- Extend Google Fonts weights.
- Add CSS variables: `--text-display`, `--text-h2`, `--text-body`, `--text-muted`, `--text-on-dark`.
- Replace `font-black` with `font-extrabold` or `font-bold`.
- Replace heading/body `text-heading/70` with solid colors.

### Phase B — Home + chrome

- Header, footer, hero, highlights, services, team, calculator, FAQ, booking.

### Phase C — Inner pages

- About (especially Journey video + text).
- Treatments process/categories.
- Contact hero details + form chrome.

### Phase D — Legal + QA

- Legal body size/contrast.
- Mobile screenshot pass (360 / 390 / 768 / 1280).
- Contrast check (browser DevTools or a11y plugin).
- Deploy to Vercel so [dentistforyou.in](https://www.dentistforyou.in/) matches local.

---

## 6. Out of scope (unless you say otherwise)

- New illustrations or photography
- Rewriting all marketing copy (only type and contrast)
- CMS / WordPress migration
- Changing Astro or leaving Vercel

---

## 7. Success check

- Body copy ≥ 16px and readable on a phone at arm’s length.
- No 9–11px text except true captions/badges.
- No faded navy (`/50`–`/70`) on primary paragraphs.
- Headings use loaded font weights (no fake 900).
- Photo/video sections still readable if the image is bright.
- Live site after deploy matches this renovation.

---

## 8. Suggested first build

Start Phase A + Home header/body/eyebrows in one PR. That fixes the “not readable” feeling site-wide before any decorative layout work.

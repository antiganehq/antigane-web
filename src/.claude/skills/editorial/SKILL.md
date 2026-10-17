---
name: editorial
description: "Build magazine-grade editorial landing pages with a real serif display face, an asymmetric 12-column grid, controlled measure in ch, correct drop caps and pull quotes, hairline rules, and images that bleed and break the grid. Use when the user wants a magazine, publication, blog, essay or editorial layout, mentions serif display type, drop caps, pull quotes, hairline rules or asymmetric grids, or asks for a page that reads like print."
---

# Editorial

A landing-page system derived from print typography and magazine layout. The page
is organised by a real column grid, a serif display face carries the voice, a
measured text face carries the reading, and structure comes from hairline rules
and generous whitespace rather than boxes and shadows.

The failure mode you are guarding against is the page that *claims* to be
editorial but is really a centred, single-column blog post set in a serif font:
one uniform measure from top to bottom, no grid and no asymmetry, a drop cap
dropped onto a random paragraph for decoration, pull quotes that are just bold
text, and a full-bleed stock-photo hero that ignores the column structure
entirely. It reads as a template with the font swapped, not as a designed page.

Three things make or break it, and agents miss all three: the layout rides an
**asymmetric multi-column grid** (content does not sit in one centred column), the
type is a **display + text pairing with a deliberately controlled measure** (never
one size and one width everywhere), and structure is drawn with **hairline rules
and baseline rhythm**, not cards. Read the anti-patterns (section 13) first.

## 1. The core idea

> The grid is the page. Type is the interface. Rules are the structure.

An editorial page treats the browser like a spread. Content is placed onto a
shared column grid, and different roles occupy different spans of that grid, so
the eye moves across an **asymmetric** composition rather than straight down a
centred tube.

Four principles drive every other rule:

1. **Measure is controlled per role.** Body text sits at `62–75ch`; a standfirst
   at `45–55ch`; a caption at `28–36ch`. One universal width is the tell of a
   fake.
2. **Two typefaces, clear roles.** A serif display face for headlines and pull
   quotes; a text face (serif or humanist sans) for body. Optical sizing matters.
3. **Structure is drawn, not boxed.** Hairline rules, kickers, folios, and column
   dividers organise the page. No cards, no drop shadows, no rounded containers.
4. **Paper and ink, not white and black.** The background is warm paper, the text
   is soft ink, and a single saturated accent is used sparingly for links and marks.

## 2. Page architecture

An editorial landing page reads like the opening of a feature: a masthead, a
strong opening spread, then rhythmic article-style sections broken by full-bleed
images and pull quotes. Canonical order:

| # | Section | Grid behaviour | Purpose |
|---|---------|----------------|---------|
| 1 | Masthead | Full width, hairline bottom rule | Wordmark, thin nav, a folio-style meta line (issue/date). |
| 2 | Opening spread (hero) | Asymmetric: headline `col 1–8`, meta `col 9–12` | Serif display headline, kicker, standfirst, byline. |
| 3 | Lede / standfirst block | Text `col 2–8`, first paragraph with drop cap | Sets the argument; drop cap opens the reading. |
| 4 | Feature section A | Text left `col 1–6`, image bleeds right `col 7–12` | Alternating text/image spread. |
| 5 | Pull quote band | Quote `col 3–10`, oversized serif | A single line of the display face, rule above and below. |
| 6 | Feature section B | Image left bleed `col 1–6`, text `col 7–12` | Mirror of A; the alternation creates rhythm. |
| 7 | Index / list section | Numbered rows on a 12-col grid, hairline dividers | Editorial "contents" or feature list. |
| 8 | Gallery / plate | Full-bleed or `col 1–12` image row with captions | Images as first-class content. |
| 9 | Closing / CTA | Text `col 2–7`, restrained | A quiet sign-off, not a loud button band. |
| 10 | Colophon footer | Multi-column, hairline top rule | Credits, links, set in small caps and the text face. |

**Asymmetry is structural.** Sections deliberately alternate which columns they
occupy. A page where every section is a centred `max-w-3xl` block is the exact
failure this skill prevents.

## 3. The column grid

Editorial layout rides an explicit **12-column grid**. Define it once and place
every element by column span.

- **Container:** `max-w-[1280px] mx-auto` with `px-6 md:px-10` page margins.
- **Grid:** `grid grid-cols-12` with a **`gap-x-6` (24px) gutter** at `md`, `gap-x-8`
  (32px) at `xl`. The gutter is constant; the spans change.
- **Canonical spans** (this is where asymmetry lives):
  - Body text column: `col-span-7` starting at column 2 (`col-start-2`), leaving a
    wide right margin - not centred.
  - Headline: `col-span-8` to `col-span-10`, left-aligned to `col-start-1`.
  - Sidenote / meta / byline: `col-span-3` at `col-start-10`.
  - Full-bleed image: break the container with `w-screen` and a negative margin, or
    span `col-span-12` for an in-grid plate.
  - Two-up feature: text `col-span-5`, image `col-span-6 col-start-7`.
- **Never** place all content in a single centred column. At least the hero, one
  feature spread, and the pull quote must occupy *different* column ranges.
- The 12-column grid collapses to a single column below `md` (see section 14), but
  the desktop composition must be genuinely asymmetric first.

A quick reference for common placements:

| Role | Columns | Approx measure |
|------|---------|----------------|
| Display headline | `col-start-1 col-span-9` | 16–22 words wraps to 2–3 lines |
| Standfirst | `col-start-1 col-span-6` | `50ch` |
| Body paragraph | `col-start-2 col-span-6` | `66ch` |
| Pull quote | `col-start-3 col-span-8` | `30ch` per line |
| Caption | under its image, `col-span-3` | `32ch` |
| Byline / folio | `col-start-10 col-span-3` | `24ch` |

## 4. Type scale

Editorial type is a **pairing**: a serif display face for headlines, kickers and
pull quotes, and a text face for body. Optical sizing and measure are as important
as the size in pixels.

Recommended pairings (all self-hostable): display **GT Sectra / Canela / Fraunces
(opsz on)**; text **Freight Text / Lyon / Source Serif**, or a humanist sans like
**Söhne / Inter** if you want a serif-display + sans-text contrast. Use one display
and one text face only.

| Role | Face | Size (`clamp`) | Weight | Leading | Tracking | Measure |
|------|------|----------------|--------|---------|----------|---------|
| Display / hero | Serif display | `clamp(2.75rem, 6vw, 5rem)` | 400–500 | `1.02–1.08` | `-0.01em` | 9–11 cols |
| Section head | Serif display | `clamp(1.75rem, 3vw, 2.75rem)` | 500 | `1.1` | `-0.005em` | `24ch` |
| Standfirst | Text (or display italic) | `clamp(1.15rem, 1.6vw, 1.5rem)` | 400 | `1.4` | `0` | `50ch` |
| Body | Text | `1.125rem` (18px) | 400 | `1.6` | `0` | `66ch` |
| Pull quote | Serif display | `clamp(1.6rem, 3vw, 2.5rem)` | 400 italic | `1.15` | `-0.005em` | `30ch` |
| Caption | Text | `0.8125rem` (13px) | 400–500 | `1.4` | `0.01em` | `32ch` |
| Kicker / eyebrow | Text, small caps | `0.9375rem` (15px) | 600 | `1` | `0.08em` | short |
| Folio / byline | Text | `0.8125rem` | 500 | `1.3` | `0.02em` | `24ch` |

**Rules:**

- **Optical sizing on.** Variable display faces expose `opsz`; bind it to size
  (`font-optical-sizing: auto`) so large headlines get tighter, high-contrast
  letterforms and body text stays readable.
- **Measure is set in `ch`, per role.** Body copy `max-w-[66ch]`; never let a
  paragraph run the full 12 columns. A uniform measure everywhere is a fake tell.
- **Display face carries emphasis; do not bold body text to shout.** Emphasis is
  italic (the text face italic), not `font-bold`.
- **Numerals:** use old-style / proportional figures in running text, tabular
  lining figures in data rows (`font-variant-numeric`).
- **Real small caps** (`font-variant-caps: small-caps` on a face that has them),
  never `uppercase` + reduced size, which fakes the weight wrong. Source Serif 4,
  Freight Text and Lyon ship them; check the render, not the specimen.
- **Size small caps by their height, not the font size.** Real small caps are drawn
  at the x-height, so a `12px` kicker set in small caps is about `8px` tall and
  disappears. Set small-cap kickers, folios and nav labels at `14–15px` with
  `font-variant-caps: all-small-caps` (every letter a small cap, so the source
  text can stay in normal case) and `0.08–0.1em` tracking: a cap height of about
  `9–10px`.

## 5. Vertical rhythm and baseline grid

Editorial pages hold a **baseline rhythm**: vertical spacing is a multiple of one
line unit so text and rules align down the page.

- **Base line unit: `8px`** (or the body line-height, `~28px`, for text-heavy
  runs). Set all vertical margins as multiples: `mt-6` (24), `mt-8` (32), `mt-12`
  (48), `mt-20` (80), `mt-32` (128).
- **Body paragraph spacing:** `1em` between paragraphs, or a first-line indent
  (`text-indent: 1.5em`) with **no** space between - pick one convention and hold
  it. Never both.
- **Headings snap to the rhythm.** Space above a section head is roughly `2x` the
  space below it, so the head groups with the text it introduces.
- **Rules and captions align to the baseline** of adjacent text, not floated to
  arbitrary offsets.
- Keep a consistent `leading-relaxed` (`1.6`) for body; tighten display to
  `leading-[1.05]`. The contrast between tight display and open body is the
  editorial texture.

## 6. Colour

Editorial colour is **paper and ink with one accent** - never pure white on pure
black, which reads as a default browser page, not a printed one.

```
Light (paper)
  Paper (background)   #FBF9F4   (warm off-white, low chroma)
  Ink (body text)      #1A1815   (soft near-black, slightly warm)
  Ink muted (meta)     #6B655C   (captions, folios, secondary)
  Hairline / rule      #DAD3C7   (warm hairline, not #E5E5E5 grey)
  Accent (ink accent)  #A6301F   (oxblood) or #1F3A8A (ink blue) - links, marks

Dark (ink ground)
  Ground (background)  #17150F   (warm near-black)
  Paper (text)         #ECE7DC   (warm off-white text)
  Muted                #9A9384
  Hairline             #35312A
  Accent stays the same hue, lightened for contrast (#E0654F / #7FA0F0)
```

**Hard rules:**

- **Paper is warm, not `#FFFFFF`.** Ink is warm, not `#000000`. The slight warmth
  is the difference between "printed" and "unstyled".
- **One accent, used sparingly** - links, the drop cap, a rule mark, a marginal
  number. Not for backgrounds, not for buttons filled solid.
- **No gradients, no coloured section backgrounds, no glass.** Contrast comes from
  scale and whitespace, not colour blocks.
- **Hairlines are a warm tint of ink**, never a cold `neutral-200` grey.
- Links are the accent colour with a `1px` underline offset from the baseline
  (`underline underline-offset-4 decoration-1`), not a button.

## 7. Rules, hairlines and dividers

Rules are the structural skeleton of an editorial page - they do the work cards do
elsewhere.

- **Hairline weight is `1px`** at the accent-tinted hairline colour. A `2px`+ rule
  reads as a border, not a hairline; reserve heavier rules for one deliberate
  masthead underline.
- **Kicker rule:** a short rule (`w-12`) above or beside a section kicker, aligned
  to the cap height of the following head.
- **Column rule:** a vertical `1px` rule between a text column and a marginal note
  column (`border-l` on the sidenote), echoing a print gutter rule.
- **Folio rules:** full-width hairlines separating the masthead and footer from the
  body.
- **Rules align to the grid**, starting and ending on column boundaries, never
  floating at arbitrary widths. A rule that stops mid-gutter looks accidental.
- Use rules to open a section (rule + kicker + head) and to close a list (a final
  hairline under the last row). Do not scatter them decoratively.

## 8. Drop caps and pull quotes

Both are print devices with strict rules. Applied wrong, they are the clearest
sign of a fake editorial page.

**Drop cap:**

- **Use exactly one**, on the **first paragraph of the main body** (the lede),
  never on random paragraphs and never more than once per page.
- Build it with `::first-letter`, not a separate span, so it stays part of the
  paragraph: set `float: left`, the serif display face, a small right margin, and
  optionally the accent colour, and size it to span **3 lines** of body leading.
- **Derive the size; do not guess it.** The cap must reach from the cap height of
  line 1 to the baseline of line 3, which is two line-heights plus the text face's
  cap height. So `font-size ≈ (2 × body line-height + text cap height) ÷ display
  cap height`, all in body ems. For Fraunces over Source Serif 4 at `18px/1.6`
  that is `(3.2 + 0.66) ÷ 0.72 ≈ 5.3em`, and the verified values are
  `font-size: 5.2em; line-height: 0.74`. A float shorter than about 2.3 lines
  wraps only two lines of text: the commonly quoted `3.4em / 0.82` makes a
  two-line drop cap.
- Then align it: nudge `margin-top` until the cap's top sits on line 1's cap
  height and its serifs on line 3's baseline, and pull it left by a hair so its
  stem, not its side bearing, lines up with the text edge.
- **Never** apply a drop cap to a heading, a short paragraph (< 3 lines), a
  centred paragraph, or every section. Never fake it with a large inline letter
  that pushes the first line down.

```css
.lede::first-letter {
  float: left;
  font-family: var(--font-display);
  font-size: 5.2em;
  line-height: 0.74;
  margin: 0.06em 0.07em 0 -0.02em;
  color: var(--accent);
}
```

**Pull quote:**

- A pull quote is a **line lifted from the body**, set large in the serif display
  face, **italic**, spanning a wider or offset column range (`col-start-3
  col-span-8`) with a hairline rule above and below.
- Keep it to one or two lines (`max-w-[30ch]` per line). It is a visual rest, not a
  paragraph.
- **Never** put quotation marks in a box, never centre it inside a coloured card,
  never add a large decorative quotation-mark glyph as an icon (a small hanging
  quote is acceptable if it hangs into the margin).
- Do not confuse a pull quote with a testimonial - a pull quote repeats the
  article's own words for rhythm and emphasis.

## 9. Image treatment and captions

Images are first-class editorial content and are allowed to **break the grid**.

- **Bleeds are intentional.** A feature image bleeds to one page edge (`w-[50vw]`
  pushed past the container with a negative margin) while text holds its column, or
  a full-bleed plate spans `100vw`. In-grid images span whole column ranges
  (`col-span-6`, `col-span-12`).
- **Aspect ratios are editorial:** portrait `4:5` and `2:3` for figures, `3:2` for
  landscape plates, a tall `9:16` for a full-height opening image. Avoid the
  uniform `16:9` "hero video" ratio on every image.
- **Captions are first-class**, not afterthoughts: text face, `13px`, muted ink,
  set to `max-w-[32ch]` directly under the image, often with a small-caps credit
  (`Photograph - Name`) separated by an en dash. Every editorial image has a caption.
- **No rounded corners, no drop shadows, no borders** on images. The image is a
  plate on paper; the edge is the crop.
- **Placeholders:** use `/svg/placeholder.svg` in a correctly-proportioned
  container with `object-cover`, and still write a real caption. Never fabricate a
  stock-photo hero or a fake magazine cover.
- One image may **overlap a rule or a headline slightly** (a deliberate break), but
  most sit cleanly on column boundaries.

## 10. Navigation

- **Masthead nav is thin and typographic:** wordmark set in the display face at a
  modest size on the left, 3–5 links in the text face (small caps or `13px`) on the
  right, separated from the body by a full-width **hairline rule**.
- **No pill background, no button, no shadow, no blur.** The nav is text on paper
  with a rule under it. On scroll it may gain a paper background and keep the rule;
  it does not become a floating rounded bar.
- Links are ink with the accent on hover (underline appears), never boxed.
- A folio-style meta line is on-style beside or under the wordmark: an issue
  number, a date, a section label in small caps - it signals "publication".
- Mobile: collapse links into a single "Menu / Index" text toggle, not a hamburger
  in a rounded box; the drawer is a full-height paper panel with large serif links.

## 11. Masthead and hero

The hero is the **opening spread**, composed on the grid, not a centred stack.

- **Kicker first:** a small-caps eyebrow with a short rule (section/issue label).
- **Serif display headline**, `col-start-1 col-span-9`, 2–3 lines, left-aligned,
  tight leading. This is the largest type on the page.
- **Standfirst** (deck): one or two sentences in the standfirst role at `~50ch`,
  placed under the headline in the left columns, setting up the argument.
- **Meta column** (`col-start-10 col-span-3`): byline, date, reading time, or a
  short contents list, separated by a hairline column rule - this creates the
  asymmetry.
- **Opening image**, if present, bleeds to the right edge or sits below the spread
  as a full-bleed plate with a caption - it does not sit in a centred rounded frame.
- **No centred hero, no big filled CTA button pair.** If there is a call to action
  it is a single accent link with an underline, or a quiet outlined action low in
  the spread.

## 12. Article-style body sections

Body sections read like a feature article laid across the grid.

- **Text holds a column, not the full width.** Body paragraphs live at `col-start-2
  col-span-6` (`~66ch`); the remaining columns carry marginal notes, small images,
  or whitespace.
- **Section openers:** hairline rule, small-caps kicker, then a serif section head.
  This repeating pattern is the page's rhythm.
- **Marginalia:** short notes, statistics, or definitions set small in the outer
  column, aligned to the baseline of the paragraph they annotate, separated by a
  column rule.
- **Numbered index rows:** an editorial "list" is rows on the 12-col grid - a large
  old-style figure `col-span-1`, a title `col-span-6`, a note `col-span-4`, divided
  by hairlines - not a grid of cards.
- **Block quotes vs pull quotes:** a block quote is indented body text with a
  hanging accent rule; a pull quote is the oversized display device from section 8.
  Do not conflate them.
- Whitespace is asymmetric - a wide left or right margin is a feature, not empty
  space to be filled.

## 13. Anti-patterns - what makes a page fail this style

Everything below is a default AI-agent move. Each one alone breaks the style.

**Layout / grid**
1. A single centred `max-w-3xl`/`max-w-prose` column for the entire page - no grid,
   no asymmetry. The single most common failure.
2. Every section the same width and alignment, so the page is a vertical tube.
3. No real 12-column grid; content just stacked in a flex column.
4. Symmetric two-column splits everywhere instead of asymmetric spans.
5. Cards with borders/shadows used to group content instead of rules and whitespace.
6. `max-w-7xl` sprawling full-width text with no controlled measure.
7. Centre-aligned body paragraphs (editorial body is left-aligned, ragged right).

**Typography**
8. One typeface at one size and one width for everything.
9. A single serif with no display/text pairing and no optical sizing.
10. Uniform measure - every text block the same width top to bottom.
11. Body measure too wide (`80ch`+) so lines are hard to track.
12. `font-bold` used for emphasis in body instead of italic.
13. Fake small caps (`uppercase text-xs`) instead of real `small-caps`.
14. Lining tabular figures in running prose instead of old-style figures.
15. Justified body text with no hyphenation, creating rivers of whitespace.
16. Headline leading left at `leading-normal` instead of tight display leading.

**Drop caps / pull quotes**
17. A drop cap on a random paragraph, or on several paragraphs, or on a heading.
18. A drop cap faked with a large inline letter that shoves the first line down.
19. Pull quotes rendered as bold text, or boxed in a coloured card.
20. A giant decorative quotation-mark glyph used as an icon.
21. Pull quote centred inside its own rounded container.

**Colour / rules**
22. Pure `#FFFFFF` background and pure `#000000` text (unstyled-page look).
23. Cold grey hairlines (`neutral-200`) instead of a warm ink-tinted rule.
24. Coloured section backgrounds, gradients, or glassmorphism.
25. The accent colour used as a filled button background or large block.
26. Rules that float at arbitrary widths instead of aligning to columns.

**Imagery**
27. A full-bleed stock-photo hero that ignores the grid and has no caption.
28. Rounded corners, borders, or drop shadows on images.
29. Every image the same `16:9` ratio in a uniform grid of cards.
30. Missing captions - images treated as decoration, not content.

**Motion / misc**
31. Heavy entrance animation, parallax, or a scrolling marquee (editorial is quiet).
32. A loud filled CTA button band at the end instead of a restrained sign-off.

## 14. Responsive behaviour

A print grid must degrade **honestly** on small screens, not pretend to be a
desktop spread.

- **Below `md` the 12-column grid collapses to one column.** Every asymmetric span
  becomes `col-span-12`; content stacks in reading order. Do not try to keep a
  4-column marginal note beside body text at 375px.
- **Marginalia moves inline:** sidenotes drop below the paragraph they annotated,
  set slightly smaller, with a short rule instead of a column rule.
- **Bleeds become full-bleed:** an image that bled to one edge on desktop becomes a
  full-width `100vw` plate on mobile - honest, not cramped into a column.
- **Type scales down via `clamp()`**, but the display face stays the display face;
  the hero may drop from `5rem` to `2.5rem` and wrap to 4 lines.
- **Measure adapts:** body naturally narrows to the viewport (`~38–42ch` at 375px);
  keep `px-6` margins so lines do not touch the edge.
- **Drop cap stays** (it works at any width) but shrinks to span 3 lines of the
  smaller body leading. **Pull quotes** narrow to `col-span-12` and reduce size.
- Test at 375, 768, 1024, 1280, 1440. The desktop composition must be genuinely
  asymmetric before you check the mobile collapse.

## 15. Accessibility

- **Contrast:** warm ink `#1A1815` on paper `#FBF9F4` is ~15:1 (AAA); muted ink
  `#6B655C` on paper is ~5:1 (AA for the `13px`+ captions it is used on). Verify
  the accent link colour hits AA on paper (oxblood `#A6301F` is ~6.5:1).
- **Do not rely on the drop cap or small caps to convey meaning** - they are
  visual; the underlying text stays a normal paragraph and heading structure.
- **One `<h1>`** (the hero headline); section heads are `<h2>`/`<h3>`. Kickers are
  not headings - mark them as `<p>` or a `<span>`, not an `<h*>`, so the outline
  stays clean.
- **Pull quotes use `<blockquote>`**; captions use `<figcaption>` inside `<figure>`;
  bylines and folios use semantic text, not headings.
- **Small type has a floor:** captions and folios at `13px` minimum; never set
  editorial fine print below `12px`.
- **Links are underlined**, not colour-only, so they are distinguishable without
  the accent hue.
- Respect `prefers-reduced-motion`: any entrance fade becomes instant.

## 16. Performance

Editorial pages live or die on **webfont loading** - two custom faces with several
styles are heavy and cause layout shift if loaded naively.

- **Self-host and subset.** Serve `woff2`, subset to the glyphs you use (Latin +
  the punctuation/figures the design needs), and preload only the two files used
  above the fold (the display headline and the body regular): `<link rel="preload"
  as="font" type="font/woff2" crossorigin>`.
- **`font-display: swap`** with a **metric-matched fallback** (`size-adjust`,
  `ascent-override` on a local fallback face) so the swap from fallback to webfont
  does not shift the baseline grid. Layout shift on a text-heavy page is very
  visible.
- **Variable fonts** for the display face (one file carries weight + `opsz`) reduce
  requests versus shipping multiple static weights.
- **Do not block render** on the pull-quote or caption styles; load the display and
  body faces first, italics and small-caps second.
- **Budget: LCP < 2.2s, CLS < 0.03** (the low CLS target is the point - fonts must
  not reflow), total page weight < 1.5MB including two subset faces.
- Images are the other weight: serve AVIF/WebP, set explicit `width`/`height` on
  every plate, mark the opening image `priority` / `fetchpriority="high"`.

## 17. Implementation notes

Set the two faces and grid tokens once so the system stays consistent:

```css
@theme {
  --font-display: "Fraunces", "Georgia", serif;
  --font-text:    "Source Serif 4", "Georgia", serif;
  --color-paper:    #FBF9F4;
  --color-ink:      #1A1815;
  --color-ink-mute: #6B655C;
  --color-rule:     #DAD3C7;
  --color-accent:   #A6301F;
}
body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-text);
  font-optical-sizing: auto;
  font-variant-numeric: oldstyle-nums proportional-nums;
}
```

An asymmetric hero spread on the 12-column grid:

```tsx
<section className="mx-auto max-w-[1280px] px-6 md:px-10">
  <p className="mb-4 text-[15px] font-semibold tracking-[0.08em] text-ink-mute
                [font-variant-caps:all-small-caps]">
    Issue 07 · Field Notes
  </p>
  <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
    <h1 className="col-span-12 md:col-start-1 md:col-span-9 font-[var(--font-display)]
                   text-[clamp(2.75rem,6vw,5rem)] leading-[1.04] tracking-[-0.01em]">
      The quiet argument for slower software
    </h1>
    <p className="col-span-12 md:col-start-1 md:col-span-6 mt-6 max-w-[50ch]
                  text-[clamp(1.15rem,1.6vw,1.5rem)] leading-relaxed">
      A standfirst that sets up the piece in one or two measured sentences.
    </p>
    <div className="col-span-12 md:col-start-10 md:col-span-3 mt-6 md:mt-2
                    border-l border-rule pl-4 text-[13px] text-ink-mute">
      By A. Writer<br />March 2026 · 8 min
    </div>
  </div>
</section>
```

Body paragraph with a drop cap on the lede:

```tsx
<div className="mx-auto max-w-[1280px] px-6 md:px-10">
  <div className="grid grid-cols-12">
    <p className="lede col-span-12 md:col-start-2 md:col-span-6 max-w-[66ch]
                  text-[1.125rem] leading-[1.6]">
      The first paragraph opens the reading and carries the drop cap...
    </p>
  </div>
</div>
```

## 18. Pairs well with React Bits Pro (optional)

You do **not** need React Bits Pro to use this skill - build from scratch if the
project has none installed. If the `@reactbits-pro` and `@reactbits-starter`
registries are configured, a few items suit an editorial page when restyled:

- `@reactbits-starter/text-reveal-tw` - a quiet line-by-line reveal for the hero
  headline; keep it slow and subtle, never a bouncy stagger.
- `@reactbits-pro/gallery-*` - a plate/gallery block; strip rounded corners and
  shadows, switch to editorial aspect ratios, and add real captions.
- `@reactbits-pro/footer-*` - a multi-column colophon shell; set it in the text
  face with small caps and a hairline top rule.

Never add a dependency on them, and never let a block's default rounded, shadowed
styling survive - re-set every imported block to paper, ink, hairlines and the
type pairing.

## 19. Self-verification loop

Before reporting the page complete, **re-read the rendered output and check every
item**. If any check fails, fix it and run the loop again.

**Grid and composition**
- [ ] Is there a real 12-column grid with a constant gutter, not a stack?
- [ ] Do the hero, at least one feature spread, and the pull quote occupy
      *different* column ranges (genuine asymmetry)?
- [ ] Is body text held to a column (`~66ch`), not run full width?
- [ ] Cover the images: is the remaining layout still clearly editorial, or just a
      centred blog column? If the latter, the grid is fake.

**Typography**
- [ ] Two faces - a serif display and a text face - with optical sizing on?
- [ ] Is measure controlled *per role* (body `66ch`, standfirst `50ch`, caption
      `32ch`), not one uniform width?
- [ ] Is emphasis italic, not bold? Real small caps, not `uppercase text-xs`?
- [ ] Old-style figures in prose, tabular figures only in data rows?

**Editorial devices**
- [ ] Exactly one drop cap, on the lede, spanning 3 lines, built with
      `::first-letter`?
- [ ] Are pull quotes lifted body lines in the display italic with rules above and
      below - not bold text and not boxed cards?
- [ ] Does every image have a real caption, editorial aspect ratio, and no rounded
      corners or shadow? Does at least one image bleed the grid?

**Colour and structure**
- [ ] Paper and ink are warm (not `#FFF`/`#000`), hairlines warm-tinted?
- [ ] One accent, used only for links/marks - never a filled button or block?
- [ ] Structure drawn with hairline rules aligned to columns, not cards?

**Responsive, a11y, performance**
- [ ] Verified at 375, 768, 1024, 1280, 1440; the grid collapses honestly to one
      column with marginalia inline and bleeds going full-width?
- [ ] One `<h1>`, `<blockquote>` for pull quotes, `<figure>`/`<figcaption>` for
      images, kickers not marked as headings?
- [ ] Two subset webfonts preloaded with `font-display: swap` and a metric-matched
      fallback; CLS < 0.03 with no baseline shift on font swap?

**Generic-AI smell test**
- [ ] If you swapped the serif for a system sans, would anything remain that says
      "designed editorial page"? If only the font made it look editorial, the grid,
      measure, and devices are missing - rebuild them.

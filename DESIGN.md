---
name: aggiovato
description: Grounded in code. Built to explore.
colors:
  night-side-graphite: '#15161e'
  upper-atmosphere-plum: '#211b2e'
  instrument-slate: '#1b1d28'
  instrument-slate-raised: '#252838'
  card-plum: '#2a2339'
  card-plum-border: '#443653'
  hairline: '#363344'
  control-outline: '#827b94'
  starlight: '#f5f1fa'
  starlight-muted: '#bcb5ca'
  starlight-subtle: '#9691a8'
  aurora-lavender: '#c6a5ff'
  aurora-lavender-hover: '#d8c1ff'
  lavender-ink: '#21152f'
  great-red-spot-peach: '#e8ae91'
  ion-violet: '#7950e8'
  aurora-mint: '#9dddbb'
  signal-rose: '#ffb4bc'
typography:
  display:
    fontFamily: 'Manrope Variable, Manrope, system-ui, sans-serif'
    fontSize: 'clamp(2.5rem, 1.5rem + 4.4vw, 5.5rem)'
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'Manrope Variable, Manrope, system-ui, sans-serif'
    fontSize: 'clamp(2.25rem, 1.6rem + 2.8vw, 4.5rem)'
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Manrope Variable, Manrope, system-ui, sans-serif'
    fontSize: 'clamp(1.75rem, 1.4rem + 1.5vw, 3rem)'
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: '-0.025em'
  subtitle:
    fontFamily: 'Manrope Variable, Manrope, system-ui, sans-serif'
    fontSize: 'clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)'
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: '-0.025em'
  lead:
    fontFamily: 'Manrope Variable, Manrope, system-ui, sans-serif'
    fontSize: 'clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)'
    lineHeight: 1.6
  body:
    fontFamily: 'Manrope Variable, Manrope, system-ui, sans-serif'
    fontSize: 'clamp(1rem, 0.97rem + 0.15vw, 1.125rem)'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace'
    fontSize: 'clamp(0.75rem, 0.72rem + 0.12vw, 0.875rem)'
    letterSpacing: '0em'
  code:
    fontFamily: 'JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace'
    fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.9375rem)'
rounded:
  control: '12px'
  card: '20px'
  pill: '999px'
  inline: '6px'
spacing:
  '1': '0.25rem'
  '2': '0.5rem'
  '3': '0.75rem'
  '4': '1rem'
  '6': '1.5rem'
  '8': '2rem'
  '12': '3rem'
  '16': '4rem'
  '24': '6rem'
  '32': '8rem'
components:
  button-primary:
    backgroundColor: '{colors.aurora-lavender}'
    textColor: '{colors.lavender-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.control}'
    padding: '0 2rem'
    height: '48px'
  button-primary-hover:
    backgroundColor: '{colors.aurora-lavender-hover}'
    textColor: '{colors.lavender-ink}'
  link-underline:
    textColor: '{colors.starlight}'
    height: '44px'
  link-underline-hover:
    textColor: '{colors.aurora-lavender-hover}'
  chip:
    textColor: '{colors.starlight-muted}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 0.75rem'
    height: '28px'
  path-label:
    textColor: '{colors.starlight-subtle}'
    typography: '{typography.label}'
  project-preview:
    backgroundColor: '{colors.card-plum}'
    rounded: '{rounded.card}'
  callout:
    backgroundColor: '{colors.instrument-slate}'
    textColor: '{colors.starlight-muted}'
    padding: '1rem 1.5rem'
  nav-link:
    textColor: '{colors.starlight-muted}'
    rounded: '{rounded.control}'
    padding: '0 0.75rem'
    height: '44px'
  nav-link-current:
    textColor: '{colors.starlight}'
---

# Design System: aggiovato

## Overview

**Creative North Star: "The Landing Log"**

Every page is an entry in a log kept after landing on Jupiter: a precise, dated record of what was
built and why, written by someone who stayed curious after arriving. The log is editorial first —
large type, generous space, one idea per screen — and technical in its marginalia: file paths as
eyebrows, line numbers, a `mission` object, code in the hero's palette. The planet and its sky give
the record a place; they never stand between the visitor and the work.

The world is dark only. A night-side graphite ground carries everything; the plum of the upper
atmosphere appears where projects live, reached gradually rather than through a hard band. Colour
is scarce on purpose: lavender marks what you can act on, Jupiter's peach adds warmth in small
doses, and the rest is graphite and starlight. Character lives in recurring details — the rocket's
dotted trail, the ◆ that marks where you are, the code-path labels — so components themselves can
stay precise and calm.

Motion is a single, deliberate moment per surface (the rocket's arrival, the slow orbit of a
gallery) plus transitions that answer the visitor's actions. Everything respects
`prefers-reduced-motion`, and the content is complete before any effect runs.

**Key Characteristics:**

- Dark-only, graphite ground with a gradual plum atmosphere where projects live.
- One action colour (lavender); peach only as a warm accent and for focus.
- Manrope for reading, JetBrains Mono for anything that is code, data or a path.
- Thin outlines and soft radii; depth from tone and soft violet glows, not stacked shadows.
- The rocket's dotted trail as the system's recurring line: trajectory, horizon, index, orbit.

## Colors

A night sky with one lavender signal and a trace of Jovian warmth.

### Primary

- **Aurora Lavender** (`aurora-lavender`): the only action colour — primary buttons, link underlines,
  the current-section ◆, the highlighted word of the hero title, accented parts of path labels.
  Hover lifts it to **Aurora Lavender Hover** (`aurora-lavender-hover`). Text on lavender is
  **Lavender Ink** (`lavender-ink`), 8.5:1.

### Secondary

- **Great Red Spot Peach** (`great-red-spot-peach`): warmth taken from the planet. Strings in code,
  the prototype status dot, warm stars, and the focus ring of every focusable element.

### Tertiary

- **Ion Violet** (`ion-violet`): never text. Glows around the planet and orbiting moons, text
  selection, and the faint brand haze under graphic elements.

### Neutral

- **Night-Side Graphite** (`night-side-graphite`): the page ground everywhere, header included.
- **Upper-Atmosphere Plum** (`upper-atmosphere-plum`): the projects surface (home and case studies),
  always reached through a long gradient from graphite and returning to it.
- **Instrument Slate** (`instrument-slate`) and **Instrument Slate Raised**
  (`instrument-slate-raised`): code blocks, callouts, inline code, hover backgrounds in lists.
- **Card Plum** (`card-plum`) with **Card Plum Border** (`card-plum-border`): project previews and
  borders inside the plum surface.
- **Hairline** (`hairline`): dividers and section rules. **Control Outline** (`control-outline`):
  borders of chips, toggles and icon buttons.
- **Starlight** (`starlight`), **Starlight Muted** (`starlight-muted`) and **Starlight Subtle**
  (`starlight-subtle`): primary text, secondary text, and metadata only (4.9:1 on card plum).
- **Aurora Mint** (`aurora-mint`) and **Signal Rose** (`signal-rose`): values in code and the
  active status dot; editorial notes and errors.

### Named Rules

**The One Signal Rule.** Lavender means "you can act on this". It is never a background wash, a
decorative fill or body text; if an element is not interactive and is not the current location, it
is not lavender.

**The Gradual Atmosphere Rule.** Plum is never a shaped band with an edge. It appears through a long
gradient from graphite (about 28rem) and leaves the same way, so no seam can show.

## Typography

**Display Font:** Manrope Variable (with system-ui)
**Body Font:** Manrope Variable (with system-ui)
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace)

**Character:** a friendly geometric sans for everything a person reads, and a monospace for
everything that is code, a path, a number or a label — the pairing is the "log" itself: prose and
its machine annotations.

### Hierarchy

- **Display** (750, `display`, 1.08, −0.025em): the home hero title only, at most two lines.
- **Headline** (750, `headline`, 1.08): the h1 of a case study, kept under 18ch.
- **Title** (750, `title`, 1.08): section headings ("Things I've shipped.", "How I work.").
- **Subtitle** (750, `subtitle`): card titles and h3.
- **Lead** (600, `lead`, 1.3–1.6): taglines under a title, max 30ch.
- **Body** (400, `body`, 1.6): reading text, max 56ch (`--measure`, about 74 characters: `ch` is the width of «0», wider than an average letter); secondary text in Starlight
  Muted.
- **Label** (mono, `label`): path labels, chips, fact-sheet terms, counters, stack layers.
- **Code** (mono, `code`): inline code and blocks, coloured with the hero's `mission` palette.

### Named Rules

**The Mono Means Machine Rule.** Monospace marks what a machine would print: paths, code, counts,
codes, labels. It is never used for sentences.

**The No Eyebrow Caps Rule.** Section eyebrows are lowercase code paths (`~/work`,
`portfolio / work / yrest.mdoc`), never tracked uppercase labels.

Japanese pages keep Manrope for Latin text and fall back to the system's Japanese fonts for
kana and kanji, with strict line breaking and no negative tracking on headings.

## Layout

A centred container (max 1360px) with fluid gutters from 20–24px on phones to 72px on desktop
(16px below 360px). Sections are separated by generous vertical space (4–6rem) and a hairline;
the projects section replaces the hairline with the dotted horizon.

The home hero splits text and planet on desktop (the text takes about 62% and sits after a narrow
"log" column of line numbers); on phones the order is identity, title, description, actions, then
only the top arc of the planet. A case study's first screen is the log entry: title, tagline, summary and links on the left, the
one-minute layer (problem, part, outcome) in the header's right half from 1024px, above the
horizon; on phones it follows the links, before the cover. The rest reads in a single 56ch column with a sticky index on
the left from 1024px, and a collapsible "On this page" on smaller screens. The cover and its fact
sheet sit side by side from 1024px; the fact sheet lays itself out from its own width (container
query: one column below 20rem).

Breakpoints follow content: 360, 640, 768, 900, 1024 and 1100px. No horizontal scroll at 320,
375, 768, 1024 or 1440px. Touch targets are at least 44px.

## Elevation & Depth

Flat by default, with depth from tone and light rather than stacked shadows. Surfaces step from
graphite to slate to card plum; borders are one pixel. Real elevation is reserved for objects that
float in a scene — the planet, orbiting moons, the floating language and mobile menu panels — and
it comes as a soft violet glow plus one diffuse drop shadow. Glass (blur 18px, saturate 140%,
graphite at 78–82%) is used only for panels that open over content.

### Shadow Vocabulary

- **Planet glow** (`box-shadow: 0 0 60px -6px rgb(121 80 232 / 0.45)`): the small Jupiter at the
  centre of a gallery orbit.
- **Moon** (`box-shadow: 0 0 24px -4px rgb(121 80 232 / 0.45), 0 18px 36px -14px rgb(0 0 0 / 0.85)`):
  orbiting thumbnails.

### Named Rules

**The Scene-Only Elevation Rule.** Only things that float in the sky get a glow or a shadow. Cards,
buttons and blocks in the reading flow stay flat and rely on borders and tone.

## Shapes

Two radii, a pill and a small inline radius (6px, `inline`) for code in running text. Controls (buttons, inputs, menus, code blocks) use a gently rounded 12px
(`control`); cards, previews and decision blocks use 20px (`card`); chips are pills. Thumbnails in
an orbit become circles — moons lit from the upper left with a terminator to the lower right — and
return to their real shape when opened. The planet is a disc whose bottom fades along the dotted
horizon's curve, never cut by a straight edge.

The recurring line is the rocket's trail: dots of 1.75px every 10px in Starlight at 42%
(`--trail-dot-*` tokens). It draws the rocket's trajectory, the horizon between hero and projects,
the case-study index and the gallery orbit, and nothing else.

## Components

### Buttons

Precise and calm: one filled style, everything else is a link.

- **Shape:** gently rounded (12px), at least 48px tall, 2rem horizontal padding.
- **Primary:** Aurora Lavender with Lavender Ink text, 700 weight; an optional arrow that moves 3px
  on hover.
- **Hover / Focus:** lighter lavender and a 1px lift; focus is the peach outline (2px, offset 3px).
- **Secondary:** an underlined link (`link-underline`): Starlight text, 2px lavender underline
  offset 6px, 44px tall target; hover turns text and underline to the hover lavender.
- **Icon buttons** (menu toggle, carousel arrows, viewer tools): 44px squares or circles with a
  Control Outline border or none, Starlight Muted icons that brighten on hover.

### Chips

- **Style:** pill, 28px tall, 1px Control Outline border, mono label in Starlight Muted; they wrap
  inside narrow columns instead of overflowing.
- **State:** static labels (categories, stack, roles); the lead chip of a card may carry a faint
  lavender tint.

### Cards / Containers

- **Corner Style:** 20px.
- **Background:** Card Plum inside the plum surface; previews are 16:10 with the screenshot on top.
- **Shadow Strategy:** none (see Scene-Only Elevation); hover changes the border to lavender.
- **Border:** 1px Card Plum Border.
- **Internal Padding:** content sits outside the preview, under it, with 0.5–1rem rhythm.

### Navigation

- **Style:** Manrope 600 links in Starlight Muted, 44px tall targets; the current page is Starlight
  with a 2px lavender underline offset 8px.
- **Language menu:** globe and mono locale code; opens a glass panel listing each language in its
  own name with its code aligned right and a lavender ◆ on the current one.
- **Mobile:** a 44px outlined toggle whose two lines turn into a centred X; the menu opens as a glass
  panel over the content with a dark scrim, the page behind inert. The header never changes height.

### Path Label

The system's eyebrow: a lowercase code path in mono Starlight Subtle. Its last segment is lavender
because it marks the current location (`portfolio / work / yrest.mdoc`, `~/work`), the same role
as the ◆. A segment that links somewhere (`work`) is underlined in Control Outline and turns
lavender on hover, so the one lavender word is never mistaken for the link.

### Fact Sheet

Type, period, status and role as a definition list: mono terms, 600-weight values, type and roles as
chips, status with a small dot (Aurora Mint when active, Jovian Peach for prototypes).

### Callout and Decision Block

- **Callout:** an Instrument Slate block with a 1px hairline border and 12px radius; its title is
  preceded by a tone dot (Starlight Subtle note, peach constraint, mint learning, rose editorial),
  the same convention as the fact sheet's status dot. No coloured side stripe.
- **Decision:** a 20px-radius bordered block titled with the decision's short name (an h3 that also
  names the region). Rows keep the narrative order (problem, decision, alternatives, trade-off,
  evidence, outlook) with three weights: the decision is the headline (lead size, 600, on Instrument
  Slate Raised), problem and trade-off read in full Starlight, and alternatives, evidence and outlook
  step back (smaller, Starlight Muted). Terms are mono Starlight Subtle. Evidence holds verifiable
  facts only; a forecast goes in Outlook.

### Orbital Gallery (signature)

A system map. From 768px, Jupiter dominates the centre and each image is a small moon (about a
seventh of the planet) on one tilted ring, or two from five images (the inner one faster). A moon's
surface is its own image blurred into colour, lit from the upper left with a terminator to the lower
right; no coloured halo. Back moons pass behind the planet. The selected moon wears a fine lavender
ring and a dotted trail joins it to the preview, where the image is shown whole with its caption;
the selection changes only when the visitor picks a moon or a caption. The caption list under the
preview is the accessible selector (◆ on the selected one); the preview opens the viewer (zoom,
pan, rotation, previous/next, tooltips, keys hint on desktop). The orbit turns slowly, pauses with
its round toggle, under the pointer and off-screen; a dragged moon bends its ring and springs back.
On phones, without JavaScript or with reduced motion it is a grid of real images. Stack follows the
gallery.

## Do's and Don'ts

### Do:

- **Do** keep lavender for actions, the current location and the hero's highlighted word only.
- **Do** use the dotted trail (1.75px dots every 10px, Starlight at 42%) for any trajectory,
  horizon, orbit or progress line.
- **Do** label sections with a lowercase code path, and use mono for paths, code, counts and labels.
- **Do** reach the plum surface through a long gradient from graphite and leave it the same way.
- **Do** make every scene element decorative and hidden from assistive technology, and keep the
  content complete without JavaScript and with reduced motion.

### Don't:

- **Don't** use blurred bands, hard horizontal cuts or shaped colour blocks between sections; they
  showed seams at the screen edges.
- **Don't** give cards, buttons or reading blocks a drop shadow; only floating scene objects get
  glow and shadow.
- **Don't** use tracked uppercase eyebrow labels or numbered markers on content that is not a real
  sequence.
- **Don't** add spatial jargon to navigation labels (Work, About, Contact stay plain), military
  imagery, game-like interfaces or omnipresent neon.
- **Don't** let two pages overlap during a transition; the old page leaves before the new one
  arrives.

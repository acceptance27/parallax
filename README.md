# PARALLAX — a four-player interface studio

A pixel-art group portfolio built for the Digital Interface Design final project.

> A separate low-fidelity structural wireframe lives in [`wireframe/`](wireframe/) — same pages, no final styling, placeholders marked.

- **Homepage:** `index.html`
- **Gallery / Works:** `works.html` (the “quest log”)
- **About:** `about.html` (the “party”)
- **Contact:** `contact.html` (the “mailbox”)
- **Case study:** `work-qweeps.html`

Everything is static HTML, CSS, and vanilla JavaScript. No build step, no framework, no backend.

---

## Run it

From this folder:

```bash
python3 -m http.server 4176
```

Open `http://localhost:4176/`.

You can also open `index.html` directly, but a local server makes clipboard, video, and relative assets behave more consistently.

---

## What is real

- **Rayven Pahignalo / Player 01** — name, supplied portrait, and project facts are taken from the QWEEPS repository and technical report.
- **QWEEPS case study** — copy, stats, links, DOI, and technical report PDF are real project material.
- **Screenshots and loop** — extracted from the QWEEPS demos in `qweeps/demos/`.
- **GitHub, Zenodo, ORCID links** — real public links from the project.
- **QWEEPS technical report** — copied into `assets/docs/qweeps-technical-report.pdf`.

## What is a placeholder

- **The group name “PARALLAX”** — a working name, easy to replace. It is used as the studio name and as the conceptual hook (“four viewpoints, one frame”).
- **Players 02, 03, and 04** — intentionally locked. Their avatars are silhouettes, their roles are suggested, and their cards are sized for real work.
- **The 1/4 progress labels and save-file segments** — indicators for the current wireframe. Update them when work arrives.
- **`hello@parallax.studio`** — placeholder group email.
- **The contact form** — a front-end prototype. It composes a message and opens a `mailto:` link; it does not send to a server.
- **Player 01’s portrait** — Rayven’s supplied photo, framed like a player ID card. Replace the file in `assets/img/players/` if you want a different image.

The empty slots are deliberate. The site is designed to be honest about a group that is still forming, rather than inventing three projects to fill the grid.

---

## Drop in a teammate’s work

### 1. Add their project card to `works.html`

Find one of the locked cards:

```html
<a class="work-card is-locked reveal" href="#slots" data-slot="02" ...>
```

Replace it with a complete card. The safest approach is to copy the QWEEPS card and change:

- `data-status="complete"`
- the `SAVE 02 / NAME` top bar
- the screenshot path and alt text
- the title, sub, description, tags, year, and link
- the bottom link to the new case-study page

Put images in:

```text
assets/img/projects/
```

Use JPG or WebP, at least 1600px wide, ideally 16:10 or 3:2.

### 2. Unlock their player card in `index.html`

Find:

```html
<a class="player-card is-locked reveal" href="works.html#slots" data-slot="02" ...>
```

Replace it with an open card modeled on Player 01:

- remove `is-locked`
- change `href` to `about.html#player-02`
- replace the portrait or silhouette with their own image
- update name, role, bio, and stats
- change the footer to `QUEST 02 COMPLETE / VIEW PROFILE →`

### 3. Unlock their profile in `about.html`

Replace one `.locked-profile` block with a profile modeled on the Player 01 `.character-wide` block. Add an `id` such as `player-02` so the homepage card can link to it.

### 4. Update the counters

Search for these strings across the HTML:

- `1 / 4`
- `1/4`
- `01<span> / 04`
- `1 quest complete`
- `PARTY 1 / 4`
- `WIREFRAME — 3 PLAYER SLOTS OPEN`

Update them when a slot is filled. The progress pips are the `<span class="on">` elements inside `.pips`, `.save-segments`, and `.status-panel .bar`.

### 5. Add a case-study page

Copy `work-qweeps.html` to `work-[name].html` and replace:

- title, eyebrow, sub, meta grid
- hero media
- brief, build, system, interface, result, reflection sections
- next-quest block

Then link the new page from the project card and player profile.

---

## Change the group identity

- **Group name:** search for `PARALLAX` in all five HTML files, `assets/favicon.svg`, and the title tags. Replace with your group name.
- **Group email:** search for `hello@parallax.studio` and replace it in the footer/contact/footer copy links.
- **Group details:** the footer says “BSIT 4” on the contact page. Update if your section differs.
- **Roles:** the suggested roles live in the locked player cards and in the roles table on `about.html`.
- **Class / school:** update the footer line `© 2026 PARALLAX / Student project / Metro Manila`.

---

## Contact form

The form currently:

1. validates the fields,
2. composes a message,
3. shows a “message queued” panel,
4. lets the visitor copy the message or open it in their mail app.

It does **not** send anything.

To make it real, choose one:

- **Formspree:** set the form `action` to your endpoint and remove `novalidate` / the JS success handler.
- **Netlify Forms:** add `data-netlify="true"` and a hidden `form-name` field.
- **Your own endpoint:** POST the fields from `site.js` in the `contact-form` submit handler.

The recipient address is in `assets/js/site.js`:

```js
const recipient = 'hello@parallax.studio';
```

---

## Design system

- **Palette:** night `#17131f`, cream `#f2e6c9`, gold `#f0c05a`, orange `#e36b3d`, sage `#9bb06e`, sky `#78b5c4`, plum `#a184b8`.
- **Display type:** Pixelify Sans (Google Fonts, OFL).
- **Labels / HUD:** Silkscreen (Google Fonts, OFL).
- **Body:** IBM Plex Mono (Google Fonts, OFL).
- **Avatars:** Player 01 uses a portrait in an ID-card frame; Players 02–04 use original 16×16 SVG silhouette sprites in `assets/img/avatars/`.
- **Texture:** scanlines, dither, starfield canvas, hard pixel shadows. No rounded corners.
- **Motion:** title-screen starfield, scroll reveals, hard pixel shadows.

All fonts are self-hosted in `assets/fonts/`; the site does not call Google Fonts at runtime.

---

## Accessibility / practical notes

- Skip link, visible focus states, native `<dialog>`, ARIA labels on progress groups, reduced-motion support.
- The video has a poster and a play/pause button.
- The mobile menu locks body scroll and closes on navigation / Escape.
- The locked-slot modal can be closed with Escape, the X, or a backdrop click.
- The contact form is a prototype and says so in the interface.

---

## File map

```text
parallax/
├── index.html
├── works.html
├── about.html
├── contact.html
├── work-qweeps.html
├── README.md
├── wireframe/
└── assets/
    ├── css/style.css
    ├── js/site.js
    ├── fonts/
    ├── docs/qweeps-technical-report.pdf
    └── img/
        ├── avatars/player-02.svg … player-04.svg
        ├── players/rayven-pahignalo.webp
        └── qweeps/
            ├── lesson-loop.mp4
            ├── lesson-sat.webp
            ├── lesson-verifier.webp
            ├── branch.webp
            ├── quiz.webp
            └── landing.webp
```

---

## Before you submit

- [ ] Replace the group name and email.
- [ ] Replace Player 01’s portrait if you want a different photo.
- [ ] Fill Players 02–04 when their work arrives.
- [ ] Update all 1/4 progress labels and segments, and the “3 slots open” copy.
- [ ] Add a screenshot of each page to the PDF.
- [ ] Check the site at 1440px, 768px, and 390px widths.
- [ ] Test the mobile menu and the locked-slot modal.
- [ ] Connect the contact form or keep the prototype notice visible.
- [ ] Add the live link and the final PDF to the submission.

---

Built for the Digital Interface Design final requirement, 2026.

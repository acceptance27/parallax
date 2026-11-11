# PARALLAX / WIREFRAME

This is the **low-fidelity structural prototype**, deliberately separated from the polished site.

- **Main website:** `../index.html`
- **This wireframe:** `index.html`

The wireframe is intentionally unfinished: no photography, no pixel-art styling, no custom fonts, no final motion. It uses blueprint grid, dashed boxes, content slots, and annotations to show the structure.

## View it

From the `parallax/` folder:

```bash
python3 -m http.server 4176
```

- Final site: `http://localhost:4176/`
- Wireframe: `http://localhost:4176/wireframe/`

The wireframe also links back to the final site at the top right of every page.

## Legend

- **Solid border + green tag** — real content exists.
- **Dashed border** — placeholder or reserved slot.
- **Blue note** — layout / interaction annotation. Toggle it from the browser-chrome bar.
- **Blue link** — links between the wireframe screens or to the final site.

## Screens

1. `index.html` — Homepage: hero, party select, featured project, open slots, manifesto/contact strip.
2. `works.html` — Works/gallery: filter bar, 2×2 project grid, submission packet, case-study link.
3. `about.html` — About/party: one real profile, three reserved profiles, manifesto, roles table.
4. `contact.html` — Contact: form fields, direct contact, success-state specification.
5. `case-study.html` — QWEEPS case study: hero, brief, build, system, interface, result, reflection, next slot.

## Interactions included

- Annotations on/off.
- Works filters: all / complete / locked.
- Copy submission brief button.
- Contact form prototype status message.
- Responsive layout down to 390px.

## What is real / what is placeholder

**Real in the structure:** the group name, Rayven Pahignalo as Player 01, QWEEPS as the first project, QWEEPS result numbers, and the public links.

**Placeholder:** all images (dashed boxes), the three other profiles/projects, the group email, the final copy, and the form backend. These are intentionally marked as placeholders rather than filled with invented work.

## Relationship to the final site

The final site (`../`) is the styled pixel-art build. This wireframe is the structural layer beneath it: same pages, same content slots, same 1-of-4 status, no finished surface.

The main site does not link to the wireframe. Use the two URLs side by side for the submission, or screenshot this version as process documentation.

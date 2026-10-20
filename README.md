# Jhon Mark L. Lumibao — My Little Digital Space

A personal, one-page website for **Jhon Mark L. Lumibao**, a BSIT student at the
University of Makati. It is a warm, blue-glass corner of the internet: part
introduction, part sketchbook, part photo wall. Not a résumé, not a corporate
portfolio — just a digital home.

Built with **HTML5, CSS3 and vanilla JavaScript** only. No frameworks, no build
step, no package manager, no trackers, no CDNs. Every file is plain text you can
open and edit.

---

## 1. Open it

**The short version:** double-click `index.html`. That's it. The whole site runs
straight from the filesystem — fonts, images, icons and scripts are all local.

If you prefer a proper local server (recommended, and required for the
"copy email" button to use the modern clipboard API in some browsers):

```bash
# from inside this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or, with Node installed:

```bash
npx serve .
```

> **Why a server sometimes matters:** browsers treat `file://` pages as
> untrusted. The copy-to-clipboard button still works there because the script
> falls back to a legacy method, but everything else — theme memory, gallery
> filters, lightbox, animations — behaves identically either way.

There is **no build step**. Edit a file, save it, refresh. That's the workflow.

---

## 2. What's inside

```
Personal-Website/            (rename the folder freely — all paths are relative)
├── index.html              all page structure and text
├── css/
│   └── style.css           all styling (22 numbered sections)
├── js/
│   └── script.js           all behaviour (vanilla, no dependencies)
├── assets/
│   ├── images/             profile + gallery + social-preview artwork
│   ├── icons/              favicon, app icons, manifest icons
│   └── fonts/              self-hosted WOFF2 subsets + OFL licences
├── site.webmanifest        makes the site installable on a phone
└── README.md               this file
```

### Which file does what

| File | Purpose |
| --- | --- |
| `index.html` | The skeleton and every word on the page. Organised into labelled comment blocks — one per section — so you can jump straight to the part you want. |
| `css/style.css` | All visual design: tokens, glass surfaces, layout, motion, responsive rules, reduced-motion and print styles. Split into 22 numbered sections with a contents list at the top. |
| `js/script.js` | Theme switching, preloader, mobile menu, smooth scrolling, active-nav tracking, typing effect, scroll reveals, gallery filters, lightbox, toast messages and the footer year. Each feature is its own commented function. |
| `site.webmanifest` | Name, colours and icons used when the site is added to a home screen. |
| `assets/images/` | Illustrations, the Open Graph cover, and the photos used by the gallery. |
| `assets/icons/` | Favicon (SVG + PNG), Apple touch icon and PWA icons. |

---

## 3. The design

**Blue glassmorphism.** Deep navy and midnight blues, electric and sky-blue
accents, frosted translucent panels, soft blue shadows, rounded corners, and a
lightly layered background of slow-drifting light orbs and a faint grid. Neon is
used sparingly — a glow on a hover, a gradient on a heading — never as a wall of
light.

Both themes are built from the same set of CSS custom properties, so changing one
value changes the whole site consistently.

### Colour palette

| Role | Dark theme (default for dark-preferring visitors) | Light theme |
| --- | --- | --- |
| Page background | `#050b17` → `#030711` | `#eef5ff` → `#dbe9fb` |
| Primary text | `#eaf3ff` | `#0a1930` |
| Soft text | `#d2e3f8` | `#21395c` |
| Muted text | `#9db2d0` | `#4b6384` |
| Faint text | `#7c91b0` | `#5a708f` |
| Accent | `#8ecbff` | `#1554d6` |
| Bright accent (cyan) | `#67e8f9` | `#0a7fb8` |
| Glass fill | `rgba(255,255,255,.055)` | `rgba(255,255,255,.58)` |
| Glass border | `rgba(255,255,255,.10)` | `rgba(21,84,214,.14)` |
| Button gradient | `#2563eb` → `#0d47b0` | `#1d5be0` → `#0b3ea8` |
| Background orbs | `#1d4ed8`, `#0e7490`, `#3730a3` | `#8dbcff`, `#a8dcff`, `#b7c4ff` |

Every one of these lives at the top of `css/style.css` under **02. Design
tokens**. There are two blocks — `:root` (light) and `[data-theme="dark"]`
(dark). Change both if you want a colour to match across themes.

> **Contrast:** text colours in both themes were checked against WCAG AA (4.5:1
> for body text, 3:1 for large text and UI edges). The lowest body-text pairing
> is 4.61:1. If you swap in your own colours, run them through a contrast checker
> before committing.

### Type

- **Sora** — headings, buttons, numerals.
- **Plus Jakarta Sans** — body copy.
- System monospace — small labels and the `thought__date` note.

Both webfonts are self-hosted as Latin-subset WOFF2 files in `assets/fonts/`
(with the OFL licence text beside them). They load from your own folder, so the
site works offline and makes no third-party requests. If a font ever fails to
load, the CSS falls back to the system UI font stack.

---

## 4. Editing the content

Search `index.html` for the `[EDIT: …]` markers. Each section has a comment block
above it describing the exact edit.

### Name, hero and roles

- **`[EDIT: NAME]`** — the headline, the intro line and the three floating chips
  around the portrait.
- The **typing roles** are *not* in the HTML. Open `js/script.js`, find
  **07. Typing animation** and edit the `ROLES` array:

```js
var ROLES = [
  "a BSIT student",
  "an aspiring developer",
  "a technology enthusiast",
  "a creative soul"
];
```

Keep them lowercase and short — the line is designed for two to four words. Add
or remove as many as you like; the animation loops automatically.

### About Me

**`[EDIT: ABOUT]`** holds the story, the little fact list and the pull quote.
Replace the sample copy with your own voice. It's written in first person on
purpose — keep that if you want the site to feel like *you*.

### Adding or removing a skill

Find **`[EDIT: SKILLS]`**. Each card is a self-contained `<article>`:

```html
<article class="skill-card glass" data-reveal data-level="2">
  <span class="skill-card__icon"><svg aria-hidden="true"><use href="#i-braces"></use></svg></span>
  <h3 class="skill-card__title">JavaScript <span class="skill-card__badge">in progress</span></h3>
  <p class="skill-card__text">Short, honest description of where you are with it.</p>
  <div class="skill-card__meta">
    <span class="level level--learning">Learning</span>
    <span class="dots" aria-hidden="true"><i class="is-on"></i><i class="is-on"></i><i></i></span>
  </div>
</article>
```

- **Add:** copy a whole `<article>` and change the icon, title, description,
  level and dots.
- **Remove:** delete the `<article>` and nothing else — the grid reflows on its
  own.
- **Level labels** come in three strengths: `level--familiar`, `level--learning`
  and `level--beginner`. Keep `data-level` in step (`3` / `2` / `1`) — it colours
  the card accent. They describe a stage, not a percentage, because arbitrary
  "87% Java" bars are fiction.
- **Dots** are the three little `<i>` elements; give one a class of `is-on` for
  each step of the stage. They are decorative (`aria-hidden`), so the text label
  carries the meaning.
- **Icons** come from the inline sprite at the bottom of the file. Use any
  `<symbol id="i-…">` from the sprite; a full list is in section 7 below.

### Adding or removing a hobby

Find **`[EDIT: HOBBIES]`**. Each hobby is an `<article class="hobby-card glass">`
with an icon, a title, a line of text and an optional footnote. Duplicate one to
add, delete one to remove. The grid is a simple responsive column layout, so any
number from two to eight looks right; six is the sweet spot.

### Adding a gallery picture

Find **`[EDIT: GALLERY]`**.

1. Drop your image into `assets/images/` — square crops work best
   (e.g. `gallery-10.jpg`, roughly 1200 × 1200, under ~250 KB).
2. Copy any `<a class="gallery__item" …>` block and update five things:

```html
<a class="gallery__item" href="assets/images/gallery-10.jpg"
   data-category="memories" data-title="Your title"
   data-caption="A sentence about this moment." data-reveal>
  <img src="assets/images/gallery-10.jpg" alt="Describe the image for screen readers."
       width="1200" height="1200" loading="lazy" decoding="async">
  <span class="gallery__overlay">
    <span class="gallery__cat">Memories</span>
    <span class="gallery__title">Your title</span>
    <span class="gallery__zoom" aria-hidden="true"><svg><use href="#i-zoom"></use></svg></span>
  </span>
</a>
```

   - `href` and `src` — the file you just added (they can point to the same file).
   - `data-category` — one of `me`, `memories`, `projects`. This drives the filters.
   - `data-title` and `data-caption` — shown in the lightbox and the hover overlay.
   - `alt` — a genuine description. This is required, not decoration.

3. Update the filter counts if you changed how many pictures sit in each
   category (the numbers beside *All / Me / Memories / Projects*). They are plain
   text in the filter buttons, so the page is still correct with JavaScript off.
   The lightbox total updates itself when it opens.

The first tile has an extra class, `gallery__item--feature`, which makes it a
larger focal square. Move that class onto whichever picture deserves the
spotlight — or delete it for a uniform grid.

**Captions** live in `data-caption` on the link. Keep them one or two sentences;
the lightbox caption area is styled for that length.

### Thoughts

**`[EDIT: THOUGHTS]`** contains short reflections written as sample copy. They are
intentionally unattributed — no invented quotes from real people. Replace them
with your own lines, or delete the cards and keep one.

### Contact and social links

**`[EDIT: CONTACT]`** holds:

- an **email address placeholder** — `jhonmark.lumibao@example.com` — used both
  in the visible text and in the `mailto:` link;
- four **social placeholders** (GitHub, LinkedIn, Facebook, Instagram) pointing at
  `#`;
- a note explaining that these are placeholders.

To make them real, replace the address in **two** places (the `href="mailto:…"`
and the visible `<span>`), and give each social link its actual profile URL plus
`target="_blank" rel="noopener noreferrer"`. Delete any network you don't use —
the row wraps cleanly with two, three or four.

> **There is no contact form, on purpose.** A static site cannot send mail on its
> own, and a form that *looks* like it sends would be a lie. If you want one
> later, point it at a service that actually handles submissions (Formspree,
> Netlify Forms, or your own endpoint) and add proper success and error states,
> including a spam honeypot.

### Footer

**`[EDIT: FOOTER]`** — the sign-off line, the copyright name and the back-to-top
link. The year is filled in by JavaScript (`#year`) and falls back to a static
year without it.

---

## 5. Light and dark mode

The toggle in the navigation switches themes instantly. The choice is saved to
`localStorage` under the key **`jml-theme`**, so it survives a refresh and is
restored before the page paints — no bright flash when a dark-mode visitor
arrives.

- **First visit:** the page follows the operating system preference
  (`prefers-color-scheme`), defaulting to dark if that can't be read.
- **To reset a visitor's choice:** in the browser console, run
  `localStorage.removeItem('jml-theme')` and reload.
- **To change the default:** edit the small inline bootstrap script near the top
  of `index.html` (it exists only to prevent the theme flash) and the matching
  fallback in `initTheme()` in `js/script.js`.

The `meta[name="theme-color"]` value is updated alongside the theme, so mobile
browser chrome matches the page in both modes.

---

## 6. Animations — tuning or turning them off

All motion is CSS-transition driven and revealed with `IntersectionObserver`.
There are no particles, no flashing, no custom cursors and no heavy libraries.

**To make motion faster or slower**, change the timing tokens at the top of
`css/style.css`:

```css
--t-fast: 160ms;
--t-med: 300ms;
--t-slow: 620ms;
```

**To disable the reveal animations only** (elements still appear, they just
don't animate in), empty the `data-reveal` selectors in section **20. Motion &
reveal animations**.

**To disable all motion**, either:

1. turn on your system's *Reduce Motion* setting — the site honours
   `prefers-reduced-motion: reduce` by setting durations to near zero and
   switching off floating shapes, the typing caret and the preloader; or
2. edit `css/style.css`, section **22**, and change the reduced-motion block from
   a media query to an always-on rule (remove the `@media` line and keep the
   declarations).

**To skip the typing effect**, remove the `#typed` element in `index.html` and the
`initTyping` entry in the start-up list at the bottom of `js/script.js`. The hero
sentence reads fine without it.

**To remove the preloader**, delete the `#preloader` element and the
`initPreloader` entry. It already removes itself after a short timeout even if an
image fails to load, and it is skipped entirely for reduced-motion visitors.

---

## 7. Icons and artwork

- **Icons** are an inline SVG sprite at the bottom of `index.html` — hand-drawn
  line icons (`#i-sun`, `#i-moon`, `#i-code`, `#i-camera`, `#i-zoom`,
  `#i-chevron-left`, `#i-arrow-up`, brand marks for the social links, and more).
  To add one, copy a `<symbol>`, give it a new `id` and draw inside the
  `0 0 24 24` viewBox. Use it with
  `<svg aria-hidden="true"><use href="#i-your-id"></use></svg>`.
- **Favicon and app icons** live in `assets/icons/`: an SVG favicon (crisp at any
  size), a 32 px PNG fallback, an Apple touch icon, and 192/512/maskable icons
  for the web manifest. They share one mark: a blue glass square with a
  monogram and a subtle glow.
- **Gallery and profile artwork** are original blue-glass illustrations made for
  this template. They are **placeholders, not photographs of Jhon Mark**. Replace
  them with real pictures — including `assets/images/profile.jpg` and
  `assets/images/og-cover.jpg` — before sharing the site publicly.

---

## 8. Accessibility

Things that were built in, not bolted on:

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), one `<h1>`,
  and no skipped heading levels.
- Every image has a purposeful `alt`; decorative icons are `aria-hidden`.
- Visible focus rings everywhere, plus a "skip to content" link.
- The mobile menu is keyboard operable: focus moves into it when it opens,
  returns to the toggle on `Escape`, and the menu closes on outside clicks,
  navigation and viewport changes.
- The gallery lightbox is a real dialog: `aria-modal`, focus trap, `Esc` to
  close, `←`/`→` to browse, and focus returns to the thumbnail you opened.
- Filter buttons expose their state with `aria-pressed`, and a polite live region
  announces how many pictures are showing.
- The theme toggle reports its state with `aria-pressed`.
- Colour contrast meets WCAG AA in both themes. Type and spacing are set in
  relative units, so the layout still holds together at 200% zoom.
- `prefers-reduced-motion` is respected throughout.
- With JavaScript disabled the page still reads, scrolls, and links to the full
  images; the nav becomes a static wrapped panel on small screens.

---

## 9. Browser support and fallbacks

Targets current Chrome, Edge, Firefox and Safari (desktop and mobile).

- **`backdrop-filter`** drives the glass look. Where it isn't supported, an
  `@supports` rule swaps in a more opaque background so text stays readable.
- **`100svh`** is used for full-height areas, with a `100vh` fallback first for
  older browsers.
- **Gradient text** is wrapped in `@supports (background-clip: text)` and falls
  back to a solid accent colour.
- **`clamp()`** handles fluid type and spacing, with plain values as the
  fallback for browsers that ignore it.
- **No `position: sticky` dependency**, no CSS subgrid, no container queries —
  nothing that would break the page on a three-year-old phone.

---

## 10. Publishing

Any static host works, because there is nothing to compile:

- **GitHub Pages** — push the folder, then Settings → Pages → deploy from branch.
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in, or point it at the
  repo with no build command.
- **Your own server** — copy the folder up; `index.html` is the entry point.

After deploying, update the `<meta property="og:image">` URL in `index.html` to an
absolute address (`https://your-domain/…/og-cover.jpg`) so link previews work on
social sites, and swap the placeholder contact details.

---

## 11. Honest placeholders

This template deliberately does not invent facts about a real person. Still
placeholder:

| Placeholder | Where |
| --- | --- |
| Email address `jhonmark.lumibao@example.com` | Contact section, footer |
| GitHub / LinkedIn / Facebook / Instagram links (`#`) | Contact section |
| Profile illustration | `assets/images/profile.jpg`, hero |
| Nine gallery artworks and captions | `assets/images/gallery-*.jpg` |
| About text, skill descriptions, hobby notes, thoughts | `index.html` |
| Social preview image | `assets/images/og-cover.jpg` |

Nothing here claims a certificate, a job, a client or a skill level that wasn't
given. Keep it that way when you fill it in.

---

## 12. If something looks wrong

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Page is unstyled | `css/style.css` not found | Check the folder wasn't renamed; the path is relative. |
| Fonts look generic | Fonts blocked or missing | Confirm `assets/fonts/*.woff2` exist; the site intentionally falls back to system fonts. |
| Theme resets on refresh | `localStorage` blocked (private mode) | Expected; the site still respects the OS preference. |
| Glass looks flat | Browser lacks `backdrop-filter` | Expected — the opaque fallback keeps it readable. |
| Gallery filter shows nothing | `data-category` typo | Must be exactly `me`, `memories` or `projects`. |
| Lightbox image is wrong | `href`/`src` mismatch | The lightbox reads the image from the tile's `href`. |
| Copy button says "Copy this address" | Clipboard API unavailable on `file://` | Normal; the message hands over the address instead. Run a local server for the nicer behaviour. |

---

## 13. Credits

- **Design and code:** written for Jhon Mark L. Lumibao, 2026.
- **Typefaces:** [Sora](https://fonts.google.com/specimen/Sora) and
  [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), both
  under the SIL Open Font License. Licence texts are in `assets/fonts/`.
- **Icons:** drawn for this site as inline SVG. Brand marks follow the official
  simple-icons paths, used nominatively to link to the networks themselves.
- **Artwork:** original illustrations generated for this project as placeholders.

No analytics, no cookies, no third-party requests, no tracking.

---

*Made with curiosity — and a little bit of blue.*

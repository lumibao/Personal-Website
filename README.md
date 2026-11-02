# Jhon Mark L. Lumibao — My Little Digital Space

A one-page personal website for **Jhon Mark L. Lumibao**, a first-year BSIT
student at the University of Makati. Part introduction, part photo wall, part
notebook — a calm blue corner of the internet.

Built with **HTML5 and CSS3 only**: no JavaScript, no frameworks, no build step,
no package manager. Every file is plain text you can open and edit, and every
interaction — the light/dark switch, the gallery filters, the photo lightbox, the
scrolling navigation and calm mode — is handled entirely in CSS.

Live: **https://lumibao.github.io/Personal-Website/**

---

## 1. Open it

Double-click `index.html`. That is the whole workflow — fonts, images, icons and
styles are all local, so it runs straight from the filesystem.

A local server is only needed if you want to test the manifest and icons the way
a browser would request them:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

There is **no build step**. Edit a file, save it, refresh.

---

## 2. What is inside

```
Personal-Website/
├── index.html              all page structure and text
├── css/
│   └── style.css           all styling (21 numbered sections)
├── assets/
│   ├── images/             portrait, about photo, 9 gallery photos, banner, social cover
│   ├── icons/              favicon + Apple touch icon + 192/512/maskable app icons
│   └── fonts/              self-hosted WOFF2 subsets + OFL licences
├── site.webmanifest        makes the site installable on a phone
├── robots.txt              allow everything
└── README.md               this file
```

### Which file does what

| File | Purpose |
| --- | --- |
| `index.html` | Every section in order: hero, ticker, about, skills, hobbies, gallery, thoughts, contact, footer, then the lightbox panels and the icon sprite. |
| `css/style.css` | Design tokens first, then one numbered block per section, then responsive and reduced-motion rules. |
| `site.webmanifest` | App name, theme colour and the three app icons. |
| `assets/icons/JM.png` | The `JM` browser-tab icon (40 × 40). |

The page order is: **Home → About → Skills → Hobbies → Gallery → Thoughts →
Contact**, and the navigation lists exactly those seven.

---

## 3. How the interactions work without JavaScript

| Interaction | Technique |
| --- | --- |
| Light / dark theme | Two radio inputs and `html:has(#theme-light:checked)` swapping colour tokens. |
| Gallery filters | Radio inputs; the stylesheet hides tiles whose `data-category` does not match. |
| Photo lightbox | Plain `#shot-n` anchors. The panel whose `id` matches the address bar is the one that shows; close, prev and next are ordinary links. |
| Mobile navigation | The link row simply scrolls sideways. |
| Calm mode | A checkbox in the footer that turns off the orbs, the grain, the blur and every animation. |
| Scroll reveals | `animation-timeline: view()` where the browser supports it, with a static fallback everywhere else. |

Nothing here needs a script, so nothing breaks when scripting is off.

---

## 4. The design

### Colour

Every colour, radius, shadow and timing is a CSS variable in **section 02** of
`css/style.css` (search for `DESIGN TOKENS`). Change a token once and the whole
site follows, including the light theme.

- **Dark (default):** near-black navy `#050b17`, glass surfaces, a soft blue
  accent, three slow background orbs and a faint grid.
- **Light:** pale blue-white wash, deeper text, the same accents at lower
  opacity — not an inverted dark mode.

### Performance

- Gallery images are lazy-loaded, decoded asynchronously and paint-contained.
- Fonts are self-hosted and preloaded; the page makes **no third-party
  requests at all**.
- The orbs use radial gradients instead of `filter: blur()`, which keeps
  scrolling smooth on phones.
- Reveal animations only animate `transform` and `opacity`.

### Type

- **Sora** — headings, buttons, numerals.
- **Plus Jakarta Sans** — body copy.
- System monospace — small labels and captions.

Both webfonts are Latin subsets in `assets/fonts/` (with their OFL licences
beside them), so the site works offline.

---

## 5. Editing the content

Everything lives in `index.html`, in page order. Each section is wrapped in a
short comment naming it, so `Ctrl-F` for `<!-- Gallery` or `<!-- About` gets you
there.

### The hero

The headline, the intro paragraph, the four rotating roles and the three chips
under the buttons. To change the rotating roles, edit the
`<span class="hero__role-item">` lines — keep each one short, and update the
hidden sentence right after them so screen readers hear the same thing.

### About

The story is four paragraphs plus a pull quote. The photo beside it is
`assets/images/about-photo.jpg` at 1000 × 1250 (4:5).

### Skills

Each card is a self-contained `<article>`:

```html
<article class="skill-card glass" data-reveal data-level="2">
  <span class="skill-card__icon"><svg aria-hidden="true"><use href="#i-braces"></use></svg></span>
  <h3 class="skill-card__title">JavaScript</h3>
  <p class="skill-card__text">A short, honest description.</p>
  <div class="skill-card__meta">
    <span class="level level--learning">Learning</span>
    <span class="dots" aria-hidden="true"><i class="is-on"></i><i class="is-on"></i><i></i></span>
  </div>
</article>
```

- Three label strengths: `level--familiar`, `level--learning`, `level--beginner`.
  Keep `data-level` in step (`3` / `2` / `1`).
- The labels describe a stage, not a percentage — there are no invented
  "87% Java" bars anywhere on this page.

### Hobbies

Six `<article class="hobby-card glass">` cards. Duplicate one to add, delete one
to remove; the grid reflows on its own. The wide banner underneath is
`assets/images/hobbies-banner.jpg` at 1600 × 800.

### Gallery

Nine photos, each with a tile and a lightbox panel:

1. Drop the image into `assets/images/` — square, roughly 1200 × 1200, under
   ~250 KB.
2. Copy a `<a class="gallery__item">` block and update `src`, `alt`,
   `data-category` and the overlay text.
3. Copy the matching `<div class="lightbox" id="shot-…">` panel further down and
   change its image, category, title, caption, `x / 9` counter and the prev/next
   links.
4. Update the four counts in the filter labels (`All`, `Me`, `Memories`,
   `Projects`) — they are plain text, so they are always right for readers.

`data-category` must be exactly `me`, `memories` or `projects`. The first tile
carries an extra `gallery__item--feature` class, which makes it the large square;
move it to whichever photo deserves the spotlight, or delete it for a uniform
grid.

The nine photos currently in the build:

| File | Original upload | Title on the page | Category |
| --- | --- | --- | --- |
| `gallery-01.jpg` | `picture ko sa graduation.png` | picture ko sa graduation | Me |
| `gallery-02.jpg` | `Chess.jpg` | Chess | Me |
| `gallery-03.jpg` | `pfp.jpg` | pfp | Me |
| `gallery-04.jpg` | `my friends took sa Senior prom.jpg` | my friends took sa Senior prom | Memories |
| `gallery-05.jpg` | `Stem Club.jpeg` | Stem Club | Memories |
| `gallery-06.jpg` | `awarding achievement.jpeg` | awarding achievement | Me |
| `gallery-07.jpg` | `Poster ng Research namin sa AQUALERT.jpg` | Poster ng research namin sa AQUALERT | Projects |
| `gallery-08.jpg` | `final defense.jpeg` | final defense | Projects |
| `gallery-09.jpg` | `laban sa muntilupa.jpeg` | laban sa muntilupa | Projects |

`gumawa sa Flobot.jpeg` is used as the wide banner in Hobbies, not in the
gallery. Every tile carries the original file name in its `title` attribute, so
you can hover (or view source) to confirm which photo you are looking at.

Titles are the upload names exactly as typed, minus the file extension — no
rewording, no added capitals. If you swap a photo, title it after whatever you
call the file, so a caption never describes something the picture doesn't show.

### Thoughts

Three short notes plus the "Little reminders" aside. All plain text.

### Contact

The email button, the Facebook button, the email address and the four social
links. There is deliberately **no contact form** — a form with no server behind
it is a dead end, so the primary button opens the visitor's own mail app.

---

## 6. Light and dark mode

The switch in the navigation is two radio buttons. `html:has(#theme-light:checked)`
re-points the colour tokens in section 02 of the stylesheet; everything else
inherits. The page opens in **dark**, and no preference is stored between visits
because there is no script to store it.

If you ever add a script, the one improvement worth making is reading
`prefers-color-scheme` on first load.

---

## 7. Icons and artwork

- All 33 icons are hand-drawn inline SVG `<symbol>`s in the sprite at the bottom
  of `index.html` (`#i-sun`, `#i-chevron-left`, `#i-github`, `#i-youtube`, and so
  on). To add one, copy a `<symbol>`, give it a new id and draw inside the
  `0 0 24 24` viewBox, then use it with
  `<svg aria-hidden="true"><use href="#i-your-id"></use></svg>`.
- **Favicon and app icons** live in `assets/icons/`: `JM.png` is the browser-tab
  icon, plus an Apple touch icon and 192 / 512 / maskable PNGs for the manifest.
  Keep the capitalisation exactly as written — GitHub Pages is case-sensitive,
  so `JM.PNG` would 404 while `JM.png` loads.
- Every photo on the page is Jhon Mark's own, resized and cropped for the web
  with ImageMagick. The originals stay in the repository history if a wider crop
  is ever needed.
- `profile.jpg` (hero) and `about-photo.jpg` are 4:5; the gallery tiles are
  square; `og-cover.jpg` is 1200 × 630 for link previews.

---

## 8. Accessibility

- **Contrast:** body text and every button meet WCAG AA against their own
  background, in both themes.
- **Keyboard:** a skip link comes first, focus rings are visible everywhere, and
  the lightbox is reachable and closable with Tab and Enter.
- **Reduced motion:** `prefers-reduced-motion: reduce` stops the ticker, the
  orb drift, the reveals and the rotating roles.
- **Calm mode** in the footer does the same thing on demand, for anyone who
  wants a still page.
- **Images** all carry descriptive `alt` text; decorative SVG is `aria-hidden`.
- **Landmarks:** one `<h1>`, one `<main>`, labelled sections, a labelled nav and
  a labelled footer nav.

### Honest limitations of a script-free build

- The light/dark choice is not remembered after a reload.
- The mobile menu is a horizontally scrolling row of links, not a drawer.
- Gallery filters reset on reload.

Those three need JavaScript. There is none — that is a deliberate trade.

---

## 9. Browser support

Modern Chrome, Edge, Firefox and Safari, desktop and mobile. The page degrades
politely:

- Browsers without `:has()` still get the dark theme and every section.
- Browsers without `animation-timeline` simply show all content; nothing is
  hidden behind a reveal that never fires.
- Browsers without `backdrop-filter` get a solid glass tint instead.

---

## 10. Publishing

The site is published from the repository root with **GitHub Pages**.

1. Push to `main`.
2. Pages rebuilds automatically — usually under two minutes.
3. Visit https://lumibao.github.io/Personal-Website/ (hard-refresh if you just
   changed the favicon or an image).

Everything is relative, so the same folder also works on Netlify, Vercel, or a
plain Apache/Nginx host with no changes.

---

## 11. Contact details in this build

| Where | Value |
| --- | --- |
| Email | `jhonmarklumibao47@gmail.com` |
| Facebook | [@mrkyjhn](https://www.facebook.com/mrkyjhn) |
| Instagram | [@hatsuki](https://www.instagram.com/lumibao_ph_jhon_mark) |
| GitHub | [@lumibao](https://github.com/lumibao) |
| YouTube | [@lumibaoBG](https://www.youtube.com/@lumibaoBG) |

There is no LinkedIn, because there is no account to link to.

---

## 12. If something looks wrong

| Symptom | Likely cause |
| --- | --- |
| Favicon still shows the old one | Browser cache. Hard-refresh, or open the tab icon URL directly once. |
| An icon link 404s | File name capitalisation. `JM.PNG` ≠ `JM.png` on GitHub Pages. |
| A photo looks stretched | The `width` / `height` attributes in `index.html` no longer match the file. Keep them honest. |
| The lightbox opens the wrong photo | A `href="#shot-n"` and the panel `id` disagree, or the prev/next links are off by one. |
| Gallery filter shows nothing | A `data-category` value that is not `me`, `memories` or `projects`. |
| Fonts look like Times New Roman | `assets/fonts/` did not upload, or you opened the HTML from a different folder. |

---

## 13. Credits

- **Design, code and copy:** Jhon Mark L. Lumibao.
- **Photos:** Jhon Mark L. Lumibao.
- **Fonts:** [Sora](https://fonts.google.com/specimen/Sora) and
  [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans),
  both under the SIL Open Font License — the licence texts sit beside the font
  files in `assets/fonts/`.
- **Icons:** drawn for this page as inline SVG; the brand marks follow the
  shapes published in [Simple Icons](https://simpleicons.org/) (CC0).
- No framework, no library, no analytics, no cookies, no trackers.

# Jhon Mark L. Lumibao — My Little Digital Space

A personal, one-page website for **Jhon Mark L. Lumibao**, a first-year BSIT
student at the University of Makati. A warm blue-glass corner of the internet:
part introduction, part sketchbook, part photo wall. Not a résumé, not a
corporate portfolio — just a digital home.

Built with **HTML5 and CSS3 only**. No JavaScript of our own, no frameworks, no
build step, no package manager. Every file is plain text you can open and edit,
and every interaction on the page — the theme switch, the gallery filters, the
image lightbox, the mobile navigation and calm mode — is handled by CSS.

The one exception to "no third-party anything" is the **YouTube embeds** in the
Videos section and the looping background reel: those are YouTube's own iframe
players, so they necessarily load from `youtube-nocookie.com`. See section 6.

---

## 1. Open it

**The short version:** double-click `index.html`. That's it. The whole site runs
straight from the filesystem — fonts, images, icons and styles are all local.

If you prefer a proper local server:

```bash
# from inside this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or, with Node installed:

```bash
npx serve .
```

There is **no build step**. Edit a file, save it, refresh. That's the workflow.

---

## 2. What's inside

```
Personal-Website/            (rename the folder freely — all paths are relative)
├── index.html              all page structure and text
├── css/
│   └── style.css           all styling (22 numbered sections)
├── assets/
│   ├── images/             portrait + gallery + social-preview artwork
│   ├── icons/              favicon, app icons, manifest icons
│   └── fonts/              self-hosted WOFF2 subsets + OFL licences
├── site.webmanifest        makes the site installable on a phone
├── robots.txt              a friendly "index this, please"
└── README.md               this file
```

### Which file does what

| File | Purpose |
| --- | --- |
| `index.html` | The skeleton and every word on the page, including the YouTube embeds. Organised into labelled comment blocks — one per section — so you can jump straight to the part you want. |
| `css/style.css` | All visual design: tokens, glass surfaces, layout, motion, responsive rules, reduced-motion and print styles. Split into 22 numbered sections with a contents list at the top. |
| `site.webmanifest` | Name, colours and icons used when the site is added to a home screen. |
| `assets/images/` | The portrait, the nine gallery photos and the social-preview cover. |
| `assets/icons/` | Favicon (SVG + PNG), Apple touch icon and PWA icons. |

There is **no `js/` folder** — and no `<script>` tag in the page.

---

## 3. How the interactions work without JavaScript

| Feature | How it is done |
| --- | --- |
| **Light / dark switch** | Two radio buttons in the navigation. `html:has(#theme-light:checked)` swaps the whole colour palette. |
| **Mobile navigation** | No hamburger. Below 980px the bar grows a second row of links that scrolls sideways, so nothing opens or closes. |
| **Gallery filters** | Four radio buttons. `html:has(#filter-me:checked)` hides every tile whose `data-category` doesn't match. |
| **Image lightbox** | Each photo has a matching `#shot-N` panel. Clicking a tile jumps to that id, and `.lightbox:target` shows the panel. Prev / next / close are ordinary links. |
| **Rotating hero role** | A 16-second CSS animation cycling four stacked phrases. |
| **Scroll reveals** | The browser's own scroll timeline — `animation-timeline: view()`. |
| **Reading progress line** | `animation-timeline: scroll(root block)` on the thin line in the nav bar. |
| **Calm mode** | A checkbox in the footer; `html:has(#calm-switch:checked)` switches the effects off. |
| **Smooth scrolling** | `scroll-behavior: smooth` in CSS. |
| **Videos** | Plain `<iframe>` embeds pointed at `youtube-nocookie.com`, with `autoplay=1&mute=1&loop=1&playlist=…`. Browsers allow autoplay only when muted, which is why the players start silent. |
| **Background reel** | The same kind of iframe, fixed inside the background layer, with `controls=0` and `pointer-events: none` so it can never be clicked. |

**What that means in practice:** the theme choice and calm mode reset when the
page is reloaded (the page opens in dark mode), and the lightbox closes with its
own close button rather than the `Esc` key. Everything else behaves normally.
Those three things need JavaScript, and there is none — which is the point.

---

## 4. The design

**Blue glassmorphism.** Deep navy and midnight blues, electric and sky-blue
accents, frosted translucent panels, soft blue shadows, rounded corners, and a
layered background of slow-drifting light orbs and a faint grid. Neon is used
sparingly — a glow on a hover, a gradient on a heading — never a wall of light.

Both themes are built from one set of CSS custom properties, so changing a value
changes the whole site consistently.

### Colour palette

| Role | Dark theme (default) | Light theme |
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

All of these live at the top of `css/style.css` under **02. Design tokens**:
`:root` holds the dark theme, and `html:has(#theme-light:checked)` holds the
light override. Change both if you want a colour to match across themes.

> **Contrast:** text colours in both themes were checked against WCAG AA (4.5:1
> for body text, 3:1 for large text and UI edges). The lowest body-text pairing
> is 4.61:1.

### Keeping it light

The page looks heavier than it is:

- The background orbs are **soft radial gradients, not blurred layers** — the
  glow you see costs no `filter: blur()`.
- Glass blur is 13–15px on desktop and **switched off entirely on phones,
  touch-first devices and when the system asks for reduced transparency**, where
  a slightly more opaque tint takes over.
- Reveals animate **only opacity and transform** — never a blur across frosted
  panels, which is the classic cause of scroll jank.
- The pulsing dots ripple with `transform`, not animated `box-shadow`.
- Gallery photos are lazy-loaded, decoded asynchronously and paint-contained.

### Type

- **Sora** — headings, buttons, numerals.
- **Plus Jakarta Sans** — body copy.
- System monospace — small labels and the `thought__date` note.

Both webfonts are self-hosted Latin subsets in `assets/fonts/` (with the OFL
licence text beside them). They load from your own folder, so the site works
offline and makes no third-party requests.

---

## 5. Editing the content

Search `index.html` for the `[EDIT: …]` markers. Each section has a comment block
above it describing the exact edit.

### Name, hero and roles

- **`[EDIT: NAME]`** — the headline, the intro line and the floating chips around
  the portrait.
- The **rotating roles** are the four `<span class="hero__role-item">` lines in
  the hero. Keep them short (two to four words). Add a fifth and give it an
  `animation-delay` 4 seconds later than the last one, then lengthen the
  `role-cycle` duration in `css/style.css` from `16s` to `20s`.

### About Me

**`[EDIT: ABOUT]`** holds the story, the fact list and the pull quote. The
details currently shown are: name, BS Information Technology (1st year),
University of Makati, Metro Manila, and four interests. Edit any `<dd>` directly.

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
- **Remove:** delete the `<article>` — the grid reflows on its own.
- **Level labels** come in three strengths: `level--familiar`, `level--learning`
  and `level--beginner`. Keep `data-level` in step (`3` / `2` / `1`). They
  describe a stage, not a percentage, because arbitrary "87% Java" bars are
  fiction.
- **Icons** come from the inline sprite at the bottom of the file; a full list is
  in section 7 below.

### Adding or removing a hobby

Find **`[EDIT: HOBBIES]`**. Each hobby is an `<article class="hobby-card glass">`
with an icon, a number, a title and a line of text. Duplicate one to add, delete
one to remove. Six is the sweet spot; the grid is a simple responsive column
layout, so any number from two to eight looks right.

### Adding a gallery photo

Find **`[EDIT: GALLERY]`**. Three steps, because a photo needs a tile *and* a
lightbox panel:

1. Drop the image into `assets/images/` — square crops work best
   (e.g. `gallery-10.jpg`, roughly 1200 × 1200, under ~250 KB).
2. Copy a `<a class="gallery__item">` block and update:

```html
<a class="gallery__item" href="#shot-10" data-category="memories" data-reveal>
  <img src="assets/images/gallery-10.jpg" alt="A real description of the photo."
       width="1200" height="1200" loading="lazy" decoding="async">
  <span class="gallery__overlay">
    <span class="gallery__cat">Memories</span>
    <span class="gallery__title">Your title</span>
    <span class="gallery__zoom" aria-hidden="true"><svg><use href="#i-zoom"></use></svg></span>
  </span>
</a>
```

3. Copy a `<div class="lightbox" id="shot-…">` panel further down and change its
   image, category, title, caption and the prev/next links so they point at the
   right ids.
4. Update the four numbers in the filter labels (`All`, `Me`, `Memories`,
   `Projects`) — they are plain text, so they are always correct for readers.

`data-category` must be exactly `me`, `memories` or `projects`; that is what the
filters read. The first tile has an extra class, `gallery__item--feature`, which
makes it a larger focal square — move it onto whichever photo deserves the
spotlight, or delete it for a uniform grid.

**To hide a photo**, delete both its tile and its panel.

---

## 6. Videos and the background reel

### The two embeds

**`[EDIT: VIDEOS]`** in `index.html` holds two cards, each with its own iframe:

| Card | Video ID | Length |
| --- | --- | --- |
| Announcement! | `S4v7WWXhd5w` | 0:29 |
| Presentation | `V--aR9PrrME` | 3:03 |

Both play **muted, automatically, on a loop** — no click needed. Click a player
if you want the sound. They are also lazy-loaded, so they only start when the
section scrolls near the screen.

**To change a video**, replace the ID in *both* places inside that iframe's
`src`: the `/embed/VIDEOID` part **and** the `playlist=VIDEOID` part. The second
one is what makes `loop=1` repeat a single video; if the two differ, playback
jumps to the other video instead of looping.

**To add a third video**, copy a whole `<article class="video-card glass">`
block, swap the two IDs, and edit the badge, title and description.

### The background reel

Behind the whole page there is a third, silent iframe — the video
`D3bBNbML2Yk` ("I'm strong now :)"), looping at 30% opacity under the blue orbs.
It has `controls=0`, `pointer-events: none` and `tabindex="-1"`, so a visitor can
never click it or tab into it.

It is deliberately **not shown** in any of these cases, because it would cost
more than it gives:

- screens narrower than 1024px (mobile data),
- `prefers-reduced-motion: reduce`,
- **calm mode** (the footer switch removes it completely, which also stops the
  playback rather than just hiding a playing video).

In the light theme it stays, but sits at 16% opacity behind a pale wash so it
never fights with the bright palette.

To remove it entirely, delete the `<div class="scene__reel">` block in
`index.html`, or delete the `.scene__reel` rules in `css/style.css`.

### Two honest notes

- **Autoplay is muted by design.** Every modern browser blocks a video that
  starts with sound, so the embeds begin silent. There is no way around that in
  HTML alone, and forcing sound on arrival would be hostile anyway.
- **The embeds need internet.** Offline, or behind a school firewall that blocks
  YouTube, the frames will show an empty dark box. The card titles and the link
  to the channel still work, so the section never becomes useless.

## 7. Light and dark mode

The switch in the navigation has two radios, one for each theme. The page opens
in **dark mode** — that is the design's signature — and choosing *Light* swaps
the palette instantly.

- Colours live in `css/style.css`, section 02: `:root` for dark,
  `html:has(#theme-light:checked)` for light.
- To make light the default, swap the `checked` attribute in `index.html` from
  `#theme-dark` to `#theme-light` and move the two token blocks in the stylesheet.
- The choice is not remembered after a reload, because remembering it needs
  JavaScript. There is none in this build.

---

## 8. Icons and artwork

- **Icons** are an inline SVG sprite at the bottom of `index.html` — hand-drawn
  line icons: `#i-sun`, `#i-moon`, `#i-code`, `#i-camera`, `#i-zoom`,
  `#i-chevron-left`, `#i-arrow-up`, `#i-github`, `#i-youtube`, `#i-facebook`,
  `#i-instagram` and more. To
  add one, copy a `<symbol>`, give it a new `id` and draw inside the
  `0 0 24 24` viewBox, then use it with
  `<svg aria-hidden="true"><use href="#i-your-id"></use></svg>`.
- **Favicon and app icons** live in `assets/icons/`: an SVG favicon (crisp at any
  size), a 32 px PNG fallback, an Apple touch icon, and 192/512/maskable icons
  for the web manifest. They share one mark: a blue glass square with a monogram
  and a subtle glow.
- `profile.jpg` and `gallery-01.jpg` are **real photographs** of Jhon Mark.
- The other eight gallery images, `feature.jpg` and `og-cover.jpg` are **blue-glass
  illustrations** drawn for this layout — and the captions on those tiles say so
  plainly rather than pretending to be photographs. Replace them with real
  pictures any time, keeping the same file names.

---

## 9. Accessibility

Built in, not bolted on:

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), one `<h1>`,
  and no skipped heading levels.
- Every image has a purposeful `alt`; decorative icons are `aria-hidden`.
- Visible focus rings everywhere, plus a "skip to content" link.
- The theme switch and the gallery filters are real radio buttons: they work with
  the keyboard, and the arrow keys move between options.
- The lightbox panels are `role="dialog"` with a label, and every control inside
  is a link you can Tab to and open with Enter.
- Colour contrast meets WCAG AA in both themes.
- `prefers-reduced-motion` is respected throughout — the rotating role, the
  ticker, the floating shapes and the reveals all stop, and the background reel
  is removed entirely.
- Every video player has a descriptive `title`, so a screen reader announces
  what it is instead of "frame". The decorative background reel is
  `aria-hidden`, muted and removed from the tab order.
- `prefers-reduced-transparency` swaps the glass for solid panels.

### Honest limitations of the script-free build

- The theme choice and calm mode are **not remembered** between visits.
- The lightbox closes with its close button or a click on the backdrop, not with
  `Esc`, and it does not trap focus the way a scripted dialog would.
- There is no "current section" highlight in the navigation.

All three need JavaScript. They were left out on purpose.

One more, specific to the videos: the embeds only start once the Videos section
approaches the viewport (they are lazy-loaded). On a very slow connection a
visitor may reach the section before the players have loaded, and see the empty
frame for a moment.

---

## 10. Browser support and fallbacks

Targets current Chrome, Edge, Firefox and Safari (desktop and mobile).

- **`:has()`** powers the theme, the filters and calm mode. Every browser since
  late 2023 supports it; in anything older the page still reads and scrolls, but
  the switch and filters will not change anything.
- **`animation-timeline`** powers the reveals and the progress line. Where it is
  missing, the content is simply visible from the start — nothing is hidden.
- **`backdrop-filter`** drives the glass look; an `@supports` rule swaps in a
  more opaque background where it is unavailable.
- **`clamp()`** handles fluid type and spacing, with plain values as a fallback.

---

## 11. Publishing

Any static host works, because there is nothing to compile:

- **GitHub Pages** — push the folder, then Settings → Pages → deploy from branch.
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in, or point it at the
  repo with no build command.
- **Your own server** — copy the folder up; `index.html` is the entry point.

The page is live at **https://lumibao.github.io/Personal-Website/**.

---

## 12. Contact details in this build

| Item | Value |
| --- | --- |
| Email | `jhonmarklumibao47@gmail.com` |
| GitHub | [github.com/lumibao](https://github.com/lumibao) — @lumibao |
| YouTube | [youtube.com/@lumibaoBG](https://www.youtube.com/@lumibaoBG) — @lumibaoBG (channel: LumibaoPH) |
| Facebook | [facebook.com/mrkyjhn](https://www.facebook.com/mrkyjhn) — @mrkyjhn |
| Instagram | [instagram.com/lumibao_ph_jhon_mark](https://www.instagram.com/lumibao_ph_jhon_mark) — @hatsuki |

There is **no contact form**, on purpose. A static page cannot send mail on its
own, and a form that looked like it worked would be a lie. The "Say hello"
button opens the visitor's own email app.

---

## 13. If something looks wrong

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Page is unstyled | `css/style.css` not found | Check the folder wasn't renamed; the path is relative. |
| Fonts look generic | Fonts missing | Confirm `assets/fonts/*.woff2` exist; the site falls back to system fonts. |
| Theme switch does nothing | Browser without `:has()` support | Update the browser. |
| Glass looks flat | Browser lacks `backdrop-filter` | Expected — the opaque fallback keeps it readable. |
| Filter shows nothing | `data-category` typo | Must be exactly `me`, `memories` or `projects`. |
| Lightbox opens the wrong photo | Tile `href` and panel `id` don't match | `#shot-4` must match `id="shot-4"`. |
| Sections fade in late | Scroll-driven animations | Expected on first paint; they appear as you scroll. |
| Video box is empty / black | No internet, YouTube blocked, or a wrong video ID | Check the ID with `youtube.com/watch?v=ID`. |
| Video will not autoplay | Browser blocked it, or the URL lost `mute=1` | Autoplay only works muted; keep `mute=1` in the `src`. |
| Background reel missing | Normal on phones, light theme, reduced motion or calm mode | It is intentionally hidden there. |

---

## 14. Credits

- **Design and code:** written for Jhon Mark L. Lumibao, 2026.
- **Typefaces:** [Sora](https://fonts.google.com/specimen/Sora) and
  [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), both
  under the SIL Open Font License. Licence texts are in `assets/fonts/`.
- **Icons:** drawn for this site as inline SVG. Brand marks follow the official
  simple-icons paths, used nominatively to link to the networks themselves.
- **Artwork:** the portrait is a real photograph; the remaining gallery and banner
  images are original blue-glass illustrations made for this project.

No analytics and no tracking scripts. The only third-party requests on the page
come from the three YouTube embeds (served from `youtube-nocookie.com`, which
does not set advertising cookies before playback). Everything else — fonts,
images, icons, styles — is served from this folder.

---

*Made with curiosity — and a little bit of blue.*

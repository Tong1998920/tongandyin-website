# tongandyin.com — Tong Yin artist website

This is a plain HTML/CSS website. There is no build step, no framework, and
nothing to install — you edit files directly and push them to GitHub.
GitHub Pages serves the files exactly as they are.

Everything below assumes you're editing files either directly on
github.com (click a file → pencil/edit icon) or in a simple text/code
editor (e.g. VS Code) on your computer.

## How the site is organized

```
index.html                  → Homepage
works/
  index.html                → Works overview (an irregular, curated sequence
                               of all works — not a grid)
  calling-a-deer-a-horse/
    index.html               → One work's page
  ignore/
  the-stranger/
  the-boundary/
  saint-sebastian/
exhibitions/
  index.html                 → Exhibition archive (chronological list)
  example-solo-2025/
    index.html               → One dedicated exhibition page
news/
  index.html                 → News list
about/
  index.html                 → Biography, statement, CV
contact/
  index.html                 → Contact info
assets/
  css/style.css               → The ONE stylesheet that controls the whole
                                 site's look (colors, type, spacing, layout)
  js/main.js                  → Small script, only for the mobile menu
  images/                     → All images, grouped by section
```

Every page is a normal `.html` file you can open and edit directly. Text
you should replace is written in `[Placeholder brackets like this]` so
it's easy to find with Ctrl/Cmd+F.

## The five things you'll do most often

### 1. Replace a placeholder image
Find the image file in `assets/images/...` and upload your real image
**with the exact same file name** to replace it (on github.com: open the
file, use "Upload files" in the same folder, or drag-and-drop a file with
the same name and commit). No HTML editing needed.

If you want a different file name, also update the `src="..."` in the
matching `.html` file.

### 2. Edit text (bio, captions, exhibition details, etc.)
Open the relevant `.html` file, find the `[Placeholder ...]` text, and
replace it with your real text. Leave the HTML tags (the bits in `< >`)
alone — just change the words between them.

### 3. Add a new artwork to an existing project page
Open that project's `index.html` (e.g. `works/ignore/index.html`). Find
one whole `<figure class="plate ...">...</figure>` block, copy it, paste
it where you want the new image to appear, then:
- point `src="..."` at your new image in `assets/images/works/`
- update the `alt="..."` description
- update the title / year / medium / dimensions in the caption

The class after `plate--` (e.g. `plate--left`, `plate--full`,
`plate--center`) controls how wide the image is and where it sits — see
the comment at the top of each project page for the full list. Try a
different one if you want a different rhythm.

### 4. Add a whole new project (body of work)
1. Duplicate an existing project folder, e.g. copy `works/saint-sebastian/`
   to `works/your-new-title/` (name the folder after the work, lowercase
   with hyphens).
2. Open the new folder's `index.html` and edit the title, year, and image
   blocks (see #3 above).
3. Add your images to `assets/images/works/`.
4. Open `works/index.html` and copy one whole `<div class="work-item
   work-item--WIDTH">` block, point its link and image at your new
   folder/image, and update its title/year. Pick a `work-item--` width
   modifier (`full`, `wide`, `center`, `center-narrow`, `left`, `right`,
   `left-narrow`, `right-narrow`) that's different from its neighbors —
   that's what keeps the page feeling like a curated sequence instead of
   a uniform grid. See the comment at the top of `works/index.html`.

The homepage only ever shows one image and a short caption — it doesn't
list projects (that's what the Works page is for). To feature a
different project there instead, edit the image and caption in
`index.html` directly.

### 5. Add a new exhibition or news item
- **Exhibitions list:** open `exhibitions/index.html`, copy one
  `<div class="exhibition-row">` block, and edit year / title / venue /
  kind (Solo or Group).
- **Exhibition with photos:** also duplicate the
  `exhibitions/example-solo-2025/` folder the same way as a project
  folder (see #4), and link the exhibition title to it: change
  `<span class="exhibition-title">` to
  `<a class="exhibition-title" href="your-folder-name/">`.
- **News:** open `news/index.html`, copy one `<div class="news-entry">`
  block, and edit the date, title, and text.

## Editing the biography / statement / CV
All of it lives in `about/index.html`, organized into labeled sections
(Biography, Statement, Education, Selected Exhibitions, Awards &
Residencies, Press & Publications). Each section is a
`<div class="about-block">` — copy a `<div class="cv-row">` inside it to
add another line (e.g. another award or exhibition).

## Editing contact details
Open `contact/index.html` and edit the email address, Instagram link, and
the "Representation" block. If you don't have gallery representation yet,
you can delete that whole `<div class="contact-field">` block.

## Colors, type size, and spacing (the visual system)
All of this lives in one place: `assets/css/style.css`, at the very top in
the `:root { ... }` block. For example, `--color-bg` is the background
color and `--space-6` is a spacing size used throughout the site. Change a
value there and it updates everywhere the site uses it — you shouldn't
need to touch individual page files to make sitewide style changes.

## Publishing (GitHub Pages)
1. Push this whole folder's contents to the root of your GitHub
   repository (or to a `/docs` folder, and point Pages at that folder —
   either works, just be consistent).
2. In the repository's Settings → Pages, set the source to the branch
   (and folder) you pushed to.
3. The `CNAME` file already contains `tongandyin.com` — in your domain's
   DNS settings, point it at GitHub Pages (GitHub's documentation for
   "Managing a custom domain for your GitHub Pages site" walks through
   the exact DNS records).
4. GitHub Pages will serve the site with HTTPS automatically once the
   domain is verified.

## Notes
- `_generate_placeholders.py` (in the project root) is only the script
  used to create the gray "PLACEHOLDER IMAGE" pictures for the first
  draft. It is not used by the live site and can be deleted. The Works
  images no longer use it, but `assets/images/hero/`, `exhibitions/`, and
  `about/` still hold gray placeholders until you add real photos there.
- The seven works other than "Calling A Deer A Horse" still have
  `[Add year]`, `[Add medium]`, and `[Add dimensions]` placeholders in
  their captions — search each project's `index.html` for `[Add ` and
  fill in the real details.
- This site uses no analytics, cookies, or tracking of any kind.

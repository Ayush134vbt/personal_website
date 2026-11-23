# Ayush Prasad — Personal Portfolio

A simple, responsive two-section portfolio website built with plain HTML, CSS and a small amount of JavaScript. Interactive but light — no frameworks, no build step.

## What's included

- **Home:** eyebrow, portrait, data-science intro, primary CTA, email + LinkedIn contact chips, and the full skills toolkit/
- **Projects:** Bike Sharing Demand Analysis and E-commerce SQL Analysis, each linking to GitHub.
- **Responsive layout:** desktop and mobile navigation and layouts.
- **Neo-brutalist meets retro-surreal:** chunky hard shadows, bold ink borders, rounded squares, and vibrant pastel blocks.
- **Original artwork:** custom SVG scenes drawn in the same palette.
  - Hero landscape: swirling white cloud spirals, a pale moon, a colourful building skyline, lavender meadow with wildflowers, and a tiny Sisyphus pushing his boulder.
  - Hero portrait: rounded-square, yellow-framed photo on the left of the hero, with a coral drop shadow and "AYUSH, IRL" sticker tag.
  - Projects illustration 1: a winding demand curve over a sun and horizon, flanked by yellow and aqua bar charts, with a central donut chart and "PEAK HOUR" callout.
  - Projects illustration 2: abstract floating data shapes with connected dots.
- **Contact chips:** email and LinkedIn as neo-brutalist buttons with icon squares and chunky shadows.
- **Interactive layer:**
  - Custom follow cursor with hover growth on interactive elements.
  - Scroll-triggered reveals for the hero copy, skills, and project cards.
  - Subtle 3D tilt on the hero art and project cards when the mouse moves across them.
  - Chip, button and card hover: translate up-left with a growing drop shadow.
  - Magnetic effect on the primary CTA, the GitHub pill in the nav, and the GitHub footer link.
  - Active-section highlighting on the nav links as you scroll.
  - Reduced-motion and touch devices are respected — the custom cursor and tilt are automatically disabled.

## Folder structure

```text
ayush_website/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── hero-landscape.svg
    ├── bike-illustration.svg
    ├── sql-illustration.svg
    ├── ayush.jpg
    └── favicon.svg
```

## What you need to download

1. **Visual Studio Code** — to open and edit the folder.
2. **A web browser** — Chrome, Safari or Firefox to view the website.
3. **Optional: Live Server extension for VS Code** — gives you a local preview that refreshes as you save changes. You do not need Node.js, npm, React, Astro or a database for this version.

The site uses Google Fonts (Syne, DM Sans and Fraunces). An internet connection is needed to load those fonts. If unavailable, fallback fonts will be used.

## Open the website

1. Download and unzip the project folder.
2. Open VS Code.
3. Select **File → Open Folder…** and choose `ayush_website`.
4. Open `index.html` in your browser, or right-click it in VS Code and choose **Open with Live Server** if you have that optional extension installed.

No install command or build step is required.

## Update your GitHub links

The project cards currently point to:

- `https://github.com/Ayush134vbt/bike_sharing_demand_analysis`
- `https://github.com/Ayush134vbt/ecommerce_sql_analysis`

Check that these match the exact repository URLs in your GitHub account. If a repository has a different URL, open `index.html` in VS Code and replace the URL in both places where that project appears (the artwork link and the "View GitHub repository" link).

Your GitHub profile link is also in `index.html` and can be changed by searching for `Ayush134vbt`.

## Main places to customise

- **Name, intro paragraph and skills:** edit the text in `index.html`.
- **Skills toolkit:** edit the `<li>` items inside `<ul class="interest-list">`. The pills rotate through five pastel background colours automatically, so any number of items looks balanced.
- **Project descriptions and links:** edit the two `<article class="project-card">` blocks in `index.html`.
- **Portrait photo:** replace `assets/ayush.jpg` with a new photo (keep the filename), or change the path in `index.html` where `.hero-portrait img` points to the file.
- **Colours and visual styling:** edit the CSS variables at the top of `styles.css`.
- **Interaction speed and feel:** tweak the values at the top of `script.js` (tilt strength, magnetic strength, reveal threshold).
- **Illustrations:** replace the SVG files in `assets/` with your own artwork, keeping the same filenames, or update the image paths in `index.html`.

## Publish with Cloudflare Pages later

This is a static HTML site, so it does not need a framework or build process. Once you push the folder to a GitHub repository, you can connect that repository to Cloudflare Pages. For a no-build static project, Cloudflare's current documentation says to use the repository root as the build output directory and `exit 0` as the build command (or leave the build command blank where supported).

Cloudflare guide: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

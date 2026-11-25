# Ayush Prasad — Personal Portfolio

A personal portfolio built with plain HTML, CSS and JavaScript. It mixes a neo-brutalist layout (bold ink borders, hard drop shadows) with anime and manga touches, and includes a couple of small canvas games. No frameworks, no build step.

## What's on the page

### Intro animation
The site opens with a pixel-art clip of the seven dragon balls summoning Shenron (`assets/intro.png`, an animated PNG of about 6 seconds). Click or press any key to skip. It plays once per browser session and is skipped for visitors who prefer reduced motion.

### Header
A canvas night sky with a big orange moon, scrolling mountain ridges and kid Goku flying across on the Nimbus cloud.

### Home
- **Headline and intro:** "Data Science & Psychology" and a one-line description, on a navy night sky with stippled clouds along the bottom (`assets/hero-clouds-tile.jpg`).
- **Buttons:** *View my work* (jumps to the projects) and *Download resume* (downloads `assets/AyushCV.pdf`).
- **Connect with me:** GitHub, LinkedIn and email. LinkedIn and email use pop-art pictures (`assets/linkedin-pop.svg`, `assets/email-mailbox.jpg`). Clicking the mailbox copies the email address.
- **Photo:** `assets/ayush.jpg` in a frame with a lime offset backdrop. A purple code-style card over the photo lists the skills (Python, R, SQL, Power BI, Excel). Both lift and animate gently on hover.
- **Painting:** a painted street under a swirling spiral cloud (`assets/buildings-clouds.jpg`) with wavy, hand-drawn edges. The swirl spins on hover.

### Projects
- **Background:** a Planet Namek landscape (`assets/namek.jpg`).
- **Heading:** a manga panel of Goku charging a ball of energy (`assets/goku.webp`), with "MY PROJECTS" in pixel lettering inside the ball. The ball glows and pulses on hover.
- **Featured projects carousel:** one project at a time inside a panel with a wavy outline. Use the arrows, the dots, the arrow keys, or swipe on a phone. Each project is styled like a manga chapter page: chapter header, comic title, the illustration on speed lines with a sound effect, the description in a speech bubble, and the tech stack in a caption panel.
  - Bike Sharing Demand Analysis (`assets/bike-illustration.svg`)
  - E-commerce SQL Analysis (`assets/sql-illustration.svg`)

### Games ("Games if you're bored")
- **Dino runner:** an endless runner. Press Space, Up Arrow or tap to jump.
- **Rock skipping:** a pen-and-ink wasteland scene where a small robot throws stones across a lake. Click or press Space to throw. It skips 1–10 times and remembers your best score.

### Throughout
- Custom follow cursor, scroll progress bar and scroll-triggered reveals.
- Wavy edges between sections so it reads like a collage.
- Layouts adapt from wide desktop screens down to phones.
- Reduced-motion preferences and touch devices are respected: animations are toned down or switched off.

## Folder structure

```text
personal_website/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── AyushCV.pdf            resume (Download resume button)
    ├── ayush.jpg              photo
    ├── bike-illustration.svg  project artwork
    ├── buildings-clouds.jpg   swirling-cloud painting
    ├── email-mailbox.jpg      email link picture
    ├── goku.webp              projects heading panel
    ├── hero-clouds-tile.jpg   home background clouds
    ├── intro.png              dragon ball intro animation
    ├── linkedin-pop.svg       LinkedIn link picture
    ├── namek.jpg              projects background
    └── sql-illustration.svg   project artwork
```

## Running it locally

You only need a web browser. Optionally, use VS Code with the **Live Server** extension for a preview that refreshes as you save.

1. Open the project folder in VS Code.
2. Open `index.html` in your browser, or right-click it and choose **Open with Live Server**.

No install command or build step is required. The fonts load from Google Fonts (DM Sans, Syne, Space Mono, Archivo Black, Bangers, Press Start 2P, Comic Neue, Patrick Hand and Fraunces), so an internet connection is needed for them. Fallback fonts are used otherwise.

## Where to change things

| What | Where |
| --- | --- |
| Headline and description | `index.html`, inside `<div class="intro">` |
| GitHub, LinkedIn and email links | `index.html`, inside `<ul class="intro-connect">` |
| Skills card | `index.html`, inside `<div class="intro-code">` |
| Photo | Replace `assets/ayush.jpg` (keep the filename) |
| Resume | Replace `assets/AyushCV.pdf` (keep the filename) |
| Projects | `index.html`, the `<article class="fp-card manga">` blocks. Each has a chapter number, title, sound effect (`mg-sfx`), description, tags and GitHub links. The accent colour is the `--frame` value on the article. The dots are created automatically, but update the "1 of 2" text in each `aria-label` if you add or remove a project. |
| "View all projects" link | `index.html`, the `fp-all` link |
| Position of "MY PROJECTS" in the energy ball | `styles.css`, the `.goku-title` rule (`left` and `top`) |
| Colours | CSS variables at the top of `styles.css` |
| Wavy outline on the projects panel | `script.js`, the "Featured projects panel" block (`A` sets the wave height, `P0` the wave length) |
| Games | `script.js`, the "Dino runner" and "Rock skipping" blocks |

Project links currently point to:

- `https://github.com/Ayush134vbt/bike_sharing_demand_analysis`
- `https://github.com/Ayush134vbt/ecommerce_sql_analysis`

## Publishing with Cloudflare Pages

This is a static site, so it needs no framework or build process. Push the folder to a GitHub repository and connect it to Cloudflare Pages. Use the repository root as the build output directory and `exit 0` as the build command (or leave the build command blank where supported).

Cloudflare guide: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

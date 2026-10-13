# BMK Group — Home

Implementation of the Figma frame **BMK Intl – Phitany › Home** (node `2:3`) with Vite, Tailwind CSS v4 and GSAP.

```bash
npm install
npm run assets   # pull the real images/icons/logos from Figma (see below)
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Design assets

Icons, logos and patterns in `public/assets/` are the original Figma exports.
The photos are served as right-sized WebP (`public/assets/images/*.webp`,
about 300 KB total instead of 4.7 MB of PNG).

`npm run assets` re-downloads everything listed in `scripts/figma-assets.json`.
Icons and logos go straight into `public/assets/`. The full-size photo PNGs go
to `design-source/` (git-ignored), so re-encode them to WebP if a photo changes.
The Figma links expire about 7 days after 2026-10-13.

## Structure

```
index.html                 all markup, Tailwind classes, data-* animation hooks
src/styles.css             tokens (@theme), components, map pins, milestone states
src/main.js                boots modules in top-to-bottom order (pins measure correctly)
src/modules/
  smooth.js                Lenis smooth scroll, synced to the GSAP ticker
  nav.js                   glass navbar: hide on scroll down, mobile menu, anchor scrolling
  hero.js                  pinned hero, scroll-scrubbed video, intro timeline, counter
  map.js                   canvas dot map, cursor-reactive dots, pins + location card
  brands.js                brand cards, Flip-animated category filter, carousel arrows
  timeline.js              pinned horizontal timeline + progress thumb + active card
  reveals.js               declarative reveals (data-split, data-reveal, …)
src/data/
  map-dots.json            7,664 dot centres extracted from the Figma map layers
  locations.js             map entities (pin x/y in % of the map frame)
  brands.js                brand cards + filter categories
public/video/              hero video, re-encoded for scrubbing (see below)
```

## Animation hooks

| Attribute | Effect |
| --- | --- |
| `data-split` | heading lines rise out of a mask (SplitText, re-splits on resize) |
| `data-split-chars` | characters rise in sequence (footer tagline) |
| `data-reveal="up"` | fade + rise on enter |
| `data-reveal="clip"` | image wipes in, inner image settles from 1.25× |
| `data-reveal-group` | direct children stagger in |
| `data-parallax-img` | image drifts against the scroll |

Everything respects `prefers-reduced-motion`: no pinning, no scrubbing, poster
image instead of video, all content visible immediately.

Don't put a CSS `transition` on `transform` for any element GSAP animates.
ScrollTrigger re-measures on resize and will read a mid-transition value. Put
hover motion on an inner element instead (see `.brand-card` / `.brand-inner`).

## Hero video

The source (`Camera_Macro_1920x1080.mp4`, 5.9s, 24fps) is re-encoded with **a
keyframe on every frame** so any scroll position decodes instantly:

```bash
# desktop / mobile H.264
ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart hero-1080.mp4
ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart hero-720.mp4
# VP9 fallback for browsers without H.264 (Chromium builds, some Linux Firefox)
ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 -g 1 -row-mt 1 hero-1080.webm
ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 -g 1 -row-mt 1 hero-720.webm
# poster
ffmpeg -i in.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

The file is fetched into memory as a Blob, so seeks never wait on network range
requests. Phones get the 720p file.

## Content still to confirm

- `src/data/locations.js`: only the Kuala Lumpur entity is from the design. London, Dubai and Singapore copy is a placeholder.
- `src/data/brands.js`: brand descriptions are the design's placeholder text, and the category assignments are guesses.
- FAQ link and social URLs point to `#`. Enquiry buttons open `mailto:info@bmkintl.com` with a subject line.

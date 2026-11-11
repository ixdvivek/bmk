# BMK Group website: front-end reference build

This repository is the approved **design reference** for the BMK Group website (Phitany). It is a static Vite build, not the production app. The production front end is to be built in **Next.js** against a separate CMS/back end. Use this repo for exact markup, styles, motion and behaviour; use the developer handoff document for the content model, admin rules and back-end requirements.

- **Live preview:** https://bmkbyphitany.vercel.app (also https://ixdvivek.github.io/bmk/)
- **Handoff version:** tag `v1.0-handoff` (see Releases)
- **Figma:** file `EDDo2rLxEFm1BakC92zCS6`, pages **Website v2 – Screens** (desktop 1440 / mobile 390) and **Website v2 – Components**
- **Developer handoff document:** `BMK_Website_Developer_Handoff_v1.1.docx` (shared separately)

## Run it

Requires Node 20+.

```bash
npm install
npm run dev       # http://localhost:5173/
npm run build     # static site in dist/ (base path /bmk/ by default)
npm run preview   # serve dist/ at http://localhost:4173/bmk/
```

Set `BASE_PATH=/` to build for a domain root (Vercel does this). `SITE_URL` sets the absolute URL used in the share-card meta tags.

## Pages

| URL | Page |
| --- | --- |
| `/` | Homepage |
| `/about/` | About Us (dotted globe, company cards, brands, timeline) |
| `/products/` | All products (listing) |
| `/category/{group-or-category-id}/` | Category group or category (same listing) |
| `/brand/{id}/` | Partner brand page (SEEKEN and TEAM have none: they link to their own sites) |
| `/product/{slug}/` | Product detail |
| `/search/?q=` | Search results (same listing) |
| `/faq/`, `/contact/` | FAQ, Contact Us |
| `/privacy/`, `/cookies/`, `/terms/` | Legal pages (one template, placeholder wording) |
| anything else | 404 |

Every page except the homepage is rendered by one small client-side app (`catalogue/`). The build copies its HTML shell into each route folder, so every URL works on a static host.

## Structure

```
index.html                    homepage markup (Tailwind classes, data-* animation hooks)
src/
  main.js                     homepage boot (Lenis, GSAP modules, overlays)
  styles.css                  design tokens (@theme), shared components, overlays — used by every page
  modules/                    homepage behaviour: hero, map, brands, timeline, reveals, nav,
                              search.js + overlays.js (search panel, mega menu, enquiry popup)
  data/                       homepage data: map dots, locations, brand cards, milestones, globe dots
catalogue/
  index.html                  shell for every non-home page
  catalogue.css               catalogue page styles
  src/
    main.js                   router (History API), page fade, reveals
    chrome.js                 navbar, mega menu (both designs), search, mobile menu, footer, enquiry popup
    listing.js                product listing: filters, sort, cards
    product.js                product detail
    pages.js                  About, FAQ, Contact
    legal.js                  Privacy / Cookies / Terms
    globe.js                  About "Who we are" globe (canvas + GSAP)
    ui.js                     shared helpers: links, icons, product card, spec-row line clamp
    media.js                  photography and per-brand styling (accent colours, menu images)
data/
  catalogue.js                catalogue content: groups, categories, spec templates, brands, products
  company.js                  company content: companies, offices, FAQ, timeline, contact
public/assets/                logos, brand logos, icons, patterns, photos (WebP)
scripts/                      helpers: globe dots (npm run globe-dots), share card (npm run og)
vite.config.js                multi-page build + route folders + share-card URL
```

## Data

All catalogue and company content lives in `data/catalogue.js` and `data/company.js` as plain JS objects (sample content). They show the shape the CMS needs to provide; the handoff document maps each field to an admin field and its rules.

## Review-only parts (do not ship)

- **Mega menu design switch.** Two designs exist: *categories* (default) and *brands only*. The client has not chosen yet.
  - `?menu=preview` shows a small "Brands only" switch in the mega menu and mobile menu (remembered in the browser); `?menu=off` hides it.
  - `?menu=brands` or `?menu=categories` opens a design directly.
  - In production, ship only the chosen design (or make it a site setting).
- **Forms do not send anything.** The enquiry popup and contact form show a success state only. Wire them to the back end (see handoff doc, Enquiry management).
- Social links in the footer point to `#`, and the Contact map is a placeholder image until the Google Maps embeds are supplied.

## Hero video

The homepage hero video is scrubbed by scroll, so it is encoded with a keyframe on every frame (files in `public/video/`, 1080p and 720p, H.264 + VP9, plus a poster):

```bash
ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart hero-1080.mp4
ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 -g 1 -row-mt 1 hero-1080.webm
```

## Motion notes

- GSAP (ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin) and Lenis (homepage only).
- Everything respects `prefers-reduced-motion`.
- Don't put a CSS `transition` on `transform` for elements GSAP animates; put hover motion on an inner element.
- Avoid `vw` for full-width sizing (it includes the Windows scrollbar); use container units or `%`.
- Test single-fold sections at 1536×730 and 1366×640 as well as 1440×900.

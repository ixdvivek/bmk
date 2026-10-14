# BMK Global — Phase 1 wireframe

Clickable black-and-white wireframe of every Phase 1 page template, for one
round of client feedback:

- **Product listing**: one component used for the brand page, category page, category-group page, all products and search results
- **Product details**: one universal layout; the spec sheet is driven by per-category spec templates
- **Mega menu** and **search** (overlay with suggestions + results page)
- **About Us**: profile, group companies (map, addresses, anchors), full timeline
- **FAQ**: topics, live search, accordion
- **Contact Us**: office selector with map, contact form, the four enquiry types
- **Enquiry popup**: opened with its type from Home, footer, Contact, header and product pages
- **Home (reference only)**: mirrors the approved homepage design so the popups and links can be shown in context; the homepage itself is designed separately

Live (after merge to `main`): `https://ixdvivek.github.io/bmk/wireframe/`
Local: `npm run dev`, then open `http://localhost:5173/wireframe/`

No brand theme is applied on purpose. Crossed boxes are image placeholders;
dashed boxes mark content still to be supplied. Numbered black dots are
annotations for the walkthrough (toggle with **Notes** at the bottom left).

## Structure

```
wireframe/
  index.html        page shell (second Vite entry, see vite.config.js)
  wf.css            greyscale tokens and components (Tailwind, scans this folder only)
  src/
    data.js         groups → categories → spec templates → brands → products
    main.js         hash router (#/home, #/about, #/faq, #/contact, #/products, #/category/:id, #/brand/:id, #/product/:slug, #/search?q=)
    header.js       header, mega menu, search overlay, mobile drawer, footer stub
    listing.js      shared listing: filters, sort, active chips, load more, empty states
    product.js      universal product page: gallery, variants, colours, specs, related
    enquiry.js      enquiry popup (pre-filled with the product when opened from one)
    notes.js        numbered annotations
    pages.js        Home (reference), About Us, FAQ, Contact Us
    content.js      company content: intro, entities, milestones, enquiry types, FAQs, content conflicts
    screens.js      index of every screen
```

Hash routing keeps it working on GitHub Pages without server rewrites. The
production build (Next.js) would use the clean URLs from the plan, e.g.
`/brands/nikon`, `/products/mirrorless-cameras`, `/products/nikon-z8`.

## Content

- Categories: the 14 from the client sheet, cleaned, in four groups (Photography,
  Mobile, Audio, Memory & Storage).
- FUJIFILM X-H2S and X-T5 camera specs are verbatim from the client sheet.
- Other specs are from the manufacturers' published spec pages (Nikon, FUJIFILM
  instax, Google Store) and a camera database for the Nikon Zf, gathered
  October 2026. Overview and short descriptions are draft copy.
- Model numbers are not in the client sheet yet (shown as "to be supplied").
- About, Contact and Home copy is from the approved homepage design. FAQ
  questions and answers are drafts; answers BMK must supply are marked.
- The About page lists content conflicts found across the approved copy
  (founding year, Singapore date, India branch, Dubai entity name).

## Adding a product type

Add a template to `templates` in `data.js` (ordered groups of fields), point a
category at it, and set its `card` highlight fields. The product page needs no
changes: it renders whatever fields a product fills in and hides the rest.

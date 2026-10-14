# BMK Global — wireframe (round 1)

Clickable black-and-white wireframe for client alignment on:

- **Product listing**: one component used for the brand page, category page, category-group page, all products and search results
- **Product details**: one universal layout; the spec sheet is driven by per-category spec templates
- **Mega menu** and **search** (overlay with suggestions + results page)

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
    main.js         hash router (#/products, #/category/:id, #/brand/:id, #/product/:slug, #/search?q=)
    header.js       header, mega menu, search overlay, mobile drawer, footer stub
    listing.js      shared listing: filters, sort, active chips, load more, empty states
    product.js      universal product page: gallery, variants, colours, specs, related
    enquiry.js      enquiry popup (pre-filled with the product when opened from one)
    notes.js        numbered annotations
    screens.js      index of every screen in this round
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

## Adding a product type

Add a template to `templates` in `data.js` (ordered groups of fields), point a
category at it, and set its `card` highlight fields. The product page needs no
changes: it renders whatever fields a product fills in and hides the rest.

// Brand cards for the "Our Brands" section (client document of 21 Oct 2026).
// Brands and descriptions come from the shared catalogue data; filters are the
// six category groups. BMK's own brands come first. Logos: real files where we
// have them, otherwise a wordmark until BMK supplies them.
import { brands as all, groups } from '../../wireframe/src/data.js';

// Brand logos in their original colours (Figma: UI Design › brands section).
const logos = {
  seeken: 'assets/brands/seeken.svg',
  'team-appliances': 'assets/brands/team.svg',
  nikon: 'assets/brands/nikon.svg',
  canon: 'assets/brands/canon.svg',
  fujifilm: 'assets/brands/fujifilm.svg',
  sony: 'assets/brands/sony.svg',
  samsung: 'assets/brands/samsung.svg',
  lg: 'assets/brands/lg.svg',
  sandisk: 'assets/brands/sandisk.svg',
  prestige: 'assets/brands/prestige.svg',
  sujata: 'assets/brands/sujata.svg',
  voltas: 'assets/brands/voltas.svg',
  symphony: 'assets/brands/symphony.svg',
  sharp: 'assets/brands/sharp.svg',
};

export const brandFilters = [{ id: 'all', label: 'All' }, ...groups.map((g) => ({ id: g.id, label: g.name }))];

const card = (b) => ({
  id: b.id,
  name: b.name,
  logo: logos[b.id] || null,
  categories: b.groups,
  description: b.intro,
  inHouse: !!b.inHouse,
  sites: b.sites || [],
  href: '#', // homepage stays standalone for now (no links into the catalogue)
});

/** Partner brands: the "Associated Brands" carousel. */
export const brands = all.filter((b) => !b.inHouse).map(card);
/** BMK's own brands: the two wide cards under the carousel. */
export const ownBrands = all.filter((b) => b.inHouse).map(card);

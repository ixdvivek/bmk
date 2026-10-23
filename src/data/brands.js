// Brand cards for the "Our Brands" section (client document of 21 Oct 2026).
// Brands and descriptions come from the shared catalogue data; filters are the
// six category groups. BMK's own brands come first. Logos: real files where we
// have them, otherwise a wordmark until BMK supplies them.
import { brands as all, groups } from '../../wireframe/src/data.js';

const logos = { nikon: 'assets/brands/nikon.svg', canon: 'assets/brands/canon.svg', sony: 'assets/brands/sony.svg' };

export const brandFilters = [{ id: 'all', label: 'All' }, ...groups.map((g) => ({ id: g.id, label: g.name }))];

export const brands = [...all.filter((b) => b.inHouse), ...all.filter((b) => !b.inHouse)].map((b) => ({
  id: b.id,
  name: b.name,
  logo: logos[b.id] || null,
  categories: b.groups,
  description: b.intro,
  inHouse: !!b.inHouse,
  sites: b.sites || [],
  href: '#', // homepage stays standalone for now (no links into the catalogue)
}));

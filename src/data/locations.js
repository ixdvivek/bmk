// Group presence: one pin per country (client document of 21 Oct 2026).
// Companies come from the shared content file; this adds what only the
// visual design needs: pin positions on the 1200×620 dot map (as % of the
// frame), city icons and city photos.
import { countries, entitiesIn } from '../../wireframe/src/content.js';

export const countryVisual = {
  // `photo` is used on About › Our companies. The panel covers one half of the
  // card (right on UAE/Singapore/Zambia, left on India/Malaysia/DRC), so each
  // photo is oriented (Kochi is pre-mirrored) and `pos` (object-position)
  // keeps its landmark in the uncovered half.
  uae: { x: 60.42, y: 47.1, icon: 'assets/icons/loc-dubai.svg', photo: 'assets/images/city-dubai.webp', pos: '45% center' },
  india: { x: 68.0, y: 59.2, icon: 'assets/icons/loc-kochi.svg', photo: 'assets/images/city-kochi.webp', pos: '75% center' },
  singapore: { x: 77.33, y: 62.74, icon: 'assets/icons/loc-singapore.svg', photo: 'assets/images/city-singapore.webp', pos: '35% center' },
  malaysia: { x: 75.7, y: 60.16, icon: 'assets/icons/petronas.svg', photo: 'assets/images/city-petaling-jaya.webp', pos: '65% center' },
  zambia: { x: 54.75, y: 72.7, icon: 'assets/icons/loc-lusaka.svg', photo: 'assets/images/city-lusaka.webp', pos: '30% center' },
  drc: { x: 51.1, y: 65.4, icon: 'assets/icons/loc-kinshasa.svg', photo: 'assets/images/city-kinshasa.webp', pos: '75% center' },
};

export const locations = countries.map((c) => ({
  ...c,
  ...countryVisual[c.id],
  companies: entitiesIn(c.id),
  href: '#contact', // homepage stays standalone for now
}));

export const defaultLocation = 'uae';

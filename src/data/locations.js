// Group presence: one pin per country (client document of 21 Oct 2026).
// Companies come from the shared content file; this adds what only the
// visual design needs: pin positions on the 1200×620 dot map (as % of the
// frame), city icons and city photos.
import { countries, entitiesIn } from '../../wireframe/src/content.js';

export const countryVisual = {
  uae: { x: 60.42, y: 47.1, icon: 'assets/icons/loc-dubai.svg', photo: 'assets/images/milestone-2018.webp' },
  india: { x: 68.0, y: 59.2, icon: 'assets/icons/loc-kochi.svg' },
  singapore: { x: 77.33, y: 62.74, icon: 'assets/icons/loc-singapore.svg', photo: 'assets/images/milestone-2008.webp' },
  malaysia: { x: 75.7, y: 60.16, icon: 'assets/icons/petronas.svg' },
  zambia: { x: 54.75, y: 72.7, icon: 'assets/icons/loc-lusaka.svg' },
  drc: { x: 51.1, y: 65.4, icon: 'assets/icons/loc-kinshasa.svg' },
};

export const locations = countries.map((c) => ({
  ...c,
  ...countryVisual[c.id],
  companies: entitiesIn(c.id),
  href: '#contact', // homepage stays standalone for now
}));

export const defaultLocation = 'uae';

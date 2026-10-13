// Brand cards for the "Our Brands" section.
// Descriptions are the design's placeholder copy; category assignments are a
// best guess. Add more brands here and they appear in the filter + carousel.
export const brandFilters = [
  { id: 'all', label: 'All' },
  { id: 'cameras', label: 'Cameras & Imaging' },
  { id: 'mobile', label: 'Mobile Accessories' },
  { id: 'watches', label: 'Smart Watches' },
  { id: 'other', label: 'Other' },
];

const placeholder = 'Short brand description placeholder. One or two lines of supporting text.';

export const brands = [
  { id: 'nikon', name: 'Nikon', logo: 'assets/brands/nikon.svg', categories: ['cameras'], description: placeholder, href: '#' },
  { id: 'sony', name: 'Sony', logo: 'assets/brands/sony.svg', categories: ['cameras', 'mobile'], description: placeholder, href: '#' },
  { id: 'canon', name: 'Canon', logo: 'assets/brands/canon.svg', categories: ['cameras'], description: placeholder, href: '#' },
  { id: 'leica', name: 'Leica', logo: 'assets/brands/leica.svg', categories: ['cameras'], description: placeholder, href: '#' },
];

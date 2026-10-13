// Group entities shown on the presence map.
// x / y are the pin centres from Figma, as % of the 1200×620 map frame.
// Only Kuala Lumpur's copy and icon come from the design; the other three
// entries are PLACEHOLDER copy, inferred from the timeline and footer.
// Replace with the real entity details before launch.
export const locations = [
  {
    id: 'london',
    x: 46.54,
    y: 31.9,
    entity: 'BMK Europe Ltd.',
    city: 'London, United Kingdom',
    address: 'London, United Kingdom',
    summary: 'European distribution and brand partnerships.',
    icon: null,
    href: '#contact',
  },
  {
    id: 'dubai',
    x: 60.42,
    y: 47.1,
    entity: 'BMK Gulf FZE',
    city: 'Dubai, UAE',
    address: 'Jebel Ali Free Zone, Dubai, UAE',
    summary: 'Group headquarters and MENA distribution hub.',
    icon: null,
    href: '#contact',
  },
  {
    id: 'kuala-lumpur',
    x: 75.83,
    y: 60.16,
    entity: 'BMK Global Sdn. Bhd.',
    city: 'Kuala Lumpur, Malaysia',
    address: 'Kuala Lumpur, Malaysia',
    summary: 'Regional HQ and principal trading entity.',
    icon: '/assets/icons/petronas.svg',
    href: '#contact',
  },
  {
    id: 'singapore',
    x: 77.33,
    y: 62.74,
    entity: 'BMK Singapore',
    city: 'Singapore',
    address: 'Singapore',
    summary: 'ASEAN sourcing and regional distribution.',
    icon: null,
    href: '#contact',
  },
];

export const defaultLocation = 'kuala-lumpur';

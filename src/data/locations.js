// Group entities shown on the presence map.
// x / y are the pin centres from Figma, as % of the 1200×620 map frame.
// Copy and icons from the Figma location cards (Section 1, node 41:18060).
// `address` is optional: only shown when set.
export const locations = [
  {
    id: 'london',
    x: 46.54,
    y: 31.9,
    entity: 'BMK Europe Ltd.',
    city: 'London, United Kingdom',
    address: '',
    summary: 'European operations and brand management office.',
    icon: 'assets/icons/loc-london.svg',
    href: '#contact',
  },
  {
    id: 'dubai',
    x: 60.42,
    y: 47.1,
    entity: 'BMK Middle East FZE',
    city: 'Dubai, UAE',
    address: '',
    summary: 'MENA region trade and distribution entity - United Arab Emirates.',
    icon: 'assets/icons/loc-dubai.svg',
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
    icon: 'assets/icons/petronas.svg',
    href: '#contact',
  },
  {
    id: 'singapore',
    x: 77.33,
    y: 62.74,
    entity: 'BMK Asia Pte. Ltd.',
    city: 'Singapore',
    address: '',
    summary: 'Distribution and logistics hub for Southeast Asia.',
    icon: 'assets/icons/loc-singapore.svg',
    href: '#contact',
  },
];

export const defaultLocation = 'kuala-lumpur';

// Company content for the About, FAQ and Contact wireframes.
// Copy is taken from the approved homepage design wherever it exists. Anything
// else is marked draft; `null` means "to be supplied by BMK" and renders as a
// dashed placeholder.

export const intro = {
  heading: 'Built on trust. Driven by innovation.',
  paragraphs: [
    'BMK Group is a UAE-incorporated international trading company specialising in the wholesale import and export of consumer electronics. What began as a trading operation has evolved into a broader business focused on global partnerships, market expansion and product development.',
    'With business diversification beginning in 2004 and branches established in Singapore and India in 2010, BMK continues to build connections across markets, helping businesses access technology and opportunities worldwide.',
  ],
};

// Group companies (homepage location cards). Pin x/y = % of the map frame, as on the site.
// Phone/email per office are not in the design yet → null.
export const entities = [
  { id: 'bmk-global', name: 'BMK Global Sdn. Bhd.', city: 'Kuala Lumpur, Malaysia', role: 'Regional HQ and principal trading entity.', address: 'Kuala Lumpur, Malaysia', phone: null, email: null, x: 75.83, y: 60.16 },
  { id: 'bmk-asia', name: 'BMK Asia Pte. Ltd.', city: 'Singapore', role: 'Distribution and logistics hub for Southeast Asia.', address: null, phone: null, email: null, x: 77.33, y: 62.74 },
  { id: 'bmk-europe', name: 'BMK Europe Ltd.', city: 'London, United Kingdom', role: 'European operations and brand management office.', address: null, phone: null, email: null, x: 46.54, y: 31.9 },
  {
    id: 'bmk-middle-east',
    name: 'BMK Middle East FZE',
    city: 'Dubai, UAE',
    role: 'MENA region trade and distribution entity - United Arab Emirates.',
    // From the design footer, where the company is named "BMK GULF FZE" (see conflicts)
    address: 'Warehouse # RA08LB07, P.O. Box 261752, Jebel Ali Free Zone, Dubai, UAE',
    phone: '+971 4 887 0211',
    email: 'info@bmkintl.com',
    x: 60.42,
    y: 47.1,
  },
];

// Homepage timeline, plus two dates from the About copy (marked `source: 'about'`).
export const milestones = [
  { year: '2004', title: 'Business diversification', text: 'BMK begins diversifying its business.', source: 'about' },
  { year: '2005', title: 'Founded', text: 'BMK Group established as a trading company.' },
  { year: '2008', title: 'First Expansion', text: 'Expanded into Singapore and regional ASEAN markets.' },
  { year: '2010', title: 'Singapore and India branches', text: 'Branches established in Singapore and India.', source: 'about' },
  { year: '2012', title: 'Brand Partnerships', text: 'Secured key international brand distribution rights.' },
  { year: '2015', title: 'European Entry', text: 'Opened BMK Europe Ltd. in London.' },
  { year: '2018', title: 'MENA Launch', text: 'Established presence in Dubai Free Zone.' },
  { year: '2022', title: 'Digital Growth', text: 'Launched e-commerce and digital distribution channels.' },
];

// Inconsistencies found across the approved copy, surfaced on the About page.
export const conflicts = [
  'Founding year: the timeline says 2005, but “25 Years of Experience” in the hero points to about 2001, and the About copy mentions diversification in 2004.',
  'Singapore: the timeline says 2008; the About copy says the Singapore branch was established in 2010.',
  'India: the About copy mentions a 2010 India branch, but there is no India entity in Group Presence.',
  'Dubai entity name: “BMK Middle East FZE” on the location card, “BMK GULF FZE” in the footer address.',
  'Dubai: the timeline dates the MENA launch to 2018, while the company is described as UAE-incorporated.',
];

export const enquiryTypes = [
  { type: 'Distribution Enquiry', title: 'Good business starts with the right connection', text: 'Enquire about becoming a distribution partner for BMK Group brands.' },
  { type: 'Dealership Enquiry', title: 'Let’s build something valuable together.', text: 'Apply to become an authorised dealer for one or more BMK brands.' },
  { type: 'Retail Sales Enquiry', title: 'Connect with BMK. Grow with confidence.', text: 'Enquire about retail supply, pricing, and product availability.' },
  { type: 'General Enquiry', title: 'Your next opportunity starts here.', text: 'All other enquiries - partnerships, corporate, media, and more.' },
];

// Draft FAQs. Answers drawn from the scope and approved copy; null = BMK to supply.
export const faqTopics = [
  { id: 'general', name: 'About BMK' },
  { id: 'products', name: 'Products & brands' },
  { id: 'partners', name: 'Partnerships' },
  { id: 'support', name: 'Enquiries & support' },
];

export const faqs = [
  { topic: 'general', q: 'What does BMK Group do?', a: 'BMK Group is a UAE-incorporated international trading company specialising in the wholesale import and export of consumer electronics, with a growing focus on global partnerships, market expansion and product development.' },
  { topic: 'general', q: 'Where does BMK operate?', a: 'BMK operates through registered group companies in Malaysia, Singapore, the United Kingdom and the UAE. See the Group Presence section on the About Us page for each company.' },
  { topic: 'general', q: 'Is BMK a manufacturer?', a: null },
  { topic: 'products', q: 'Which brands does BMK handle?', a: 'The current list of brands, and the products available for each, is on the Brands & Products page.' },
  { topic: 'products', q: 'Can I buy products directly from this website?', a: 'This website is a product catalogue and does not take orders. To ask about buying, pricing or availability, send a Retail Sales Enquiry.' },
  { topic: 'products', q: 'Where do the product specifications come from?', a: 'Specifications are provided by each manufacturer and may vary by region. Contact us if you need the specification for a particular market.' },
  { topic: 'products', q: 'Are the products covered by a warranty?', a: null },
  { topic: 'partners', q: 'How do I become a distribution partner?', a: 'Send a Distribution Enquiry with your company details and the markets you cover. The relevant BMK team will contact you.' },
  { topic: 'partners', q: 'How do I become an authorised dealer?', a: 'Send a Dealership Enquiry and tell us which BMK brands you are interested in.' },
  { topic: 'partners', q: 'What are the requirements to become a partner?', a: null },
  { topic: 'support', q: 'How long does it take to get a reply?', a: null },
  { topic: 'support', q: 'How do I contact a specific BMK office?', a: 'Office details for each group company are on the Contact Us page.' },
  { topic: 'support', q: 'Who do I contact for after-sales support?', a: null },
];

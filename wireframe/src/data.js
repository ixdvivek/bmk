// ─────────────────────────────────────────────────────────────────────────────
// Wireframe catalogue data
//
// Shape mirrors the planned Laravel/MySQL model so the wireframe proves the
// structure, not just the visuals:
//   group (6) → category (20) → spec template → product
// v2: groups and categories follow the client document of 21 Oct 2026
// ("Final Product Categories Hierarchy"); Google products removed.
// A product belongs to one brand and one category. Its spec sheet layout comes
// entirely from its category's template, so new product types only need a new
// template, never a new page layout.
//
// Camera specs for the two FUJIFILM bodies are verbatim from the client sheet
// (BMK_Global_Website_Product_Details.xlsx). Other specs are from the makers'
// published spec pages (see wireframe/README.md). Descriptions are draft copy.
// ─────────────────────────────────────────────────────────────────────────────

export const groups = [
  { id: 'smart-devices', name: 'Smart Devices & Wearables' },
  { id: 'audio', name: 'Audio & Entertainment' },
  { id: 'imaging', name: 'Digital Imaging & Photography' },
  { id: 'kitchen', name: 'Kitchen & Cooking Appliances' },
  { id: 'home-utility', name: 'Home Utility & Climate Control' },
  { id: 'accessories', name: 'Mobile & Computing Accessories' },
];

// The client's final hierarchy (document of 21 Oct 2026). `desc` is their text.
// A category points at a default spec template; a product can override it
// (instax film and the Link printer share "Instant Cameras & Film").
export const categories = [
  { id: 'smartwatches-fitness-bands', name: 'Smartwatches & Fitness Bands', group: 'smart-devices', template: 'watch', card: ['caseSizes', 'batteryLife', 'durability'], desc: 'AMOLED calling smartwatches, rugged outdoor sports watches, health & fitness trackers.' },
  { id: 'tablets-handhelds', name: 'Tablets & Smart Handhelds', group: 'smart-devices', template: 'generic', card: [], desc: 'Wi-Fi and 4G calling tablets, e-learning smart devices.' },
  { id: 'mobile-feature-phones', name: 'Mobile Phones & Feature Phones', group: 'smart-devices', template: 'phone', card: ['display', 'processor', 'rearCameras'], desc: 'Dual-SIM smartphones, long-battery standby feature phones.' },
  { id: 'personal-audio', name: 'Personal Audio', group: 'audio', template: 'generic', card: [], desc: 'True Wireless Stereo (TWS) earbuds, neckbands, on-ear wireless headphones.' },
  { id: 'party-home-audio', name: 'Party & Home Audio', group: 'audio', template: 'generic', card: [], desc: 'Portable Bluetooth speakers, party trolley speakers with wireless microphones, soundbars.' },
  { id: 'tvs-home-cinema', name: 'Televisions & Home Cinema', group: 'audio', template: 'generic', card: [], desc: 'Smart LED TVs, 4K displays, and audio-visual setups.' },
  { id: 'mirrorless-dslr-cameras', name: 'Mirrorless & DSLR Cameras', group: 'imaging', template: 'camera', card: ['pixels', 'burst', 'video'], desc: 'Full-frame and APS-C enthusiast & professional camera bodies.' },
  { id: 'instant-cameras-film', name: 'Instant Cameras & Film', group: 'imaging', template: 'instantCamera', card: ['film', 'shutter', 'power'], desc: 'Instant photo cameras and compatible instant film packs.' },
  { id: 'lenses-optics', name: 'Lenses & Optics', group: 'imaging', template: 'lens', card: ['focal', 'maxAperture', 'vr'], desc: 'Prime lenses, telephoto zoom lenses, wide-angle lenses, and lens filters.' },
  { id: 'camera-accessories', name: 'Camera Accessories', group: 'imaging', template: 'generic', card: [], desc: 'Camera bags, tripods, rechargeable lithium battery packs, memory cards, and cleaning kits.' },
  { id: 'food-preparation', name: 'Food Preparation', group: 'kitchen', template: 'generic', card: [], desc: 'Heavy-duty mixer grinders, juicer mixer grinders, blenders, choppers, and hand blenders.' },
  { id: 'cooktops-small-appliances', name: 'Cooktops & Small Appliances', group: 'kitchen', template: 'generic', card: [], desc: 'Induction cooktops, electric kettles, sandwich makers, toasters, and rice cookers.' },
  { id: 'cookware-pressure-cookers', name: 'Cookware & Pressure Cookers', group: 'kitchen', template: 'generic', card: [], desc: 'Hard-anodized pressure cookers, stainless steel cookware, and non-stick pans.' },
  { id: 'air-cooling-ac', name: 'Air Cooling & Air Conditioning', group: 'home-utility', template: 'generic', card: [], desc: 'Inverter split ACs, window ACs, and portable desert & personal air coolers.' },
  { id: 'refrigeration-laundry', name: 'Refrigeration & Laundry', group: 'home-utility', template: 'generic', card: [], desc: 'Multi-door refrigerators, deep freezers, and automatic washing machines.' },
  { id: 'personal-grooming', name: 'Personal Grooming', group: 'home-utility', template: 'generic', card: [], desc: 'Cordless hair trimmers, beard stylers, and grooming kits.' },
  { id: 'ironing-garment-care', name: 'Ironing & Garment Care', group: 'home-utility', template: 'generic', card: [], desc: 'Dry irons and steam irons.' },
  { id: 'power-charging', name: 'Power & Charging', group: 'accessories', template: 'generic', card: [], desc: 'Efficient charging wall adapters (multi-port USB & Type-C), power banks, and braided fast-sync charging cables.' },
  { id: 'storage-solutions', name: 'Storage Solutions', group: 'accessories', template: 'generic', card: [], desc: 'High-speed microSD cards, USB flash pen drives, and external portable SSDs.' },
  { id: 'peripherals-gaming', name: 'Peripherals & Gaming', group: 'accessories', template: 'generic', card: [], desc: 'Ergonomic gaming headsets, wireless controllers, mouse pads, and protective device cases.' },
];

// ── Spec templates ───────────────────────────────────────────────────────────
// Ordered groups of fields. Admin defines these per category; the product page
// renders whatever a product fills in and skips empty fields and groups.
export const templates = {
  // The client's 14 camera columns, grouped
  camera: [
    { group: 'Imaging', fields: [['sensor', 'Image sensor'], ['pixels', 'Effective pixels'], ['processor', 'Image processor']] },
    { group: 'Performance', fields: [['ibis', 'Image stabilisation'], ['burst', 'Continuous shooting'], ['af', 'Autofocus']] },
    { group: 'Video', fields: [['video', 'Video recording']] },
    { group: 'Viewfinder & display', fields: [['evf', 'Viewfinder'], ['lcd', 'LCD monitor']] },
    { group: 'Lens & storage', fields: [['mount', 'Lens mount'], ['cards', 'Memory card slots']] },
    { group: 'Connectivity & power', fields: [['connectivity', 'Connectivity'], ['battery', 'Battery life'], ['weight', 'Weight']] },
  ],
  lens: [
    { group: 'Optics', fields: [['focal', 'Focal length'], ['maxAperture', 'Maximum aperture'], ['minAperture', 'Minimum aperture'], ['construction', 'Lens construction'], ['angle', 'Angle of view (FX)']] },
    { group: 'Focus', fields: [['mfd', 'Minimum focus distance'], ['repro', 'Maximum reproduction ratio']] },
    { group: 'Features', fields: [['vr', 'Vibration reduction'], ['blades', 'Diaphragm blades']] },
    { group: 'Physical', fields: [['mount', 'Mount'], ['format', 'Format'], ['filter', 'Filter size'], ['dimensions', 'Dimensions'], ['weight', 'Weight']] },
  ],
  instantCamera: [
    { group: 'Film & image', fields: [['film', 'Film'], ['pictureSize', 'Picture size'], ['developing', 'Developing time']] },
    { group: 'Lens & exposure', fields: [['lens', 'Lens'], ['range', 'Shooting range'], ['shutter', 'Shutter'], ['exposure', 'Exposure control'], ['flash', 'Flash'], ['viewfinder', 'Viewfinder']] },
    { group: 'Power & physical', fields: [['power', 'Power supply'], ['dimensions', 'Dimensions'], ['weight', 'Weight']] },
  ],
  film: [
    { group: 'Specifications', fields: [['format', 'Film format'], ['filmSize', 'Film size'], ['pictureSize', 'Picture size'], ['iso', 'Sensitivity'], ['exposures', 'Exposures'], ['compatible', 'Compatible with']] },
  ],
  printer: [
    { group: 'Printing', fields: [['film', 'Compatible film'], ['imageSize', 'Image size'], ['method', 'Print method'], ['resolution', 'Print resolution'], ['printTime', 'Print time']] },
    { group: 'Connectivity', fields: [['connection', 'Connection'], ['formats', 'Image formats']] },
    { group: 'Power', fields: [['battery', 'Battery'], ['printsPerCharge', 'Prints per charge'], ['charging', 'Charging time']] },
    { group: 'Physical', fields: [['dimensions', 'Dimensions'], ['weight', 'Weight']] },
  ],
  phone: [
    { group: 'Display', fields: [['display', 'Display'], ['brightness', 'Brightness'], ['glass', 'Cover glass']] },
    { group: 'Performance', fields: [['processor', 'Processor'], ['memory', 'Memory'], ['storage', 'Storage']] },
    { group: 'Camera', fields: [['rearCameras', 'Rear cameras'], ['frontCamera', 'Front camera'], ['zoom', 'Zoom']] },
    { group: 'Battery & charging', fields: [['battery', 'Battery'], ['wired', 'Wired charging'], ['wireless', 'Wireless charging']] },
    { group: 'Software', fields: [['os', 'Operating system'], ['updates', 'Updates']] },
    { group: 'Connectivity', fields: [['network', 'Network'], ['wifi', 'Wi-Fi'], ['bluetooth', 'Bluetooth'], ['otherConn', 'Other']] },
    { group: 'Design', fields: [['durability', 'Durability'], ['dimensions', 'Dimensions'], ['weight', 'Weight']] },
  ],
  watch: [
    { group: 'Display', fields: [['display', 'Display'], ['brightness', 'Peak brightness']] },
    { group: 'Performance', fields: [['processor', 'Processor'], ['memory', 'Memory & storage'], ['os', 'Operating system']] },
    { group: 'Battery', fields: [['capacity', 'Capacity'], ['batteryLife', 'Battery life (AOD on)'], ['saver', 'With Battery Saver'], ['charging', 'Charging']] },
    { group: 'Health & sensors', fields: [['sensors', 'Sensors']] },
    { group: 'Connectivity', fields: [['connectivity', 'Connectivity'], ['compatibility', 'Compatibility']] },
    { group: 'Design', fields: [['caseSizes', 'Case sizes'], ['durability', 'Durability'], ['weight', 'Weight (without band)'], ['materials', 'Materials']] },
  ],
  generic: [{ group: 'Specifications', fields: [] }],
};

// v2: the client's brand list. `inHouse` brands are BMK's own (link out to their
// sites); `groups` drive the homepage brand filter. Logos are placeholders.
export const brands = [
  { id: 'seeken', name: 'SEEKEN', inHouse: true, groups: ['smart-devices', 'audio', 'kitchen', 'accessories'], sites: [['seeken.com', 'Global'], ['seeken.co.in', 'India']], intro: 'BMK Group’s flagship consumer technology and smart lifestyle brand. SEEKEN delivers modern, accessible innovation across smartwatches, wireless audio, mobile accessories, and a specialized line of Made-in-India home and kitchen appliances designed for connected everyday living.' },
  { id: 'team-appliances', name: 'TEAM Appliances', inHouse: true, groups: ['kitchen', 'home-utility'], sites: [['teamappliances.co', '']], intro: 'A dedicated domestic living and kitchen appliance brand acquired by BMK Group in 2023. TEAM Appliances focuses on dependable, efficient, and practical household solutions engineered for everyday home culinary and cleaning needs.' },
  { id: 'nikon', name: 'Nikon', groups: ['imaging'], intro: 'A world-renowned Japanese optics and imaging pioneer. BMK Group serves as the official distributor of Nikon cameras, lenses, and optical accessories in Zambia via SEEKEN ELECTRONICS LIMITED.' },
  { id: 'canon', name: 'Canon', groups: ['imaging'], intro: 'A global titan in professional and consumer digital imaging, broadcast optics, DSLR, mirrorless cameras, lenses, and printing technology.' },
  { id: 'fujifilm', name: 'FUJIFILM', groups: ['imaging'], intro: 'A global leader in photography, digital mirrorless imaging, and instant print technology. BMK Group operates as the official distributor of Fujifilm cameras and accessories in the Democratic Republic of the Congo via ETS HB Trading & BMK Gulf.' },
  { id: 'sony', name: 'Sony', groups: ['imaging', 'audio', 'accessories'], intro: 'A premier global brand in professional digital imaging, personal audio, home entertainment systems, and gaming peripherals.' },
  { id: 'samsung', name: 'Samsung', groups: ['smart-devices', 'audio', 'home-utility'], intro: 'A global technology powerhouse recognized worldwide for market-leading televisions, digital home appliances, monitors, and consumer smart devices.' },
  { id: 'lg', name: 'LG', groups: ['audio', 'home-utility'], intro: 'A global innovator in modern consumer electronics, OLED and ultra-high-definition displays, advanced home appliances, and residential climate control systems.' },
  { id: 'sandisk', name: 'SanDisk', groups: ['accessories'], intro: 'An industry standard in digital storage solutions, delivering high-speed microSD cards, flash memory drives, and portable solid-state drives.' },
  { id: 'prestige', name: 'Prestige', groups: ['kitchen'], intro: 'One of India’s most trusted kitchen appliance and cookware brands, renowned for pressure cookers, non-stick cookware, gas stoves, and modern induction cooktops.' },
  { id: 'sujata', name: 'Sujata', groups: ['kitchen'], intro: 'India’s benchmark for heavy-duty mixer grinders, juicers, and commercial-grade food preparation appliances engineered for intensive daily performance.' },
  { id: 'voltas', name: 'Voltas', groups: ['home-utility'], intro: 'A Tata enterprise and market leader in energy-efficient cooling solutions, specializing in split and window air conditioners, commercial refrigeration, and domestic air coolers.' },
  { id: 'symphony', name: 'Symphony', groups: ['home-utility'], intro: 'The world’s pioneer and largest manufacturer of domestic, commercial, and industrial evaporative air coolers.' },
  { id: 'sharp', name: 'Sharp', groups: ['audio', 'kitchen', 'home-utility'], intro: 'An established consumer electronics and technology brand offering reliable display solutions, microwave ovens, and essential home appliances.' },
];

// ── Products ─────────────────────────────────────────────────────────────────
// released: ISO date, drives "Latest" sort. images: labels for placeholder
// shots (count varies by product to exercise the gallery). Spec values can be:
//   string               → single value
//   string[]             → list
//   { [variant]: value } → per-variant value (e.g. watch case sizes)
export const products = [
  {
    slug: 'fujifilm-x-h2s',
    brand: 'fujifilm',
    category: 'mirrorless-dslr-cameras',
    name: 'FUJIFILM X-H2S',
    model: 'X-H2S',
    modelNo: null,
    released: '2022-07-07',
    colours: ['Black'],
    images: ['Front', 'Back', 'Top', 'Side', 'With lens'],
    short: 'Flagship APS-C body built for speed: a stacked 26.16MP sensor, 40 fps bursts and 6.2K video.',
    overview: [
      'The X-H2S pairs a stacked X-Trans CMOS 5 HS sensor with X-Processor 5 for fast readout, tracking autofocus and continuous shooting at up to 40 frames per second.',
      'A high-resolution OLED viewfinder, vari-angle touchscreen and dual card slots (SD and CFexpress Type B) make it suited to sports, wildlife and professional video work.',
    ],
    specs: {
      sensor: 'APS-C X-Trans CMOS 5 HS',
      pixels: '26.16 Megapixels',
      processor: 'X-Processor 5',
      ibis: '5-axis, up to 7 stops',
      burst: 'Up to 40 fps',
      video: 'Up to 6.2K',
      af: 'Intelligent Hybrid AF with Subject Detection',
      evf: '5.76-million-dot OLED EVF',
      lcd: '3-inch vari-angle touchscreen',
      mount: 'FUJIFILM X mount',
      cards: 'SD and CFexpress Type B',
      connectivity: 'Wi-Fi, Bluetooth, USB Type-C, HDMI',
      battery: 'Approx. 580 shots (Normal mode)',
      weight: 'Approx. 660 g (including battery and memory card)',
    },
  },
  {
    slug: 'fujifilm-x-t5',
    brand: 'fujifilm',
    category: 'mirrorless-dslr-cameras',
    name: 'FUJIFILM X-T5',
    model: 'X-T5',
    modelNo: null,
    released: '2022-11-02',
    colours: ['Black', 'Silver'],
    images: ['Front', 'Back', 'Top', 'Side', 'With lens', 'Dials detail'],
    short: 'A 40.2MP APS-C camera with classic dial controls in a compact, lightweight body.',
    overview: [
      'The X-T5 combines a 40.2-megapixel X-Trans CMOS 5 HR sensor with X-Processor 5, delivering high-resolution stills and up to 6.2K video in a body that weighs around 557 g.',
      'Dedicated shutter speed, ISO and exposure compensation dials give direct, tactile control, while a three-way tilting touchscreen supports both landscape and portrait shooting.',
    ],
    features: [
      { title: '40.2MP X-Trans CMOS 5 HR', text: 'High-resolution sensor for detailed landscapes, architecture and portraits.' },
      { title: '5-axis stabilisation', text: 'Up to 7 stops of in-body image stabilisation for handheld shooting.' },
      { title: 'Classic dial controls', text: 'Shutter speed, ISO and exposure compensation dials on the top plate.' },
    ],
    specs: {
      sensor: 'APS-C X-Trans CMOS 5 HR',
      pixels: '40.2 Megapixels',
      processor: 'X-Processor 5',
      ibis: '5-axis, up to 7 stops',
      burst: 'Up to 20 fps (electronic shutter, 1.29× crop)',
      video: 'Up to 6.2K at 30p',
      af: 'Intelligent Hybrid AF with Subject Detection',
      evf: '3.69-million-dot OLED EVF',
      lcd: '3-inch, three-way tilt touchscreen',
      mount: 'FUJIFILM X mount',
      cards: 'SD, SDHC and SDXC; UHS-I and UHS-II',
      connectivity: 'Wi-Fi, Bluetooth, USB Type-C, HDMI Micro',
      battery: 'Approx. 580 shots (Normal mode)',
      weight: 'Approx. 557 g (including battery and memory card)',
    },
  },
  {
    slug: 'nikon-z8',
    brand: 'nikon',
    category: 'mirrorless-dslr-cameras',
    name: 'Nikon Z8',
    model: 'Z8',
    modelNo: null,
    released: '2023-05-26',
    colours: ['Black'],
    images: ['Front', 'Back', 'Top', 'Side'],
    short: 'A 45.7MP full-frame stacked-sensor camera with 8K video in a compact professional body.',
    overview: [
      'The Z8 brings a 45.7-megapixel stacked CMOS sensor and EXPEED 7 processing to a body smaller than Nikon’s flagship, shooting up to 20 fps in RAW and up to 120 fps at 11 MP.',
      'Internal 8.3K N-RAW video, a 4-axis tilting touchscreen and dual CFexpress / SD slots make it a hybrid stills and video tool.',
    ],
    features: [
      { title: 'Stacked 45.7MP sensor', text: 'Fast readout with no mechanical shutter needed.' },
      { title: '8.3K internal video', text: 'Up to 8.3K at 60p in 12-bit N-RAW.' },
      { title: 'Subject detection AF', text: '493-point hybrid AF recognising people, animals and vehicles.' },
      { title: 'Dual card slots', text: 'CFexpress Type B / XQD plus SD UHS-II.' },
    ],
    specs: {
      sensor: 'Full-frame (FX) stacked CMOS',
      pixels: '45.7 Megapixels',
      processor: 'EXPEED 7',
      ibis: '5-axis in-body vibration reduction',
      burst: 'Up to 20 fps (RAW); up to 120 fps (11 MP JPEG)',
      video: 'Up to 8.3K at 60p (N-RAW)',
      af: '493-point hybrid AF with subject detection',
      evf: '3.69-million-dot OLED EVF',
      lcd: '3.2-inch, 4-axis tilting touchscreen',
      mount: 'Nikon Z mount',
      cards: 'CFexpress Type B / XQD and SD (UHS-II)',
      connectivity: 'Wi-Fi, Bluetooth, USB Type-C, HDMI Type A',
      battery: 'Approx. 330 shots (viewfinder)',
      weight: 'Approx. 910 g (including battery and memory card)',
    },
  },
  {
    slug: 'nikon-zf',
    brand: 'nikon',
    category: 'mirrorless-dslr-cameras',
    name: 'Nikon Zf',
    model: 'Zf',
    modelNo: null,
    released: '2023-10-13',
    colours: ['Black'],
    images: ['Front', 'Back', 'Top'],
    short: 'Heritage-styled full-frame camera with 24.5MP, EXPEED 7 autofocus and 8-stop stabilisation.',
    overview: [
      'The Zf wraps a 24.5-megapixel full-frame sensor and EXPEED 7 processing in a body inspired by Nikon’s classic film cameras, with physical dials for shutter speed, ISO and exposure compensation.',
      'In-body stabilisation rated up to 8 stops and a vari-angle touchscreen make it a capable everyday and travel camera.',
    ],
    specs: {
      sensor: 'Full-frame (FX) BSI CMOS',
      pixels: '24.5 Megapixels',
      processor: 'EXPEED 7',
      ibis: '5-axis, up to 8 stops',
      burst: 'Up to 14 fps; up to 30 fps (JPEG, pre-capture)',
      video: 'Up to 4K at 60p',
      af: '273-point hybrid AF with subject detection',
      evf: '3.69-million-dot OLED EVF',
      lcd: '3.2-inch vari-angle touchscreen',
      mount: 'Nikon Z mount',
      cards: 'SD (UHS-II) and microSD (UHS-I)',
      connectivity: 'Wi-Fi, Bluetooth, USB Type-C, HDMI Micro',
      battery: 'Approx. 410 shots (CIPA)',
      weight: 'Approx. 630 g (including battery and memory card)',
    },
  },
  {
    slug: 'nikkor-z-50mm-f12-s',
    brand: 'nikon',
    category: 'lenses-optics',
    name: 'NIKKOR Z 50mm f/1.2 S',
    model: 'Z 50mm f/1.2 S',
    modelNo: null,
    released: '2020-09-16',
    colours: ['Black'],
    images: ['Front', 'Side', 'Mounted on camera'],
    short: 'An ultra-fast S-Line standard prime with an f/1.2 aperture for shallow depth of field and low light.',
    overview: [
      'Built for full-frame Z mount cameras, this 50mm prime uses 17 elements in 15 groups, including ED and aspherical elements, for sharpness across the frame even wide open at f/1.2.',
      'A 9-blade rounded diaphragm produces smooth background blur, making it well suited to portraits, events and low-light work.',
    ],
    specs: {
      focal: '50 mm',
      maxAperture: 'f/1.2',
      minAperture: 'f/16',
      construction: '17 elements in 15 groups (2 ED, 3 aspherical)',
      angle: '47°',
      mfd: '0.45 m',
      repro: '0.15× (1:6.7)',
      vr: 'None (uses in-camera VR)',
      blades: '9 (rounded)',
      mount: 'Nikon Z mount',
      format: 'FX (full frame)',
      filter: '82 mm',
      dimensions: 'Approx. 90 × 150 mm',
      weight: 'Approx. 1,090 g',
    },
  },
  {
    slug: 'nikkor-z-70-200mm-f28-vr-s-ii',
    brand: 'nikon',
    category: 'lenses-optics',
    name: 'NIKKOR Z 70-200mm f/2.8 VR S II',
    model: 'Z 70-200mm f/2.8 VR S II',
    modelNo: null,
    released: '2026-02-24',
    colours: ['Black'],
    images: ['Front', 'Side', 'With tripod collar', 'Mounted on camera'],
    short: 'A lighter second-generation f/2.8 telephoto zoom with 5.5 stops of built-in vibration reduction.',
    overview: [
      'The second-generation 70-200mm f/2.8 S-Line zoom weighs approximately 998 g without its tripod collar, with 18 elements in 16 groups including fluorite, Super ED and SR elements.',
      'Built-in VR rated at 5.5 stops (up to 6.0 with Synchro VR) and an 11-blade rounded diaphragm suit sports, events and portrait work.',
    ],
    specs: {
      focal: '70–200 mm',
      maxAperture: 'f/2.8',
      minAperture: 'f/22',
      construction: '18 elements in 16 groups (incl. fluorite, Super ED, ED, SR and aspherical elements)',
      angle: '34°20′ – 12°20′',
      mfd: ['0.38 m (70–85 mm)', '0.8 m (200 mm)'],
      repro: '0.3× (at 70 mm)',
      vr: '5.5 stops (up to 6.0 with Synchro VR)',
      blades: '11 (rounded)',
      mount: 'Nikon Z mount',
      format: 'FX (full frame)',
      filter: '77 mm',
      dimensions: 'Approx. 90 × 208 mm',
      weight: 'Approx. 998 g (without tripod collar)',
    },
  },
  {
    slug: 'instax-mini-12',
    brand: 'fujifilm',
    category: 'instant-cameras-film',
    name: 'instax mini 12',
    model: 'instax mini 12',
    modelNo: null,
    released: '2023-03-16',
    colours: ['Blossom Pink', 'Pastel Blue', 'Mint Green', 'Clay White', 'Lilac Purple'],
    images: ['Front', 'Back', 'Side', 'With print'],
    short: 'Point-and-shoot instant camera with automatic exposure and a twist-to-start close-up mode.',
    overview: [
      'The instax mini 12 sets exposure automatically, so every shot is as simple as twisting the lens to power on and pressing the shutter.',
      'Close-Up Mode and parallax correction help frame selfies and close subjects from 0.3 m, and prints develop in around 90 seconds.',
    ],
    specs: {
      film: 'FUJIFILM instax mini Instant Film (sold separately)',
      pictureSize: '62 × 46 mm',
      developing: 'Approx. 90 seconds (varies with temperature)',
      lens: '2 components, 2 elements, f = 60 mm, 1:12.7',
      range: '0.3 m and beyond (Close-Up Mode 0.3–0.5 m)',
      shutter: 'Programmed electronic shutter, 1/2 to 1/250 sec',
      exposure: 'Automatic, LV 5.0–14.5 (ISO 800)',
      flash: 'Constant firing with automatic light adjustment, 0.3–2.2 m',
      viewfinder: 'Real image finder, 0.37×, with target spot',
      power: 'Two AA-size alkaline batteries (approx. 10 packs of film)',
      dimensions: '104 × 66.6 × 122 mm',
      weight: '306 g (without batteries, strap and film)',
    },
  },
  {
    slug: 'instax-mini-instant-film',
    brand: 'fujifilm',
    category: 'instant-cameras-film',
    template: 'film', // the category's default template is the instant camera one
    card: ['pictureSize', 'exposures', 'iso'],
    name: 'instax mini Instant Film',
    model: 'instax mini film (10 exposures)',
    modelNo: null,
    released: '2010-01-01',
    colours: [],
    images: ['Pack'],
    short: 'Credit-card-size instant film for instax mini cameras and instax mini Link printers.',
    overview: ['Glossy instant film in the instax mini format, producing 62 × 46 mm images that develop in about 90 seconds.'],
    specs: {
      format: 'instax mini',
      filmSize: '86 × 54 mm',
      pictureSize: '62 × 46 mm',
      iso: 'ISO 800',
      exposures: '10 per pack',
      compatible: 'instax mini cameras and instax mini Link printers',
    },
  },
  {
    slug: 'instax-mini-link-3',
    brand: 'fujifilm',
    category: 'instant-cameras-film', // client hierarchy has no printer category
    template: 'printer',
    card: ['printTime', 'connection', 'printsPerCharge'],
    name: 'instax mini Link 3',
    model: 'instax mini Link 3',
    modelNo: null,
    released: '2023-04-20',
    colours: ['Rose Pink', 'Clay White', 'Sage Green'],
    images: ['Front', 'Back', 'Printing'],
    short: 'Pocket smartphone printer that turns phone photos into instax mini prints in about 15 seconds.',
    overview: [
      'Connect over Bluetooth and print from the instax mini Link app in about 15 seconds per print, with around 100 prints per full charge.',
      'Prints use 3-colour OLED exposure at 318 dpi on instax mini film.',
    ],
    specs: {
      film: 'FUJIFILM instax mini Instant Film (sold separately)',
      imageSize: '62 × 46 mm',
      method: '3-colour exposure with OLED',
      resolution: '800 × 600 dots, 12.5 dots/mm (318 dpi)',
      printTime: 'Approx. 15 seconds',
      connection: 'Bluetooth 5.1',
      formats: 'JPEG, PNG, HEIF, DNG',
      battery: 'Built-in lithium-ion',
      printsPerCharge: 'Approx. 100',
      charging: 'Approx. 1.5–2 hours',
      dimensions: '90 × 37.3 × 125 mm',
      weight: '210 g (excluding film)',
    },
  },
];

// ── Lookups & helpers ────────────────────────────────────────────────────────
export const byId = (list, id) => list.find((x) => x.id === id);
export const brandOf = (p) => byId(brands, p.brand);
export const categoryOf = (p) => byId(categories, p.category);
export const groupOf = (c) => byId(groups, c.group);
export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const categoriesIn = (groupId) => categories.filter((c) => c.group === groupId);
/** Spec template and card highlights: the product's own, else its category's. */
export const templateOf = (p) => p.template || categoryOf(p).template;
export const cardFieldsOf = (p) => p.card || categoryOf(p).card;
export const inHouseBrands = brands.filter((b) => b.inHouse);
export const partnerBrands = brands.filter((b) => !b.inHouse);

/** Field label lookup across a template. */
export function fieldLabel(templateId, key) {
  for (const g of templates[templateId] || []) for (const [k, l] of g.fields) if (k === key) return l;
  return key;
}

/** Shortest readable form of a spec value, for cards and highlight tiles. */
export function shortValue(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.length > 1 ? `${v[0]} +${v.length - 1}` : v[0];
  if (typeof v === 'object') return Object.values(v).join(' / ');
  return v;
}

/** Highlights for a product card: label + short value, from the category config. */
export function highlightsFor(p) {
  return cardFieldsOf(p)
    .filter((k) => p.specs[k] != null)
    .map((k) => ({ label: fieldLabel(templateOf(p), k), value: shortValue(p.specs[k]) }));
}

/** Count of filled spec fields — used in notes to show template sizes. */
export const specCount = (p) => Object.keys(p.specs).length;

/** Search: every query token must match name/model/brand/category text.
 *  Punctuation-insensitive, so "xt5" finds "X-T5". */
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
export function searchProducts(q) {
  const tokens = q.toLowerCase().split(/\s+/).map(norm).filter(Boolean);
  if (!tokens.length) return [];
  return products.filter((p) => {
    const c = categoryOf(p);
    const hay = norm([p.name, p.model, p.modelNo, brandOf(p).name, c.name, groupOf(c).name].join(' '));
    return tokens.every((t) => hay.includes(t));
  });
}
export function searchBrands(q) {
  const n = norm(q);
  return n ? brands.filter((b) => norm(b.name).includes(n) || n.includes(norm(b.name))) : [];
}
export function searchCategories(q) {
  const n = norm(q);
  return n ? categories.filter((c) => norm(c.name).includes(n) || norm(groupOf(c).name).includes(n)) : [];
}

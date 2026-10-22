// ─────────────────────────────────────────────────────────────────────────────
// Wireframe catalogue data
//
// Shape mirrors the planned Laravel/MySQL model so the wireframe proves the
// structure, not just the visuals:
//   group (4) → category (14) → spec template → product
// A product belongs to one brand and one category. Its spec sheet layout comes
// entirely from its category's template, so new product types only need a new
// template, never a new page layout.
//
// Camera specs for the two FUJIFILM bodies are verbatim from the client sheet
// (BMK_Global_Website_Product_Details.xlsx). Other specs are from the makers'
// published spec pages (see wireframe/README.md). Descriptions are draft copy.
// ─────────────────────────────────────────────────────────────────────────────

export const groups = [
  { id: 'photography', name: 'Photography' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'audio', name: 'Audio' },
  { id: 'storage', name: 'Memory & Storage' },
];

// Client sheet category names, cleaned (the sheet has "MIRRORLESS  CAMERAS"
// with and without a double space; both map here).
export const categories = [
  { id: 'mirrorless-cameras', name: 'Mirrorless Cameras', group: 'photography', template: 'camera', card: ['pixels', 'burst', 'video'] },
  { id: 'dslr-cameras', name: 'DSLR Cameras', group: 'photography', template: 'camera', card: ['pixels', 'burst', 'video'] },
  { id: 'camera-lenses', name: 'Camera Lenses', group: 'photography', template: 'lens', card: ['focal', 'maxAperture', 'vr'] },
  { id: 'camera-accessories', name: 'Camera Accessories', group: 'photography', template: 'generic', card: [] },
  { id: 'action-cameras', name: 'Action Cameras', group: 'photography', template: 'generic', card: [] },
  { id: 'mini-cameras', name: 'Mini Cameras', group: 'photography', template: 'instantCamera', card: ['film', 'shutter', 'power'] },
  { id: 'mini-camera-paper', name: 'Mini Camera Paper', group: 'photography', template: 'film', card: ['pictureSize', 'exposures', 'iso'] },
  { id: 'photo-printers', name: 'Photo Printers', group: 'photography', template: 'printer', card: ['printTime', 'connection', 'printsPerCharge'] },
  { id: 'binoculars', name: 'Binoculars', group: 'photography', template: 'generic', card: [] },
  { id: 'mobile-phones', name: 'Mobile Phones', group: 'mobile', template: 'phone', card: ['display', 'processor', 'rearCameras'] },
  { id: 'smart-watches', name: 'Smart Watches', group: 'mobile', template: 'watch', card: ['caseSizes', 'batteryLife', 'durability'] },
  { id: 'mobile-accessories', name: 'Mobile Accessories', group: 'mobile', template: 'generic', card: [] },
  { id: 'speakers', name: 'Speakers', group: 'audio', template: 'generic', card: [] },
  { id: 'memory-cards', name: 'Memory Cards', group: 'storage', template: 'generic', card: [] },
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

export const brands = [
  {
    id: 'fujifilm',
    name: 'FUJIFILM',
    intro:
      'Japanese imaging company behind the X Series mirrorless cameras and the instax instant range, from interchangeable-lens bodies to instant cameras, film and smartphone printers.',
  },
  {
    id: 'nikon',
    name: 'Nikon',
    intro: 'Japanese imaging company known for its Z series full-frame mirrorless cameras and NIKKOR lenses.',
  },
  {
    id: 'google',
    name: 'Google',
    intro: 'Pixel phones and Pixel Watch, designed by Google around Android and Wear OS, with long-term software support.',
  },
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
    category: 'mirrorless-cameras',
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
    category: 'mirrorless-cameras',
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
    category: 'mirrorless-cameras',
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
    category: 'mirrorless-cameras',
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
    category: 'camera-lenses',
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
    category: 'camera-lenses',
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
    category: 'mini-cameras',
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
    category: 'mini-camera-paper',
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
    category: 'photo-printers',
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
  {
    slug: 'google-pixel-10-pro',
    brand: 'google',
    category: 'mobile-phones',
    name: 'Google Pixel 10 Pro',
    model: 'Pixel 10 Pro',
    modelNo: 'G4QUR',
    released: '2025-08-20',
    colours: ['Obsidian', 'Moonstone', 'Jade', 'Porcelain'],
    images: ['Front', 'Back', 'Side', 'Camera bar'],
    short: 'A 6.3-inch Pixel with Google Tensor G5, 16 GB of memory and a 5× telephoto camera.',
    overview: [
      'Pixel 10 Pro runs on Google Tensor G5 with 16 GB of memory and a 6.3-inch Super Actua display that reaches 3,300 nits at peak.',
      'A triple rear camera system with a 48 MP 5× telephoto and up to 100× Pro Zoom, plus seven years of OS and security updates.',
    ],
    features: [
      { title: 'Triple rear camera', text: '50 MP wide, 48 MP ultrawide and 48 MP 5× telephoto.' },
      { title: 'Google Tensor G5', text: 'With Titan M2 security coprocessor.' },
      { title: '7 years of updates', text: 'OS, security and Pixel Drop updates.' },
    ],
    specs: {
      display: '6.3-inch Super Actua LTPO OLED, 1280 × 2856, 1–120 Hz',
      brightness: 'Up to 2,200 nits (HDR), 3,300 nits peak',
      glass: 'Corning Gorilla Glass Victus 2',
      processor: 'Google Tensor G5, Titan M2 security coprocessor',
      memory: '16 GB',
      storage: ['128 GB', '256 GB', '512 GB', '1 TB'],
      rearCameras: ['50 MP wide, ƒ/1.68', '48 MP ultrawide with macro focus, ƒ/1.7', '48 MP 5× telephoto, ƒ/2.8, OIS'],
      frontCamera: '42 MP ultrawide, ƒ/2.2, autofocus',
      zoom: '5× optical, up to 100× Pro Zoom',
      battery: '4,870 mAh (typical)',
      wired: 'Up to 55% in about 30 minutes (30 W charger)',
      wireless: 'Qi2-certified, up to 15 W (Pixelsnap)',
      os: 'Android 16',
      updates: '7 years of OS and security updates',
      network: '5G (Sub-6 GHz and mmWave)',
      wifi: 'Wi-Fi 7',
      bluetooth: 'Bluetooth 6',
      otherConn: ['NFC', 'Ultra-wideband', 'Dual eSIM'],
      durability: 'IP68 dust and water resistance',
      dimensions: '152.8 × 72.0 × 8.6 mm',
      weight: '207 g',
    },
  },
  {
    slug: 'google-pixel-watch-4',
    brand: 'google',
    category: 'smart-watches',
    name: 'Google Pixel Watch 4',
    model: 'Pixel Watch 4',
    modelNo: null,
    released: '2025-10-09',
    colours: ['Matte Black', 'Polished Silver', 'Champagne Gold', 'Satin Moonstone'],
    variants: ['41 mm', '45 mm'],
    images: ['Front', 'Side', 'Back (sensors)', 'On wrist', 'Charging dock'],
    short: 'Domed Actua 360 display, health sensors and up to 40 hours of battery in two case sizes.',
    overview: [
      'Pixel Watch 4 comes in 41 mm and 45 mm sizes with a domed Actua 360 AMOLED display reaching 3,000 nits.',
      'Snapdragon W5 Gen 2 runs Wear OS 6, with ECG, SpO2, skin temperature and multi-path heart rate sensing.',
    ],
    specs: {
      display: 'Actua 360 AMOLED LTPO, 320 ppi, 1–60 Hz',
      brightness: 'Up to 3,000 nits',
      processor: 'Qualcomm Snapdragon W5 Gen 2 with Cortex-M55 co-processor',
      memory: '32 GB eMMC, 2 GB SDRAM',
      os: 'Wear OS 6',
      capacity: { '41 mm': '325 mAh', '45 mm': '455 mAh' },
      batteryLife: { '41 mm': 'Up to 30 hours', '45 mm': 'Up to 40 hours' },
      saver: { '41 mm': 'Up to 48 hours', '45 mm': 'Up to 72 hours' },
      charging: 'About 15 minutes to 50% (Quick Charge Dock)',
      sensors: [
        'Multi-path optical heart rate',
        'ECG-compatible electrical sensors',
        'SpO2 (red and infrared)',
        'Skin temperature',
        'Skin conductance (cEDA)',
        'Compass, altimeter, barometer',
        'Accelerometer, gyroscope, ambient light',
      ],
      connectivity: ['4G LTE', 'Wi-Fi 6 (2.4 / 5 GHz)', 'Bluetooth 6.0', 'NFC', 'Ultra-wideband', 'Satellite SOS', 'Dual-frequency GPS'],
      compatibility: 'Android 11.0 or newer; Google Account and Pixel Watch app',
      caseSizes: '41 mm, 45 mm',
      durability: '5 ATM, IP68',
      weight: { '41 mm': '31.0 g', '45 mm': '36.7 g' },
      materials: '100% recycled aluminium case',
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
  const c = categoryOf(p);
  return c.card
    .filter((k) => p.specs[k] != null)
    .map((k) => ({ label: fieldLabel(c.template, k), value: shortValue(p.specs[k]) }));
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

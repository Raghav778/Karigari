export interface Craftsman {
  id: string;
  name: string;
  craft: string;
  region: string;
  location: string;
  experience: string;
  image: string;          // asset key OR full Cloudinary URL
  story: string;
  materials: string[];
  endangered: boolean;
  pricePerHour: number;
  rating: number;
  specialties: string[];

  // ── Fields present only on Firestore (approved karigar) docs ──────────────
  isFirestore?: boolean;
  userId?: string;

  // Contact
  phone?: string;
  whatsapp?: string;
  email?: string;
  village?: string;
  pincode?: string;
  address?: string;
  workshopAddress?: string;

  // Social
  instagram?: string;
  facebook?: string;
  youtube?: string;

  // Craft extras
  techniques?: string[];
  priceRange?: string;
  priceCustom?: string;

  // Story extras
  inspiration?: string;
  awards?: string;

  // Media
  portfolio?: string[];      // Cloudinary URLs (photos & videos)
  certificates?: string[];   // Cloudinary URLs

  // Verification
  verification?: {
    idType?: string;
    idProofUrl?: string;
  };

  // Bank
  bankDetails?: {
    bankName?: string;
    accountNo?: string;
    ifsc?: string;
    upi?: string;
  };

  // Agreements
  agreements?: {
    agreeTerms?: boolean;
    agreeAuth?: boolean;
    agreeMarket?: boolean;
    agreeGI?: boolean;
    agreeDC?: boolean;
  };
}

// ─── Helper: map a raw Firestore karigar document → Craftsman shape ───────────
export function mapFirestoreKarigarToCraftsman(id: string, data: any): Craftsman {
  const personal = data.personal || {};
  const craft    = data.craft    || {};

  const craftForm = craft.craftForm === "Other (specify below)"
    ? (craft.craftCustom || "Traditional Craft")
    : (craft.craftForm || "Traditional Craft");

  // Parse price from priceRange string like "₹2,500 – ₹5,000"
  const priceNumber = (() => {
    const range = craft.priceRange || "";
    const match = range.match(/[\d,]+/);
    if (match) return parseInt(match[0].replace(/,/g, ""), 10);
    return 1500;
  })();

  return {
    id,
    isFirestore: true,
    userId: data.userId,

    // Identity
    name:        personal.profileName || personal.name || "Unknown Artisan",
    craft:       craftForm,
    region:      craft.region || "Rajasthan",
    location:    personal.city || personal.village || "",
    experience:  craft.experience || "",
    image:       data.portfolio?.[0] || "",   // first portfolio photo as card image
    story:       data.description || "",
    materials:   data.materials || [],
    endangered:  data.agreements?.agreeGI ?? false,
    pricePerHour: priceNumber,
    rating:      4.5,
    specialties: data.specialties || [],

    // Contact
    phone:            personal.phone,
    whatsapp:         personal.whatsapp,
    email:            personal.email,
    village:          personal.village,
    pincode:          personal.pincode,
    address:          personal.address,
    workshopAddress:  personal.workshopAddress,

    // Social
    instagram: personal.instagram,
    facebook:  personal.facebook,
    youtube:   personal.youtube,

    // Craft extras
    techniques:  data.techniques,
    priceRange:  craft.priceRange,
    priceCustom: craft.priceCustom,

    // Story
    inspiration: data.inspiration,
    awards:      data.awards,

    // Media
    portfolio:    data.portfolio    || [],
    certificates: data.certificates || [],

    // Verification & bank
    verification: data.verification,
    bankDetails:  data.bankDetails,
    agreements:   data.agreements,
  };
}

// ─── Static craftsmen data ────────────────────────────────────────────────────
export const craftsmen: Craftsman[] = [
  {
    id: "1",
    name: "Mohan Lal Kumhar",
    craft: "Blue Pottery",
    region: "Rajasthan",
    location: "Jaipur",
    experience: "42 years",
    image: "pottery",
    story: "Born into a family of potters in the narrow lanes of Jaipur's old city, Mohan Lal learned the art of blue pottery from his grandfather. His pieces are displayed in galleries across Europe and Asia. He is one of the last masters who still uses the traditional quartz-based technique passed down through seven generations.",
    materials: ["Quartz Stone", "Raw Glaze", "Cobalt Oxide", "Multani Mitti"],
    endangered: true,
    pricePerHour: 2500,
    rating: 4.9,
    specialties: ["Persian Motifs", "Floral Patterns", "Geometric Art"],
  },
  {
    id: "2",
    name: "Shanti Devi Joshi",
    craft: "Phad Painting",
    region: "Rajasthan",
    location: "Bhilwara",
    experience: "35 years",
    image: "phad",
    story: "Shanti Devi broke the tradition of Phad painting being a male-only art form. Her scrolls depicting the stories of Pabuji and Devnarayanji have been exhibited at the National Gallery. She uses only natural dyes extracted from flowers, minerals, and bark.",
    materials: ["Handloom Cloth", "Natural Dyes", "Bamboo Brushes", "Gum Arabic"],
    endangered: true,
    pricePerHour: 2000,
    rating: 4.8,
    specialties: ["Narrative Scrolls", "Deity Panels", "Folk Epics"],
  },
  {
    id: "3",
    name: "Fatima Begum",
    craft: "Bandhani",
    region: "Rajasthan",
    location: "Jodhpur",
    experience: "28 years",
    image: "bandhani",
    story: "With fingers that move faster than the eye can follow, Fatima creates thousands of tiny knots on fabric to produce the intricate patterns of Bandhani. Her work has adorned brides across Rajasthan for nearly three decades.",
    materials: ["Pure Silk", "Cotton Fabric", "Natural Dyes", "Cotton Thread"],
    endangered: false,
    pricePerHour: 1800,
    rating: 4.7,
    specialties: ["Bridal Odhni", "Leheriya", "Mothda Pattern"],
  },
  {
    id: "4",
    name: "Jangarh Singh Shyam",
    craft: "Gond Art",
    region: "Madhya Pradesh",
    location: "Dindori",
    experience: "30 years",
    image: "gond",
    story: "A torchbearer of the Pardhan Gond tradition, Jangarh's intricate dot-and-line patterns transform ordinary surfaces into mythological landscapes. His work bridges the ancient tribal worldview with contemporary art sensibilities.",
    materials: ["Handmade Paper", "Natural Pigments", "Nib Pens", "Acrylic Colors"],
    endangered: true,
    pricePerHour: 2200,
    rating: 4.9,
    specialties: ["Tree of Life", "Animal Spirits", "Creation Myths"],
  },
  {
    id: "5",
    name: "Rekha Verma",
    craft: "Chanderi Weaving",
    region: "Madhya Pradesh",
    location: "Chanderi",
    experience: "25 years",
    image: "chanderi",
    story: "Rekha's handloom produces the legendary Chanderi fabric — so fine it can pass through a ring. Working on her grandmother's 200-year-old loom, she weaves gold zari into translucent silk, creating textiles that have clothed royalty for centuries.",
    materials: ["Mulberry Silk", "Gold Zari", "Cotton Yarn", "Wooden Loom"],
    endangered: true,
    pricePerHour: 3000,
    rating: 5.0,
    specialties: ["Zari Brocade", "Butis Pattern", "Tissue Weave"],
  },
  {
    id: "6",
    name: "Abdul Rashid Khan",
    craft: "Bagh Print",
    region: "Madhya Pradesh",
    location: "Dhar",
    experience: "38 years",
    image: "bagh",
    story: "Abdul Rashid's family has practiced the art of Bagh printing for over 400 years. Using hand-carved teak blocks and natural dyes from the river Bagh, he creates textiles that carry the geometric precision of Mughal gardens.",
    materials: ["Teak Wood Blocks", "Alizarin", "Iron Rust", "River Water"],
    endangered: true,
    pricePerHour: 1500,
    rating: 4.6,
    specialties: ["Geometric Motifs", "Floral Blocks", "Panel Prints"],
  },
  {
    id: "7",
    name: "Ghanshyam Das Sharma",
    craft: "Pichwai Painting",
    region: "Rajasthan",
    location: "Nathdwara",
    experience: "32 years",
    image: "pichwai",
    story: "Ghanshyam Das has spent his life painting devotional Pichwai cloths for the Shrinathji temple. Each of his large-format paintings depicting Krishna in seasonal settings takes up to three months and uses pigments ground from precious stones.",
    materials: ["Handwoven Cloth", "Stone Pigments", "Gold Leaf", "Squirrel Hair Brushes"],
    endangered: true,
    pricePerHour: 2800,
    rating: 4.9,
    specialties: ["Krishna Leela", "Seasonal Themes", "Temple Backdrops"],
  },
  {
    id: "8",
    name: "Sunita Meena",
    craft: "Thikri Art",
    region: "Rajasthan",
    location: "Jaipur",
    experience: "18 years",
    image: "thikri",
    story: "Sunita learned Thikri mosaic from the artisans who decorated Jaipur's royal havelis. She pieces together broken mirror shards and coloured glass into intricate geometric mandalas, breathing new life into a craft that once adorned palace walls.",
    materials: ["Mirror Shards", "Coloured Glass", "Lime Plaster", "Natural Pigments"],
    endangered: true,
    pricePerHour: 1600,
    rating: 4.6,
    specialties: ["Geometric Mandalas", "Floral Mosaics", "Wall Panels"],
  },
  {
    id: "9",
    name: "Ramzan Khan",
    craft: "Meenakari",
    region: "Rajasthan",
    location: "Jaipur",
    experience: "40 years",
    image: "meenakari",
    story: "Ramzan Khan is a sixth-generation Meenakari artist whose family was brought to Jaipur by Maharaja Man Singh. Firing vivid enamel colours onto gold and silver at precise temperatures, he creates jewellery that looks like captured gemstones.",
    materials: ["Gold Sheet", "Silver", "Enamel Powders", "Kiln"],
    endangered: true,
    pricePerHour: 3500,
    rating: 5.0,
    specialties: ["Floral Enamel", "Peacock Motifs", "Reverse Meenakari"],
  },
  {
    id: "10",
    name: "Sanjay Soni",
    craft: "Thewa Art",
    region: "Rajasthan",
    location: "Pratapgarh",
    experience: "22 years",
    image: "thewa",
    story: "Sanjay belongs to the Soni family, one of only a handful of families in the world who practice Thewa. He fuses 23-carat gold sheets onto molten coloured glass, etching royal court scenes so fine they require a magnifying glass to fully appreciate.",
    materials: ["23-Carat Gold Foil", "Coloured Glass", "Etching Tools", "Kiln"],
    endangered: true,
    pricePerHour: 4000,
    rating: 4.9,
    specialties: ["Royal Court Scenes", "Mythological Panels", "Miniature Portraits"],
  },
  {
    id: "11",
    name: "Zarina Bi",
    craft: "Gota Patti",
    region: "Rajasthan",
    location: "Jaipur",
    experience: "20 years",
    image: "gotaPatti",
    story: "Zarina stitches ribbons of real gold and silver tissue onto bridal lehengas with a precision that has made her the most sought-after Gota Patti artisan in Jaipur. Her work has been worn at royal weddings across Rajasthan.",
    materials: ["Gold Tissue Ribbon", "Silver Gota", "Silk Fabric", "Gold Thread"],
    endangered: false,
    pricePerHour: 2000,
    rating: 4.8,
    specialties: ["Bridal Wear", "Peacock Motifs", "Floral Appliqué"],
  },
  {
    id: "12",
    name: "Vijay Sharma",
    craft: "Miniature Painting",
    region: "Rajasthan",
    location: "Udaipur",
    experience: "29 years",
    image: "miniature",
    story: "Vijay paints on surfaces no larger than a postcard using brushes made from a single squirrel hair. His miniatures depicting Mughal court life and Radha-Krishna scenes have been acquired by collectors in New York, London, and Tokyo.",
    materials: ["Ivory Sheet", "Mineral Pigments", "Squirrel Hair Brush", "Gold Dust"],
    endangered: true,
    pricePerHour: 3200,
    rating: 4.9,
    specialties: ["Mughal Portraits", "Radha-Krishna", "Hunting Scenes"],
  },
  {
    id: "13",
    name: "Hanif Khatri",
    craft: "Sanganeri Print",
    region: "Rajasthan",
    location: "Sanganer, Jaipur",
    experience: "24 years",
    image: "sanganeri",
    story: "Hanif's family has been printing fabric in Sanganer for six generations using hand-carved wooden blocks passed down through each generation. His delicate floral and paisley prints on white muslin are exported to fashion houses across Europe.",
    materials: ["Wooden Blocks", "Natural Dyes", "White Muslin", "Resist Paste"],
    endangered: false,
    pricePerHour: 1400,
    rating: 4.7,
    specialties: ["Floral Motifs", "Paisley Patterns", "Discharge Printing"],
  },
  {
    id: "14",
    name: "Dhaniram Baiga",
    craft: "Dhokra",
    region: "Madhya Pradesh",
    location: "Bastar",
    experience: "35 years",
    image: "dhokra",
    story: "Dhaniram practices the 4000-year-old lost-wax casting technique passed down through his tribe. Each of his brass figures — animals, deities, everyday scenes — is unique because the clay mould is broken to release it. No two pieces are ever identical.",
    materials: ["Brass", "Beeswax", "Clay", "Charcoal"],
    endangered: true,
    pricePerHour: 1800,
    rating: 4.8,
    specialties: ["Tribal Figurines", "Animal Forms", "Ceremonial Objects"],
  },
  {
    id: "15",
    name: "Savitri Bai Patidar",
    craft: "Maheshwari Saree",
    region: "Madhya Pradesh",
    location: "Maheshwar",
    experience: "30 years",
    image: "maheshwari",
    story: "Savitri weaves on the banks of the Narmada river in the town where Rani Ahilya Bai Holkar revived this craft. Her sarees with their signature reversible border and silk-cotton blend have been worn by stateswomen and fashion icons alike.",
    materials: ["Mulberry Silk", "Cotton Yarn", "Gold Zari", "Wooden Loom"],
    endangered: false,
    pricePerHour: 2600,
    rating: 4.9,
    specialties: ["Reversible Border", "Checks & Stripes", "Tissue Weave"],
  },
  {
    id: "16",
    name: "Laxman Bhil",
    craft: "Pitthora Painting",
    region: "Madhya Pradesh",
    location: "Jhabua",
    experience: "26 years",
    image: "pitthora",
    story: "For Laxman and his Bhilala community, painting Pitthora on the walls of a home is an act of prayer. Every horse, deity, and village scene is placed according to sacred tradition. His work has been exhibited internationally as both art and anthropology.",
    materials: ["Natural Earth Pigments", "White Clay", "Bamboo Brushes", "Cow Dung Plaster"],
    endangered: true,
    pricePerHour: 1600,
    rating: 4.7,
    specialties: ["Ritual Wall Paintings", "Horse Processions", "Deity Panels"],
  },
  {
    id: "17",
    name: "Ramprasad Kushwaha",
    craft: "Stone Carving",
    region: "Madhya Pradesh",
    location: "Gwalior",
    experience: "38 years",
    image: "stonecarving",
    story: "Ramprasad's chisels have shaped sandstone into temple reliefs and deity sculptures for nearly four decades. His family traces its craft lineage to the artisans who built the great temples of Khajuraho, and he continues that tradition with every strike of the hammer.",
    materials: ["Sandstone", "Marble", "Iron Chisels", "Diamond Cutters"],
    endangered: true,
    pricePerHour: 2200,
    rating: 4.8,
    specialties: ["Temple Reliefs", "Deity Sculptures", "Architectural Elements"],
  },
  {
    id: "18",
    name: "Kamla Devi Prajapati",
    craft: "Terracotta Craft",
    region: "Madhya Pradesh",
    location: "Burhanpur",
    experience: "22 years",
    image: "teracotta",
    story: "Kamla hand-moulds clay into folk deities, harvest animals, and ritual lamps that have anchored village ceremonies for centuries. She fires her pieces in a traditional kiln dug from the earth, using techniques unchanged for thousands of years.",
    materials: ["Local River Clay", "Natural Oxides", "Rice Husk", "Wood Fire"],
    endangered: true,
    pricePerHour: 1200,
    rating: 4.6,
    specialties: ["Folk Deities", "Ritual Lamps", "Harvest Figurines"],
  },
  {
    id: "19",
    name: "Sukri Bai Gond",
    craft: "Tribal Jewellery",
    region: "Madhya Pradesh",
    location: "Bastar",
    experience: "27 years",
    image: "tribaljewellery",
    story: "Sukri crafts tribal ornaments from brass, seeds, shells, and beads that encode the identity of her Gond community. Every necklace, anklet, and armlet she makes carries meaning — which community you belong to, whether you are married, your place in the social fabric.",
    materials: ["Brass", "Glass Beads", "Seeds", "Shells", "Silver Wire"],
    endangered: false,
    pricePerHour: 1400,
    rating: 4.7,
    specialties: ["Marriage Ornaments", "Ceremonial Necklaces", "Brass Anklets"],
  },
  {
    id: "20",
    name: "Irrfan Ansari",
    craft: "Batik Art",
    region: "Madhya Pradesh",
    location: "Bhopal",
    experience: "20 years",
    image: "batik",
    story: "Irrfan applies hot wax to silk and cotton with a tjanting tool, building up layers of resist and dye to create richly patterned fabrics. His Bhopal school of Batik fuses Central Indian folk motifs with Persian-influenced geometry into vibrant wall hangings and sarees.",
    materials: ["Silk", "Cotton", "Beeswax", "Natural Dyes", "Tjanting Tool"],
    endangered: false,
    pricePerHour: 1800,
    rating: 4.6,
    specialties: ["Wall Hangings", "Saree Panels", "Abstract Motifs"],
  },
];
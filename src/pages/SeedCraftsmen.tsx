/**
 * SeedCraftsmen.tsx
 * ─────────────────────────────────────────────────────────────────
 * TEMPORARY PAGE — Add to routes, visit once to seed, then remove.
 *
 * STEP 1: Add to src/App.tsx (or wherever your routes live):
 *   import SeedCraftsmen from "./pages/SeedCraftsmen";
 *   <Route path="/admin-seed" element={<SeedCraftsmen />} />
 *
 * STEP 2: Visit http://localhost:5173/admin-seed
 *
 * STEP 3: Click "Seed All Craftsmen" — 31 profiles are inserted
 *         into Firestore with status: "approved".
 *
 * STEP 4: portfolio arrays are EMPTY — add images via the
 *         /admin-images page (see AdminImageUploader.tsx).
 *
 * STEP 5: Remove this route and file when done.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// ─── Raw seed data ────────────────────────────────────────────────────────────
const CRAFTSMEN_DATA = [
  // ══════════════════════════════════════════════════════════════════
  //  BLUE POTTERY — Rajasthan (Jaipur / Sanganer)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Rameshwar Prajapat",
      profileName: "Rameshwar Prajapat",
      age: "58",
      gender: "Male",
      city: "Jaipur",
      village: "",
      pincode: "302001",
      address: "15, Kumharon Ka Mohalla, Amer Road, Jaipur",
      phone: "9414001234",
      email: "rameshwar.prajapat@karigarh.in",
    },
    craft: {
      craftForm: "Blue Pottery",
      craftCustom: "",
      experience: "35–40 years",
      region: "Rajasthan",
      priceRange: "₹2,000 – ₹5,000",
    },
    description:
      "I am the fourth generation in my family to practise Blue Pottery — an art form that reached Jaipur through Persian craftsmen centuries ago. Unlike conventional clay pottery, our work uses a mix of quartz, glass, and fuller's earth, giving each piece its distinctive translucent quality. Every brush stroke of cobalt blue and turquoise is painted freehand; no two pieces are ever alike. Over 35 years I have trained more than 40 apprentices, keeping this endangered craft alive in the alleys of Amer Road.",
    materials: [
      "Quartz powder",
      "Fuller's earth",
      "Glass",
      "Cobalt oxide",
      "Multani mitti",
    ],
    specialties: [
      "Vases",
      "Tiles",
      "Decorative plates",
      "Flower pots",
      "Wall panels",
    ],
    techniques: [
      "Wheel throwing",
      "Moulding",
      "Freehand painting",
      "Low-temperature firing",
    ],
    inspiration:
      "My grandfather used to say — 'Mitti bolta hai, haath sunte hain.' (Clay speaks, hands listen.) That philosophy drives every piece I make.",
    awards:
      "National Award for Master Craftsperson (2011), Rajasthan Ratna Shilpi Award (2016)",
    workshopAddress: "Prajapat Blue Pottery Studio, Amer Road, Jaipur — 302001",
    instagram: "@rameshwar_bluepottery",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Sunita Kumari Prajapat",
      profileName: "Sunita Prajapat",
      age: "42",
      gender: "Female",
      city: "Sanganer",
      village: "Sanganer",
      pincode: "303902",
      address: "7, Kumhar Basti, Sanganer, Jaipur",
      phone: "9414005678",
      email: "sunita.bluepottery@karigarh.in",
    },
    craft: {
      craftForm: "Blue Pottery",
      craftCustom: "",
      experience: "20–25 years",
      region: "Rajasthan",
      priceRange: "₹1,500 – ₹3,500",
    },
    description:
      "I learned Blue Pottery from my mother-in-law in Sanganer, a town historically famous for its pottery and block-printing traditions. Over two decades I have developed a distinctive style that blends traditional Persian floral motifs with local Rajasthani folk imagery — peacocks, camels, and desert flowers appear alongside geometric borders. I run a small workshop from my home where six women from the neighbourhood work with me, giving them a livelihood without leaving the village.",
    materials: [
      "Quartz powder",
      "Multani mitti",
      "Natural pigments",
      "Cobalt blue glaze",
    ],
    specialties: [
      "Decorative bowls",
      "Utility ware",
      "Tea sets",
      "Miniature figurines",
    ],
    techniques: [
      "Hand moulding",
      "Freehand brushwork",
      "Double-firing technique",
    ],
    inspiration:
      "Seeing my mother-in-law shape a lump of quartz into a vase taught me that patience and clay have a lot in common.",
    awards:
      "Rajasthan State Craft Award (2019), Featured in Crafts Council of India Newsletter",
    workshopAddress: "Sunita's Pottery Home Studio, Sanganer — 303902",
    instagram: "@sunita_bluepottery",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Arjun Neel",
      profileName: "Arjun Neel",
      age: "34",
      gender: "Male",
      city: "Jaipur",
      village: "",
      pincode: "302002",
      address: "22, Gopinath Ji Ka Rasta, Johari Bazaar, Jaipur",
      phone: "9602001122",
      email: "arjun.neel@karigarh.in",
    },
    craft: {
      craftForm: "Blue Pottery",
      craftCustom: "",
      experience: "10–15 years",
      region: "Rajasthan",
      priceRange: "₹800 – ₹2,500",
    },
    description:
      "I represent the new generation of Blue Pottery — I studied traditional craft formally at the Jawahar Kala Kendra before setting up my own studio at 24. While I respect classical motifs, my work deliberately experiments with contemporary forms: geometric abstract patterns, minimal Scandinavian-influenced lines, and monochrome pieces that appeal to modern interiors. I conduct weekend workshops for tourists and corporate groups, offering hands-on pottery experiences that connect people with this 300-year-old tradition.",
    materials: ["Quartz powder", "Kaolin", "Cobalt oxide", "Iron oxide"],
    specialties: [
      "Minimalist modern ware",
      "Corporate gifting sets",
      "Workshop kits",
    ],
    techniques: [
      "Slab building",
      "Contemporary design fusion",
      "Resist painting",
    ],
    inspiration:
      "I want Blue Pottery to be on design studio mood boards, not just in museum showcases.",
    awards: "Young Craftsperson Fellowship, Crafts Council of India (2021)",
    workshopAddress: "Studio Neel, Johari Bazaar, Jaipur — 302002",
    instagram: "@arjun.neel.studio",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Fatima Bano",
      profileName: "Fatima Bano",
      age: "67",
      gender: "Female",
      city: "Jaipur",
      village: "",
      pincode: "302003",
      address: "Purani Basti, Ramganj, Jaipur",
      phone: "9414007890",
      email: "fatima.bluepottery@karigarh.in",
    },
    craft: {
      craftForm: "Blue Pottery",
      craftCustom: "",
      experience: "40+ years",
      region: "Rajasthan",
      priceRange: "₹3,000 – ₹8,000",
    },
    description:
      "In 45 years of practice, I have witnessed Blue Pottery almost disappear twice — once during partition-era disruptions and again during the cheap import era of the 1990s. I refused to stop. My speciality is large decorative wall tiles and murals, each hand-painted with stories from local folk tales. Several of my tile murals adorn government buildings and five-star hotels in Jaipur. I was among the first women to set up an independent pottery kiln in the old city — a small revolution at the time.",
    materials: [
      "Quartz",
      "Fuller's earth",
      "Traditional mineral pigments",
      "Borax glaze",
    ],
    specialties: [
      "Wall murals",
      "Large decorative tiles",
      "Custom architectural pieces",
    ],
    techniques: [
      "Traditional Persian floral painting",
      "Narrative tile composition",
    ],
    inspiration:
      "Every crack in a kiln-fired tile teaches you something. I have been learning for 45 years and I am still not done.",
    awards:
      "Padma Shri nominee (2018), National Minority Award for Craftsmanship",
    workshopAddress: "Fatima's Tilework Studio, Ramganj, Jaipur — 302003",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  PHAD PAINTING — Rajasthan (Bhilwara / Shahpura)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Shanti Lal Joshi",
      profileName: "Shanti Lal Joshi",
      age: "72",
      gender: "Male",
      city: "Bhilwara",
      village: "Shahpura",
      pincode: "311404",
      address: "Joshi Mohalla, Near Devnarayan Temple, Shahpura",
      phone: "9414021001",
      email: "shantilal.phad@karigarh.in",
    },
    craft: {
      craftForm: "Phad Painting",
      craftCustom: "",
      experience: "40+ years",
      region: "Rajasthan",
      priceRange: "₹5,000 – ₹25,000",
    },
    description:
      "Phad is not merely painting — it is a sacred scroll. Each Phad I create narrates the life and adventures of the folk deity Devnarayan, who rides a blue horse across the celestial battlefield. Traditionally, Phad scrolls were carried by nomadic Bhopa priest-singers who would unroll them under lamplight and sing the epic. My family — the Joshi clan of Shahpura — has been the sole custodian of this tradition for seven generations. A single large Phad can take three months to complete; the smallest detail, a warrior's earring, may take an entire afternoon.",
    materials: [
      "Handmade cloth (khadi)",
      "Natural stone colours",
      "Vegetable dyes",
      "Gum arabic",
    ],
    specialties: ["Devnarayan Phad", "Pabuji Phad", "Custom narrative scrolls"],
    techniques: [
      "Outline first method",
      "Flat-fill colouring",
      "Sequential panel narration",
    ],
    inspiration:
      "The Bhopa singers gave our paintings their voice. Now that fewer Bhopas travel, I paint to keep their stories visible.",
    awards: "Padma Shri (2019), National Award for Traditional Painting (2004)",
    workshopAddress:
      "Joshi Phad Kendra, Devnarayan Temple Road, Shahpura — 311404",
    instagram: "@shantilal_phad",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Kaveri Joshi",
      profileName: "Kaveri Joshi",
      age: "45",
      gender: "Female",
      city: "Shahpura",
      village: "Shahpura",
      pincode: "311404",
      address: "Joshi Mohalla, Shahpura, Bhilwara",
      phone: "9414022002",
      email: "kaveri.phad@karigarh.in",
    },
    craft: {
      craftForm: "Phad Painting",
      craftCustom: "",
      experience: "20–25 years",
      region: "Rajasthan",
      priceRange: "₹2,500 – ₹12,000",
    },
    description:
      "I am Shanti Lal's daughter-in-law and learned Phad painting after marrying into the Joshi family. What began as learning a family tradition became a calling. I am among the first women in the community to paint full Phad scrolls independently — traditionally it was considered a male occupation. My Phads retain classical iconography but I have introduced a slightly more vibrant palette and more nuanced female characters, drawing attention to the often-overlooked women in Devnarayan's story.",
    materials: [
      "Khadi cloth",
      "Natural pigments",
      "Gum arabic",
      "Charcoal for outlines",
    ],
    specialties: [
      "Medium-sized Phad scrolls",
      "Miniature Phad panels",
      "Women-centric narratives",
    ],
    techniques: ["Traditional Phad outline method", "Natural colour layering"],
    inspiration:
      "The goddesses in our scrolls have always been painted by men. I paint them the way a woman would see them.",
    awards: "Rajasthan State Craft Award for Women Artisans (2022)",
    workshopAddress: "Joshi Phad Kendra, Shahpura — 311404",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Mahendra Singh Joshi",
      profileName: "Mahendra Singh",
      age: "38",
      gender: "Male",
      city: "Shahpura",
      village: "",
      pincode: "311404",
      address: "Main Market Road, Shahpura",
      phone: "9414023003",
      email: "mahendra.phad@karigarh.in",
    },
    craft: {
      craftForm: "Phad Painting",
      craftCustom: "",
      experience: "15–20 years",
      region: "Rajasthan",
      priceRange: "₹1,800 – ₹8,000",
    },
    description:
      "I grew up watching my grandfather and father paint Phad scrolls that covered entire walls. After a brief stint in a city job I returned to Shahpura, convinced that Phad deserved a wider audience. Today I work on both traditional large-format scrolls and smaller collectible formats — postcards, framed miniatures, and bookmarks — that make this sacred art accessible to people who cannot afford a full scroll. I also offer intensive 3-day workshops for artists who want to learn the Phad style seriously.",
    materials: ["Cotton cloth", "Herbal colours", "White base wash", "Gum"],
    specialties: [
      "Collectible miniatures",
      "Workshop instruction",
      "Traditional scrolls",
    ],
    techniques: ["Scaling down compositions", "Detail miniaturisation"],
    inspiration:
      "A Phad doesn't need to be six feet tall to tell a six-century story.",
    awards: "Young Artisan Grant, Rajasthan Lalit Kala Akademi (2020)",
    workshopAddress: "Mahendra's Phad Studio, Main Market, Shahpura — 311404",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Durga Devi",
      profileName: "Durga Devi",
      age: "55",
      gender: "Female",
      city: "Bhilwara",
      village: "",
      pincode: "311001",
      address: "Purani Kotra, Bhilwara",
      phone: "9414024004",
      email: "durgadevi.phad@karigarh.in",
    },
    craft: {
      craftForm: "Phad Painting",
      craftCustom: "",
      experience: "30–35 years",
      region: "Rajasthan",
      priceRange: "₹3,000 – ₹15,000",
    },
    description:
      "I began painting Phad as an act of devotion rather than commerce — the deity Devnarayan was my family's kuldevta (clan god). Over three decades what started as private ritual scrolls became commissions for temples, cultural organisations, and international collectors. My work is distinguished by extraordinarily dense crowd scenes; I have painted Phads with over 200 individual figures, each with a distinct expression. I believe the richness of a Phad lies in its detail — every figure has a story if you look long enough.",
    materials: [
      "Handwoven cotton",
      "Natural mineral colours",
      "Turmeric yellow",
      "Indigo",
    ],
    specialties: [
      "Large epic scrolls",
      "Temple commissions",
      "Dense multi-figure compositions",
    ],
    techniques: ["Crowd scene composition", "Traditional colour sequence"],
    inspiration:
      "I paint for Devnarayan first. If others want to buy the painting, that is his blessing.",
    awards: "District Craft Award, Bhilwara (2015, 2018)",
    workshopAddress: "Durga Devi's Workshop, Purani Kotra, Bhilwara — 311001",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  BANDHANI — Rajasthan (Jodhpur / Barmer / Sikar)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Salim Khatri",
      profileName: "Salim Khatri",
      age: "50",
      gender: "Male",
      city: "Jodhpur",
      village: "",
      pincode: "342001",
      address: "Khatri Mohalla, Siwanchi Gate, Jodhpur",
      phone: "9413001122",
      email: "salim.bandhani@karigarh.in",
    },
    craft: {
      craftForm: "Bandhani",
      craftCustom: "",
      experience: "25–30 years",
      region: "Rajasthan",
      priceRange: "₹1,200 – ₹6,000",
    },
    description:
      "The Khatri community of Jodhpur has practised Bandhani for 500 years — we are the original tie-dye artisans of Rajasthan. Bandhani means 'to tie'; my fingers tie thousands of tiny knots in silk or cotton before the fabric enters the dye bath. The knots resist the colour, revealing patterns when untied. My speciality is gharchola — the traditional red-and-gold Bandhani fabric used in Rajasthani wedding ceremonies. A single gharchola odhni can have up to 15,000 individual knots tied by hand.",
    materials: [
      "Pure silk",
      "Cotton muslin",
      "Azo-free dyes",
      "Natural indigo",
    ],
    specialties: [
      "Gharchola wedding fabric",
      "Chunari odhni",
      "Leheriya turbans",
    ],
    techniques: [
      "Finger-nail tying",
      "Multi-dip resist dyeing",
      "Knot pattern mapping",
    ],
    inspiration:
      "Every knot is a prayer. When the cloth is untied, you see whether the prayer was heard.",
    awards: "National Craft Award (2013), State Minority Artisan Award (2017)",
    workshopAddress: "Khatri Bandhani House, Siwanchi Gate, Jodhpur — 342001",
    instagram: "@salimkhatri_bandhani",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Rekha Devi Suthar",
      profileName: "Rekha Devi",
      age: "38",
      gender: "Female",
      city: "Barmer",
      village: "Jasol",
      pincode: "344001",
      address: "Suthar Para, Near Jasol Temple, Barmer",
      phone: "9413002233",
      email: "rekhadevi.bandhani@karigarh.in",
    },
    craft: {
      craftForm: "Bandhani",
      craftCustom: "",
      experience: "15–20 years",
      region: "Rajasthan",
      priceRange: "₹800 – ₹3,000",
    },
    description:
      "Barmer district has its own distinct Bandhani tradition — bolder dots, earthier colours drawn from desert plants, and larger geometric patterns compared to the fine Jodhpur work. I learned from my mother who learned from hers, stretching back to at least five generations. I work primarily in cotton — the natural fibres of the Thar desert — using indigo from the Barmer hills and pomegranate rind for golden yellow. Each piece I make is meant to be worn, not displayed; Barmer Bandhani is everyday life.",
    materials: ["Cotton", "Indigo", "Pomegranate rind", "Iron mordant"],
    specialties: ["Barmer bold-dot Bandhani", "Cotton odhni", "Dupatta sets"],
    techniques: [
      "Coarse thread tying",
      "Natural dye bathing",
      "Desert colour palette",
    ],
    inspiration:
      "The desert has its own colours — rust, indigo, burnt orange. My cloth is a map of where I live.",
    awards: "Block Print and Bandhani Cluster Award, RAJSICO (2021)",
    workshopAddress: "Rekha's Home Workshop, Jasol, Barmer — 344001",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Hanif Mohammed",
      profileName: "Hanif Mohammed",
      age: "62",
      gender: "Male",
      city: "Sikar",
      village: "",
      pincode: "332001",
      address: "Lakshmangarh Road, Sikar",
      phone: "9414003344",
      email: "hanif.bandhani@karigarh.in",
    },
    craft: {
      craftForm: "Bandhani",
      craftCustom: "",
      experience: "35–40 years",
      region: "Rajasthan",
      priceRange: "₹2,000 – ₹9,000",
    },
    description:
      "My family moved from Kutch to Sikar three generations ago, bringing the Kutchi Bandhani style with them. This gives my work a unique hybridity — Rajasthani colour preferences (crimson, saffron, emerald) merged with the precise fine-dot patterns of Gujarat. I am known in the trade for double ikat Bandhani — where both the warp and weft threads are resist-dyed before weaving, creating mirror patterns when the cloth is assembled. Very few artisans in India still practise this technically demanding form.",
    materials: [
      "Silk",
      "Fine cotton",
      "Alizarin red",
      "Vegetable indigo",
      "Chrome mordant",
    ],
    specialties: [
      "Double ikat Bandhani",
      "Bridal sarees",
      "Mashru fabric Bandhani",
    ],
    techniques: [
      "Warp-weft double resist",
      "Fine-dot Kutchi tying",
      "Sequential dyeing",
    ],
    inspiration:
      "The road from Kutch to Sikar is long. Every pattern in my cloth is a step of that journey.",
    awards: "National Minorities Development Fund Award (2010)",
    workshopAddress:
      "Hanif Bandhani Workshop, Lakshmangarh Road, Sikar — 332001",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Parvati Meghwal",
      profileName: "Parvati Meghwal",
      age: "29",
      gender: "Female",
      city: "Jodhpur",
      village: "Boranada",
      pincode: "342012",
      address: "Meghwal Basti, Boranada, Jodhpur",
      phone: "9602004455",
      email: "parvati.bandhani@karigarh.in",
    },
    craft: {
      craftForm: "Bandhani",
      craftCustom: "",
      experience: "5–10 years",
      region: "Rajasthan",
      priceRange: "₹600 – ₹2,000",
    },
    description:
      "I am among the youngest Bandhani artisans in Jodhpur and I see my work as a conversation between the old and the new. I was trained by my aunt, a veteran craftsperson, but I have started applying Bandhani patterns to unexpected items — tote bags, cushion covers, lampshades — making the craft relevant to younger buyers. I am also experimenting with low-impact fibre-reactive dyes that are safer for the river system than the synthetic dyes traditionally used. My small brand supplies boutique stores in Jodhpur's tourist district.",
    materials: ["Organic cotton", "Fibre-reactive dyes", "Linen blends"],
    specialties: [
      "Contemporary Bandhani products",
      "Eco-friendly dyeing",
      "Home accessories",
    ],
    techniques: ["Traditional tying on modern forms", "Eco-dye batching"],
    inspiration:
      "I want my granddaughter to still know this craft — so I must make it survive in today's market.",
    awards: "Startup India Craft Entrepreneur Recognition (2023)",
    workshopAddress: "Parvati's Studio, Boranada, Jodhpur — 342012",
    instagram: "@parvati_bandh",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  MEENAKARI — Rajasthan (Jaipur)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Suresh Soni",
      profileName: "Suresh Soni",
      age: "55",
      gender: "Male",
      city: "Jaipur",
      village: "",
      pincode: "302002",
      address: "Gopalji Ka Rasta, Johari Bazaar, Jaipur",
      phone: "9414031001",
      email: "suresh.meenakari@karigarh.in",
    },
    craft: {
      craftForm: "Meenakari",
      craftCustom: "",
      experience: "30–35 years",
      region: "Rajasthan",
      priceRange: "₹3,000 – ₹20,000",
    },
    description:
      "Meenakari is the art of enamelling metal — fusing coloured glass powders onto gold or silver using extreme heat. The Soni family has practised it in Jaipur's Johari Bazaar for 150 years. I work exclusively on 22-carat gold, the traditional Mughal technique brought to Jaipur by Raja Man Singh's artisans. Each piece passes through at least eight specialists — engraver, enamel-layer, kiln-firer, polisher — before it is complete. I orchestrate all these hands in my workshop, ensuring that centuries-old quality standards are maintained.",
    materials: [
      "22-carat gold",
      "Glass enamel powders",
      "Copper base",
      "Silver",
    ],
    specialties: [
      "Gold Meenakari jewellery",
      "Peacock motif pieces",
      "Enamel on silver",
    ],
    techniques: [
      "Champlevé enamelling",
      "Gold engraving",
      "Kiln firing at 850°C",
    ],
    inspiration:
      "Gold has memory. It remembers the hands of every craftsman who worked it. I try to be worthy of that lineage.",
    awards: "National Award for Meenakari (2009), UNESCO Crafts Mark holder",
    workshopAddress: "Soni Meenakari Kendra, Gopalji Ka Rasta, Jaipur — 302002",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Geeta Rani Soni",
      profileName: "Geeta Rani Soni",
      age: "48",
      gender: "Female",
      city: "Jaipur",
      village: "",
      pincode: "302002",
      address: "Gopalji Ka Rasta, Johari Bazaar, Jaipur",
      phone: "9414032002",
      email: "geeta.meenakari@karigarh.in",
    },
    craft: {
      craftForm: "Meenakari",
      craftCustom: "",
      experience: "25–30 years",
      region: "Rajasthan",
      priceRange: "₹2,000 – ₹12,000",
    },
    description:
      "I am Suresh Soni's wife and I specialise in the enamelling stage — the most technically demanding part of Meenakari. The enamel paste is applied to engraved cavities in layers, each layer fired separately in a small charcoal kiln. Too little heat and the enamel doesn't fuse; too much and it bubbles. Over 25 years my hands have developed an intuition for flame temperature that no thermometer can replicate. I have been teaching this intuition to six young women who now work as independent Meenakari artisans.",
    materials: [
      "Glass enamel in twelve colours",
      "Copper sheet",
      "Gold plating solution",
    ],
    specialties: [
      "Layered enamel application",
      "Multi-colour peacock panels",
      "Enamel on copper",
    ],
    techniques: [
      "Multi-layer firing",
      "Colour blending in kiln",
      "Copper-base Meenakari",
    ],
    inspiration:
      "Fire is my teacher. It shows me every day that nothing beautiful comes without heat.",
    awards: "Rajasthan State Women Artisan Award (2020)",
    workshopAddress: "Soni Meenakari Kendra, Jaipur — 302002",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Irfan Khan",
      profileName: "Irfan Khan",
      age: "35",
      gender: "Male",
      city: "Jaipur",
      village: "",
      pincode: "302006",
      address: "Ramganj Bazaar, Jaipur",
      phone: "9602033003",
      email: "irfan.meenakari@karigarh.in",
    },
    craft: {
      craftForm: "Meenakari",
      craftCustom: "",
      experience: "10–15 years",
      region: "Rajasthan",
      priceRange: "₹1,200 – ₹7,000",
    },
    description:
      "My family moved from a small village into Jaipur two generations ago and found work in the city's jewellery cluster. I learned Meenakari as an apprentice at 20 and spent five years mastering the art under a National Award-winning master. I now focus on silver-base Meenakari — more accessible price-point than gold but no less intricate. My pieces are sold through craft fairs and I have recently started exporting small batches to boutiques in the UK and Japan where there is growing demand for authentic Indian enamel work.",
    materials: ["Sterling silver", "Enamel powders", "Brass sheet"],
    specialties: [
      "Silver Meenakari",
      "Contemporary geometric enamel",
      "Export-quality pieces",
    ],
    techniques: [
      "Silver engraving",
      "Cloisonné technique",
      "Polishing and finishing",
    ],
    inspiration:
      "I believe Meenakari belongs in contemporary design spaces, not just antique shops.",
    awards: "Jaipur Jewellery Show Emerging Artisan Award (2022)",
    workshopAddress: "Irfan's Silver Studio, Ramganj, Jaipur — 302006",
    instagram: "@irfan_meenakari",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  BLOCK PRINTING — Rajasthan (Bagru / Sanganer)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Chhotu Lal Chippa",
      profileName: "Chhotu Lal Chippa",
      age: "60",
      gender: "Male",
      city: "Bagru",
      village: "Bagru",
      pincode: "303007",
      address: "Chippa Mohalla, Near Chhatri, Bagru",
      phone: "9414041001",
      email: "chhotu.blockprint@karigarh.in",
    },
    craft: {
      craftForm: "Block Printing",
      craftCustom: "",
      experience: "35–40 years",
      region: "Rajasthan",
      priceRange: "₹1,500 – ₹7,000",
    },
    description:
      "Bagru is famous for its earthy, dark palette — black from iron-rich mud, red from alizarin roots, the famous 'syahi-begar' combination of black and red on white. I am a Chippa — a member of the traditional block-printing caste of Rajasthan. My workshop in Bagru uses 100% natural colours fermented in clay pots, some of which have been maintained as continuous cultures for over thirty years. The blocks I use are hand-carved from sheesham wood by my cousin; we have over 400 blocks in our collection, including some made by my grandfather.",
    materials: [
      "Khadi cotton",
      "Iron-mud ferment (kali)",
      "Alizarin red",
      "Alum mordant",
      "Harda",
    ],
    specialties: [
      "Bagru dark palette printing",
      "Dabu resist printing",
      "Yardage for fashion designers",
    ],
    techniques: [
      "Natural dye fermentation",
      "Dabu mud resist",
      "Alizarin boiling",
    ],
    inspiration:
      "The colours I use come from this very soil. When you wear my cloth, you wear Bagru.",
    awards:
      "National Award for Handblock Printing (2007), GI Tag Holder — Bagru Print",
    workshopAddress: "Chippa Block Print Workshop, Bagru — 303007",
    instagram: "@bagru_chippa",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Anita Chippa",
      profileName: "Anita Chippa",
      age: "40",
      gender: "Female",
      city: "Sanganer",
      village: "Sanganer",
      pincode: "303902",
      address: "Dyers Colony, Sanganer",
      phone: "9414042002",
      email: "anita.blockprint@karigarh.in",
    },
    craft: {
      craftForm: "Block Printing",
      craftCustom: "",
      experience: "15–20 years",
      region: "Rajasthan",
      priceRange: "₹900 – ₹4,000",
    },
    description:
      "Sanganer's tradition is the lighter, colourful counterpart to Bagru's earthy tones — white backgrounds, fine floral patterns, and a rainbow of botanical dyes. I learned from my mother-in-law in the Dyers Colony of Sanganer, a neighbourhood where nearly every home has a printing table. My speciality is fine floral Sanganer printing on mul-cotton and silk, using hand-carved blocks with lines as fine as a hair. I supply fabric to independent fashion labels in Delhi, Bengaluru, and Mumbai who use it for sustainable clothing.",
    materials: ["Mul-mul cotton", "Silk", "Botanical dyes", "Alum mordant"],
    specialties: [
      "Fine floral Sanganer print",
      "Saree yardage",
      "Fashion fabric supply",
    ],
    techniques: [
      "Fine-line block registration",
      "Multi-colour overprinting",
      "Steam fixing",
    ],
    inspiration:
      "Each flower on this cloth was placed by hand. That's a thousand small decisions per metre.",
    awards: "Rajasthan Textile Award (2019)",
    workshopAddress: "Anita's Print Studio, Dyers Colony, Sanganer — 303902",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Vikram Chippa",
      profileName: "Vikram Chippa",
      age: "28",
      gender: "Male",
      city: "Bagru",
      village: "",
      pincode: "303007",
      address: "New Colony, Bagru",
      phone: "9602043003",
      email: "vikram.blockprint@karigarh.in",
    },
    craft: {
      craftForm: "Block Printing",
      craftCustom: "",
      experience: "5–10 years",
      region: "Rajasthan",
      priceRange: "₹700 – ₹2,500",
    },
    description:
      "Growing up in Bagru I was surrounded by printing tables and dye vats — it was impossible not to learn. But I have taken the tradition in an unexpected direction: I design and print on linen, canvas, and paper in addition to fabric, and I have started a small brand of block-printed stationery, wrapping paper, and homeware that sells online. I still use Chhotu Lal's natural dye recipes but I pair them with contemporary pattern compositions — abstract interpretations of Bagru motifs for a global market.",
    materials: ["Linen", "Canvas", "Acid-free paper", "Natural dyes"],
    specialties: [
      "Block-printed stationery",
      "Canvas bags",
      "Homeware",
      "Modern pattern design",
    ],
    techniques: [
      "Paper and fabric transfer",
      "Contemporary repeat composition",
    ],
    inspiration:
      "A block carved in 1940 can print a 2024 pattern. That's the magic of this craft.",
    awards: "Startup India x Craftmark Young Entrepreneur (2023)",
    workshopAddress: "Vikram's Print Lab, New Colony, Bagru — 303007",
    instagram: "@vikram_bagru_print",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Hema Bai",
      profileName: "Hema Bai",
      age: "52",
      gender: "Female",
      city: "Sanganer",
      village: "",
      pincode: "303902",
      address: "Balaji Colony, Sanganer, Jaipur",
      phone: "9414044004",
      email: "hema.blockprint@karigarh.in",
    },
    craft: {
      craftForm: "Block Printing",
      craftCustom: "",
      experience: "25–30 years",
      region: "Rajasthan",
      priceRange: "₹1,200 – ₹5,000",
    },
    description:
      "I started printing at age 22 alongside my husband, but after he passed away I took over the entire workshop — managing production, quality, dye preparation, and customer relations. That forced transformation made me stronger and sharper as an artisan. I now specialise in Sanganer's traditional 'khari' printing — using gold and silver metallic inks on dark fabrics, a festive style traditionally used in wedding trousseaux. I supply fabric to wedding couture designers who are increasingly sourcing authentic handblock prints for luxury bridal wear.",
    materials: ["Silk", "Heavy cotton", "Metallic gold ink", "Silver paste"],
    specialties: [
      "Khari metallic printing",
      "Bridal fabric",
      "Dark-base block prints",
    ],
    techniques: [
      "Gold and silver paste application",
      "Resist and metallic combo",
    ],
    inspiration:
      "After loss, the printing table was what kept me standing. This craft saved me.",
    awards: "Women Empowerment Craft Award, NIFT Jaipur (2018)",
    workshopAddress:
      "Hema's Khari Print House, Balaji Colony, Sanganer — 303902",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  GOND ART — Madhya Pradesh (Mandla / Bhopal / Balaghat)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Jangarh Ram Shyam",
      profileName: "Jangarh Ram Shyam",
      age: "45",
      gender: "Male",
      city: "Mandla",
      village: "Patangarh",
      pincode: "481661",
      address: "Patangarh Village, Mandla District, MP",
      phone: "9425101001",
      email: "jangarh.gond@karigarh.in",
    },
    craft: {
      craftForm: "Gond Art",
      craftCustom: "",
      experience: "20–25 years",
      region: "Madhya Pradesh",
      priceRange: "₹3,000 – ₹18,000",
    },
    description:
      "Gond art is the visual language of the Gond tribe — one of India's largest adivasi communities. Our paintings encode the forests, animals, and spirits that define our cosmology. I paint in the Patangarh style, using intricate patterns of dots and dashes (called 'tikki-rekha') to fill forms — tigers, peacocks, sacred trees — with visual texture that seems to vibrate with life. Each animal in a Gond painting carries symbolic meaning: the tiger is the forest deity Bada Dev, the peacock is the messenger of rain. My work has been exhibited in Delhi, Mumbai, and Paris.",
    materials: [
      "Canvas",
      "Handmade paper",
      "Acrylic",
      "Natural pigments from forest",
    ],
    specialties: [
      "Forest spirit paintings",
      "Tiger narratives",
      "Tree of life compositions",
    ],
    techniques: [
      "Tikki-rekha filling",
      "Gond dot pattern",
      "Flat outline with pattern fill",
    ],
    inspiration:
      "Every tree has a face. Every river has a song. I just make them visible on paper.",
    awards:
      "MP State Award for Tribal Art (2014), National Tribal Festival Best Artist",
    workshopAddress: "Jangarh Gond Studio, Patangarh, Mandla — 481661",
    instagram: "@jangarh_gond_art",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Subhashini Vyam",
      profileName: "Subhashini Vyam",
      age: "38",
      gender: "Female",
      city: "Bhopal",
      village: "",
      pincode: "462001",
      address: "Adivasi Lok Kala Parishad Colony, Bhopal",
      phone: "9425102002",
      email: "subhashini.gond@karigarh.in",
    },
    craft: {
      craftForm: "Gond Art",
      craftCustom: "",
      experience: "15–20 years",
      region: "Madhya Pradesh",
      priceRange: "₹2,000 – ₹10,000",
    },
    description:
      "I moved from Mandla to Bhopal as a young woman and found a community of Gond artists at the Adivasi Lok Kala Parishad. The city opened my art to new formats — large-format digital prints, mural commissions, and illustrated books. But the soul of my work remains village life: I paint women grinding grain, children climbing mango trees, elders sitting under the peepal. I want to document the Gond way of life as it was — before forest displacement changed it forever. My illustrated book on Gond creation myths has been published in four languages.",
    materials: ["Archival paper", "Canvas", "Watercolour", "Fine-liner pen"],
    specialties: [
      "Gond narrative illustration",
      "Women and daily life scenes",
      "Book illustration",
    ],
    techniques: [
      "Fine-line Gond style",
      "Watercolour wash with line",
      "Sequential storytelling",
    ],
    inspiration:
      "My paintings are letters to my village. A village I can never fully return to.",
    awards: "Illustrated Book Award, National Book Trust India (2021)",
    workshopAddress: "Subhashini's Bhopal Studio, Lok Kala Parishad — 462001",
    instagram: "@subhashini_gond",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Raju Gond",
      profileName: "Raju Gond",
      age: "60",
      gender: "Male",
      city: "Balaghat",
      village: "Kirnapur",
      pincode: "481331",
      address: "Kirnapur Village, Balaghat District, MP",
      phone: "9425103003",
      email: "raju.gond@karigarh.in",
    },
    craft: {
      craftForm: "Gond Art",
      craftCustom: "",
      experience: "35–40 years",
      region: "Madhya Pradesh",
      priceRange: "₹4,000 – ₹20,000",
    },
    description:
      "I have painted Gond art since childhood — first on the mud walls of our home, then on paper and canvas as the art world noticed our tradition. Unlike many who have urbanised their style, I have deliberately stayed in my village and paint only in traditional natural colours: charcoal black, chalk white, soil red, leaf green, turmeric yellow. My large-format works are dense narratives of the forest ecosystem — hundreds of animals, plants, insects, and spirits co-existing in a single frame. They are maps of a world that city people have forgotten.",
    materials: [
      "Handmade paper",
      "Natural charcoal",
      "Clay pigments",
      "Turmeric",
      "Cow dung ink",
    ],
    specialties: [
      "All-natural colour Gond art",
      "Forest ecosystem paintings",
      "Large-format works",
    ],
    techniques: [
      "Traditional earth colour preparation",
      "Dense composition narrative painting",
    ],
    inspiration:
      "The forest is my library. I have been reading it for 60 years and it never repeats a page.",
    awards: "Tribal Heritage Award, Government of MP (2011, 2016)",
    workshopAddress: "Raju's Kirnapur Workshop, Balaghat — 481331",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Anjori Bai",
      profileName: "Anjori Bai",
      age: "52",
      gender: "Female",
      city: "Dindori",
      village: "Umaria",
      pincode: "481880",
      address: "Umaria Village, Dindori District, MP",
      phone: "9425104004",
      email: "anjoribai.gond@karigarh.in",
    },
    craft: {
      craftForm: "Gond Art",
      craftCustom: "",
      experience: "25–30 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,500 – ₹7,000",
    },
    description:
      "I paint the fertility and harvest cycle of the Gond calendar — the sowing festivals, the rain dances, the grain goddess Kutki Mata, the serpent who guards the seed. My work is rooted in the ritual year of our village. For 25 years I have maintained a visual diary of our ceremonies in the form of paintings, creating an accidental archive of vanishing rites. NGOs working on tribal heritage documentation have used my paintings as primary sources for cultural records. I also teach 12 young women in the village, ensuring the tradition outlives me.",
    materials: ["Handmade cloth", "Natural colours", "Terracotta pigment"],
    specialties: [
      "Ritual and festival painting",
      "Agricultural cycle art",
      "Teaching and documentation",
    ],
    techniques: ["Fertility motif composition", "Traditional Gond dot-fill"],
    inspiration:
      "If I do not paint the harvest dance, who will remember how we once celebrated the rain?",
    awards: "Adivasi Mahila Ratna Award, Dindori (2019)",
    workshopAddress: "Anjori's Umaria Home Studio, Dindori — 481880",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  BAGH PRINT — Madhya Pradesh (Dhar / Bagh village)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Mohammed Yusuf Khatri",
      profileName: "Mohammed Yusuf Khatri",
      age: "58",
      gender: "Male",
      city: "Bagh",
      village: "Bagh",
      pincode: "454771",
      address: "Khatri Para, Bagh, Dhar District, MP",
      phone: "9425201001",
      email: "yusuf.baghprint@karigarh.in",
    },
    craft: {
      craftForm: "Bagh Print",
      craftCustom: "",
      experience: "30–35 years",
      region: "Madhya Pradesh",
      priceRange: "₹2,000 – ₹9,000",
    },
    description:
      "Bagh Print is named after this very village — Bagh, on the Baghini river in Dhar district. The river's water has a unique mineral composition that gives our prints their characteristic lustre. I am the seventh generation of Khatris practising Bagh printing. Our process is labour-intensive: cotton is boiled in camel dung and castor oil before printing, then printed with hand-carved teak blocks, then dipped repeatedly in alizarin dye boiled with dried flowers and iron-rich mud. The result is a rich, colour-fast red and black that does not fade for decades.",
    materials: [
      "Pure cotton",
      "Alizarin",
      "Iron mud",
      "Camel dung (pre-treatment)",
      "Teak wood blocks",
    ],
    specialties: ["Traditional Bagh sarees", "Yardage", "Dupatta", "Bed linen"],
    techniques: [
      "Animal dung pre-treatment",
      "Multi-step natural dye process",
      "Alizarin boiling",
    ],
    inspiration:
      "The Baghini river has been my partner for 30 years. I print; she colours.",
    awards:
      "National Award for Bagh Print (2001), GI Tag — Bagh Print, Padma Shri (2022)",
    workshopAddress: "Mohammed Yusuf Khatri Workshop, Bagh, Dhar — 454771",
    instagram: "@yusuf_baghprint",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Zubeda Khatri",
      profileName: "Zubeda Khatri",
      age: "44",
      gender: "Female",
      city: "Bagh",
      village: "Bagh",
      pincode: "454771",
      address: "Khatri Para, Bagh, Dhar District, MP",
      phone: "9425202002",
      email: "zubeda.baghprint@karigarh.in",
    },
    craft: {
      craftForm: "Bagh Print",
      craftCustom: "",
      experience: "20–25 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,500 – ₹6,000",
    },
    description:
      "I am Yusuf Khatri's daughter-in-law and I have been printing in the family workshop for 20 years. My speciality is developing new block designs that stay faithful to Bagh's geometrical vocabulary — the iconic fish-scale (cheent), the interlocking diamond (jali), and the border medallion — while creating compositions for contemporary home textile applications. I have designed a range of Bagh-print table runners, napkins, and cushion covers that have introduced the craft to households that had never heard of this village.",
    materials: ["Cotton", "Alizarin", "Natural indigo for blue variation"],
    specialties: [
      "Home textile design",
      "New block pattern development",
      "Export-quality fabric",
    ],
    techniques: [
      "Block pattern innovation within traditional grammar",
      "Indigo cold vat",
    ],
    inspiration:
      "The fish-scale and diamond are 500 years old. They can also live on a modern dining table.",
    awards: "Craft Design Award, India International Trade Fair (2021)",
    workshopAddress: "Khatri Bagh Print Workshop, Bagh — 454771",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Ibrahim Khatri",
      profileName: "Ibrahim Khatri",
      age: "35",
      gender: "Male",
      city: "Indore",
      village: "",
      pincode: "452001",
      address: "Rajwada Area, Indore, MP",
      phone: "9425203003",
      email: "ibrahim.baghprint@karigarh.in",
    },
    craft: {
      craftForm: "Bagh Print",
      craftCustom: "",
      experience: "10–15 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,000 – ₹4,500",
    },
    description:
      "I was born in Bagh but moved to Indore for education. After my MBA I returned to the craft, applying marketing knowledge to make Bagh Print visible nationally. I source unstitched fabric printed in Bagh and collaborate with young fashion designers in Indore and Bhopal to create ready-to-wear garments. This has created new income streams for Bagh village artisans while making the product accessible to urban buyers who want ethical fashion. I also manage an Instagram shop that ships Bagh fabric across India.",
    materials: ["Bagh-printed cotton yardage", "Silk blend"],
    specialties: [
      "Fashion collaboration",
      "Ready-to-wear Bagh Print garments",
      "Urban retail",
    ],
    techniques: [
      "Traditional printing",
      "Fashion integration",
      "Online retail",
    ],
    inspiration:
      "Bagh should be as well-known in Delhi's boutiques as it is in craft fair tents.",
    awards: "Young Entrepreneur in Crafts, CII Young Indians (2022)",
    workshopAddress: "Ibrahim's Studio, Rajwada Area, Indore — 452001",
    instagram: "@ibrahim_baghprint",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Salma Bano",
      profileName: "Salma Bano",
      age: "30",
      gender: "Female",
      city: "Bagh",
      village: "Bagh",
      pincode: "454771",
      address: "Near Bagh Caves Road, Bagh Village, MP",
      phone: "9425204004",
      email: "salma.baghprint@karigarh.in",
    },
    craft: {
      craftForm: "Bagh Print",
      craftCustom: "",
      experience: "5–10 years",
      region: "Madhya Pradesh",
      priceRange: "₹800 – ₹3,000",
    },
    description:
      "I grew up watching my uncles print fabric on the river banks at dawn. When I married into a Khatri family, I insisted on learning the full process — not just helping but printing independently. I now handle the block-printing table in my home as well as the dye preparation with my husband. My proudest achievement is a series of indigo-and-white Bagh Print pieces — a departure from the traditional red-black — using a cold vat indigo technique I learned from a dyer in Kutch. It brought a new colour range to this centuries-old craft.",
    materials: ["Cotton", "Cold vat indigo", "Iron mordant"],
    specialties: [
      "Indigo Bagh Print",
      "White-base printing",
      "Small batch production",
    ],
    techniques: ["Cold vat indigo dyeing", "Traditional block printing"],
    inspiration: "My uncles gave me red and black. I found the blue myself.",
    awards: "Tribal Women Artisan Fund Grant, MP Government (2023)",
    workshopAddress: "Salma's Home Workshop, Bagh, Dhar — 454771",
    portfolio: [],
    status: "approved",
  },

  // ══════════════════════════════════════════════════════════════════
  //  CHANDERI WEAVING — Madhya Pradesh (Chanderi / Ashoknagar)
  // ══════════════════════════════════════════════════════════════════
  {
    personal: {
      name: "Anwar Khan",
      profileName: "Anwar Khan",
      age: "55",
      gender: "Male",
      city: "Chanderi",
      village: "Chanderi",
      pincode: "473446",
      address: "Kothi Mohalla, Chanderi, Ashoknagar District",
      phone: "9425301001",
      email: "anwar.chanderi@karigarh.in",
    },
    craft: {
      craftForm: "Chanderi Weaving",
      craftCustom: "",
      experience: "30–35 years",
      region: "Madhya Pradesh",
      priceRange: "₹4,000 – ₹25,000",
    },
    description:
      "Chanderi silk is one of India's finest fabrics — gossamer-light, with a characteristic translucency that makes even a six-metre saree weigh less than 100 grams. My family has woven Chanderi on pit-looms in this ancient weaving town for six generations. I specialise in the traditional 'kadiyal' border technique — where gold or silver zari threads are interlocked with the silk weft at the border, creating a shimmering edge that requires extraordinary precision. A single kadiyal border on a full saree takes four days to weave.",
    materials: [
      "Chanderi silk",
      "Cotton warp",
      "Real gold zari",
      "Silver zari",
    ],
    specialties: [
      "Kadiyal border sarees",
      "Bridal Chanderi",
      "Sheer tissue silk",
    ],
    techniques: [
      "Pit-loom weaving",
      "Kadiyal interlocking border",
      "Gold zari work",
    ],
    inspiration:
      "When a bride wears a Chanderi saree, she is wearing six generations of my family's patience.",
    awards: "National Award for Weaving (2008), GI Tag — Chanderi Fabric",
    workshopAddress:
      "Anwar Khan Weaving House, Kothi Mohalla, Chanderi — 473446",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Meena Bai Teli",
      profileName: "Meena Bai Teli",
      age: "42",
      gender: "Female",
      city: "Chanderi",
      village: "",
      pincode: "473446",
      address: "Weavers Colony, Chanderi",
      phone: "9425302002",
      email: "meena.chanderi@karigarh.in",
    },
    craft: {
      craftForm: "Chanderi Weaving",
      craftCustom: "",
      experience: "20–25 years",
      region: "Madhya Pradesh",
      priceRange: "₹2,500 – ₹12,000",
    },
    description:
      "I come from the Teli community in Chanderi — traditionally oil-pressers — but I was drawn to the loom as a child and learned weaving from a neighbouring family. Today I run a cluster of 8 looms from my home, giving employment to women who otherwise have no livelihood. I specialise in cotton-silk blend Chanderi — slightly more durable than pure silk, more accessible in price, without sacrificing the delicacy that makes Chanderi unique. My pieces have been supplied to sari boutiques in Mumbai and Chennai.",
    materials: ["Chanderi cotton-silk", "Mercerised cotton", "Silver zari"],
    specialties: [
      "Cotton-silk blend Chanderi",
      "Daily-wear sarees",
      "Dupattas",
    ],
    techniques: ["Fly-shuttle loom", "Dobby patterning", "Weft float motifs"],
    inspiration:
      "I didn't inherit this craft — I chose it. That choice drives everything I do.",
    awards: "MP State Women Weaver Award (2020)",
    workshopAddress: "Meena's Loom Cluster, Weavers Colony, Chanderi — 473446",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Ramakant Patel",
      profileName: "Ramakant Patel",
      age: "33",
      gender: "Male",
      city: "Ashoknagar",
      village: "",
      pincode: "473331",
      address: "Gandhi Nagar, Ashoknagar, MP",
      phone: "9425303003",
      email: "ramakant.chanderi@karigarh.in",
    },
    craft: {
      craftForm: "Chanderi Weaving",
      craftCustom: "",
      experience: "10–15 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,500 – ₹6,000",
    },
    description:
      "I trained as a textile engineer before returning to Ashoknagar to work in the Chanderi cluster. My unique position — formal training plus traditional craft — allows me to bridge the artisan and industry divide. I have helped 15 weavers in the cluster adopt ergonomically improved pit-loom designs that reduce back and knee strain without changing the weaving motion. I also develop new dobby patterns using graph-paper design, translating contemporary geometric aesthetics into the Chanderi loom language.",
    materials: ["Chanderi silk", "Cotton", "Polyester-free synthetic zari"],
    specialties: [
      "Contemporary geometric Chanderi",
      "Loom improvement consulting",
      "Men's fabric",
    ],
    techniques: [
      "Dobby pattern design",
      "Frame loom conversion",
      "Engineering-assisted design",
    ],
    inspiration:
      "If a weaver's back breaks at 45, the craft dies at 45. Better looms keep the craft alive longer.",
    awards: "National Institute of Design Innovation Grant (2022)",
    workshopAddress: "Ramakant's Chanderi Design Studio, Ashoknagar — 473331",
    instagram: "@ramakant_chanderi",
    portfolio: [],
    status: "approved",
  },
  {
    personal: {
      name: "Sarita Devi",
      profileName: "Sarita Devi",
      age: "63",
      gender: "Female",
      city: "Chanderi",
      village: "Chanderi",
      pincode: "473446",
      address: "Purani Tehsil Road, Chanderi, MP",
      phone: "9425304004",
      email: "sarita.chanderi@karigarh.in",
    },
    craft: {
      craftForm: "Chanderi Weaving",
      craftCustom: "",
      experience: "40+ years",
      region: "Madhya Pradesh",
      priceRange: "₹6,000 – ₹35,000",
    },
    description:
      "I began weaving at 18 on my husband's loom. He passed away when I was 32, leaving me with three children and a loom. I did not stop — I wove. Forty years later I am among the most respected weavers in Chanderi, known for 'butadar' Chanderi — fabric woven with scattered 'butas' (floral buti motifs) in real gold zari. My butadar sarees have been worn by film actresses, ministers' wives, and at least one First Lady. I have trained 30 young women in Chanderi over my career, passing on both technique and resilience.",
    materials: ["Pure Chanderi silk", "24-carat gold zari", "Silver wire"],
    specialties: [
      "Butadar gold-zari sarees",
      "Heirloom-quality pieces",
      "Bridal commissions",
    ],
    techniques: [
      "Real zari interlocking",
      "Scattered butas layout",
      "Pit-loom high-count weaving",
    ],
    inspiration:
      "The loom fed my children. It also gave them their mother's dignity.",
    awards: "Shilp Guru Award (2017), National Women Weaver Award (2012)",
    workshopAddress:
      "Sarita Devi's Loom House, Purani Tehsil Road, Chanderi — 473446",
    portfolio: [],
    status: "approved",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SeedCraftsmen() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">(
    "idle",
  );
  const [log, setLog] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const handleSeed = async () => {
    setStatus("running");
    setLog([]);
    setCount(0);
    let succeeded = 0;

    for (const craftsman of CRAFTSMEN_DATA) {
      try {
        const ref = await addDoc(collection(db, "craftsmen"), {
          ...craftsman,
          userId: null,
          createdAt: serverTimestamp(),
          agreements: {
            agreeTerms: true,
            agreeAuth: true,
            agreeMarket: true,
            agreeGI: true,
            agreeDC: true,
          },
          verification: { idType: "Aadhaar Card", idProofUrl: "" },
          bankDetails: { bankName: "", accountNo: "", ifsc: "", upi: "" },
          certificates: [],
        });
        addLog(
          `✅ ${craftsman.personal.profileName} — ${craftsman.craft.craftForm} [${ref.id}]`,
        );
        succeeded++;
        setCount(succeeded);
      } catch (err: any) {
        addLog(`❌ FAILED: ${craftsman.personal.profileName} — ${err.message}`);
      }
    }

    setStatus(succeeded === CRAFTSMEN_DATA.length ? "done" : "error");
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "monospace",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        🌿 Karigarh — Craftsmen Seeder
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        This will insert <strong>{CRAFTSMEN_DATA.length} craftsmen</strong>{" "}
        (Rajasthan + MP) into Firestore with <code>status: "approved"</code>.
        Portfolio images will be empty — add them afterwards.
      </p>

      {status === "idle" && (
        <button
          onClick={handleSeed}
          style={{
            background: "#c9a227",
            color: "white",
            border: "none",
            padding: "12px 28px",
            fontSize: 16,
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Seed All {CRAFTSMEN_DATA.length} Craftsmen
        </button>
      )}

      {status === "running" && (
        <div>
          <p style={{ color: "#c9a227" }}>
            ⏳ Inserting... {count} / {CRAFTSMEN_DATA.length}
          </p>
        </div>
      )}

      {status === "done" && (
        <div style={{ color: "green", fontWeight: "bold", marginBottom: 16 }}>
          🎉 All {CRAFTSMEN_DATA.length} craftsmen inserted successfully!
          <br />
          Now add images via Firestore Console or the AdminImageUploader page.
        </div>
      )}

      {status === "error" && (
        <div style={{ color: "red", marginBottom: 16 }}>
          ⚠️ Some entries failed. Check the log below.
        </div>
      )}

      {log.length > 0 && (
        <div
          style={{
            marginTop: 20,
            background: "#f5f5f5",
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 4,
            maxHeight: 400,
            overflowY: "auto",
            fontSize: 13,
          }}
        >
          {log.map((line, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

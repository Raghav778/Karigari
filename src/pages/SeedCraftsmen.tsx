import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const CRAFTSMEN_DATA = [
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
  // ─────────────────────────────────────────────────────────────────────────────
// FILE: src/pages/SeedCraftsmen.tsx
// WHERE: Append ALL of the below entries inside the CRAFTSMEN_DATA array,
//        just before the closing `];`
//
// IMPORTANT: Each entry has a `staticId` field matching the ID in craftsmen.ts
//            This is used by Discover.tsx to prevent duplicates.
// ─────────────────────────────────────────────────────────────────────────────

  // ── id: "1" — Mohan Lal Kumhar — Blue Pottery ──────────────────────────
  {
    staticId: "1",
    personal: {
      name: "Mohan Lal Kumhar",
      profileName: "Mohan Lal Kumhar",
      age: "68",
      gender: "Male",
      city: "Jaipur",
      village: "",
      pincode: "302001",
      address: "Kumharon Ka Mohalla, Amer Road, Jaipur",
      phone: "9414000101",
      email: "mohanlal.bluepottery@karigarh.in",
    },
    craft: {
      craftForm: "Blue Pottery",
      craftCustom: "",
      experience: "40+ years",
      region: "Rajasthan",
      priceRange: "₹2,500 – ₹8,000",
    },
    description:
      "Born into a family of potters in the narrow lanes of Jaipur's old city, I learned the art of Blue Pottery from my grandfather. Our craft traces its roots to Persian artisans who travelled the Silk Road; we use quartz, glass, and fuller's earth — not clay — which gives each piece its distinctive translucent quality. My pieces are displayed in galleries across Europe and Asia. I am one of the last masters who still uses the traditional quartz-based technique passed down through seven generations. Over 42 years of practice I have trained more than 50 apprentices and worked hard to ensure this endangered craft does not vanish with my generation.",
    materials: ["Quartz Stone", "Raw Glaze", "Cobalt Oxide", "Multani Mitti", "Fuller's Earth"],
    specialties: ["Persian Motifs", "Floral Patterns", "Geometric Art", "Decorative Tiles"],
    techniques: ["Quartz-base moulding", "Freehand cobalt painting", "Low-temperature kiln firing"],
    inspiration: "My grandfather said — the clay here is not clay; it is compressed centuries. Handle it with patience.",
    awards: "National Award for Master Craftsperson (2009), Rajasthan Gaurav Puraskar (2015)",
    workshopAddress: "Kumhar Blue Pottery Studio, Amer Road, Jaipur — 302001",
    portfolio: [],
    status: "approved",
  },

  // ── id: "2" — Shanti Devi Joshi — Phad Painting ────────────────────────
  {
    staticId: "2",
    personal: {
      name: "Shanti Devi Joshi",
      profileName: "Shanti Devi Joshi",
      age: "62",
      gender: "Female",
      city: "Bhilwara",
      village: "Shahpura",
      pincode: "311404",
      address: "Joshi Para, Near Pabuji Mandir, Bhilwara",
      phone: "9414000202",
      email: "shantidevi.phad@karigarh.in",
    },
    craft: {
      craftForm: "Phad Painting",
      craftCustom: "",
      experience: "35–40 years",
      region: "Rajasthan",
      priceRange: "₹3,000 – ₹18,000",
    },
    description:
      "I broke the tradition of Phad painting being a male-only art form. For seven generations this sacred scroll tradition belonged to the men of the Joshi clan — I was the first woman to pick up the brush. My scrolls depict the stories of Pabuji and Devnarayanji and have been exhibited at the National Gallery of Modern Art. I use only natural dyes extracted from flowers, minerals, and bark. No synthetic colour has ever touched my cloth. My work has opened the tradition to women, and today I mentor four young women Phad painters in Bhilwara.",
    materials: ["Handloom Cloth", "Natural Dyes", "Bamboo Brushes", "Gum Arabic", "Mineral Pigments"],
    specialties: ["Narrative Scrolls", "Deity Panels", "Folk Epics", "Pabuji Phad", "Devnarayanji Phad"],
    techniques: ["Outline-first method", "Natural dye flat-fill", "Sequential panel narration"],
    inspiration: "My father said only men can hold this story. I proved that the story chooses its own keeper.",
    awards: "National Women Craft Award (2014), Rajasthan Gaurav Puraskar (2019)",
    workshopAddress: "Shanti Devi's Phad Studio, Joshi Para, Bhilwara — 311001",
    portfolio: [],
    status: "approved",
  },

  // ── id: "3" — Fatima Begum — Bandhani ──────────────────────────────────
  {
    staticId: "3",
    personal: {
      name: "Fatima Begum",
      profileName: "Fatima Begum",
      age: "55",
      gender: "Female",
      city: "Jodhpur",
      village: "",
      pincode: "342001",
      address: "Khatri Mohalla, Near Clocktower, Jodhpur",
      phone: "9414000303",
      email: "fatima.bandhani@karigarh.in",
    },
    craft: {
      craftForm: "Bandhani",
      craftCustom: "",
      experience: "25–30 years",
      region: "Rajasthan",
      priceRange: "₹1,000 – ₹5,000",
    },
    description:
      "With fingers that move faster than the eye can follow, I create thousands of tiny knots on fabric to produce the intricate patterns of Bandhani. My work has adorned brides across Rajasthan for nearly three decades. Each piece of Bandhani fabric begins as a plain cloth marked with patterns in chalk; I then tie each dot individually using my fingernail, sometimes making 10,000 knots in a single odhni before it enters the dye bath. The knots resist the colour, and the pattern only reveals itself when the cloth is untied — every time, a small miracle.",
    materials: ["Pure Silk", "Cotton Fabric", "Natural Dyes", "Cotton Thread"],
    specialties: ["Bridal Odhni", "Leheriya", "Mothda Pattern"],
    techniques: ["Fingernail tying", "Multi-dip resist dyeing", "Pattern mapping"],
    inspiration: "Every knot is a promise. When the cloth opens, you see if the promise was kept.",
    awards: "Rajasthan State Minority Artisan Award (2017)",
    workshopAddress: "Fatima's Bandhani Ghar, Khatri Mohalla, Jodhpur — 342001",
    portfolio: [],
    status: "approved",
  },

  // ── id: "4" — Jangarh Singh Shyam — Gond Art ───────────────────────────
  {
    staticId: "4",
    personal: {
      name: "Jangarh Singh Shyam",
      profileName: "Jangarh Singh Shyam",
      age: "58",
      gender: "Male",
      city: "Dindori",
      village: "Patangarh",
      pincode: "481661",
      address: "Patangarh Village, Dindori District, MP",
      phone: "9425000404",
      email: "jangarh.gond@karigarh.in",
    },
    craft: {
      craftForm: "Gond Art",
      craftCustom: "",
      experience: "30–35 years",
      region: "Madhya Pradesh",
      priceRange: "₹2,000 – ₹15,000",
    },
    description:
      "I am a torchbearer of the Pardhan Gond tradition. My intricate dot-and-line patterns transform ordinary surfaces into mythological landscapes that span the entire cosmos of the Gond people — animals, trees, deities, and the spirits that animate the forest. My work bridges the ancient tribal worldview with contemporary art sensibilities and has been exhibited internationally. I believe Gond art is not decoration — it is a map of the universe as our ancestors understood it.",
    materials: ["Handmade Paper", "Natural Pigments", "Nib Pens", "Acrylic Colors"],
    specialties: ["Tree of Life", "Animal Spirits", "Creation Myths"],
    techniques: ["Dense dot-fill composition", "Line narrative painting", "Colour layering"],
    inspiration: "The forest does not divide itself into sections. My paintings try to show that wholeness.",
    awards: "Tribal Art National Award (2012), MP Adivasi Kala Samman (2018)",
    workshopAddress: "Jangarh's Gond Studio, Patangarh, Dindori — 481661",
    portfolio: [],
    status: "approved",
  },

  // ── id: "5" — Rekha Verma — Chanderi Weaving ───────────────────────────
  {
    staticId: "5",
    personal: {
      name: "Rekha Verma",
      profileName: "Rekha Verma",
      age: "52",
      gender: "Female",
      city: "Chanderi",
      village: "Chanderi",
      pincode: "473446",
      address: "Weavers Colony, Chanderi, MP",
      phone: "9425000505",
      email: "rekha.chanderi@karigarh.in",
    },
    craft: {
      craftForm: "Chanderi Weaving",
      craftCustom: "",
      experience: "25–30 years",
      region: "Madhya Pradesh",
      priceRange: "₹4,000 – ₹20,000",
    },
    description:
      "My handloom produces the legendary Chanderi fabric — so fine it can pass through a ring. Working on my grandmother's 200-year-old pit-loom, I weave gold zari into translucent silk, creating textiles that have clothed royalty for centuries. Each saree takes between one and three weeks depending on the density of the zari work. I source my silk from Bangalore and my zari from Surat, but the weaving itself is entirely done by hand in the traditional style. Chanderi weaving is meditation — the shuttle moves to a rhythm that becomes your heartbeat.",
    materials: ["Mulberry Silk", "Gold Zari", "Cotton Yarn", "Wooden Loom"],
    specialties: ["Zari Brocade", "Butis Pattern", "Tissue Weave"],
    techniques: ["Pit-loom weaving", "Zari interlocking", "Transparent silk threading"],
    inspiration: "My grandmother's loom still hums. I hear her every time I sit at it.",
    awards: "National Handloom Award (2016), MP Women Weaver Samman (2019)",
    workshopAddress: "Rekha's Loom House, Weavers Colony, Chanderi — 473446",
    portfolio: [],
    status: "approved",
  },

  // ── id: "6" — Abdul Rashid Khan — Bagh Print ───────────────────────────
  {
    staticId: "6",
    personal: {
      name: "Abdul Rashid Khan",
      profileName: "Abdul Rashid Khan",
      age: "65",
      gender: "Male",
      city: "Dhar",
      village: "Bagh",
      pincode: "454446",
      address: "Khan Mohalla, Bagh Village, Dhar District, MP",
      phone: "9425000606",
      email: "abdulrashid.baghprint@karigarh.in",
    },
    craft: {
      craftForm: "Bagh Print",
      craftCustom: "",
      experience: "35–40 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,200 – ₹6,000",
    },
    description:
      "My family has practiced the art of Bagh printing for over 400 years. Using hand-carved teak blocks and natural dyes sourced from the river Bagh, I create textiles that carry the geometric precision of Mughal gardens. The 16-step natural dyeing process — washing, mordanting, printing, and washing again — produces the distinctive red and black that defines Bagh work. This is a GI-tagged craft and I am one of its last remaining master printers. The river water itself changes the colour slightly with each season — each batch of fabric is unique because of this.",
    materials: ["Teak Wood Blocks", "Alizarin", "Iron Rust", "River Water", "Alum"],
    specialties: ["Geometric Motifs", "Floral Blocks", "Panel Prints"],
    techniques: ["Natural resist printing", "Teak block carving", "16-step dye process"],
    inspiration: "The river gives us the colour. We just give it direction.",
    awards: "National Award for Bagh Print (2008), GI Tag Champion Artisan Certificate (2015)",
    workshopAddress: "Khan Bagh Print Workshop, Bagh Village, Dhar — 454446",
    portfolio: [],
    status: "approved",
  },

  // ── id: "7" — Ghanshyam Das Sharma — Pichwai Painting ─────────────────
  {
    staticId: "7",
    personal: {
      name: "Ghanshyam Das Sharma",
      profileName: "Ghanshyam Das Sharma",
      age: "60",
      gender: "Male",
      city: "Nathdwara",
      village: "Nathdwara",
      pincode: "313301",
      address: "Sharma Haveli, Near Shrinathji Temple, Nathdwara",
      phone: "9414000707",
      email: "ghanshyam.pichwai@karigarh.in",
    },
    craft: {
      craftForm: "Pichwai Painting",
      craftCustom: "",
      experience: "30–35 years",
      region: "Rajasthan",
      priceRange: "₹5,000 – ₹30,000",
    },
    description:
      "I have spent my life painting devotional Pichwai cloths for the Shrinathji temple. Each of my large-format paintings depicting Krishna in seasonal settings takes up to three months and uses pigments ground from precious stones — lapis lazuli for the deep blue, gold leaf for the divine glow, and ground malachite for sacred green. Pichwai is not art in the ordinary sense — it is a form of worship. Each painting is a darshan, a visual encounter with the divine. The painting is placed behind the deity; when the devotee looks at Shrinathji, my Pichwai becomes the world the deity inhabits.",
    materials: ["Handwoven Cloth", "Stone Pigments", "Gold Leaf", "Squirrel Hair Brushes", "Lapis Lazuli"],
    specialties: ["Krishna Leela", "Seasonal Themes", "Temple Backdrops"],
    techniques: ["Stone pigment grinding", "Gold leaf gilding", "Large-format cloth painting"],
    inspiration: "I do not paint Krishna. I make a space for him to appear.",
    awards: "Rajasthan Kala Ratna (2011), Nathdwara Temple Trust Lifetime Award (2020)",
    workshopAddress: "Sharma Pichwai Studio, Near Shrinathji Temple, Nathdwara — 313301",
    portfolio: [],
    status: "approved",
  },

  // ── id: "8" — Sunita Meena — Thikri Art ────────────────────────────────
  {
    staticId: "8",
    personal: {
      name: "Sunita Meena",
      profileName: "Sunita Meena",
      age: "45",
      gender: "Female",
      city: "Jaipur",
      village: "",
      pincode: "302004",
      address: "Amber Road, Near Hawa Mahal, Jaipur",
      phone: "9414000808",
      email: "sunita.thikri@karigarh.in",
    },
    craft: {
      craftForm: "Thikri Art",
      craftCustom: "",
      experience: "15–20 years",
      region: "Rajasthan",
      priceRange: "₹1,000 – ₹8,000",
    },
    description:
      "I learned Thikri mosaic from the artisans who decorated Jaipur's royal havelis. I piece together broken mirror shards and coloured glass into intricate geometric mandalas, breathing new life into a craft that once adorned palace walls. Thikri uses no paint — every gleam and sparkle comes from reflected light captured in the glass itself. The name comes from 'thikri', the Rajasthani word for a broken piece of glass or pottery — we take what is discarded and make something that catches the eye of kings. My pieces have been used in hotel lobbies, private havelis, and international exhibitions.",
    materials: ["Mirror Shards", "Coloured Glass", "Lime Plaster", "Natural Pigments", "Adhesive"],
    specialties: ["Geometric Mandalas", "Floral Mosaics", "Wall Panels"],
    techniques: ["Mirror shard cutting", "Lime plaster embedding", "Light-reflection composition"],
    inspiration: "The most broken pieces make the most beautiful light.",
    awards: "Rajasthan Women Artisan Award (2019), Jaipur Heritage Craft Certificate (2022)",
    workshopAddress: "Sunita's Thikri Studio, Amber Road, Jaipur — 302004",
    portfolio: [],
    status: "approved",
  },

  // ── id: "9" — Ramzan Khan — Meenakari ──────────────────────────────────
  {
    staticId: "9",
    personal: {
      name: "Ramzan Khan",
      profileName: "Ramzan Khan",
      age: "67",
      gender: "Male",
      city: "Jaipur",
      village: "",
      pincode: "302002",
      address: "Ramganj Bazaar, Jaipur",
      phone: "9414000909",
      email: "ramzan.meenakari@karigarh.in",
    },
    craft: {
      craftForm: "Meenakari",
      craftCustom: "",
      experience: "40+ years",
      region: "Rajasthan",
      priceRange: "₹3,000 – ₹20,000",
    },
    description:
      "I am a sixth-generation Meenakari artist whose family was brought to Jaipur by Maharaja Man Singh. Firing vivid enamel colours onto gold and silver at precise temperatures, I create jewellery that looks like captured gemstones — the enamel traps light the way a prism does. Each colour requires a different firing temperature; some pieces go into the kiln twelve times before they are complete. One mistake in temperature and the entire piece is lost. Forty years of experience has taught me to listen to the kiln the way a musician listens to an instrument. My pieces are in private collections across four continents.",
    materials: ["Gold Sheet", "Silver", "Enamel Powders", "Kiln", "Engraving Tools"],
    specialties: ["Floral Enamel", "Peacock Motifs", "Reverse Meenakari"],
    techniques: ["Multi-temperature kiln firing", "Gold engraving", "Colour layering"],
    inspiration: "Fire is the final craftsman. I only prepare the work; the kiln finishes it.",
    awards: "Padma Shri (2006), National Master Craftsperson Award (1998)",
    workshopAddress: "Khan Meenakari Kendra, Ramganj Bazaar, Jaipur — 302002",
    portfolio: [],
    status: "approved",
  },

  // ── id: "10" — Sanjay Soni — Thewa Art ─────────────────────────────────
  {
    staticId: "10",
    personal: {
      name: "Sanjay Soni",
      profileName: "Sanjay Soni",
      age: "48",
      gender: "Male",
      city: "Pratapgarh",
      village: "Pratapgarh",
      pincode: "312605",
      address: "Soni Mohalla, Pratapgarh, Rajasthan",
      phone: "9414001010",
      email: "sanjay.thewa@karigarh.in",
    },
    craft: {
      craftForm: "Thewa Art",
      craftCustom: "",
      experience: "20–25 years",
      region: "Rajasthan",
      priceRange: "₹5,000 – ₹50,000",
    },
    description:
      "I belong to the Soni family, one of only a handful of families in the world who practice Thewa. I fuse 23-carat gold sheets onto molten coloured glass, etching royal court scenes so fine they require a magnifying glass to fully appreciate. Thewa is exclusive to Pratapgarh — no other place in the world produces it. The technique involves hammering gold into sheets thinner than paper, etching narrative scenes with a needle, and then fusing the gold permanently into the glass at high temperature. Every piece takes between two weeks and two months. There are fewer than 20 practising Thewa artists left in the world.",
    materials: ["23-Carat Gold Foil", "Coloured Glass", "Etching Tools", "Kiln", "Needle Tools"],
    specialties: ["Royal Court Scenes", "Mythological Panels", "Miniature Portraits"],
    techniques: ["Gold foil hammering", "Needle etching", "Glass fusion bonding"],
    inspiration: "We are not jewellers. We are historians who write in gold.",
    awards: "National Award for Rare Craft (2013), Rajasthan Heritage Award (2018)",
    workshopAddress: "Soni Thewa Kendra, Pratapgarh — 312605",
    portfolio: [],
    status: "approved",
  },

  // ── id: "11" — Zarina Bi — Gota Patti ──────────────────────────────────
  {
    staticId: "11",
    personal: {
      name: "Zarina Bi",
      profileName: "Zarina Bi",
      age: "50",
      gender: "Female",
      city: "Jaipur",
      village: "",
      pincode: "302003",
      address: "Chandpol Bazaar, Jaipur",
      phone: "9414001111",
      email: "zarina.gotapatti@karigarh.in",
    },
    craft: {
      craftForm: "Gota Patti",
      craftCustom: "",
      experience: "20–25 years",
      region: "Rajasthan",
      priceRange: "₹2,000 – ₹15,000",
    },
    description:
      "I stitch ribbons of real gold and silver tissue onto bridal lehengas with a precision that has made me the most sought-after Gota Patti artisan in Jaipur. My work has been worn at royal weddings across Rajasthan and by film personalities. Gota Patti uses actual gold and silver thread woven into ribbon; when I stitch it onto fabric, it catches light the way no sequin or synthetic material ever can. A full bridal lehenga can take me three to four months of continuous work. I have trained 20 women in the craft and run a small collective from my home.",
    materials: ["Gold Tissue Ribbon", "Silver Gota", "Silk Fabric", "Gold Thread", "Needles"],
    specialties: ["Bridal Wear", "Peacock Motifs", "Floral Appliqué"],
    techniques: ["Ribbon folding", "Gold tissue appliqué", "Dense motif stitching"],
    inspiration: "Gold does not need to shout. It only needs to be placed correctly.",
    awards: "Rajasthan Women Artisan Samman (2016)",
    workshopAddress: "Zarina's Gota Ghar, Chandpol Bazaar, Jaipur — 302003",
    portfolio: [],
    status: "approved",
  },

  // ── id: "12" — Vijay Sharma — Miniature Painting ───────────────────────
  {
    staticId: "12",
    personal: {
      name: "Vijay Sharma",
      profileName: "Vijay Sharma",
      age: "56",
      gender: "Male",
      city: "Udaipur",
      village: "",
      pincode: "313001",
      address: "Old City, Near Jagdish Temple, Udaipur",
      phone: "9414001212",
      email: "vijay.miniature@karigarh.in",
    },
    craft: {
      craftForm: "Miniature Painting",
      craftCustom: "",
      experience: "25–30 years",
      region: "Rajasthan",
      priceRange: "₹3,000 – ₹25,000",
    },
    description:
      "I paint on surfaces no larger than a postcard using brushes made from a single squirrel hair. My miniatures depicting Mughal court life and Radha-Krishna scenes have been acquired by collectors in New York, London, and Tokyo. Miniature painting demands stillness — even the vibration from a passing truck can break a line that took 20 minutes to approach. I train my breath and paint between heartbeats. A single painting can have 300 individual figures, each with its own expression, costume, and gesture. I have spent 29 years chasing that level of detail.",
    materials: ["Ivory Sheet", "Mineral Pigments", "Squirrel Hair Brush", "Gold Dust", "Natural Gum"],
    specialties: ["Mughal Portraits", "Radha-Krishna", "Hunting Scenes"],
    techniques: ["Single-hair brush work", "Gold dust application", "Layered mineral pigment"],
    inspiration: "The smaller the canvas, the larger the world it must contain.",
    awards: "National Award for Miniature Painting (2010), Mewar Heritage Award (2017)",
    workshopAddress: "Vijay's Miniature Studio, Old City, Udaipur — 313001",
    portfolio: [],
    status: "approved",
  },

  // ── id: "13" — Hanif Khatri — Sanganeri Print ──────────────────────────
  {
    staticId: "13",
    personal: {
      name: "Hanif Khatri",
      profileName: "Hanif Khatri",
      age: "51",
      gender: "Male",
      city: "Sanganer",
      village: "Sanganer",
      pincode: "303902",
      address: "Khatri Para, Sanganer, Jaipur",
      phone: "9414001313",
      email: "hanif.sanganeri@karigarh.in",
    },
    craft: {
      craftForm: "Sanganeri Print",
      craftCustom: "",
      experience: "20–25 years",
      region: "Rajasthan",
      priceRange: "₹800 – ₹4,000",
    },
    description:
      "My family has been printing fabric in Sanganer for six generations using hand-carved wooden blocks passed down through each generation. The town of Sanganer sits on the banks of the Saraswati and has been famous for its block printing and papermaking for 500 years. My delicate floral and paisley prints on white muslin are exported to fashion houses across Europe. Each wooden block is carved by a master craftsman in Jaipur; I have a collection of over 300 antique blocks, some more than 100 years old, which produce patterns that no modern machinery can replicate.",
    materials: ["Wooden Blocks", "Natural Dyes", "White Muslin", "Resist Paste", "Alum Mordant"],
    specialties: ["Floral Motifs", "Paisley Patterns", "Discharge Printing"],
    techniques: ["Hand block alignment", "Natural dye bathing", "Resist paste printing"],
    inspiration: "My great-grandfather's hands are in every block I use. I just add mine.",
    awards: "GI Tag Sanganeri Print Certificate, RAJSICO Award (2014)",
    workshopAddress: "Khatri Block Print House, Sanganer, Jaipur — 303902",
    portfolio: [],
    status: "approved",
  },

  // ── id: "14" — Dhaniram Baiga — Dhokra ─────────────────────────────────
  {
    staticId: "14",
    personal: {
      name: "Dhaniram Baiga",
      profileName: "Dhaniram Baiga",
      age: "62",
      gender: "Male",
      city: "Bastar",
      village: "Kondagaon",
      pincode: "494226",
      address: "Baiga Basti, Kondagaon, Bastar, MP",
      phone: "9425001414",
      email: "dhaniram.dhokra@karigarh.in",
    },
    craft: {
      craftForm: "Dhokra",
      craftCustom: "",
      experience: "35–40 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,500 – ₹12,000",
    },
    description:
      "I practice the 4000-year-old lost-wax casting technique passed down through my tribe. Each of my brass figures — animals, deities, everyday village scenes — is unique because the clay mould is broken to release it. No two pieces are ever identical. The process begins with shaping a core in clay and rice husk, wrapping it in beeswax threads to carve the design, then encasing it in clay again. When the whole is fired, the wax melts away and molten brass flows into its place. It is an ancient mystery — destruction and creation in the same moment. I make objects that carry the memory of a forest civilisation.",
    materials: ["Brass", "Beeswax", "Clay", "Charcoal", "Rice Husk"],
    specialties: ["Tribal Figurines", "Animal Forms", "Ceremonial Objects"],
    techniques: ["Lost-wax casting", "Beeswax thread carving", "Clay mould building"],
    inspiration: "The mould must be broken to free what is inside. That is true of more than just metal.",
    awards: "National Award for Dhokra Craft (2007), Tribal Art Samman MP (2014)",
    workshopAddress: "Dhaniram's Foundry, Baiga Basti, Kondagaon, Bastar — 494226",
    portfolio: [],
    status: "approved",
  },

  // ── id: "15" — Savitri Bai Patidar — Maheshwari Saree ──────────────────
  {
    staticId: "15",
    personal: {
      name: "Savitri Bai Patidar",
      profileName: "Savitri Bai Patidar",
      age: "57",
      gender: "Female",
      city: "Maheshwar",
      village: "Maheshwar",
      pincode: "451224",
      address: "Weavers Colony, Near Ahilya Fort, Maheshwar, MP",
      phone: "9425001515",
      email: "savitribai.maheshwari@karigarh.in",
    },
    craft: {
      craftForm: "Maheshwari Saree",
      craftCustom: "",
      experience: "30–35 years",
      region: "Madhya Pradesh",
      priceRange: "₹3,000 – ₹18,000",
    },
    description:
      "I weave on the banks of the Narmada river in the town where Rani Ahilya Bai Holkar revived this craft in the 18th century. My sarees with their signature reversible border and silk-cotton blend have been worn by stateswomen and fashion icons alike. The Maheshwari saree is unique — the border is reversible, meaning it looks identical on both sides, a weaving feat that takes years to master. I have been weaving for 30 years and I still find new combinations of stripe and check that the loom surprises me with.",
    materials: ["Mulberry Silk", "Cotton Yarn", "Gold Zari", "Wooden Loom"],
    specialties: ["Reversible Border", "Checks & Stripes", "Tissue Weave"],
    techniques: ["Reversible border technique", "Silk-cotton blend threading", "Zari weft insertion"],
    inspiration: "The river flows past every morning. The loom learns its rhythm.",
    awards: "National Handloom Award (2012), MP Women Weaver Samman (2017)",
    workshopAddress: "Savitri's Loom House, Weavers Colony, Maheshwar — 451224",
    portfolio: [],
    status: "approved",
  },

  // ── id: "16" — Laxman Bhil — Pitthora Painting ─────────────────────────
  {
    staticId: "16",
    personal: {
      name: "Laxman Bhil",
      profileName: "Laxman Bhil",
      age: "49",
      gender: "Male",
      city: "Jhabua",
      village: "Alirajpur",
      pincode: "457661",
      address: "Bhil Basti, Alirajpur, Jhabua District, MP",
      phone: "9425001616",
      email: "laxman.pitthora@karigarh.in",
    },
    craft: {
      craftForm: "Pitthora Painting",
      craftCustom: "",
      experience: "25–30 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,200 – ₹8,000",
    },
    description:
      "For me and my Bhilala community, painting Pitthora on the walls of a home is an act of prayer. Every horse, deity, and village scene is placed according to sacred tradition that has been handed down through generations. My work has been exhibited internationally as both art and anthropology — it is one of the few living traditions where ritual and aesthetics are completely inseparable. The painting is performed during a ceremony; the priest chants while I paint. When the wall painting is complete, the blessing is complete. Taking Pitthora off the wall and onto canvas and paper has been my own innovation — a way to carry the prayer into the world.",
    materials: ["Natural Earth Pigments", "White Clay", "Bamboo Brushes", "Cow Dung Plaster"],
    specialties: ["Ritual Wall Paintings", "Horse Processions", "Deity Panels"],
    techniques: ["Wall plaster preparation", "Earth pigment mixing", "Ritual sequential composition"],
    inspiration: "The horse carries the god. The painting carries the horse. I carry the painting.",
    awards: "Tribal Heritage Art Award, Government of MP (2013)",
    workshopAddress: "Laxman's Pitthora Studio, Alirajpur, Jhabua — 457661",
    portfolio: [],
    status: "approved",
  },

  // ── id: "17" — Ramprasad Kushwaha — Stone Carving ──────────────────────
  {
    staticId: "17",
    personal: {
      name: "Ramprasad Kushwaha",
      profileName: "Ramprasad Kushwaha",
      age: "65",
      gender: "Male",
      city: "Gwalior",
      village: "",
      pincode: "474001",
      address: "Lashkar, Near Gwalior Fort, Gwalior, MP",
      phone: "9425001717",
      email: "ramprasad.stonecarving@karigarh.in",
    },
    craft: {
      craftForm: "Stone Carving",
      craftCustom: "",
      experience: "35–40 years",
      region: "Madhya Pradesh",
      priceRange: "₹2,000 – ₹20,000",
    },
    description:
      "My chisels have shaped sandstone into temple reliefs and deity sculptures for nearly four decades. My family traces its craft lineage to the artisans who built the great temples of Khajuraho, and I continue that tradition with every strike of the hammer. Stone carving is the slowest of all crafts — a single panel can take six months. But stone also lasts the longest. I have carved pieces that will outlast every building in this city. My work is in temples across MP and Rajasthan, and I have also received commissions from hotel groups and private collectors who want large architectural elements.",
    materials: ["Sandstone", "Marble", "Iron Chisels", "Diamond Cutters", "Hammer"],
    specialties: ["Temple Reliefs", "Deity Sculptures", "Architectural Elements"],
    techniques: ["Sandstone chiselling", "Relief carving", "Surface finishing"],
    inspiration: "I do not make the stone. I remove what was never meant to be there.",
    awards: "National Award for Stone Carving (2005), MP Shilp Guru (2016)",
    workshopAddress: "Kushwaha Stone Workshop, Lashkar, Gwalior — 474001",
    portfolio: [],
    status: "approved",
  },

  // ── id: "18" — Kamla Devi Prajapati — Terracotta Craft ─────────────────
  {
    staticId: "18",
    personal: {
      name: "Kamla Devi Prajapati",
      profileName: "Kamla Devi Prajapati",
      age: "49",
      gender: "Female",
      city: "Burhanpur",
      village: "Burhanpur",
      pincode: "450331",
      address: "Kumhar Basti, Burhanpur, MP",
      phone: "9425001818",
      email: "kamladevi.terracotta@karigarh.in",
    },
    craft: {
      craftForm: "Terracotta Craft",
      craftCustom: "",
      experience: "20–25 years",
      region: "Madhya Pradesh",
      priceRange: "₹400 – ₹3,000",
    },
    description:
      "I hand-mould clay into folk deities, harvest animals, and ritual lamps that have anchored village ceremonies for centuries. I fire my pieces in a traditional kiln dug from the earth, using techniques unchanged for thousands of years. Terracotta is the most democratic of crafts — the clay is free, the fire is available, and the forms have not changed because the human need for them has not changed. People still need the same gods at harvest, the same lamps at Diwali, the same animals at the doorstep. My job is to make those needs visible in clay.",
    materials: ["Local River Clay", "Natural Oxides", "Rice Husk", "Wood Fire"],
    specialties: ["Folk Deities", "Ritual Lamps", "Harvest Figurines"],
    techniques: ["Hand moulding", "Earth kiln firing", "Natural oxide colouring"],
    inspiration: "Clay comes from the earth and returns to it. In between, it serves the people.",
    awards: "MP Women Artisan Award (2018), Tribal Terracotta Craft Certificate (2021)",
    workshopAddress: "Kamla Devi's Clay Studio, Kumhar Basti, Burhanpur — 450331",
    portfolio: [],
    status: "approved",
  },

  // ── id: "19" — Sukri Bai Gond — Tribal Jewellery ───────────────────────
  {
    staticId: "19",
    personal: {
      name: "Sukri Bai Gond",
      profileName: "Sukri Bai Gond",
      age: "55",
      gender: "Female",
      city: "Bastar",
      village: "Kondagaon",
      pincode: "494226",
      address: "Gond Basti, Near Tribal Craft Centre, Kondagaon, Bastar",
      phone: "9425001919",
      email: "sukribai.gond@karigarh.in",
    },
    craft: {
      craftForm: "Tribal Jewellery",
      craftCustom: "",
      experience: "25–30 years",
      region: "Madhya Pradesh",
      priceRange: "₹800 – ₹5,000",
    },
    description:
      "I craft tribal ornaments from brass, seeds, shells, and beads that encode the identity of my Gond community. Every necklace, anklet, and armlet I make carries meaning — which community you belong to, whether you are married, your place in the social fabric. Our jewellery is not decoration; it is a language written on the body. A bride's complete set of Gond marriage ornaments can take me three weeks to assemble. Over 27 years I have trained my two daughters and six other women of the village, ensuring this coded language of adornment survives.",
    materials: ["Brass", "Glass Beads", "Seeds", "Shells", "Silver Wire", "Copper Thread"],
    specialties: ["Marriage Ornaments", "Ceremonial Necklaces", "Brass Anklets"],
    techniques: ["Lost-wax brass casting", "Bead stringing on brass wire", "Shell and seed inlay"],
    inspiration: "Every ornament I make is a sentence in our language. When our women stop wearing them, a language dies.",
    awards: "Tribal Heritage Craft Award, Government of MP (2015), Adivasi Shilp Samman (2020)",
    workshopAddress: "Sukri Bai's Craft Home, Gond Basti, Kondagaon, Bastar — 494226",
    portfolio: [],
    status: "approved",
  },

  // ── id: "20" — Irrfan Ansari — Batik Art ───────────────────────────────
  {
    staticId: "20",
    personal: {
      name: "Irrfan Ansari",
      profileName: "Irrfan Ansari",
      age: "47",
      gender: "Male",
      city: "Bhopal",
      village: "",
      pincode: "462001",
      address: "Old Bhopal, Near Moti Masjid, Bhopal",
      phone: "9425002020",
      email: "irrfan.batik@karigarh.in",
    },
    craft: {
      craftForm: "Batik Art",
      craftCustom: "",
      experience: "20–25 years",
      region: "Madhya Pradesh",
      priceRange: "₹1,000 – ₹6,000",
    },
    description:
      "I apply hot wax to silk and cotton with a tjanting tool, building up layers of resist and dye to create richly patterned fabrics. My Bhopal school of Batik fuses Central Indian folk motifs with Persian-influenced geometry into vibrant wall hangings and sarees. The wax is the secret — where it touches, colour cannot follow; where it lifts, the dye blooms in its place. I work in a studio that is always hot and always fragrant with melted beeswax and natural dye. Each piece is dipped five to ten times; the image only becomes fully visible after the final cold-water wash removes the last of the wax.",
    materials: ["Silk", "Cotton", "Beeswax", "Natural Dyes", "Tjanting Tool"],
    specialties: ["Wall Hangings", "Saree Panels", "Abstract Motifs"],
    techniques: ["Tjanting wax application", "Multi-dip colour building", "Cold-water wax removal"],
    inspiration: "Wax teaches restraint. You cover what you want to protect. Then you let go.",
    awards: "MP Batik Art Award (2016), Bhopal Heritage Craft Recognition (2021)",
    workshopAddress: "Ansari Batik Studio, Old Bhopal — 462001",
    portfolio: [],
    status: "approved",
  },
];

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

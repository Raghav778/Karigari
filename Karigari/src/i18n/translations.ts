export type LangCode = "en" | "hi" | "raj" | "mr" | "gu";

export interface Translations {
  nav: {
    regions: string;
    language: string;
    login: string;
    signUp: string;
    home: string;
    archive: string;
    searchPlaceholder: string;
    langLabel: string;
    mobileLanguageLabel: string;
    explore: string;
    discover: string;
    bookVisit: string;
  };
  home: {
    badgeRajasthan: string;
    badgeMP: string;
    heroTitle: string;
    heroSubtitle: string;
    exploreRajasthan: string;
    exploreMP: string;
    craftLabels: { pottery: string; phad: string; bandhani: string; gond: string };
    stats: { artisans: string; traditions: string; heritage: string; regions: string };
    howItWorks: string;
    steps: Array<{ num: string; title: string; desc: string }>;
    ctaTitle: string;
    ctaSubtitle: string;
    discoverArtisans: string;
    exploreArchive: string;
  };
  footer: {
    tagline: string;
    regions: string;
    explore: string;
    connect: string;
    discoverCrafts: string;
    archive: string;
    bookVisit: string;
    join: string; // link text for joining as a karigarh
    copyright: string;
  };
  // optional translations specific to new join page
  joinPage?: {
    description: string;
  };
  discover: {
    title: string;
    searchLabel: string;
    searchPlaceholder: string;
    regionLabel: string;
    categoryLabel: string;
    all: string;
    found: (n: number) => string;
    noResults: string;
    ceramics: string;
    painting: string;
    textile: string;
  };
  archive: {
    title: string;
    searchPlaceholder: string;
    mostEndangered: string;
    left: string;
    contributeTitle: string;
    contributeDesc: string;
    read: string;
    noArticles: string;
  };
  booking: {
    back: string;
    bookingConfirmed: string;
    returnHome: string;
    selectDate: string;
    selectTime: string;
    confirmBooking: string;
    with: string;
  };
  region: {
    crafts: string;
    livingTraditions: string;
    notFound: string;
    notFoundDesc: string;
    noCrafts: string;
    taglines: { Rajasthan: string; "Madhya Pradesh": string };
  };
  craftsman: {
    endangered: string;
    bookSession: string;
    backToDiscover: string;
  };
  notFound: {
    title: string;
    message: string;
    returnHome: string;
  };
}

export const languages: { code: LangCode; name: string }[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "raj", name: "राजस्थानी" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
];

export const translations: Record<LangCode, Translations> = {
  en: {
    nav: {
      regions: "Regions",
      language: "Language",
      login: "Login",
      signUp: "Sign Up",
      home: "Home",
      archive: "Archive",
      searchPlaceholder: "Search...",
      langLabel: "Language",
      mobileLanguageLabel: "Language",
      explore: "Explore",
      discover: "Discover",
      bookVisit: "Book a Visit",
    },
    home: {
      badgeRajasthan: "Rajasthan",
      badgeMP: "Madhya Pradesh",
      heroTitle: "Where Ancient Hands\nShape Living Art",
      heroSubtitle: "Discover India's most endangered craft traditions. Meet the master artisans. Preserve their legacy before it fades into history.",
      exploreRajasthan: "🏜️ Explore Rajasthan Crafts",
      exploreMP: "💚 Explore Madhya Pradesh Crafts",
      craftLabels: { pottery: "Blue Pottery", phad: "Phad Painting", bandhani: "Bandhani", gond: "Gond Art" },
      stats: { artisans: "Artisans", traditions: "Living Traditions", heritage: "Years of Heritage", regions: "Regions Preserved" },
      howItWorks: "How It Works",
      steps: [
        { num: "01", title: "Discover", desc: "Explore endangered crafts and master artisans from Rajasthan & Madhya Pradesh." },
        { num: "02", title: "Book", desc: "Schedule an immersive workshop session with a heritage craftsman." },
        { num: "03", title: "Preserve", desc: "Support living traditions. Every visit helps sustain ancient art forms." },
      ],
      ctaTitle: "Before the Last Master\nLays Down His Tools",
      ctaSubtitle: "Every craft lost is a civilization forgotten. Join us in preserving India's living heritage.",
      discoverArtisans: "Discover Artisans",
      exploreArchive: "Explore Archive",
    },
    footer: {
      tagline: "Ancient Crafts, Timeless Art. Preserving India's living heritage through digital storytelling.",
      regions: "Regions",
      explore: "Explore",
      connect: "Connect",
      discoverCrafts: "Discover Crafts",
      archive: "Archive",
      bookVisit: "Book a Visit",
      join: "Join as a Karigarh",
      copyright: "© 2026 Karigarh. All traditions preserved.",
    },
    joinPage: {
      description: "Are you a traditional artisan looking to preserve and share your craft with the world? Fill out the form below and become part of the Karigarh family."
    },
    discover: {
      title: "Discover Artisans",
      searchLabel: "Search",
      searchPlaceholder: "Search artisans...",
      regionLabel: "Region",
      categoryLabel: "Category",
      all: "All",
      found: (n) => `${n} artisans found`,
      noResults: "No artisans match your filters.",
      ceramics: "Ceramics",
      painting: "Painting",
      textile: "Textile",
    },
    archive: {
      title: "Heritage Archive",
      searchPlaceholder: "Search the archive...",
      mostEndangered: "Most Endangered",
      left: "left",
      contributeTitle: "Contribute to the Legacy",
      contributeDesc: "Help document and preserve disappearing craft traditions.",
      read: "Read",
      noArticles: "No articles found.",
    },
    booking: {
      back: "Back",
      bookingConfirmed: "Booking Confirmed",
      returnHome: "Return Home",
      selectDate: "Select a Date",
      selectTime: "Select a Time Slot",
      confirmBooking: "Confirm Booking",
      with: "with",
    },
    region: {
      crafts: "Crafts",
      livingTraditions: "Living Traditions",
      notFound: "Region not found",
      notFoundDesc: "We couldn't locate the region you requested.",
      noCrafts: "No crafts found for this region.",
      taglines: {
        Rajasthan: "The golden desert state where every colour tells a story of royalty, devotion, and survival.",
        "Madhya Pradesh": "The heart of India, where tribal wisdom and ancient looms have shaped civilisations for centuries.",
      },
    },
    craftsman: { endangered: "Endangered", bookSession: "Book a Session", backToDiscover: "Back to Discover" },
    notFound: { title: "404", message: "Oops! Page not found", returnHome: "Return to Home" },
  },

  hi: {
    nav: {
      regions: "क्षेत्र",
      language: "भाषा",
      login: "लॉगिन",
      signUp: "साइन अप",
      home: "होम",
      archive: "पुरालेख",
      searchPlaceholder: "खोजें...",
      langLabel: "भाषा",
      mobileLanguageLabel: "भाषा",
      explore: "खोजें",
      discover: "खोज",
      bookVisit: "यात्रा बुक करें",
    },
    home: {
      badgeRajasthan: "राजस्थान",
      badgeMP: "मध्य प्रदेश",
      heroTitle: "जहाँ प्राचीन हाथ\nजीवित कला को आकार देते हैं",
      heroSubtitle: "भारत की सबसे लुप्तप्राय शिल्प परंपराओं की खोज करें। मास्टर कारीगरों से मिलें। इतिहास में विलीन होने से पहले उनकी विरासत को संरक्षित करें।",
      exploreRajasthan: "🏜️ राजस्थान के शिल्प खोजें",
      exploreMP: "💚 मध्य प्रदेश के शिल्प खोजें",
      craftLabels: { pottery: "ब्लू पॉटरी", phad: "फड़ चित्रकारी", bandhani: "बंधानी", gond: "गोंड कला" },
      stats: { artisans: "कारीगर", traditions: "जीवित परंपराएँ", heritage: "विरासत के वर्ष", regions: "संरक्षित क्षेत्र" },
      howItWorks: "यह कैसे काम करता है",
      steps: [
        { num: "०१", title: "खोजें", desc: "राजस्थान और मध्य प्रदेश के लुप्तप्राय शिल्प और मास्टर कारीगरों को जानें।" },
        { num: "०२", title: "बुक करें", desc: "किसी विरासत कारीगर के साथ इमर्सिव वर्कशॉप सेशन बुक करें।" },
        { num: "०३", title: "संरक्षित करें", desc: "जीवित परंपराओं का समर्थन करें। हर दौरा प्राचीन कला रूपों को बनाए रखने में मदद करता है।" },
      ],
      ctaTitle: "अंतिम उस्ताद के\nकाम छोड़ने से पहले",
      ctaSubtitle: "हर खोया हुआ शिल्प एक भूली हुई सभ्यता है। भारत की जीवित विरासत को संरक्षित करने में हमसे जुड़ें।",
      discoverArtisans: "कारीगरों की खोज करें",
      exploreArchive: "पुरालेख देखें",
    },
    footer: {
      tagline: "प्राचीन शिल्प, कालातीत कला। डिजिटल कहानियों के माध्यम से भारत की जीवित विरासत को संरक्षित करना।",
      regions: "क्षेत्र",
      explore: "खोजें",
      connect: "जुड़ें",
      discoverCrafts: "शिल्प खोजें",
      archive: "पुरालेख",
      bookVisit: "यात्रा बुक करें",      join: "एक करिगर के रूप में जुड़ें",      copyright: "© 2026 करीगढ़। सभी परंपराएँ संरक्षित।",
    },
    discover: {
      title: "कारीगरों की खोज",
      searchLabel: "खोज",
      searchPlaceholder: "कारीगरों को खोजें...",
      regionLabel: "क्षेत्र",
      categoryLabel: "श्रेणी",
      all: "सभी",
      found: (n) => `${n} कारीगर मिले`,
      noResults: "आपके फ़िल्टर से कोई कारीगर नहीं मिला।",
      ceramics: "मिट्टी कला",
      painting: "चित्रकारी",
      textile: "बुनाई",
    },
    archive: {
      title: "विरासत पुरालेख",
      searchPlaceholder: "पुरालेख खोजें...",
      mostEndangered: "सबसे लुप्तप्राय",
      left: "बचे",
      contributeTitle: "विरासत में योगदान दें",
      contributeDesc: "लुप्त होती शिल्प परंपराओं को दस्तावेज और संरक्षित करने में मदद करें।",
      read: "पढ़ें",
      noArticles: "कोई लेख नहीं मिला।",
    },
    booking: {
      back: "वापस",
      bookingConfirmed: "बुकिंग की पुष्टि हुई",
      returnHome: "होम पर लौटें",
      selectDate: "तारीख चुनें",
      selectTime: "समय स्लॉट चुनें",
      confirmBooking: "बुकिंग की पुष्टि करें",
      with: "के साथ",
    },
    region: {
      crafts: "के शिल्प",
      livingTraditions: "जीवित परंपराएँ",
      notFound: "क्षेत्र नहीं मिला",
      notFoundDesc: "आपके द्वारा अनुरोधित क्षेत्र हम नहीं ढूंढ सके।",
      noCrafts: "इस क्षेत्र के लिए कोई शिल्प नहीं मिला।",
      taglines: {
        Rajasthan: "सुनहरी मरुभूमि का राज्य जहाँ हर रंग राजसत्ता, भक्ति और जिजीविषा की कहानी कहता है।",
        "Madhya Pradesh": "भारत का हृदय, जहाँ आदिवासी ज्ञान और प्राचीन करघों ने सदियों से सभ्यताओं को आकार दिया है।",
      },
    },
    craftsman: { endangered: "लुप्तप्राय", bookSession: "सेशन बुक करें", backToDiscover: "खोज पर वापस" },
    notFound: { title: "४०४", message: "अरे! पेज नहीं मिला", returnHome: "होम पर लौटें" },
  },

  raj: {
    nav: {
      regions: "इलाका",
      language: "भाषा",
      login: "लॉगिन",
      signUp: "साइन अप",
      home: "घर",
      archive: "संग्रह",
      searchPlaceholder: "खोजो...",
      langLabel: "भाषा",
      mobileLanguageLabel: "भाषा",
      explore: "खोजो",
      discover: "खोज",
      bookVisit: "मुलाकात बुक करो",
    },
    home: {
      badgeRajasthan: "राजस्थान",
      badgeMP: "मध्य प्रदेश",
      heroTitle: "जठे पुराणा हाथां\nजीवित कला बणावे",
      heroSubtitle: "हिंदुस्तान री सबसे खतरे में आई कला-परम्पराओं ने जाणो। उस्ताद कारीगरां ने मिलो। इतियास में खोवण सूं पहलां उणांरी विरासत बचाओ।",
      exploreRajasthan: "🏜️ राजस्थान री कला खोजो",
      exploreMP: "💚 मध्य प्रदेश री कला खोजो",
      craftLabels: { pottery: "नीली मिट्टी कला", phad: "फड़ चित्रकला", bandhani: "बंधानी", gond: "गोंड कला" },
      stats: { artisans: "कारीगर", traditions: "जीवित परम्पराएँ", heritage: "विरासत रा वरस", regions: "बचाया इलाका" },
      howItWorks: "यो किण तरां काम करे",
      steps: [
        { num: "०१", title: "खोजो", desc: "राजस्थान अर मध्य प्रदेश रा लुप्त होवणिया शिल्प अर उस्ताद कारीगर जाणो।" },
        { num: "०२", title: "बुक करो", desc: "किणी विरासत कारीगर सूं वर्कशॉप सेशन बुक करो।" },
        { num: "०३", title: "बचाओ", desc: "जीवित परम्पराओं ने साथ दो। हर मुलाकात पुराणी कलाओं ने जिंदो राखे।" },
      ],
      ctaTitle: "आखरी उस्ताद रे\nहाथ रोकण सूं पहलां",
      ctaSubtitle: "हर खोई कला एक भूलायी सभ्यता है। हिंदुस्तान री जीवित विरासत बचाण में साथ आओ।",
      discoverArtisans: "कारीगर खोजो",
      exploreArchive: "संग्रह देखो",
    },
    footer: {
      tagline: "पुराणी कला, अमर कला। डिजिटल कहाणियां रे जरिये हिंदुस्तान री जीवित विरासत बचाणो।",
      regions: "इलाका",
      explore: "खोजो",
      connect: "जुड़ो",
      discoverCrafts: "शिल्प खोजो",
      archive: "संग्रह",
      bookVisit: "मुलाकात बुक करो",
      join: "करिगर बनो",
      copyright: "© 2026 करीगढ़। सगळी परम्पराएँ बचायीड़ी।",
    },
    discover: {
      title: "कारीगर खोजो",
      searchLabel: "खोज",
      searchPlaceholder: "कारीगर खोजो...",
      regionLabel: "इलाका",
      categoryLabel: "किस्म",
      all: "सगळा",
      found: (n) => `${n} कारीगर मिल्या`,
      noResults: "कोई कारीगर नीं मिल्यो।",
      ceramics: "मिट्टी कला",
      painting: "चित्रकला",
      textile: "बुणाई",
    },
    archive: {
      title: "विरासत संग्रह",
      searchPlaceholder: "संग्रह खोजो...",
      mostEndangered: "सबसे खतरे में",
      left: "बच्या",
      contributeTitle: "विरासत में हाथ बटाओ",
      contributeDesc: "लुप्त होवणिया शिल्प परम्पराओं ने दस्तावेज अर बचाण में मदद करो।",
      read: "पढ़ो",
      noArticles: "कोई लेख नीं मिल्यो।",
    },
    booking: {
      back: "वापस",
      bookingConfirmed: "बुकिंग पक्की",
      returnHome: "घर वापस",
      selectDate: "तारीख चुणो",
      selectTime: "वक्त चुणो",
      confirmBooking: "बुकिंग पक्की करो",
      with: "साथ",
    },
    region: {
      crafts: "री कला",
      livingTraditions: "जीवित परम्पराएँ",
      notFound: "इलाको नीं मिल्यो",
      notFoundDesc: "थांरो मांग्यो इलाको ढूंढ नीं सक्या।",
      noCrafts: "इस इलाके री कोई कला नीं मिली।",
      taglines: {
        Rajasthan: "सुनहरी धोरां री धरती जठे हर रंग राजसत्ता, भक्ति अर जीवट री कहाणी कहे।",
        "Madhya Pradesh": "हिंदुस्तान रो दिल, जठे आदिवासी ज्ञान अर पुराणे करघां सूं सदियां सूं सभ्यताएँ बणती आई।",
      },
    },
    craftsman: { endangered: "खतरे में", bookSession: "सेशन बुक करो", backToDiscover: "खोज पर वापस" },
    notFound: { title: "४०४", message: "अरे! पान नीं मिल्यो", returnHome: "घर वापस जाओ" },
  },

  mr: {
    nav: {
      regions: "प्रदेश",
      language: "भाषा",
      login: "लॉगिन",
      signUp: "साइन अप",
      home: "मुखपृष्ठ",
      archive: "संग्रहालय",
      searchPlaceholder: "शोधा...",
      langLabel: "भाषा",
      mobileLanguageLabel: "भाषा",
      explore: "शोधा",
      discover: "शोध",
      bookVisit: "भेट बुक करा",
    },
    home: {
      badgeRajasthan: "राजस्थान",
      badgeMP: "मध्य प्रदेश",
      heroTitle: "जिथे प्राचीन हात\nजिवंत कला घडवतात",
      heroSubtitle: "भारतातील सर्वात लुप्तप्राय कला परंपरा शोधा. मास्टर कारागिरांना भेटा. इतिहासात विरण्यापूर्वी त्यांचा वारसा जपा.",
      exploreRajasthan: "🏜️ राजस्थानच्या कला शोधा",
      exploreMP: "💚 मध्य प्रदेशच्या कला शोधा",
      craftLabels: { pottery: "निळी मातीकाम", phad: "फड़ चित्रकला", bandhani: "बंधानी", gond: "गोंड कला" },
      stats: { artisans: "कारागीर", traditions: "जिवंत परंपरा", heritage: "वारशाची वर्षे", regions: "जतन केलेले प्रदेश" },
      howItWorks: "हे कसे कार्य करते",
      steps: [
        { num: "०१", title: "शोधा", desc: "राजस्थान आणि मध्य प्रदेशातील लुप्तप्राय कला आणि मास्टर कारागिरांना जाणून घ्या." },
        { num: "०२", title: "बुक करा", desc: "वारसा कारागिरासोबत इमर्सिव्ह वर्कशॉप सेशन बुक करा." },
        { num: "०३", title: "जपा", desc: "जिवंत परंपरांना आधार द्या. प्रत्येक भेट प्राचीन कला टिकवण्यास मदत करते." },
      ],
      ctaTitle: "अखेरचा उस्ताद\nआपले काम सोडण्यापूर्वी",
      ctaSubtitle: "हरवलेली प्रत्येक कला एक विसरलेली संस्कृती आहे. भारताचा जिवंत वारसा जपण्यात आमच्यात सामील व्हा.",
      discoverArtisans: "कारागीर शोधा",
      exploreArchive: "संग्रहालय पाहा",
    },
    footer: {
      tagline: "प्राचीन कला, चिरंतन कला. डिजिटल कथांद्वारे भारताचा जिवंत वारसा जपणे.",
      regions: "प्रदेश",
      explore: "शोधा",
      connect: "जोडा",
      discoverCrafts: "कला शोधा",
      archive: "संग्रहालय",
      bookVisit: "भेट बुक करा",
      join: "करिगर म्हणून सामील व्हा",
      copyright: "© 2026 करीगढ. सर्व परंपरा जतन केल्या.",
    },
    discover: {
      title: "कारागीर शोधा",
      searchLabel: "शोध",
      searchPlaceholder: "कारागीर शोधा...",
      regionLabel: "प्रदेश",
      categoryLabel: "श्रेणी",
      all: "सर्व",
      found: (n) => `${n} कारागीर आढळले`,
      noResults: "आपल्या फिल्टरशी जुळणारे कोणतेही कारागीर नाहीत.",
      ceramics: "मातीकाम",
      painting: "चित्रकला",
      textile: "विणकाम",
    },
    archive: {
      title: "वारसा संग्रहालय",
      searchPlaceholder: "संग्रहालय शोधा...",
      mostEndangered: "सर्वाधिक लुप्तप्राय",
      left: "शिल्लक",
      contributeTitle: "वारशात योगदान द्या",
      contributeDesc: "नाहीशा होणाऱ्या कला परंपरा नोंदवण्यास आणि जपण्यास मदत करा.",
      read: "वाचा",
      noArticles: "कोणतेही लेख आढळले नाहीत.",
    },
    booking: {
      back: "मागे",
      bookingConfirmed: "बुकिंग निश्चित",
      returnHome: "मुखपृष्ठावर परत",
      selectDate: "तारीख निवडा",
      selectTime: "वेळ स्लॉट निवडा",
      confirmBooking: "बुकिंग निश्चित करा",
      with: "यांच्यासह",
    },
    region: {
      crafts: "कला",
      livingTraditions: "जिवंत परंपरा",
      notFound: "प्रदेश आढळला नाही",
      notFoundDesc: "आपण विनंती केलेला प्रदेश आम्हाला सापडला नाही.",
      noCrafts: "या प्रदेशासाठी कोणत्याही कला आढळल्या नाहीत.",
      taglines: {
        Rajasthan: "सोनेरी वाळवंटाचे राज्य जिथे प्रत्येक रंग राजेशाही, भक्ती आणि जगण्याची कहाणी सांगतो.",
        "Madhya Pradesh": "भारताचे हृदय, जिथे आदिवासी शहाणपण आणि प्राचीन माग्यांनी शतकांपासून संस्कृतींना आकार दिला.",
      },
    },
    craftsman: { endangered: "लुप्तप्राय", bookSession: "सेशन बुक करा", backToDiscover: "शोधाकडे परत" },
    notFound: { title: "४०४", message: "अरेरे! पृष्ठ आढळले नाही", returnHome: "मुखपृष्ठावर परत" },
  },

  gu: {
    nav: {
      regions: "પ્રદેશ",
      language: "ભાષા",
      login: "લૉગિન",
      signUp: "સાઇન અપ",
      home: "ઘર",
      archive: "સંગ્રહ",
      searchPlaceholder: "શોધો...",
      langLabel: "ભાષા",
      mobileLanguageLabel: "ભાષા",
      explore: "શોધો",
      discover: "શોધ",
      bookVisit: "મુલાકાત બૂક કરો",
    },
    home: {
      badgeRajasthan: "રાજસ્થાન",
      badgeMP: "મધ્ય પ્રદેશ",
      heroTitle: "જ્યાં પ્રાચીન હાથ\nજીવંત કળા ઘડે છે",
      heroSubtitle: "ભારતની સૌથી જોખમમાં આવેલી હસ્તકળા પ્રણાલીઓ શોધો. માસ્ટર કારીગરોને મળો. ઇતિહાસમાં ભળી જાય તે પહેલાં તેમની વિરાસત સાચવો.",
      exploreRajasthan: "🏜️ રાજસ્થાનની કળા શોધો",
      exploreMP: "💚 મધ્ય પ્રદેશની કળા શોધો",
      craftLabels: { pottery: "બ્લ્યુ પોટરી", phad: "ફડ ચિત્રકળા", bandhani: "બાંધણી", gond: "ગોંડ કળા" },
      stats: { artisans: "કારીગર", traditions: "જીવંત પરંપરાઓ", heritage: "વિરાસતનાં વર્ષ", regions: "સાચવેલા પ્રદેશ" },
      howItWorks: "આ કેવી રીતે કામ કરે છે",
      steps: [
        { num: "૦૧", title: "શોધો", desc: "રાજસ્થાન અને મધ્ય પ્રદેશના ભૂ-ભ્રષ્ટ હસ્તકળા અને માસ્ટર કારીગરો શોધો." },
        { num: "૦૨", title: "બૂક કરો", desc: "વિરાસત કારીગર સાથે ઇમર્સિવ વર્કશૉપ સેશન બૂક કરો." },
        { num: "૦૩", title: "સાચવો", desc: "જીવંત પ્રણાલીઓને ટેકો આપો. દરેક મુલાકાત પ્રાચીન કળા ટકાવવામાં મદદ કરે છે." },
      ],
      ctaTitle: "છેલ્લા ઉસ્તાદ\nઓજાર મૂકે તે પહેલાં",
      ctaSubtitle: "ખોવાયેલ હસ્તકળા એ ભૂલાઈ ગયેલ સભ્યતા છે. ભારતની જીવંત વિરાસત સાચવવામાં અમારી સાથે જોડાઓ.",
      discoverArtisans: "કારીગર શોધો",
      exploreArchive: "સંગ્રહ જુઓ",
    },
    footer: {
      tagline: "પ્રાચીન કળા, અમર કળા. ડિજિટલ વાર્તાઓ દ્વારા ભારતની જીવંત વિરાસત સાચવવી.",
      regions: "પ્રદેશ",
      explore: "શોધો",
      connect: "જોડાઓ",
      discoverCrafts: "હસ્તકળા શોધો",
      archive: "સંગ્રહ",
      bookVisit: "મુલાકાત બૂક કરો",      join: "કારિગર તરીકે જોડાઓ",      copyright: "© 2026 કારીગઢ. તમામ પરંપરાઓ સાચવેલ.",
    },
    discover: {
      title: "કારીગર શોધો",
      searchLabel: "શોધ",
      searchPlaceholder: "કારીગર શોધો...",
      regionLabel: "પ્રદેશ",
      categoryLabel: "શ્રેણી",
      all: "બધા",
      found: (n) => `${n} કારીગર મળ્યા`,
      noResults: "તમારા ફિલ્ટર સાથે કોઈ કારીગર મળ્યા નહીં.",
      ceramics: "માટી કળા",
      painting: "ચિત્રકળા",
      textile: "વણાટ",
    },
    archive: {
      title: "વિરાસત સંગ્રહ",
      searchPlaceholder: "સંગ્રહ શોધો...",
      mostEndangered: "સૌથી વધુ જોખમમાં",
      left: "બાકી",
      contributeTitle: "વિરાસતમાં યોગદાન આપો",
      contributeDesc: "અદૃશ્ય થઈ રહેલી હસ્તકળા પ્રણાલીઓ નોંધવામાં અને સાચવવામાં મદદ કરો.",
      read: "વાંચો",
      noArticles: "કોઈ લેખ મળ્યો નહીં.",
    },
    booking: {
      back: "પાછા",
      bookingConfirmed: "બૂકિંગ નક્કી",
      returnHome: "ઘરે પાછા",
      selectDate: "તારીખ પસંદ કરો",
      selectTime: "સમય સ્લૉટ પસંદ કરો",
      confirmBooking: "બૂકિંગ નક્કી કરો",
      with: "સાથે",
    },
    region: {
      crafts: "ની કળા",
      livingTraditions: "જીવંત પરંપરાઓ",
      notFound: "પ્રદેશ મળ્યો નહીં",
      notFoundDesc: "તમે વિનંતી કરેલો પ્રદેશ અમે શોધી શક્યા નહીં.",
      noCrafts: "આ પ્રદેશ માટે કોઈ કળા મળી નહીં.",
      taglines: {
        Rajasthan: "સોનેરી રણ પ્રદેશ જ્યાં દરેક રંગ રાજવી, ભક્તિ અને ટકી રહેવાની ગાથા કહે છે.",
        "Madhya Pradesh": "ભારતનું હૃદય, જ્યાં આદિવાસી જ્ઞાન અને પ્રાચીન સાળ સદીઓથી સભ્યતાઓ ઘડ્યા છે.",
      },
    },
    craftsman: { endangered: "જોખમમાં", bookSession: "સેશન બૂક કરો", backToDiscover: "શોધ પર પાછા" },
    notFound: { title: "૪૦૪", message: "અરે! પૃષ્ઠ મળ્યું નહીં", returnHome: "ઘરે પાછા જાઓ" },
  },
};
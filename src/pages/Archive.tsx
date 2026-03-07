import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, ArrowRight, Clock, ArrowLeft } from "lucide-react";
import { crafts } from "@/data/crafts";
import { getCraftImage } from "@/lib/craftImages";
import { useBackground } from "@/hooks/useBackground";

const fullArticles = [
  {
    id: "1",
    title: "The Dying Art of Phad Scrolls",
    category: "Research",
    excerpt: "How a 700-year-old narrative tradition faces extinction as the last master painters age without apprentices.",
    readTime: "8 min",
    image: "phad",
    author: "Dr. Meena Sharma",
    date: "January 2026",
    content: [
      { type: "intro", text: "In the narrow lanes of Bhilwara, Rajasthan, a 700-year-old tradition is breathing its last. Phad painting — the sacred scroll art that narrates the epic tales of folk deities Pabuji and Devnarayanji — survives today in the hands of fewer than 18 master painters. As the eldest among them cross seventy, the question haunting India's heritage community is stark: who will carry the brush forward?" },
      { type: "heading", text: "What is Phad?" },
      { type: "text", text: "Phad is a form of narrative scroll painting practiced in the Bhilwara district of Rajasthan. Traditionally created on hand-spun cloth and measuring anywhere from five to thirty feet in length, these scrolls depict the life stories of Rajasthani folk heroes. The Joshi family of Bhilwara has been the custodian of this art for over fifteen generations, using only natural dyes derived from flowers, minerals, and tree bark." },
      { type: "heading", text: "The Crisis of Succession" },
      { type: "text", text: "The economic reality is brutal. A single large Phad scroll — requiring months of painstaking work — fetches less in the open market than a factory-made print. Young people from Phad-painting families are abandoning the craft for IT jobs and urban opportunities. 'My son learned the art but works in Jaipur now,' says Shanti Devi Joshi, one of the few women to have broken into this traditionally male art form. 'I cannot blame him. This craft feeds the soul but not always the family.'" },
      { type: "quote", text: "When the last Phad painter sets down the brush, an entire cosmology — gods, heroes, epics — will become mute forever.", author: "Prof. Rajendra Singh, Heritage Studies, Udaipur University" },
      { type: "heading", text: "Digital Preservation Efforts" },
      { type: "text", text: "Several NGOs and government bodies have begun digitising existing Phad scrolls in high resolution. The National Museum in Delhi has commissioned 3D scans of the most significant pieces. But scholars argue that digital archives cannot preserve the living tradition — the chanting of the bhopa priests who traditionally performed alongside the scrolls, the communal act of creation, the oral history embedded in each brushstroke. Karigarh's partnership with the Joshi atelier in Bhilwara offers one model of intervention: connecting visitors directly with master painters for immersive workshops, creating an economic lifeline while passing knowledge to willing learners." },
    ],
  },
  {
    id: "2",
    title: "Blue Pottery: From Persia to Jaipur",
    category: "History",
    excerpt: "Tracing the Silk Road journey of quartz-based ceramics and their transformation in Rajasthani workshops.",
    readTime: "12 min",
    image: "pottery",
    author: "Arjun Kapoor",
    date: "December 2025",
    content: [
      { type: "intro", text: "Blue pottery is a paradox. It looks entirely Indian — adorning the corridors of Jaipur's pink palaces and tourist bazaars — yet its origins lie thousands of miles away, in the kilns of Persia and the ateliers of Central Asia. The story of how this turquoise-and-cobalt craft travelled the Silk Road to become one of Rajasthan's most iconic traditions is a story of empire, migration, and creative reinvention." },
      { type: "heading", text: "Persian Roots" },
      { type: "text", text: "The technique of quartz-based blue pottery originated in 9th century Persia and reached India via Afghanistan during the Mughal period. Babur and Humayun brought Persian craftsmen to their courts, and the tradition took root in Delhi. What makes blue pottery unique is its clay-free composition — a paste of quartz stone powder, glass, multani mitti, borax, and gum. This gives finished pieces their distinctive translucent quality." },
      { type: "heading", text: "Jaipur's Transformation" },
      { type: "text", text: "When the craft arrived in Jaipur during the 17th century under Maharaja Man Singh's patronage, local artisans began incorporating distinctly Rajasthani motifs — desert flowers, peacocks, and geometric patterns — into the Persian cobalt framework. The result was something entirely new: a hybrid art form that preserved the technique while reimagining the aesthetic vocabulary." },
      { type: "quote", text: "Each piece is essentially a geological sculpture. We are not potters — we are alchemists working with stone.", author: "Mohan Lal Kumhar, 4th Generation Blue Pottery Master" },
      { type: "heading", text: "The Near-Extinction and Revival" },
      { type: "text", text: "By the 1950s, the craft had nearly vanished. Industrial ceramics undercut traditional pottery economically, and the quartz-based technique required years of training. The revival came in the 1970s through artist Kripal Singh Shekhawat, who documented surviving techniques and established training programmes. Today approximately 32 master potters continue the tradition, but the knowledge of the most complex firing techniques remains held by fewer than a dozen." },
    ],
  },
  {
    id: "3",
    title: "Gond Art & the Sacred Forest",
    category: "Culture",
    excerpt: "Understanding how tribal cosmology shapes every dot and line in this ancient art form from central India.",
    readTime: "6 min",
    image: "gond",
    author: "Priya Nair",
    date: "November 2025",
    content: [
      { type: "intro", text: "For the Gond people of central India, art is not decoration — it is cosmology made visible. Every dot, every line, every intricate pattern of a Gond painting encodes a belief about the relationship between humans, animals, trees, and the divine. To look at a Gond artwork without understanding this is to read a sacred text as mere typography." },
      { type: "heading", text: "The Pardhan Gond Tradition" },
      { type: "text", text: "Gond art originates with the Pardhan Gond sub-group — the traditional bards and musicians of the Gond community in Madhya Pradesh, particularly in the Dindori district. Pardhans were the memory-keepers of Gond society, responsible for preserving and transmitting oral histories, genealogies, and mythologies. Their visual art was an extension of this role: a way of making memory permanent." },
      { type: "heading", text: "The Language of Dots and Lines" },
      { type: "text", text: "The signature style of Gond art — intricate patterns of dots, dashes, lines, and curves filling animal and plant forms — is not arbitrary decoration. Each texture carries meaning. Fish scales indicate water and fertility. Particular leaf patterns denote specific sacred trees. Animals like tigers, elephants, and peacocks are avatars of divine forces. An elder painter from Dindori explained: 'When I paint the forest, I am not creating — I am remembering. Every mark is something my grandmother told me.'" },
      { type: "quote", text: "Gond art is the earth speaking through human hands. We do not invent — we transcribe.", author: "Jangarh Singh Shyam, Gond Master Painter" },
      { type: "heading", text: "From Village Walls to Global Galleries" },
      { type: "text", text: "The transition of Gond art from village mud walls to paper, canvas, and international galleries was sparked by artist Jagdish Swaminathan in the 1980s. He recognised that the visual language of the Gonds was sophisticated enough to engage with contemporary art discourse on its own terms. Today, Gond works hang in museums across Europe and America — a success that brings both visibility and the risk of commercial dilution." },
    ],
  },
  {
    id: "4",
    title: "The Chanderi Weaver's Loom",
    category: "Documentary",
    excerpt: "A day in the life of weavers who create fabrics so fine they can pass through a finger ring.",
    readTime: "10 min",
    image: "chanderi",
    author: "Rohit Verma",
    date: "October 2025",
    content: [
      { type: "intro", text: "At 5 AM in Chanderi, Madhya Pradesh, before the town wakes, the looms are already alive. The rhythmic clack of the shuttle, the hiss of threads under tension — these sounds have defined this small town for over seven centuries. Chanderi fabric, so fine that a six-yard sari weighs less than 100 grams, is the product of this pre-dawn devotion." },
      { type: "heading", text: "The Fabric That Defies Physics" },
      { type: "text", text: "Chanderi's signature is its impossible lightness. The fabric — a blend of mulberry silk and cotton woven with gold or silver zari — achieves a translucency that has earned it the nickname 'woven air.' A Chanderi sari can be passed through a finger ring. This is not a marketing exaggeration but a technical reality born from centuries of refinement: a thread count so high, a warp tension so precise, that the resulting cloth seems to contradict the laws governing solid matter." },
      { type: "heading", text: "A Day with Rekha Verma" },
      { type: "text", text: "Rekha Verma, 48, works on her grandmother's 200-year-old loom in a room no larger than a kitchen. She begins at 5 AM and works until the light fails her eyes in the evening. In a good day, she completes perhaps four inches of complex zari brocade. A single sari takes six to eight weeks. 'The loom is alive,' she says, running her hand across the worn wood. 'When I sit at it, I feel my grandmother's hands guiding mine.'" },
      { type: "quote", text: "I weave the same patterns my grandmother wove, who learned from her grandmother. The thread connects us across time.", author: "Rekha Verma, Chanderi Master Weaver" },
      { type: "heading", text: "The Economics of Slowness" },
      { type: "text", text: "The greatest threat to Chanderi weaving is not competition from machine-made imitations but the impossibility of scaling the economics. A genuine handloom Chanderi sari of complex design costs upward of Rs. 15,000. The 28 master weavers who remain practice their art partly as vocation, partly as act of faith that the market will eventually recognise authenticity." },
    ],
  },
  {
    id: "5",
    title: "Bagh Print: Colors from the River",
    category: "Technique",
    excerpt: "The painstaking 16-step natural dyeing process that gives Bagh textiles their distinctive red and black hues.",
    readTime: "7 min",
    image: "bagh",
    author: "Fatima Khan",
    date: "September 2025",
    content: [
      { type: "intro", text: "The Bagh river in Madhya Pradesh's Dhar district gives its name to one of India's most technically demanding textile crafts. Bagh print — bold geometric patterns in deep red and black stamped onto natural fabric using hand-carved teak blocks — is the product of a 16-step process that takes weeks and requires the specific mineral properties of the Bagh river water. Move the workshop fifty kilometres and the colours change." },
      { type: "heading", text: "The 16 Steps" },
      { type: "text", text: "The process begins with degumming the fabric in a solution of castor oil and soda ash — a process called 'harada' that takes three days. The cloth is then treated with a mordant of myrobalan tannin, which prepares the fibres to bond with natural dyes. Printing follows: hand-carved teak blocks are pressed onto the fabric in careful alignment, a process requiring years of practice to master the pressure and angle that produces a clean print without bleeding." },
      { type: "text", text: "Dyeing uses alizarin from the madder plant for red and iron rust solution for black — both natural compounds that react with the mordanted fabric to produce colours of extraordinary permanence. A Bagh-printed fabric washed a hundred times will hold its colour better than most synthetic dyes. The final steps involve washing in the Bagh river, whose specific mineral content brightens and fixes the colours." },
      { type: "quote", text: "My family has printed with these blocks for 400 years. The river has washed every piece we have ever made. We are not separate from this place.", author: "Abdul Rashid Khan, Bagh Print Master" },
      { type: "heading", text: "GI Tag and Its Limits" },
      { type: "text", text: "Bagh print received a Geographical Indication tag in 2008, theoretically protecting it from imitation. In practice, machine-printed copies labelled 'Bagh-inspired' flood e-commerce platforms at a tenth of the price. The 22 remaining Bagh print masters argue that what is needed is not legal protection but education — buyers who understand what they are looking at." },
    ],
  },
  {
    id: "6",
    title: "Bandhani: Knots of Celebration",
    category: "Tradition",
    excerpt: "Why the number and pattern of tie-dye dots carry deep social meaning in Rajasthani marriage customs.",
    readTime: "5 min",
    image: "bandhani",
    author: "Sunita Rawat",
    date: "August 2025",
    content: [
      { type: "intro", text: "In Rajasthan, a bride's odhni is not merely a garment — it is a coded document. The colour, the pattern, the number and arrangement of the tiny pinched dots that create Bandhani's signature spotted texture: each element communicates the bride's community, her family's status, and the auspiciousness of the occasion. A master Bandhani artisan is simultaneously a textile craftsperson and a social historian." },
      { type: "heading", text: "The Art of the Knot" },
      { type: "text", text: "Bandhani — from 'bandhna,' to tie — is a resist-dyeing technique in which fabric is pinched into tiny points and tied with thread before dyeing. Where the thread binds, the dye cannot penetrate, creating patterns of undyed dots on a coloured ground. The finest Bandhani work involves thousands of these tiny knots per square inch, tied so small that they require a fingernail or a pointed instrument to gather the fabric." },
      { type: "heading", text: "Reading the Dots" },
      { type: "text", text: "The social semiotics of Bandhani are complex. A pattern called 'Chandrakala' — a dark background with widely spaced dots — is traditionally given to a bride on her wedding day. 'Bavan Baug' (52 gardens) is reserved for auspicious occasions. Specific colour combinations indicate caste and regional identity: certain reds are for Rajput brides, certain yellows for merchant families. A knowledgeable observer could read a woman's entire social biography from her Bandhani odhni." },
      { type: "quote", text: "My fingers have tied ten million knots. Each one is a small prayer for the woman who will wear it.", author: "Fatima Begum, Bandhani Master, Jodhpur" },
      { type: "heading", text: "Contemporary Challenges" },
      { type: "text", text: "Machine-made Bandhani — where dots are printed rather than tied — now dominates the market. The difference becomes apparent over time: hand-tied Bandhani develops a characteristic three-dimensional texture as the dots relax, while printed imitations remain flat. Fatima Begum and her workshop in Jodhpur represent one of the last centres producing truly hand-tied Bandhani at scale." },
    ],
  },
];

type Article = typeof fullArticles[0];

const ArticleView = ({ article, onClose }: { article: Article; onClose: () => void }) => {
  const img = getCraftImage(article.image);
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-parchment overflow-y-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Archive
        </button>

        <div className="w-full h-64 md:h-80 overflow-hidden rounded-sm mb-8">
          <img src={img} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="seal-badge text-[9px]">{article.category}</span>
          <span className="font-body text-xs flex items-center gap-1" style={{ color: "hsl(28 20% 45%)" }}>
            <Clock size={11} /> {article.readTime} read
          </span>
          <span className="font-body text-xs text-muted-foreground">{article.date}</span>
          <span className="font-body text-xs text-muted-foreground">By {article.author}</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-heritage-heading mb-4">{article.title}</h1>
        <div className="gold-divider !mx-0 mb-8" />

        <div className="space-y-6">
          {article.content.map((block, i) => {
            if (block.type === "intro") {
              return (
                <p key={i} className="font-body text-base text-heritage-heading leading-relaxed font-medium border-l-2 border-gold pl-4">
                  {block.text}
                </p>
              );
            }
            if (block.type === "heading") {
              return (
                <h2 key={i} className="font-display text-xl text-heritage-heading mt-8">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "text") {
              return (
                <p key={i} className="font-body text-sm text-muted-foreground leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === "quote") {
              return (
                <div key={i} className="bg-sandstone border border-gold px-6 py-5 my-6">
                  <p className="font-display text-lg italic mb-3 dark:text-white text-heritage-heading">"{block.text}"</p>
                  <p className="font-body text-xs text-gold">— {block.author}</p>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="gold-divider mt-12 mb-6" />
        <button onClick={onClose} className="btn-secondary text-sm">
          Back to Archive
        </button>
      </div>
    </motion.div>
  );
};

const Archive = () => {
  const [search, setSearch] = useState("");
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const filtered = fullArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );
  const endangered = crafts.filter((c) => c.endangered);
  const { creamBg } = useBackground();

  return (
    <>
      <AnimatePresence>
        {openArticle && (
          <ArticleView
            article={openArticle}
            onClose={() => setOpenArticle(null)}
          />
        )}
      </AnimatePresence>

      <div
        style={creamBg}
      >
        <div className="section-spacing">
          <div className="container-heritage">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-3xl md:text-4xl text-heritage-heading mb-2">
                Heritage Archive
              </h1>
              <div className="gold-divider !mx-0 mb-8" />
            </motion.div>

            <div className="relative mb-10 max-w-lg">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the archive..."
                className="w-full bg-sandstone border border-gold pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-heritage-gold"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((article, idx) => {
                  const img = getCraftImage(article.image);
                  return (
                    <motion.div
                      key={article.id}
                      className="overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all duration-300"
                      style={{
                        borderRadius: "20px",
                        background:
                          "linear-gradient(160deg, hsl(40 55% 93%) 0%, hsl(35 38% 87%) 55%, hsl(38 48% 91%) 100%)",
                        boxShadow:
                          "0 8px 32px hsl(20 40% 18% / 0.15), 0 2px 8px hsl(20 40% 18% / 0.08), inset 0 1px 0 hsl(46 100% 72% / 0.45)",
                        border: "1px solid hsl(46 55% 70% / 0.65)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setOpenArticle(article)}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{
                          borderRadius: "20px 20px 0 0",
                          height: "190px",
                        }}
                      >
                        <img
                          src={img}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{
                            filter:
                              "sepia(20%) saturate(115%) brightness(0.9) contrast(1.05)",
                          }}
                        />
                        {/* Warm vignette + bottom fade */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to bottom, hsl(33 70% 45% / 0.07) 0%, transparent 30%, hsl(20 40% 8% / 0.42) 100%)",
                          }}
                        />
                        {/* Decorative inset gold frame */}
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            inset: "8px",
                            borderRadius: "12px",
                            border: "1px solid hsl(46 100% 68% / 0.32)",
                            boxShadow: "inset 0 0 0 1px hsl(20 40% 8% / 0.1)",
                          }}
                        />
                        {/* Category badge over image */}
                        <div className="absolute bottom-3 left-4">
                          <span className="seal-badge text-[9px]">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="px-5 pt-4 pb-5">
                        <div
                          className="mb-3"
                          style={{
                            height: "1px",
                            background:
                              "linear-gradient(to right, transparent, hsl(46 100% 50% / 0.7) 30%, hsl(46 100% 50% / 0.7) 70%, transparent)",
                          }}
                        />
                        <h3 className="font-display text-base mb-2 leading-snug" style={{ color: "hsl(20 40% 18%)" }}>
                          {article.title}
                        </h3>
                        <p className="font-body text-sm mb-4 leading-relaxed line-clamp-2" style={{ color: "hsl(28 20% 45%)" }}>
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-xs flex items-center gap-1" style={{ color: "hsl(28 20% 45%)" }}>
                            <Clock size={11} /> {article.readTime} read
                          </span>
                          <span className="text-gold flex items-center gap-1 text-sm font-body group-hover:gap-2 transition-all">
                            Read <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filtered.length === 0 && (
                  <p className="font-body text-muted-foreground py-12 col-span-2 text-center">
                    No articles found.
                  </p>
                )}
              </div>

              <aside className="space-y-6">
                <div
                  style={{
                    borderRadius: "18px",
                    background:
                      "linear-gradient(150deg, hsl(40 55% 93%) 0%, hsl(35 38% 87%) 100%)",
                    border: "1px solid hsl(46 55% 70% / 0.65)",
                    boxShadow:
                      "0 6px 24px hsl(20 40% 18% / 0.12), inset 0 1px 0 hsl(46 100% 72% / 0.4)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "3px",
                      background:
                        "linear-gradient(to right, hsl(15 50% 22%), hsl(46 100% 50%), hsl(15 50% 22%))",
                    }}
                  />
                  <div className="p-5">
                    <h3 className="font-display text-sm uppercase tracking-[2px] mb-4 flex items-center gap-2" style={{ color: "hsl(20 40% 18%)" }}>
                      <AlertTriangle size={14} className="text-deep-maroon" />{" "}
                      Most Endangered
                    </h3>
                    <ul className="space-y-3">
                      {endangered.map((c, i) => (
                        <li
                          key={c.id}
                          className="flex items-center justify-between font-body text-sm"
                          style={{
                            paddingBottom:
                              i < endangered.length - 1 ? "10px" : 0,
                            borderBottom:
                              i < endangered.length - 1
                                ? "1px solid hsl(46 100% 50% / 0.18)"
                                : "none",
                          }}
                        >
                          <span style={{ color: "hsl(20 40% 18%)" }}>{c.name}</span>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 10px",
                              background: "hsl(15 50% 22% / 0.08)",
                              border: "1px solid hsl(15 50% 22% / 0.22)",
                              borderRadius: "999px",
                              color: "hsl(15 50% 26%)",
                            }}
                          >
                            {c.artisanCount} left
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-primary p-6 text-center">
                  <h3 className="font-display text-lg text-gold mb-2">
                    Contribute to the Legacy
                  </h3>
                  <p className="font-body text-sm text-primary-foreground opacity-80 mb-4">
                    Help document and preserve disappearing craft traditions.
                  </p>
                  <button className="btn-secondary border-gold text-gold text-xs">
                    Get Involved
                  </button>
                </div>

                <div
                  className="overflow-hidden group cursor-pointer"
                  style={{
                    borderRadius: "18px",
                    background:
                      "linear-gradient(160deg, hsl(40 55% 93%) 0%, hsl(35 38% 87%) 100%)",
                    border: "1px solid hsl(46 55% 70% / 0.65)",
                    boxShadow:
                      "0 6px 24px hsl(20 40% 18% / 0.12), inset 0 1px 0 hsl(46 100% 72% / 0.4)",
                  }}
                  onClick={() => setOpenArticle(fullArticles[3])}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ borderRadius: "18px 18px 0 0", height: "130px" }}
                  >
                    <img
                      src={getCraftImage("chanderi")}
                      alt="Featured"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        filter:
                          "sepia(20%) saturate(115%) brightness(0.9) contrast(1.05)",
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 30%, hsl(20 40% 8% / 0.45) 100%)",
                      }}
                    />
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        inset: "6px",
                        borderRadius: "10px",
                        border: "1px solid hsl(46 100% 68% / 0.28)",
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div
                      className="mb-3"
                      style={{
                        height: "1px",
                        background:
                          "linear-gradient(to right, transparent, hsl(46 100% 50% / 0.65) 40%, hsl(46 100% 50% / 0.65) 60%, transparent)",
                      }}
                    />
                    <p className="font-display text-xs uppercase tracking-[2px] text-gold mb-1">
                      Editor's Pick
                    </p>
                    <p className="font-display text-sm leading-snug mb-3" style={{ color: "hsl(20 40% 18%)" }}>
                      The Chanderi Weaver's Loom
                    </p>
                    <button className="font-body text-xs text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read now <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Archive;
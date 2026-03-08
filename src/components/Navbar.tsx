import { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, Search, ChevronDown, Globe, Moon, Sun, User, BookOpen, Map, Palette } from "lucide-react";
import { craftsmen } from "@/data/craftsmen";
import { crafts } from "@/data/crafts";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import GooeyNav from "@/components/effects/GooeyNav";
import { useLanguage } from "@/contexts/languageContext";
import { languages } from "@/i18n/translations";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useDarkMode } from "@/hooks/useDarkMode";

type SuggestionKind = "artisan" | "craft" | "region" | "page";
interface Suggestion {
  kind: SuggestionKind;
  label: string;
  sublabel?: string;
  path: string;
}

const STATIC_PAGES: Suggestion[] = [
  {
    kind: "page",
    label: "Discover Artisans",
    sublabel: "Browse all artisans",
    path: "/discover",
  },
  {
    kind: "page",
    label: "Kalakendra",
    sublabel: "Craft news & events",
    path: "/kalakendra",
  },
  {
    kind: "page",
    label: "Heritage Archive",
    sublabel: "Articles & research",
    path: "/archive",
  },
  {
    kind: "page",
    label: "Join as Karigarh",
    sublabel: "Register as an artisan",
    path: "/join",
  },
];

const REGIONS: Suggestion[] = [
  {
    kind: "region",
    label: "Rajasthan",
    sublabel: "Region",
    path: "/region/Rajasthan",
  },
  {
    kind: "region",
    label: "Madhya Pradesh",
    sublabel: "Region",
    path: "/region/Madhya%20Pradesh",
  },
];

const kindIcon: Record<SuggestionKind, React.ReactNode> = {
  artisan: <User size={11} />,
  craft: <Palette size={11} />,
  region: <Map size={11} />,
  page: <BookOpen size={11} />,
};
const kindLabel: Record<SuggestionKind, string> = {
  artisan: "Artisan",
  craft: "Craft",
  region: "Region",
  page: "Page",
};

const Navbar = () => {
  const { isDark, toggle } = useDarkMode();
  const { t, lang, setLang } = useLanguage();
  const { user, welcomeName } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutAnim, setShowLogoutAnim] = useState(false);
  const [userName, setUserName] = useState("");
  const firstName = (userName || user?.displayName || "User").split(" ")[0];
  const [isKarigar, setIsKarigar] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [firestoreArtisans, setFirestoreArtisans] = useState<Suggestion[]>([]);

  useEffect(() => {
    getDocs(
      query(collection(db, "craftsmen"), where("status", "==", "approved")),
    ).then((snap) => {
      const results: Suggestion[] = snap.docs
        .map((d) => {
          const data = d.data();
          const name = data.personal?.profileName || data.personal?.name || "";
          const craft = data.craft?.craftForm || data.craft?.craftCustom || "";
          const location = data.personal?.city || data.personal?.village || "";
          return {
            kind: "artisan" as SuggestionKind,
            label: name,
            sublabel: `${craft} · ${location}`,
            path: `/craftsman/${d.id}`,
          };
        })
        .filter((s) => s.label);
      setFirestoreArtisans(results);
    });
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const regionsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.openLogin) {
      setLoginOpen(true);
    }
  }, [location]);

  const logout = async () => {
    setLoggingOut(true);
    setShowLogoutAnim(true);
    await new Promise((res) => setTimeout(res, 1800));
    await signOut(auth);
    setLoggingOut(false);
    await new Promise((res) => setTimeout(res, 600));
    setShowLogoutAnim(false);
  };

  useEffect(() => {
    if (!user) {
      setUserName("");
      setIsKarigar(false);
      return;
    }
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setUserName(snap.data().name);
    });
    getDocs(
      query(collection(db, "craftsmen"), where("userId", "==", user.uid)),
    ).then((snap) => {
      setIsKarigar(!snap.empty);
    });
  }, [user]);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginOpen(true);
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!location.pathname.startsWith("/region/")) setSelectedRegion("");
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        regionsOpen &&
        regionsRef.current &&
        !regionsRef.current.contains(e.target as Node)
      )
        setRegionsOpen(false);
      if (
        langOpen &&
        langRef.current &&
        !langRef.current.contains(e.target as Node)
      )
        setLangOpen(false);
      if (
        showSuggestions &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      )
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [regionsOpen, langOpen, showSuggestions]);

  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    const allCrafts: Suggestion[] = crafts.map((c: any) => ({
      kind: "craft" as SuggestionKind,
      label: c.name || c,
      sublabel: "Craft",
      path: `/discover?craft=${encodeURIComponent(c.name || c)}`,
    }));

    return [...STATIC_PAGES, ...REGIONS, ...allCrafts, ...firestoreArtisans]
      .filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.sublabel?.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 8);
  }, [searchQuery, firestoreArtisans]);

  const handleSuggestionClick = (s: Suggestion) => {
    navigate(s.path);
    setSearchQuery("");
    setShowSuggestions(false);
  };
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const regionGroups = [{ label: "Rajasthan" }, { label: "Madhya Pradesh" }];

  // ── Kalakendra removed from navGroups (moved to Footer) ───────────────────
  const navGroups = [
    {
      label: t.nav.regions,
      items: regionGroups.map((g) => ({
        name: g.label,
        path: `/region/${encodeURIComponent(g.label)}`,
      })),
    },
    {
      label: t.nav.explore,
      items: [
        { name: t.nav.discover, path: "/discover" },
        { name: t.nav.archive, path: "/archive" },
      ],
    },
  ];

  // ── Single declaration of gooeyItems ──────────────────────────────────────
  const gooeyItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.archive, href: "/archive" },
    { label: t.nav.discover, href: "/discover" },
  ];

  const activeIdx = gooeyItems.findIndex(
    (item) => item.href === location.pathname,
  );

  return (
    <>
      {/* Logout Overlay */}
      <AnimatePresence>
        {showLogoutAnim && (
          <motion.div
            key="logout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, hsl(20 40% 8%), hsl(22 60% 12%))",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <img
                src={logo}
                alt="Karigarh"
                className="w-16 h-16 rounded-full object-cover opacity-80"
              />
              <p className="font-display text-sm uppercase tracking-[3px] text-parchment/80">
                Logging out…
              </p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#e8740e]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-50 bg-sandstone/95 backdrop-blur-sm border-b border-gold/40">
        <motion.div
          className="container-heritage"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex items-center justify-between py-3">
            {/* LEFT: Logo + GooeyNav */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center flex-shrink-0">
                <img
                  src={logo}
                  alt="Karigarh"
                  className="h-14 w-14 object-cover rounded-full"
                />
              </Link>

              <div className="hidden md:block">
                <GooeyNav
                  key={`${location.pathname}-${lang}`}
                  items={gooeyItems}
                  initialActiveIndex={activeIdx}
                  animationTime={600}
                  particleCount={12}
                  particleDistances={[70, 10]}
                  particleR={80}
                  colors={[1, 2, 3, 4]}
                  onItemClick={(href) => navigate(href)}
                />
              </div>
            </div>

            {/* CENTER: Regions | Search | Language */}
            <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {/* Regions */}
              <div ref={regionsRef} className="relative">
                <button
                  onClick={() => setRegionsOpen(!regionsOpen)}
                  className={`flex items-center gap-1 font-display text-sm uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${
                    isDark ? "text-white" : "text-heritage-heading"
                  }`}
                >
                  {selectedRegion || t.nav.regions}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${regionsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {regionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-sandstone border border-gold/40 shadow-xl z-10 py-2 flex flex-col"
                    >
                      {regionGroups.map((group) => (
                        <Link
                          key={group.label}
                          to={`/region/${encodeURIComponent(group.label)}`}
                          onClick={() => {
                            setSelectedRegion(group.label);
                            setRegionsOpen(false);
                          }}
                          className="font-display text-sm uppercase tracking-[1.5px] text-heritage-heading hover:text-heritage-gold hover:bg-parchment/50 px-5 py-3 transition-colors border-b border-gold/20 last:border-0"
                        >
                          {group.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search */}
              <div ref={searchRef} className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-heading/40"
                />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder={t.nav.searchPlaceholder}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                    if (e.key === "Escape") setShowSuggestions(false);
                  }}
                  className={`pl-9 pr-4 py-1.5 font-body text-sm border border-gold/30 bg-transparent focus:outline-none focus:border-gold/60 w-48 transition-all focus:w-64 placeholder:text-heritage-heading/40 ${
                    isDark ? "text-white" : "text-heritage-heading"
                  }`}
                />
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute top-full left-0 mt-1 w-72 bg-sandstone border border-gold/40 shadow-xl z-20 py-1"
                    >
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-parchment/60 transition-colors text-left"
                        >
                          <span className="text-heritage-gold/70 flex-shrink-0">
                            {kindIcon[s.kind]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-xs text-heritage-heading truncate">
                              {s.label}
                            </p>
                            {s.sublabel && (
                              <p className="font-body text-[10px] text-muted-foreground truncate">
                                {s.sublabel}
                              </p>
                            )}
                          </div>
                          <span className="font-body text-[9px] uppercase tracking-[1px] text-muted-foreground/60 flex-shrink-0">
                            {kindLabel[s.kind]}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1 font-display text-sm uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${
                    isDark ? "text-white" : "text-heritage-heading"
                  }`}
                >
                  <Globe size={14} />
                  {lang.toUpperCase()}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-sandstone border border-gold/40 shadow-xl z-10 py-2"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setLang(language.code as any);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 font-body text-sm transition-colors hover:bg-parchment/50 ${
                            lang === language.code
                              ? "text-heritage-gold ring-2 ring-heritage-gold"
                              : "text-heritage-heading"
                          }`}
                        >
                          <span>{language.name}</span>
                          {lang === language.code && (
                            <span className="text-heritage-gold">&#10003;</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Auth only (Kalakendra moved to Footer) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {!isKarigar && (
                      <Link
                        to="/my-bookings"
                        className={`px-3 py-0 text-sm font-display uppercase tracking-[1px] hover:text-heritage-gold transition-colors ${
                          isDark ? "text-white" : "text-heritage-heading"
                        }`}
                      >
                        My Bookings
                      </Link>
                    )}

                    {isKarigar ? (
                      <Link
                        to="/karigar-profile"
                        className={`text-sm font-display uppercase tracking-[1px] hover:text-gold transition-colors underline-offset-2 hover:underline ${
                          isDark ? "text-white" : "text-heritage-heading"
                        }`}
                        title="View your karigar profile"
                      >
                        {firstName}
                      </Link>
                    ) : (
                      <span
                        className={`text-sm font-display uppercase tracking-[1px] ${
                          isDark ? "text-white" : "text-heritage-heading"
                        }`}
                      >
                        {firstName}
                      </span>
                    )}

                    <button
                      onClick={logout}
                      disabled={loggingOut}
                      className="px-3 py-1.5 text-sm rounded-3xl font-display uppercase tracking-[1px] border border-gold/40 hover:text-heritage-gold hover:border-gold transition-colors disabled:opacity-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setLoginOpen(true)}
                      className={`px-3 py-1.5 text-sm rounded-3xl font-display uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${
                        isDark ? "text-white" : "text-heritage-heading"
                      }`}
                    >
                      {t.nav.login}
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className={`px-3 py-1.5 text-sm rounded-3xl font-display uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${
                        isDark ? "text-white" : "text-heritage-heading"
                      }`}
                    >
                      {t.nav.signUp}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className={`p-2 transition-colors hover:text-heritage-gold ${
                  isDark ? "text-white" : "text-heritage-heading"
                }`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-royal-brown"
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gold/30 overflow-hidden bg-sandstone"
            >
              {navGroups.map((group) => (
                <div key={group.label} className="p-4 border-b border-gold/20">
                  <p className="font-display text-xs uppercase tracking-[1.5px] text-heritage-gold mb-2">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className="block font-body text-sm text-heritage-heading py-1.5 hover:text-heritage-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="p-4 border-b border-gold/20">
                <h3 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-3">
                  Language
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLang(language.code as any);
                        setOpen(false);
                      }}
                      className={`px-3 py-1 font-body text-xs border transition-colors ${
                        lang === language.code
                          ? "border-gold bg-gold/10 text-heritage-gold"
                          : "border-gold/30 text-heritage-heading"
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile auth */}
              <div className="p-4">
                {user ? (
                  <div className="space-y-2">
                    <p className="font-body text-sm text-heritage-heading">
                      Welcome,{" "}
                      {isKarigar ? (
                        <Link
                          to="/karigar-profile"
                          className="font-semibold text-gold hover:underline"
                          onClick={() => setOpen(false)}
                          title="View your karigar profile"
                        >
                          {firstName}
                        </Link>
                      ) : (
                        <span className="font-semibold">{firstName}</span>
                      )}
                    </p>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="btn-primary text-center text-xs py-2 rounded-3xl w-full"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLoginOpen(true);
                        setOpen(false);
                      }}
                      className="flex-1 py-2 font-display text-xs uppercase tracking-[1px] border border-gold/40 text-heritage-heading hover:text-heritage-gold transition-colors"
                    >
                      {t.nav.login}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setOpen(false);
                      }}
                      className="flex-1 py-2 font-display text-xs uppercase tracking-[1px] border border-gold/40 text-heritage-heading hover:text-heritage-gold transition-colors"
                    >
                      {t.nav.signUp}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        message={location.state?.message}
      />
    </>
  );
};

export default Navbar;
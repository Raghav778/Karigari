import { useState, useEffect, useRef, useMemo } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Globe,
  Moon,
  Sun,
  User,
  BookOpen,
  Map,
  Palette,
} from "lucide-react";
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
  const [isKarigar, setIsKarigar] = useState(false); // ← NEW
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
    query(collection(db, "craftsmen"), where("status", "==", "approved"))
  ).then((snap) => {
    const results: Suggestion[] = snap.docs.map((d) => {
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
    }).filter((s) => s.label); // skip entries with no name
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

  // ── Fetch user name + check if karigar ──────────────────────────────────
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

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Suggestion[] = [];
    craftsmen.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.craft.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      )
        results.push({
          kind: "artisan",
          label: c.name,
          sublabel: `${c.craft} · ${c.location}`,
          path: `/craftsman/${c.id}`,
        });
    });
      firestoreArtisans.forEach((s) => {
    if (
      s.label.toLowerCase().includes(q) ||
      (s.sublabel || "").toLowerCase().includes(q)
    )
      results.push(s);
  });
    crafts.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      )
        results.push({
          kind: "craft",
          label: c.name,
          sublabel: `${c.category} · ${c.region}`,
          path: `/discover?craft=${c.id}`,
        });
    });
    REGIONS.forEach((r) => {
      if (r.label.toLowerCase().includes(q)) results.push(r);
    });
    STATIC_PAGES.forEach((p) => {
      if (p.label.toLowerCase().includes(q)) results.push(p);
    });
    return results
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
                "linear-gradient(135deg, hsl(20 40% 8%), hsl(22 60% 12%), hsl(20 40% 8%))",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(38 80% 40% / 0.15) 0%, transparent 70%)",
              }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(38 80% 55%), transparent)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="mb-6"
            >
              <img
                src={logo}
                alt="Karigarh"
                className="w-20 h-20 object-cover rounded-full ring-2 ring-gold/40"
                style={{
                  filter: "drop-shadow(0 0 18px hsl(38 80% 55% / 0.5))",
                }}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="font-display text-xl uppercase tracking-[4px] text-parchment mb-2"
            >
              Until Next Time
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-24 h-[1px] mb-4"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(38 80% 55%), transparent)",
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-body text-xs uppercase tracking-[3px] opacity-50 text-parchment"
            >
              Signing out...
            </motion.p>
            <motion.div
              className="absolute bottom-0 left-0 h-[3px]"
              style={{
                background:
                  "linear-gradient(90deg, hsl(22 100% 50%), hsl(38 80% 55%))",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Toast */}
      <AnimatePresence>
        {welcomeName && (
          <motion.div
            key="welcome-toast"
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -48 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed top-20 left-0 right-0 z-[300] flex justify-center pointer-events-none"
          >
            <div className="flex items-center gap-2.5 bg-sandstone border border-[#e8740e]/60 shadow-lg px-5 py-2.5 rounded-full pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-[#e8740e] flex-shrink-0" />
              <p className="font-display text-sm uppercase tracking-[1.5px] text-heritage-heading">
                Welcome, <span className="text-[#e8740e]">{welcomeName}</span>
              </p>
              <span className="w-2 h-2 rounded-full bg-[#e8740e] flex-shrink-0" />
            </div>
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
                  className={`flex items-center gap-1 font-display text-sm uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${isDark ? "text-white" : "text-heritage-heading"}`}
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
                  onFocus={() => {
                    if (searchQuery) setShowSuggestions(true);
                  }}
                  className="pl-8 pr-4 py-1.5 text-sm font-body bg-white/60 border border-gold/40 text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-heritage-gold w-44 transition-all rounded-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                    if (e.key === "Escape") {
                      setShowSuggestions(false);
                      setSearchQuery("");
                    }
                  }}
                />
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-72 bg-sandstone border border-gold/50 shadow-2xl z-50 overflow-hidden rounded-lg"
                    >
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-parchment transition-colors border-b border-gold/10 last:border-0 group"
                        >
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#e8740e]/15 text-[#e8740e] group-hover:bg-[#e8740e]/25 transition-colors">
                            {kindIcon[s.kind]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-heritage-heading truncate leading-tight">
                              {s.label}
                            </p>
                            {s.sublabel && (
                              <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
                                {s.sublabel}
                              </p>
                            )}
                          </div>
                          <span className="flex-shrink-0 font-display text-[9px] uppercase tracking-[1px] text-[#e8740e]/70 group-hover:text-[#e8740e] transition-colors">
                            {kindLabel[s.kind]}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-parchment/60 hover:bg-parchment transition-colors border-t border-gold/20"
                      >
                        <Search size={12} className="text-[#e8740e]" />
                        <span className="font-body text-xs text-heritage-heading/70">
                          Search all for{" "}
                          <span className="text-[#e8740e] font-medium">
                            "{searchQuery}"
                          </span>
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Language */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1 font-display text-xs uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${isDark ? "text-white/80" : "text-heritage-heading/70"}`}
                >
                  <Globe size={14} />
                  {lang.toUpperCase()}
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
                          className={`w-full px-4 py-2 text-left font-body text-sm text-heritage-heading hover:bg-parchment transition-colors flex items-center justify-between ${lang === language.code ? "ring-2 ring-heritage-gold" : ""}`}
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

            {/* RIGHT: Auth */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {/* ── Karigar-aware name display ───────────── */}
                    {!isKarigar && (
                      <Link
                        to="/my-bookings"
                        className={`px-3 py-0 text-sm font-display uppercase tracking-[1px] hover:text-heritage-gold transition-colors ${isDark ? "text-white" : "text-heritage-heading"}`}
                      >
                        My Bookings
                      </Link>
                    )}
                    
                    {isKarigar ? (
                      <Link
                        to="/karigar-profile"
                        className={`text-sm font-display uppercase tracking-[1px] hover:text-gold transition-colors underline-offset-2 hover:underline ${isDark ? "text-white" : "text-heritage-heading"}`}
                        title="View your karigar profile"
                      >
                        {firstName}
                      </Link>
                    ) : (
                      <span
                        className={`text-sm font-display uppercase tracking-[1px] ${isDark ? "text-white" : "text-heritage-heading"}`}
                      >
                        {firstName}
                      </span>
                    )}

                    <button
                      onClick={logout}
                      disabled={loggingOut}
                      className={`px-3 py-0 text-sm rounded-3xl font-display uppercase tracking-[1px] hover:text-heritage-gold transition-colors flex items-center gap-1.5 disabled:opacity-60 ${isDark ? "text-white" : "text-heritage-heading"}`}
                    >
                      {loggingOut ? (
                        <>
                          <svg
                            className="animate-spin h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Signing out...
                        </>
                      ) : (
                        "Logout"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setLoginOpen(true)}
                      className={`px-3 py-1.5 text-sm rounded-3xl font-display uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${isDark ? "text-white" : "text-heritage-heading"}`}
                    >
                      {t.nav.login}
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className={`px-3 py-1.5 text-sm rounded-3xl font-display uppercase tracking-[1px] transition-colors hover:text-heritage-gold ${isDark ? "text-white" : "text-heritage-heading"}`}
                    >
                      {t.nav.signUp}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className={`p-2 transition-colors hover:text-heritage-gold ${isDark ? "text-white" : "text-heritage-heading"}`}
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
                      className={`px-3 py-1 font-body text-xs border transition-colors ${lang === language.code ? "border-heritage-gold text-heritage-gold" : "border-gold/40 text-heritage-heading/70"}`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-b border-gold/20 flex items-center justify-between">
                <h3 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading">
                  Appearance
                </h3>
                <button
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="p-2 text-heritage-heading hover:text-heritage-gold transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              {!user ? (
                <div className="bg-sandstone p-4 border border-gold">
                  <h3 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-3">
                    Account
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        setLoginOpen(true);
                      }}
                      className="btn-primary text-center text-xs py-2 rounded-3xl"
                    >
                      {t.nav.login}
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/signup");
                      }}
                      className="btn-primary text-center text-xs py-2 rounded-3xl"
                    >
                      {t.nav.signUp}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-sandstone p-4 border border-gold">
                  {/* ── Karigar-aware mobile name ──────────────── */}
                  <p className="font-body text-sm text-heritage-heading mb-2">
                    Signed in as{" "}
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
                      <span className="font-semibold">
                        {firstName}
                      </span>
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
              )}
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
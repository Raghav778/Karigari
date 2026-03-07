import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { crafts } from "@/data/crafts";
import {
  craftsmen,
  mapFirestoreKarigarToCraftsman,
  type Craftsman,
} from "@/data/craftsmen";
import CraftsmanCard from "@/components/CraftsmanCard";
import {
  X,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useBackground } from "@/hooks/useBackground";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const regions = ["All", "Rajasthan", "Madhya Pradesh"] as const;

const Discover = () => {
  const [regionFilter, setRegionFilter] = useState<string>("All");
  // craftFilter stores the craft NAME string (e.g. "Blue Pottery"), not an ID
  const [craftFilter, setCraftFilter] = useState<string>("All");

  const [filterOpen, setFilterOpen] = useState(false);

  const { creamBg } = useBackground();

  // ── Firestore approved karigar ──────────────────────────────────────────
  const [firestoreArtisans, setFirestoreArtisans] = useState<typeof craftsmen>(
    [],
  );
  const [firestoreCraftsmen, setFirestoreCraftsmen] = useState<Craftsman[]>([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "craftsmen"), where("status", "==", "approved")),
        );

        // Map to lightweight artisan objects
        const artisans = snap.docs
          .map((d) => {
            const data = d.data();
            const craftName =
              data.craft?.craftForm === "Other (specify below)"
                ? data.craft?.craftCustom || ""
                : data.craft?.craftForm || data.craft?.craftCustom || "";
            return {
              id: d.id,
              name: data.personal?.profileName || data.personal?.name || "",
              craft: craftName,
              region: data.craft?.region || "",
              location: data.personal?.city || data.personal?.village || "",
              experience: data.craft?.experience || "",
              image: "default",
              story: data.description || "",
              materials: data.materials || [],
              endangered: false,
              pricePerHour: parseInt(data.craft?.priceRange) || 0,
              rating: 4.5,
              specialties: data.specialties || [],
            };
          })
          .filter((a) => a.name);
        setFirestoreArtisans(artisans as any);

        // Also map to full Craftsman objects
        const docs = snap.docs.map((d) =>
          mapFirestoreKarigarToCraftsman(d.id, d.data()),
        );
        setFirestoreCraftsmen(docs);
      } catch (err) {
        console.error("Failed to load approved karigar:", err);
      }
    };
    fetchApproved();
  }, []);

  // ── Merge static + Firestore, no duplicates ─────────────────────────────
  const allCraftsmen: Craftsman[] = [
    ...craftsmen,
    ...firestoreCraftsmen.filter(
      (fc) => !craftsmen.some((sc) => sc.id === fc.id),
    ),
  ];

  // ── Build dynamic craft list ─────────────────────────────────────────────
  // Static craft entries (name + region for region-based narrowing)
  const staticCraftEntries = useMemo(
    () => crafts.map((c) => ({ name: c.name, region: c.region })),
    [],
  );

  // All craft names coming from approved Firestore karigar
  const firestoreCraftNames = useMemo(
    () =>
      firestoreArtisans.map((a) => (a as any).craft as string).filter(Boolean),
    [firestoreArtisans],
  );

  // Unified deduplicated list: static first, then any NEW names from Firestore
  const allCraftEntries = useMemo(() => {
    const seen = new Set(staticCraftEntries.map((e) => e.name.toLowerCase()));
    const extra: { name: string; region: string }[] = [];
    for (const name of firestoreCraftNames) {
      if (!seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        const artisan = firestoreArtisans.find(
          (a) => (a as any).craft?.toLowerCase() === name.toLowerCase(),
        );
        extra.push({ name, region: (artisan as any)?.region || "" });
      }
    }
    return [...staticCraftEntries, ...extra];
  }, [staticCraftEntries, firestoreCraftNames, firestoreArtisans]);

  // ── URL param sync ──────────────────────────────────────────────────────
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const r = params.get("region");
    if (r && regions.includes(r as any)) setRegionFilter(r);
    else setRegionFilter("All");

    const craftParam = params.get("craft");
    if (craftParam) {
      // Support legacy ID-based params and new name-based params
      const byId = crafts.find((c) => c.id === craftParam);
      const byName = allCraftEntries.find(
        (c) => c.name.toLowerCase() === craftParam.toLowerCase(),
      );
      if (byId) setCraftFilter(byId.name);
      else if (byName) setCraftFilter(byName.name);
      else setCraftFilter("All");
    } else {
      setCraftFilter("All");
    }
  }, [location.search, allCraftEntries]);

  // ── Region change ────────────────────────────────────────────────────────
  const handleRegionChange = (r: string) => {
    setRegionFilter(r);
    if (craftFilter !== "All") {
      const entry = allCraftEntries.find(
        (c) => c.name.toLowerCase() === craftFilter.toLowerCase(),
      );
      if (entry?.region && r !== "All" && entry.region !== r) {
        setCraftFilter("All");
      }
    }
  };

  // Crafts visible for the current region (show all if no region or region matches)
  const visibleCraftEntries = useMemo(() => {
    if (regionFilter === "All") return allCraftEntries;
    return allCraftEntries.filter(
      (c) => !c.region || c.region === regionFilter,
    );
  }, [allCraftEntries, regionFilter]);

  const activeCraftName = craftFilter !== "All" ? craftFilter : null;

  // ── Artisan filtering ────────────────────────────────────────────────────
  const allArtisans = [...craftsmen, ...firestoreArtisans];

  const filtered = allArtisans.filter((c) => {
    if (regionFilter !== "All" && c.region !== regionFilter) return false;
    if (craftFilter !== "All" && c.craft !== craftFilter) return false;
    return true;
  });

  const activeFilters = [
    regionFilter !== "All" ? regionFilter : null,
    activeCraftName ?? null,
  ].filter(Boolean);

  const totalActiveFilters = activeFilters.length;

  const clearAll = () => {
    setRegionFilter("All");
    setCraftFilter("All");
  };

  return (
    <div style={creamBg}>
      {/* ── Hero ── */}
      <section className="pt-[70px] pb-10 px-4 border-b border-gold/20">
        <div className="container-heritage">
          <div className="pt-6 pb-4">
            <h1 className="font-display text-4xl md:text-5xl text-heritage-heading mb-3">
              India's Master Artisans
            </h1>
            <p className="font-body text-sm text-muted-foreground max-w-xl">
              Explore living traditions from Rajasthan and Madhya Pradesh — each
              artisan a guardian of a centuries-old craft.
            </p>
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-3 mt-6">
            {/* Region dropdown */}
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="appearance-none bg-white border border-gold/40 pl-4 pr-9 py-2.5 font-body text-sm text-heritage-heading focus:outline-none focus:border-gold/70 focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer dark:bg-sandstone dark:text-foreground"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r === "All" ? "All Regions" : r}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Craft Form dropdown */}
            <div className="relative">
              <select
                value={craftFilter}
                onChange={(e) => setCraftFilter(e.target.value)}
                className="appearance-none bg-white border border-gold/40 pl-4 pr-9 py-2.5 font-body text-sm text-heritage-heading focus:outline-none focus:border-gold/70 focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer dark:bg-sandstone dark:text-foreground"
              >
                <option value="All">All Craft Forms</option>
                {visibleCraftEntries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Clear filters */}
            {totalActiveFilters > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground border border-gold/30 px-3 py-2.5 hover:bg-sandstone transition-all"
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="container-heritage px-4 py-10">
        <div className="flex gap-10 items-start">
          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="flex lg:hidden items-center justify-between mb-4">
              <button
                onClick={() => setFilterOpen((p) => !p)}
                className="flex items-center gap-2 border border-gold/40 px-4 py-2 font-body text-sm hover:bg-sandstone transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
              </button>
              {totalActiveFilters > 0 && (
                <button
                  onClick={clearAll}
                  className="font-body text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            {/* Mobile filter panel */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden mb-4 border border-gold/20 p-4 bg-white/60"
                >
                  <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading mb-2">
                    Region
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {regions.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRegionChange(r)}
                        className={`font-body text-xs px-3 py-1.5 border transition-all ${
                          regionFilter === r
                            ? "border-gold bg-primary text-primary-foreground"
                            : "border-gold/30 text-muted-foreground hover:bg-sandstone"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading mb-2">
                    Craft Form
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCraftFilter("All")}
                      className={`font-body text-xs px-3 py-1.5 border transition-all ${
                        craftFilter === "All"
                          ? "border-gold bg-primary text-primary-foreground"
                          : "border-gold/30 text-muted-foreground hover:bg-sandstone"
                      }`}
                    >
                      All Crafts
                    </button>
                    {visibleCraftEntries.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setCraftFilter(c.name)}
                        className={`font-body text-xs px-3 py-1.5 border transition-all ${
                          craftFilter === c.name
                            ? "border-gold bg-primary text-primary-foreground"
                            : "border-gold/30 text-muted-foreground hover:bg-sandstone"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 border border-gold/40 bg-sandstone text-heritage-heading"
                  >
                    {f}
                    <button
                      onClick={() => {
                        if (f === regionFilter) setRegionFilter("All");
                        else setCraftFilter("All");
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Count */}
            {filtered.length > 0 && (
              <p className="font-body text-sm text-muted-foreground mb-5">
                <span className="text-heritage-heading font-semibold">
                  {filtered.length}
                </span>{" "}
                artisan{filtered.length !== 1 ? "s" : ""} found
                {activeCraftName ? ` for ${activeCraftName}` : ""}
                {regionFilter !== "All" ? ` in ${regionFilter}` : ""}
              </p>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((c) => (
                <CraftsmanCard key={c.id} craftsman={c} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground mb-4">
                  No artisans found
                  {activeCraftName ? ` for ${activeCraftName}` : ""}.
                </p>
                <button onClick={clearAll} className="btn-secondary text-sm">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Discover;
import { useState, useEffect, useCallback } from "react";
import { useBackground } from "@/hooks/useBackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Tag,
  Newspaper,
  Hammer,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type EventCategory = "Exhibition" | "Mela" | "Workshop" | "News";

interface CraftEvent {
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  time?: string;
  description: string;
  organizer?: string;
  link?: string;
  tags?: string[];
}

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  EventCategory,
  { icon: React.ElementType; color: string; bg: string }
> = {
  Exhibition: { icon: Sparkles, color: "#c9a227", bg: "#c9a22715" },
  Mela:       { icon: Hammer,   color: "#b85c38", bg: "#b85c3815" },
  Workshop:   { icon: Clock,    color: "#4a7c59", bg: "#4a7c5915" },
  News:       { icon: Newspaper, color: "#5c6bc0", bg: "#5c6bc015" },
};

const CATEGORIES: EventCategory[] = ["Exhibition", "Mela", "Workshop", "News"];

// ── Eventbrite fetch ──────────────────────────────────────────────────────────
async function fetchCraftEvents(): Promise<CraftEvent[]> {
  const TOKEN = import.meta.env.VITE_EVENTBRITE_TOKEN;

  const params = new URLSearchParams({
    q: "craft art handloom pottery textile",
    "location.address": "India",
    "location.within": "500km",
    expand: "organizer,venue",
    token: TOKEN,
  });

  const res = await fetch(
    `https://www.eventbriteapi.com/v3/events/search/?${params}`
  );

  if (!res.ok) throw new Error(`Eventbrite API error: ${res.status}`);
  const data = await res.json();

  return (data.events ?? []).map((ev: any): CraftEvent => {
    const name = ev.name?.text ?? "Untitled Event";
    const desc = (ev.description?.text ?? ev.summary ?? "").slice(0, 300);
    const venue = ev.venue;

    const location = venue
      ? [venue.name, venue.address?.city, venue.address?.region]
          .filter(Boolean)
          .join(", ")
      : "India";

    const startDate = ev.start?.local
      ? new Date(ev.start.local).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "TBA";

    const startTime = ev.start?.local
      ? new Date(ev.start.local).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined;

    // Auto-categorise based on keywords in the title
    const lc = name.toLowerCase();
    let category: EventCategory = "Exhibition";
    if (lc.includes("workshop") || lc.includes("training")) {
      category = "Workshop";
    } else if (
      lc.includes("mela") ||
      lc.includes("haat") ||
      lc.includes("bazaar") ||
      lc.includes("fair")
    ) {
      category = "Mela";
    } else if (
      lc.includes("news") ||
      lc.includes("award") ||
      lc.includes("announce") ||
      lc.includes("launch")
    ) {
      category = "News";
    }

    return {
      title: name,
      category,
      date: startDate,
      location,
      time: startTime,
      description: desc,
      organizer: ev.organizer?.name,
      link: ev.url,
      tags: [],
    };
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────
function EventCard({ event, index }: { event: CraftEvent; index: number }) {
  const cfg = CATEGORY_CONFIG[event.category] ?? CATEGORY_CONFIG["News"];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative bg-white dark:bg-sandstone border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:shadow-lg"
      style={{ borderLeft: `3px solid ${cfg.color}` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 font-body text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: cfg.color, background: cfg.bg }}
            >
              <Icon size={9} />
              {event.category}
            </span>
          </div>
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink size={14} style={{ color: cfg.color }} />
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-base text-heritage-heading leading-snug mb-2">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1 mb-3">
          {event.date && (
            <div className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
              <Calendar size={11} style={{ color: cfg.color }} />
              {event.date}
              {event.time && (
                <span className="text-muted-foreground/60">· {event.time}</span>
              )}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
              <MapPin size={11} style={{ color: cfg.color }} />
              {event.location}
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
              <Tag size={11} style={{ color: cfg.color }} />
              {event.organizer}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-[10px] px-2 py-0.5 border border-gold/25 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-sandstone border border-gold/20 p-5 animate-pulse">
      <div className="h-5 w-24 bg-gold/20 rounded mb-3" />
      <div className="h-4 w-3/4 bg-gold/10 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gold/10 rounded mb-3" />
      <div className="h-3 w-full bg-gold/10 rounded mb-1" />
      <div className="h-3 w-5/6 bg-gold/10 rounded mb-1" />
      <div className="h-3 w-4/6 bg-gold/10 rounded" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const Kalakendra = () => {
  const { creamBg } = useBackground();
  const [events, setEvents] = useState<CraftEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<EventCategory | "All">("All");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCraftEvents();
      setEvents(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError("Could not fetch live events. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  const counts: Record<string, number> = { All: events.length };
  CATEGORIES.forEach((cat) => {
    counts[cat] = events.filter((e) => e.category === cat).length;
  });

  return (
    <div style={creamBg} className="min-h-screen">
      {/* ── Hero ── */}
      <section
        className="pt-[70px] pb-12 px-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(20 40% 8%) 0%, hsl(22 60% 12%) 50%, hsl(20 40% 8%) 100%)",
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(50 100% 50%) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container-heritage relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: "#c9a227" }} />
              <span className="font-body text-[10px] uppercase tracking-[3px] text-gold">
                Live Updates
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-parchment mb-4">
              Kalakendra
            </h1>
            <p className="font-body text-base text-parchment/60 max-w-xl mb-6">
              Real-time news and events from India's craft world — exhibitions,
              melas, workshops, and stories of living traditions.
            </p>

            {/* Last updated + refresh */}
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="font-body text-xs text-parchment/40">
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 font-body text-xs uppercase tracking-[2px] px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 transition-all disabled:opacity-40"
              >
                <RefreshCw
                  size={12}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Fetching…" : "Refresh"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category filter ── */}
      <section className="border-b border-gold/20 sticky top-[64px] z-30 backdrop-blur-md bg-parchment/90 dark:bg-royal/90">
        <div className="container-heritage px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {/* All */}
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex-shrink-0 flex items-center gap-1.5 font-body text-xs uppercase tracking-[1.5px] px-4 py-2 border transition-all ${
                activeCategory === "All"
                  ? "border-gold bg-gold text-white"
                  : "border-gold/30 text-muted-foreground hover:border-gold/60"
              }`}
            >
              All
              <span className="text-[10px] opacity-70">({counts.All})</span>
            </button>

            {CATEGORIES.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const Icon = cfg.icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 flex items-center gap-1.5 font-body text-xs uppercase tracking-[1.5px] px-4 py-2 border transition-all"
                  style={
                    isActive
                      ? { borderColor: cfg.color, background: cfg.color, color: "white" }
                      : { borderColor: `${cfg.color}40`, color: cfg.color }
                  }
                >
                  <Icon size={10} />
                  {cat}
                  <span className="text-[10px] opacity-70">
                    ({counts[cat] ?? 0})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container-heritage px-4 py-10">
        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="font-body text-muted-foreground mb-4">{error}</p>
            <button onClick={load} className="btn-secondary text-sm">
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filtered.length > 0 ? (
                  <>
                    <p className="font-body text-sm text-muted-foreground mb-6">
                      <span className="text-heritage-heading font-semibold">
                        {filtered.length}
                      </span>{" "}
                      {activeCategory === "All"
                        ? "events & updates"
                        : activeCategory.toLowerCase() +
                          (filtered.length !== 1 ? "s" : "")}{" "}
                      found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filtered.map((event, i) => (
                        <EventCard
                          key={`${event.title}-${i}`}
                          event={event}
                          index={i}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="font-body text-muted-foreground">
                      No {activeCategory.toLowerCase()} events found right now.
                    </p>
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="mt-4 flex items-center gap-1 font-body text-sm text-gold mx-auto hover:underline"
                    >
                      View all events <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </section>
    </div>
  );
};

export default Kalakendra;
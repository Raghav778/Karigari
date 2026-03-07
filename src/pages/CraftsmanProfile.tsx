import { useState, useEffect } from "react";
import { useBackground } from "@/hooks/useBackground";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  LogIn,
  Share2,
  MessageSquare,
  Instagram,
  Youtube,
  Globe,
  Award,
  Hammer,
  Tag,
  Sparkles,
  Eye,
  X,
  ExternalLink,
  Send,
} from "lucide-react";
import {
  craftsmen,
  mapFirestoreKarigarToCraftsman,
  type Craftsman,
} from "@/data/craftsmen";
import { getCraftImage } from "@/lib/craftImages";
import CraftsmanCard from "@/components/CraftsmanCard";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { optimizeCloudinaryUrl } from "@/lib/craftImages";

const tabs = ["About", "Portfolio", "Booking"] as const;

const STATIC_REVIEWS = [
  {
    id: "static-1",
    name: "Priya Sharma",
    rating: 5,
    comment: "An absolutely transformative experience...",
    date: "Jan 2025",
  },
  {
    id: "static-2",
    name: "Arjun Mehta",
    rating: 5,
    comment: "Watching the craft come alive was magical...",
    date: "Dec 2024",
  },
  {
    id: "static-3",
    name: "Sara Thompson",
    rating: 4,
    comment: "Incredible skill and a warm, welcoming host...",
    date: "Nov 2024",
  },
];

const MANDALA_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.07' stroke-width='0.8'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cline x1='30' y1='8' x2='30' y2='52'/%3E%3Cline x1='8' y1='30' x2='52' y2='30'/%3E%3Cline x1='14' y1='14' x2='46' y2='46'/%3E%3Cline x1='46' y1='14' x2='14' y2='46'/%3E%3C/g%3E%3C/svg%3E")`;

const Lightbox = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.92)" }}
    onClick={onClose}
  >
    <button
      className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors z-10"
      onClick={onClose}
    >
      <X size={28} />
    </button>
    <motion.img
      initial={{ scale: 0.85 }}
      animate={{ scale: 1 }}
      src={src}
      alt="Preview"
      className="max-w-full max-h-[88vh] object-contain rounded shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </motion.div>
);

const Tag2 = ({ label }: { label: string }) => (
  <span className="seal-badge text-[10px]">{label}</span>
);

const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            fill={(hovered || value) >= n ? "currentColor" : "none"}
            className={(hovered || value) >= n ? "text-gold" : "text-gold/30"}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 font-body text-xs text-muted-foreground">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
};

const ReviewCard = ({
  name,
  rating,
  comment,
  date,
}: {
  name: string;
  rating: number;
  comment: string;
  date: string;
}) => (
  <div className="bg-sandstone border border-gold/40 p-4">
    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
          <span className="font-display text-xs text-gold">
            {name[0]?.toUpperCase()}
          </span>
        </div>
        <span className="font-display text-sm text-heritage-heading">
          {name}
        </span>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star
              key={j}
              size={11}
              fill={j < rating ? "currentColor" : "none"}
              className={j < rating ? "text-gold" : "text-gold/25"}
            />
          ))}
        </div>
      </div>
      <span className="font-body text-xs text-muted-foreground">{date}</span>
    </div>
    <p className="font-body text-sm text-muted-foreground leading-relaxed">
      {comment}
    </p>
  </div>
);

const CraftsmanProfile = () => {
  const { creamBg } = useBackground();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [craftsman, setCraftsman] = useState<Craftsman | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCraftsmen, setAllCraftsmen] = useState<Craftsman[]>(craftsmen);

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("About");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [firestoreReviews, setFirestoreReviews] = useState<
    {
      id: string;
      name: string;
      rating: number;
      comment: string;
      date: string;
    }[]
  >([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [activeMonth, setActiveMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const staticMatch = craftsmen.find((c) => c.id === id);
      if (staticMatch) {
        setCraftsman(staticMatch);
        setLoading(false);
        return;
      }
      try {
        if (!id) {
          setLoading(false);
          return;
        }
        const snap = await getDoc(doc(db, "craftsmen", id));
        if (snap.exists()) {
          const data = snap.data();
          if (data.status === "approved") {
            setCraftsman(mapFirestoreKarigarToCraftsman(snap.id, data));
          }
        }
      } catch (err) {
        console.error("Failed to fetch karigar:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const snap = await getDocs(
          query(
            collection(db, "reviews"),
            where("craftsmanId", "==", id),
            orderBy("createdAt", "desc"),
          ),
        );
        setFirestoreReviews(
          snap.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt?.toDate?.() ?? new Date();
            return {
              id: d.id,
              name: data.name || "Anonymous",
              rating: data.rating || 5,
              comment: data.comment || "",
              date: ts.toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              }),
            };
          }),
        );
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    if (!reviewName.trim()) return setReviewError("Please enter your name.");
    if (reviewRating === 0)
      return setReviewError("Please select a star rating.");
    if (!reviewComment.trim()) return setReviewError("Please write a comment.");
    setReviewError("");
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        craftsmanId: id,
        name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        createdAt: serverTimestamp(),
        userId: user?.uid ?? null,
      });
      const newReview = {
        id: docRef.id,
        name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
      };
      setFirestoreReviews((prev) => [newReview, ...prev]);
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setReviewError("Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "craftsmen"), where("status", "==", "approved")),
        );
        const fsDocs = snap.docs.map((d) =>
          mapFirestoreKarigarToCraftsman(d.id, d.data()),
        );
        setAllCraftsmen([
          ...craftsmen,
          ...fsDocs.filter((fc) => !craftsmen.some((sc) => sc.id === fc.id)),
        ]);
      } catch {
        /* non-fatal */
      }
    };
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="pt-[70px] min-h-screen bg-parchment flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-muted-foreground">
            Loading artisan profile…
          </p>
        </div>
      </div>
    );
  }

  if (!craftsman) {
    return (
      <div className="pt-[70px] min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl text-heritage-heading mb-4">
            Artisan not found.
          </p>
          <Link to="/discover" className="btn-primary text-sm">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const isFirestore = craftsman.isFirestore === true;
  const img = getCraftImage(craftsman.image);
  const portfolio = craftsman.portfolio || [];
  const galleryImages =
    portfolio.length > 0 ? portfolio.slice(0, 5) : [img, img, img, img];
  const reviewCount = firestoreReviews.length || STATIC_REVIEWS.length;
  const displayedReviews =
    firestoreReviews.length > 0 ? firestoreReviews : STATIC_REVIEWS;

  const recommended = allCraftsmen
    .filter((c) => c.id !== craftsman.id && c.region === craftsman.region)
    .slice(0, 3);

  const slots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];
  const isPast = (d: Date) => d < today;
  const isSelected = (d: Date) =>
    selectedDate !== null &&
    d.getDate() === selectedDate &&
    d.getMonth() === month &&
    d.getFullYear() === year;

  const confirmedDate =
    selectedDate !== null
      ? new Date(year, month, selectedDate).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const handleConfirm = () => {
    if (selectedDate === null || !selectedSlot) return;
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => {
        setShowLoginPrompt(false);
        setLoginOpen(true);
      }, 1800);
      return;
    }
    setBooked(true);
  };

  const isVideo = (url: string) =>
    /\.(mp4|mov|webm|avi|mkv)/i.test(url) || url.includes("/video/upload/");

  return (
    <div className="pt-[70px] min-h-screen" style={creamBg}>
      {/* ── HEADER ── */}
      <div className="relative border-b border-gold/25" style={creamBg}>
        <div className="container-heritage px-4 pt-6 pb-8">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Discover
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-heritage-heading mb-1">
                {craftsman.name}
              </h1>
              <p className="font-body text-muted-foreground mb-4">
                {craftsman.craft}
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <MapPin
                    size={13}
                    className="flex-shrink-0"
                    style={{ color: "hsl(var(--amber-fire))" }}
                  />
                  <span>
                    {craftsman.address
                      ? craftsman.address
                      : `${craftsman.location}${craftsman.region ? `, ${craftsman.region}` : ""}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Clock
                    size={13}
                    className="flex-shrink-0"
                    style={{ color: "hsl(var(--amber-fire))" }}
                  />
                  <span>Mon – Sat | 10:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Phone
                    size={13}
                    className="flex-shrink-0"
                    style={{ color: "hsl(var(--amber-fire))" }}
                  />
                  {craftsman.phone ? (
                    <a
                      href={`tel:+91${craftsman.phone}`}
                      className="hover:text-foreground transition-colors"
                    >
                      +91 {craftsman.phone}
                    </a>
                  ) : (
                    <span>+91 98765 43210</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex items-center gap-3 flex-wrap md:justify-end">
                <div className="flex items-center gap-1.5">
                  <Star size={16} fill="currentColor" className="text-gold" />
                  <span className="font-display text-lg text-heritage-heading">
                    {craftsman.rating}
                  </span>
                </div>
                <span className="font-body text-sm text-muted-foreground">
                  ({reviewCount} Reviews)
                </span>
                {craftsman.endangered && (
                  <span
                    className="text-white text-[10px] uppercase tracking-[2px] px-3 py-1.5 font-semibold"
                    style={{ backgroundColor: "hsl(var(--amber-fire))" }}
                  >
                    Endangered Craft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 border border-gold/40 bg-parchment/60 px-4 py-2 font-body text-sm text-heritage-heading hover:bg-sandstone transition-colors">
                  <Share2 size={13} /> Share
                </button>
                <button
                  className="inline-flex items-center gap-2 border border-gold/40 bg-parchment/60 px-4 py-2 font-body text-sm text-heritage-heading hover:bg-sandstone transition-colors"
                  onClick={() => setActiveTab("About")}
                >
                  <MessageSquare size={13} /> Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHOTO GALLERY ── */}
      <div className="container-heritage px-4">
        <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-2 h-[420px] gap-1 my-4">
          <div className="col-span-1 row-span-2 overflow-hidden relative group">
            {isVideo(galleryImages[0]) ? (
              <video
                src={galleryImages[0]}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={optimizeCloudinaryUrl(galleryImages[0], 1200)}
                loading="eager"
                alt={craftsman.craft}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
          </div>
          <img
            src={optimizeCloudinaryUrl(galleryImages[1] || img, 800)}
            alt={craftsman.craft}
            className="w-full h-full object-cover"
          />
          <img
            src={optimizeCloudinaryUrl(galleryImages[2] || img, 800)}
            alt={craftsman.craft}
            className="w-full h-full object-cover"
          />
          <img
            src={optimizeCloudinaryUrl(galleryImages[3] || img, 800)}
            alt={craftsman.craft}
            className="w-full h-full object-cover"
          />
          <div className="relative overflow-hidden">
            <img
              src={optimizeCloudinaryUrl(galleryImages[4] || img, 800)}
              alt={craftsman.craft}
              className="w-full h-full object-cover"
            />
            {portfolio.length > 4 && (
              <button
                onClick={() => setLightbox(portfolio[0])}
                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer group"
              >
                <span className="font-body text-sm text-white tracking-wide group-hover:underline flex items-center gap-2">
                  <Eye size={16} /> View All ({portfolio.length})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-heritage px-4">
        <div className="relative z-10 bg-parchment border border-gold p-6 md:p-8 mb-8">
          {/* Tabs */}
          <div className="flex border-b border-gold mb-6">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setBooked(false);
                }}
                className={`font-display text-sm uppercase tracking-[2px] px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === t
                    ? "border-heritage-gold text-heritage-heading"
                    : "border-transparent text-muted-foreground hover:text-heritage-heading"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ─────────────────── ABOUT TAB ─────────────────── */}
          {activeTab === "About" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="about"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 mb-8">
                {/* LEFT */}
                <div>
                  <h3 className="font-display text-lg text-heritage-heading mb-3">
                    Story
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                    {craftsman.story ||
                      "An artisan preserving traditional Indian craft with dedication and passion."}
                  </p>

                  {craftsman.inspiration && (
                    <>
                      <h3 className="font-display text-lg text-heritage-heading mb-2 flex items-center gap-2">
                        <Sparkles size={16} className="text-gold" /> What
                        Inspires Me
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 italic border-l-2 border-gold/40 pl-4">
                        {craftsman.inspiration}
                      </p>
                    </>
                  )}

                  {craftsman.awards && (
                    <>
                      <h3 className="font-display text-lg text-heritage-heading mb-2 flex items-center gap-2">
                        <Award size={16} className="text-gold" /> Awards &
                        Recognition
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                        {craftsman.awards}
                      </p>
                    </>
                  )}

                  <h3 className="font-display text-lg text-heritage-heading mb-3 flex items-center gap-2">
                    <Hammer size={16} className="text-gold" /> Materials
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {craftsman.materials.map((m) => (
                      <Tag2 key={m} label={m} />
                    ))}
                  </div>

                  {craftsman.techniques && craftsman.techniques.length > 0 && (
                    <>
                      <h3 className="font-display text-lg text-heritage-heading mb-3 flex items-center gap-2">
                        <Tag size={16} className="text-gold" /> Techniques
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {craftsman.techniques.map((t) => (
                          <Tag2 key={t} label={t} />
                        ))}
                      </div>
                    </>
                  )}

                  <h3 className="font-display text-lg text-heritage-heading mb-3">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {craftsman.specialties.map((s) => (
                      <Tag2 key={s} label={s} />
                    ))}
                  </div>

                  {/* ── Reviews ── */}
                  <div className="border-t border-gold/20 pt-8">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-display text-lg text-heritage-heading flex items-center gap-2">
                        <MessageSquare size={16} className="text-gold" />
                        Reviews
                        <span className="text-gold text-sm font-body normal-case">
                          ({displayedReviews.length})
                        </span>
                      </h3>
                    </div>

                    {reviewsLoading ? (
                      <div className="flex items-center gap-2 py-6 text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        <span className="font-body text-sm">
                          Loading reviews…
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-8">
                        {displayedReviews.map((r, i) => (
                          <ReviewCard
                            key={"id" in r ? r.id : i}
                            name={r.name}
                            rating={r.rating}
                            comment={r.comment}
                            date={r.date}
                          />
                        ))}
                      </div>
                    )}

                    {/* ── Write a Review ── */}
                    <div className="border border-gold/30 bg-sandstone/40 p-5">
                      <h4 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                        <Star size={13} className="text-gold" /> Write a Review
                      </h4>

                      <AnimatePresence mode="wait">
                        {/* ── NOT LOGGED IN: show sign-in prompt ── */}
                        {!user ? (
                          <motion.div
                            key="login-gate"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-start gap-3 py-2"
                          >
                            <p className="font-body text-sm text-muted-foreground">
                              Please sign in to share your experience with this
                              artisan.
                            </p>
                            <button
                              onClick={() => setLoginOpen(true)}
                              className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 text-sm"
                            >
                              <LogIn size={14} /> Sign in to Review
                            </button>
                          </motion.div>
                        ) : submitted ? (
                          /* ── SUCCESS STATE ── */
                          <motion.div
                            key="thanks"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 py-4 text-green-700"
                          >
                            <Check size={18} />
                            <p className="font-body text-sm">
                              Thank you — your review has been posted!
                            </p>
                          </motion.div>
                        ) : (
                          /* ── REVIEW FORM ── */
                          <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {/* Name */}
                            <div className="mb-4">
                              <label className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground mb-1.5 block">
                                Your Name <span className="text-gold">*</span>
                              </label>
                              <input
                                type="text"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="e.g. Priya Sharma"
                                className="w-full bg-white border border-gold/35 px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/20 transition-all"
                              />
                            </div>

                            {/* Star Rating */}
                            <div className="mb-4">
                              <label className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground mb-2 block">
                                Rating <span className="text-gold">*</span>
                              </label>
                              <StarPicker
                                value={reviewRating}
                                onChange={setReviewRating}
                              />
                            </div>

                            {/* Comment */}
                            <div className="mb-4">
                              <label className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground mb-1.5 block">
                                Your Review <span className="text-gold">*</span>
                              </label>
                              <textarea
                                rows={3}
                                value={reviewComment}
                                onChange={(e) =>
                                  setReviewComment(e.target.value)
                                }
                                placeholder="Share your experience with this artisan…"
                                className="w-full bg-white border border-gold/35 px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/20 transition-all resize-none"
                              />
                            </div>

                            {reviewError && (
                              <p className="font-body text-xs text-red-500 mb-3">
                                {reviewError}
                              </p>
                            )}

                            <button
                              onClick={handleReviewSubmit}
                              disabled={submitting}
                              className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                              {submitting ? "Posting…" : "Post Review"}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* RIGHT — contact sidebar */}
                <div className="space-y-4">
                  <div className="bg-sandstone border border-gold p-5">
                    <h4 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4">
                      Contact
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={13}
                          className="text-gold flex-shrink-0 mt-0.5"
                        />
                        <span className="font-body text-sm text-muted-foreground">
                          {craftsman.location}
                          {craftsman.region ? `, ${craftsman.region}` : ""}
                        </span>
                      </div>
                      {craftsman.phone ? (
                        <div className="flex items-center gap-3">
                          <Phone
                            size={13}
                            className="text-gold flex-shrink-0"
                          />
                          <a
                            href={`tel:+91${craftsman.phone}`}
                            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            +91 {craftsman.phone}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Phone
                            size={13}
                            className="text-gold flex-shrink-0"
                          />
                          <span className="font-body text-sm text-muted-foreground">
                            +91 98765 43210
                          </span>
                        </div>
                      )}
                      {craftsman.email ? (
                        <div className="flex items-center gap-3">
                          <Mail size={13} className="text-gold flex-shrink-0" />
                          <a
                            href={`mailto:${craftsman.email}`}
                            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                          >
                            {craftsman.email}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Mail size={13} className="text-gold flex-shrink-0" />
                          <span className="font-body text-sm text-muted-foreground">
                            karigarh@artisan.in
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Clock size={13} className="text-gold flex-shrink-0" />
                        <span className="font-body text-sm text-muted-foreground">
                          Mon–Sat, 10 AM – 6 PM
                        </span>
                      </div>
                      {craftsman.experience && (
                        <div className="flex items-center gap-3">
                          <Star size={13} className="text-gold flex-shrink-0" />
                          <span className="font-body text-sm text-muted-foreground">
                            {craftsman.experience} of experience
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(craftsman.instagram ||
                    craftsman.facebook ||
                    craftsman.youtube) && (
                    <div className="bg-sandstone border border-gold p-5">
                      <h4 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-3">
                        Social
                      </h4>
                      <div className="space-y-2">
                        {craftsman.instagram && (
                          <a
                            href={`https://instagram.com/${craftsman.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Instagram
                              size={13}
                              className="text-gold flex-shrink-0"
                            />
                            @{craftsman.instagram}
                            <ExternalLink
                              size={10}
                              className="ml-auto opacity-40"
                            />
                          </a>
                        )}
                        {craftsman.facebook && (
                          <a
                            href={`https://facebook.com/${craftsman.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe
                              size={13}
                              className="text-gold flex-shrink-0"
                            />
                            {craftsman.facebook}
                            <ExternalLink
                              size={10}
                              className="ml-auto opacity-40"
                            />
                          </a>
                        )}
                        {craftsman.youtube && (
                          <a
                            href={`https://youtube.com/@${craftsman.youtube}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Youtube
                              size={13}
                              className="text-gold flex-shrink-0"
                            />
                            @{craftsman.youtube}
                            <ExternalLink
                              size={10}
                              className="ml-auto opacity-40"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-sandstone border border-gold p-5">
                    <h4 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-3">
                      Workshop
                    </h4>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      {craftsman.workshopAddress
                        ? craftsman.workshopAddress
                        : "Sessions held at the artisan's personal studio. Hands-on participation welcome. All materials provided. Suitable for all skill levels."}
                    </p>
                  </div>

                  <div className="bg-sandstone border border-gold overflow-hidden">
                    <h4 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading p-4 pb-2">
                      Location
                    </h4>
                    <div className="w-full h-40">
                      <iframe
                        title="Artisan Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: "block" }}
                        loading="lazy"
                        allowFullScreen
                        src="https://www.openstreetmap.org/export/embed.html?bbox=74.5,26.8,75.2,27.2&layer=mapnik&marker=26.9124,75.7873"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────── PORTFOLIO TAB ─────────────────── */}
          {activeTab === "Portfolio" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="portfolio"
            >
              {portfolio.length > 0 ? (
                <>
                  <p className="font-body text-sm text-muted-foreground mb-6">
                    {portfolio.length} work sample
                    {portfolio.length !== 1 ? "s" : ""} — click any to view full
                    size.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {portfolio.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox(url)}
                        className="relative aspect-square overflow-hidden group border border-gold/20"
                      >
                        {isVideo(url) ? (
                          <div className="w-full h-full bg-ink flex items-center justify-center">
                            <Play size={28} className="text-white/70" />
                          </div>
                        ) : (
                          <img
                            src={url}
                            alt={`Work ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Eye
                            size={20}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 border border-gold/20">
                  <p className="font-body text-muted-foreground">
                    No portfolio items yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ─────────────────── BOOKING TAB ─────────────────── */}
          {activeTab === "Booking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="booking"
            >
              {booked ? (
                <div className="text-center py-10 border border-gold bg-sandstone">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center border-2 border-gold rounded-full">
                    <Check size={26} className="text-gold" />
                  </div>
                  <h3 className="font-display text-2xl text-gold mb-3">
                    Booking Confirmed
                  </h3>
                  <p className="font-body text-muted-foreground mb-1">
                    {confirmedDate} at {selectedSlot}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mb-1">
                    with {craftsman.name}
                  </p>
                  <div className="gold-divider my-6" />
                  <p className="font-body text-sm text-muted-foreground">
                    Payment to be made directly to the artisan at the time of
                    visit.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
                  <div>
                    <h3 className="font-display text-lg text-heritage-heading mb-4">
                      Select a Date
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() =>
                          setActiveMonth(new Date(year, month - 1, 1))
                        }
                        className="p-2 border border-gold/30 hover:bg-sandstone transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <p className="font-display text-sm text-heritage-heading uppercase tracking-[2px]">
                        {activeMonth.toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <button
                        onClick={() =>
                          setActiveMonth(new Date(year, month + 1, 1))
                        }
                        className="p-2 border border-gold/30 hover:bg-sandstone transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div
                          key={d}
                          className="text-center font-body text-[10px] uppercase tracking-[1px] text-muted-foreground py-1"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((d, i) => {
                        if (!d) return <div key={i} />;
                        const past = isPast(d);
                        const selected = isSelected(d);
                        return (
                          <button
                            key={i}
                            disabled={past}
                            onClick={() => {
                              setSelectedDate(d.getDate());
                              setSelectedSlot(null);
                            }}
                            className={`aspect-square flex items-center justify-center font-body text-sm transition-all ${
                              past
                                ? "text-muted-foreground/25 cursor-default"
                                : selected
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-sandstone border border-transparent hover:border-gold/30"
                            }`}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg text-heritage-heading mb-4">
                      Select a Time
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={`font-body text-sm py-2.5 border transition-all ${
                            selectedSlot === s
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-gold/30 hover:border-gold hover:bg-sandstone"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {showLoginPrompt && (
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 p-3 mb-4 font-body text-sm text-amber-800">
                        <LogIn size={15} /> Please sign in to book a session.
                      </div>
                    )}

                    <button
                      onClick={handleConfirm}
                      disabled={!selectedDate || !selectedSlot}
                      className={`w-full btn-primary py-3 transition-all ${
                        !selectedDate || !selectedSlot
                          ? "opacity-40 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {!selectedDate
                        ? "Pick a date"
                        : !selectedSlot
                          ? "Pick a time"
                          : `Confirm — ${confirmedDate}`}
                    </button>
                    <p className="font-body text-[11px] text-muted-foreground/60 text-center mt-2">
                      Free cancellation up to 24 hours before
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {recommended.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-2xl text-heritage-heading mb-2">
              Recommended Karigarh
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-4">
              More artisans from {craftsman.region}
            </p>
            <div className="gold-divider !mx-0 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((a) => (
                <CraftsmanCard key={a.id} craftsman={a} />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default CraftsmanProfile;
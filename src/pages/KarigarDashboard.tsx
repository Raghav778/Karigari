import { useEffect, useState, useMemo } from "react";
import { useBackground } from "@/hooks/useBackground";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, where, getDocs,
  doc, updateDoc, orderBy, Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  ArrowLeft, Calendar, Clock, CheckCircle2, XCircle,
  LayoutDashboard, User, Phone, Mail, IndianRupee,
  RefreshCw, Eye, TrendingUp, Hourglass, Ban,
  ChevronRight, X, Check, AlertCircle, Inbox,
  Star, SlidersHorizontal,
} from "lucide-react";

// ─── Textures ─────────────────────────────────────────────────────────────────
const MANDALA_BG    = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.07' stroke-width='0.8'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cline x1='30' y1='8' x2='30' y2='52'/%3E%3Cline x1='8' y1='30' x2='52' y2='30'/%3E%3Cline x1='14' y1='14' x2='46' y2='46'/%3E%3Cline x1='46' y1='14' x2='14' y2='46'/%3E%3C/g%3E%3C/svg%3E")`;
const JALI_BG       = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.06' stroke-width='0.7'%3E%3Crect x='4' y='4' width='24' height='24' rx='2'/%3E%3Crect x='9' y='9' width='14' height='14' rx='1'/%3E%3Ccircle cx='16' cy='16' r='4'/%3E%3Cline x1='16' y1='4' x2='16' y2='28'/%3E%3Cline x1='4' y1='16' x2='28' y2='16'/%3E%3C/g%3E%3C/svg%3E")`;
const BLOCKPRINT_BG = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a227' fill-opacity='0.045'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`;

const ORG = "#e8740e";

// ─── Types ─────────────────────────────────────────────────────────────────────
type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

interface Booking {
  id: string;
  craftsmanId: string;
  craftsmanName: string;
  karigarUid: string;
  customerUid: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  slot: string;
  status: BookingStatus;
  createdAt: Timestamp | any;
  notes?: string;
  amount?: string;
}

// ─── Status config ─────────────────────────────────────────────────────────────
const S: Record<BookingStatus, {
  label: string; color: string; bg: string; border: string; dot: string;
  icon: React.ElementType; actionNext?: BookingStatus; actionLabel?: string;
}> = {
  pending:   {
    label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50",
    border: "border-amber-200",   dot: "bg-amber-500",   icon: Hourglass,
    actionNext: "confirmed", actionLabel: "Accept",
  },
  confirmed: {
    label: "Confirmed", color: "text-blue-700",    bg: "bg-blue-50",
    border: "border-blue-200",    dot: "bg-blue-500",    icon: CheckCircle2,
    actionNext: "active", actionLabel: "Mark Active",
  },
  active:    {
    label: "Active",    color: "text-emerald-700", bg: "bg-emerald-50",
    border: "border-emerald-200", dot: "bg-emerald-500", icon: TrendingUp,
    actionNext: "completed", actionLabel: "Mark Completed",
  },
  completed: {
    label: "Completed", color: "text-slate-600",   bg: "bg-slate-50",
    border: "border-slate-200",   dot: "bg-slate-400",   icon: Star,
  },
  cancelled: {
    label: "Cancelled", color: "text-red-600",     bg: "bg-red-50",
    border: "border-red-200",     dot: "bg-red-400",     icon: Ban,
  },
};

type TabKey = "all" | BookingStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "pending",   label: "Pending"   },
  { key: "confirmed", label: "Confirmed" },
  { key: "active",    label: "Active"    },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (ts: any): string => {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const Spin = () => (
  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ─── Skeleton loader ───────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="min-h-screen pt-[70px] flex items-center justify-center" style={{ backgroundImage: MANDALA_BG, backgroundColor: "hsl(var(--parchment))" }}>
    <div className="text-center">
      <div className="relative mx-auto w-16 h-16 mb-6">
        <div className="absolute inset-0 border rounded-full animate-ping opacity-30" style={{ borderColor: `${ORG}60` }} />
        <div className="w-16 h-16 border flex items-center justify-center bg-sandstone rounded-full" style={{ borderColor: `${ORG}80` }}>
          <LayoutDashboard size={24} style={{ color: ORG }} />
        </div>
      </div>
      <p className="font-display text-sm uppercase tracking-[2px] text-muted-foreground">Loading dashboard…</p>
    </div>
  </div>
);

// ─── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent, onClick, active }: {
  label: string; value: number; icon: React.ElementType;
  accent: string; onClick: () => void; active: boolean;
}) => (
  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full text-left p-5 border transition-all duration-200 relative overflow-hidden"
    style={{
      borderColor: active ? accent : `${accent}30`,
      background: active ? `${accent}08` : "hsl(var(--sandstone))",
      backgroundImage: JALI_BG,
    }}>
    {active && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: accent }} />}
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[2px] text-muted-foreground mb-2">{label}</p>
        <p className="font-display text-3xl" style={{ color: active ? accent : "hsl(var(--heritage-heading))" }}>{value}</p>
      </div>
      <div className="w-9 h-9 flex items-center justify-center border" style={{ borderColor: `${accent}40`, background: `${accent}12` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
    </div>
  </motion.button>
);

// ─── Booking card ──────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onAction, onView, updating }: {
  booking: Booking;
  onAction: (id: string, status: BookingStatus) => void;
  onView: (b: Booking) => void;
  updating: string | null;
}) => {
  const cfg = S[booking.status];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border transition-all hover:shadow-md group"
      style={{ borderColor: `${ORG}20` }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{
          borderColor: `${ORG}15`,
          backgroundImage: BLOCKPRINT_BG,
          backgroundColor: "hsl(var(--sandstone)/0.5)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <span
            className={`font-body text-[10px] uppercase tracking-[1.5px] ${cfg.color}`}
          >
            {cfg.label}
          </span>
        </div>
        <span className="font-body text-[10px] text-muted-foreground/60">
          {formatDate(booking.createdAt)}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Customer info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center border font-display text-base"
              style={{
                borderColor: `${ORG}40`,
                background: `${ORG}10`,
                color: ORG,
              }}
            >
              {booking.customerName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm text-heritage-heading truncate">
                {booking.customerName}
              </p>
              <p className="font-body text-xs text-muted-foreground truncate">
                {booking.customerEmail}
              </p>
              {booking.customerPhone && (
                <p className="font-body text-xs text-muted-foreground">
                  {booking.customerPhone}
                </p>
              )}
            </div>
          </div>

          {/* View button */}
          <button
            onClick={() => onView(booking)}
            className="flex-shrink-0 flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[1px] px-3 py-1.5 border transition-all hover:bg-sandstone"
            style={{ borderColor: `${ORG}40`, color: ORG }}
          >
            <Eye size={11} /> Details
          </button>
        </div>

        {/* Date & slot */}
        <div
          className="flex flex-wrap gap-4 mt-4 pt-4 border-t"
          style={{ borderColor: `${ORG}15` }}
        >
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: ORG }} />
            <span className="font-body text-xs text-foreground">
              {booking.date}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: ORG }} />
            <span className="font-body text-xs text-foreground">
              {booking.slot}
            </span>
          </div>
          {booking.amount && (
            <div className="flex items-center gap-1.5">
              <IndianRupee size={12} style={{ color: ORG }} />
              <span className="font-body text-xs text-foreground">
                {booking.amount}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {(cfg.actionNext ||
          booking.status === "pending" ||
          booking.status === "confirmed" ||
          booking.status === "active") && (
          <div className="flex items-center gap-2 mt-4">
            {cfg.actionNext && cfg.actionLabel && (
              <button
                disabled={updating === booking.id}
                onClick={() => onAction(booking.id, cfg.actionNext!)}
                className="flex items-center gap-1.5 px-4 py-2 font-body text-xs uppercase tracking-[1px] text-white transition-all disabled:opacity-50"
                style={{
                  background: booking.status === "pending" ? "#16a34a" : ORG,
                }}
              >
                {updating === booking.id ? <Spin /> : <Check size={11} />}
                {cfg.actionLabel}
              </button>
            )}
            {/* Cancel option for pending & confirmed */}
            {(booking.status === "pending" ||
              booking.status === "confirmed") && (
              <button
                disabled={updating === booking.id}
                onClick={() => onAction(booking.id, "cancelled")}
                className="flex items-center gap-1.5 px-4 py-2 font-body text-xs uppercase tracking-[1px] border border-red-300 text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
              >
                <X size={11} /> Reject
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ booking, onClose, onAction, updating }: {
  booking: Booking; onClose: () => void;
  onAction: (id: string, status: BookingStatus) => void;
  updating: string | null;
}) => {
  const cfg = S[booking.status];
  const rows = [
    { icon: User,        label: "Customer",  value: booking.customerName  },
    { icon: Mail,        label: "Email",     value: booking.customerEmail },
    { icon: Phone,       label: "Phone",     value: booking.customerPhone || "—" },
    { icon: Calendar,    label: "Date",      value: booking.date          },
    { icon: Clock,       label: "Time Slot", value: booking.slot          },
    { icon: IndianRupee, label: "Amount",    value: booking.amount || "Pay at Visit" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-ink/70 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative w-full max-w-md bg-white shadow-2xl my-10"
        style={{ backgroundImage: BLOCKPRINT_BG }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: `${ORG}25` }}
        >
          <div className="flex items-center gap-3">
            <div className="h-5 w-0.5" style={{ background: ORG }} />
            <h3 className="font-display text-base uppercase tracking-[2px] text-heritage-heading">
              Booking Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sandstone transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status banner */}
        <div
          className={`flex items-center gap-3 px-6 py-3 ${cfg.bg} border-b ${cfg.border}`}
        >
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span
            className={`font-body text-xs uppercase tracking-[1.5px] ${cfg.color}`}
          >
            Status: {cfg.label}
          </span>
          <span className="ml-auto font-body text-[10px] text-muted-foreground/60">
            Booked {formatDate(booking.createdAt)}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {rows.map(
            ({ icon: Icon, label, value }) =>
              value && (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center border bg-sandstone"
                    style={{ borderColor: `${ORG}35` }}
                  >
                    <Icon size={13} style={{ color: ORG }} />
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground/55 mb-0.5">
                      {label}
                    </p>
                    <p className="font-body text-sm text-foreground">{value}</p>
                  </div>
                </div>
              ),
          )}

          {booking.notes && (
            <div
              className="mt-4 p-4 border"
              style={{
                borderColor: `${ORG}25`,
                background: "hsl(var(--sandstone))",
              }}
            >
              <p className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground/55 mb-1">
                Notes
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {(cfg.actionNext ||
          booking.status === "pending" ||
          booking.status === "confirmed") && (
          <div className="flex gap-3 px-6 pb-6">
            {cfg.actionNext && cfg.actionLabel && (
              <button
                disabled={updating === booking.id}
                onClick={() => {
                  onAction(booking.id, cfg.actionNext!);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 font-body text-xs uppercase tracking-[1px] text-white disabled:opacity-50 transition-all"
                style={{
                  background: booking.status === "pending" ? "#16a34a" : ORG,
                }}
              >
                {updating === booking.id ? <Spin /> : <Check size={11} />}
                {cfg.actionLabel}
              </button>
            )}
            {(booking.status === "pending" ||
              booking.status === "confirmed") && (
              <button
                disabled={updating === booking.id}
                onClick={() => {
                  onAction(booking.id, "cancelled");
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 font-body text-xs uppercase tracking-[1px] border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-all"
              >
                <X size={12} /> Reject
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function KarigarDashboard() {
  const { creamBg } = useBackground();
  const navigate = useNavigate();
  const [bookings,    setBookings]    = useState<Booking[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [activeTab,   setActiveTab]   = useState<TabKey>("all");
  const [updating,    setUpdating]    = useState<string | null>(null);
  const [detail,      setDetail]      = useState<Booking | null>(null);
  const [karigarName, setKarigarName] = useState("");

  // ── Fetch bookings ──────────────────────────────────────────────────────────
  const fetchBookings = async (uid: string, silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const snap = await getDocs(
        query(collection(db, "bookings"), where("karigarUid", "==", uid))
      );
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];
      // Sort newest first
      data.sort((a, b) => {
        const at = a.createdAt?.toDate?.() ?? new Date(a.createdAt ?? 0);
        const bt = b.createdAt?.toDate?.() ?? new Date(b.createdAt ?? 0);
        return bt.getTime() - at.getTime();
      });
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { state: { openLogin: true } });
        return;
      }
      // Verify this user has a karigar profile
      const karigarSnap = await getDocs(
        query(collection(db, "craftsmen"), where("userId", "==", user.uid))
      );
      if (karigarSnap.empty) { navigate("/join"); return; }

      const karigarData = karigarSnap.docs[0].data();
      setKarigarName(karigarData.personal?.profileName || karigarData.personal?.name || "Karigar");
      await fetchBookings(user.uid);
    });
    return () => unsub();
  }, [navigate]);

  // ── Update booking status ───────────────────────────────────────────────────
  const handleAction = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdating(bookingId);
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Could not update booking. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // ── Derived counts ──────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    active:    bookings.filter(b => b.status === "active").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  }), [bookings]);

  const filtered = useMemo(() =>
    activeTab === "all" ? bookings : bookings.filter(b => b.status === activeTab),
    [bookings, activeTab]
  );

  if (loading) return <Skeleton />;

  return (
    <div style={{ ...creamBg, minHeight: "100vh" }}>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <div className="bg-ink relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: JALI_BG }} />
        <div className="absolute inset-0" style={{ backgroundImage: MANDALA_BG, opacity: 0.3 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(22 100% 45% / 0.5), transparent)" }} />

        <div className="container-heritage px-4 pt-10 pb-12 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/karigar-profile"
              className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[2px] text-parchment/35 hover:text-parchment transition-colors">
              <ArrowLeft size={12} /> Back to Profile
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-5" style={{ background: `${ORG}99` }} />
                <span className="font-body text-[10px] uppercase tracking-[3px]" style={{ color: ORG }}>Karigar Dashboard</span>
              </div>
              <h1 className="font-display text-4xl text-parchment leading-tight mb-2">Bookings</h1>
              <p className="font-body text-sm text-parchment/45">{karigarName}</p>
            </div>

            {/* Refresh */}
            <button onClick={() => auth.currentUser && fetchBookings(auth.currentUser.uid, true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-[1.5px] border text-parchment/70 hover:text-parchment transition-all disabled:opacity-50"
              style={{ borderColor: `${ORG}50` }}>
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="container-heritage px-4 py-10">

        {/* ══ STAT CARDS ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {[
            { key: "pending",   label: "Pending",   icon: Hourglass,    accent: "#f59e0b" },
            { key: "confirmed", label: "Confirmed", icon: CheckCircle2, accent: "#3b82f6" },
            { key: "active",    label: "Active",    icon: TrendingUp,   accent: "#10b981" },
            { key: "completed", label: "Completed", icon: Star,         accent: "#64748b" },
            { key: "cancelled", label: "Cancelled", icon: Ban,          accent: "#ef4444" },
          ].map(({ key, label, icon, accent }) => (
            <StatCard key={key} label={label} value={counts[key as TabKey]}
              icon={icon} accent={accent}
              active={activeTab === key}
              onClick={() => setActiveTab(key as TabKey)} />
          ))}
        </div>

        {/* ══ TABS ════════════════════════════════════════════════════════════ */}
        <div className="border-b mb-8 overflow-x-auto scrollbar-hide" style={{ borderColor: `${ORG}20` }}>
          <div className="flex min-w-max">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 font-body text-xs uppercase tracking-[1.5px] border-b-2 transition-all whitespace-nowrap flex items-center gap-2
                  ${activeTab === tab.key ? "border-[#e8740e] text-[#e8740e]" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-body
                  ${activeTab === tab.key ? "bg-[#e8740e]/15 text-[#e8740e]" : "bg-muted text-muted-foreground"}`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ══ BOOKING LIST ═════════════════════════════════════════════════════ */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 border flex items-center justify-center mb-5"
              style={{ borderColor: `${ORG}30`, background: `${ORG}08` }}>
              <Inbox size={24} style={{ color: ORG }} className="opacity-50" />
            </div>
            <p className="font-display text-base uppercase tracking-[2px] text-muted-foreground mb-2">
              {activeTab === "all" ? "No bookings yet" : `No ${activeTab} bookings`}
            </p>
            <p className="font-body text-sm text-muted-foreground/60">
              {activeTab === "all"
                ? "When customers book a visit with you, they'll appear here."
                : `You have no ${activeTab} bookings right now.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((booking, i) => (
                <motion.div key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}>
                  <BookingCard
                    booking={booking}
                    onAction={handleAction}
                    onView={setDetail}
                    updating={updating}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ══ SUMMARY FOOTER ═══════════════════════════════════════════════════ */}
        {bookings.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-12 p-5 border relative overflow-hidden"
            style={{ borderColor: `${ORG}25`, background: "hsl(var(--sandstone))", backgroundImage: MANDALA_BG }}>
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: ORG }} />
            <div className="pl-3 relative z-10 flex flex-wrap gap-6 items-center">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[2px] text-muted-foreground/60 mb-0.5">Total Bookings</p>
                <p className="font-display text-2xl" style={{ color: ORG }}>{counts.all}</p>
              </div>
              <div className="h-10 w-px bg-muted/30" />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[2px] text-muted-foreground/60 mb-0.5">Completion Rate</p>
                <p className="font-display text-2xl text-emerald-600">
                  {counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0}%
                </p>
              </div>
              <div className="h-10 w-px bg-muted/30" />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[2px] text-muted-foreground/60 mb-0.5">Needs Attention</p>
                <p className="font-display text-2xl text-amber-600">{counts.pending + counts.confirmed}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ══ DETAIL MODAL ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {detail && (
          <DetailModal
            booking={detail}
            onClose={() => setDetail(null)}
            onAction={handleAction}
            updating={updating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
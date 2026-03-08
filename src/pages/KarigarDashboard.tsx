import { useEffect, useState, useMemo, useRef } from "react";
import { useBackground } from "@/hooks/useBackground";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, where, getDocs,
  doc, updateDoc, Timestamp,
  onSnapshot, addDoc, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  ArrowLeft, Calendar, Clock, CheckCircle2,
  LayoutDashboard, User, Phone, Mail, IndianRupee,
  Eye, TrendingUp, Hourglass, Ban,
  X, Check, Inbox, Star, Bell,
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
  pending:   { label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-500",   icon: Hourglass,    actionNext: "confirmed", actionLabel: "Accept"         },
  confirmed: { label: "Confirmed", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-500",    icon: CheckCircle2, actionNext: "active",    actionLabel: "Mark Active"    },
  active:    { label: "Active",    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", icon: TrendingUp,   actionNext: "completed", actionLabel: "Mark Completed" },
  completed: { label: "Completed", color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200",   dot: "bg-slate-400",   icon: Star                                                               },
  cancelled: { label: "Cancelled", color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-400",     icon: Ban                                                                },
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
  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
);

const Skeleton = () => (
  <div className="min-h-screen bg-parchment flex items-center justify-center">
    <div className="w-8 h-8 border-2 rounded-full animate-spin"
      style={{ borderColor: `${ORG} transparent transparent transparent` }} />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent, active, onClick }: {
  label: string; value: number; icon: React.ElementType;
  accent: string; active: boolean; onClick: () => void;
}) => (
  <motion.button whileHover={{ y: -2 }} onClick={onClick}
    className={`p-4 border text-left transition-all ${active ? "shadow-sm" : ""}`}
    style={{ borderColor: active ? accent : `${accent}30`, background: active ? `${accent}12` : "hsl(var(--sandstone))" }}>
    <div className="flex items-center gap-2 mb-2">
      <Icon size={14} style={{ color: accent }} />
      <span className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground">{label}</span>
    </div>
    <p className="font-display text-2xl" style={{ color: accent }}>{value}</p>
  </motion.button>
);

// ─── New Booking Alert Banners ─────────────────────────────────────────────────
const NewBookingAlert = ({ bookings, onAction, onDismiss, updating }: {
  bookings: Booking[];
  onAction: (id: string, status: BookingStatus, booking: Booking) => void;
  onDismiss: (id: string) => void;
  updating: string | null;
}) => {
  if (bookings.length === 0) return null;
  return (
    <div className="container-heritage px-4 pt-6">
      <AnimatePresence>
        {bookings.map((booking) => (
          <motion.div key={booking.id}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            className="mb-3 border-2 border-amber-400 bg-amber-50 overflow-hidden shadow-lg">
            <div className="h-1 bg-amber-400 animate-pulse" />
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-amber-400/20 border border-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell size={15} className="text-amber-700 animate-bounce" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-body text-[10px] uppercase tracking-[2px] text-amber-600">New Booking Request</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <p className="font-display text-sm text-amber-900 truncate">{booking.customerName}</p>
                  <p className="font-body text-xs text-amber-700/70">{booking.date} · {booking.slot}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button disabled={updating === booking.id}
                  onClick={() => onAction(booking.id, "confirmed", booking)}
                  className="flex items-center gap-1.5 px-4 py-2 font-body text-xs uppercase tracking-[1px] text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all">
                  {updating === booking.id ? <Spin /> : <Check size={11} />} Accept
                </button>
                <button disabled={updating === booking.id}
                  onClick={() => onAction(booking.id, "cancelled", booking)}
                  className="flex items-center gap-1.5 px-4 py-2 font-body text-xs uppercase tracking-[1px] border border-red-400 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all">
                  <X size={11} /> Reject
                </button>
                <button onClick={() => onDismiss(booking.id)} className="p-2 text-amber-500 hover:text-amber-700 transition-colors" title="Dismiss">
                  <X size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onAction, onView, updating }: {
  booking: Booking;
  onAction: (id: string, status: BookingStatus, booking: Booking) => void;
  onView: (b: Booking) => void;
  updating: string | null;
}) => {
  const cfg = S[booking.status];
  return (
    <div className="bg-white border p-5 transition-all hover:shadow-md relative overflow-hidden"
      style={{ borderColor: `${ORG}20`, backgroundImage: BLOCKPRINT_BG }}>
      <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: cfg.dot.replace("bg-", "") }} />

      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-body text-[10px] uppercase tracking-[1px] border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        <span className="font-body text-[10px] text-muted-foreground">{formatDate(booking.createdAt)}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 border flex items-center justify-center flex-shrink-0"
          style={{ borderColor: `${ORG}30`, background: `${ORG}10` }}>
          <User size={13} style={{ color: ORG }} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm text-heritage-heading truncate">{booking.customerName}</p>
          <p className="font-body text-xs text-muted-foreground truncate">{booking.customerEmail}</p>
          {booking.customerPhone && <p className="font-body text-xs text-muted-foreground">{booking.customerPhone}</p>}
        </div>
        <button onClick={() => onView(booking)}
          className="flex-shrink-0 flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[1px] px-3 py-1.5 border transition-all hover:bg-sandstone"
          style={{ borderColor: `${ORG}40`, color: ORG }}>
          <Eye size={11} /> Details
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${ORG}15` }}>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} style={{ color: ORG }} />
          <span className="font-body text-xs text-foreground">{booking.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} style={{ color: ORG }} />
          <span className="font-body text-xs text-foreground">{booking.slot}</span>
        </div>
        {booking.amount && (
          <div className="flex items-center gap-1.5">
            <IndianRupee size={12} style={{ color: ORG }} />
            <span className="font-body text-xs text-foreground">{booking.amount}</span>
          </div>
        )}
      </div>

      {(cfg.actionNext || booking.status === "pending" || booking.status === "confirmed" || booking.status === "active") && (
        <div className="flex items-center gap-2 mt-4">
          {cfg.actionNext && cfg.actionLabel && (
            <button disabled={updating === booking.id}
              onClick={() => onAction(booking.id, cfg.actionNext!, booking)}
              className="flex items-center gap-1.5 px-4 py-2 font-body text-xs uppercase tracking-[1px] text-white transition-all disabled:opacity-50"
              style={{ background: booking.status === "pending" ? "#16a34a" : ORG }}>
              {updating === booking.id ? <Spin /> : <Check size={11} />}
              {cfg.actionLabel}
            </button>
          )}
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <button disabled={updating === booking.id}
              onClick={() => onAction(booking.id, "cancelled", booking)}
              className="flex items-center gap-1.5 px-4 py-2 font-body text-xs uppercase tracking-[1px] border border-red-300 text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
              <X size={11} /> Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ booking, onClose, onAction, updating }: {
  booking: Booking; onClose: () => void;
  onAction: (id: string, status: BookingStatus, booking: Booking) => void;
  updating: string | null;
}) => {
  const cfg = S[booking.status];
  const rows = [
    { icon: User,        label: "Customer",  value: booking.customerName           },
    { icon: Mail,        label: "Email",     value: booking.customerEmail          },
    { icon: Phone,       label: "Phone",     value: booking.customerPhone || "—"   },
    { icon: Calendar,    label: "Date",      value: booking.date                   },
    { icon: Clock,       label: "Time Slot", value: booking.slot                   },
    { icon: IndianRupee, label: "Amount",    value: booking.amount || "Pay at Visit"},
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-ink/70 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        className="w-full max-w-md bg-white overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>

        <div className="bg-ink px-6 py-4 flex items-center justify-between" style={{ backgroundImage: MANDALA_BG }}>
          <div>
            <p className="font-body text-[10px] uppercase tracking-[2px] text-parchment/50 mb-1">Booking Detail</p>
            <h3 className="font-display text-lg text-parchment">{booking.customerName}</h3>
          </div>
          <button onClick={onClose} className="text-parchment/50 hover:text-parchment transition-colors"><X size={18} /></button>
        </div>

        <div className="px-6 pt-5 pb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-body text-[10px] uppercase tracking-[1px] border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
          </span>
        </div>

        <div className="px-6 pb-4 space-y-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-7 h-7 border flex items-center justify-center flex-shrink-0"
                style={{ borderColor: `${ORG}30`, background: `${ORG}08` }}>
                <Icon size={12} style={{ color: ORG }} />
              </div>
              <div>
                <p className="font-body text-[9px] uppercase tracking-[1.5px] text-muted-foreground">{label}</p>
                <p className="font-display text-sm text-heritage-heading">{value}</p>
              </div>
            </div>
          ))}
          {booking.notes && (
            <div className="p-3 border mt-2" style={{ borderColor: `${ORG}25`, background: `${ORG}06` }}>
              <p className="font-body text-[9px] uppercase tracking-[1.5px] text-muted-foreground mb-1">Notes</p>
              <p className="font-body text-xs text-foreground">{booking.notes}</p>
            </div>
          )}
        </div>

        {(cfg.actionNext || booking.status === "pending" || booking.status === "confirmed") && (
          <div className="px-6 pb-6 flex gap-2">
            {cfg.actionNext && cfg.actionLabel && (
              <button disabled={updating === booking.id}
                onClick={() => { onAction(booking.id, cfg.actionNext!, booking); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 font-body text-xs uppercase tracking-[1px] text-white disabled:opacity-50 transition-all"
                style={{ background: booking.status === "pending" ? "#16a34a" : ORG }}>
                {updating === booking.id ? <Spin /> : <Check size={11} />}
                {cfg.actionLabel}
              </button>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <button disabled={updating === booking.id}
                onClick={() => { onAction(booking.id, "cancelled", booking); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 font-body text-xs uppercase tracking-[1px] border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-all">
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
  const [activeTab,   setActiveTab]   = useState<TabKey>("all");
  const [updating,    setUpdating]    = useState<string | null>(null);
  const [detail,      setDetail]      = useState<Booking | null>(null);
  const [karigarName, setKarigarName] = useState("");
  const [karigarDocId, setKarigarDocId] = useState<string>("");

  const initialLoadDone = useRef(false);
  const [alertBookings, setAlertBookings] = useState<Booking[]>([]);
  const unsubRef = useRef<(() => void) | null>(null);

  // ── Subscribe to bookings in real-time using craftsmanId (doc ID) ──────────
  // This is the most reliable query — no composite index needed
  const subscribeBookings = (docId: string) => {
    unsubRef.current?.();
    initialLoadDone.current = false;

    const q = query(
      collection(db, "bookings"),
      where("craftsmanId", "==", docId)
      // ✅ NO orderBy here — avoids the composite index requirement
      // We sort in JS below instead
    );

    unsubRef.current = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];

      // Sort newest first in JS
      data.sort((a, b) => {
        const at = a.createdAt?.toDate?.() ?? new Date(a.createdAt ?? 0);
        const bt = b.createdAt?.toDate?.() ?? new Date(b.createdAt ?? 0);
        return bt.getTime() - at.getTime();
      });

      setBookings(data);
      setLoading(false);

      // After first load, watch for new PENDING bookings and show alert banners
      if (initialLoadDone.current) {
        snap.docChanges().forEach(change => {
          if (change.type === "added") {
            const nb = { id: change.doc.id, ...change.doc.data() } as Booking;
            if (nb.status === "pending") {
              setAlertBookings(prev =>
                prev.find(b => b.id === nb.id) ? prev : [nb, ...prev]
              );
            }
          }
        });
      } else {
        initialLoadDone.current = true;
      }
    }, (err) => {
      console.error("Bookings listener error:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { state: { openLogin: true } });
        return;
      }

      // Get karigar's own craftsmen doc
      const snap = await getDocs(
        query(collection(db, "craftsmen"), where("userId", "==", user.uid))
      );
      if (snap.empty) { navigate("/join"); return; }

      const karigarDoc = snap.docs[0];
      const karigarData = karigarDoc.data();
      const docId = karigarDoc.id;

      setKarigarDocId(docId);
      setKarigarName(karigarData.personal?.profileName || karigarData.personal?.name || "Karigar");

      // Subscribe using the Firestore doc ID — always reliable
      subscribeBookings(docId);
    });

    return () => {
      unsub();
      unsubRef.current?.();
    };
  }, [navigate]);

  const dismissAlert = (id: string) => setAlertBookings(prev => prev.filter(b => b.id !== id));

  // ── Accept / Reject — updates Firestore + notifies customer ───────────────
  const handleAction = async (bookingId: string, newStatus: BookingStatus, booking?: Booking) => {
    setUpdating(bookingId);
    setAlertBookings(prev => prev.filter(b => b.id !== bookingId));

    const target = booking ?? bookings.find(b => b.id === bookingId);

    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // Optimistic local update
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));

      // Notify customer when karigar accepts or rejects
      if (target?.customerUid && (newStatus === "confirmed" || newStatus === "cancelled")) {
        await addDoc(collection(db, "customerNotifications"), {
          customerUid: target.customerUid,
          bookingId,
          karigarName,
          date:        target.date,
          slot:        target.slot,
          newStatus,
          read:        false,
          createdAt:   serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Could not update booking. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border font-body text-[10px] uppercase tracking-[1.5px] text-parchment/60"
              style={{ borderColor: `${ORG}40` }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Updates
            </div>
          </div>
        </div>
      </div>

      {/* ══ NEW BOOKING ALERT BANNERS ════════════════════════════════════════ */}
      <NewBookingAlert bookings={alertBookings} onAction={handleAction} onDismiss={dismissAlert} updating={updating} />

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
              icon={icon} accent={accent} active={activeTab === key}
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
                  <BookingCard booking={booking} onAction={handleAction} onView={setDetail} updating={updating} />
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
                  {counts.all > 0 ? `${Math.round((counts.completed / counts.all) * 100)}%` : "—"}
                </p>
              </div>
              <div className="h-10 w-px bg-muted/30" />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[2px] text-muted-foreground/60 mb-0.5">Pending Action</p>
                <p className="font-display text-2xl text-amber-600">{counts.pending}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {detail && (
          <DetailModal booking={detail} onClose={() => setDetail(null)} onAction={handleAction} updating={updating} />
        )}
      </AnimatePresence>
    </div>
  );
}
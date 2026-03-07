import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Hourglass,
  XCircle,
  TrendingUp,
  Star,
  ArrowLeft,
  MessageCircle,
  Bell,
  X,
  MapPin,
  IndianRupee,
  User,
  Sparkles,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useBackground } from "@/hooks/useBackground";

// ── Types ──────────────────────────────────────────────────────────────────────
type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

interface Booking {
  id: string;
  craftsmanId: string;
  craftsmanName: string;
  karigarUid: string;
  date: string;
  slot: string;
  status: BookingStatus;
  createdAt: any;
  notes?: string;
  amount?: string;
  karigarPhone?: string;
  karigarWhatsapp?: string;
}

interface CustomerNotif {
  id: string;
  bookingId: string;
  karigarName: string;
  date: string;
  slot: string;
  newStatus: BookingStatus;
  read: boolean;
  createdAt: any;
  karigarPhone?: string;
  karigarWhatsapp?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const ORG = "hsl(22 100% 45%)";

const MANDALA_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.07' stroke-width='0.8'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cline x1='30' y1='8' x2='30' y2='52'/%3E%3Cline x1='8' y1='30' x2='52' y2='30'/%3E%3Cline x1='14' y1='14' x2='46' y2='46'/%3E%3Cline x1='46' y1='14' x2='14' y2='46'/%3E%3C/g%3E%3C/svg%3E")`;

const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    dot: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Awaiting Confirmation",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Hourglass,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  active: {
    label: "Active",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: TrendingUp,
  },
  completed: {
    label: "Completed",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
    icon: Star,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const formatDate = (ts: any): string => {
  if (!ts) return "—";
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

// ── WhatsApp Button ───────────────────────────────────────────────────────────
const WhatsAppButton = ({
  phone,
  message,
}: {
  phone: string;
  message: string;
}) => {
  const cleaned = phone.replace(/\D/g, "");
  const num = cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 px-5 py-3 font-display text-xs uppercase tracking-[1.5px] text-white transition-all hover:opacity-90 active:scale-95"
      style={{
        background: "#25D366",
        boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
};

// ── Confirmation Banner ───────────────────────────────────────────────────────
const ConfirmationBanner = ({
  notif,
  booking,
  onDismiss,
}: {
  notif: CustomerNotif;
  booking: Booking | undefined;
  onDismiss: (id: string) => void;
}) => {
  const phone =
    notif.karigarWhatsapp ||
    notif.karigarPhone ||
    booking?.karigarWhatsapp ||
    booking?.karigarPhone;
  const waMessage = `Namaste! I'm confirming my visit booking with ${notif.karigarName} on ${notif.date} at ${notif.slot}. Looking forward to meeting you!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden border mb-6"
      style={{
        borderColor: "#25D366",
        background:
          "linear-gradient(135deg, hsl(var(--sandstone)) 0%, #f0fdf4 100%)",
        backgroundImage: MANDALA_BG,
        boxShadow: "0 4px 32px rgba(37,211,102,0.12)",
      }}
    >
      {/* left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "#25D366" }}
      />

      {/* dismiss */}
      <button
        onClick={() => onDismiss(notif.id)}
        className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={14} />
      </button>

      <div className="pl-6 pr-10 py-5">
        {/* header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(37,211,102,0.15)" }}
          >
            <CheckCircle2 size={14} style={{ color: "#16a34a" }} />
          </div>
          <div>
            <p
              className="font-display text-xs uppercase tracking-[2px]"
              style={{ color: "#16a34a" }}
            >
              Visit Confirmed
            </p>
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">
              {notif.karigarName} has accepted your booking
            </p>
          </div>
          <Sparkles size={13} className="ml-auto text-amber-400" />
        </div>

        {/* divider */}
        <div className="border-t border-dashed border-emerald-200 mb-4" />

        {/* details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { icon: User, label: "Artisan", value: notif.karigarName },
            { icon: Calendar, label: "Date", value: notif.date },
            { icon: Clock, label: "Time Slot", value: notif.slot },
            { icon: MapPin, label: "Location", value: "Artisan's Studio" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/60 border border-emerald-100 px-3 py-2.5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={10} className="text-emerald-600" />
                <span className="font-body text-[9px] uppercase tracking-[1.5px] text-muted-foreground">
                  {label}
                </span>
              </div>
              <p className="font-display text-xs text-heritage-heading truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="flex flex-wrap items-center gap-3">
          {phone ? (
            <WhatsAppButton phone={phone} message={waMessage} />
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-emerald-300 font-body text-xs text-muted-foreground">
              <MessageCircle size={12} />
              Contact details not shared yet
            </div>
          )}
          <p className="font-body text-[10px] text-muted-foreground">
            Reach out to the artisan to confirm final details
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ── Booking Card ───────────────────────────────────────────────────────────────
const BookingCard = ({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick: () => void;
}) => {
  const cfg = STATUS_CONFIG[booking.status];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="border cursor-pointer hover:shadow-md transition-all group"
      style={{
        borderColor: "hsl(var(--gold) / 0.25)",
        background: "hsl(var(--sandstone))",
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-base text-heritage-heading group-hover:text-heritage-gold transition-colors">
              {booking.craftsmanName}
            </h3>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Booked on {formatDate(booking.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-body uppercase tracking-[1px] border ${cfg.color} ${cfg.bg} ${cfg.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={11} className="text-gold flex-shrink-0" />
            <span className="font-body text-xs text-muted-foreground">
              {booking.date || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={11} className="text-gold flex-shrink-0" />
            <span className="font-body text-xs text-muted-foreground">
              {booking.slot || "—"}
            </span>
          </div>
          {booking.amount && (
            <div className="flex items-center gap-2">
              <IndianRupee size={11} className="text-gold flex-shrink-0" />
              <span className="font-body text-xs text-muted-foreground">
                {booking.amount}
              </span>
            </div>
          )}
        </div>

        {booking.status === "confirmed" && (
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-2">
            <CheckCircle2 size={11} style={{ color: "#16a34a" }} />
            <span className="font-body text-[10px] text-emerald-700">
              Your visit has been confirmed by the artisan
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Detail Modal ───────────────────────────────────────────────────────────────
const DetailModal = ({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) => {
  const cfg = STATUS_CONFIG[booking.status];
  const phone = booking.karigarWhatsapp || booking.karigarPhone;
  const waMessage = `Namaste! I'm confirming my visit booking with ${booking.craftsmanName} on ${booking.date} at ${booking.slot}. Looking forward to the experience!`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border overflow-hidden"
        style={{
          background: "hsl(var(--sandstone))",
          backgroundImage: MANDALA_BG,
          borderColor: "hsl(var(--gold) / 0.4)",
        }}
      >
        {/* header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "hsl(var(--gold)/0.2)" }}
        >
          <div>
            <h2 className="font-display text-lg text-heritage-heading">
              {booking.craftsmanName}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 mt-1 text-[10px] font-body uppercase tracking-[1px] ${cfg.color}`}
            >
              <cfg.icon size={10} /> {cfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 space-y-3">
          {[
            { icon: Calendar, label: "Date", value: booking.date },
            { icon: Clock, label: "Time Slot", value: booking.slot },
            { icon: MapPin, label: "Location", value: "Artisan's Studio" },
            {
              icon: IndianRupee,
              label: "Amount",
              value: booking.amount || "Pay at Visit",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className="w-7 h-7 border flex items-center justify-center flex-shrink-0"
                style={{ borderColor: "hsl(var(--gold)/0.3)" }}
              >
                <Icon size={12} className="text-gold" />
              </div>
              <div>
                <p className="font-body text-[9px] uppercase tracking-[1.5px] text-muted-foreground">
                  {label}
                </p>
                <p className="font-display text-sm text-heritage-heading">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp section for confirmed */}
        {(booking.status === "confirmed" || booking.status === "active") && (
          <div
            className="px-6 pb-5 pt-2 border-t"
            style={{ borderColor: "hsl(var(--gold)/0.15)" }}
          >
            <p className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground mb-3">
              Connect with artisan
            </p>
            {phone ? (
              <WhatsAppButton phone={phone} message={waMessage} />
            ) : (
              <p className="font-body text-xs text-muted-foreground italic">
                Artisan contact not available yet.
              </p>
            )}
          </div>
        )}

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 font-display text-xs uppercase tracking-[1.5px] border text-heritage-heading hover:text-heritage-gold hover:border-gold transition-all"
            style={{ borderColor: "hsl(var(--gold)/0.3)" }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function MyBookings() {
  const { creamBg } = useBackground();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotif[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Booking | null>(null);

  const unsubBookings = useRef<(() => void) | null>(null);
  const unsubNotifs = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/", { state: { openLogin: true } });
        return;
      }

      // Real-time bookings
      unsubBookings.current = onSnapshot(
        query(collection(db, "bookings"), where("customerUid", "==", user.uid)),
        (snap) => {
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Booking[];
          data.sort((a, b) => {
            const at = a.createdAt?.toDate?.() ?? new Date(0);
            const bt = b.createdAt?.toDate?.() ?? new Date(0);
            return bt.getTime() - at.getTime();
          });
          setBookings(data);
          setLoading(false);
        },
        () => setLoading(false),
      );

      // Real-time customer notifications
      unsubNotifs.current = onSnapshot(
        query(
          collection(db, "customerNotifications"),
          where("customerUid", "==", user.uid),
        ),
        (snap) => {
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as CustomerNotif[];
          // Only show confirmed/cancelled notifications that are unread
          const visible = data
            .filter(
              (n) =>
                !n.read &&
                (n.newStatus === "confirmed" || n.newStatus === "cancelled"),
            )
            .sort((a, b) => {
              const at = a.createdAt?.toDate?.() ?? new Date(0);
              const bt = b.createdAt?.toDate?.() ?? new Date(0);
              return bt.getTime() - at.getTime();
            });
          setNotifications(visible);
        },
      );
    });

    return () => {
      unsub();
      unsubBookings.current?.();
      unsubNotifs.current?.();
    };
  }, [navigate]);

  const dismissNotif = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await updateDoc(doc(db, "customerNotifications", id), { read: true });
    } catch {
      /* silent */
    }
  };

  const confirmedNotifs = notifications.filter(
    (n) => n.newStatus === "confirmed",
  );
  const cancelledNotifs = notifications.filter(
    (n) => n.newStatus === "cancelled",
  );

   if (loading)
   return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
         <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
   );

  return (
    <>
      <div style={{ ...creamBg, minHeight: "100vh" }}>
        {/* ── HERO ── */}
        <div className="bg-ink relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: MANDALA_BG, opacity: 0.4 }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(22 100% 45% / 0.5), transparent)",
            }}
          />
          <div className="container-heritage px-4 pt-10 pb-12 relative z-10">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[2px] text-parchment/35 hover:text-parchment transition-colors mb-8"
            >
              <ArrowLeft size={12} /> Back to Discover
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-px w-5" style={{ background: `${ORG}99` }} />
              <span
                className="font-body text-[10px] uppercase tracking-[3px]"
                style={{ color: ORG }}
              >
                Your Journey
              </span>
            </div>
            <h1 className="font-display text-4xl text-parchment leading-tight">
              My Bookings
            </h1>
            <p className="font-body text-sm text-parchment/45 mt-1">
              Track your artisan visits
            </p>
          </div>
        </div>

        <div className="container-heritage px-4 py-10">
          {/* ── Confirmed banners ── */}
          <AnimatePresence>
            {confirmedNotifs.map((notif) => (
              <ConfirmationBanner
                key={notif.id}
                notif={notif}
                booking={bookings.find((b) => b.id === notif.bookingId)}
                onDismiss={dismissNotif}
              />
            ))}
          </AnimatePresence>

          {/* ── Cancelled banners ── */}
          <AnimatePresence>
            {cancelledNotifs.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative border mb-4 pl-6 pr-10 py-4"
                style={{ borderColor: "#fca5a5", background: "#fff5f5" }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400" />
                <button
                  onClick={() => dismissNotif(notif.id)}
                  className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
                <div className="flex items-center gap-2">
                  <XCircle size={13} className="text-red-500" />
                  <p className="font-display text-xs uppercase tracking-[1.5px] text-red-700">
                    Booking Cancelled
                  </p>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Your booking with{" "}
                  <span className="font-semibold">{notif.karigarName}</span> on{" "}
                  {notif.date} at {notif.slot} was cancelled.
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ── Bookings list ── */}
          {bookings.length === 0 ? (
            <div className="text-center py-24">
              <Calendar size={32} className="text-gold/40 mx-auto mb-4" />
              <h2 className="font-display text-xl text-heritage-heading mb-2">
                No Bookings Yet
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Explore artisans and book a visit to start your heritage
                journey.
              </p>
              <Link to="/discover" className="btn-primary inline-block">
                Discover Artisans
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onClick={() => setDetail(b)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {detail && (
          <DetailModal booking={detail} onClose={() => setDetail(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

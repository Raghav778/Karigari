import { useState , useEffect } from "react";
import { useBackground } from "@/hooks/useBackground";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  LogIn,
  Clock,
} from "lucide-react";
import { craftsmen, mapFirestoreKarigarToCraftsman, type Craftsman } from "@/data/craftsmen";
import { getCraftImage } from "@/lib/craftImages";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const BookingPage = () => {
  const { creamBg } = useBackground();
  const { id } = useParams();
  const navigate = useNavigate();

  const [chosenId, setChosenId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date());
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [firestoreArtisans, setFirestoreArtisans] = useState<Craftsman[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDocs(
      query(collection(db, "craftsmen"), where("status", "==", "approved")),
    ).then((snap) => {
      const docs = snap.docs.map((d) =>
        mapFirestoreKarigarToCraftsman(d.id, d.data()),
      );
      setFirestoreArtisans(docs);
    });
  }, []);

  useEffect(() => {
    if (id && firestoreArtisans.length > 0) {
      const found = firestoreArtisans.find((c) => c.id === id);
      if (found) setChosenId(found.id);
    }
  }, [id, firestoreArtisans]);

  const allCraftsmen = firestoreArtisans;

  const craftsman = allCraftsmen.find((c) => c.id === chosenId);

  const slots = [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "2:00 PM",
    "3:30 PM",
    "5:00 PM",
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
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

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const prevMonth = () => setActiveMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setActiveMonth(new Date(year, month + 1, 1));

  const confirmedDate =
    selectedDate !== null
      ? new Date(year, month, selectedDate).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const handleChooseArtisan = (id: string) => {
    setChosenId(id);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBooked(false);
  };

  const handleConfirm = async () => {
    if (selectedDate === null || !selectedSlot || !craftsman) return;

    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => {
        setShowLoginPrompt(false);
        setLoginOpen(true);
      }, 1800);
      return;
    }

    setSaving(true);
    try {
      // ── Always fetch the karigar doc fresh to get the real userId ──────────
      // craftsman.userId can be stale/empty for seeded artisans
      let karigarUid = craftsman.userId || "";
      if (!karigarUid || karigarUid === "admin_seeded") {
        try {
          const snap = await getDoc(doc(db, "craftsmen", craftsman.id));
          if (snap.exists()) {
            karigarUid = snap.data().userId || "";
          }
        } catch {
          // non-fatal — karigarUid stays empty, dashboard won't show it
          // but MyBookings still will
        }
      }

      await addDoc(collection(db, "bookings"), {
        // ── Karigar identifiers (both, for reliable querying) ──────────────
        craftsmanId:   craftsman.id,          // doc ID — used in dashboard query
        craftsmanName: craftsman.name ?? "",
        karigarUid:    karigarUid,             // auth UID — fallback query
        karigarName:   craftsman.name ?? "",

        // ── Customer info ──────────────────────────────────────────────────
        customerUid:   user.uid,
        customerName:  user.displayName || user.email?.split("@")[0] || "Guest",
        customerEmail: user.email || "",

        // ── Booking details ────────────────────────────────────────────────
        date:          confirmedDate,
        slot:          selectedSlot,
        status:        "pending",
        seenByKarigar: false,
        createdAt:     serverTimestamp(),
      });

      setBooked(true);
    } catch (err: any) {
      console.error("❌ Booking failed:", err);
      alert("Booking failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={creamBg}>
      <div className="container-heritage px-4 py-10">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={14} /> Back to Discover
        </Link>

        <h1 className="font-display text-3xl text-heritage-heading mb-2">
          Book a Visit
        </h1>
        <div className="gold-divider !mx-0 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* LEFT — artisan picker + calendar */}
          <div className="space-y-8">
            {/* Step 1: Pick an artisan */}
            <div>
              <h2 className="font-display text-lg text-heritage-heading mb-4">
                Step 1 — Choose an Artisan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allCraftsmen.map((c) => {
                  const img = getCraftImage(c.image);
                  const isChosen = chosenId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleChooseArtisan(c.id)}
                      className={
                        "w-full text-left flex items-center gap-4 p-4 border transition-all " +
                        (isChosen
                          ? "border-gold bg-sandstone shadow-sm"
                          : "border-gold/20 hover:border-gold/50")
                      }
                    >
                      <img
                        src={img}
                        alt={c.name}
                        className="w-14 h-14 object-cover rounded-sm border border-gold/20"
                      />
                      <div>
                        <p className="font-display text-sm text-heritage-heading">
                          {c.name}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {c.craft}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {c.location || c.region}
                        </p>
                      </div>
                      {isChosen && (
                        <Check
                          size={16}
                          className="ml-auto text-gold flex-shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Calendar */}
            {craftsman && (
              <div>
                <h2 className="font-display text-lg text-heritage-heading mb-4">
                  Step 2 — Choose a Date
                </h2>

                {/* Month nav */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-sandstone rounded-sm transition-colors"
                  >
                    <ChevronLeft size={16} className="text-muted-foreground" />
                  </button>
                  <p className="font-display text-sm text-heritage-heading">
                    {activeMonth.toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-sandstone rounded-sm transition-colors"
                  >
                    <ChevronRight
                      size={16}
                      className="text-muted-foreground"
                    />
                  </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div
                      key={d}
                      className="text-center font-body text-xs text-muted-foreground py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((date, i) => {
                    if (!date)
                      return <div key={`empty-${i}`} className="h-9" />;
                    const isPast = date < today;
                    const isSelected =
                      selectedDate === date.getDate() &&
                      date.getMonth() === month &&
                      date.getFullYear() === year;
                    return (
                      <button
                        key={date.toISOString()}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedDate(date.getDate());
                          setSelectedSlot(null);
                        }}
                        className={
                          "h-9 w-full text-center font-body text-sm rounded-sm transition-all " +
                          (isPast
                            ? "text-muted-foreground/30 cursor-not-allowed"
                            : isSelected
                              ? "bg-gold text-white font-semibold"
                              : "hover:bg-sandstone text-foreground")
                        }
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Time slot */}
            {craftsman && selectedDate !== null && (
              <div>
                <h2 className="font-display text-lg text-heritage-heading mb-4">
                  Step 3 — Choose a Time
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={
                        "py-2.5 font-body text-sm border transition-all " +
                        (selectedSlot === slot
                          ? "border-gold bg-sandstone text-heritage-heading"
                          : "border-gold/20 hover:border-gold/50 text-muted-foreground")
                      }
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — booking summary */}
          <div>
            <div className="border border-gold/25 bg-sandstone p-6 sticky top-24">
              <h2 className="font-display text-lg text-heritage-heading mb-4">
                Booking Summary
              </h2>
              <div className="gold-divider !mx-0 mb-4" />

              {!craftsman ? (
                <p className="font-body text-sm text-muted-foreground">
                  Select an artisan to get started.
                </p>
              ) : (
                <>
                  {booked ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-6"
                    >
                      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center border-2 border-amber-400 rounded-full">
                        <Clock size={26} className="text-amber-500" />
                      </div>
                      <h3 className="font-display text-xl text-amber-600 mb-2">
                        Request Sent!
                      </h3>
                      <p className="font-body text-sm text-muted-foreground mb-1">
                        {confirmedDate} at {selectedSlot}
                      </p>
                      <p className="font-body text-sm text-muted-foreground mb-1">
                        with {craftsman.name}
                      </p>
                      <div className="gold-divider my-4" />
                      <p className="font-body text-sm text-amber-700 mb-4">
                        ⏳ Pending approval from the artisan. Check{" "}
                        <Link
                          to="/my-bookings"
                          className="underline text-amber-800 font-semibold"
                        >
                          My Bookings
                        </Link>{" "}
                        for updates.
                      </p>
                      <p className="font-body text-xs text-muted-foreground mb-4">
                        Payment to be made directly at the time of visit.
                      </p>
                      <button
                        onClick={() => {
                          setBooked(false);
                          setChosenId(null);
                          setSelectedDate(null);
                          setSelectedSlot(null);
                        }}
                        className="btn-secondary text-sm w-full"
                      >
                        Book Another
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={getCraftImage(craftsman.image)}
                          alt={craftsman.name}
                          className="w-12 h-12 object-cover border border-gold rounded-sm"
                        />
                        <div>
                          <p className="font-display text-sm text-heritage-heading">
                            {craftsman.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground">
                            {craftsman.craft} · {craftsman.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span className="text-heritage-heading font-semibold">
                            {selectedDate ? confirmedDate : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">Time</span>
                          <span className="text-heritage-heading font-semibold">
                            {selectedSlot ?? "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">
                            Payment
                          </span>
                          <span className="text-heritage-heading">
                            Pay at visit
                          </span>
                        </div>
                      </div>

                      {showLoginPrompt && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mb-4 flex items-center gap-2 p-3 border border-amber-300 bg-amber-50 text-amber-700 font-body text-sm rounded-sm"
                        >
                          <LogIn size={14} />
                          Please sign in to confirm your booking.
                        </motion.div>
                      )}

                      <button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedSlot || saving}
                        className={`w-full btn-primary py-3 transition-all ${
                          !selectedDate || !selectedSlot || saving
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {saving
                          ? "Saving…"
                          : !selectedDate
                            ? "Pick a date"
                            : !selectedSlot
                              ? "Pick a time"
                              : "Confirm Booking"}
                      </button>

                      {(!selectedDate || !selectedSlot) && (
                        <p className="font-body text-xs text-muted-foreground text-center mt-3">
                          {!selectedDate
                            ? "Please select a date"
                            : "Please select a time slot"}
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default BookingPage;
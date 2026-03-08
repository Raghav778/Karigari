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
  if (selectedDate === null || !selectedSlot) return;

  if (!user) {
    setShowLoginPrompt(true);
    setTimeout(() => {
      setShowLoginPrompt(false);
      setLoginOpen(true);
    }, 1800);
    return;
  }

  console.log("🔥 handleConfirm fired");
  console.log("user.uid:", user.uid);
  console.log("craftsman id:", craftsman?.id);

  try {
    const karigarUid = craftsman?.userId || "";
    const karigarName = craftsman?.name || "";

    const bookingRef = await addDoc(collection(db, "bookings"), {
      craftsmanId: craftsman?.id ?? "",
      craftsmanName: craftsman?.name ?? "",
      karigarUid: karigarUid,
      karigarName,
      customerUid: user.uid,
      customerName: user.displayName || "Guest",
      customerEmail: user.email || "",
      date: confirmedDate,
      slot: selectedSlot,
      status: "pending",
      seenByKarigar: false,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Booking saved! ID:", bookingRef.id);
    setBooked(true);
  } catch (err: any) {
    console.error("❌ Booking failed:", err);
    alert("Booking failed: " + err.message);
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
                          ? "border-gold bg-sandstone"
                          : "border-gold/40 bg-sandstone/50 hover:border-gold hover:bg-sandstone")
                      }
                    >
                      <img
                        src={img}
                        alt={c.name}
                        className="w-14 h-14 object-cover rounded-sm border border-gold/30 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-display text-sm text-heritage-heading truncate">
                          {c.name}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {c.craft}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          {c.location}, {c.region}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star
                            size={10}
                            className="text-gold"
                            fill="currentColor"
                          />
                          <span className="font-body text-xs text-gold">
                            {c.rating}
                          </span>
                        </div>
                      </div>
                      {isChosen && (
                        <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                          <Check size={12} className="text-ink" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pick a date */}
            {chosenId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display text-lg text-heritage-heading mb-4">
                  Step 2 — Select a Date
                </h2>
                <div className="bg-sandstone border border-gold p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-base text-heritage-heading">
                      {activeMonth.toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={prevMonth}
                        className="w-8 h-8 flex items-center justify-center border border-gold hover:bg-parchment transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="w-8 h-8 flex items-center justify-center border border-gold hover:bg-parchment transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
                      <div
                        key={i}
                        className="text-center font-body text-xs text-muted-foreground py-1"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((date, i) => {
                      if (!date) return <div key={i} />;
                      const isPast = date < today;
                      const isSelected =
                        selectedDate === date.getDate() &&
                        activeMonth.getMonth() === month &&
                        activeMonth.getFullYear() === year;
                      const isToday = isSameDay(date, today);

                      let cls =
                        "w-full aspect-square flex items-center justify-center rounded-full font-body text-sm transition-all ";
                      if (isPast)
                        cls += "text-muted-foreground/30 cursor-not-allowed ";
                      else cls += "hover:bg-gold/20 cursor-pointer ";
                      if (isSelected) cls += "bg-gold text-ink font-bold ";
                      else if (isToday)
                        cls += "border border-gold text-gold font-semibold ";

                      return (
                        <button
                          key={i}
                          disabled={isPast}
                          onClick={() => {
                            setSelectedDate(date.getDate());
                            setSelectedSlot(null);
                          }}
                          className={cls}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Pick time slot */}
            {selectedDate !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display text-lg text-heritage-heading mb-4">
                  Step 3 — Select a Time
                </h2>
                <div className="bg-sandstone border border-gold p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {slots.map((s) => {
                      const cls =
                        "py-3 border font-body text-sm transition-all " +
                        (selectedSlot === s
                          ? "bg-gold text-ink border-gold font-semibold"
                          : "border-gold hover:bg-parchment");
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={cls}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT — summary + confirm */}
          <div className="space-y-6">
            <div className="bg-sandstone border border-gold p-6 sticky top-24">
              <h2 className="font-display text-lg text-heritage-heading mb-4">
                Booking Summary
              </h2>
              <div className="gold-divider !mx-0 mb-4" />

              {!craftsman ? (
                <p className="font-body text-sm text-muted-foreground">
                  No artisan selected yet.
                </p>
              ) : (
                <>
                  {booked ? (
                    <motion.div
                      className="text-center py-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center border-2 border-amber-400 rounded-full">
                        <Clock size={28} className="text-amber-500" />
                      </div>
                      <h3 className="font-display text-xl text-amber-600 mb-2">
                        Request Sent!
                      </h3>
                      <p className="font-body text-sm text-muted-foreground mb-1">
                        {craftsman.name}
                      </p>
                      <p className="font-body text-sm text-muted-foreground mb-1">
                        {confirmedDate}
                      </p>
                      <p className="font-body text-sm text-muted-foreground mb-4">
                        {selectedSlot}
                      </p>
                      <div className="gold-divider mb-4" />
                      <p className="font-body text-sm text-amber-700 font-medium mb-2">
                        ⏳ Awaiting artisan approval
                      </p>
                      <p className="font-body text-xs text-muted-foreground mb-6">
                        The artisan will review your request and confirm within
                        2–3 days. Payment to be made directly at the time of
                        visit.
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
                          <span className="text-muted-foreground">Payment</span>
                          <span className="text-heritage-heading font-semibold">
                            Pay at Visit
                          </span>
                        </div>
                      </div>

                      {/* Login prompt toast */}
                      <AnimatePresence>
                        {showLoginPrompt && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className="mb-4 flex items-center gap-3 px-4 py-3 bg-[#fdf4ec] border border-[#e8740e]/50"
                          >
                            <div className="w-7 h-7 flex-shrink-0 rounded-full bg-[#e8740e]/10 flex items-center justify-center">
                              <LogIn size={14} className="text-[#e8740e]" />
                            </div>
                            <div>
                              <p className="font-display text-xs text-heritage-heading">
                                Sign in required
                              </p>
                              <p className="font-body text-xs text-muted-foreground">
                                Opening login…
                              </p>
                            </div>
                            <div className="ml-auto">
                              <motion.div
                                className="h-0.5 bg-[#e8740e] origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.8, ease: "linear" }}
                                style={{ width: "40px" }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        disabled={!selectedDate || !selectedSlot}
                        onClick={handleConfirm}
                        className={
                          "w-full btn-primary " +
                          (!selectedDate || !selectedSlot
                            ? "opacity-40 cursor-not-allowed"
                            : "")
                        }
                      >
                        Confirm Booking
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

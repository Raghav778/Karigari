import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, IndianRupee, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51T8YpRRj7rA7YHoQlG3vxW8iYNKWavJlM8zuBQtjJ0fVRkQtFTWFoQ0uPHAayn9Z7uIDyTZ9eOZnINTzMiWPIlkp00Nx8YLlkO");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "14px",
      color: "hsl(20, 40%, 18%)",
      "::placeholder": { color: "hsl(20, 20%, 60%)" },
      iconColor: "hsl(22, 100%, 48%)",
    },
    invalid: { color: "#e53e3e", iconColor: "#e53e3e" },
  },
};

function CheckoutForm({
  amount,
  name,
  email,
  onSuccess,
}: {
  amount: number;
  name: string;
  email: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim().includes("@")) { setError("Please enter a valid email."); return; }
    if (!amount || amount < 1) { setError("Please enter an amount to contribute."); return; }

    setError("");
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) { setLoading(false); return; }

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name, email },
    });

    if (pmError) {
      setError(pmError.message || "Card error. Please try again.");
      setLoading(false);
      return;
    }

    // In production: POST { paymentMethod.id, amount, email } to your backend
    // which creates a PaymentIntent using the secret key and confirms it.
    // Below simulates a successful payment for frontend demo purposes.
    console.log("PaymentMethod created:", paymentMethod.id);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div>
      <div
        className="mb-5 px-4 py-3"
        style={{
          background: "hsl(40 55% 97%)",
          border: "1px solid hsl(46 55% 65% / 0.6)",
          borderRadius: "6px",
        }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <p className="font-body text-xs text-red-500 mb-3 text-center">{error}</p>
      )}

      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="w-full py-3.5 font-display text-sm uppercase tracking-[2px] transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: loading
            ? "hsl(22 60% 60%)"
            : "linear-gradient(135deg, hsl(22 100% 48%), hsl(16 100% 45%))",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: loading || !stripe ? "not-allowed" : "pointer",
          boxShadow: "0 4px 20px hsl(22 100% 48% / 0.35)",
        }}
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Processing…</>
        ) : (
          <>
            <Heart size={15} />
            {amount >= 1 ? `Contribute ₹${amount.toLocaleString("en-IN")}` : "Contribute"}
          </>
        )}
      </button>

      <p className="font-body text-[10px] text-center mt-3" style={{ color: "hsl(20 30% 50%)" }}>
        🔒 Secured by Stripe · Cards, UPI & more accepted
      </p>
    </div>
  );
}

interface ContributeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContributeModal({ open, onClose }: ContributeModalProps) {
  const [amount, setAmount]   = useState("");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setName("");
      setEmail("");
      setSuccess(false);
    }
  }, [open]);

  const parsedAmount = parseInt(amount, 10) || 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "hsl(20 40% 8% / 0.72)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div
              className="relative w-full max-w-md overflow-hidden"
              style={{
                background: "linear-gradient(160deg, hsl(40 55% 96%) 0%, hsl(35 38% 90%) 100%)",
                border: "1px solid hsl(46 55% 70% / 0.65)",
                borderRadius: "20px",
                boxShadow: "0 24px 80px hsl(20 40% 8% / 0.35), inset 0 1px 0 hsl(46 100% 80% / 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold top bar */}
              <div style={{ height: "4px", background: "linear-gradient(to right, hsl(15 50% 22%), hsl(46 100% 50%), hsl(15 50% 22%))" }} />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-black/10"
                style={{ color: "hsl(20 40% 28%)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>

              <div className="p-7">
                {!success ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                        style={{ background: "hsl(22 100% 50% / 0.12)", border: "1px solid hsl(22 100% 50% / 0.3)" }}
                      >
                        <Heart size={22} style={{ color: "hsl(22 100% 48%)" }} />
                      </div>
                      <h2 className="font-display text-xl uppercase tracking-[2px] mb-1" style={{ color: "hsl(20 40% 18%)" }}>
                        Contribute to the Legacy
                      </h2>
                      <p className="font-body text-sm" style={{ color: "hsl(20 30% 38%)" }}>
                        Every rupee helps document & preserve disappearing craft traditions.
                      </p>
                    </div>

                    {/* Amount input */}
                    <p className="font-display text-[10px] uppercase tracking-[2px] mb-2" style={{ color: "hsl(20 40% 28%)" }}>
                      Enter Amount
                    </p>
                    <div className="relative mb-5">
                      <IndianRupee
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: "hsl(20 40% 45%)" }}
                      />
                      <input
                        type="number"
                        min={1}
                        placeholder="e.g. 250"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 font-body text-base focus:outline-none transition-all"
                        style={{
                          background: "hsl(40 55% 97%)",
                          border: amount
                            ? "1.5px solid hsl(22 100% 48%)"
                            : "1px solid hsl(46 55% 65% / 0.6)",
                          borderRadius: "8px",
                          color: "hsl(20 40% 18%)",
                          fontWeight: "600",
                          letterSpacing: "0.02em",
                        }}
                      />
                    </div>

                    {/* Name & Email */}
                    <div className="space-y-3 mb-5">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 font-body text-sm focus:outline-none transition-all"
                        style={{
                          background: "hsl(40 55% 97%)",
                          border: "1px solid hsl(46 55% 65% / 0.6)",
                          borderRadius: "6px",
                          color: "hsl(20 40% 18%)",
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Your Email *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 font-body text-sm focus:outline-none transition-all"
                        style={{
                          background: "hsl(40 55% 97%)",
                          border: "1px solid hsl(46 55% 65% / 0.6)",
                          borderRadius: "6px",
                          color: "hsl(20 40% 18%)",
                        }}
                      />
                    </div>

                    {/* Stripe card + pay button */}
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        amount={parsedAmount}
                        name={name}
                        email={email}
                        onSuccess={() => setSuccess(true)}
                      />
                    </Elements>
                  </>
                ) : (
                  /* Success screen */
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                      style={{ background: "hsl(142 60% 94%)", border: "2px solid hsl(142 60% 60%)" }}
                    >
                      <CheckCircle2 size={32} style={{ color: "hsl(142 60% 40%)" }} />
                    </motion.div>
                    <h3 className="font-display text-lg uppercase tracking-[2px] mb-2" style={{ color: "hsl(20 40% 18%)" }}>
                      Thank You, {name}!
                    </h3>
                    <p className="font-body text-sm mb-1" style={{ color: "hsl(20 30% 38%)" }}>
                      Your contribution of{" "}
                      <strong>₹{parsedAmount.toLocaleString("en-IN")}</strong> has been received.
                    </p>
                    <p className="font-body text-xs mb-6" style={{ color: "hsl(20 30% 50%)" }}>
                      You're helping preserve India's disappearing craft traditions.
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} size={12} style={{ color: "hsl(46 100% 50%)" }} />
                      ))}
                    </div>
                    <button
                      onClick={onClose}
                      style={{
                        border: "1px solid hsl(46 55% 65%)",
                        borderRadius: "6px",
                        color: "hsl(20 40% 28%)",
                        background: "transparent",
                        cursor: "pointer",
                        padding: "8px 24px",
                      }}
                      className="font-display text-xs uppercase tracking-[2px]"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
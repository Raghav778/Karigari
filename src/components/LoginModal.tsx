import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, Phone } from "lucide-react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}


type Method = "email" | "phone";

const LoginModal = ({ isOpen, onClose, message }: LoginModalProps) => {
  const navigate = useNavigate();
  const { triggerWelcome } = useAuth();
  const [method, setMethod] = useState<Method>("email");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  

  // Helper to fetch user name from Firestore
  const fetchNameAndWelcome = async (uid: string, fallback: string) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      const name = snap.exists() ? snap.data().name || fallback : fallback;
      triggerWelcome(name);
    } catch {
      triggerWelcome(fallback);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      await fetchNameAndWelcome(
        credential.user.uid,
        credential.user.email ?? "User",
      );
      onClose();
      navigate("/");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password"
      ) {
        setError(
          "No account found with these credentials. Please sign up first.",
        );
      } else {
        setError(err.message ?? "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if this user has an existing account in Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        // No prior sign-up record — block login and sign them out
        await signOut(auth);
        setError("No account found. Please sign up first.");
        setLoading(false);
        return;
      }

      // Upsert user record (merge so we don't overwrite existing data)
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
        },
        { merge: true },
      );
      triggerWelcome(user.displayName ?? "User");
      onClose();
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container-modal",
        { size: "invisible" },
      );
    }
  };

  const sendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier,
      );
      (window as any).confirmationResult = confirmationResult;
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await (window as any).confirmationResult.confirm(otp);
      const user = result.user;

      // Check if this phone number has an existing account in Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        // No prior sign-up record — block login and sign them out
        await signOut(auth);
        setError(
          "No account found for this phone number. Please sign up first.",
        );
        setLoading(false);
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          phone: user.phoneNumber,
          createdAt: new Date(),
        },
        { merge: true },
      );
      triggerWelcome(user.displayName ?? "User");
      onClose();
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[200] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-[201] flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <div className="bg-cream rounded-lg p-6 relative w-full max-w-lg">
              {message && (
                <div className="bg-orange-100 text-orange-800 text-sm px-4 py-2 rounded mb-4 text-center">
                  {message}
                </div>
              )}
              <div className="relative w-full max-w-lg bg-sandstone border border-[#e8740e]/40 shadow-2xl overflow-hidden">
                {/* Decorative top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-[#e8740e] via-[#e8740e] to-[#e8740e]" />

                {/* Ornamental pattern strip */}
                <div
                  className="h-8 w-full opacity-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 12px,
                    #b8860b 12px,
                    #b8860b 13px
                  )`,
                  }}
                />

                <div className="px-8 pt-4 pb-8">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-heritage-heading/50 hover:text-[#e8740e] transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>

                  {/* Title */}
                  <div className="text-center mb-6">
                    <p className="font-display text-xs uppercase tracking-[3px] text-[#e8740e] mb-1">
                      Karigarh
                    </p>
                    <h2 className="font-display text-2xl text-heritage-heading tracking-tight">
                      Welcome Back
                    </h2>
                    <p className="font-body text-sm text-heritage-heading/60 mt-1">
                      Sign in to explore living traditions
                    </p>
                  </div>

                  {/* Method switcher */}
                  <div className="flex mb-6 border border-[#e8740e]/40 overflow-hidden">
                    {(["email", "phone"] as Method[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setMethod(m);
                          setError("");
                          setOtpSent(false);
                        }}
                        className={`flex-1 py-2 text-xs font-display uppercase tracking-[2px] transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                          method === m
                            ? "bg-[#e8740e] text-white"
                            : "bg-transparent text-heritage-heading/60 hover:text-heritage-heading"
                        }`}
                      >
                        {m === "phone" && <Phone size={12} />}
                        {m === "email" ? "Email" : "Phone"}
                      </button>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="mb-4 text-xs font-body text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                      {error}
                    </p>
                  )}

                  {/* Email form */}
                  {method === "email" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="w-full border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Your password"
                            className="w-full border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 pr-10 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-heading/40 hover:text-[#e8740e] transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-[#e8740e] text-white font-display text-sm uppercase tracking-[2px] hover:bg-[#d4640a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          "Log In"
                        )}
                      </button>
                    </form>
                  )}

                  {/* Phone form */}
                  {method === "phone" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <span className="flex items-center px-3 border border-[#e8740e]/50 bg-white/60 text-sm font-body text-heritage-heading/60">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10-digit number"
                            className="flex-1 border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                          />
                        </div>
                      </div>

                      {otpSent && (
                        <div>
                          <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                            OTP
                          </label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={loading}
                        onClick={otpSent ? verifyOTP : sendOTP}
                        className="w-full py-3 bg-[#e8740e] text-white font-display text-sm uppercase tracking-[2px] hover:bg-[#d4640a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : otpSent ? (
                          "Verify OTP"
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Google sign-in */}
                  {method === "email" && (
                    <>
                      <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#e8740e]/30" />
                        <span className="font-display text-xs uppercase tracking-[1px] text-heritage-heading/40">
                          or
                        </span>
                        <div className="flex-1 h-px bg-[#e8740e]/30" />
                      </div>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-2.5 border border-[#e8740e]/50 bg-white/60 text-heritage-heading font-body text-sm flex items-center justify-center gap-2 hover:border-[#e8740e] transition-colors disabled:opacity-70"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Continue with Google
                      </button>
                    </>
                  )}

                  <p className="text-center font-body text-xs text-heritage-heading/40 mt-5">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-[#e8740e] hover:underline"
                      onClick={onClose}
                    >
                      Sign up
                    </Link>
                  </p>
                </div>

                {/* Decorative bottom ornament */}
                <div className="pb-5 flex justify-center">
                  <div className="flex gap-1 items-center opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="block w-1 h-1 rounded-full bg-[#e8740e]"
                      />
                    ))}
                  </div>
                </div>

                <div id="recaptcha-container-modal" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};


export default LoginModal;
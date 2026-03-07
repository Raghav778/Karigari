import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useState } from "react";
import { useBackground } from "@/hooks/useBackground";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type Method = "email" | "phone";

const SignUp = () => {
  const { creamBg } = useBackground();
  const navigate = useNavigate();
  const { triggerWelcome } = useAuth();
  const [method, setMethod] = useState<Method>("email");

  // Email fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Phone fields
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already has an account
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        await signOut(auth);
        setError("You already have an account. Please log in instead.");
        return;
      }

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
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
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

      // Check if this phone number already has an account
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        await signOut(auth);
        setError(
          "You already have an account with this number. Please log in instead.",
        );
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        phone: user.phoneNumber,
        createdAt: new Date(),
      });
      triggerWelcome("User");
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }if (password !== confirm) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });

      triggerWelcome(name);
      navigate("/");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError(
          "An account with this email already exists. Please log in instead.",
        );
      } else {
        setError(err.message ?? "Sign-up failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center pt-[70px] px-4 py-10"
      style={creamBg}
    >

      {/* Back link */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[1.5px] text-heritage-heading/50 hover:text-[#e8740e] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      <motion.div
        className="w-full max-w-md bg-sandstone border border-[#e8740e]/40 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        {/* Decorative top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#e8740e] via-[#f59240] to-[#e8740e]" />

        {/* Ornamental strip */}
        <div
          className="h-8 w-full opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 12px,
              #e8740e 12px,
              #e8740e 13px
            )`,
          }}
        />

        <div className="px-8 pt-4 pb-10">
          {/* Title */}
          <div className="text-center mb-6">
            <p className="font-display text-xs uppercase tracking-[3px] text-[#e8740e] mb-1">
              Karigarh
            </p>
            <h1 className="font-display text-2xl text-heritage-heading tracking-tight">
              Create an Account
            </h1>
            <p className="font-body text-sm text-heritage-heading/60 mt-1">
              Join the community of heritage craft guardians
            </p>
          </div>

          {/* Method switcher */}
          <div className="flex mb-6 border border-[#e8740e]/40 overflow-hidden">
            {(["email", "phone"] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex-1 py-2 text-xs font-display uppercase tracking-[2px] transition-colors duration-200 flex items-center justify-center gap-1.5 ${method === m
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
              {error}{" "}
              {error.includes("log in") && (
                <Link
                  to="/?login=true"
                  className="underline font-semibold text-[#e8740e]"
                >
                  Log in here
                </Link>
              )}
            </p>
          )}{/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {method === "email" ? (
              <>
                <div>
                  <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="Create a password"
                      className="w-full border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 pr-10 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-heading/40 hover:text-[#e8740e] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div><div>
                  <label className="block font-display text-xs uppercase tracking-[1.5px] text-heritage-heading mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="Repeat your password"
                      className="w-full border border-[#e8740e]/50 bg-white/60 px-4 py-2.5 pr-10 text-sm font-body text-heritage-heading placeholder:text-heritage-heading/40 focus:outline-none focus:border-[#e8740e] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-heading/40 hover:text-[#e8740e] transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                      required
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
              </>
            )}

            <button
              type={method === "phone" ? "button" : "submit"}
              onClick={
                method === "phone" ? (otpSent ? verifyOTP : sendOTP) : undefined
              }
              disabled={
                loading ||
                (method === "email" && !!confirm && confirm !== password)
              }
              className="w-full py-3 bg-[#e8740e] text-white font-display text-sm uppercase tracking-[2px] hover:bg-[#d4640a] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : method === "phone" ? (
                otpSent ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
                )
              ) : (
                "Create Account"
              )}
            </button>
          </form>{/* Google — email only */}
          {method === "email" && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#e8740e]/20" />
                <span className="font-display text-xs uppercase tracking-[1px] text-heritage-heading/40">
                  or
                </span>
                <div className="flex-1 h-px bg-[#e8740e]/20" />
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 border border-[#e8740e]/50 bg-white/60 text-heritage-heading font-body text-sm flex items-center justify-center gap-2 hover:border-[#e8740e] transition-colors"
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

          <p className="text-center font-body text-xs text-heritage-heading/40 mt-6">
            Already have an account?{" "}
            <Link to="/?login=true" className="text-[#e8740e] hover:underline">
              Log in
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
        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
};

export default SignUp;
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(20 40% 18%), hsl(15 50% 14%), hsl(210 30% 15%))",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mandala ring */}
          <div className="relative mb-8">
            <motion.div
              className="absolute inset-0 w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-dashed animate-spin-slow"
              style={{ borderColor: "hsl(50 100% 50% / 0.5)" }}
            />
            <motion.div
              className="absolute inset-2 w-44 h-44 md:w-60 md:h-60 rounded-full border border-dashed animate-spin-slow"
              style={{
                borderColor: "hsl(46 100% 50% / 0.3)",
                animationDirection: "reverse",
                animationDuration: "12s",
              }}
            />
            <motion.img
              src={logo}
              alt="Karigarh Logo"
              className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl rounded-full ring-4 ring-sun-gold/20"
              style={{ filter: "drop-shadow(0 0 50px hsl(50 100% 50% / 0.5))" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          <motion.p
            className="font-display text-lg md:text-xl tracking-[4px] uppercase"
            style={{ color: "hsl(30 56% 88%)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Ancient Crafts, Timeless Art
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

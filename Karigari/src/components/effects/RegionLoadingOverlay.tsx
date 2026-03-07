import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";

type Region = "Rajasthan" | "Madhya Pradesh" | null;

const mandalaPath =
  "M50 5 L55 20 L70 10 L60 25 L75 25 L62 33 L72 48 L57 40 L60 55 L50 43 L40 55 L43 40 L28 48 L38 33 L25 25 L40 25 L30 10 L45 20 Z";

const gondDots = Array.from({ length: 60 }, (_, i) => ({
  cx: 15 + (i % 10) * 8,
  cy: 15 + Math.floor(i / 10) * 14,
  r: 1.5 + Math.random() * 2,
  delay: Math.random() * 1.5,
}));

const RegionLoadingOverlay = ({
  region,
  onComplete,
}: {
  region: Region;
  onComplete: () => void;
}) => {
  if (!region) return null;

  // automatically complete after fixed time in case animations don't fire
  React.useEffect(() => {
    const handle = setTimeout(onComplete, 2400);
    return () => clearTimeout(handle);
  }, [region, onComplete]);

  return (
    <AnimatePresence>
      {region && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Themed background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                region === "Rajasthan"
                  ? "linear-gradient(135deg, hsl(20 40% 12%), hsl(33 60% 18%), hsl(15 50% 14%))"
                  : "linear-gradient(135deg, hsl(140 25% 12%), hsl(175 40% 16%), hsl(160 30% 10%))",
            }}
          />

          {/* Rajasthan: Desert sand particles */}
          {region === "Rajasthan" && (
            <>
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 2 + Math.random() * 4,
                      height: 2 + Math.random() * 4,
                      background: `hsl(${35 + Math.random() * 15} ${60 + Math.random() * 30}% ${70 + Math.random() * 20}% / ${0.2 + Math.random() * 0.3})`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      x: [0, 30 + Math.random() * 60, -20],
                      y: [0, -20, 10],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 1.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Rajasthan: moving camel silhouette */}
              <motion.div
                className="absolute bottom-10 left-[-20%] w-1/4 opacity-40"
                animate={{ x: [0, "120%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 50" className="w-full h-auto fill-hsl(46,100%,50%)">
                  <path d="M10 40 C20 35,25 20,40 20 C55 20,60 35,70 40 L90 40 L85 25 L75 20 L65 25 L60 15 L50 15 L45 25 L35 20 L25 25 L15 30 Z" />
                </svg>
              </motion.div>
            </>
          )}

          {/* Madhya Pradesh: Gond art SVG pattern */}
          {region === "Madhya Pradesh" && (
            <>
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.08]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {gondDots.map((dot, i) => (
                  <motion.circle
                    key={i}
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.r}
                    fill="hsl(175 60% 55%)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1], scale: [0, 1.2, 0.8, 1] }}
                    transition={{
                      duration: 2,
                      delay: dot.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </svg>

              {/* Madhya Pradesh: floating lotus petals */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-4 bg-hsl(175,50%,80%) rounded-full opacity-80"
                  style={{ left: `${10 + i * 14}%`, bottom: -10 }}
                  animate={{ y: [-5, -80], opacity: [0.8, 0] }}
                  transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </>
          )}

          {/* MP: Narmada river gradient */}
          {region === "Madhya Pradesh" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20"
              style={{
                background:
                  "linear-gradient(0deg, hsl(175 50% 30%), hsl(160 40% 20% / 0), transparent)",
              }}
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
  
            {/* Rajasthan: Fort outline drawing + sun */}
            {region === "Rajasthan" && (
              <div className="relative w-40 h-40">
                <motion.svg viewBox="0 0 120 120" className="w-full h-full">
                  {/* Fort walls path */}
                  <motion.path
                    d="M10 90 L20 60 L30 60 L35 40 L45 40 L50 60 L60 60 L70 40 L80 40 L85 60 L90 60 L100 90 L10 90 Z"
                    fill="none"
                    stroke="hsl(46 80% 40%)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Sun behind fort */}
                  <motion.circle
                    cx="60"
                    cy="40"
                    r="12"
                    fill="hsl(46 100% 60%)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.svg>
                {/* Camel moving */}
                <motion.div
                  className="absolute bottom-0 left-0 w-1/3 opacity-50"
                  animate={{ x: [0, "120%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 100 50" className="w-full h-auto fill-hsl(46,80%,40%)">
                    <path d="M10 40 C20 35,25 20,40 20 C55 20,60 35,70 40 L90 40 L85 25 L75 20 L65 25 L60 15 L50 15 L45 25 L35 20 L25 25 L15 30 Z" />
                  </svg>
                </motion.div>
              </div>
            )}

            {/* Madhya Pradesh: Flowing river icon */}
            {region === "Madhya Pradesh" && (
              <div className="relative w-40 h-40">
                <motion.svg viewBox="0 0 120 120" className="w-full h-full">
                  {/* River curve */}
                  <motion.path
                    d="M10 80 C40 20, 80 140, 110 60"
                    fill="none"
                    stroke="hsl(175 60% 50%)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  {/* Lotus center */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="10"
                    fill="hsl(175 80% 60%)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 1.5, delay: 1, ease: "elastic.out(1,0.5)" }}
                  />
                </motion.svg>
                {/* Floating petals */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-6 h-3 bg-hsl(175,50%,70%) rounded-full opacity-80"
                    style={{ left: `${15 + i * 16}%`, bottom: -10 }}
                    animate={{ y: [-5, -70], opacity: [0.8, 0] }}
                    transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </div>
            )}

            {/* Text animation */}
            <motion.p
              className="font-display text-lg md:text-xl tracking-[3px] uppercase text-center max-w-md px-4"
              style={{
                color:
                  region === "Rajasthan"
                    ? "hsl(46 100% 70%)"
                    : "hsl(175 50% 70%)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {region === "Rajasthan"
                ? "Exploring the Royal Crafts of Rajasthan…"
                : "Discovering the Heart of India's Handicrafts…"}
            </motion.p>

            {/* Progress bar */}
            <div className="w-48 h-[2px] rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    region === "Rajasthan"
                      ? "linear-gradient(90deg, hsl(46 100% 50%), hsl(22 100% 50%))"
                      : "linear-gradient(90deg, hsl(175 60% 50%), hsl(140 50% 40%))",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegionLoadingOverlay;

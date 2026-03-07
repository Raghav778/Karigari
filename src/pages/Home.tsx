import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import { getCraftImage } from "@/lib/craftImages";
import TiltedCard from "@/components/effects/TiltedCard";
import LightRays from "@/components/effects/LightRays";
import { useLanguage } from "@/contexts/languageContext";
import { useBackground } from "@/hooks/useBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <motion.p
        className="font-display text-4xl md:text-5xl text-gold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {value}
      </motion.p>
      <p className="font-body text-sm text-parchment dark:text-white opacity-70 uppercase tracking-[2px]">
        {label}
      </p>
    </div>
  );
};

const testimonials = [
  {
    quote:
      "Each thread I weave carries the prayers of my ancestors. When the loom falls silent, their voices will be lost forever.",
    name: "Rekha Verma",
    role: "Chanderi Weaver, 25 Years",
  },
  {
    quote:
      "My hands have shaped this clay for forty years. The soil remembers what the world forgets.",
    name: "Ramesh Prajapati",
    role: "Blue Pottery Master, Jaipur",
  },
  {
    quote:
      "Every color in my Phad painting is a chapter of our people's history. We are not artists — we are keepers of memory.",
    name: "Shanti Lal Joshi",
    role: "Phad Painter, Bhilwara",
  },
  {
    quote:
      "Bandhani is not just dyeing cloth — it is tying together generations, one knot at a time.",
    name: "Fatima Bi",
    role: "Bandhani Artisan, Jamnagar",
  },
  {
    quote:
      "When I paint the forest, I am not creating — I am remembering. Gond art is the earth speaking through my hands.",
    name: "Durga Bai Vyam",
    role: "Gond Painter, Madhya Pradesh",
  },
];

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(timer);
  }, []);
  const t = testimonials[current];
  return (
    <section className="bg-royal section-spacing relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(50 100% 50%) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="container-heritage relative z-10 text-center max-w-3xl mx-auto">
        <div
          style={{
            minHeight: "220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <blockquote className="font-display italic text-2xl md:text-3xl text-parchment dark:text-white leading-relaxed mb-8">
                "{t.quote}"
              </blockquote>
              <div className="gold-divider mb-6" />
              <p className="font-body text-gold uppercase tracking-[2px] text-sm">
                {t.name}
              </p>
              <p className="font-body text-parchment opacity-50 text-sm">
                {t.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-gold w-6" : "bg-parchment opacity-30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const reviews = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Visiting the Chanderi weavers was a life-changing experience. The craftsmanship is beyond anything I had imagined.",
  },
  {
    name: "Arjun Mehta",
    location: "Delhi",
    rating: 5,
    text: "Karigarh connected me with a Gond artist whose work now hangs in my home. Truly priceless.",
  },
  {
    name: "Fatima Siddiqui",
    location: "Hyderabad",
    rating: 5,
    text: "The Bandhani workshop was immersive and deeply moving. I left with a new appreciation for textile art.",
  },
  {
    name: "Rohan Desai",
    location: "Pune",
    rating: 4,
    text: "Beautifully curated experience. The Blue Pottery studio in Jaipur was a highlight of my entire trip.",
  },
  {
    name: "Ananya Iyer",
    location: "Bangalore",
    rating: 5,
    text: "I booked a Phad painting session and the master artisan's stories were as beautiful as his paintings.",
  },
  {
    name: "Vikram Nair",
    location: "Chennai",
    rating: 5,
    text: "A rare window into India's vanishing crafts. Every rupee spent here goes directly to the artisans.",
  },
  {
    name: "Sneha Kulkarni",
    location: "Nagpur",
    rating: 4,
    text: "The Bagh Print workshop left me in awe. These traditions deserve to be celebrated far and wide.",
  },
  {
    name: "Dev Malhotra",
    location: "Jaipur",
    rating: 5,
    text: "As a local, even I discovered crafts I never knew existed. Karigarh is doing essential work.",
  },
];

const ReviewsSection = () => {
  const [active, setActive] = useState(0);
  const total = reviews.length;
  const direction = useRef(0);
  const { creamBg } = useBackground();

  useEffect(() => {
    const timer = setInterval(() => {
      direction.current = 1;
      setActive((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => {
    direction.current = -1;
    setActive((active - 1 + total) % total);
  };
  const next = () => {
    direction.current = 1;
    setActive((active + 1) % total);
  };
  const getIndex = (offset: number) => (active + offset + total) % total;

  return (
    <section className="pt-24 pb-16 overflow-hidden w-full" style={{ ...creamBg }}>
      <AnimatedSection className="max-w-[1200px] mx-auto px-4 mb-12 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-heritage-heading mb-4">
          What Visitors Say
        </h2>
        <div className="gold-divider" />
      </AnimatedSection>

      <div className="w-full flex items-center gap-4 px-6">
        {/* Prev */}
        <button
          onClick={prev}
          className="flex-shrink-0 font-display text-4xl leading-none transition-all duration-300 hover:scale-125"
          style={{ color: "hsl(14 55% 42%)" }}
        >
          ‹
        </button>

        {/* Cards */}
        <AnimatePresence mode="popLayout" custom={direction.current}>
          <div className="flex flex-1 items-stretch gap-4">
            {[-1, 0, 1].map((offset) => {
              const index = getIndex(offset);
              const r = reviews[index];
              const isActive = offset === 0;

              return (
                <motion.div
                  key={index}
                  custom={direction.current}
                  initial={{
                    opacity: 0,
                    x: direction.current >= 0 ? 120 : -120,
                    scale: 0.92,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: isActive ? -14 : 0,
                    scale: isActive ? 1.07 : 0.97,
                    boxShadow: isActive
                      ? "0 20px 52px hsl(14 60% 42% / 0.20), 0 0 0 1.5px hsl(14 55% 52% / 0.40)"
                      : "0 4px 16px hsl(14 30% 40% / 0.10)",
                  }}
                  exit={{
                    opacity: 0,
                    x: direction.current >= 0 ? -120 : 120,
                    scale: 0.92,
                  }}
                  transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                  onClick={() => setActive(index)}
                  className="relative flex-1 cursor-pointer flex flex-col overflow-hidden"
                  style={{
                    background: isActive ? "hsl(38 55% 95%)" : "hsl(35 30% 97%)",
                    border: isActive
                      ? "2px solid hsl(14 62% 52%)"
                      : "1px solid hsl(14 35% 72% / 0.45)",
                    borderTop: isActive
                      ? "3px solid hsl(14 70% 48%)"
                      : "2px solid hsl(14 45% 68% / 0.45)",
                    padding: "28px",
                  }}
                >
                  {/* Texture 1: linen weave grid */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: isActive ? 0.16 : 0.10,
                      backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 5px, hsl(14 40% 60% / 0.3) 5px, hsl(14 40% 60% / 0.3) 6px),
                        repeating-linear-gradient(90deg, transparent, transparent 5px, hsl(14 40% 60% / 0.18) 5px, hsl(14 40% 60% / 0.18) 6px)
                      `,
                    }}
                  />

                  {/* Texture 2: terracotta dot scatter */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: isActive ? 0.20 : 0.11,
                      backgroundImage:
                        "radial-gradient(circle, hsl(14 55% 55%) 0.75px, transparent 0.75px)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "8px 8px",
                    }}
                  />

                  {/* Texture 3: soft terracotta wash, bottom-right corner */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: isActive
                        ? "radial-gradient(ellipse at 105% 110%, hsl(14 70% 60% / 0.16) 0%, transparent 55%)"
                        : "radial-gradient(ellipse at 105% 110%, hsl(14 55% 60% / 0.07) 0%, transparent 50%)",
                    }}
                  />

                  {/* Active: ivory highlight top-left */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                    style={{
                      background:
                        "radial-gradient(ellipse at -5% -5%, hsl(44 90% 98% / 0.7) 0%, transparent 45%)",
                    }}
                  />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4 relative z-10">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <motion.span
                        key={s}
                        animate={{ fontSize: isActive ? "16px" : "13px" }}
                        transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                        style={{
                          color:
                            s < r.rating
                              ? "hsl(14 70% 48%)"
                              : "hsl(34 25% 78%)",
                        }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  {/* Quote text */}
                  <motion.p
                    className="font-body leading-relaxed italic mb-6 flex-1 relative z-10"
                    animate={{
                      color: isActive ? "hsl(14 22% 22%)" : "hsl(14 12% 40%)",
                    }}
                    transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                    style={{ fontSize: "14px" }}
                  >
                    "{r.text}"
                  </motion.p>

                  {/* Divider line */}
                  <motion.div
                    className="w-8 h-px mb-4 relative z-10"
                    animate={{
                      background: isActive
                        ? "linear-gradient(90deg, hsl(14 70% 48%), transparent)"
                        : "linear-gradient(90deg, hsl(14 35% 65% / 0.55), transparent)",
                    }}
                    transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                  />

                  {/* Name */}
                  <motion.p
                    className="font-display text-xs uppercase tracking-[1px] relative z-10"
                    animate={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "hsl(14 62% 36%)" : "hsl(14 38% 50%)",
                    }}
                    transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                  >
                    {r.name}
                  </motion.p>

                  {/* Location */}
                  <p
                    className="font-body text-xs mt-0.5 relative z-10"
                    style={{
                      color: isActive ? "hsl(14 20% 48%)" : "hsl(14 15% 56%)",
                    }}
                  >
                    {r.location}
                  </p>

                  {/* Decorative large quote mark */}
                  <motion.div
                    className="absolute bottom-3 right-4 font-display text-5xl leading-none pointer-events-none z-10"
                    animate={{ opacity: isActive ? 0.20 : 0.08 }}
                    transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
                    style={{ color: "hsl(14 62% 52%)" }}
                  >
                    "
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Next */}
        <button
          onClick={next}
          className="flex-shrink-0 font-display text-4xl leading-none transition-all duration-300 hover:scale-125"
          style={{ color: "hsl(14 55% 42%)" }}
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-10">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              direction.current = i > active ? 1 : -1;
              setActive(i);
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? "24px" : "8px",
              height: "8px",
              background:
                i === active ? "hsl(14 70% 48%)" : "hsl(14 40% 65% / 0.4)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const { creamBg, isDark } = useBackground();

  return (
    <div>
      <style>{`
        .hero-btn-orange {
          position: relative;
          overflow: hidden;
          padding: 14px 32px;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #fff;
          background: linear-gradient(135deg, hsl(22 100% 50%), hsl(16 100% 48%));
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          box-shadow: 0 4px 18px hsl(22 100% 50% / 0.4);
          white-space: nowrap;
        }
        .hero-btn-orange::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.08) 30%,
            rgba(255,255,255,0.32) 50%,
            rgba(255,255,255,0.08) 70%,
            transparent 100%
          );
          transform: skewX(-20deg);
          transition: left 0.55s ease;
        }
        .hero-btn-orange:hover::before { left: 125%; }
        .hero-btn-orange:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 10px 32px hsl(22 100% 50% / 0.55), 0 0 0 2px hsl(50 100% 65% / 0.35);
          background: linear-gradient(135deg, hsl(25 100% 54%), hsl(19 100% 52%));
        }
        .hero-btn-orange:active { transform: translateY(-1px) scale(1.01); }
      `}</style>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* ← FIX: hero-bg.jpg applied here, not on a color div */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        <div className="absolute inset-0 pointer-events-auto z-[1]">
          <LightRays
            raysOrigin="top-center"
            raysColor="#e8740e"
            raysSpeed={0.6}
            lightSpread={1.5}
            rayLength={2.5}
            pulsating={true}
            fadeDistance={1.2}
            saturation={1.2}
            followMouse={true}
            mouseInfluence={0.15}
            noiseAmount={0.05}
            distortion={0.3}
            className="w-full h-full"
          />
        </div>

        <img
          src={logo}
          alt=""
          className="absolute right-10 bottom-10 w-40 h-40 object-contain rounded-full opacity-[0.04] z-[2]"
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white"
              style={{ marginTop: "-75px", marginBottom: "calc(1.5rem + 40px)" }}
            >
              {t.home.heroTitle.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p
              className="font-body text-lg md:text-xl text-white opacity-80 max-w-2xl mx-auto"
              style={{ marginBottom: "calc(2.5rem + 75px)" }}
            >
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-row gap-8 justify-center items-center flex-wrap">
              <Link
                to={`/region/${encodeURIComponent("Rajasthan")}`}
                className="hero-btn-orange"
              >
                Explore Rajasthan Crafts
              </Link>
              <Link
                to={`/region/${encodeURIComponent("Madhya Pradesh")}`}
                className="hero-btn-orange"
              >
                Explore Madhya Pradesh Crafts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-royal section-spacing">
        <div className="container-heritage grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value="200+" label={t.home.stats.artisans} />
          <StatCounter value="89" label={t.home.stats.traditions} />
          <StatCounter value="600" label={t.home.stats.heritage} />
          <StatCounter value="2" label={t.home.stats.regions} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-spacing" style={{ ...creamBg }}>
        <div className="container-heritage">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-heritage-heading dark:text-white mb-4">
              {t.home.howItWorks}
            </h2>
            <div className="gold-divider" />
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {t.home.steps.map((step) => (
              <AnimatedSection key={step.num} className="relative text-center">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 font-display text-8xl text-[#e8740e] opacity-70">
                  {step.num}
                </span>
                <div className="relative pt-12">
                  <h3 className="font-display text-xl text-heritage-heading dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground dark:text-white/80">
                    {step.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      <ReviewsSection />
    </div>
  );
};

export default Home;
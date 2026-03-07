import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { crafts } from "@/data/crafts";
import CraftCard from "@/components/CraftCard";
import { useLanguage } from "@/contexts/languageContext";
import rajasthanImg from "@/assets/rajasthan.jpeg";
import mpImg from "@/assets/mp tourism.jpg";
import { useBackground } from "@/hooks/useBackground";

const Region = () => {
  const { t } = useLanguage();
  const { creamBg } = useBackground(); // ← moved above early return (Rules of Hooks)
  const params = useParams<{ region: string }>();
  const regionName = params.region || "";

  const validRegions = ["Rajasthan", "Madhya Pradesh"];
  if (!validRegions.includes(regionName)) {
    return (
      <div className="pt-[70px] min-h-screen bg-parchment">
        <section className="section-spacing">
          <div className="container-heritage">
            <h1 className="font-display text-3xl md:text-4xl text-heritage-heading mb-2">{t.region.notFound}</h1>
            <p className="font-body text-sm text-muted-foreground">{t.region.notFoundDesc}</p>
          </div>
        </section>
      </div>
    );
  }

  const filteredCrafts = crafts.filter((c) => c.region === regionName);
  const tagline = t.region.taglines[regionName as keyof typeof t.region.taglines];
  const regionImage = regionName === "Rajasthan" ? rajasthanImg : mpImg;

  return (
    <div style={creamBg}>
      {/* Hero Banner */}
      <section className="bg-ink py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(50 100% 50%) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container-heritage relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex justify-center mb-4">
              <img
                src={regionImage}
                alt={regionName}
                className={`object-contain drop-shadow-lg ${
                  regionName === "Rajasthan"
                    ? "h-28 w-auto"
                    : "h-28 w-28 rounded-full"
                }`}
              />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              {regionName} {t.region.crafts}
            </h1>
            <div className="gold-divider mb-6" />
            
          </motion.div>
        </div>
      </section>

      {/* Craft Cards */}
      <section className="section-spacing">
        <div className="container-heritage">
          {filteredCrafts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCrafts.map((craft, i) => (
                <motion.div
                  key={craft.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <CraftCard craft={craft} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center font-body text-muted-foreground py-16">{t.region.noCrafts}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Region;
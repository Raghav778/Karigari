import { Link } from "react-router-dom";
import type { Craftsman } from "@/data/craftsmen";
import { getCraftImage } from "@/lib/craftImages";
import { useLanguage } from "@/contexts/languageContext";

const CraftsmanCard = ({ craftsman }: { craftsman: Craftsman }) => {
  const { t } = useLanguage();
  const img = getCraftImage(craftsman.image);

  return (
    <Link to={`/craftsman/${craftsman.id}`} className="group block">
      <div
        className="relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl"
        style={{
          borderRadius: "18px",
          background:
            "linear-gradient(145deg, hsl(38 55% 94%), hsl(35 35% 87%))",
          boxShadow:
            "0 4px 18px hsl(20 40% 18% / 0.13), 0 1px 4px hsl(20 40% 18% / 0.08)",
          border: "1px solid hsl(46 60% 72% / 0.55)",
        }}
      >
        {/* Image section with rounded top matching card */}
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: "18px 18px 0 0", height: "230px" }}
        >
          <img
            src={img}
            alt={craftsman.craft}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient fade into card body */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, hsl(35 35% 87% / 0.7))",
            }}
          />

          {/* Endangered badge */}
          {craftsman.endangered && (
            <div className="absolute top-3 left-3 z-20">
              <span
                className="text-[10px] font-display uppercase tracking-[2px] px-2.5 py-1 font-semibold"
                style={{
                  background: "hsl(22 100% 50%)",
                  color: "hsl(40 50% 97%)",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px hsl(22 100% 50% / 0.4)",
                }}
              >
                {t.craftsman.endangered}
              </span>
            </div>
          )}
        </div>

        {/* Ornamental divider */}
        <div className="relative flex items-center px-5 -mt-px">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, hsl(46 60% 65% / 0.6), transparent)",
            }}
          />
          <div
            className="mx-2 w-1.5 h-1.5 rotate-45 flex-shrink-0"
            style={{ background: "hsl(33 100% 50% / 0.5)" }}
          />
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to left, transparent, hsl(46 60% 65% / 0.6), transparent)",
            }}
          />
        </div>

        {/* Card body — textured */}
        <div
          className="relative px-5 pt-3 pb-5 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, hsl(36 45% 91%), hsl(34 38% 85%))",
          }}
        >
          {/* Block-print diamond lattice */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cg fill='none' stroke='%23a0712a' stroke-width='0.6' opacity='0.22'%3E%3Cpath d='M16 2 L30 16 L16 30 L2 16 Z'/%3E%3Ccircle cx='16' cy='2' r='1.2' fill='%23a0712a' stroke='none' opacity='0.3'/%3E%3Ccircle cx='30' cy='16' r='1.2' fill='%23a0712a' stroke='none' opacity='0.3'/%3E%3Ccircle cx='16' cy='30' r='1.2' fill='%23a0712a' stroke='none' opacity='0.3'/%3E%3Ccircle cx='2' cy='16' r='1.2' fill='%23a0712a' stroke='none' opacity='0.3'/%3E%3Ccircle cx='16' cy='16' r='1.8' fill='%23a0712a' stroke='none' opacity='0.18'/%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Paper grain noise */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "120px 120px",
            }}
          />
          {/* Warm bottom glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 130%, hsl(33 80% 68% / 0.14) 0%, transparent 65%)",
            }}
          />

          {/* Content above textures */}
          <div className="relative z-10">
            <h3
              className="font-display text-base mb-0.5 leading-snug"
              style={{ color: "hsl(20 40% 18%)" }}
            >
              {craftsman.name}
            </h3>
            <p
              className="font-body text-xs mb-3"
              style={{ color: "hsl(28 20% 45%)" }}
            >
              {craftsman.craft} · {craftsman.location}
            </p>
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-[1.5px] font-semibold font-display"
                style={{
                  color: "hsl(33 100% 44%)",
                  border: "1px solid hsl(33 100% 50% / 0.35)",
                  background: "hsl(33 100% 50% / 0.09)",
                  borderRadius: "4px",
                }}
              >
                {craftsman.region}
              </span>
              <span
                className="font-body text-[11px]"
                style={{ color: "hsl(28 20% 52%)" }}
              >
                {craftsman.experience}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, hsl(22 100% 50%), hsl(46 100% 50%), hsl(22 100% 50%))",
            borderRadius: "0 0 18px 18px",
          }}
        />
      </div>
    </Link>
  );
};

export default CraftsmanCard;

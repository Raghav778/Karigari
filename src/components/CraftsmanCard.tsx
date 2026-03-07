import { Link } from "react-router-dom";
import type { Craftsman } from "@/data/craftsmen";
import { useLanguage } from "@/contexts/languageContext";
import { getCraftImage, optimizeCloudinaryUrl } from "@/lib/craftImages";

interface CraftsmanCardProps {
  craftsman: Craftsman;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CraftsmanCard: React.FC<CraftsmanCardProps> = ({ craftsman }) => {
  const { t } = useLanguage();
  const img = optimizeCloudinaryUrl(getCraftImage(craftsman.image), 600, 460);

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
            loading="lazy"
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

            {/* Rating + WhatsApp row */}
            <div className="flex items-center justify-between mt-3">
              {/* Star rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    viewBox="0 0 24 24"
                    className="w-3 h-3"
                    fill={
                      s <= Math.round(craftsman.rating)
                        ? "hsl(38 90% 52%)"
                        : "none"
                    }
                    stroke="hsl(38 90% 52%)"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span
                  className="font-body text-[11px] ml-1"
                  style={{ color: "hsl(28 20% 52%)" }}
                >
                  {craftsman.rating.toFixed(1)}
                </span>
              </div>

              {/* WhatsApp icon */}
              <a
                href={
                  craftsman.whatsapp
                    ? `https://wa.me/${craftsman.whatsapp.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(craftsman.name)}%2C%20I%20found%20your%20work%20on%20Karigari%20and%20would%20love%20to%20connect!`
                    : `https://wa.me/?text=Hi%20${encodeURIComponent(craftsman.name)}%2C%20I%20found%20your%20work%20on%20Karigari%20and%20would%20love%20to%20connect!`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-7 h-7 rounded-full text-white shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
                style={{ background: "#25D366" }}
                title="Chat on WhatsApp"
              >
                <WhatsAppIcon />
              </a>
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
import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Craft } from "@/data/crafts";
import { getCraftImage } from "@/lib/craftImages";
import "./CraftCard.css";

const CraftCard = ({ craft }: { craft: Craft }) => {
  const img = getCraftImage(craft.image);
  const innerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flip = () => {
    if (!innerRef.current) return;
    innerRef.current.classList.add("craft-card-flipped");

    // Clear any previous timer and start fresh 5-second countdown
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (innerRef.current) innerRef.current.classList.remove("craft-card-flipped");
    }, 5000);
  };

  const unflip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (innerRef.current) innerRef.current.classList.remove("craft-card-flipped");
  };

  return (
    <Link to={`/discover?craft=${craft.id}`} className="block">
      <div
        className="craft-card-3d bg-sandstone border border-gold overflow-hidden gold-border-top transition-transform duration-300 group-hover:-translate-y-1 rounded-3xl"
        onMouseEnter={flip}
        onMouseLeave={unflip}
      >
        <div ref={innerRef} className="craft-card-inner h-72">
          {/* Front - Image + Info */}
          <div className="craft-card-front">
            <div className="flex flex-col h-full">
              <div className="h-52 overflow-hidden">
                <img
                  src={img}
                  alt={craft.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center">
                <h3 className="font-display text-base text-heritage-heading text-center mb-2">{craft.name}</h3>
                <p className="font-body text-xs text-muted-foreground text-center">{craft.origin}, {craft.region}</p>
              </div>
            </div>
          </div>

          {/* Back - Description */}
          {/* Back - Description */}
          {/* Back - Description */}
          <div className="craft-card-back">
            <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
              <h3 className="font-display text-xl text-heritage-gold text-center">{craft.name}</h3>
              <p className="font-body text-sm leading-relaxed text-center" style={{ color: "hsl(var(--ink-dark))" }}>
                {craft.description}
              </p>
              <p className="font-body text-xs text-center" style={{ color: "hsl(var(--muted-earth))" }}>
                {craft.origin}, {craft.region}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CraftCard;
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-ink text-parchment dark:text-white section-spacing">
    <div className="container-heritage">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <img
            src={logo}
            alt="Karigarh"
            className="w-20 h-20 object-contain rounded-full mb-4 opacity-80 ring-2 ring-sun-gold/20"
          />
          <p className="font-body text-sm opacity-70 leading-relaxed">
            Ancient Crafts, Timeless Art. Preserving India's living heritage
            through digital storytelling.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-[2px] text-gold mb-4">
            Regions
          </h4>
          <ul className="space-y-2 font-body text-sm opacity-70">
            <li>
              <Link
                to="/region/Rajasthan"
                className="hover:text-heritage-gold transition-colors"
              >
                Rajasthan
              </Link>
            </li>
            <li>
              <Link
                to="/region/Madhya%20Pradesh"
                className="hover:text-heritage-gold transition-colors"
              >
                Madhya Pradesh
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-[2px] text-gold mb-4">
            Explore
          </h4>
          <ul className="space-y-2 font-body text-sm opacity-70">
            <li>
              <Link
                to="/discover"
                className="hover:text-heritage-gold transition-colors"
              >
                Discover Artisans
              </Link>
            </li>
            <li>
              <Link
                to="/archive"
                className="hover:text-heritage-gold transition-colors"
              >
                Archive
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-[2px] text-gold mb-4">
            Connect
          </h4>
          <ul className="space-y-2 font-body text-sm opacity-70">
            <li>info@karigarh.art</li>
            <li>+91 98765 43210</li>
            <li>Jaipur, Rajasthan</li>
            <li>
              <Link
                to="/join"
                className="hover:text-heritage-gold transition-colors"
              >
                Join as Karigarh
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="gold-divider mb-8" />
      <p className="text-center font-body text-xs opacity-50 tracking-[2px] uppercase">
        © 2026 Karigarh. All traditions preserved.
      </p>
    </div>
  </footer>
);

export default Footer;
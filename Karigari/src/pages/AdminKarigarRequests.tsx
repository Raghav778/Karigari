import { useEffect, useState } from "react";
import { useBackground } from "@/hooks/useBackground";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  CheckCircle2, XCircle, User, MapPin, Phone, Mail,
  Scissors, Clock, IndianRupee, ChevronDown, ChevronUp,
  Loader2, ShieldCheck, RefreshCw, Filter, Eye, X,
  Star, Tag, Hammer, FileText, Camera, Award,
  Youtube, Globe, Sparkles, AlertCircle, Instagram,
} from "lucide-react";

// ─── Textures ──────────────────────────────────────────────────────────────────
const MANDALA_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.07' stroke-width='0.8'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cline x1='30' y1='8' x2='30' y2='52'/%3E%3Cline x1='8' y1='30' x2='52' y2='30'/%3E%3Cline x1='14' y1='14' x2='46' y2='46'/%3E%3Cline x1='46' y1='14' x2='14' y2='46'/%3E%3C/g%3E%3C/svg%3E")`;

const GOLD = "#c9a227";

type ApprovalStatus = "pending" | "approved" | "rejected";

// ── Exact shape saved by Join.tsx ──────────────────────────────────────────────
interface KarigarRequest {
  id: string;
  status: ApprovalStatus;
  createdAt: any;
  userId?: string;

  personal?: {
    name?: string;
    profileName?: string;
    age?: string;
    gender?: string;
    city?: string;
    village?: string;
    pincode?: string;
    address?: string;
    workshopAddress?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };

  craft?: {
    craftForm?: string;
    craftCustom?: string;
    region?: string;
    experience?: string;
    priceRange?: string;
    priceCustom?: string;
  };

  specialties?: string[];
  materials?: string[];
  techniques?: string[];
  description?: string;
  inspiration?: string;
  awards?: string;

  portfolio?: string[];
  certificates?: string[];

  bankDetails?: {
    bankName?: string;
    accountNo?: string;
    ifsc?: string;
    upi?: string;
  };

  verification?: {
    idType?: string;
    idProofUrl?: string;
  };

  agreements?: {
    agreeTerms?: boolean;
    agreeAuth?: boolean;
    agreeMarket?: boolean;
    agreeGI?: boolean;
    agreeDC?: boolean;
  };
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: ApprovalStatus }) => {
  const cfg = {
    pending:  { label: "Pending Review", color: GOLD,      bg: "rgba(201,162,39,0.12)", icon: Clock },
    approved: { label: "Approved",       color: "#22c55e", bg: "rgba(34,197,94,0.12)",  icon: CheckCircle2 },
    rejected: { label: "Rejected",       color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: XCircle },
  }[status];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}40` }}>
      <Icon size={11} />{cfg.label}
    </span>
  );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-4 pb-2 border-b-2" style={{ borderColor: GOLD }}>
    <div className="p-1.5 rounded-sm" style={{ background: "rgba(201,162,39,0.15)" }}>
      <Icon size={14} style={{ color: GOLD }} />
    </div>
    <h3 className="font-display text-sm uppercase tracking-[3px] text-heritage-heading">{title}</h3>
  </div>
);

// ─── Info Row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number | null }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gold/10 last:border-0">
      <div className="mt-0.5 p-1 rounded flex-shrink-0" style={{ background: "rgba(201,162,39,0.08)" }}>
        <Icon size={12} style={{ color: GOLD }} />
      </div>
      <div className="min-w-0">
        <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
        <p className="font-body text-sm text-heritage-heading break-words">{String(value)}</p>
      </div>
    </div>
  );
};

// ─── Text Block (for long text) ───────────────────────────────────────────────
const TextBlock = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => {
  if (!value?.trim()) return null;
  return (
    <div className="py-2 border-b border-gold/10 last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={12} style={{ color: GOLD }} />
        <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <p className="font-body text-sm text-heritage-heading leading-relaxed pl-5">{value}</p>
    </div>
  );
};

// ─── Tags Row ─────────────────────────────────────────────────────────────────
const TagsRow = ({ icon: Icon, label, tags }: { icon: any; label: string; tags?: string[] }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="py-2 border-b border-gold/10 last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={12} style={{ color: GOLD }} />
        <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-5">
        {tags.map(t => (
          <span key={t} className="font-body text-xs px-2.5 py-1 border border-gold/40 text-heritage-heading"
            style={{ background: "rgba(201,162,39,0.06)" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Bool Row ─────────────────────────────────────────────────────────────────
const BoolRow = ({ label, value }: { label: string; value?: boolean }) => {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-gold/10 last:border-0">
      <div className={`w-4 h-4 flex items-center justify-center rounded-sm flex-shrink-0 ${value ? "bg-green-500" : "bg-red-400"}`}>
        {value
          ? <CheckCircle2 size={10} className="text-white" />
          : <XCircle size={10} className="text-white" />}
      </div>
      <p className="font-body text-xs text-heritage-heading">{label}</p>
    </div>
  );
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.92)" }} onClick={onClose}>
    <button className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors z-10" onClick={onClose}>
      <X size={28} />
    </button>
    <motion.img initial={{ scale: 0.85 }} animate={{ scale: 1 }} src={src} alt="Preview"
      className="max-w-full max-h-[88vh] object-contain rounded shadow-2xl"
      onClick={e => e.stopPropagation()} />
  </motion.div>
);

// ─── Photo Grid ───────────────────────────────────────────────────────────────
const PhotoGrid = ({ urls, label }: { urls?: string[]; label: string }) => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  if (!urls || urls.length === 0) return null;
  const isVideo = (url: string) =>
    /\.(mp4|mov|webm|avi|mkv)/i.test(url) || url.includes("/video/upload/");

  return (
    <div className="py-2 border-b border-gold/10 last:border-0">
      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {label} <span style={{ color: GOLD }}>({urls.length})</span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url, i) => (
          <button key={i}
            onClick={() => !isVideo(url) && setLightbox(url)}
            className={`relative group overflow-hidden border border-gold/30 rounded-sm aspect-square ${isVideo(url) ? "cursor-default" : "cursor-zoom-in"}`}>
            {isVideo(url) ? (
              <video src={url} className="w-full h-full object-cover" muted playsInline
                onMouseOver={e => (e.target as HTMLVideoElement).play()}
                onMouseOut={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }} />
            ) : (
              <img src={url} alt={`${label} ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='%23f5f0e8' width='100' height='100'/><text x='50' y='55' text-anchor='middle' font-size='11' fill='%23c9a227'>No Image</text></svg>`;
                }} />
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye size={16} className="text-white" />
            </div>
            {i === 0 && !isVideo(url) && (
              <div className="absolute bottom-0 left-0 right-0 bg-primary/85 text-white text-center font-body text-[8px] uppercase tracking-wider py-0.5">Cover</div>
            )}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── Single Photo (for ID proof) ─────────────────────────────────────────────
const SinglePhoto = ({ url, label }: { url?: string; label: string }) => {
  const [open, setOpen] = useState(false);
  if (!url) return null;
  return (
    <div className="py-2 border-b border-gold/10 last:border-0">
      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <button onClick={() => setOpen(true)}
        className="relative group w-28 h-28 overflow-hidden border border-gold/30 rounded-sm block">
        <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye size={14} className="text-white" />
        </div>
      </button>
      <AnimatePresence>{open && <Lightbox src={url} onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
};

// ─── Profile Avatar (initials) ────────────────────────────────────────────────
const ProfileAvatar = ({ name }: { name: string }) => (
  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 font-display text-xl text-parchment"
    style={{ borderColor: GOLD, background: "linear-gradient(135deg, #3b2a14, #5a3e1b)" }}>
    {name?.[0]?.toUpperCase() ?? "?"}
  </div>
);

// ─── Request Card ─────────────────────────────────────────────────────────────
const RequestCard = ({
  req, onApprove, onReject, updating,
}: {
  req: KarigarRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  updating: string | null;
}) => {
  const [expanded, setExpanded] = useState(false);

  const displayName = req.personal?.profileName || req.personal?.name || "Unknown Karigar";
  const craftLabel  = req.craft?.craftForm === "Other (specify below)"
    ? (req.craft?.craftCustom || "Custom Craft")
    : (req.craft?.craftForm || "");
  const submittedAt = req.createdAt?.toDate?.() ?? (req.createdAt ? new Date(req.createdAt) : null);
  const isUpdating  = updating === req.id;
  const isDecided   = req.status !== "pending";

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="border bg-parchment overflow-hidden" style={{ borderColor: `${GOLD}40` }}>

      {/* ── Collapsed Header ── */}
      <div className="flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-sandstone/40 transition-colors"
        onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center gap-4 min-w-0">
          <ProfileAvatar name={displayName} />
          <div className="min-w-0">
            <h3 className="font-display text-lg text-heritage-heading truncate">{displayName}</h3>
            {req.personal?.name && req.personal.name !== req.personal?.profileName && (
              <p className="font-body text-xs text-muted-foreground">{req.personal.name}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <StatusBadge status={req.status} />
              {craftLabel && (
                <span className="font-body text-xs px-2 py-0.5 border border-gold/30"
                  style={{ background: "rgba(201,162,39,0.07)" }}>{craftLabel}</span>
              )}
              {req.craft?.region && (
                <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={10} />{req.craft.region}
                </span>
              )}
              {req.personal?.gender && (
                <span className="font-body text-xs text-muted-foreground">{req.personal.gender}</span>
              )}
              {submittedAt && (
                <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {submittedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!isDecided && (
            <>
              <button onClick={e => { e.stopPropagation(); onApprove(req.id); }} disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-sm hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ background: "#22c55e" }}>
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Accept
              </button>
              <button onClick={e => { e.stopPropagation(); onReject(req.id); }} disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-sm hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ background: "#ef4444" }}>
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Reject
              </button>
            </>
          )}
          <button className="p-2 text-muted-foreground hover:text-heritage-heading transition-colors">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* ── Expanded Full Details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="border-t p-6 space-y-5"
              style={{ borderColor: `${GOLD}30`, backgroundImage: MANDALA_BG, backgroundColor: "hsl(var(--warm-cream))" }}>

              {/* ── ROW 1: Personal · Craft · Story ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* PERSONAL */}
                <div className="bg-parchment border border-gold/20 p-4 rounded-sm">
                  <SectionHeader title="Personal Info" icon={User} />
                  <InfoRow  icon={User}    label="Full Legal Name"      value={req.personal?.name} />
                  <InfoRow  icon={Star}    label="Profile / Brand Name" value={req.personal?.profileName} />
                  <InfoRow  icon={User}    label="Age"                  value={req.personal?.age} />
                  <InfoRow  icon={User}    label="Gender"               value={req.personal?.gender} />
                  <InfoRow  icon={Phone}   label="Contact Number"       value={req.personal?.phone} />
                  <InfoRow  icon={Phone}   label="WhatsApp"             value={req.personal?.whatsapp} />
                  <InfoRow  icon={Mail}    label="Email"                value={req.personal?.email} />
                  <InfoRow  icon={MapPin}  label="City / District"      value={req.personal?.city} />
                  <InfoRow  icon={MapPin}  label="Village"              value={req.personal?.village} />
                  <InfoRow  icon={MapPin}  label="PIN Code"             value={req.personal?.pincode} />
                  <TextBlock icon={MapPin} label="Home Address"         value={req.personal?.address} />
                  <TextBlock icon={MapPin} label="Workshop Address"     value={req.personal?.workshopAddress} />

                  {/* Social Links */}
                  {(req.personal?.instagram || req.personal?.facebook || req.personal?.youtube) && (
                    <div className="mt-3 pt-3 border-t border-gold/15">
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Social Profiles</p>
                      {req.personal?.instagram && (
                        <a href={`https://instagram.com/${req.personal.instagram}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 py-1 font-body text-sm text-heritage-heading hover:text-primary transition-colors">
                          <Instagram size={13} style={{ color: GOLD }} />
                          instagram.com/{req.personal.instagram}
                        </a>
                      )}
                      {req.personal?.facebook && (
                        <a href={`https://facebook.com/${req.personal.facebook}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 py-1 font-body text-sm text-heritage-heading hover:text-primary transition-colors">
                          <Globe size={13} style={{ color: GOLD }} />
                          facebook.com/{req.personal.facebook}
                        </a>
                      )}
                      {req.personal?.youtube && (
                        <a href={`https://youtube.com/@${req.personal.youtube}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 py-1 font-body text-sm text-heritage-heading hover:text-primary transition-colors">
                          <Youtube size={13} style={{ color: GOLD }} />
                          youtube.com/@{req.personal.youtube}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* CRAFT */}
                <div className="bg-parchment border border-gold/20 p-4 rounded-sm">
                  <SectionHeader title="Craft Details" icon={Scissors} />
                  <InfoRow  icon={Scissors}     label="Craft Form"           value={craftLabel} />
                  <InfoRow  icon={MapPin}        label="Region / State"       value={req.craft?.region} />
                  <InfoRow  icon={Clock}         label="Years of Experience"  value={req.craft?.experience} />
                  <InfoRow  icon={IndianRupee}   label="Price Range"          value={req.craft?.priceRange !== "Custom (specify below)" ? req.craft?.priceRange : undefined} />
                  <InfoRow  icon={IndianRupee}   label="Custom Price"         value={req.craft?.priceCustom} />
                  <TagsRow  icon={Star}          label="Specialities"         tags={req.specialties} />
                  <TagsRow  icon={Hammer}        label="Materials Used"       tags={req.materials} />
                  <TagsRow  icon={Tag}           label="Techniques Used"      tags={req.techniques} />
                </div>

                {/* STORY */}
                <div className="bg-parchment border border-gold/20 p-4 rounded-sm">
                  <SectionHeader title="Story & Background" icon={FileText} />
                  <TextBlock icon={FileText}  label="About & Craft Description" value={req.description} />
                  <TextBlock icon={Sparkles}  label="What Inspires You"         value={req.inspiration} />
                  <TextBlock icon={Award}     label="Awards & Recognition"      value={req.awards} />
                </div>
              </div>

              {/* ── ROW 2: Portfolio · Verification · Agreements ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* PORTFOLIO */}
                <div className="bg-parchment border border-gold/20 p-4 rounded-sm">
                  <SectionHeader title="Portfolio & Certificates" icon={Camera} />
                  {(!req.portfolio || req.portfolio.length === 0) && (!req.certificates || req.certificates.length === 0) ? (
                    <p className="font-body text-xs text-muted-foreground italic">No files uploaded</p>
                  ) : (
                    <>
                      <PhotoGrid urls={req.portfolio}     label="Work Samples (Photos & Videos)" />
                      <PhotoGrid urls={req.certificates}  label="Certificates & Awards" />
                    </>
                  )}
                </div>

                {/* VERIFICATION + BANK */}
                <div className="bg-parchment border border-gold/20 p-4 rounded-sm">
                  <SectionHeader title="Verification & Bank" icon={ShieldCheck} />
                  <InfoRow    icon={ShieldCheck}  label="ID Document Type"  value={req.verification?.idType} />
                  <SinglePhoto url={req.verification?.idProofUrl}            label="Identity Document" />

                  <div className="mt-4 pt-4 border-t border-gold/15">
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <IndianRupee size={11} style={{ color: GOLD }} /> Bank Details
                    </p>
                    <InfoRow icon={IndianRupee} label="Bank Name"       value={req.bankDetails?.bankName} />
                    <InfoRow icon={IndianRupee} label="Account Number"  value={req.bankDetails?.accountNo} />
                    <InfoRow icon={IndianRupee} label="IFSC Code"       value={req.bankDetails?.ifsc} />
                    <InfoRow icon={IndianRupee} label="UPI ID"          value={req.bankDetails?.upi} />
                  </div>
                </div>

                {/* AGREEMENTS */}
                <div className="bg-parchment border border-gold/20 p-4 rounded-sm">
                  <SectionHeader title="Declarations" icon={CheckCircle2} />
                  <BoolRow label="Agreed to Terms & Conditions"                value={req.agreements?.agreeTerms} />
                  <BoolRow label="Confirmed work is genuine & handmade"        value={req.agreements?.agreeAuth} />
                  <BoolRow label="Consent to SMS / WhatsApp updates"           value={req.agreements?.agreeMarket} />

                  <div className="mt-3 pt-3 border-t border-gold/15">
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      Government Schemes
                    </p>
                    <BoolRow label="Holds GI (Geographical Indication) tag"    value={req.agreements?.agreeGI} />
                    <BoolRow label="Registered with O/o DC Handicrafts"        value={req.agreements?.agreeDC} />
                  </div>

                  {req.userId && (
                    <div className="mt-4 pt-3 border-t border-gold/15">
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Firebase UID</p>
                      <p className="font-body text-[10px] text-muted-foreground/60 break-all">{req.userId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Bottom Action Bar ── */}
              {!isDecided && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: `${GOLD}30` }}>
                  <p className="font-body text-sm text-muted-foreground mr-auto">
                    Review all details before making a decision.
                  </p>
                  <button onClick={() => onReject(req.id)} disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-sm hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#ef4444" }}>
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                    Reject Application
                  </button>
                  <button onClick={() => onApprove(req.id)} disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-sm hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#22c55e" }}>
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Accept Application
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminKarigarRequests() {
  const { creamBg } = useBackground();
  const [requests,   setRequests]   = useState<KarigarRequest[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [updating,   setUpdating]   = useState<string | null>(null);
  const [filter,     setFilter]     = useState<"all" | ApprovalStatus>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const snap = await getDocs(collection(db, "craftsmen"));
      const data = snap.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          status: (raw.status as ApprovalStatus) || "pending",
          ...raw,
        } as KarigarRequest;
      });

      // Sort newest first
      data.sort((a, b) => {
        const ts = (r: KarigarRequest) =>
          r.createdAt?.toDate?.() ?? (r.createdAt ? new Date(r.createdAt) : new Date(0));
        return ts(b).getTime() - ts(a).getTime();
      });

      setRequests(data);
    } catch (err) {
      console.error("Error fetching karigar requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchRequests(); };

  const handleApprove = async (id: string) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "craftsmen", id), { status: "approved", reviewedAt: new Date() });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    } catch (err) {
      alert("Failed to approve. Please try again.");
    } finally { setUpdating(null); }
  };

  const handleReject = async (id: string) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "craftsmen", id), { status: "rejected", reviewedAt: new Date() });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    } catch (err) {
      alert("Failed to reject. Please try again.");
    } finally { setUpdating(null); }
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="pt-[70px] min-h-screen" style={creamBg}>

      {/* ── Header ── */}
      <div className="border-b py-8 px-4" style={{ borderColor: `${GOLD}30`, backgroundImage: MANDALA_BG }}>
        <div className="container-heritage">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} style={{ color: GOLD }} />
                <span className="font-body text-xs uppercase tracking-[3px] text-muted-foreground">Admin Panel</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-heritage-heading mb-1">Karigarh Applications</h1>
              <p className="font-body text-sm text-muted-foreground">
                Review artisan join requests. Click any card to see every field they submitted.
              </p>
            </div>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border font-body text-sm hover:bg-sandstone transition-colors disabled:opacity-50"
              style={{ borderColor: `${GOLD}50` }}>
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {/* Stats / Filter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {(["all", "pending", "approved", "rejected"] as const).map(key => {
              const labels = { all: "Total", pending: "Pending", approved: "Approved", rejected: "Rejected" };
              const colors = { all: GOLD, pending: GOLD, approved: "#22c55e", rejected: "#ef4444" };
              const active = filter === key;
              return (
                <button key={key} onClick={() => setFilter(key)}
                  className="p-4 border text-left transition-all hover:bg-sandstone/50"
                  style={{ borderColor: active ? colors[key] : `${GOLD}30`, background: active ? `${colors[key]}12` : "transparent" }}>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{labels[key]}</p>
                  <p className="font-display text-2xl" style={{ color: colors[key] }}>{counts[key]}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── List ── */}
      <div className="container-heritage px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin" style={{ color: GOLD }} />
            <p className="font-body text-muted-foreground">Loading applications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 border" style={{ borderColor: `${GOLD}30` }}>
            <AlertCircle size={44} style={{ color: `${GOLD}60` }} />
            <p className="font-display text-xl text-heritage-heading">No applications found</p>
            <p className="font-body text-sm text-muted-foreground">
              {filter === "all" ? "No karigar applications submitted yet." : `No ${filter} applications.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-sm text-muted-foreground">
                Showing <span className="font-semibold" style={{ color: GOLD }}>{filtered.length}</span>{" "}
                application{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Filter size={13} />
                <span className="font-body text-xs uppercase tracking-wider">
                  {filter === "all" ? "All" : filter}
                </span>
              </div>
            </div>
            {filtered.map(req => (
              <RequestCard key={req.id} req={req}
                onApprove={handleApprove} onReject={handleReject} updating={updating} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
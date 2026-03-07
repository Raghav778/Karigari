import { useEffect, useState, useRef } from "react";
import { useBackground } from "@/hooks/useBackground";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import {
  LayoutDashboard,
  MapPin,
  Phone,
  Mail,
  Star,
  Hammer,
  Tag,
  Sparkles,
  Award,
  User,
  Clock,
  CheckCircle2,
  Hourglass,
  Pencil,
  Trash2,
  Save,
  X,
  Plus,
  ImagePlus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/craftImages";

// ─── Textures ─────────────────────────────────────────────────────────────────
const MANDALA_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.07' stroke-width='0.8'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cline x1='30' y1='8' x2='30' y2='52'/%3E%3Cline x1='8' y1='30' x2='52' y2='30'/%3E%3Cline x1='14' y1='14' x2='46' y2='46'/%3E%3Cline x1='46' y1='14' x2='14' y2='46'/%3E%3C/g%3E%3C/svg%3E")`;
const JALI_BG = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.06' stroke-width='0.7'%3E%3Crect x='4' y='4' width='24' height='24' rx='2'/%3E%3Crect x='9' y='9' width='14' height='14' rx='1'/%3E%3Ccircle cx='16' cy='16' r='4'/%3E%3Cline x1='16' y1='4' x2='16' y2='28'/%3E%3Cline x1='4' y1='16' x2='28' y2='16'/%3E%3C/g%3E%3C/svg%3E")`;
const ORG = "#e8740e";

const CRAFT_FORMS = [
  "Blue Pottery",
  "Phad Painting",
  "Bandhani",
  "Gond Art",
  "Chanderi Weaving",
  "Bagh Print",
  "Madhubani Painting",
  "Warli Art",
  "Dhokra Metal Casting",
  "Bidriware",
  "Patola Silk",
  "Kashmiri Embroidery",
  "Phulkari",
  "Zardozi",
  "Kantha Stitch",
  "Terracotta",
  "Block Printing",
  "Pichwai Painting",
  "Meenakari",
  "Tanjore Painting",
  "Pattachitra",
  "Kalamkari",
  "Rogan Art",
  "Pashmina Weaving",
  "Other (specify below)",
];
const EXPERIENCE_RANGES = [
  "Less than 5 years",
  "5–10 years",
  "10–15 years",
  "15–20 years",
  "20–25 years",
  "25–30 years",
  "30–35 years",
  "35–40 years",
  "40+ years",
];
const REGIONS = [
  "Rajasthan",
  "Madhya Pradesh",
  "Gujarat",
  "Uttar Pradesh",
  "West Bengal",
  "Tamil Nadu",
  "Kerala",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Maharashtra",
  "Odisha",
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Punjab",
  "Bihar",
  "Jharkhand",
  "Assam",
  "Manipur",
  "Other",
];
const PRESET_SPECIALTIES = [
  "Floral Motifs",
  "Geometric Patterns",
  "Narrative Scrolls",
  "Deity Panels",
  "Bridal Work",
  "Persian Motifs",
  "Animal Spirits",
  "Tribal Art",
  "Zari Brocade",
  "Natural Dyes",
  "Block Printing",
  "Miniature Work",
  "Mughal Patterns",
  "Folk Epics",
  "Mythological Scenes",
  "Abstract Forms",
];

interface KarigarData {
  personal?: {
    name?: string;
    profileName?: string;
    city?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    age?: string;
    gender?: string;
    pincode?: string;
  };
  craft?: {
    craftForm?: string;
    craftCustom?: string;
    experience?: string;
    region?: string;
    priceRange?: string;
  };
  specialties?: string[];
  materials?: string[];
  techniques?: string[];
  description?: string;
  inspiration?: string;
  awards?: string;
  portfolio?: string[];
  status?: string;
}

// ─── Reusable tag editor ───────────────────────────────────────────────────────
function TagEditor({
  label,
  icon: Icon,
  items,
  presets,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  items: string[];
  presets?: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const add = (val: string) => {
    const v = val.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setInput("");
  };
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));

  return (
    <div>
      <p className="font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground/60 mb-2 flex items-center gap-1.5">
        <Icon size={10} style={{ color: ORG }} /> {label}
      </p>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((s, i) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 font-body text-xs px-2.5 py-1 border"
            style={{
              borderColor: `${ORG}50`,
              color: ORG,
              background: `${ORG}10`,
            }}
          >
            {s}
            <button
              onClick={() => remove(i)}
              className="hover:text-red-500 transition-colors"
            >
              <X size={9} />
            </button>
          </span>
        ))}
      </div>
      {presets && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {presets
            .filter((p) => !items.includes(p))
            .map((p) => (
              <button
                key={p}
                onClick={() => add(p)}
                className="font-body text-[10px] px-2 py-0.5 border border-dashed border-gold/35 text-muted-foreground hover:border-gold/60 hover:text-heritage-heading transition-all"
              >
                + {p}
              </button>
            ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(input);
            }
          }}
          placeholder="Type and press Enter…"
          className="flex-1 bg-white border border-gold/35 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
        />
        <button
          onClick={() => add(input)}
          className="px-3 py-2 border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Delete confirmation modal ─────────────────────────────────────────────────
function DeleteModal({
  onConfirm,
  onCancel,
  deleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-sandstone border border-gold/30 p-8 max-w-sm w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={22} className="text-red-500 flex-shrink-0" />
          <h2 className="font-display text-lg text-heritage-heading">
            Delete Profile?
          </h2>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
          This will permanently delete your karigar profile and all associated
          data. This action <strong>cannot</strong> be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 font-body text-xs uppercase tracking-[1.5px] border border-gold/30 text-heritage-heading hover:bg-gold/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 font-body text-xs uppercase tracking-[1.5px] bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-gold/35 px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/60 transition-all";
const labelCls =
  "font-body text-[10px] uppercase tracking-[1.5px] text-muted-foreground/60 mb-1 block";

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function KarigarProfile() {
  const { creamBg } = useBackground();
  const navigate = useNavigate();

  const [karigar, setKarigar] = useState<KarigarData | null>(null);
  const [docId, setDocId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<KarigarData | null>(null);
  const [saving, setSaving] = useState(false);

  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const hasLoaded = useRef(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch karigar doc ──────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { state: { openLogin: true } });
        return;
      }
      if (hasLoaded.current) return; // ← prevent re-fetch from overwriting edits
      const snap = await getDocs(
        query(collection(db, "craftsmen"), where("userId", "==", user.uid)),
      );
      if (snap.empty) {
        navigate("/join");
        return;
      }
      setDocId(snap.docs[0].id);
      setKarigar(snap.docs[0].data() as KarigarData);
      setLoading(false);
      hasLoaded.current = true; // ← mark as loaded
    });
    return () => unsub();
  }, [navigate]);

  // ── Edit helpers ───────────────────────────────────────────────────────────
  const startEdit = () => {
    setDraft(JSON.parse(JSON.stringify(karigar)));
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancelEdit = () => {
    setDraft(null);
    setEditing(false);
  };
  const setP = (k: string, v: string) =>
    setDraft((d) => (d ? { ...d, personal: { ...d.personal, [k]: v } } : d));
  const setC = (k: string, v: string) =>
    setDraft((d) => (d ? { ...d, craft: { ...d.craft, [k]: v } } : d));
  const setField = (k: keyof KarigarData, v: any) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const saveEdit = async () => {
    if (!draft || !docId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "craftsmen", docId), {
        personal: draft.personal,
        craft: draft.craft,
        specialties: draft.specialties ?? [],
        materials: draft.materials ?? [],
        techniques: draft.techniques ?? [],
        description: draft.description ?? "",
        inspiration: draft.inspiration ?? "",
        awards: draft.awards ?? "",
      });
      setKarigar(draft);
      setEditing(false);
      setDraft(null);
    } catch (err) {
      console.error(err);
      alert("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Portfolio upload ───────────────────────────────────────────────────────
  // ── Portfolio upload ───────────────────────────────────────────────────────
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "karigarh_unsigned");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dbzo2oidq/image/upload",
      { method: "POST", body: formData },
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handlePortfolioUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !docId) return;
    setUploadingPortfolio(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      const newPortfolio = [...(karigar?.portfolio ?? []), ...urls];
      await updateDoc(doc(db, "craftsmen", docId), { portfolio: newPortfolio });
      setKarigar((k) => (k ? { ...k, portfolio: newPortfolio } : k));
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingPortfolio(false);
      if (portfolioRef.current) portfolioRef.current.value = "";
    }
  };

  const removePortfolioImage = async (url: string, idx: number) => {
    if (!docId) return;
    try {
      const newPortfolio = (karigar?.portfolio ?? []).filter(
        (_, i) => i !== idx,
      );
      await updateDoc(doc(db, "craftsmen", docId), { portfolio: newPortfolio });
      setKarigar((k) => (k ? { ...k, portfolio: newPortfolio } : k));
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete profile ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!docId) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "craftsmen", docId));
      await auth.signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Could not delete profile. Please try again.");
      setDeleting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={creamBg}
      >
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: `${ORG} transparent transparent transparent` }}
        />
      </div>
    );
  if (!karigar) return null;

  const data = editing ? draft! : karigar;
  const name = data.personal?.profileName || data.personal?.name || "Karigar";
  const craftName =
    data.craft?.craftForm === "Other (specify below)"
      ? data.craft?.craftCustom
      : data.craft?.craftForm;

  return (
    <div style={{ ...creamBg, minHeight: "100vh" }}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="bg-ink relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: JALI_BG }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: MANDALA_BG, opacity: 0.3 }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(22 100% 45% / 0.5), transparent)",
          }}
        />

        <div className="container-heritage px-4 pt-10 pb-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-5" style={{ background: `${ORG}99` }} />
                <span
                  className="font-body text-[10px] uppercase tracking-[3px]"
                  style={{ color: ORG }}
                >
                  Karigar Profile
                </span>
              </div>
              <h1 className="font-display text-4xl text-parchment leading-tight mb-1">
                {name}
              </h1>
              {craftName && (
                <p className="font-body text-sm text-parchment/55">
                  {craftName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {!editing ? (
                <>
                  <button
                    onClick={startEdit}
                    className="inline-flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-[1.5px] border text-parchment/80 hover:text-parchment transition-all"
                    style={{ borderColor: `${ORG}60` }}
                  >
                    <Pencil size={12} /> Edit Profile
                  </button>
                  <Link
                    to="/karigar-dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-[1.5px] text-white"
                    style={{ background: ORG }}
                  >
                    <LayoutDashboard size={12} /> Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-[1.5px] border border-parchment/20 text-parchment/60 hover:text-parchment transition-all disabled:opacity-50"
                  >
                    <X size={12} /> Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-[1.5px] text-white disabled:opacity-70"
                    style={{ background: ORG }}
                  >
                    {saving ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {karigar.status === "pending" && (
            <div
              className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 font-body text-[10px] uppercase tracking-[2px] rounded-sm"
              style={{
                background: "hsl(40 80% 50% / 0.15)",
                color: "hsl(40 80% 70%)",
                border: "1px solid hsl(40 80% 50% / 0.25)",
              }}
            >
              <Hourglass size={10} /> Application under review
            </div>
          )}
          {karigar.status === "approved" && (
            <div
              className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 font-body text-[10px] uppercase tracking-[2px] rounded-sm"
              style={{
                background: "hsl(142 60% 40% / 0.15)",
                color: "hsl(142 60% 65%)",
                border: "1px solid hsl(142 60% 40% / 0.25)",
              }}
            >
              <CheckCircle2 size={10} /> Verified Karigar
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="container-heritage px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Personal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                <User size={14} style={{ color: ORG }} /> Personal Details
              </h2>
              {!editing ? (
                <div className="space-y-3">
                  {[
                    {
                      icon: User,
                      v: data.personal?.profileName || data.personal?.name,
                    },
                    {
                      icon: MapPin,
                      v:
                        [data.personal?.city, data.personal?.pincode]
                          .filter(Boolean)
                          .join(" – ") || undefined,
                    },
                    { icon: Phone, v: data.personal?.phone },
                    { icon: Mail, v: data.personal?.email },
                    {
                      icon: Clock,
                      v: data.craft?.experience
                        ? `${data.craft.experience} experience`
                        : undefined,
                    },
                    { icon: MapPin, v: data.craft?.region },
                  ]
                    .filter((r) => r.v)
                    .map(({ icon: Icon, v }, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Icon size={13} className="text-gold flex-shrink-0" />
                        <span className="font-body text-sm text-heritage-heading/80">
                          {v}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    {
                      label: "Profile / Display Name",
                      k: "profileName",
                      src: "personal",
                    },
                    { label: "Full Legal Name", k: "name", src: "personal" },
                    { label: "City / District", k: "city", src: "personal" },
                    { label: "Pincode", k: "pincode", src: "personal" },
                    { label: "Phone", k: "phone", src: "personal" },
                    { label: "WhatsApp", k: "whatsapp", src: "personal" },
                    { label: "Email", k: "email", src: "personal" },
                  ].map(({ label, k, src }) => (
                    <div key={k}>
                      <label className={labelCls}>{label}</label>
                      <input
                        className={inputCls}
                        value={
                          src === "personal"
                            ? ((draft?.personal as any)?.[k] ?? "")
                            : ((draft?.craft as any)?.[k] ?? "")
                        }
                        onChange={(e) =>
                          src === "personal"
                            ? setP(k, e.target.value)
                            : setC(k, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Craft Form</label>
                    <select
                      className={inputCls}
                      value={draft?.craft?.craftForm ?? ""}
                      onChange={(e) => setC("craftForm", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {CRAFT_FORMS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {draft?.craft?.craftForm === "Other (specify below)" && (
                    <div>
                      <label className={labelCls}>Specify Craft</label>
                      <input
                        className={inputCls}
                        value={draft?.craft?.craftCustom ?? ""}
                        onChange={(e) => setC("craftCustom", e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelCls}>Experience</label>
                    <select
                      className={inputCls}
                      value={draft?.craft?.experience ?? ""}
                      onChange={(e) => setC("experience", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {EXPERIENCE_RANGES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Region</label>
                    <select
                      className={inputCls}
                      value={draft?.craft?.region ?? ""}
                      onChange={(e) => setC("region", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Specialties */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                <Star size={14} style={{ color: ORG }} /> Specialties
              </h2>
              {!editing ? (
                (data.specialties ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(data.specialties ?? []).map((s) => (
                      <span
                        key={s}
                        className="font-body text-xs px-3 py-1 border"
                        style={{
                          borderColor: `${ORG}40`,
                          color: ORG,
                          background: `${ORG}0d`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">
                    Not added yet
                  </p>
                )
              ) : (
                <TagEditor
                  label="Specialties"
                  icon={Star}
                  presets={PRESET_SPECIALTIES}
                  items={draft?.specialties ?? []}
                  onChange={(v) => setField("specialties", v)}
                />
              )}
            </motion.div>

            {/* Materials */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                <Hammer size={14} style={{ color: ORG }} /> Materials
              </h2>
              {!editing ? (
                (data.materials ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(data.materials ?? []).map((m) => (
                      <span
                        key={m}
                        className="font-body text-xs px-3 py-1 border border-gold/25 text-heritage-heading/70"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">
                    Not added yet
                  </p>
                )
              ) : (
                <TagEditor
                  label="Materials"
                  icon={Hammer}
                  items={draft?.materials ?? []}
                  onChange={(v) => setField("materials", v)}
                />
              )}
            </motion.div>

            {/* Techniques */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                <Tag size={14} style={{ color: ORG }} /> Techniques
              </h2>
              {!editing ? (
                (data.techniques ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(data.techniques ?? []).map((t) => (
                      <span
                        key={t}
                        className="font-body text-xs px-3 py-1 border border-gold/25 text-heritage-heading/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">
                    Not added yet
                  </p>
                )
              ) : (
                <TagEditor
                  label="Techniques"
                  icon={Tag}
                  items={draft?.techniques ?? []}
                  onChange={(v) => setField("techniques", v)}
                />
              )}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4">
                About & Craft
              </h2>
              {!editing ? (
                data.description ? (
                  <p className="font-body text-sm text-heritage-heading/75 leading-relaxed">
                    {data.description}
                  </p>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">
                    Not added yet
                  </p>
                )
              ) : (
                <textarea
                  rows={5}
                  className={inputCls + " resize-none"}
                  placeholder="Describe your craft and journey…"
                  value={draft?.description ?? ""}
                  onChange={(e) => setField("description", e.target.value)}
                />
              )}
            </motion.div>

            {/* Inspiration */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                <Sparkles size={14} style={{ color: ORG }} /> Inspiration
              </h2>
              {!editing ? (
                data.inspiration ? (
                  <p className="font-body text-sm text-heritage-heading/75 leading-relaxed">
                    {data.inspiration}
                  </p>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">
                    Not added yet
                  </p>
                )
              ) : (
                <textarea
                  rows={4}
                  className={inputCls + " resize-none"}
                  placeholder="What inspires your work…"
                  value={draft?.inspiration ?? ""}
                  onChange={(e) => setField("inspiration", e.target.value)}
                />
              )}
            </motion.div>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading mb-4 flex items-center gap-2">
                <Award size={14} style={{ color: ORG }} /> Awards & Recognition
              </h2>
              {!editing ? (
                data.awards ? (
                  <p className="font-body text-sm text-heritage-heading/75 leading-relaxed">
                    {data.awards}
                  </p>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">
                    Not added yet
                  </p>
                )
              ) : (
                <textarea
                  rows={3}
                  className={inputCls + " resize-none"}
                  placeholder="Awards, recognition, certifications…"
                  value={draft?.awards ?? ""}
                  onChange={(e) => setField("awards", e.target.value)}
                />
              )}
            </motion.div>

            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-sandstone border border-gold/30 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-sm uppercase tracking-[2px] text-heritage-heading">
                  Portfolio
                </h2>
                <div>
                  <input
                    ref={portfolioRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePortfolioUpload}
                  />
                  <button
                    onClick={() => portfolioRef.current?.click()}
                    disabled={uploadingPortfolio}
                    className="inline-flex items-center gap-2 px-3 py-2 font-body text-xs uppercase tracking-[1px] border text-heritage-heading/70 hover:text-heritage-heading transition-all disabled:opacity-50"
                    style={{ borderColor: `${ORG}50` }}
                  >
                    {uploadingPortfolio ? (
                      <>
                        <Loader2 size={11} className="animate-spin" />{" "}
                        Uploading…
                      </>
                    ) : (
                      <>
                        <ImagePlus size={11} /> Add More
                      </>
                    )}
                  </button>
                </div>
              </div>
              {(karigar.portfolio ?? []).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(karigar.portfolio ?? []).map((url, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square overflow-hidden border border-gold/20 hover:border-gold/50 transition-colors"
                    >
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={optimizeCloudinaryUrl(url, 600, 600)}
                          alt={`Work ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </a>
                      <button
                        onClick={() => removePortfolioImage(url, i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                      {i === 0 && (
                        <div
                          className="absolute bottom-0 left-0 right-0 text-center font-body text-[9px] uppercase tracking-[1.5px] py-0.5 text-white"
                          style={{ background: `${ORG}cc` }}
                        >
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gold/25 flex flex-col items-center justify-center py-12 gap-3">
                  <ImagePlus size={24} className="text-gold/40" />
                  <p className="font-body text-sm text-muted-foreground">
                    No portfolio images yet
                  </p>
                  <button
                    onClick={() => portfolioRef.current?.click()}
                    className="font-body text-xs uppercase tracking-[1px] px-4 py-2 border border-gold/30 text-heritage-heading/60 hover:text-heritage-heading transition-colors"
                  >
                    Upload Photos
                  </button>
                </div>
              )}
            </motion.div>

            {/* Dashboard CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ borderColor: `${ORG}40`, background: `${ORG}08` }}
            >
              <div>
                <p className="font-display text-sm uppercase tracking-[1.5px] text-heritage-heading mb-1">
                  Manage your bookings
                </p>
                <p className="font-body text-xs text-heritage-heading/55">
                  View, confirm and track all your booking requests.
                </p>
              </div>
              <Link
                to="/karigar-dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-body text-xs uppercase tracking-[1.5px] text-white flex-shrink-0"
                style={{ background: ORG }}
              >
                <LayoutDashboard size={13} /> Go to Dashboard
              </Link>
            </motion.div>

            {/* Danger zone */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="border border-red-200 p-6"
            >
              <h2 className="font-display text-sm uppercase tracking-[2px] text-red-500 mb-2 flex items-center gap-2">
                <AlertTriangle size={14} /> Danger Zone
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Permanently delete your karigar profile and all associated data.
                This cannot be undone.
              </p>
              <button
                onClick={() => setShowDelete(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-[1.5px] border border-red-300 text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={12} /> Delete Profile
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {showDelete && (
          <DeleteModal
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

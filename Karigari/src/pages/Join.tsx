import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Plus, X, Upload, ImagePlus,
  CheckCircle2, User, Palette, FileText, Camera, ShieldCheck,
  Video, Award, Hammer, Tag, IndianRupee, Phone, Mail,
  MapPin, Sparkles, Star,
} from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useBackground } from "@/hooks/useBackground";
// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
const CRAFT_FORMS = [
  "Blue Pottery","Phad Painting","Bandhani","Gond Art","Chanderi Weaving",
  "Bagh Print","Madhubani Painting","Warli Art","Dhokra Metal Casting",
  "Bidriware","Patola Silk","Kashmiri Embroidery","Phulkari","Zardozi",
  "Kantha Stitch","Terracotta","Block Printing","Pichwai Painting",
  "Meenakari","Tanjore Painting","Pattachitra","Kalamkari",
  "Rogan Art","Pashmina Weaving","Other (specify below)",
];
const EXPERIENCE_RANGES = [
  "Less than 5 years","5–10 years","10–15 years","15–20 years",
  "20–25 years","25–30 years","30–35 years","35–40 years","40+ years",
];
const REGIONS = [
  "Rajasthan","Madhya Pradesh","Gujarat","Uttar Pradesh","West Bengal",
  "Tamil Nadu","Kerala","Himachal Pradesh","Jammu & Kashmir",
  "Maharashtra","Odisha","Andhra Pradesh","Telangana","Karnataka",
  "Punjab","Bihar","Jharkhand","Assam","Manipur","Other",
];
const PRESET_SPECIALTIES = [
  "Floral Motifs","Geometric Patterns","Narrative Scrolls","Deity Panels",
  "Bridal Work","Persian Motifs","Animal Spirits","Tribal Art",
  "Zari Brocade","Natural Dyes","Block Printing","Miniature Work",
  "Mughal Patterns","Folk Epics","Mythological Scenes","Abstract Forms",
];
const PRICE_RANGES = [
  "₹500 – ₹1,000","₹1,000 – ₹2,500","₹2,500 – ₹5,000",
  "₹5,000 – ₹10,000","₹10,000 – ₹25,000","₹25,000+","Custom (specify below)",
];
const STEPS = [
  { id:1, label:"Identity",     icon:User,        desc:"Personal details"  },
  { id:2, label:"Craft",        icon:Palette,     desc:"Art & tradition"   },
  { id:3, label:"Story",        icon:FileText,    desc:"Voice & journey"   },
  { id:4, label:"Portfolio",    icon:Camera,      desc:"Work samples"      },
  { id:5, label:"Verification", icon:ShieldCheck, desc:"Trust & documents" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG Textures — inline data URIs
// ─────────────────────────────────────────────────────────────────────────────
const MANDALA_BG   = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.07' stroke-width='0.8'%3E%3Ccircle cx='30' cy='30' r='22'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cline x1='30' y1='8' x2='30' y2='52'/%3E%3Cline x1='8' y1='30' x2='52' y2='30'/%3E%3Cline x1='14' y1='14' x2='46' y2='46'/%3E%3Cline x1='46' y1='14' x2='14' y2='46'/%3E%3C/g%3E%3C/svg%3E")`;
const JALI_BG      = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a227' stroke-opacity='0.06' stroke-width='0.7'%3E%3Crect x='4' y='4' width='24' height='24' rx='2'/%3E%3Crect x='9' y='9' width='14' height='14' rx='1'/%3E%3Ccircle cx='16' cy='16' r='4'/%3E%3Cline x1='16' y1='4' x2='16' y2='28'/%3E%3Cline x1='4' y1='16' x2='28' y2='16'/%3E%3C/g%3E%3C/svg%3E")`;
const BLOCKPRINT_BG= `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a227' fill-opacity='0.045'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface PersonalState {
  name:string; profileName:string; age:string; gender:string;
  city:string; village:string; pincode:string;
  address:string; workshopAddress:string;
  phone:string; whatsapp:string; email:string;
  instagram:string; facebook:string; youtube:string;
}
interface CraftState {
  craftForm:string; craftCustom:string; region:string;
  experience:string; priceRange:string; priceCustom:string;
}
type MediaItem = { file:File; preview:string; type:"image"|"video" };
type CertItem  = { file:File; preview:string };

// ─────────────────────────────────────────────────────────────────────────────
// Module-level helpers (never remount)
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity:0, y:18 },
  visible: { opacity:1, y:0, transition:{ duration:0.4, ease:"easeOut" } },
  exit:    { opacity:0, y:-8, transition:{ duration:0.2 } },
};

const FieldErr = ({ msg }:{ msg?:string }) =>
  msg ? (
    <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
      className="flex items-center gap-1.5 font-body text-[11px] text-red-500 mt-1.5">
      <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{msg}
    </motion.p>
  ) : null;

const FieldLbl = ({ children, req }:{ children:React.ReactNode; req?:boolean }) => (
  <label className="block font-body text-[11px] uppercase tracking-[1.8px] text-muted-foreground mb-2 font-medium">
    {children}{req && <span className="text-primary ml-1">*</span>}
  </label>
);

const SArrow = () => (
  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">▾</span>
);

// Section header with ornamental line
const SHead = ({ num, icon:Icon, title, subtitle }:{
  num:string; icon:React.ElementType; title:string; subtitle:string
}) => (
  <div className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      <div className="h-[1px] w-6 bg-gold/50" />
      <span className="font-body text-[10px] uppercase tracking-[2.5px] text-gold">Section {num}</span>
      <div className="h-[1px] flex-1 bg-gold/20" />
    </div>
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center"
        style={{ background:"linear-gradient(135deg, hsl(var(--sandstone)), hsl(var(--warm-cream)))", border:"1px solid hsl(var(--warm-gold)/0.4)" }}>
        <Icon size={18} className="text-gold" />
      </div>
      <div>
        <h2 className="font-display text-2xl text-heritage-heading leading-tight">{title}</h2>
        <p className="font-body text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  </div>
);

// Highlighted info card (sandstone bg with texture)
const InfoCard = ({ children, texture = BLOCKPRINT_BG }:{ children:React.ReactNode; texture?:string }) => (
  <div className="relative overflow-hidden border border-gold/35 mb-6"
    style={{ backgroundImage:texture, backgroundColor:"hsl(var(--sandstone))" }}>
    <div className="absolute top-0 left-0 w-1 h-full" style={{ background:"linear-gradient(180deg, hsl(var(--amber-fire)), hsl(var(--sun-gold)))" }} />
    <div className="relative z-10 pl-5 pr-5 py-5">{children}</div>
  </div>
);

// TagPill
const TagPill = ({ label, onRemove }:{ label:string; onRemove:()=>void }) => (
  <span className="inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 border border-gold/60 text-foreground"
    style={{ background:"linear-gradient(135deg, hsl(var(--warm-cream)), hsl(var(--sandstone)))" }}>
    {label}
    <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5">
      <X size={10} />
    </button>
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Join() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/", {
        state: {
          openLogin: true,
          message: "Sign in to begin your artisan registration journey.",
          redirectTo: "/join"
        }
      });
    }
  });

  return () => unsubscribe();
}, [navigate]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [personal, setPersonal] = useState<PersonalState>({
    name:"", profileName:"", age:"", gender:"",
    city:"", village:"", pincode:"",
    address:"", workshopAddress:"",
    phone:"", whatsapp:"", email:"",
    instagram:"", facebook:"", youtube:"",
  });
  const [craft, setCraft] = useState<CraftState>({
    craftForm:"", craftCustom:"", region:"",
    experience:"", priceRange:"", priceCustom:"",
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [customSpecInput,   setCustomSpecInput]   = useState("");
  const [customSpecialties, setCustomSpecialties] = useState<string[]>([]);
  const [materials,         setMaterials]         = useState<string[]>([]);
  const [materialInput,     setMaterialInput]     = useState("");
  const [techniques,        setTechniques]        = useState<string[]>([]);
  const [techniqueInput,    setTechniqueInput]    = useState("");
  const [description,       setDescription]       = useState("");
  const [inspiration,       setInspiration]       = useState("");
  const [media,             setMedia]             = useState<MediaItem[]>([]);
  const [certs,             setCerts]             = useState<CertItem[]>([]);
  const [awardText,         setAwardText]         = useState("");
  const [idFile,            setIdFile]            = useState<File|null>(null);
  const [idType,            setIdType]            = useState("");
  const [bankName,          setBankName]          = useState("");
  const [accountNo,         setAccountNo]         = useState("");
  const [ifsc,              setIfsc]              = useState("");
  const [upi,               setUpi]               = useState("");
  const [agreeTerms,        setAgreeTerms]        = useState(false);
  const [agreeAuth,         setAgreeAuth]         = useState(false);
  const [agreeMarket,       setAgreeMarket]       = useState(false);
  const [agreeGI,           setAgreeGI]           = useState(false);
  const [agreeDC,           setAgreeDC]           = useState(false);
  const [errors,            setErrors]            = useState<Record<string,string>>({});
  const [submitted,         setSubmitted]         = useState(false);
  const [isSubmitting,      setIsSubmitting]      = useState(false); 

  const mediaRef = useRef<HTMLInputElement>(null);
  const certRef  = useRef<HTMLInputElement>(null);
  const idRef    = useRef<HTMLInputElement>(null);

  // ── Stable handlers ────────────────────────────────────────────────────────
  const setP = useCallback((k:keyof PersonalState, v:string) => {
    setPersonal(p => ({ ...p, [k]:v }));
    setErrors(p => ({ ...p, [k]:"" }));
  }, []);

  const setC = useCallback((k:keyof CraftState, v:string) => {
    setCraft(p => ({ ...p, [k]:v }));
    setErrors(p => ({ ...p, [k]:"" }));
  }, []);

  // Phone: digits only, max 10
  const onPhone = useCallback((k:"phone"|"whatsapp", v:string) => {
    const digits = v.replace(/\D/g,"").slice(0,10);
    setP(k, digits);
  }, [setP]);

  // Pincode: digits only, max 6
  const onPincode = useCallback((v:string) => {
    const digits = v.replace(/\D/g,"").slice(0,6);
    setP("pincode", digits);
  }, [setP]);

  const toggleSpec = (s:string) =>
    setSelectedSpecialties(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  const addTag = (
    val:string, list:string[],
    setList:React.Dispatch<React.SetStateAction<string[]>>,
    setInput:React.Dispatch<React.SetStateAction<string>>,
    exclude:string[]=[],
  ) => {
    const v = val.trim();
    if (!v||list.includes(v)||exclude.includes(v)) return;
    setList(p=>[...p,v]); setInput("");
  };

  const removeTag = (s:string, setList:React.Dispatch<React.SetStateAction<string[]>>) =>
    setList(p=>p.filter(x=>x!==s));

  const onMediaChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files||[]);
    const next:MediaItem[] = files.slice(0,10-media.length).map(f=>({
      file:f, preview:URL.createObjectURL(f),
      type:f.type.startsWith("video")?"video":"image",
    }));
    setMedia(p=>[...p,...next]); e.target.value="";
  };
  const onCertChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files||[]);
    const next:CertItem[] = files.slice(0,5-certs.length).map(f=>({ file:f, preview:URL.createObjectURL(f) }));
    setCerts(p=>[...p,...next]); e.target.value="";
  };
  const onIdChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setIdFile(e.target.files[0]); e.target.value=""; setErrors(p=>({...p,idFile:""})); }
  };
  const removeMedia = (i:number) => { URL.revokeObjectURL(media[i].preview); setMedia(p=>p.filter((_,x)=>x!==i)); };
  const removeCert  = (i:number) => setCerts(p=>p.filter((_,x)=>x!==i));

  // ── Validation ─────────────────────────────────────────────────────────────
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validate = (s:number):Record<string,string> => {
    const e:Record<string,string> = {};
    if (s===1) {
      if (!personal.name.trim())        e.name        = "Full name is required";
      if (!personal.profileName.trim()) e.profileName = "Profile display name is required";
      if (!personal.age.trim())         e.age         = "Age is required";
      else if (parseInt(personal.age)<18) e.age       = "You must be at least 18 years old";
      if (!personal.gender)             e.gender      = "Please select gender";
      if (!personal.city.trim())        e.city        = "City / District is required";
      if (!personal.pincode||personal.pincode.length!==6) e.pincode = "Enter a valid 6-digit PIN code";
      if (!personal.address.trim())     e.address     = "Home address is required";
      if (!personal.phone||personal.phone.length!==10)    e.phone   = "Enter a valid 10-digit contact number";
      if (!personal.email.trim())       e.email       = "Email address is required";
      else if (!EMAIL_RE.test(personal.email)) e.email = "Enter a valid email address";
    }
    if (s===2) {
      if (!craft.craftForm)             e.craftForm   = "Please select a craft form";
      if (craft.craftForm==="Other (specify below)"&&!craft.craftCustom.trim()) e.craftCustom = "Please specify your craft";
      if (!craft.experience)            e.experience  = "Please select experience";
      if (!craft.region)                e.region      = "Please select a region";
    }
    if (s===3) {
      if (description.trim().length<80) e.description = "Please write at least 80 characters";
    }
    if (s===5) {
      if (!idType)                      e.idType      = "Please select your ID document type";
      if (!idFile)                      e.idFile      = "Please upload your identity document";
      if (!bankName)                    e.bankName    = "Please select your bank";
      if (!accountNo.trim())            e.accountNo   = "Account number is required";
      if (!ifsc.trim()||ifsc.length<11) e.ifsc        = "Enter a valid 11-character IFSC code";
      if (!agreeTerms)                  e.agreeTerms  = "You must agree to the Terms & Conditions";
      if (!agreeAuth)                   e.agreeAuth   = "Please confirm the authenticity of your work";
    }
    return e;
  };

  const submitToFirebase = async () => {
    if (isSubmitting) return; // 🚫 stop double click

    setIsSubmitting(true); // start loading

  try {
    console.log("Submit function triggered");

    // 🔥 Reusable Upload Function
    const uploadToCloudinary = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "karigarh_unsigned");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbzo2oidq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    };

    // 🔥 Upload Portfolio
    const mediaUrls = await Promise.all(
      media.map(item => uploadToCloudinary(item.file))
    );

    // 🔥 Upload Certificates
    const certificateUrls = await Promise.all(
      certs.map(cert => uploadToCloudinary(cert.file))
    );

    // 🔥 Upload ID Proof
    let idProofUrl = "";
    if (idFile) {
      idProofUrl = await uploadToCloudinary(idFile);
    }

    // 🔥 Create Data Object
    const fullData = {
      userId: auth.currentUser?.uid,
      personal,
      craft,
      specialties: selectedSpecialties,
      materials,
      techniques,
      description,
      inspiration,
      awards: awardText,

      portfolio: mediaUrls,
      certificates: certificateUrls,

      bankDetails: {
        bankName,
        accountNo,
        ifsc,
        upi,
      },

      verification: {
        idType,
        idProofUrl,
      },

      agreements: {
        agreeTerms,
        agreeAuth,
        agreeMarket,
        agreeGI,
        agreeDC,
      },

      status: "pending",
      createdAt: serverTimestamp(),
    };

    console.log("Data being sent:", fullData);

    await addDoc(collection(db, "craftsmen"), fullData);

    setSubmitted(true);

  } catch (error: any) {
    console.error("FULL FIREBASE ERROR:", error);
    alert("Error: " + error.message);
  } finally {
    setIsSubmitting(false); // stop loading
  }
};
  const goNext = () => {
    const errs = validate(step);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:"smooth"}); return; }
    setErrors({});
    if (step<5) { setStep(s=>s+1); window.scrollTo({top:0,behavior:"smooth"}); }
    else {
  submitToFirebase();
 }
  };
  const goBack = () => { setErrors({}); setStep(s=>s-1); window.scrollTo({top:0,behavior:"smooth"}); };
  const goTo   = (s:number) => { if(s<=step){ setErrors({}); setStep(s); window.scrollTo({top:0,behavior:"smooth"}); } };

  // ── Style helpers ──────────────────────────────────────────────────────────
  const inputCls = (k="") =>
    `w-full bg-white border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/35 ` +
    `focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all duration-200 ` +
    (errors[k] ? "border-red-400 bg-red-50/30" : "border-gold/35 focus:border-gold/70 hover:border-gold/50");

  const selCls = (k="") => `${inputCls(k)} appearance-none pr-9 cursor-pointer`;

  // ── Navigation buttons ─────────────────────────────────────────────────────
  const NavButtons = ({ submitLabel="Save & Continue" }:{ submitLabel?:string }) => (
    <div className="flex items-center justify-between pt-8 mt-10"
      style={{ borderTop:"1px solid hsl(var(--warm-gold)/0.25)" }}>
      {step>1 ? (
        <button onClick={goBack}
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[1.5px] text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 border border-transparent hover:border-gold/30">
          <ArrowLeft size={13} /> Back
        </button>
      ) : <div />}
      <button
  onClick={step === 5 ? submitToFirebase : goNext}
  disabled={isSubmitting}
  className={`btn-primary inline-flex items-center gap-2 text-sm shadow-lg
    ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
  style={{ boxShadow:"0 4px 24px hsl(var(--deep-orange)/0.25)" }}
>
  {isSubmitting ? "Submitting..." : submitLabel}
  {!isSubmitting && <ArrowRight size={14} />}
</button>
    </div>
  );
const { creamBg } = useBackground();
  // ── Success Screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center px-6 bg-parchment"
        style={{ backgroundImage:MANDALA_BG }}>
        <motion.div initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5 }}
          className="max-w-md w-full text-center py-20 relative z-10">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 border-2 border-gold/30 rounded-full animate-ping opacity-20" />
            <div className="w-24 h-24 border-2 border-gold flex items-center justify-center bg-sandstone rounded-full">
              <CheckCircle2 size={36} className="text-gold" />
            </div>
          </div>
          <div className="gold-divider mb-6" />
          <h2 className="font-display text-3xl text-heritage-heading mb-3">Application Received</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-10">
            Thank you, <span className="text-foreground font-semibold">{personal.profileName||personal.name}</span>.
            Your karigar profile is under review. Our team will verify your details within <strong>2–3 working days</strong>.
          </p>
          <InfoCard>
            <p className="font-body text-[10px] uppercase tracking-[2px] text-gold mb-3">What happens next</p>
            {["We review your craft details & documents","Our team may call to verify your identity","Your profile goes live on Karigarh"].map((s,i)=>(
              <div key={i} className="flex items-start gap-3 mb-2">
                <span className="font-display text-xs text-gold mt-0.5">0{i+1}</span>
                <p className="font-body text-xs text-muted-foreground">{s}</p>
              </div>
            ))}
          </InfoCard>
          <div className="gold-divider mb-8" />
          <Link to="/" className="btn-primary inline-block">Return Home</Link>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={creamBg}>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-ink relative overflow-hidden">
        {/* Layered textures */}
        <div className="absolute inset-0" style={{ backgroundImage:JALI_BG }} />
        <div className="absolute inset-0" style={{ backgroundImage:MANDALA_BG, opacity:0.4 }} />
        {/* Gold gradient glow bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background:"linear-gradient(90deg, transparent, hsl(var(--warm-gold)/0.6), transparent)" }} />
        {/* Radial glow accents */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background:"radial-gradient(circle, hsl(var(--amber-fire)/0.07), transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full"
          style={{ background:"radial-gradient(circle, hsl(var(--sun-gold)/0.05), transparent 70%)" }} />

        <div className="container-heritage px-4 pt-10 pb-14 relative z-10">
          <Link to="/"
            className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[2px] text-parchment/35 hover:text-parchment mb-10 transition-colors">
            <ArrowLeft size={12} /> Back to Home
          </Link>

          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="h-px w-5 bg-gold/60" />
                <span className="font-body text-[10px] uppercase tracking-[3px] text-gold">Karigar Registration</span>
                <div className="h-px w-5 bg-gold/60" />
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-parchment leading-[1.05] mb-5">
                Preserve Your Craft.<br />
                <span className="relative inline-block">
                  <span className="text-gold">Reach the World.</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-px"
                    style={{ background:"linear-gradient(90deg, hsl(var(--sun-gold)/0.6), transparent)" }} />
                </span>
              </h1>
              <p className="font-body text-sm text-parchment/55 leading-relaxed max-w-lg">
                Join India's most dedicated platform for traditional artisans. Let your heritage reach collectors, learners, and supporters across the country and beyond.
              </p>
            </div>

            {/* Step preview pills */}
            <div className="hidden lg:flex flex-col gap-1.5">
              {STEPS.map(s => {
                const Icon = s.icon;
                const done = s.id < step; const active = s.id === step;
                return (
                  <div key={s.id}
                    className={`flex items-center gap-3 px-4 py-2.5 border transition-all duration-300 cursor-pointer
                      ${active ? "border-gold/40 bg-white/[0.07]" : done ? "border-gold/20 bg-white/[0.03]" : "border-white/5 bg-transparent opacity-40"}`}
                    onClick={() => goTo(s.id)}>
                    <div className={`w-6 h-6 flex items-center justify-center border flex-shrink-0
                      ${active ? "bg-primary border-primary text-parchment" : done ? "bg-gold border-gold text-ink" : "border-gold/30 text-gold/40"}`}>
                      {done ? <CheckCircle2 size={11}/> : <Icon size={11}/>}
                    </div>
                    <span className="font-body text-xs uppercase tracking-[1.5px] text-parchment/50">{s.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />}
                    {done && <CheckCircle2 size={10} className="text-gold ml-auto" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STICKY STEP BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-[70px] z-20 border-b border-gold/30 overflow-x-auto scrollbar-hide"
        style={{ background:`hsl(var(--sandstone))`, backgroundImage:BLOCKPRINT_BG }}>
        <div className="container-heritage px-4 min-w-max sm:min-w-0">
          <div className="flex">
            {STEPS.map(s => {
              const Icon = s.icon;
              const active = s.id===step; const done = s.id<step;
              return (
                <button key={s.id} onClick={() => goTo(s.id)} disabled={s.id>step}
                  className={`flex-1 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 py-3 px-3 sm:px-4 border-b-[2px] transition-all duration-300
                    ${active ? "border-primary" : done ? "border-gold/50 cursor-pointer hover:border-gold" : "border-transparent cursor-default opacity-35"}`}>
                  <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border transition-all duration-200
                    ${active ? "bg-primary border-primary text-parchment" : done ? "bg-gold/90 border-gold text-ink" : "border-gold/30 text-muted-foreground bg-white/70"}`}>
                    {done ? <CheckCircle2 size={12}/> : <Icon size={12}/>}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className={`font-display text-[10px] uppercase tracking-[1.5px] leading-none mb-0.5 ${active?"text-heritage-heading":done?"text-foreground/80":"text-muted-foreground"}`}>{s.label}</p>
                    <p className="font-body text-[9px] text-muted-foreground/40 hidden sm:block">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="container-heritage px-4 py-14">
        <div className="flex gap-14 items-start">

          {/* ─────────────────────────── FORM ─────────────────────────────── */}
          <div className="flex-1 min-w-0 max-w-2xl">
            <AnimatePresence mode="wait">

              {/* ═══════════════════════════════════════════
                  STEP 1 — PERSONAL IDENTITY
              ═══════════════════════════════════════════ */}
              {step===1 && (
                <motion.div key="s1" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                  <SHead num="01" icon={User} title="Personal Identity"
                    subtitle="Your profile information — how artisan seekers will know and find you." />

                  {/* Full Legal Name */}
                  <div className="mb-5">
                    <FieldLbl req>Full Legal Name</FieldLbl>
                    <input type="text" value={personal.name} onChange={e=>setP("name",e.target.value)}
                      className={inputCls("name")} placeholder="As per your identity document" autoComplete="name" />
                    <FieldErr msg={errors.name} />
                  </div>

                  {/* Profile Display Name — highlighted */}
                  <InfoCard texture={MANDALA_BG}>
                    <div className="flex items-start gap-3 mb-3">
                      <Star size={14} className="text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading mb-0.5">Profile Display Name</p>
                        <p className="font-body text-[11px] text-muted-foreground">This is the <strong>main heading</strong> visitors see on your public profile — your name, shop name, or brand.</p>
                      </div>
                    </div>
                    <input type="text" value={personal.profileName} onChange={e=>setP("profileName",e.target.value)}
                      className={inputCls("profileName")} placeholder="e.g. Mohan Kumhar Pottery, Shanti Devi Phad Art" autoComplete="off" />
                    <FieldErr msg={errors.profileName} />
                  </InfoCard>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
                    <div>
                      <FieldLbl req>Age</FieldLbl>
                      <input type="number" min={18} max={100} value={personal.age}
                        onChange={e=>{ setP("age",e.target.value); if(e.target.value&&parseInt(e.target.value)<18) setErrors(p=>({...p,age:"You must be at least 18 years old"})); }}
                        className={inputCls("age")} placeholder="Minimum 18" />
                      <FieldErr msg={errors.age} />
                    </div>
                    <div>
                      <FieldLbl req>Gender</FieldLbl>
                      <div className="relative">
                        <select value={personal.gender} onChange={e=>setP("gender",e.target.value)} className={selCls("gender")}>
                          <option value="">Select…</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select><SArrow/>
                      </div>
                      <FieldErr msg={errors.gender} />
                    </div>
                    <div>
                      <FieldLbl req>City / District</FieldLbl>
                      <div className="relative">
                        <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                        <input type="text" value={personal.city} onChange={e=>setP("city",e.target.value)}
                          className={inputCls("city")+" !pl-9"} placeholder="e.g. Jaipur, Bhilwara, Dhar" autoComplete="address-level2" />
                      </div>
                      <FieldErr msg={errors.city} />
                    </div>
                    <div>
                      <FieldLbl>Village <span className="text-[9px] normal-case tracking-normal text-muted-foreground/50">(if applicable)</span></FieldLbl>
                      <input type="text" value={personal.village} onChange={e=>setP("village",e.target.value)}
                        className={inputCls()} placeholder="Village name" autoComplete="off" />
                    </div>
                    <div>
                      <FieldLbl req>PIN Code</FieldLbl>
                      <input type="text" inputMode="numeric" maxLength={6} value={personal.pincode}
                        onChange={e=>onPincode(e.target.value)}
                        className={inputCls("pincode")} placeholder="6-digit PIN code" autoComplete="postal-code" />
                      <FieldErr msg={errors.pincode} />
                      {personal.pincode&&personal.pincode.length<6&&!errors.pincode&&(
                        <p className="font-body text-[10px] text-muted-foreground/60 mt-1">{6-personal.pincode.length} more digit{6-personal.pincode.length!==1?"s":""} needed</p>
                      )}
                    </div>
                    {/* Contact Number */}
                    <div>
                      <FieldLbl req>Contact Number</FieldLbl>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                        <input type="text" inputMode="numeric" value={personal.phone}
                          onChange={e=>onPhone("phone",e.target.value)}
                          className={inputCls("phone")+" !pl-9"} placeholder="10-digit number" autoComplete="tel" />
                      </div>
                      <FieldErr msg={errors.phone} />
                      {personal.phone&&personal.phone.length<10&&!errors.phone&&(
                        <p className="font-body text-[10px] text-muted-foreground/60 mt-1">{10-personal.phone.length} more digit{10-personal.phone.length!==1?"s":""} needed</p>
                      )}
                    </div>
                    {/* WhatsApp */}
                    <div>
                      <FieldLbl>WhatsApp Number <span className="text-[9px] normal-case tracking-normal text-muted-foreground/50">(if different)</span></FieldLbl>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                        <input type="text" inputMode="numeric" value={personal.whatsapp}
                          onChange={e=>onPhone("whatsapp",e.target.value)}
                          className={inputCls()+" !pl-9"} placeholder="10-digit WhatsApp number" autoComplete="tel" />
                      </div>
                    </div>
                    {/* Email */}
                    <div>
                      <FieldLbl req>Email Address</FieldLbl>
                      <div className="relative">
                        <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                        <input type="email" value={personal.email} onChange={e=>setP("email",e.target.value)}
                          className={inputCls("email")+" !pl-9"} placeholder="your@email.com" autoComplete="email" />
                      </div>
                      <FieldErr msg={errors.email} />
                    </div>
                    {/* Home Address */}
                    <div className="sm:col-span-2">
                      <FieldLbl req>Home Address</FieldLbl>
                      <textarea value={personal.address} onChange={e=>setP("address",e.target.value)} rows={2}
                        className={`${inputCls("address")} resize-none`} placeholder="House No., Street, Colony, District…" autoComplete="street-address" />
                      <FieldErr msg={errors.address} />
                    </div>
                    <div className="sm:col-span-2">
                      <FieldLbl>Workshop / Studio Address <span className="text-[9px] normal-case tracking-normal text-muted-foreground/50">(if different — optional)</span></FieldLbl>
                      <textarea value={personal.workshopAddress} onChange={e=>setP("workshopAddress",e.target.value)} rows={2}
                        className={`${inputCls()} resize-none`} placeholder="Workshop or studio location" autoComplete="off" />
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="mt-2 pt-6" style={{ borderTop:"1px solid hsl(var(--warm-gold)/0.2)" }}>
                    <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading mb-1">Social Profiles</p>
                    <p className="font-body text-[11px] text-muted-foreground mb-4">Optional — helps visitors discover more of your work.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {([
                        { k:"instagram" as const, pre:"instagram.com/",  ph:"your_handle"  },
                        { k:"facebook"  as const, pre:"facebook.com/",   ph:"your_page"    },
                        { k:"youtube"   as const, pre:"youtube.com/@",   ph:"your_channel" },
                      ]).map(({ k, pre, ph }) => (
                        <div key={k}>
                          <FieldLbl>{k.charAt(0).toUpperCase()+k.slice(1)}</FieldLbl>
                          <div className="border border-gold/35 bg-white focus-within:border-gold/70 focus-within:ring-2 focus-within:ring-gold/20 transition-all">
                            <span className="block font-body text-[9px] uppercase tracking-[1px] text-muted-foreground/55 px-3 pt-2">{pre}</span>
                            <input type="text" value={personal[k]} onChange={e=>setP(k,e.target.value)} placeholder={ph}
                              className="w-full bg-transparent px-3 pb-2.5 pt-0.5 font-body text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none" autoComplete="off" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <NavButtons />
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════
                  STEP 2 — CRAFT DETAILS
              ═══════════════════════════════════════════ */}
              {step===2 && (
                <motion.div key="s2" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                  <SHead num="02" icon={Palette} title="Craft Details"
                    subtitle="Tell us about your art tradition, specialities, materials, and techniques." />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-6">
                    <div className="sm:col-span-2">
                      <FieldLbl req>Craft Form</FieldLbl>
                      <div className="relative">
                        <select value={craft.craftForm} onChange={e=>setC("craftForm",e.target.value)} className={selCls("craftForm")}>
                          <option value="">Select a craft tradition…</option>
                          {CRAFT_FORMS.map(c=><option key={c} value={c}>{c}</option>)}
                        </select><SArrow/>
                      </div>
                      <FieldErr msg={errors.craftForm} />
                    </div>
                    {craft.craftForm==="Other (specify below)" && (
                      <div className="sm:col-span-2">
                        <FieldLbl req>Specify Your Craft</FieldLbl>
                        <input type="text" value={craft.craftCustom} onChange={e=>setC("craftCustom",e.target.value)}
                          className={inputCls("craftCustom")} placeholder="Describe your craft tradition" autoComplete="off" />
                        <FieldErr msg={errors.craftCustom} />
                      </div>
                    )}
                    <div>
                      <FieldLbl req>Region / State</FieldLbl>
                      <div className="relative">
                        <select value={craft.region} onChange={e=>setC("region",e.target.value)} className={selCls("region")}>
                          <option value="">Select region…</option>
                          {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
                        </select><SArrow/>
                      </div>
                      <FieldErr msg={errors.region} />
                    </div>
                    <div>
                      <FieldLbl req>Years of Experience</FieldLbl>
                      <div className="relative">
                        <select value={craft.experience} onChange={e=>setC("experience",e.target.value)} className={selCls("experience")}>
                          <option value="">Select range…</option>
                          {EXPERIENCE_RANGES.map(r=><option key={r} value={r}>{r}</option>)}
                        </select><SArrow/>
                      </div>
                      <FieldErr msg={errors.experience} />
                    </div>
                    {/* Price Range */}
                    <div className="sm:col-span-2">
                      <FieldLbl>Starting Price Range <span className="text-[9px] normal-case tracking-normal text-muted-foreground/50 ml-1">(optional)</span></FieldLbl>
                      <div className="relative mb-2">
                        <select value={craft.priceRange} onChange={e=>setC("priceRange",e.target.value)} className={selCls()}>
                          <option value="">Select approximate range…</option>
                          {PRICE_RANGES.map(r=><option key={r} value={r}>{r}</option>)}
                        </select><SArrow/>
                      </div>
                      {craft.priceRange==="Custom (specify below)" && (
                        <input type="text" value={craft.priceCustom} onChange={e=>setC("priceCustom",e.target.value)}
                          className={inputCls()} placeholder="e.g. ₹800 per small piece, ₹15,000 for commissioned work" autoComplete="off" />
                      )}
                    </div>
                  </div>

                  {/* Specialities */}
                  <InfoCard texture={BLOCKPRINT_BG}>
                    <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading mb-1">Specialities</p>
                    <p className="font-body text-[11px] text-muted-foreground mb-3">Select all that apply, or add your own.</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PRESET_SPECIALTIES.map(s=>(
                        <button key={s} type="button" onClick={()=>toggleSpec(s)}
                          className={`font-body text-[11px] px-3 py-1.5 border transition-all duration-150
                            ${selectedSpecialties.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-white border-gold/40 text-muted-foreground hover:border-gold hover:text-foreground"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {customSpecialties.length>0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {customSpecialties.map(s=>(
                          <TagPill key={s} label={s} onRemove={()=>{ removeTag(s,setCustomSpecialties); removeTag(s,setSelectedSpecialties); }} />
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input type="text" value={customSpecInput} onChange={e=>setCustomSpecInput(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addTag(customSpecInput,customSpecialties,setCustomSpecialties,setCustomSpecInput,PRESET_SPECIALTIES); if(customSpecInput.trim()) setSelectedSpecialties(p=>[...p,customSpecInput.trim()]); } }}
                        placeholder="Add a speciality not listed…"
                        className="flex-1 bg-white border border-gold/35 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-gold/70 focus:ring-2 focus:ring-gold/20 transition-all" autoComplete="off" />
                      <button type="button"
                        onClick={()=>{ addTag(customSpecInput,customSpecialties,setCustomSpecialties,setCustomSpecInput,PRESET_SPECIALTIES); if(customSpecInput.trim()&&!customSpecialties.includes(customSpecInput.trim())) setSelectedSpecialties(p=>[...p,customSpecInput.trim()]); }}
                        className="flex items-center gap-1.5 border border-gold px-4 py-2.5 bg-white text-gold hover:bg-gold hover:text-ink transition-all font-body text-xs uppercase tracking-[1px] whitespace-nowrap">
                        <Plus size={13}/> Add
                      </button>
                    </div>
                  </InfoCard>

                  {/* Materials */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1"><Hammer size={14} className="text-gold"/>
                      <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading">Materials Used</p>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground mb-2">e.g. Quartz Stone, Natural Dyes, Mulberry Silk, Teak Wood</p>
                    {materials.length>0&&<div className="flex flex-wrap gap-2 mb-3">{materials.map(m=><TagPill key={m} label={m} onRemove={()=>removeTag(m,setMaterials)}/>)}</div>}
                    <div className="flex gap-2">
                      <input type="text" value={materialInput} onChange={e=>setMaterialInput(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addTag(materialInput,materials,setMaterials,setMaterialInput); } }}
                        placeholder="Add a material…"
                        className="flex-1 bg-white border border-gold/35 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-gold/70 focus:ring-2 focus:ring-gold/20 transition-all" autoComplete="off" />
                      <button type="button" onClick={()=>addTag(materialInput,materials,setMaterials,setMaterialInput)}
                        className="flex items-center gap-1.5 border border-gold px-4 py-2.5 bg-white text-gold hover:bg-gold hover:text-ink transition-all font-body text-xs uppercase tracking-[1px] whitespace-nowrap">
                        <Plus size={13}/> Add
                      </button>
                    </div>
                  </div>

                  {/* Techniques */}
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Tag size={14} className="text-gold"/>
                      <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading">Techniques Used</p>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground mb-2">e.g. Hand-block printing, Lost-wax casting, Resist dyeing</p>
                    {techniques.length>0&&<div className="flex flex-wrap gap-2 mb-3">{techniques.map(tc=><TagPill key={tc} label={tc} onRemove={()=>removeTag(tc,setTechniques)}/>)}</div>}
                    <div className="flex gap-2">
                      <input type="text" value={techniqueInput} onChange={e=>setTechniqueInput(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addTag(techniqueInput,techniques,setTechniques,setTechniqueInput); } }}
                        placeholder="Add a technique…"
                        className="flex-1 bg-white border border-gold/35 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-gold/70 focus:ring-2 focus:ring-gold/20 transition-all" autoComplete="off" />
                      <button type="button" onClick={()=>addTag(techniqueInput,techniques,setTechniques,setTechniqueInput)}
                        className="flex items-center gap-1.5 border border-gold px-4 py-2.5 bg-white text-gold hover:bg-gold hover:text-ink transition-all font-body text-xs uppercase tracking-[1px] whitespace-nowrap">
                        <Plus size={13}/> Add
                      </button>
                    </div>
                  </div>
                  <NavButtons />
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════
                  STEP 3 — STORY
              ═══════════════════════════════════════════ */}
              {step===3 && (
                <motion.div key="s3" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                  <SHead num="03" icon={FileText} title="Your Story"
                    subtitle="Give visitors a window into your world. Stories connect hearts and preserve heritage." />

                  {/* Pull quote */}
                  <div className="relative mb-8 overflow-hidden" style={{ backgroundImage:MANDALA_BG, backgroundColor:"hsl(var(--sandstone))" }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                    <div className="pl-6 pr-5 py-5 relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={13} className="text-gold" />
                        <p className="font-display text-[10px] uppercase tracking-[2px] text-gold">Why this matters</p>
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed italic">
                        "Every master artisan carries a story centuries old. When you share your journey, you keep the tradition alive for generations yet to come."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <FieldLbl req>About You & Your Craft</FieldLbl>
                      <p className="font-body text-[11px] text-muted-foreground mb-2">Describe your craft tradition, how you learned it, your materials, and what makes your work unique. (Minimum 80 characters)</p>
                      <textarea value={description} onChange={e=>{ setDescription(e.target.value); setErrors(p=>({...p,description:""})); }}
                        placeholder="Born into a family of potters in the narrow lanes of Jaipur's old city, I learned blue pottery from my grandfather…"
                        rows={7} className={`${inputCls("description")} resize-none`} />
                      <div className="flex items-center justify-between mt-1.5">
                        <FieldErr msg={errors.description} />
                        <span className={`font-body text-xs ml-auto tabular-nums ${description.length<80?"text-muted-foreground/40":"text-gold"}`}>
                          {description.length} / 80+
                        </span>
                      </div>
                    </div>
                    <div>
                      <FieldLbl>What Inspires You? <span className="text-[9px] normal-case tracking-normal text-muted-foreground/50">(optional)</span></FieldLbl>
                      <p className="font-body text-[11px] text-muted-foreground mb-2">Cultural roots, personal moments, or influences that shape your art.</p>
                      <textarea value={inspiration} onChange={e=>setInspiration(e.target.value)}
                        placeholder="The geometry of Mughal architecture, the colours of the desert at dusk, the stories my grandmother told…"
                        rows={4} className={`${inputCls()} resize-none`} />
                    </div>
                  </div>
                  <NavButtons />
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════
                  STEP 4 — PORTFOLIO
              ═══════════════════════════════════════════ */}
              {step===4 && (
                <motion.div key="s4" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                  <SHead num="04" icon={Camera} title="Portfolio & Awards"
                    subtitle="Show your finest work and any recognitions you have received." />

                  {/* Media Upload */}
                  <div className="mb-8">
                    <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading mb-1">Work Samples</p>
                    <p className="font-body text-[11px] text-muted-foreground mb-4">Upload photos and short videos of your craft. Up to 10 files (images & videos accepted).</p>
                    <input ref={mediaRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={onMediaChange} />

                    {media.length===0 ? (
                      <button type="button" onClick={()=>mediaRef.current?.click()}
                        className="w-full border-2 border-dashed border-gold/35 bg-white hover:border-gold/70 hover:bg-sandstone/20 transition-all duration-300 py-14 flex flex-col items-center gap-4 group">
                        <div className="w-16 h-16 border border-gold/35 group-hover:border-gold/70 flex items-center justify-center transition-all bg-sandstone/50">
                          <ImagePlus size={22} className="text-muted-foreground/50 group-hover:text-gold transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="font-display text-sm text-heritage-heading uppercase tracking-[1.5px] mb-1">Upload Photos & Videos</p>
                          <p className="font-body text-xs text-muted-foreground/60">Click to browse · JPG, PNG, MP4, MOV · Up to 10 files</p>
                        </div>
                      </button>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                          {media.map((item,i)=>(
                            <motion.div key={i} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.2, delay:i*0.04 }}
                              className="relative group aspect-square overflow-hidden border border-gold/35">
                              {item.type==="image" ? (
                                <img src={item.preview} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-ink/90 gap-2">
                                  <Video size={26} className="text-gold" />
                                  <span className="font-body text-[10px] text-parchment/60 uppercase tracking-[1px]">Video</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/45 transition-all duration-300 flex items-center justify-center">
                                <button type="button" onClick={()=>removeMedia(i)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-white flex items-center justify-center hover:text-red-500">
                                  <X size={14}/>
                                </button>
                              </div>
                              {i===0 && <div className="absolute bottom-0 left-0 right-0 bg-primary/85 text-primary-foreground text-center font-body text-[9px] uppercase tracking-[1.5px] py-1">Cover</div>}
                            </motion.div>
                          ))}
                          {media.length<10 && (
                            <button type="button" onClick={()=>mediaRef.current?.click()}
                              className="aspect-square border-2 border-dashed border-gold/35 hover:border-gold/70 bg-white hover:bg-sandstone/30 flex flex-col items-center justify-center gap-2 transition-all group">
                              <Upload size={16} className="text-muted-foreground/50 group-hover:text-gold transition-colors" />
                              <span className="font-body text-[10px] text-muted-foreground/50">Add more</span>
                            </button>
                          )}
                        </div>
                        <p className="font-body text-[11px] text-muted-foreground/60">{media.length} / 10 · First photo becomes your cover</p>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-gold/25 p-4"
                      style={{ backgroundImage:BLOCKPRINT_BG, backgroundColor:"hsl(var(--sandstone)/0.5)" }}>
                      {[{icon:"📸",tip:"Use natural daylight — avoid harsh flash"},{icon:"🔍",tip:"Show fine details & close-up textures"},{icon:"🎬",tip:"A 30-sec process video creates deep connection"}].map(({icon,tip})=>(
                        <div key={tip} className="flex items-start gap-3">
                          <span className="text-base">{icon}</span>
                          <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  <div className="pt-6" style={{ borderTop:"1px solid hsl(var(--warm-gold)/0.2)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={15} className="text-gold" />
                      <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading">Awards & Certificates</p>
                      <span className="font-body text-[9px] text-muted-foreground/45 ml-1">(optional)</span>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground mb-4">Upload images of state, national, or international awards, GI tags, or craft certifications.</p>
                    <input ref={certRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={onCertChange} />
                    {certs.length===0 ? (
                      <button type="button" onClick={()=>certRef.current?.click()}
                        className="w-full border border-dashed border-gold/35 bg-white hover:border-gold/70 hover:bg-sandstone/20 py-8 flex flex-col items-center gap-3 transition-all group">
                        <Award size={18} className="text-muted-foreground/45 group-hover:text-gold transition-colors" />
                        <span className="font-body text-xs text-muted-foreground/55">Click to upload certificate images or PDFs (up to 5)</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                        {certs.map((c,i)=>(
                          <div key={i} className="relative group aspect-square border border-gold/35 overflow-hidden">
                            <img src={c.preview} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={()=>removeCert(i)}
                              className="absolute top-1 right-1 w-6 h-6 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                              <X size={11}/>
                            </button>
                          </div>
                        ))}
                        {certs.length<5 && (
                          <button type="button" onClick={()=>certRef.current?.click()}
                            className="aspect-square border-dashed border-2 border-gold/35 hover:border-gold/70 flex items-center justify-center transition-colors">
                            <Plus size={16} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="mt-3">
                      <FieldLbl>Describe Your Awards / Recognition</FieldLbl>
                      <textarea value={awardText} onChange={e=>setAwardText(e.target.value)} rows={3}
                        className={`${inputCls()} resize-none`} placeholder="e.g. National Award for Master Craftsman 2018, GI Tag holder since 2015…" />
                    </div>
                  </div>
                  <NavButtons />
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════
                  STEP 5 — TRUST & VERIFICATION
              ═══════════════════════════════════════════ */}
              {step===5 && (
                <motion.div key="s5" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                  <SHead num="05" icon={ShieldCheck} title="Trust & Verification"
                    subtitle="Mandatory fields in this section help us verify your identity and process payments." />

                  {/* ID Proof */}
                  <InfoCard texture={JALI_BG}>
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={14} className="text-gold" />
                      <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading">Identity Proof <span className="text-primary ml-1">*</span></p>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground mb-4">Upload a copy of your Aadhaar Card, Voter ID, or any government-issued identity document.</p>
                    <div className="mb-3">
                      <FieldLbl req>Document Type</FieldLbl>
                      <div className="relative">
                        <select value={idType} onChange={e=>{ setIdType(e.target.value); setErrors(p=>({...p,idType:""})); }} className={selCls("idType")}>
                          <option value="">Select document type…</option>
                          <option>Aadhaar Card</option><option>Voter ID</option>
                          <option>PAN Card</option><option>Passport</option>
                          <option>Driving Licence</option>
                        </select><SArrow/>
                      </div>
                      <FieldErr msg={errors.idType} />
                    </div>
                    <input ref={idRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onIdChange} />
                    {!idFile ? (
                      <button type="button" onClick={()=>idRef.current?.click()}
                        className={`w-full border border-dashed py-6 flex items-center justify-center gap-3 transition-all group
                          ${errors.idFile ? "border-red-400 bg-red-50/30" : "border-gold/40 bg-white hover:border-gold/70"}`}>
                        <Upload size={16} className="text-muted-foreground group-hover:text-gold transition-colors" />
                        <span className="font-body text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          Click to upload ID document (image or PDF) <span className="text-primary">*</span>
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-white border border-gold/40 px-4 py-3">
                        <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                        <span className="font-body text-sm text-foreground flex-1 truncate">{idFile.name}</span>
                        <button type="button" onClick={()=>setIdFile(null)} className="text-muted-foreground hover:text-red-500 transition-colors"><X size={14}/></button>
                      </div>
                    )}
                    <FieldErr msg={errors.idFile} />
                    <p className="font-body text-[10px] text-muted-foreground/55 mt-2">🔒 Documents are stored securely and used only for verification. Never shared publicly.</p>
                  </InfoCard>

                  {/* Bank Details */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <IndianRupee size={14} className="text-gold" />
                      <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading">Bank Details <span className="text-primary ml-1">*</span></p>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground mb-4">Required for receiving payments when customers purchase your work.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                      <div className="sm:col-span-2">
                        <FieldLbl req>Bank Name</FieldLbl>
                        <div className="relative">
                          <select value={bankName} onChange={e=>{ setBankName(e.target.value); setErrors(p=>({...p,bankName:""})); }} className={selCls("bankName")}>
                            <option value="">Select bank…</option>
                            {["State Bank of India","Punjab National Bank","Bank of Baroda","Canara Bank","HDFC Bank","ICICI Bank","Axis Bank","Post Office Savings","Other"].map(b=>(
                              <option key={b}>{b}</option>
                            ))}
                          </select><SArrow/>
                        </div>
                        <FieldErr msg={errors.bankName} />
                      </div>
                      <div>
                        <FieldLbl req>Account Number</FieldLbl>
                        <input type="text" value={accountNo} onChange={e=>{ setAccountNo(e.target.value); setErrors(p=>({...p,accountNo:""})); }}
                          className={inputCls("accountNo")} placeholder="Enter account number" autoComplete="off" />
                        <FieldErr msg={errors.accountNo} />
                      </div>
                      <div>
                        <FieldLbl req>IFSC Code</FieldLbl>
                        <input type="text" value={ifsc} onChange={e=>{ const v=e.target.value.toUpperCase().slice(0,11); setIfsc(v); setErrors(p=>({...p,ifsc:""})); }}
                          className={inputCls("ifsc")} placeholder="e.g. SBIN0001234" maxLength={11} autoComplete="off" />
                        <FieldErr msg={errors.ifsc} />
                        {ifsc&&ifsc.length<11&&!errors.ifsc&&<p className="font-body text-[10px] text-muted-foreground/55 mt-1">{11-ifsc.length} more character{11-ifsc.length!==1?"s":""} needed</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <FieldLbl>UPI ID <span className="text-[9px] normal-case tracking-normal text-muted-foreground/50">(optional — faster payments)</span></FieldLbl>
                        <input type="text" value={upi} onChange={e=>setUpi(e.target.value)}
                          className={inputCls()} placeholder="yourname@upi" autoComplete="off" />
                      </div>
                    </div>
                  </div>

                  {/* Declaration — mandatory */}
                  <div className="mb-6 border border-gold/30 relative overflow-hidden"
                    style={{ backgroundImage:MANDALA_BG, backgroundColor:"hsl(var(--sandstone)/0.6)" }}>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg, transparent, hsl(var(--warm-gold)/0.5), transparent)" }} />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Star size={13} className="text-gold" />
                        <p className="font-display text-xs uppercase tracking-[2px] text-heritage-heading">Declaration</p>
                      </div>
                      {[
                        { state:agreeTerms, set:setAgreeTerms, errKey:"agreeTerms", req:true,
                          label:<>I agree to Karigarh's <span className="text-gold underline cursor-pointer">Terms & Conditions</span> and <span className="text-gold underline cursor-pointer">Seller Policy</span>.</> },
                        { state:agreeAuth, set:setAgreeAuth, errKey:"agreeAuth", req:true,
                          label:"I confirm that all work submitted is genuinely handmade by me or my family." },
                        { state:agreeMarket, set:setAgreeMarket, errKey:"", req:false,
                          label:"I consent to receive updates, training information, and scheme notifications via SMS / WhatsApp." },
                      ].map(({ state, set, errKey, req, label },idx)=>(
                        <div key={idx} className="mb-2">
                          <div
                            className={`flex items-start gap-3 p-3 border transition-all duration-150 cursor-pointer
                              ${state ? "border-gold/45 bg-gold/5" : "border-transparent bg-white/40 hover:border-gold/25"}`}
                            onClick={()=>set(!state)}>
                            <div className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-all mt-0.5
                              ${state ? "bg-primary border-primary" : "border-gold/40 bg-white"}`}>
                              {state&&<CheckCircle2 size={11} className="text-white"/>}
                            </div>
                            <p className="font-body text-xs text-foreground leading-relaxed select-none">
                              {label}{req&&<span className="text-primary ml-1">*</span>}
                            </p>
                          </div>
                          {errKey&&errors[errKey]&&<FieldErr msg={errors[errKey]}/>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional scheme enrollment */}
                  <div className="border border-gold/20 bg-white/50 p-4">
                    <p className="font-display text-[10px] uppercase tracking-[2px] text-gold mb-3">Government Scheme Enrollment <span className="text-muted-foreground/40 normal-case tracking-normal text-[10px]">(optional)</span></p>
                    {[
                      { state:agreeGI,  set:setAgreeGI,  label:"I hold a GI (Geographical Indication) tag certification" },
                      { state:agreeDC,  set:setAgreeDC,  label:"I am registered with O/o DC Handicrafts" },
                    ].map(({ state, set, label })=>(
                      <div key={label} className="flex items-center gap-3 mb-2 cursor-pointer group" onClick={()=>set(!state)}>
                        <div className={`w-4 h-4 border flex items-center justify-center transition-all flex-shrink-0
                          ${state ? "bg-primary border-primary" : "border-gold/40 bg-sandstone group-hover:border-gold"}`}>
                          {state&&<CheckCircle2 size={9} className="text-white"/>}
                        </div>
                        <p className="font-body text-[11px] text-muted-foreground group-hover:text-foreground transition-colors select-none">{label}</p>
                      </div>
                    ))}
                  </div>

                  <NavButtons submitLabel="Submit Application" />
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ──────────────────────── SIDEBAR ──────────────────────────── */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-[150px] space-y-4">

              {/* Progress */}
              <div className="border border-gold/35 p-5 relative overflow-hidden"
                style={{ backgroundImage:JALI_BG, backgroundColor:"hsl(var(--sandstone))" }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg, transparent, hsl(var(--warm-gold)/0.4), transparent)" }} />
                <p className="font-display text-[10px] uppercase tracking-[2px] text-gold mb-4 relative z-10">Your Progress</p>
                <div className="space-y-1.5 relative z-10">
                  {STEPS.map(s=>{
                    const Icon=s.icon; const done=s.id<step; const active=s.id===step;
                    return (
                      <div key={s.id} onClick={()=>goTo(s.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 border transition-all duration-200
                          ${s.id<=step?"cursor-pointer":"cursor-default"}
                          ${active?"border-primary/40 bg-primary/5":done?"border-gold/25 bg-white/50 hover:border-gold/45":"border-transparent opacity-35"}`}>
                        <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center border transition-all
                          ${active?"bg-primary text-parchment border-primary":done?"bg-gold/90 text-ink border-gold":"border-gold/35 text-muted-foreground bg-white/70"}`}>
                          {done?<CheckCircle2 size={11}/>:<Icon size={11}/>}
                        </div>
                        <div className="flex-1">
                          <p className={`font-body text-[11px] font-medium ${active||done?"text-foreground":"text-muted-foreground"}`}>{s.label}</p>
                          <p className="font-body text-[9px] text-muted-foreground/45">{s.desc}</p>
                        </div>
                        {done&&<CheckCircle2 size={11} className="text-gold"/>}
                      </div>
                    );
                  })}
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-1 bg-gold/15 relative z-10">
                  <motion.div className="h-full bg-gradient-to-r from-amber-500 to-gold"
                    animate={{ width:`${((step-1)/4)*100}%` }} transition={{ duration:0.4, ease:"easeOut" }} />
                </div>
                <p className="font-body text-[10px] text-muted-foreground/50 mt-1.5 relative z-10">Step {step} of 5</p>
              </div>

              {/* Live preview */}
              {(personal.profileName||personal.name||craft.craftForm) && (
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  className="bg-ink border border-gold/20 p-5 relative overflow-hidden"
                  style={{ backgroundImage:MANDALA_BG }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg, transparent, hsl(var(--warm-gold)/0.3), transparent)" }} />
                  <p className="font-display text-[10px] uppercase tracking-[2px] text-gold mb-3 relative z-10">Profile Preview</p>
                  {personal.profileName&&<p className="font-display text-sm text-parchment mb-0.5 relative z-10">{personal.profileName}</p>}
                  {personal.name&&personal.name!==personal.profileName&&<p className="font-body text-[11px] text-parchment/45 mb-3 relative z-10">{personal.name}</p>}
                  {craft.craftForm&&(
                    <span className="seal-badge text-[9px] relative z-10 block w-fit mb-2">
                      {craft.craftForm==="Other (specify below)"?craft.craftCustom||"Custom Craft":craft.craftForm}
                    </span>
                  )}
                  {personal.city&&<p className="font-body text-[11px] text-parchment/40 mt-2 relative z-10">📍 {personal.city}{craft.region?`, ${craft.region}`:""}</p>}
                  {craft.experience&&<p className="font-body text-[11px] text-parchment/40 mt-1 relative z-10">🕰 {craft.experience}</p>}
                  {(craft.priceRange&&craft.priceRange!=="Custom (specify below)")&&<p className="font-body text-[11px] text-parchment/40 mt-1 relative z-10">₹ Starting {craft.priceRange}</p>}
                  {(craft.priceRange==="Custom (specify below)"&&craft.priceCustom)&&<p className="font-body text-[11px] text-parchment/40 mt-1 relative z-10">₹ {craft.priceCustom}</p>}
                </motion.div>
              )}

              {/* Trust badge */}
              <div className="border border-gold/25 p-4 flex items-start gap-3 bg-white/60">
                <ShieldCheck size={17} className="text-gold flex-shrink-0 mt-0.5" />
                <p className="font-body text-[11px] text-muted-foreground leading-relaxed">Your information is reviewed privately. We never share your data with third parties.</p>
              </div>

              {/* Required fields reminder */}
              <p className="font-body text-[10px] text-muted-foreground/50 text-center">
                Fields marked <span className="text-primary font-bold">*</span> are required to proceed.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
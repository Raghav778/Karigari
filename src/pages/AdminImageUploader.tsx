/**
 * AdminImageUploader.tsx
 * ─────────────────────────────────────────────────────────────────
 * TEMPORARY ADMIN PAGE — Upload images for seeded craftsmen.
 *
 * STEP 1: Add to your routes:
 *   import AdminImageUploader from "./pages/AdminImageUploader";
 *   <Route path="/admin-images" element={<AdminImageUploader />} />
 *
 * STEP 2: Visit http://localhost:5173/admin-images
 *
 * STEP 3: Pick a craftsman → upload 6–7 images → Save.
 *         Images go to Cloudinary; URLs are written to Firestore.
 *
 * STEP 4: Repeat for each craftsman.
 *
 * STEP 5: Remove this route and file when done.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const CLOUDINARY_CLOUD = "dbzo2oidq";
const CLOUDINARY_PRESET = "karigarh_unsigned";

interface KarigarEntry {
  id: string;
  name: string;
  craft: string;
  region: string;
  portfolio: string[];
}

export default function AdminImageUploader() {
  const [karigarList, setKarigarList] = useState<KarigarEntry[]>([]);
  const [selected, setSelected] = useState<KarigarEntry | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Load all seeded/approved craftsmen
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        query(collection(db, "craftsmen"), where("status", "==", "approved")),
      );
      const list: KarigarEntry[] = snap.docs.map((d) => ({
        id: d.id,
        name:
          d.data().personal?.profileName ||
          d.data().personal?.name ||
          "Unknown",
        craft: d.data().craft?.craftForm || "",
        region: d.data().craft?.region || "",
        portfolio: d.data().portfolio || [],
      }));
      list.sort(
        (a, b) =>
          a.craft.localeCompare(b.craft) || a.name.localeCompare(b.name),
      );
      setKarigarList(list);
    };
    load();
  }, [saved]);

  const handleSelect = (k: KarigarEntry) => {
    setSelected(k);
    setFiles([]);
    setPreviews([]);
    setUploadLog([]);
    setSaved(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: formData },
    );
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    if (!selected || files.length === 0) return;
    setUploading(true);
    setUploadLog([]);
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        setUploadLog((prev) => [
          ...prev,
          `⏳ Uploading image ${i + 1}/${files.length}...`,
        ]);
        const url = await uploadToCloudinary(files[i]);
        urls.push(url);
        setUploadLog((prev) => [...prev, `✅ Image ${i + 1} uploaded`]);
      } catch (err: any) {
        setUploadLog((prev) => [
          ...prev,
          `❌ Image ${i + 1} failed: ${err.message}`,
        ]);
      }
    }

    // Append to existing portfolio (don't overwrite)
    const newPortfolio = [...selected.portfolio, ...urls];

    try {
      await updateDoc(doc(db, "craftsmen", selected.id), {
        portfolio: newPortfolio,
      });
      setUploadLog((prev) => [
        ...prev,
        `✅ Saved ${urls.length} images to Firestore!`,
      ]);
      setSelected({ ...selected, portfolio: newPortfolio });
      setFiles([]);
      setPreviews([]);
      setSaved(true);
    } catch (err: any) {
      setUploadLog((prev) => [
        ...prev,
        `❌ Firestore save failed: ${err.message}`,
      ]);
    }

    setUploading(false);
  };

  const handleClearPortfolio = async () => {
    if (!selected) return;
    if (!window.confirm(`Clear ALL portfolio images for ${selected.name}?`))
      return;
    await updateDoc(doc(db, "craftsmen", selected.id), { portfolio: [] });
    setSelected({ ...selected, portfolio: [] });
    setSaved(true);
  };

  const filtered = karigarList.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.craft.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by craft
  const byCraft: Record<string, KarigarEntry[]> = {};
  filtered.forEach((k) => {
    if (!byCraft[k.craft]) byCraft[k.craft] = [];
    byCraft[k.craft].push(k);
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "sans-serif",
        fontSize: 14,
      }}
    >
      {/* ── LEFT: Craftsman list ── */}
      <div
        style={{
          width: 280,
          borderRight: "1px solid #e5e7eb",
          overflowY: "auto",
          background: "#fafaf9",
          padding: 16,
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: "bold" }}>
          🎨 Karigar Profiles
        </h2>
        <input
          placeholder="Search name or craft…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            marginBottom: 12,
            fontSize: 13,
            boxSizing: "border-box",
          }}
        />
        {Object.entries(byCraft).map(([craft, list]) => (
          <div key={craft} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: "bold",
                letterSpacing: 1.5,
                color: "#9ca3af",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {craft}
            </div>
            {list.map((k) => (
              <div
                key={k.id}
                onClick={() => handleSelect(k)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background:
                    selected?.id === k.id ? "#c9a22720" : "transparent",
                  border:
                    selected?.id === k.id
                      ? "1px solid #c9a227"
                      : "1px solid transparent",
                  marginBottom: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{k.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {k.region}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    background: k.portfolio.length > 0 ? "#d1fae5" : "#fee2e2",
                    color: k.portfolio.length > 0 ? "#065f46" : "#991b1b",
                    borderRadius: 20,
                    padding: "2px 8px",
                  }}
                >
                  {k.portfolio.length} imgs
                </div>
              </div>
            ))}
          </div>
        ))}
        {karigarList.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>
            No approved craftsmen found. Run the seeder first.
          </p>
        )}
      </div>

      {/* ── RIGHT: Upload panel ── */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {!selected ? (
          <div style={{ color: "#9ca3af", marginTop: 80, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👈</div>
            <p>Select a craftsman from the left to upload images</p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
                  {selected.name}
                </h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                  {selected.craft} · {selected.region} · Firestore ID:{" "}
                  <code style={{ fontSize: 11 }}>{selected.id}</code>
                </p>
              </div>
            </div>

            {/* Existing portfolio */}
            {selected.portfolio.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "#374151",
                    }}
                  >
                    CURRENT PORTFOLIO ({selected.portfolio.length} images)
                  </h3>
                  <button
                    onClick={handleClearPortfolio}
                    style={{
                      background: "transparent",
                      border: "1px solid #ef4444",
                      color: "#ef4444",
                      padding: "4px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Clear All
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selected.portfolio.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Portfolio ${i + 1}`}
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upload new */}
            <div
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: 8,
                padding: 24,
                textAlign: "center",
                marginBottom: 16,
                cursor: "pointer",
                background: "#f9fafb",
              }}
              onClick={() => fileRef.current?.click()}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              <p style={{ margin: 0, color: "#6b7280" }}>
                Click to add images (6–7 recommended)
              </p>
              <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: 12 }}>
                JPG, PNG, WEBP — first image becomes the profile card thumbnail
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {previews.map((src, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img
                      src={src}
                      alt=""
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "2px solid #c9a227",
                      }}
                    />
                    {i === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          background: "#c9a227",
                          color: "white",
                          fontSize: 9,
                          padding: "2px 5px",
                          borderRadius: 3,
                        }}
                      >
                        CARD THUMBNAIL
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(i)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={uploading || files.length === 0}
              style={{
                background: files.length === 0 ? "#d1d5db" : "#c9a227",
                color: "white",
                border: "none",
                padding: "12px 28px",
                fontSize: 15,
                cursor: files.length === 0 ? "not-allowed" : "pointer",
                borderRadius: 6,
                fontWeight: "bold",
              }}
            >
              {uploading
                ? "Uploading…"
                : `Upload & Save ${files.length} Image${files.length !== 1 ? "s" : ""} to Cloudinary`}
            </button>

            {uploadLog.length > 0 && (
              <div
                style={{
                  marginTop: 20,
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: 16,
                  fontSize: 13,
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {uploadLog.map((line, i) => (
                  <div key={i} style={{ marginBottom: 3 }}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import craftPottery from "@/assets/craft-pottery.jpg";
import craftPhad from "@/assets/craft-phad.jpg";
import craftGond from "@/assets/craft-gond.jpg";
import craftChanderi from "@/assets/craft-chanderi.jpg";
import craftBagh from "@/assets/craft-bagh.jpg";
import craftPichwai from "@/assets/pichwai.jpg";
import craftThikri from "@/assets/thikri.webp";
import craftMeenakari from "@/assets/meenakari.webp";
import craftThewa from "@/assets/thewa.jpg";
import craftGotaPatti from "@/assets/gota-patti.avif";
import craftMiniature from "@/assets/miniature-painting.webp";
import craftBandhani from "@/assets/bandhani.jpg";
import craftSanganeri from "@/assets/sanganeri.webp";
import craftDhokra from "@/assets/dhokra.jpg";
import craftMaheshwari from "@/assets/maheshwari-saree.webp";
import craftPitthora from "@/assets/pitthora.jpg";
import craftStoneCarving from "@/assets/stone-carving.jpg";
import craftTerracotta from "@/assets/terracota.jpg";
import craftTribalJewellery from "@/assets/tribal-jewellery.avif";
import craftBatik from "@/assets/batik.jpg";

const imageMap: Record<string, string> = {
  pottery: craftPottery,
  phad: craftPhad,
  gond: craftGond,
  chanderi: craftChanderi,
  bagh: craftBagh,
  thikri: craftThikri,
  thewa: craftThewa,
  meenakari: craftMeenakari,
  gotaPatti: craftGotaPatti,
  pichwai: craftPichwai,
  miniature: craftMiniature,
  bandhani: craftBandhani,
  sanganeri: craftSanganeri,
  dhokra: craftDhokra,
  maheshwari: craftMaheshwari,
  pitthora: craftPitthora,
  stonecarving: craftStoneCarving,
  teracotta: craftTerracotta,
  tribaljewellery: craftTribalJewellery,
  batik: craftBatik,
};

/**
 * Returns the image for a craftsman.
 * - If `key` is a full URL (Cloudinary or any http/https URL), return it directly.
 * - Otherwise, look it up in the local asset map.
 */
export const getCraftImage = (key: string): string => {
  if (key && (key.startsWith("http://") || key.startsWith("https://"))) {
    return key;
  }
  return imageMap[key] ?? craftPottery;
};
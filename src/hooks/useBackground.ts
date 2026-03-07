import { useDarkMode } from "@/hooks/useDarkMode";
import type React from "react";

export const useBackground = () => {
  const { isDark } = useDarkMode();
  return {
    isDark,
    creamBg: {
      backgroundImage: isDark ? "url('/dark-back2.png')" : "url('/cream.jpg')",
      backgroundRepeat: "repeat",
      backgroundSize: "600px auto",
      backgroundAttachment: "fixed",
    } as React.CSSProperties,
  };
};
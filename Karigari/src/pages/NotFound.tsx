import { useBackground } from "@/hooks/useBackground";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/languageContext";

const NotFound = () => {
  const { creamBg } = useBackground();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={creamBg}>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t.notFound.title}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t.notFound.message}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">{t.notFound.returnHome}</a>
      </div>
    </div>
  );
};

export default NotFound;
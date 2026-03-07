import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "@/components/effects/LoadingScreen";
import ClickSpark from "@/components/effects/ClickSpark";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import CraftsmanProfile from "@/pages/CraftsmanProfile";
import Archive from "@/pages/Archive";
import BookingPage from "@/pages/BookingPage";
import NotFound from "@/pages/NotFound";
import Region from "@/pages/Region";
import SignUp from "@/pages/SignUp";
import Join from "@/pages/Join";
import { LanguageProvider } from "@/contexts/languageContext";
import KarigarProfile from "@/pages/KarigarProfile";
import KarigarDashboard from "@/pages/KarigarDashboard";
import AdminKarigarRequests from "@/pages/AdminKarigarRequests";
import MyBookings from "@/pages/MyBookings";
import SeedCraftsmen from "./pages/SeedCraftsmen";
import AdminImageUploader from "./pages/AdminImageUploader";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
          {!loading && (
            <ClickSpark>
              <BrowserRouter>
                <ScrollToTop />
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/region/:region" element={<Region />} />
                  <Route path="/craftsman/:id" element={<CraftsmanProfile />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/book/:id" element={<BookingPage />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/karigar-profile" element={<KarigarProfile />} />
                  <Route
                    path="/karigar-dashboard"
                    element={<KarigarDashboard />}
                  />
                  <Route
                    path="/admin/karigar-requests"
                    element={<AdminKarigarRequests />}
                  />
                  <Route path="*" element={<NotFound />} />
                  <Route
                    path="/karigar-dashboard"
                    element={<KarigarDashboard />}
                  />
                  <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/admin-seed" element={<SeedCraftsmen />} />
                  <Route
                    path="/admin-images"
                    element={<AdminImageUploader />}
                  />
                </Routes>
                <Footer />
              </BrowserRouter>
            </ClickSpark>
          )}
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
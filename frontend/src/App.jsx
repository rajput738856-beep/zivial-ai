import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./pages/Landing/LandingPage";
import FarmInfrastructure from "./pages/Landing/FarmInfrastructure";
import AIProcessing from "./pages/Landing/AIProcessing";
import GeneratedSettings from "./pages/Landing/GeneratedSettings";
import FarmPreview from "./pages/Landing/FarmPreview";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "1rem"
          }
        }} 
      />
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/farm-infrastructure"
          element={<FarmInfrastructure />}
        />
        <Route path="/farm-preview" element={<FarmPreview />} />

        <Route path="/processing" element={<AIProcessing />} />

        <Route
          path="/generated-settings"
          element={<GeneratedSettings />}
        />



      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
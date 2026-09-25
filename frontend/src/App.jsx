import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/Landing/LandingPage"));
const FarmInfrastructure = lazy(() => import("./pages/Landing/FarmInfrastructure"));
const AIProcessing = lazy(() => import("./pages/Landing/AIProcessing"));
const GeneratedSettings = lazy(() => import("./pages/Landing/GeneratedSettings"));
const FarmPreview = lazy(() => import("./pages/Landing/FarmPreview"));

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
      <Suspense fallback={<div className="min-h-screen bg-[#030712] text-brand flex items-center justify-center">Loading...</div>}>
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
      </Suspense>
    </BrowserRouter>
    </ThemeProvider>
  );
}
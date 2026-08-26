import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ZivialLogo from "../common/ZivialLogo";
import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Features", href: "/#features" },
  { name: "Workflow", href: "/#solutions" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Scroll effect to adjust visual density
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGenerateRecipe = () => {
    navigate("/farm-infrastructure");
    setMobileOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out border-b
        ${scrolled 
          ? `${isDark ? "bg-[#030712]/95" : "bg-white/95"} backdrop-blur-2xl border-white/10 shadow-2xl py-3` 
          : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo - Professional & Clean */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          className="flex items-center"
        >
          <ZivialLogo className="h-8 md:h-9" />
        </motion.a>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index }}
              className={`relative text-sm font-semibold transition-all group py-1 ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              {item.name}
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        {/* Desktop Right: Theme Toggle + CTA */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* Dark / Light Mode Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer
              ${isDark 
                ? "bg-white/5 border border-white/10 text-yellow-400 hover:bg-white/10 hover:border-yellow-400/30" 
                : "bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200"
              }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* CTA Button */}
          <motion.button
            onClick={handleGenerateRecipe}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/10 transition-all hover:shadow-brand/35 cursor-pointer"
          >
            Generate Recipe
            <ArrowRight 
              size={16} 
              className="transition-transform duration-300 group-hover:translate-x-1" 
            />
          </motion.button>
        </div>

        {/* Mobile: Theme toggle + Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer
              ${isDark 
                ? "bg-white/5 border border-white/10 text-yellow-400" 
                : "bg-zinc-100 border border-zinc-200 text-zinc-700"
              }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span key="sun-mob" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.15 }}>
                  <Sun size={16} />
                </motion.span>
              ) : (
                <motion.span key="moon-mob" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.15 }}>
                  <Moon size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? "text-white hover:bg-white/5" : "text-zinc-800 hover:bg-zinc-100"}`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphism Overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border p-6 shadow-2xl lg:hidden
              ${isDark 
                ? "border-white/10 bg-[#030712]/95 backdrop-blur-2xl" 
                : "border-zinc-200 bg-white/95 backdrop-blur-2xl"
              }`}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold transition-all
                    ${isDark 
                      ? "text-zinc-400 hover:bg-white/5 hover:text-white" 
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                >
                  {item.name}
                </a>
              ))}

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleGenerateRecipe}
                  className="w-full rounded-xl bg-gradient-to-r from-brand to-brand-dark py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 transition-all cursor-pointer"
                >
                  Generate Recipe
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
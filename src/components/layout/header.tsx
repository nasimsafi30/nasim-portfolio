"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggleEnhanced } from "@/components/ui/theme-toggle-enhanced";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Education", href: "/#education" },
  { name: "Experience", href: "/#experience" },
  { name: "Skills", href: "/#skills" },
  { name: "Certifications", href: "/#certifications" },
  { name: "Projects", href: "/#projects" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    if (href === "/") {
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href === "/blog") {
      router.push("/blog");
      return;
    }

    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");

      if (pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push("/");
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick("/")}
              className="flex items-center space-x-2 group"
              aria-label="Go to homepage"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="text-2xl md:text-3xl font-bold">
                  {/* FIXED: Changed bg-gradient-to-r to bg-linear-to-r */}
                  <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    MNS
                  </span>
                </div>
              </motion.div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <ThemeToggleEnhanced />

              {/* Admin Link - Goes to Login */}
              <button
                onClick={() => router.push("/login")}
                className="hidden md:inline-flex items-center justify-center h-9 px-3 rounded-md text-xs font-medium glass glass-hover text-foreground border border-white/10"
                aria-label="Go to admin login"
              >
                Admin
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-white/5 transition-colors"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] glass border-l border-white/10 p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Navigation
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-white/5 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile navigation">
                <div className="space-y-1">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                      >
                        {item.name}
                      </button>
                    </motion.div>
                  ))}

                  <div className="my-4 border-t border-white/10" />

                  {/* Mobile Admin Link - Goes to Login */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.length * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/login");
                      }}
                      className="w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
                      aria-label="Go to admin login"
                    >
                      Admin Panel
                    </button>
                  </motion.div>
                </div>
              </nav>

              <div className="absolute bottom-8 left-6 right-6">
                <p className="text-center text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Mohammad Nasim Safi
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
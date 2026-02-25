"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

function PublicNavbar({ transparent = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Research", href: "/research" },
    { label: "About", href: "/about" },
  ];

  const isTransparent = transparent && !scrolled;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent py-6"
          : "bg-white/95 backdrop-blur-md shadow-md py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo
            className={
              isTransparent
                ? "brightness-0 invert transition-all duration-300"
                : ""
            }
          />
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.button
                  key={link.label}
                  onClick={() => router.push(link.href)}
                  className={`text-sm font-medium transition-colors ${
                    isTransparent
                      ? "text-white hover:text-primary-300"
                      : isActive
                        ? "text-primary-500"
                        : "text-gray-700 hover:text-primary-500"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isTransparent ? "ghost" : "default"}
              size="sm"
              className={
                isTransparent
                  ? "text-white hover:text-white hover:bg-white/10"
                  : ""
              }
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default PublicNavbar;

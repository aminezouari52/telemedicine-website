"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Facebook, Instagram, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerEmailInputValidations } from "@/utils/formValidations";

function Footer() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { email } = data;
    // TODO: Implement the email service
    console.info(email);
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    {
      icon: Github,
      href: "https://github.com/aminezouari52/telemedecine-app/",
      label: "GitHub",
    },
    { icon: Instagram, href: "#", label: "Instagram" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/amine-zouari52/",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-primary-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Image
              src="/assets/logo-dark.png"
              alt="logo"
              width={180}
              height={60}
              className="h-auto object-cover brightness-0 invert"
            />
            <p className="text-white/80 text-sm leading-relaxed">
              Discover our telemedicine platform, a modern and practical
              solution for accessing online medical consultations.
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-white/80 text-sm">
              Subscribe to our newsletter and receive the latest information on
              innovations in telemedicine, health tips, and much more.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                type="email"
                placeholder="E-Mail address"
                {...register("email", footerEmailInputValidations)}
              />
              {errors?.email && (
                <p className="text-sm text-red-300">{errors.email.message}</p>
              )}
              <Button
                type="submit"
                variant="outline"
                className="bg-primary-500 w-full border-white/20 text-white hover:bg-primary-600 hover:text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Start with</h3>
            <div className="flex flex-col gap-2">
              <motion.button
                className="text-sm font-medium text-white/80 hover:text-white transition-colors text-left"
                onClick={() => router.push("/auth/register")}
                whileHover={{ x: 5 }}
              >
                Register
              </motion.button>
              <motion.button
                className="text-sm font-medium text-white/80 hover:text-white transition-colors text-left"
                onClick={() => router.push("/auth/login")}
                whileHover={{ x: 5 }}
              >
                Login
              </motion.button>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <div className="text-sm text-white/80 space-y-2">
              <p>Tunisia, Sousse 5054</p>
              <p>Ahmed bouselem street</p>
              <p>Amine Zouari building, 1st floor</p>
              <p className="pt-2">
                <a
                  href="tel:+21621316325"
                  className="hover:text-white transition-colors"
                >
                  +216 21 316 325
                </a>
              </p>
              <p>
                <a
                  href="mailto:zouariamine52@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  zouariamine52@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            Copyright 2025 © télémedecine.inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                const isExternal =
                  social.href.startsWith("http") ||
                  social.href.startsWith("https");
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

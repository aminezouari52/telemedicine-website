"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Microscope,
  Activity,
  Heart,
  Brain,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/home/ScrollToTop";
import FadeInOnScroll from "@/components/home/FadeInOnScroll";

const services = [
  {
    icon: Stethoscope,
    title: "Primary Care",
    description:
      "Comprehensive primary healthcare services delivered virtually with personalized attention to your needs. Get routine check-ups, preventive care, and treatment for common illnesses.",
  },
  {
    icon: Microscope,
    title: "Diagnostics",
    description:
      "Advanced diagnostic capabilities and test result analysis to help you understand your health better. Access lab results, imaging reports, and expert interpretations.",
  },
  {
    icon: Activity,
    title: "Advanced Diagnostics",
    description:
      "Cutting-edge diagnostic tools and continuous health monitoring for proactive care management. Track your health metrics and receive personalized insights.",
  },
  {
    icon: Heart,
    title: "Cardiology",
    description:
      "Specialized cardiac care with remote monitoring capabilities. Manage heart conditions, review ECG results, and consult with cardiologists from home.",
  },
  {
    icon: Brain,
    title: "Mental Health",
    description:
      "Professional mental health support through secure video consultations. Access therapy, counseling, and psychiatric services with licensed professionals.",
  },
  {
    icon: Shield,
    title: "Preventive Care",
    description:
      "Proactive health management through regular screenings, vaccinations, and health education. Stay ahead of potential health issues with preventive strategies.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_-10%,rgba(97,94,252,0.28),transparent_70%)]"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-white via-[#dfdffe] to-[#9896fd] bg-clip-text text-transparent">
                Our Services
              </h1>
              <p className="text-xl md:text-2xl text-white/70">
                Comprehensive healthcare solutions designed to meet your needs,
                delivered with care and expertise.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <FadeInOnScroll key={index} direction="up" delay={index * 0.1}>
                  <motion.div whileHover={{ y: -8 }} className="h-full">
                    <Card className="h-full border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)] hover:border-primary-400/40 hover:shadow-primary-500/10 transition-all duration-300">
                      <CardHeader>
                        <div className="inline-flex p-3 rounded-lg bg-primary-500/15 text-primary-300 mb-4">
                          <Icon className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-white/60 text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

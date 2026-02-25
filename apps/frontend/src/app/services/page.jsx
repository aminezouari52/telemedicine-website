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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Our Services
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
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
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-500 mb-4">
                          <Icon className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600 text-base leading-relaxed">
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

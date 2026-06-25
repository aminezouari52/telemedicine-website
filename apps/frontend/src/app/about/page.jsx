"use client";

import { Heart, Target, Users, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/home/ScrollToTop";
import FadeInOnScroll from "@/components/home/FadeInOnScroll";

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description:
      "Every decision we make prioritizes the well-being and satisfaction of our patients.",
  },
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive for excellence in every aspect of healthcare delivery and service.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description:
      "Making quality healthcare accessible to everyone, regardless of location or circumstance.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Your privacy and data security are paramount in everything we do.",
  },
];

export default function AboutPage() {
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
                About Us
              </h1>
              <p className="text-xl md:text-2xl text-white/70">
                Transforming healthcare delivery through innovation, technology,
                and compassionate care.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInOnScroll direction="right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-white/70 mb-4 leading-relaxed">
                  We are dedicated to revolutionizing healthcare by making
                  quality medical services accessible, convenient, and
                  affordable for everyone. Through cutting-edge telemedicine
                  technology, we connect patients with experienced healthcare
                  professionals, breaking down barriers of distance and time.
                </p>
                <p className="text-lg text-white/70 leading-relaxed">
                  Our platform empowers individuals to take control of their
                  health, providing comprehensive care that fits seamlessly into
                  their lives while maintaining the highest standards of medical
                  excellence.
                </p>
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll direction="left">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)]">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Why Choose Us?
                </h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-300 font-bold">✓</span>
                    <span>24/7 access to healthcare professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-300 font-bold">✓</span>
                    <span>Secure and HIPAA-compliant platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-300 font-bold">✓</span>
                    <span>Comprehensive range of medical specialties</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-300 font-bold">✓</span>
                    <span>Affordable and transparent pricing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-300 font-bold">✓</span>
                    <span>Easy-to-use interface</span>
                  </li>
                </ul>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
          </FadeInOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeInOnScroll key={index} direction="up" delay={index * 0.1}>
                  <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)] hover:border-primary-400/40 hover:shadow-primary-500/10 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="inline-flex p-3 rounded-lg bg-primary-500/15 text-primary-300 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60">{value.description}</p>
                    </CardContent>
                  </Card>
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

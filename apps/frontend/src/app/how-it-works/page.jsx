"use client";

import { Check, UserPlus, Calendar, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import FadeInOnScroll from "@/components/home/FadeInOnScroll";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/home/ScrollToTop";

const steps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    description:
      "Sign up in minutes with your email address. Verify your account and complete your profile to get started.",
    img: "/assets/illustration-profile.svg",
  },
  {
    icon: Calendar,
    title: "Book a Consultation",
    description:
      "Browse available doctors, select a time slot that works for you, and book your appointment instantly.",
    img: "/assets/illustration-date.svg",
  },
  {
    icon: Video,
    title: "Join a Consultation",
    description:
      "Connect with your doctor via secure video call. Get expert medical advice from the comfort of your home.",
    img: "/assets/illustration-chat.svg",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                How It Works
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Get started with telemedicine in three simple steps. Quality
                healthcare made accessible and convenient.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-16">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white font-bold text-lg">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-24 md:w-32 h-0.5 bg-primary-500 mx-2 md:mx-4" />
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <FadeInOnScroll key={index} direction="up" delay={index * 0.2}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-6">
                        <div className="inline-flex p-4 rounded-full bg-primary-50 text-primary-500">
                          <Icon className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="flex justify-center mb-6">
                        <img
                          src={step.img}
                          alt={step.title}
                          className="w-[200px] h-[200px] object-contain"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Telemedicine?
            </h2>
          </FadeInOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "24/7 Access",
              "No Travel Required",
              "Secure & Private",
              "Affordable Care",
            ].map((benefit, index) => (
              <FadeInOnScroll key={index} direction="up" delay={index * 0.1}>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors">
                  <Check className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{benefit}</span>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

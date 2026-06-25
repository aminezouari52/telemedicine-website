"use client";

import { FileText, TrendingUp, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/home/ScrollToTop";
import FadeInOnScroll from "@/components/home/FadeInOnScroll";
import ChartAnimation from "@/components/home/ChartAnimation";
import AnimatedCounter from "@/components/home/AnimatedCounter";

const researchAreas = [
  {
    icon: FileText,
    title: "Telemedicine Effectiveness",
    description:
      "Studies on patient outcomes and satisfaction rates in virtual healthcare settings.",
  },
  {
    icon: TrendingUp,
    title: "Health Data Analytics",
    description:
      "Advanced analytics to improve treatment protocols and patient care pathways.",
  },
  {
    icon: Users,
    title: "Patient Engagement",
    description:
      "Research on improving patient participation and adherence to treatment plans.",
  },
  {
    icon: Award,
    title: "Clinical Trials",
    description:
      "Participation in cutting-edge clinical trials and medical research initiatives.",
  },
];

export default function ResearchPage() {
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
                Research & Innovation
              </h1>
              <p className="text-xl md:text-2xl text-white/70">
                Advancing healthcare through research, data-driven insights, and
                continuous innovation.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FadeInOnScroll direction="up">
              <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)] text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary-300 mb-2">
                    <AnimatedCounter value={99.9} decimals={1} suffix="%" />
                  </div>
                  <p className="text-white/60">Patient Satisfaction</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
            <FadeInOnScroll direction="up" delay={0.2}>
              <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)] text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary-300 mb-2">
                    <AnimatedCounter value={35} decimals={0} suffix="%" />
                  </div>
                  <p className="text-white/60">Reduction in Readmissions</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
            <FadeInOnScroll direction="up" delay={0.4}>
              <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)] text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary-300 mb-2">
                    <AnimatedCounter value={50} decimals={0} suffix="+" />
                  </div>
                  <p className="text-white/60">Research Publications</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          </div>

          {/* Chart */}
          <FadeInOnScroll direction="up" delay={0.6}>
            <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Patient Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <ChartAnimation
                    data={[
                      { x: 0, y: 35 },
                      { x: 25, y: 40 },
                      { x: 50, y: 45 },
                      { x: 75, y: 50 },
                      { x: 100, y: 60 },
                    ]}
                    width={400}
                    height={200}
                    className="max-w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Research Areas
            </h2>
          </FadeInOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <FadeInOnScroll key={index} direction="up" delay={index * 0.1}>
                  <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(97,94,252,0.3)] hover:border-primary-400/40 hover:shadow-primary-500/10 transition-all duration-300">
                    <CardHeader>
                      <div className="inline-flex p-3 rounded-lg bg-primary-500/15 text-primary-300 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-bold text-white">
                        {area.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60 text-sm">
                        {area.description}
                      </p>
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

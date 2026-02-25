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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Research & Innovation
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
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
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary-500 mb-2">
                    <AnimatedCounter value={99.9} decimals={1} suffix="%" />
                  </div>
                  <p className="text-gray-600">Patient Satisfaction</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
            <FadeInOnScroll direction="up" delay={0.2}>
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary-500 mb-2">
                    <AnimatedCounter value={35} decimals={0} suffix="%" />
                  </div>
                  <p className="text-gray-600">Reduction in Readmissions</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
            <FadeInOnScroll direction="up" delay={0.4}>
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary-500 mb-2">
                    <AnimatedCounter value={50} decimals={0} suffix="+" />
                  </div>
                  <p className="text-gray-600">Research Publications</p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          </div>

          {/* Chart */}
          <FadeInOnScroll direction="up" delay={0.6}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Patient Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <ChartAnimation
                    data={[
                      { x: 0, y: 60 },
                      { x: 25, y: 50 },
                      { x: 50, y: 45 },
                      { x: 75, y: 40 },
                      { x: 100, y: 35 },
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
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll direction="up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Research Areas
            </h2>
          </FadeInOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <FadeInOnScroll key={index} direction="up" delay={index * 0.1}>
                  <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-500 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-bold">
                        {area.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">
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

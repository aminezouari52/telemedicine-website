"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import FadeInOnScroll from "./FadeInOnScroll";
import BlurText from "@/components/ui/BlurText";
import { useRouter } from "next/navigation";

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Helene Rose",
      date: "2 days ago",
      rating: 5,
      comment:
        "Exceptional service! The doctors are knowledgeable and the platform is easy to use. Highly recommend!",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Sarah Johnson",
      date: "1 week ago",
      rating: 5,
      comment:
        "The convenience of virtual consultations has been a game-changer for my busy schedule. Professional and efficient.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
  ];

  const router = useRouter();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInOnScroll direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <BlurText
              text="Care that puts you first."
              delay={60}
              direction="top"
              className="justify-center"
              animateBy="words"
            />
          </h2>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image with Badge */}
          <FadeInOnScroll direction="right">
            <div className="relative">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=800&fit=crop&crop=face"
                  alt="Happy patient"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Satisfaction Badge Overlay */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="absolute top-8 right-8"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="bg-gray-800/80 backdrop-blur-sm rounded-full p-6 shadow-xl border border-gray-700"
                  >
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary-400">
                        98%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        satisfaction rate
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Testimonials */}
          <div className="space-y-6 flex flex-col h-full">
            {testimonials.map((testimonial, index) => (
              <FadeInOnScroll key={index} direction="left" delay={index * 0.2}>
                <Card className="border border-gray-800 shadow-lg hover:shadow-primary-500/5 transition-all duration-300 bg-gray-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: 0.8 + index * 0.2 + i * 0.1,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ),
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-gray-300 text-base leading-relaxed">
                        "{testimonial.comment}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={testimonial.avatar}
                              alt={testimonial.name}
                            />
                            <AvatarFallback>
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-white">
                              {testimonial.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {testimonial.date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <FadeInOnScroll direction="up" delay={0.6} className="mt-16">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white border border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Ready to prioritize your health?
                </h3>
                <p className="text-gray-400">
                  Join thousands of satisfied patients today.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="bg-primary-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-600 transition-colors"
                  onClick={() => {
                    router.push("/auth/register");
                  }}
                >
                  Get Started
                </button>
              </motion.div>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

export default TestimonialsSection;

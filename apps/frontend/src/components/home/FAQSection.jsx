"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FadeInOnScroll from "./FadeInOnScroll";
import BlurText from "@/components/ui/BlurText";

function FAQSection() {
  const faqs = [
    {
      question: "How do I sign up?",
      answer:
        "Signing up is easy! Click on the 'Register' button in the top navigation, fill in your details, and verify your email. You'll be able to book consultations within minutes.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Our consultation fees vary depending on the type of service and specialist. Basic consultations start at affordable rates, and we offer various payment plans. Check our pricing page for detailed information.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and comply with all healthcare data protection regulations. Your privacy and security are our top priorities.",
    },
    {
      question: "Can I get prescriptions through telemedicine?",
      answer:
        "Yes, qualified doctors can provide prescriptions for appropriate conditions during virtual consultations. Prescriptions are sent electronically to your preferred pharmacy.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <BlurText
              text="Frequently Asked Questions"
              delay={60}
              direction="top"
              className="justify-center"
              animateBy="words"
            />
          </h2>
          <p className="text-gray-400">
            Everything you need to know about our telemedicine platform
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll direction="up" delay={0.2}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-800 rounded-lg px-4 hover:border-primary-500/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-white hover:text-primary-400 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeInOnScroll>
      </div>
    </section>
  );
}

export default FAQSection;

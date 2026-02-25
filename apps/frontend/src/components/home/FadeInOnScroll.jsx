"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

function FadeInOnScroll({
  children,
  delay = 0,
  direction = "up",
  className = "",
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionVariants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
  };

  const variants = {
    hidden: directionVariants[direction],
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default FadeInOnScroll;

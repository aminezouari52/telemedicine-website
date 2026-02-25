"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

function ChartAnimation({ data, width = 400, height = 200, className = "" }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const isInView = useInView(svgRef, { once: true, margin: "-50px" });

  // Simple line chart data points
  const points = data || [
    { x: 0, y: 60 },
    { x: 25, y: 50 },
    { x: 50, y: 45 },
    { x: 75, y: 40 },
    { x: 100, y: 35 },
  ];

  const pathData = points
    .map((point, index) => {
      const x = (point.x / 100) * width;
      const y = height - (point.y / 100) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className={`w-full ${className}`}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible max-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#615EFC" stopOpacity="1" />
            <stop offset="100%" stopColor="#9896fd" stopOpacity="1" />
          </linearGradient>
        </defs>
        <motion.path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {points.map((point, index) => {
          const x = (point.x / 100) * width;
          const y = height - (point.y / 100) * height;
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#615EFC"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
              }
              transition={{
                delay: 1.5 + index * 0.1,
                duration: 0.3,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default ChartAnimation;

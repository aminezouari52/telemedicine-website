"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { STORY_BG } from "./config";
import { Atmosphere } from "./three/Atmosphere";
import { CameraRig } from "./three/CameraRig";
import { ParticleField } from "./three/ParticleField";
import { PatientNetwork } from "./three/PatientNetwork";
import { NeuralNetwork } from "./three/NeuralNetwork";
import { MonitoringRings } from "./three/MonitoringRings";
import { Globe } from "./three/Globe";
import { ReviewsConstellation } from "./three/ReviewsConstellation";
import { KnowledgeOrbits } from "./three/KnowledgeOrbits";

/**
 * The single fixed WebGL canvas behind the whole story. Every chapter module
 * reads the shared `progress` ref inside its own `useFrame`, so the scene is
 * fully scroll-driven with zero React re-renders during scrolling.
 *
 * Performance budget:
 *  - `dpr` is capped and lowered automatically by `PerformanceMonitor` /
 *    `AdaptiveDpr` when frames drop, protecting the 60fps target on weaker GPUs.
 *  - `AdaptiveEvents` pauses raycasting during fast scroll.
 *  - Geometry/material allocation happens once in `useMemo`; the loop only
 *    mutates matrices and attribute buffers.
 */
export function Scene({ progress, tail, reducedMotion }) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      className="!absolute !inset-0"
      dpr={dpr}
      frameloop="always"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 400 }}
    >
      <color attach="background" args={[STORY_BG]} />
      <fogExp2 attach="fog" args={[STORY_BG, 0.011]} />

      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
      >
        <Suspense fallback={null}>
          <CameraRig progress={progress} reducedMotion={reducedMotion} />
          <Atmosphere progress={progress} reducedMotion={reducedMotion} />

          <ParticleField progress={progress} reducedMotion={reducedMotion} />
          <PatientNetwork progress={progress} reducedMotion={reducedMotion} />
          <NeuralNetwork progress={progress} reducedMotion={reducedMotion} />
          <MonitoringRings progress={progress} reducedMotion={reducedMotion} />
          <Globe progress={progress} reducedMotion={reducedMotion} />

          {/* Marketing-tail scenes — driven by their own section scroll
              (`tail`) rather than the story `progress`, which is pinned at 1
              once the corridor ends. */}
          <ReviewsConstellation tail={tail} reducedMotion={reducedMotion} />
          <KnowledgeOrbits tail={tail} reducedMotion={reducedMotion} />

          <Preload all />
        </Suspense>
      </PerformanceMonitor>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}

export default Scene;

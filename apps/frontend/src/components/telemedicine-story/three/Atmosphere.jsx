"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { PALETTE } from "../config";

/**
 * Environmental lighting + volumetric backdrop shared by every chapter.
 * A cool key light, two travelling accent point-lights (indigo + cyan) and a
 * deep starfield give the corridor depth and atmosphere without any external
 * HDR assets (so nothing blocks first paint).
 */
export function Atmosphere({ progress, reducedMotion }) {
  const indigo = useRef(null);
  const cyan = useRef(null);

  useFrame((state) => {
    // Accent lights ride along the corridor with the scroll, so whichever
    // chapter you're in is the one that's warmly lit.
    const z = -progress.current * 112;
    if (indigo.current) {
      indigo.current.position.z = z + 6;
      indigo.current.intensity = reducedMotion
        ? 26
        : 26 + Math.sin(state.clock.elapsedTime * 1.4) * 6;
    }
    if (cyan.current) {
      cyan.current.position.z = z - 10;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.55} color={PALETTE.ice} />
      <hemisphereLight args={[PALETTE.cyanLight, PALETTE.indigoDeep, 0.4]} />
      <directionalLight
        position={[6, 10, 8]}
        intensity={0.7}
        color={PALETTE.ice}
      />
      <pointLight
        ref={indigo}
        position={[4, 3, 6]}
        intensity={26}
        distance={42}
        decay={2}
        color={PALETTE.indigo}
      />
      <pointLight
        ref={cyan}
        position={[-5, -2, -4]}
        intensity={22}
        distance={46}
        decay={2}
        color={PALETTE.cyan}
      />
      <Stars
        radius={140}
        depth={80}
        count={reducedMotion ? 1200 : 2600}
        factor={4}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.4}
      />
    </group>
  );
}

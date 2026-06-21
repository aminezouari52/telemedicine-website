"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { DoubleSide } from "three";
import { PALETTE, SECTION_CENTERS } from "../config";
import { clamp, smoothstep } from "../lib/math";

const CENTER = SECTION_CENTERS.consultation;

const PANELS = [
  {
    position: [0, 0.4, 0],
    rotation: [0, 0.05, 0],
    size: [4.4, 2.8],
    accent: PALETTE.cyan,
    bars: 7,
    delay: 0,
  },
  {
    position: [-3.6, 1.4, 2.4],
    rotation: [0, 0.5, 0.02],
    size: [2.4, 1.5],
    accent: PALETTE.indigoLight,
    bars: 4,
    delay: 0.12,
  },
  {
    position: [3.7, 1.1, 2.0],
    rotation: [0, -0.5, -0.02],
    size: [2.5, 1.7],
    accent: PALETTE.cyanLight,
    bars: 5,
    delay: 0.2,
  },
  {
    position: [-2.9, -1.6, 3.0],
    rotation: [0.04, 0.42, 0],
    size: [2.2, 1.3],
    accent: PALETTE.teal,
    bars: 6,
    delay: 0.3,
  },
  {
    position: [3.0, -1.5, 2.8],
    rotation: [0.04, -0.4, 0],
    size: [2.3, 1.35],
    accent: PALETTE.indigo,
    bars: 5,
    delay: 0.38,
  },
];

/** A single glassmorphic consultation surface with animated diagnostic bars. */
function Panel({ def, progress, reducedMotion }) {
  const root = useRef(null);
  const bars = useRef([]);
  const [w, h] = def.size;

  const barXs = useMemo(
    () =>
      Array.from({ length: def.bars }, (_, i) => {
        const pad = 0.32;
        const inner = w - pad * 2;
        return -inner / 2 + (inner / (def.bars - 1)) * i;
      }),
    [def.bars, w],
  );

  useFrame((state) => {
    const group = root.current;
    if (!group) return;

    const p = progress.current;
    // Chapter band ≈ [2/7, 3/7]; stagger each panel within it.
    const local = smoothstep(0.27 + def.delay * 0.05, 0.4, p);
    const out = 1 - smoothstep(0.43, 0.5, p);
    const reveal = clamp(local * out, 0, 1);

    group.visible = reveal > 0.002;
    if (!group.visible) return;

    group.scale.setScalar(0.9 + reveal * 0.1);
    group.traverse((child) => {
      const mat = child.material;
      if (mat && typeof mat.opacity === "number") {
        // Preserve each material's relative alpha via its userData baseline.
        const base = child.userData.baseOpacity ?? 1;
        mat.opacity = base * reveal;
      }
    });

    // Diagnostic bars react to scroll + time (the "data visualisation").
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      const wave = reducedMotion
        ? 0.5 + (i / def.bars) * 0.4
        : 0.35 + (Math.sin(t * 2 + i * 0.9) * 0.5 + 0.5) * 0.6;
      const scale = 0.15 + wave * (h * 0.55) * (0.4 + p * 0.6);
      bar.scale.y = scale;
      bar.position.y = -h / 2 + 0.34 + scale / 2;
    });
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.1}
      rotationIntensity={reducedMotion ? 0 : 0.25}
      floatIntensity={reducedMotion ? 0 : 0.5}
    >
      <group ref={root} position={def.position} rotation={def.rotation}>
        {/* Outer glow rim. */}
        <mesh userData={{ baseOpacity: 0.18 }}>
          <planeGeometry args={[w + 0.18, h + 0.18]} />
          <meshBasicMaterial
            color={def.accent}
            transparent
            opacity={0.18}
            side={DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
        {/* Glass body. */}
        <mesh position={[0, 0, 0.01]} userData={{ baseOpacity: 0.4 }}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            color="#0a1330"
            transparent
            opacity={0.4}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Title bar accent. */}
        <mesh
          position={[0, h / 2 - 0.28, 0.02]}
          userData={{ baseOpacity: 0.9 }}
        >
          <planeGeometry args={[w - 0.5, 0.12]} />
          <meshBasicMaterial
            color={def.accent}
            transparent
            opacity={0.9}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
        {/* Avatar / status dot. */}
        <mesh
          position={[-w / 2 + 0.45, h / 2 - 0.28, 0.03]}
          userData={{ baseOpacity: 1 }}
        >
          <circleGeometry args={[0.16, 24]} />
          <meshBasicMaterial
            color={PALETTE.ice}
            transparent
            toneMapped={false}
          />
        </mesh>
        {/* Diagnostic bars. */}
        {barXs.map((x, i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) bars.current[i] = el;
            }}
            position={[x, -h / 2 + 0.4, 0.03]}
            userData={{ baseOpacity: 0.95 }}
          >
            <planeGeometry args={[(w - 0.7) / def.bars / 1.6, 1]} />
            <meshBasicMaterial
              color={def.accent}
              transparent
              opacity={0.95}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/**
 * Chapter 3 — "Face-to-face care, from anywhere." Holographic consultation
 * surfaces (doctor card, video feed, vitals, diagnostics) bloom into view and
 * their charts pulse as you scroll.
 */
export function ConsultationPanels({ progress, reducedMotion }) {
  return (
    <group position={CENTER}>
      {PANELS.map((def, i) => (
        <Panel
          key={i}
          def={def}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

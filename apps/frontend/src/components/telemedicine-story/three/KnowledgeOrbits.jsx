"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import { PALETTE } from "../config";
import { damp, smoothstep } from "../lib/math";

// A touch deeper than the reviews constellation so the two tail scenes read as
// distinct depths during their brief crossover. Centred in the parked camera's
// view, so it animates in place as the FAQ scrolls past.
const CENTER = [0, -1, -121];

const RINGS = [
  { radius: 3.4, tilt: [1.2, 0.2, 0], color: PALETTE.glow, speed: 0.5 },
  {
    radius: 4.8,
    tilt: [0.5, 0.9, 0.2],
    color: PALETTE.indigoLight,
    speed: -0.38,
  },
  {
    radius: 6.2,
    tilt: [1.5, -0.4, 0.3],
    color: PALETTE.secondary,
    speed: 0.28,
  },
];

/** One tilted orbital ring with a glowing node travelling around it. */
function Ring({ def, reveal, reducedMotion }) {
  const grp = useRef(null);
  const ring = useRef(null);
  const node = useRef(null);

  useFrame((state) => {
    const g = grp.current;
    if (!g || !ring.current || !node.current) return;
    const r = reveal.current;
    g.visible = r > 0.002;
    if (!g.visible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    g.scale.setScalar(0.7 + r * 0.3);
    ring.current.material.opacity = r * 0.5;

    const a = t * def.speed;
    node.current.position.set(
      Math.cos(a) * def.radius,
      Math.sin(a) * def.radius,
      0,
    );
    const pulse = 1 + Math.sin(t * 3) * 0.2;
    node.current.scale.setScalar(0.16 * pulse * r + 0.02);
  });

  return (
    <group ref={grp} rotation={def.tilt}>
      <mesh ref={ring}>
        <torusGeometry args={[def.radius, 0.02, 8, 120]} />
        <meshBasicMaterial
          color={def.color}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh ref={node}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={def.color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Marketing tail — "Frequently Asked Questions." A calm knowledge core orbited
 * by tilted rings, each carrying a travelling node, like answers circulating a
 * question. Driven by the FAQ section's own scroll progress (`tail.faq`); it
 * assembles while the accordion is on screen and recedes as it leaves.
 */
export function KnowledgeOrbits({ tail, reducedMotion }) {
  const group = useRef(null);
  const core = useRef(null);
  const halo = useRef(null);
  const reveal = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !core.current) return;

    const dt = Math.min(delta, 1 / 30);
    const p = tail?.current?.faq ?? 0;
    const target = smoothstep(0.08, 0.32, p) * (1 - smoothstep(0.7, 0.95, p));
    reveal.current = damp(reveal.current, target, 3, dt);
    const r = reveal.current;

    g.visible = r > 0.002;
    if (!g.visible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    g.rotation.y = reducedMotion ? 0 : t * 0.08;

    const pulse = 1 + Math.sin(t * 2) * 0.12;
    core.current.scale.setScalar((0.5 + r * 0.5) * pulse);
    core.current.material.emissiveIntensity = 1.5 + r * 2;
    if (halo.current) {
      halo.current.scale.setScalar((0.5 + r * 0.5) * pulse);
      halo.current.material.opacity = r * 0.18;
    }
  });

  return (
    <group ref={group} position={CENTER}>
      {/* Glowing knowledge core. */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#0a1330"
          emissive={PALETTE.glowLight}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Soft halo. */}
      <mesh ref={halo}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshBasicMaterial
          color={PALETTE.glow}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {RINGS.map((def, i) => (
        <Ring key={i} def={def} reveal={reveal} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

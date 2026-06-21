"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { AdditiveBlending } from "three";
import { PALETTE, SECTION_CENTERS } from "../config";
import { clamp, smoothstep } from "../lib/math";

const CENTER = SECTION_CENTERS.monitoring;
const ARC_SEGMENTS = 96;
const START_ANGLE = Math.PI / 2; // start at top, sweep clockwise

const GAUGES = [
  { x: -5.2, radius: 1.5, fill: 0.72, color: PALETTE.cyan, delay: 0 },
  { x: -1.75, radius: 1.5, fill: 0.98, color: PALETTE.cyanLight, delay: 0.08 },
  { x: 1.75, radius: 1.5, fill: 0.84, color: PALETTE.indigoLight, delay: 0.16 },
  { x: 5.2, radius: 1.5, fill: 0.77, color: PALETTE.teal, delay: 0.24 },
];

/** A radial health gauge: faint track + a glowing arc that fills with scroll. */
function Gauge({ def, progress, reducedMotion }) {
  const root = useRef(null);
  const arc = useRef(null);
  const head = useRef(null);

  // Pre-build the full circle as consecutive line segments (vertex pairs)
  // starting at the top. Using lineSegments avoids React's SVG `<line>` clash
  // and lets us reveal the arc by growing the geometry draw range.
  const arcPositions = useMemo(() => {
    const pointAt = (i) => {
      const a = START_ANGLE - (i / ARC_SEGMENTS) * Math.PI * 2;
      return [Math.cos(a) * def.radius, Math.sin(a) * def.radius, 0];
    };
    const arr = new Float32Array(ARC_SEGMENTS * 2 * 3);
    for (let i = 0; i < ARC_SEGMENTS; i++) {
      arr.set(pointAt(i), i * 6);
      arr.set(pointAt(i + 1), i * 6 + 3);
    }
    return arr;
  }, [def.radius]);

  useFrame((state) => {
    const group = root.current;
    if (!group || !arc.current || !head.current) return;

    const p = progress.current;
    const enter = smoothstep(0.58 + def.delay * 0.05, 0.7, p);
    const exit = 1 - smoothstep(0.78, 0.84, p);
    const reveal = clamp(enter * exit, 0, 1);

    group.visible = reveal > 0.002;
    if (!group.visible) return;

    const build = smoothstep(0.6 + def.delay * 0.04, 0.78, p);
    const fill = def.fill * build;
    // Two vertices per revealed segment.
    const drawCount = Math.max(2, Math.floor(fill * ARC_SEGMENTS) * 2);
    arc.current.geometry.setDrawRange(0, drawCount);
    arc.current.material.opacity = reveal;

    // Glowing head at the arc tip.
    const angle = START_ANGLE - fill * Math.PI * 2;
    head.current.position.set(
      Math.cos(angle) * def.radius,
      Math.sin(angle) * def.radius,
      0,
    );
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    head.current.scale.setScalar(
      (0.12 + Math.sin(t * 4 + def.x) * 0.02) * reveal + 0.04,
    );

    group.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.2 + def.x) * 0.05;
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 0.8}
      floatIntensity={reducedMotion ? 0 : 0.4}
    >
      <group ref={root} position={[def.x, 0, 0]}>
        {/* Faint full-circle track. */}
        <mesh>
          <torusGeometry args={[def.radius, 0.018, 8, 80]} />
          <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.12} />
        </mesh>
        {/* Progress arc. */}
        <lineSegments ref={arc} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[arcPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={def.color}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </lineSegments>
        {/* Arc head. */}
        <mesh ref={head}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={def.color} toneMapped={false} />
        </mesh>
        {/* Core readout glow. */}
        <mesh>
          <circleGeometry args={[def.radius * 0.62, 40]} />
          <meshBasicMaterial
            color={def.color}
            transparent
            opacity={0.06}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * Chapter 5 — "Your vitals, always in view." Four radial gauges (heart rate,
 * oxygen, activity, sleep) assemble and fill themselves as the dashboard builds
 * under scroll, with ambient data motes drifting through.
 */
export function MonitoringRings({ progress, reducedMotion }) {
  return (
    <group position={CENTER}>
      {GAUGES.map((def, i) => (
        <Gauge
          key={i}
          def={def}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
      {!reducedMotion && (
        <Sparkles
          count={50}
          scale={[16, 6, 6]}
          size={2}
          speed={0.4}
          opacity={0.4}
          color={PALETTE.cyanLight}
        />
      )}
    </group>
  );
}

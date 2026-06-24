"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Object3D,
  Shape,
  ShapeGeometry,
} from "three";
import { PALETTE } from "../config";
import { damp, smoothstep } from "../lib/math";

// Sits dead-centre of the parked finale camera's look direction, so it animates
// fully in place while the testimonials scroll up over it (the camera no longer
// moves once the story has ended).
const CENTER = [0, -1, -118];
const NODE_COUNT = 58;
const STAR_COUNT = 6;

/** Soft ellipsoidal cloud of nodes, each linked to its nearest neighbour. */
function buildConstellation() {
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.5 + Math.random() * 0.5;
    nodes.push([
      Math.sin(phi) * Math.cos(theta) * 10 * r,
      Math.sin(phi) * Math.sin(theta) * 5.5 * r,
      Math.cos(phi) * 4 * r,
    ]);
  }

  const seen = new Set();
  const edges = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    let best = -1;
    let bestD = Infinity;
    for (let j = 0; j < NODE_COUNT; j++) {
      if (j === i) continue;
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dz = nodes[i][2] - nodes[j][2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    const key = i < best ? `${i}-${best}` : `${best}-${i}`;
    if (best >= 0 && !seen.has(key)) {
      seen.add(key);
      edges.push([i, best]);
    }
  }

  const linePositions = new Float32Array(edges.length * 2 * 3);
  edges.forEach(([a, b], e) => {
    linePositions.set(nodes[a], e * 6);
    linePositions.set(nodes[b], e * 6 + 3);
  });

  // A handful of nodes get promoted to a bright five-point "rating star".
  const starAnchors = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    starAnchors.push(nodes[Math.floor((i / STAR_COUNT) * NODE_COUNT)]);
  }

  return { nodes, edges, linePositions, starAnchors };
}

/** Flat five-point star outline (echoes the ⭐ review ratings). */
function makeStarGeometry(outer = 0.42, inner = 0.18, points = 5) {
  const shape = new Shape();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new ShapeGeometry(shape);
}

/**
 * Marketing tail — "Care that puts you first." A constellation of patient
 * voices: glowing nodes drift and link with faint filaments while a few
 * five-point rating stars twinkle among them. Driven by the testimonials
 * section's own scroll progress (`tail.reviews`) so it blooms while the reviews
 * are on screen and recedes as they leave.
 */
export function ReviewsConstellation({ tail, reducedMotion }) {
  const group = useRef(null);
  const nodesRef = useRef(null);
  const linesRef = useRef(null);
  const starsRef = useRef([]);
  const dummy = useMemo(() => new Object3D(), []);
  const data = useMemo(buildConstellation, []);
  const starGeo = useMemo(() => makeStarGeometry(), []);
  const reveal = useRef(0);
  const initialised = useRef(false);
  const colors = useMemo(() => {
    const a = new Color(PALETTE.glowLight);
    const b = new Color(PALETTE.indigoLight);
    const mix = new Color();
    return Array.from({ length: NODE_COUNT }, () =>
      mix.copy(a).lerp(b, Math.random()).clone(),
    );
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    const nodes = nodesRef.current;
    const lines = linesRef.current;
    if (!g || !nodes || !lines) return;

    const dt = Math.min(delta, 1 / 30);
    const p = tail?.current?.reviews ?? 0;
    // Present while the section is roughly centred; feathered at both edges.
    const target = smoothstep(0.08, 0.32, p) * (1 - smoothstep(0.7, 0.95, p));
    reveal.current = damp(reveal.current, target, 3, dt);
    const r = reveal.current;

    g.visible = r > 0.002;
    if (!g.visible) return;

    if (!initialised.current) {
      for (let i = 0; i < NODE_COUNT; i++) nodes.setColorAt(i, colors[i]);
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
      initialised.current = true;
    }

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    g.rotation.y = reducedMotion ? 0 : Math.sin(t * 0.05) * 0.25;

    nodes.material.emissiveIntensity = 1.6 + r * 1.4;
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = data.nodes[i];
      const tw = 0.7 + Math.sin(t * 1.4 + i * 1.7) * 0.3;
      dummy.position.set(
        n[0],
        n[1] + (reducedMotion ? 0 : Math.sin(t * 0.4 + i) * 0.12),
        n[2],
      );
      dummy.scale.setScalar(0.12 * tw * (0.4 + r));
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;

    // Filaments draw themselves in as the cluster assembles.
    const drawn = Math.floor(smoothstep(0, 0.8, p) * data.edges.length);
    lines.geometry.setDrawRange(0, drawn * 2);
    lines.material.opacity = r * 0.5;

    starsRef.current.forEach((star, i) => {
      if (!star) return;
      star.rotation.z = reducedMotion ? 0 : t * (0.2 + i * 0.05);
      const tw = 0.6 + Math.sin(t * 2 + i * 1.3) * 0.4;
      star.scale.setScalar((0.8 + tw * 0.5) * r);
      star.material.opacity = r * (0.5 + tw * 0.5);
    });
  });

  return (
    <group ref={group} position={CENTER}>
      {/* Connective filaments. */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={PALETTE.glow}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>

      {/* Voice nodes. */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, NODE_COUNT]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0a1330"
          emissive={PALETTE.glow}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Twinkling rating stars. */}
      {data.starAnchors.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          geometry={starGeo}
          position={pos}
        >
          <meshBasicMaterial
            color={PALETTE.glowLight}
            transparent
            opacity={0.8}
            side={DoubleSide}
            toneMapped={false}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

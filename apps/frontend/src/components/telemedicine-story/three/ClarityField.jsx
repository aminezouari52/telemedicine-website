"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, Color } from "three";
import { PALETTE } from "../config";
import { clamp, damp, smoothstep } from "../lib/math";

const CENTER = [0, -1, -120];
const COUNT = 1100;
const SPHERE_R = 5;
const NEIGHBORS = 2;

/** Soft radial sprite so each particle reads as a glowing mote, not a hard dot. */
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(210,225,255,0.55)");
  g.addColorStop(1, "rgba(150,170,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * Two end-states per particle: a scattered "chaos" position (the unanswered
 * question) and an "ordered" position on a Fibonacci-sphere lattice (the clear
 * answer). Faint edges link nearest ordered neighbours so the lattice visibly
 * locks together once it forms.
 */
function buildField() {
  const chaos = new Float32Array(COUNT * 3);
  const ordered = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const a = new Color(PALETTE.indigoLight);
  const b = new Color(PALETTE.glowLight);
  const mix = new Color();
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    chaos[i * 3] = (Math.random() - 0.5) * 28;
    chaos[i * 3 + 1] = (Math.random() - 0.5) * 17;
    chaos[i * 3 + 2] = (Math.random() - 0.5) * 13;

    const y = 1 - (i / (COUNT - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    ordered[i * 3] = Math.cos(theta) * rad * SPHERE_R;
    ordered[i * 3 + 1] = y * SPHERE_R;
    ordered[i * 3 + 2] = Math.sin(theta) * rad * SPHERE_R;

    seed[i * 3] = Math.random() * Math.PI * 2;
    seed[i * 3 + 1] = Math.random() * Math.PI * 2;
    seed[i * 3 + 2] = Math.random() * Math.PI * 2;

    mix.copy(a).lerp(b, Math.random());
    colors[i * 3] = mix.r;
    colors[i * 3 + 1] = mix.g;
    colors[i * 3 + 2] = mix.b;
  }

  // Geodesic-ish edges: each ordered point to its nearest neighbours (dedup).
  const seen = new Set();
  const edges = [];
  for (let i = 0; i < COUNT; i++) {
    const best = [];
    for (let j = 0; j < COUNT; j++) {
      if (j === i) continue;
      const dx = ordered[i * 3] - ordered[j * 3];
      const dy = ordered[i * 3 + 1] - ordered[j * 3 + 1];
      const dz = ordered[i * 3 + 2] - ordered[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (best.length < NEIGHBORS) {
        best.push({ j, d });
        best.sort((p, q) => q.d - p.d);
      } else if (d < best[0].d) {
        best[0] = { j, d };
        best.sort((p, q) => q.d - p.d);
      }
    }
    for (const { j } of best) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }

  const linePositions = new Float32Array(edges.length * 2 * 3);
  return { chaos, ordered, seed, colors, edges, linePositions };
}

/**
 * Marketing tail — "Frequently Asked Questions." A scattered particle storm
 * (the open question) resolves into an ordered, glowing geodesic lattice (the
 * clear answer) as the section scrolls past. Driven by the FAQ section's own
 * scroll progress (`tail.faq`); animates in place at the parked finale camera.
 */
export function ClarityField({ tail, reducedMotion }) {
  const group = useRef(null);
  const pointsRef = useRef(null);
  const linesRef = useRef(null);
  const reveal = useRef(0);
  const data = useMemo(buildField, []);
  const tex = useMemo(makeGlowTexture, []);
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);

  useFrame((state, delta) => {
    const g = group.current;
    const pts = pointsRef.current;
    const lines = linesRef.current;
    if (!g || !pts || !lines) return;

    const dt = Math.min(delta, 1 / 30);
    const p = tail?.current?.faq ?? 0;
    const target = smoothstep(0.06, 0.3, p) * (1 - smoothstep(0.72, 0.96, p));
    reveal.current = damp(reveal.current, target, 3, dt);
    const r = reveal.current;

    g.visible = r > 0.002;
    if (!g.visible) return;

    // Chaos → clarity: 0 = scattered storm, 1 = settled lattice.
    const m = smoothstep(0.12, 0.62, p);
    const calm = 1 - m; // turbulence fades as the answer resolves
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    g.rotation.y = reducedMotion ? 0 : t * 0.06;

    const arr = pts.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const k = i * 3;
      const turbX = reducedMotion
        ? 0
        : Math.sin(t * 0.6 + data.seed[k]) * 1.6 * calm;
      const turbY = reducedMotion
        ? 0
        : Math.cos(t * 0.5 + data.seed[k + 1]) * 1.6 * calm;
      const turbZ = reducedMotion
        ? 0
        : Math.sin(t * 0.7 + data.seed[k + 2]) * 1.6 * calm;
      arr[k] = (data.chaos[k] + turbX) * (1 - m) + data.ordered[k] * m;
      arr[k + 1] =
        (data.chaos[k + 1] + turbY) * (1 - m) + data.ordered[k + 1] * m;
      arr[k + 2] =
        (data.chaos[k + 2] + turbZ) * (1 - m) + data.ordered[k + 2] * m;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.material.opacity = r * (0.5 + 0.5 * m);
    pts.material.size =
      0.13 + 0.06 * m + (reducedMotion ? 0 : Math.sin(t * 2) * 0.01);

    // The lattice edges light up only once the particles have basically settled.
    const lineFade = smoothstep(0.55, 0.92, p);
    lines.visible = lineFade > 0.002;
    if (lines.visible) {
      const lp = lines.geometry.attributes.position.array;
      for (let e = 0; e < data.edges.length; e++) {
        const [ia, ib] = data.edges[e];
        lp[e * 6] = arr[ia * 3];
        lp[e * 6 + 1] = arr[ia * 3 + 1];
        lp[e * 6 + 2] = arr[ia * 3 + 2];
        lp[e * 6 + 3] = arr[ib * 3];
        lp[e * 6 + 4] = arr[ib * 3 + 1];
        lp[e * 6 + 5] = arr[ib * 3 + 2];
      }
      lines.geometry.attributes.position.needsUpdate = true;
      lines.material.opacity = clamp(lineFade * r * 0.45, 0, 1);
    }
  });

  return (
    <group ref={group} position={CENTER}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={tex}
          size={0.13}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>

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
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

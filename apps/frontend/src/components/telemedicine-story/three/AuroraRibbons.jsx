"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, DoubleSide } from "three";
import { PALETTE } from "../config";
import { damp, smoothstep } from "../lib/math";

// Centred in the parked finale camera's view, so the ribbons animate fully in
// place as the testimonials scroll up over them.
const CENTER = [0, -1, -118];
const POINTS = 96; // centreline samples per ribbon
const XSPAN = 17; // half-width the ribbons sweep across the view
const GLINTS = 46;

/** Soft radial sprite — fades a ribbon/glint at all its edges (no hard seams). */
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
  g.addColorStop(0.45, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

// Five layered silk ribbons across the brand-indigo ramp. Each undulates on its
// own frequencies/phase so the band breathes like an aurora rather than a wave.
const RIBBONS = [
  {
    color: PALETTE.glow,
    yBase: 2.6,
    width: 0.7,
    speed: 0.45,
    freq: [0.16, 0.33],
    amp: [1.7, 0.7],
    phase: 0.0,
    depth: 1.2,
    opacity: 0.55,
  },
  {
    color: PALETTE.indigoLight,
    yBase: 1.1,
    width: 0.95,
    speed: 0.38,
    freq: [0.13, 0.29],
    amp: [2.1, 0.9],
    phase: 1.2,
    depth: 1.6,
    opacity: 0.5,
  },
  {
    color: PALETTE.glowLight,
    yBase: -0.4,
    width: 0.62,
    speed: 0.52,
    freq: [0.18, 0.37],
    amp: [1.5, 0.6],
    phase: 2.4,
    depth: 1.0,
    opacity: 0.6,
  },
  {
    color: PALETTE.secondary,
    yBase: -1.9,
    width: 0.9,
    speed: 0.33,
    freq: [0.12, 0.26],
    amp: [2.4, 1.0],
    phase: 3.1,
    depth: 1.8,
    opacity: 0.45,
  },
  {
    color: PALETTE.indigo,
    yBase: -3.2,
    width: 0.72,
    speed: 0.42,
    freq: [0.15, 0.31],
    amp: [1.9, 0.8],
    phase: 4.0,
    depth: 1.3,
    opacity: 0.5,
  },
];

/** y of a ribbon's centreline at world-x `x` and time `t`. */
function ribbonY(def, x, t) {
  return (
    def.yBase +
    Math.sin(x * def.freq[0] + t * def.speed + def.phase) * def.amp[0] +
    Math.sin(x * def.freq[1] - t * def.speed * 0.6 + def.phase) * def.amp[1]
  );
}

/** A single glowing silk ribbon — a camera-facing strip whose centreline flows. */
function Ribbon({ def, reveal, reducedMotion, tex }) {
  const mesh = useRef(null);
  const geo = useRef(null);

  const { position, uv, index } = useMemo(() => {
    const position = new Float32Array(POINTS * 2 * 3);
    const uv = new Float32Array(POINTS * 2 * 2);
    const index = new Uint16Array((POINTS - 1) * 6);
    for (let i = 0; i < POINTS; i++) {
      const u = i / (POINTS - 1);
      uv[i * 4] = u;
      uv[i * 4 + 1] = 0;
      uv[i * 4 + 2] = u;
      uv[i * 4 + 3] = 1;
    }
    for (let i = 0; i < POINTS - 1; i++) {
      const a = i * 2;
      const o = i * 6;
      index[o] = a;
      index[o + 1] = a + 1;
      index[o + 2] = a + 2;
      index[o + 3] = a + 1;
      index[o + 4] = a + 3;
      index[o + 5] = a + 2;
    }
    return { position, uv, index };
  }, []);

  useFrame((state) => {
    const m = mesh.current;
    const g = geo.current;
    if (!m || !g) return;
    const r = reveal.current;
    m.visible = r > 0.002;
    if (!m.visible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const pos = g.attributes.position.array;
    const breathe = reducedMotion ? 0 : Math.sin(t * 1.5 + def.phase) * 0.2;

    for (let i = 0; i < POINTS; i++) {
      const u = i / (POINTS - 1);
      const x = -XSPAN + u * 2 * XSPAN;
      const y = ribbonY(def, x, t);
      const z = Math.sin(x * 0.12 + t * 0.3 + def.phase) * def.depth;

      // Perpendicular to the local tangent, in the camera-facing XY plane.
      const y2 = ribbonY(def, x + 0.1, t);
      const ty = y2 - y;
      const tl = Math.hypot(0.1, ty) || 1;
      const px = -ty / tl;
      const py = 0.1 / tl;
      const w = def.width * Math.sin(u * Math.PI) * (0.85 + breathe);

      const li = i * 6;
      pos[li] = x + px * w;
      pos[li + 1] = y + py * w;
      pos[li + 2] = z;
      pos[li + 3] = x - px * w;
      pos[li + 4] = y - py * w;
      pos[li + 5] = z;
    }
    g.attributes.position.needsUpdate = true;
    m.material.opacity = r * def.opacity;
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[position, 3]} />
        <bufferAttribute attach="attributes-uv" args={[uv, 2]} />
        <bufferAttribute attach="index" args={[index, 1]} />
      </bufferGeometry>
      <meshBasicMaterial
        map={tex}
        color={def.color}
        transparent
        opacity={0}
        side={DoubleSide}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Star-glints that catch along the ribbons, drifting up and twinkling. */
function Glints({ reveal, reducedMotion, tex }) {
  const points = useRef(null);
  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(GLINTS * 3);
    const phases = new Float32Array(GLINTS);
    for (let i = 0; i < GLINTS; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, []);

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const r = reveal.current;
    p.visible = r > 0.002;
    if (!p.visible) return;
    p.material.opacity = r * 0.85;

    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    const arr = p.geometry.attributes.position.array;
    for (let i = 0; i < GLINTS; i++) {
      arr[i * 3 + 1] += 0.01 + Math.sin(t * 0.5 + phases[i]) * 0.004;
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7;
    }
    p.geometry.attributes.position.needsUpdate = true;
    p.material.size = 0.7 + Math.sin(t * 3) * 0.15;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        color={PALETTE.glowLight}
        size={0.7}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * Marketing tail — "Care that puts you first." Silk ribbons of warm indigo
 * light flow and undulate across the view like an aurora, with star-glints
 * catching along them. Driven by the testimonials section's own scroll
 * progress (`tail.reviews`): blooms while the reviews are on screen, recedes as
 * they leave. The camera is parked at the finale, so this animates in place.
 */
export function AuroraRibbons({ tail, reducedMotion }) {
  const reveal = useRef(0);
  const tex = useMemo(makeGlowTexture, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = tail?.current?.reviews ?? 0;
    const target = smoothstep(0.06, 0.3, p) * (1 - smoothstep(0.72, 0.96, p));
    reveal.current = damp(reveal.current, target, 3, dt);
  });

  return (
    <group position={CENTER}>
      {RIBBONS.map((def, i) => (
        <Ribbon
          key={i}
          def={def}
          reveal={reveal}
          reducedMotion={reducedMotion}
          tex={tex}
        />
      ))}
      <Glints reveal={reveal} reducedMotion={reducedMotion} tex={tex} />
    </group>
  );
}

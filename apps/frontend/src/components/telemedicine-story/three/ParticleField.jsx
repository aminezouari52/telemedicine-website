"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, Color } from "three";
import { PALETTE } from "../config";
import { clamp, smoothstep } from "../lib/math";

/** Soft radial sprite so each particle reads as a glowing orb, not a hard dot. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(200,225,255,0.55)");
    gradient.addColorStop(1, "rgba(120,150,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);
}

const COUNT = 620;

/**
 * The hero's floating medical-particle cloud. A spherical shell of additive,
 * soft-sprite points that drift and rotate, tinted across the brand indigo
 * ramp. Visible only while the hero chapter is on screen.
 */
export function ParticleField({ progress, reducedMotion }) {
  const points = useRef(null);
  const texture = useGlowTexture();

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const a = new Color(PALETTE.glowLight);
    const b = new Color(PALETTE.indigoLight);
    const mix = new Color();

    for (let i = 0; i < COUNT; i++) {
      // Random point in a spherical shell around the hero.
      const r = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);

      mix.copy(a).lerp(b, Math.random());
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;

      speeds[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions, colors, speeds };
  }, []);

  useFrame((state) => {
    const reveal = 1 - smoothstep(0.04, 0.16, progress.current);
    const group = points.current;
    if (!group) return;

    group.visible = reveal > 0.001;
    group.material.opacity = clamp(reveal, 0, 1) * 0.9;

    if (reducedMotion) return;

    const t = state.clock.elapsedTime;
    group.rotation.y = t * 0.04;
    group.rotation.x = Math.sin(t * 0.1) * 0.08;

    // Gentle vertical bob per-particle for a "suspended in fluid" feel.
    const attr = group.geometry.getAttribute("position");
    const arr = attr.array;
    for (let i = 0; i < COUNT; i++) {
      const base = i * 3 + 1;
      arr[base] += Math.sin(t * speeds[i] + i) * 0.0016;
    }
    attr.needsUpdate = true;
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.42}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      {!reducedMotion && (
        <Sparkles
          count={70}
          scale={[14, 9, 10]}
          size={3}
          speed={0.3}
          opacity={0.5}
          color={PALETTE.glow}
        />
      )}
    </group>
  );
}

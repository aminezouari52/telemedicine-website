"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  Color,
  Object3D,
  QuadraticBezierCurve3,
  Vector3,
} from "three";
import { PALETTE, SECTION_CENTERS } from "../config";
import { smoothstep } from "../lib/math";

const CENTER = SECTION_CENTERS.globe;
const RADIUS = 4;
const HUB_COUNT = 54;
const ARC_COUNT = 16;
const ARC_SAMPLES = 26;

function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function buildGlobe() {
  const hubs = [];
  for (let i = 0; i < HUB_COUNT; i++) {
    const lat = Math.asin(2 * Math.random() - 1) * (180 / Math.PI);
    const lng = Math.random() * 360 - 180;
    hubs.push(latLngToVec3(lat, lng, RADIUS * 1.01));
  }

  const arcSamples = [];
  for (let i = 0; i < ARC_COUNT; i++) {
    const a = hubs[Math.floor(Math.random() * HUB_COUNT)];
    const b = hubs[Math.floor(Math.random() * HUB_COUNT)];
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const lift = 1 + a.distanceTo(b) / (RADIUS * 2);
    mid.normalize().multiplyScalar(RADIUS * lift);
    const curve = new QuadraticBezierCurve3(a, mid, b);
    arcSamples.push(curve.getPoints(ARC_SAMPLES - 1));
  }

  // Faint base lines for every arc (segment pairs).
  const arcLinePositions = new Float32Array(
    ARC_COUNT * (ARC_SAMPLES - 1) * 2 * 3,
  );
  let o = 0;
  arcSamples.forEach((samples) => {
    for (let i = 0; i < samples.length - 1; i++) {
      arcLinePositions.set(samples[i].toArray(), o);
      arcLinePositions.set(samples[i + 1].toArray(), o + 3);
      o += 6;
    }
  });

  return { hubs, arcSamples, arcLinePositions };
}

/**
 * Chapter 6 — "Accessible anywhere, anytime." A slowly turning data globe.
 * Care hubs glow across its surface and pulses of light travel the arcs that
 * link them. Stays lit through the finale as the ecosystem assembles.
 */
export function Globe({ progress, reducedMotion }) {
  const root = useRef(null);
  const hubsRef = useRef(null);
  const arcsRef = useRef(null);
  const pulseRef = useRef(null);
  const glowRef = useRef(null);
  const dummy = useMemo(() => new Object3D(), []);
  const data = useMemo(buildGlobe, []);

  const pulsePositions = useMemo(() => new Float32Array(ARC_COUNT * 3), []);
  const pulseColors = useMemo(() => {
    const colors = new Float32Array(ARC_COUNT * 3);
    const c = new Color(PALETTE.cyanLight);
    for (let i = 0; i < ARC_COUNT; i++) colors.set([c.r, c.g, c.b], i * 3);
    return colors;
  }, []);
  const pulseT = useRef(
    Float32Array.from({ length: ARC_COUNT }, () => Math.random()),
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = progress.current;
    // Reveals late and persists through the finale (no exit ramp).
    const reveal = smoothstep(0.73, 0.85, p);
    const finale = smoothstep(0.9, 1, p);
    const group = root.current;
    if (!group) return;

    group.visible = reveal > 0.002;
    if (!group.visible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    group.rotation.y = t * 0.06;
    group.scale.setScalar(0.6 + reveal * 0.4 + finale * 0.08);

    // Hubs.
    const hubs = hubsRef.current;
    if (hubs) {
      hubs.material.emissiveIntensity = 2 + finale * 2 + Math.sin(t * 2) * 0.3;
      for (let i = 0; i < HUB_COUNT; i++) {
        const pulse = 1 + Math.sin(t * 2 + i) * 0.3;
        dummy.position.copy(data.hubs[i]);
        dummy.scale.setScalar(0.07 * pulse * reveal);
        dummy.updateMatrix();
        hubs.setMatrixAt(i, dummy.matrix);
      }
      hubs.instanceMatrix.needsUpdate = true;
    }

    if (arcsRef.current) {
      arcsRef.current.material.opacity = reveal * (0.22 + finale * 0.25);
    }

    // Travelling light pulses along each arc.
    const pulse = pulseRef.current;
    if (pulse) {
      for (let i = 0; i < ARC_COUNT; i++) {
        pulseT.current[i] += dt * (reducedMotion ? 0.1 : 0.18 + (i % 3) * 0.05);
        if (pulseT.current[i] > 1) pulseT.current[i] -= 1;
        const samples = data.arcSamples[i];
        const f = pulseT.current[i] * (samples.length - 1);
        const idx = Math.min(samples.length - 1, Math.floor(f));
        const next = Math.min(samples.length - 1, idx + 1);
        const frac = f - idx;
        const a = samples[idx];
        const b = samples[next];
        pulsePositions[i * 3] = a.x + (b.x - a.x) * frac;
        pulsePositions[i * 3 + 1] = a.y + (b.y - a.y) * frac;
        pulsePositions[i * 3 + 2] = a.z + (b.z - a.z) * frac;
      }
      pulse.geometry.getAttribute("position").needsUpdate = true;
      pulse.material.opacity = reveal;
    }

    if (glowRef.current) {
      const halo = glowRef.current.children[0];
      halo.material.opacity = reveal * (0.16 + finale * 0.16);
    }
  });

  return (
    <group ref={root} position={CENTER}>
      {/* Dark interior so back-facing hubs/arcs stay hidden. */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.99, 48, 48]} />
        <meshBasicMaterial color="#04060f" />
      </mesh>
      {/* Lat/long grid shell. */}
      <mesh>
        <sphereGeometry args={[RADIUS, 36, 36]} />
        <meshBasicMaterial
          color={PALETTE.indigoLight}
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>
      {/* Atmospheric halo (fresnel-ish back-side shell). */}
      <group ref={glowRef}>
        <mesh>
          <sphereGeometry args={[RADIUS * 1.18, 36, 36]} />
          <meshBasicMaterial
            color={PALETTE.cyan}
            transparent
            opacity={0.16}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Care hubs. */}
      <instancedMesh
        ref={hubsRef}
        args={[undefined, undefined, HUB_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color="#0a1330"
          emissive={PALETTE.cyanLight}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Faint connection arcs. */}
      <lineSegments ref={arcsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.arcLinePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={PALETTE.cyan}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>

      {/* Travelling pulses. */}
      <points ref={pulseRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

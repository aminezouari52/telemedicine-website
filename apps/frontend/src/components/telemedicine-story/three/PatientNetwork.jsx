"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Object3D } from "three";
import { PALETTE, SECTION_CENTERS } from "../config";
import { smoothstep } from "../lib/math";

const NODE_COUNT = 52;
const NEIGHBORS = 3;
const CENTER = SECTION_CENTERS.network;

function buildNetwork() {
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push([
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 14,
    ]);
  }

  // Connect every node to its nearest neighbours, de-duplicated.
  const seen = new Set();
  const edges = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const dists = nodes
      .map((n, j) => ({
        j,
        d:
          (n[0] - nodes[i][0]) ** 2 +
          (n[1] - nodes[i][1]) ** 2 +
          (n[2] - nodes[i][2]) ** 2,
      }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBORS);
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }

  const linePositions = new Float32Array(edges.length * 2 * 3);
  const lineColors = new Float32Array(edges.length * 2 * 3);
  const accent = new Color(PALETTE.glow);
  const indigo = new Color(PALETTE.indigoLight);
  edges.forEach(([a, b], e) => {
    const o = e * 6;
    linePositions.set(nodes[a], o);
    linePositions.set(nodes[b], o + 3);
    lineColors.set([accent.r, accent.g, accent.b], o);
    lineColors.set([indigo.r, indigo.g, indigo.b], o + 3);
  });

  const nodeColors = nodes.map(
    (_, i) => new Color(i % 3 === 0 ? PALETTE.glowLight : PALETTE.indigoLight),
  );

  return { nodes, edges, linePositions, lineColors, nodeColors };
}

/**
 * Chapter 2 — "Millions connected, instantly to care." A cluster of nodes
 * (patients + providers) whose connection lines draw themselves in as the
 * chapter scrolls past, so the network visibly grows under the viewer.
 */
export function PatientNetwork({ progress, reducedMotion }) {
  const meshRef = useRef(null);
  const linesRef = useRef(null);
  const dummy = useMemo(() => new Object3D(), []);
  const data = useMemo(buildNetwork, []);
  const initialised = useRef(false);

  useFrame((state) => {
    const mesh = meshRef.current;
    const lines = linesRef.current;
    if (!mesh || !lines) return;

    const p = progress.current;
    const reveal = smoothstep(0.1, 0.2, p) * (1 - smoothstep(0.27, 0.36, p));
    const visible = reveal > 0.002;
    mesh.visible = visible;
    lines.visible = visible;
    if (!visible) return;

    if (!initialised.current) {
      for (let i = 0; i < NODE_COUNT; i++)
        mesh.setColorAt(i, data.nodeColors[i]);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      initialised.current = true;
    }

    // Network growth: how many edges have "formed" so far.
    const growth = smoothstep(0.13, 0.3, p);
    const visibleEdges = Math.floor(growth * data.edges.length);
    lines.geometry.setDrawRange(0, visibleEdges * 2);
    lines.material.opacity = reveal * 0.7;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    for (let i = 0; i < NODE_COUNT; i++) {
      const [x, y, z] = data.nodes[i];
      const pulse = 1 + Math.sin(t * 1.6 + i * 0.7) * 0.18;
      dummy.position.set(
        x,
        y + (reducedMotion ? 0 : Math.sin(t * 0.5 + i) * 0.15),
        z,
      );
      dummy.scale.setScalar(0.16 * pulse * (0.4 + reveal));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    // Everything below lives in chapter-local space; the group offset places it
    // in the corridor.
    <group position={CENTER}>
      {/* Connection lines. */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[data.lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>

      {/* Nodes — instanced for a single draw call. */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, NODE_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          emissive={PALETTE.glow}
          emissiveIntensity={2.2}
          color="#0a1024"
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

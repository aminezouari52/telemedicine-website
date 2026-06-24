"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Object3D, Vector3 } from "three";
import { PALETTE, SECTION_CENTERS } from "../config";
import { smoothstep } from "../lib/math";

const CENTER = SECTION_CENTERS.ai;
const LAYERS = [
  { x: -6.5, count: 5 },
  { x: -2.2, count: 8 },
  { x: 2.2, count: 8 },
  { x: 6.5, count: 5 },
];
const FLOW_COUNT = 140;

function buildNeural() {
  const nodes = [];
  const layerRanges = [];

  LAYERS.forEach((layer) => {
    const range = [];
    const spread = (layer.count - 1) * 1.1;
    for (let i = 0; i < layer.count; i++) {
      const y = -spread / 2 + i * 1.1;
      range.push(nodes.length);
      nodes.push(new Vector3(layer.x, y, (Math.random() - 0.5) * 1.6));
    }
    layerRanges.push(range);
  });

  const edges = [];
  for (let l = 0; l < layerRanges.length - 1; l++) {
    for (const a of layerRanges[l]) {
      for (const b of layerRanges[l + 1]) edges.push([a, b]);
    }
  }

  const linePositions = new Float32Array(edges.length * 2 * 3);
  edges.forEach(([a, b], e) => {
    linePositions.set(nodes[a].toArray(), e * 6);
    linePositions.set(nodes[b].toArray(), e * 6 + 3);
  });

  const flowEdge = new Int32Array(FLOW_COUNT);
  const flowT = new Float32Array(FLOW_COUNT);
  const flowSpeed = new Float32Array(FLOW_COUNT);
  for (let i = 0; i < FLOW_COUNT; i++) {
    flowEdge[i] = Math.floor(Math.random() * edges.length);
    flowT[i] = Math.random();
    flowSpeed[i] = 0.25 + Math.random() * 0.5;
  }

  return { nodes, edges, linePositions, flowEdge, flowT, flowSpeed };
}

/**
 * The neural-mesh flourish (no longer a captioned chapter). A layered mesh whose
 * synapses light up as data particles stream layer-to-layer; the camera flies
 * through it on the way from the consultation to the monitoring waypoint, so it
 * reads as a background beat. Node glow and the particle flow intensify with
 * scroll, reading as the model "processing."
 */
export function NeuralNetwork({ progress, reducedMotion }) {
  const nodesRef = useRef(null);
  const linesRef = useRef(null);
  const flowRef = useRef(null);
  const dummy = useMemo(() => new Object3D(), []);
  const data = useMemo(buildNeural, []);

  const flowPositions = useMemo(() => new Float32Array(FLOW_COUNT * 3), []);
  const flowColors = useMemo(() => {
    const colors = new Float32Array(FLOW_COUNT * 3);
    const accent = new Color(PALETTE.glowLight);
    const indigo = new Color(PALETTE.indigoLight);
    const mix = new Color();
    for (let i = 0; i < FLOW_COUNT; i++) {
      mix.copy(accent).lerp(indigo, Math.random());
      colors.set([mix.r, mix.g, mix.b], i * 3);
    }
    return colors;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = progress.current;
    const reveal = smoothstep(0.42, 0.5, p) * (1 - smoothstep(0.58, 0.66, p));
    const visible = reveal > 0.002;

    const nodes = nodesRef.current;
    const lines = linesRef.current;
    const flow = flowRef.current;
    if (!nodes || !lines || !flow) return;

    nodes.visible = visible;
    lines.visible = visible;
    flow.visible = visible;
    if (!visible) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const processing = 0.4 + p * 1.6; // lighting evolves as it "processes"

    // Pulsing nodes.
    nodes.material.emissiveIntensity = 1.4 + processing + Math.sin(t * 3) * 0.4;
    for (let i = 0; i < data.nodes.length; i++) {
      const n = data.nodes[i];
      const pulse = 1 + Math.sin(t * 2.2 + i) * 0.22;
      dummy.position.copy(n);
      dummy.scale.setScalar(0.18 * pulse * (0.5 + reveal));
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;
    lines.material.opacity = reveal * (0.12 + p * 0.18);

    // Stream data particles along their assigned synapses.
    for (let i = 0; i < FLOW_COUNT; i++) {
      data.flowT[i] += data.flowSpeed[i] * dt * (reducedMotion ? 0.3 : 1);
      if (data.flowT[i] > 1) {
        data.flowT[i] -= 1;
        data.flowEdge[i] = Math.floor(Math.random() * data.edges.length);
      }
      const [a, b] = data.edges[data.flowEdge[i]];
      const na = data.nodes[a];
      const nb = data.nodes[b];
      const tt = data.flowT[i];
      flowPositions[i * 3] = na.x + (nb.x - na.x) * tt;
      flowPositions[i * 3 + 1] = na.y + (nb.y - na.y) * tt;
      flowPositions[i * 3 + 2] = na.z + (nb.z - na.z) * tt;
    }
    flow.geometry.getAttribute("position").needsUpdate = true;
    flow.material.opacity = reveal;
  });

  return (
    <group position={CENTER}>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={PALETTE.indigo}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>

      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, data.nodes.length]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0a1330"
          emissive={PALETTE.glow}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </instancedMesh>

      <points ref={flowRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[flowPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[flowColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
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

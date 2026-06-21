"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { CAMERA_KEYFRAMES } from "../config";
import { clamp, damp, lerpTuple, smoothstep } from "../lib/math";

/**
 * Flies the camera through the corridor of scenes. Each frame it:
 *  - turns master scroll progress into a fractional waypoint index,
 *  - eases between the two surrounding `CAMERA_KEYFRAMES`,
 *  - adds a whisper of idle drift + pointer parallax for a hand-held cinematic
 *    feel, and
 *  - damps position and look-at so there are never abrupt cuts.
 */
export function CameraRig({ progress, reducedMotion }) {
  const { camera } = useThree();

  const desiredPos = useRef(new Vector3(...CAMERA_KEYFRAMES[0].position));
  const desiredTarget = useRef(new Vector3(...CAMERA_KEYFRAMES[0].target));
  const currentTarget = useRef(new Vector3(...CAMERA_KEYFRAMES[0].target));
  const pointer = useRef({ x: 0, y: 0 });

  const lastIndex = CAMERA_KEYFRAMES.length - 1;
  const tmp = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30); // clamp huge frames (tab refocus)
    const p = clamp(progress.current, 0, 1);

    // Fractional waypoint, with eased sub-segment travel.
    const f = p * lastIndex;
    const i = clamp(Math.floor(f), 0, lastIndex - 1);
    const segT = smoothstep(0, 1, f - i);

    const pos = lerpTuple(
      CAMERA_KEYFRAMES[i].position,
      CAMERA_KEYFRAMES[i + 1].position,
      segT,
    );
    const target = lerpTuple(
      CAMERA_KEYFRAMES[i].target,
      CAMERA_KEYFRAMES[i + 1].target,
      segT,
    );

    desiredPos.current.set(pos[0], pos[1], pos[2]);
    desiredTarget.current.set(target[0], target[1], target[2]);

    if (!reducedMotion) {
      const t = state.clock.elapsedTime;
      // Idle drift — breathing movement so static moments still feel alive.
      desiredPos.current.x += Math.sin(t * 0.18) * 0.45;
      desiredPos.current.y += Math.cos(t * 0.22) * 0.35;

      // Pointer parallax, eased toward the live pointer.
      pointer.current.x = damp(pointer.current.x, state.pointer.x, 2.5, dt);
      pointer.current.y = damp(pointer.current.y, state.pointer.y, 2.5, dt);
      desiredPos.current.x += pointer.current.x * 1.1;
      desiredPos.current.y += pointer.current.y * 0.8;
    }

    // Damp position component-wise (frame-rate independent).
    const lambda = reducedMotion ? 6 : 3.2;
    camera.position.set(
      damp(camera.position.x, desiredPos.current.x, lambda, dt),
      damp(camera.position.y, desiredPos.current.y, lambda, dt),
      damp(camera.position.z, desiredPos.current.z, lambda, dt),
    );

    // Damp the look-at target, then orient the camera.
    currentTarget.current.set(
      damp(currentTarget.current.x, desiredTarget.current.x, lambda, dt),
      damp(currentTarget.current.y, desiredTarget.current.y, lambda, dt),
      damp(currentTarget.current.z, desiredTarget.current.z, lambda, dt),
    );
    tmp.copy(currentTarget.current);
    camera.lookAt(tmp);
  });

  return null;
}

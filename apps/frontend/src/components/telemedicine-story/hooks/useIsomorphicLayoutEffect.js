import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` warns when run during SSR. GSAP setup must run before paint
 * on the client, so we swap to `useEffect` on the server to stay quiet.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

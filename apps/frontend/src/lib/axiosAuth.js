import axios from "axios";
import { getToken } from "@clerk/nextjs";

const API_URLS = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXT_PUBLIC_API_V1_URL,
].filter(Boolean);

const isApiRequest = (url = "") =>
  API_URLS.length === 0 || API_URLS.some((base) => url.startsWith(base));

let registered = false;

/**
 * Registers a global axios request interceptor that attaches a fresh Clerk
 * session token to every request to our backend. Clerk tokens are short-lived
 * (~60s); `getToken()` waits for Clerk to load, returns the cached token while
 * it is valid and refreshes it when needed, so callers never send a stale one.
 *
 * Falls back to whatever `authtoken` header the caller already set when there
 * is no active session. Requests to other hosts never receive the token.
 */
export function registerAuthInterceptor() {
  if (registered) return;
  registered = true;

  axios.interceptors.request.use(async (config) => {
    if (typeof window === "undefined" || !isApiRequest(config.url)) {
      return config;
    }
    try {
      const token = await getToken();
      if (token) config.headers.authtoken = token;
    } catch (err) {
      console.error("[auth] Failed to get session token:", err);
    }
    return config;
  });
}

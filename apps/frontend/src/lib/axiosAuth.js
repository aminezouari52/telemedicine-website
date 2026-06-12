import axios from "axios";
import { auth } from "@/firebase";

let registered = false;

/**
 * Registers a global axios request interceptor that attaches a fresh Firebase
 * ID token to every request. `getIdToken()` returns the cached token while it
 * is still valid and silently refreshes it when it is near/past expiry, so the
 * user is never disrupted by an expired-token error.
 *
 * Falls back to whatever `authtoken` header the caller already set (e.g. the
 * localStorage snapshot) during the brief window before Firebase restores the
 * session and `auth.currentUser` becomes available.
 */
export function registerAuthInterceptor() {
  if (registered) return;
  registered = true;

  axios.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        config.headers.authtoken = await user.getIdToken();
      } catch (err) {
        console.error("[auth] Failed to refresh ID token:", err);
      }
    }
    return config;
  });
}

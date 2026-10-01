import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { SIGN_IN_URL, SIGN_UP_URL } from "@/constants/auth";

// Signed-out visitors are redirected to sign in before these pages render.
// Role checks (patient vs doctor vs admin) live in the MongoDB user and are
// enforced by each area's layout and by the backend.
const isProtectedRoute = createRouteMatcher([
  "/patient(.*)",
  "/doctor(.*)",
  "/admin(.*)",
  "/consultation(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
  },
  { signInUrl: SIGN_IN_URL, signUpUrl: SIGN_UP_URL },
);

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf|hdr|mp4)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

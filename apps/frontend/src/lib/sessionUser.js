import { loginUser } from "@/services/authService";

/**
 * React Query options for the MongoDB user behind the current Clerk session.
 * `/auth/login-user` creates that user on first sign-in, so every caller
 * (AuthSync and the post-auth redirect page) shares this key and a single
 * in-flight request.
 */
export const sessionUserQuery = (userId) => ({
  queryKey: ["currentUser", userId],
  queryFn: async () => (await loginUser()).data,
});

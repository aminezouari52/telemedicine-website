"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getToken, useAuth } from "@clerk/nextjs";
import { store } from "@/store";
import { setUser, logout } from "@/reducers/userReducer";
import { sessionUserQuery } from "@/lib/sessionUser";
import { registerAuthInterceptor } from "@/lib/axiosAuth";
import { Toaster } from "@/components/ui/toaster";

registerAuthInterceptor();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Keeps the Redux user in step with the Clerk session: refreshes it from the
// backend while signed in, and clears a stale copy once Clerk reports there is
// no session (signed out in another tab, expired, or revoked).
function AuthSync() {
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.userReducer.user);
  const { isLoaded, isSignedIn, userId } = useAuth();

  const { data: currentUser } = useQuery({
    ...sessionUserQuery(userId),
    enabled: isLoaded && !!isSignedIn,
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn && storedUser) dispatch(logout());
  }, [isLoaded, isSignedIn, storedUser, dispatch]);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    getToken()
      .then((token) => {
        if (!cancelled && token) dispatch(setUser({ ...currentUser, token }));
      })
      .catch((err) => console.log("Failed to sync user:", err));
    return () => {
      cancelled = true;
    };
  }, [currentUser, dispatch]);

  return null;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthSync />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </Provider>
  );
}

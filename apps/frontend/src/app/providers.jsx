"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store";
import { setUser } from "@/reducers/userReducer";
import { getCurrentUser } from "@/services/authService";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getLocalStorage } from "@/utils/localStorage";
import { Toaster } from "@/components/ui/toaster";

const demoAccounts = ["freddie24@yahoo.com", "christop_hagenes21@gmail.com"];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

function handleAuthenticatedUser(data, dispatch, token) {
  if (!data) throw new Error("User not found");
  const storedUser = getLocalStorage("user") || data;
  const isDemoAccount = demoAccounts.includes(storedUser.email);
  const isVerified = auth.currentUser?.emailVerified;
  if (!isDemoAccount && !isVerified) {
    throw new Error("Email not verified. Please verify your email.");
  }
  dispatch(setUser({ ...storedUser, token }));
}

function AuthSync({ token }) {
  const dispatch = useDispatch();
  useQuery({
    queryKey: ["currentUser", token],
    queryFn: () => getCurrentUser(token),
    enabled: !!token,
    onSuccess: (data) => {
      try {
        handleAuthenticatedUser(data, dispatch, token);
      } catch (err) {
        console.log("Failed to sync user:", err);
      }
    },
    onError: (err) => console.log("Failed to fetch user:", err),
  });
  return null;
}

export function Providers({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const t = (await authUser.getIdTokenResult()).token;
        setToken(t);
      } else {
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthSync token={token} />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </Provider>
  );
}

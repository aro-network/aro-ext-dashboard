"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useThemeState } from "@/components/theme-mode";
const client = new QueryClient();

const googleClientId = "425165933886-vpv32tvbhfeqfujnel0fdjm88kfn1lhn.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
  useThemeState();
  return (
    <NextUIProvider className="App max-w-[96rem] mx-auto">
      <GoogleOAuthProvider clientId={googleClientId}>
        <QueryClientProvider client={client}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </NextUIProvider>
  );
}

export function PageLayout({ children }: { children: ReactNode }) {
  const [init, setInit] = useState(false);
  useEffect(() => {
    if (!init) {
      setInit(true);
    }
  }, [init]);
  if (!init) return null;
  return (
    <>
      <Toaster position="top-right" offset={70} theme="light"/>
      <Providers>{children}</Providers>
    </>
  );
}

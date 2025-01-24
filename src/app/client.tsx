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
    <NextUIProvider className="App  ">
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
      <Toaster position="top-right" offset={100} theme="light" style={
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        { '--width': '15rem' }
      } toastOptions={{
        classNames: { 'toast': "rounded-xl bg-[#585858] border border-solid border-white/10 text-white/60 text-xs px-4 py-2" }
      }} />
      <Providers>{children}</Providers>
    </>
  );
}

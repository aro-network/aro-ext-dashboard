"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const client = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="App">
      <QueryClientProvider client={client}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
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
      <Providers>{children}</Providers>
      <Toaster position="top-right" offset={70} />
    </>
  );
}

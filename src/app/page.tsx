'use client'

import Home from "@/app/home";
import {AuthProvider} from "@/app/context/AuthContext";

export default function Page() {

  return (
      <AuthProvider>
          <Home />
      </AuthProvider>
  );
}

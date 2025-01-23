"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import Main from "@/components/Main";
import Login from "@/app/signin/page";
import backendApi from "@/lib/api";
import { useShowParamsError } from "@/hooks/useShowParamsError";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  const referral = params.get("referral");
  const uid = params.get("uid");
  const name = params.get("name");
  backendApi.setAuth(user?.token);
  useShowParamsError();

  // router.push(`/displayCartoon?referral=${referral}&uid=${uid}&name=${name}`)

  useEffect(() => {
    if (page === "displayCartoon") {
      router.push(`/displayCartoon?referral=${referral}&uid=${uid}&name=${name}`)

    }
  }, [router]);

  return user?.token || user?.accessToken ? <Main /> : <Login />;
}

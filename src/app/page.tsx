"use client";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Main from "@/components/Main";
import Login from "@/app/signin/page";

export default function Page() {
  const { user } = useContext(AuthContext);
  return user?.token || user?.accessToken ? <Main /> : <Login />;
}

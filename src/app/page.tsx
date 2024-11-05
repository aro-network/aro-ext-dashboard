"use client";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";

export default function Page() {
  const { user } = useContext(AuthContext);

  return <div className="App">{user?.accessToken ? <Dashboard /> : <Login />}</div>;
}

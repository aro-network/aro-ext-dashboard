"use client";

import { Spinner } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const r = useRouter();
  const sp = useSearchParams();
  const accessToken = sp.get("accessToken");
  if (accessToken) {
    r.replace("/");
    return (
      <div className="flex h-full justify-center items-center">
        <Spinner />
      </div>
    );
  }
  const error = sp.get("error");
  return <div>{error || "Error"}</div>;
}

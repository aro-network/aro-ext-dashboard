import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function handlerErrForBind(err?: string | null) {
  if (err === "handle_third_party_failed") {
    toast.error("Oops! This account has been connected to an existing EnReach account.");
  }
}
export function useShowParamsError() {
  const sp = useSearchParams();
  const error = sp.get("err");
  useEffect(() => {
    handlerErrForBind(error);
  }, [error]);
}

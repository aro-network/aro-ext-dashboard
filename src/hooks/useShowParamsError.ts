import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function useShowParamsError() {
  const sp = useSearchParams();
  const error = sp.get("err");
  useEffect(() => {
    if (error) {
      if (error === "handle_third_party_failed") {
        toast.error("Oops! This X/D/tg account has been connected to an existing EnReach account.");
      }
    }
  }, [error]);
}

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useRedirect = (redirectPath = "/") => {
  const router = useRouter();

  useEffect(() => {
    const lastLoginUser = localStorage.getItem("last-login-user");
    if (lastLoginUser) {
      router.replace(redirectPath);
    }
  }, [router, redirectPath]);
};

export default useRedirect;

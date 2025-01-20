import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useRedirect = (redirectPath = "/") => {
  const router = useRouter();

  useEffect(() => {
    const lastLoginUser = localStorage.getItem("last-login-user");
    if (lastLoginUser) {
      router.replace(redirectPath);
    }

    // const params = new URLSearchParams(window.location.search);
    // const page = params.get("page");
    // const referral = params.get("referral");

    // console.log("lastLoginUserlastLoginUser", lastLoginUser);

    // if (lastLoginUser && page === "displayCartoon") {
    //   router.push(`/displayCartoon?referral=${referral}`);
    // } else if (lastLoginUser) {
    //   router.push("/");
    // } else {
    //   router.push("signin");
    // }
  }, [router, redirectPath]);
};

export default useRedirect;

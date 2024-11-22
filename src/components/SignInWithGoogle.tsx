import { FcGoogle } from "react-icons/fc";
import { Btn } from "./btns";
import { ForceModal } from "./dialogs";
import { InputSplitCode } from "./inputs";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { handlerError } from "@/lib/utils";
import { useToggle } from "react-use";
import { validateReferralCode } from "@/lib/validates";
import backendApi from "@/lib/api";
import { useAuthContext } from "@/app/context/AuthContext";

export function SignInWithGoogle({ defReferralCode, btn = "Sign in with Google", isDisabled }: { defReferralCode?: string; btn?: string; isDisabled?: boolean }) {
  const ac = useAuthContext();
  const [referralCode, setReferralCode] = useState("");
  const [showInputReferral, toggleShowInputReferral] = useToggle(false);
  const [isAuthing, setIsAuthing] = useState(false);
  const refGoogleToken = useRef("");

  const { mutate: handleGoogle, isPending } = useMutation({
    onError: handlerError,
    mutationFn: async (tokenRes: TokenResponse) => {
      setIsAuthing(false);
      refGoogleToken.current = tokenRes.access_token;
      const result = await backendApi.loginByGoogleApi({ accessToken: tokenRes.access_token });
      if (result.token) {
        ac.setUser(result);
      } else if (defReferralCode && validateReferralCode(defReferralCode) === true) {
        const res = await backendApi.loginSetReferralApi({ accessToken: refGoogleToken.current, referralCode: defReferralCode }).catch(handlerError);
        if (res) {
          ac.setUser(res);
        } else {
          toggleShowInputReferral();
        }
      } else {
        toggleShowInputReferral();
      }
    },
  });
  const loginGoogle = useGoogleLogin({
    flow: "implicit",
    onError: (err) => {
      setIsAuthing(false);
      handlerError(err.error_description);
    },
    onSuccess: handleGoogle,
  });
  const { mutate: onConfirmReferralCode, isPending: isPendingConfirmReferralCode } = useMutation({
    onError: handlerError,
    mutationFn: async () => {
      if (validateReferralCode(referralCode) !== true || !refGoogleToken.current) return;
      const res = await backendApi.loginSetReferralApi({ accessToken: refGoogleToken.current, referralCode });
      ac.setUser(res);
    },
  });

  const onClick = () => {
    setIsAuthing(true);
    loginGoogle();
  };
  const disableGetBoosted = isPendingConfirmReferralCode || isPending || validateReferralCode(referralCode) !== true || !refGoogleToken.current;
  const disableLogin = isDisabled || isPending || isAuthing;
  return (
    <>
      <Btn color="default" type="button" isDisabled={disableLogin} isLoading={isPending || isAuthing} onClick={onClick}>
        <FcGoogle /> {btn}
      </Btn>

      <ForceModal isOpen={showInputReferral}>
        <p className="self-stretch flex-grow-0 flex-shrink-0  text-base text-center text-white">A Special Welcome</p>
        <p className="self-stretch flex-grow-0 flex-shrink-0  text-sm text-center text-white/50">
          New qualified users with a referral code enjoy <span className="text-white">50 BERRY</span> rewards and EXPs for extra boost!
        </p>
        <InputSplitCode onChange={setReferralCode} />
        <Btn isDisabled={disableGetBoosted} className="w-full" onClick={() => onConfirmReferralCode()} isLoading={isPendingConfirmReferralCode}>
          Get Boosted
        </Btn>
      </ForceModal>
    </>
  );
}

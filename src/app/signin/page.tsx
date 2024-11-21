"use client";

import { Btn } from "@/components/btns";
import { ForceModal } from "@/components/dialogs";
import { InputEmail, InputPassword, InputSplitCode } from "@/components/inputs";
import backendApi from "@/lib/api";
import { handlerError } from "@/lib/utils";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useContext, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useToggle } from "react-use";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { validateEmail, validatePassword, validateReferralCode } from "@/lib/validates";
import { MLink } from "@/components/links";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [referralCode, setReferralCode] = useState("");
  const [showInputReferral, toggleShowInputReferral] = useToggle(false);
  const { login, setUser } = useContext(AuthContext);
  const refGoogleToken = useRef("");
  const { mutate: handleGoogle } = useMutation({
    onError: handlerError,
    mutationFn: async (tokenRes: TokenResponse) => {
      refGoogleToken.current = tokenRes.access_token;
      const result = await backendApi.loginByGoogleApi({ accessToken: tokenRes.access_token });
      if (result.token) {
        setUser(result);
      } else {
        toggleShowInputReferral();
      }
    },
  });
  const loginGoogle = useGoogleLogin({
    flow: "implicit",
    onError: (err) => toast.error(`${err.error} : ${err.error_description}`),
    onSuccess: handleGoogle,
  });

  const { mutate: handleSubmit, isPending: isPendingSignIn } = useMutation({
    onError: handlerError,
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      await login({ email, password });
    },
  });
  const { mutate: onConfirmReferralCode, isPending: isPendingConfirmReferralCode } = useMutation({
    onError: handlerError,
    mutationFn: async () => {
      if (!referralCode || validateReferralCode(referralCode) !== true || !refGoogleToken.current) return;
      const res = await backendApi.loginSetReferralApi({ accessToken: refGoogleToken.current, referralCode });
      setUser(res);
    },
  });
  const disableSignIn = isPendingSignIn || validateEmail(email) !== true || validatePassword(password) !== true;
  return (
    <div className="mx-auto px-5 min-h-full flex flex-col gap-4 items-center w-full max-w-[25rem]">
      <img src="logo.svg" alt="Logo" className="mt-auto h-[79px]" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <InputEmail setEmail={setEmail} />
        <InputPassword setPassword={setPassword} />
        <Btn type="submit" isDisabled={disableSignIn} isLoading={isPendingSignIn}>
          Sign In
        </Btn>
        <Btn color="default" type="button" onClick={() => loginGoogle()}>
          <FcGoogle /> Sign in with Google
        </Btn>
      </form>
      <div className="mb-auto flex items-center w-full text-xs text-white/60">
        Don’t have an account?
        <MLink href="/signup" className="ml-2 text-xs">
          Sign Up
        </MLink>
        <MLink href={`/reset?email=${email}`} className="ml-auto text-xs">
          Forget Password?
        </MLink>
      </div>

      <ForceModal isOpen={showInputReferral}>
        <p className="self-stretch flex-grow-0 flex-shrink-0  text-base text-center text-white">A Special Welcome</p>
        <p className="self-stretch flex-grow-0 flex-shrink-0  text-sm text-center text-white/50">
          New qualified users with a referral code enjoy <span className="text-white">50 BERRY</span> rewards and EXPs for extra boost!
        </p>
        <InputSplitCode onChange={setReferralCode} />
        <Btn className="w-full" onClick={() => onConfirmReferralCode()} isLoading={isPendingConfirmReferralCode}>
          Get Boosted
        </Btn>
      </ForceModal>
    </div>
  );
}

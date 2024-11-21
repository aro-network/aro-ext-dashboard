"use client";

import { Btn } from "@/components/btns";
import { InputEmail, InputPassword, InputReferralCode, InputSplitCode } from "@/components/inputs";
import { MLink } from "@/components/links";
import backendApi from "@/lib/api";
import { handlerError } from "@/lib/utils";
import { validateConfirmPassword, validateEmail, validatePassword, validateVerifyCode } from "@/lib/validates";
import { SingUpResult } from "@/types/user";
import { Checkbox } from "@nextui-org/react";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, MouseEvent, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useCounter, useInterval, useToggle } from "react-use";
import { toast } from "sonner";

export default function Page() {
  const sq = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referalCode, setReferalCode] = useState(sq.get("referral") || "");
  const [showToVerify, setShowToVerify] = useState(false);
  const [checkedTermPrivacy, setCheckedTermPrivacy] = useToggle(false);
  // const [checkedReceiveEmail, setCheckedReceiveEmail] = useToggle(false);
  const [reSendSecends, actionResendScends] = useCounter(60, 60, 0);
  useInterval(() => actionResendScends.dec(1), 1000);
  const [verifyCode, setVerifyCode] = useState("");
  const r = useRouter();
  const refRegisterUser = useRef<SingUpResult>();
  const { mutate: handlerSubmit, isPending } = useMutation({
    onError: handlerError,
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      if (!email || !password || !confirmPassword) throw new Error("Please enter email or password");
      if (password !== confirmPassword) throw new Error("Please confirm password");
      if (!referalCode) throw new Error("Please enter referral code");
      if (!checkedTermPrivacy) throw new Error("Plase checked Term of Service and Privacy Policy");
      refRegisterUser.current = await backendApi.registerApi({ email, password, referralCode: referalCode });
      actionResendScends.reset(60);
      setShowToVerify(true);
    },
  });
  const { mutate: handleGoogle } = useMutation({
    onError: handlerError,
    mutationFn: async (token: TokenResponse) => {
      await backendApi.registerByGoogleApi(token.access_token);
      r.push("/signin");
    },
  });
  const loginGoogle = useGoogleLogin({
    flow: "implicit",
    onError: (err) => toast.error(`${err.error} : ${err.error_description}`),
    onSuccess: handleGoogle,
  });
  const { mutate: handlerVerify, isPending: isPendingVerify } = useMutation({
    onError: handlerError,
    mutationFn: async () => {
      if (!verifyCode || validateVerifyCode(verifyCode) !== true) throw new Error("Please enter verify code");
      if (!refRegisterUser.current) throw new Error("Please sign up");
      await backendApi.verifyRegisterCode(refRegisterUser.current.userId, verifyCode);
      r.push("/signin");
    },
  });
  const { mutate: handlerResendVerify, isPending: isPendingResendVerify } = useMutation({
    onError: handlerError,
    mutationFn: async (e: MouseEvent) => {
      e.preventDefault();
      if (!refRegisterUser.current) throw new Error("Please sign up");
      await backendApi.resendRegisterVerifyCode(refRegisterUser.current.userId);
      actionResendScends.reset(60);
    },
  });

  const disableVerifyEmail = isPendingVerify || validateVerifyCode(verifyCode) !== true
  const disableSignUp = isPending || !checkedTermPrivacy ||validateEmail(email) !== true || validatePassword(password) !== true || validateConfirmPassword(confirmPassword, password) !== true;
  return (
    <div className="mx-auto p-5 min-h-full flex flex-col gap-5 items-center w-full max-w-[25rem]">
      <img src="logo.svg" alt="Logo" className="mt-auto h-[79px]" />
      {showToVerify ? (
        <div className="flex flex-col items-center gap-5 w-full mb-auto">
          <div className="text-center whitespace-nowrap">
            Verify your email
            <br />
            Enter the 6-digit verification code we sent to your inbox below:
          </div>
          <InputSplitCode onChange={setVerifyCode} />
          <Btn className="w-full" onClick={handlerVerify as any} isDisabled={disableVerifyEmail} isLoading={isPendingVerify}>
            Verify Email
          </Btn>
          <MLink className="text-xs -mt-1" onClick={handlerResendVerify} isDisable={reSendSecends > 0 || isPendingResendVerify}>
            {reSendSecends > 0 ? `Resend Email (${reSendSecends}s)` : "Resend Email"}
          </MLink>
        </div>
      ) : (
        <form onSubmit={handlerSubmit} className="flex flex-col gap-5 w-full mb-auto">
          <InputEmail setEmail={setEmail} />
          <InputPassword setPassword={setPassword} />
          <InputPassword label="Confirm Password" setPassword={setConfirmPassword} validate={(value) => validateConfirmPassword(value, password)} />
          <InputReferralCode value={referalCode} setReferalCode={setReferalCode} />
          <Checkbox classNames={{ label: "text-xs text-white/60", icon: "w-[9px] h-[10px]" }} checked={checkedTermPrivacy} onValueChange={setCheckedTermPrivacy}>
            I agree to the EnReach.AI{" "}
            <MLink className="text-xs" href="/terms">
              Term of Service
            </MLink>{" "}
            and{" "}
            <MLink className="text-xs" href="/privacy">
              Privacy Policy
            </MLink>
            .
          </Checkbox>
          {/* <Checkbox classNames={{ label: "text-xs text-white/60", icon: "w-[9px] h-[10px]" }} checked={checkedReceiveEmail} onValueChange={setCheckedReceiveEmail}>
            I agree to receive updates, notifications and promotions from EnReach.AI with my email.
          </Checkbox> */}
          <Btn type="submit" isDisabled={disableSignUp} isLoading={isPending}>
            Sign Up
          </Btn>
          <Btn color="default" type="button" onClick={() => loginGoogle()}>
            <FcGoogle /> Sign up with Google
          </Btn>
          <div className="text-center text-xs text-white/60">
            Already have an account?{" "}
            <MLink href="/signin" className="text-xs">
              Sign In
            </MLink>
          </div>
        </form>
      )}
    </div>
  );
}

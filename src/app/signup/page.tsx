"use client";

import { AutoFlip } from "@/components/auto-flip";
import { Btn } from "@/components/btns";
import { loginTitleClassName } from "@/components/classes";
import { InputEmail, InputPassword, InputReferralCode, InputSplitCode } from "@/components/inputs";
import { PageUnlogin } from "@/components/layouts";
import { MLink } from "@/components/links";
import { SignInWithGoogle } from "@/components/SignInWithGoogle";
import backendApi from "@/lib/api";
import { handlerError } from "@/lib/utils";
import { validateConfirmPassword, validateEmail, validatePassword, validateReferralCode, validateVerifyCode } from "@/lib/validates";
import { SingUpResult } from "@/types/user";
import { Checkbox, Spinner } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, MouseEvent, useRef, useState } from "react";
import { useCounter, useInterval, useToggle } from "react-use";
import { useAuthContext } from "../context/AuthContext";

export default function Page() {
  const sq = useSearchParams();
  const ac = useAuthContext();
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
      if (!checkedTermPrivacy) throw new Error("Plase checked Term of Service and Privacy Policy");
      refRegisterUser.current = await backendApi.registerApi({ email, password, referralCode: referalCode ? referalCode.trim() : undefined });
      actionResendScends.reset(60);
      setShowToVerify(true);
    },
  });
  const { mutate: handlerVerify, isPending: isPendingVerify } = useMutation({
    onError: handlerError,
    mutationFn: async () => {
      if (!verifyCode || validateVerifyCode(verifyCode) !== true) throw new Error("Please enter verify code");
      if (!refRegisterUser.current) throw new Error("Please sign up");
      const res = await backendApi.verifyRegisterCode(refRegisterUser.current.userId, verifyCode.trim());
      if (res && res.token) {
        ac.setUser(res);
      } else {
        // try sign
        const res = await backendApi.loginApi({ email, password });
        if (res.token) {
          ac.setUser(res);
        } else {
          r.push("/signin");
        }
      }
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

  const disableVerifyEmail = isPendingVerify || validateVerifyCode(verifyCode) !== true;
  const disableSignUp =
    isPending ||
    !checkedTermPrivacy ||
    (Boolean(referalCode) && validateReferralCode(referalCode) !== true) ||
    validateEmail(email) !== true ||
    validatePassword(password) !== true ||
    validateConfirmPassword(confirmPassword, password) !== true;
  const disableResendEmail = reSendSecends > 0 || isPendingResendVerify;
  return (
    <PageUnlogin>
      <AutoFlip className="mx-auto p-5 min-h-full flex flex-col gap-5 items-center w-full max-w-[25rem]">
        <span className={loginTitleClassName}>Sign Up</span>
        {/* <img src="logo.svg" alt="Logo" className="mt-auto h-[4.9375rem]" /> */}
        {showToVerify ? (
          <div className="flex flex-col items-center gap-5 w-full mb-auto">
            <div className="text-center whitespace-nowrap">
              Verify your email
              <br />
              Enter the 6-digit verification code we sent to your inbox below:
            </div>
            <InputSplitCode onChange={setVerifyCode} />
            <Btn className="w-full" onClick={() => handlerVerify()} isDisabled={disableVerifyEmail} isLoading={isPendingVerify}>
              Verify Email
            </Btn>
            <MLink className="text-xs -mt-1 flex items-center gap-2" onClick={handlerResendVerify} isDisable={disableResendEmail}>
              {isPendingResendVerify && <Spinner size="sm" />}
              {reSendSecends > 0 ? `Resend Email (${reSendSecends}s)` : "Resend Email"}
            </MLink>
          </div>
        ) : (
          <form onSubmit={handlerSubmit} className="flex flex-col gap-5 w-full mb-auto">
            <InputEmail setEmail={setEmail} />
            <InputPassword setPassword={setPassword} />
            <InputPassword label="Confirm Password" setPassword={setConfirmPassword} validate={(value) => validateConfirmPassword(value, password)} />
            <InputReferralCode value={referalCode} setReferalCode={setReferalCode} />
            <Checkbox classNames={{ wrapper: 'flip_item', label: "text-xs text-white/60", icon: "w-2.5 h-2.5" }} checked={checkedTermPrivacy} onValueChange={setCheckedTermPrivacy}>
              I agree to the EnReach{" "}
              <MLink target="_blank" className="text-xs" href="https://enreach.network/terms" >
                Term of Service
              </MLink>{" "}
              and{" "}
              <MLink target="_blank" className="text-xs" href="https://enreach.network/privacy">
                Privacy Policy
              </MLink>
              .
            </Checkbox>
            <Btn type="submit" isDisabled={disableSignUp} isLoading={isPending}>
              Sign Up
            </Btn>
            <SignInWithGoogle btn="Sign up with Google" defReferralCode={referalCode} />
            <div className="flip_item text-center text-xs text-white/60">
              Already have an account?{" "}
              <MLink href="/signin" className="text-xs">
                Sign In
              </MLink>
            </div>
          </form>
        )}
      </AutoFlip>
    </PageUnlogin>
  );
}

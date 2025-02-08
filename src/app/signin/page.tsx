"use client";

import { AutoFlip } from "@/components/auto-flip";
import { Btn } from "@/components/btns";
import { loginTitleClassName } from "@/components/classes";
import { InputEmail, InputPassword } from "@/components/inputs";
import { PageUnlogin } from "@/components/layouts";
import { MLink } from "@/components/links";
import { SignInWithGoogle } from "@/components/SignInWithGoogle";
import { handlerError } from "@/lib/utils";
import { validateEmail } from "@/lib/validates";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSearchParams } from "next/navigation";
import useRedirect from "@/hooks/useRedirect";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ac = useContext(AuthContext);
  const params = useSearchParams();
  const referral = params.get("referral");

  const { mutate: handleSubmit, isPending: isPendingSignIn } = useMutation({
    onError: handlerError,
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      await ac.login({ email, password });
    },
  });
  useRedirect()
  const href = referral ? `/signup?referral=${referral}` : '/signup'

  const disableSignIn = isPendingSignIn || validateEmail(email) !== true || !password;
  return (
    <PageUnlogin>
      <AutoFlip className="mx-auto px-5 min-h-full flex flex-col gap-4 items-center w-full max-w-[25rem]">
        {/* <img src="logo.svg" alt="Logo" className="flip_item mt-auto h-[4.9375rem]" /> */}
        <span className={loginTitleClassName}>Sign In</span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <InputEmail setEmail={setEmail} />
          <InputPassword setPassword={setPassword} validate={() => null} />
          <Btn type="submit" isDisabled={disableSignIn} isLoading={isPendingSignIn}>
            Sign In
          </Btn>
          <SignInWithGoogle />
        </form>
        <div className="flip_item mb-auto flex items-center w-full text-xs text-white/60">
          Don’t have an account?
          <MLink href={href} className="ml-2 text-xs">
            Sign Up
          </MLink>
          <MLink href={`/reset?email=${email}`} className="ml-auto text-xs">
            Forget Password?
          </MLink>
        </div>
      </AutoFlip>
    </PageUnlogin>
  );
}

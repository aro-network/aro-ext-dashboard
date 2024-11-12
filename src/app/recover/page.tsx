"use client";

import { InputEmail, InputPassword, InputReferralCode } from "@/components/inputs";
import backendApi from "@/lib/api";
import { Button, Checkbox, Link } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToggle } from "react-use";
import { useAuthContext } from "../context/AuthContext";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referalCode, setReferalCode] = useState("");
  const [showToVerify, setShowToVerify] = useState(false);
  const [checkedTermPrivacy, setCheckedTermPrivacy] = useToggle(false);
  const [checkedReceiveEmail, setCheckedReceiveEmail] = useToggle(false);
  const ac = useAuthContext();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!email || !password || !confirmPassword) throw new Error("Please input email or password");
      if (password !== confirmPassword) throw new Error("Please confirm password");
      if (!referalCode) throw new Error("Please input referral code");
      if (!checkedTermPrivacy) throw new Error("Plase checked Term of Service and Privacy Policy");
      await backendApi.registerApi({ email, password, invateCode: referalCode });
    },
    onSuccess: () => setShowToVerify(true),
  });

  return (
    <div className="mx-auto p-5 min-h-full flex flex-col gap-5 items-center w-full max-w-[27.5rem]">
      <img src="logo.svg" alt="Logo" className="mt-auto" />
      {showToVerify ? (
        <>
          <div className="mb-auto">Please to email verify yout account!</div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            mutate();
            e.preventDefault();
          }}
          className="flex flex-col gap-5 w-full mb-auto"
        >
          <InputEmail setEmail={setEmail} />
          <InputPassword setPassword={setPassword} />
          <InputPassword label="Confirm Password" setPassword={setConfirmPassword} />
          <InputReferralCode setReferalCode={setReferalCode} />
          <Checkbox classNames={{ label: "text-xs", icon: "w-[9px] h-[10px]" }} checked={checkedTermPrivacy} onValueChange={setCheckedTermPrivacy}>
            I agree to the EnReach.AI{" "}
            <Link className="text-xs" href="/terms">
              Term of Service
            </Link>{" "}
            and{" "}
            <Link className="text-xs" href="/privacy">
              Privacy Policy
            </Link>
            .
          </Checkbox>
          <Checkbox classNames={{ label: "text-xs", icon: "w-[9px] h-[10px]" }} checked={checkedReceiveEmail} onValueChange={setCheckedReceiveEmail}>
            I agree to receive updates, notifications and promotions from EnReach.AI with my email.
          </Checkbox>
          <Button color="primary" type="submit" isLoading={isPending}>
            Register
          </Button>
          <div className="text-center">
            Already have an account? <Link href="/login">Sign In</Link>
          </div>
        </form>
      )}
    </div>
  );
}

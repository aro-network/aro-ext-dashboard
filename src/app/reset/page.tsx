"use client";

import { InputPassword } from "@/components/inputs";
import backendApi from "@/lib/api";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";

export default function Page() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const ac = useAuthContext();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!password || !confirmPassword) throw new Error("Please input email or password");
      if (password !== confirmPassword) throw new Error("Please confirm password");
      await backendApi.resetPassword(password);
    },
    onSuccess: () => toast.success("Reset Password Success!"),
  });

  return (
    <div className="mx-auto p-5 min-h-full flex flex-col gap-5 items-center w-full max-w-[27.5rem]">
      <img src="logo.svg" alt="Logo" className="mt-auto h-[79px]" />
      <div className="text-white/60 text-center text-sm">Reset Password for account: example@email.com</div>
      <form
        onSubmit={(e) => {
          mutate();
          e.preventDefault();
        }}
        className="flex flex-col gap-5 w-full mb-auto"
      >
        <InputPassword label="New Password" setPassword={setPassword} />
        <InputPassword label="Confirm Password" setPassword={setConfirmPassword} />

        <Button color="primary" type="submit" isLoading={isPending}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}

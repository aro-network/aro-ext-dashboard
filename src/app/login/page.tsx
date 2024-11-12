"use client";

import { InputEmail, InputPassword } from "@/components/inputs";
import { Button, Link } from "@nextui-org/react";
import { useGoogleLogin } from "@react-oauth/google";
import { FormEvent, useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const loginGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password }).catch();
  };

  return (
    <div className="mx-auto px-5 min-h-full flex flex-col gap-4 items-center w-full max-w-[27.5rem]">
      <img src="logo.svg" alt="Logo" className="mt-auto h-[79px]" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <InputEmail setEmail={setEmail} />
        <InputPassword setPassword={setPassword} />
        <Button color="primary" type="submit">
          Sign In
        </Button>
        <Button type="button" onClick={() => loginGoogle()}>
          <FcGoogle /> Sign in with Google
        </Button>
      </form>
      <div className="mb-auto flex items-center w-full">
        Don’t have an account?
        <Link href="/signup" className="ml-2">
          Sign up
        </Link>
        <Link href="/recover" className="ml-auto">
          Forget password?
        </Link>
      </div>
    </div>
  );
}

import { useAuthContext } from "@/app/context/AuthContext";
import backendApi from "@/lib/api";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToVerify, setShowToVerify] = useState(false);
  const ac = useAuthContext()
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!email || !password || !confirmPassword) return;
      if (password != confirmPassword) return;
      const user = await backendApi.registerApi({ email, password });
      ac.setUser(user)
    },
    onSuccess: () => setShowToVerify(true),
  });

  return (
    <div className="mx-auto px-5 h-full justify-center flex flex-col gap-5 items-center w-full md:w-1/2 lg:w-1/3 max-w-lg">
      <img src="logo.svg" alt="Logo" />
      {showToVerify ? (
        <>
          <div>Please to email verify yout account!</div>
        </>
      ) : (
        <form onSubmit={() => mutate()} className="flex flex-col gap-5 w-full">
          <Input value={email} type="email" label="Email" required onChange={(e) => setEmail(e.target.value)} />
          <Input value={password} type="password" label="Password" required onChange={(e) => setPassword(e.target.value)} />
          <Input value={confirmPassword} type="password" label="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button type="submit" isLoading={isPending}>
            Register
          </Button>
        </form>
      )}
    </div>
  );
};

export default Register;

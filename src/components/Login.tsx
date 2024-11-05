import React, { useState, useContext, FormEvent } from "react";
import { AuthContext } from "../app/context/AuthContext";
import { Button, Input } from "@nextui-org/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password }).catch();
  };

  return (
    <div className="mx-auto px-5 h-full justify-center flex flex-col gap-5 items-center w-full md:w-1/2 lg:w-1/3 max-w-lg">
      <img src="logo.svg" alt="Logo" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <Input type="email" label="Email" required onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" label="Password" required onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit">Login</Button>
      </form>
      <div>
        Don’t have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;

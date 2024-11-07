import { Button, Link } from "@nextui-org/react";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../app/context/AuthContext";
import { InputEmail, InputPassword } from "./inputs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login } = useContext(AuthContext);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password }).catch();
  };

  return (
    <div className="mx-auto px-5 h-full flex flex-col gap-5 items-center w-full max-w-[25rem]">
      <img src="logo.svg" alt="Logo" className="mt-auto"/>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <InputEmail setEmail={setEmail}/>
        <InputPassword setPassword={setPassword}/>
        <Button color="primary" type="submit">
          Login
        </Button>
      </form>
      <div className="mb-auto">
        Don’t have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;

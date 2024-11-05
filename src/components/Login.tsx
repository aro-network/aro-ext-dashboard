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
    <div className="mx-auto px-5 h-full justify-center flex flex-col gap-5 items-center w-full md:w-1/2 lg:w-1/3 max-w-lg">
      <img src="logo.svg" alt="Logo" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <InputEmail setEmail={setEmail}/>
        <InputPassword setPassword={setPassword}/>
        <Button color="primary" type="submit">
          Login
        </Button>
      </form>
      <div>
        Don’t have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;

import {useContext} from "react";
import {AuthContext} from "@/app/context/AuthContext";
import Dashboard from "@/app/pages/Dashboard";
import Login from "@/app/pages/Login";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
      <div className="App">
        {user ? <Dashboard /> : <Login />}
      </div>
  );
}

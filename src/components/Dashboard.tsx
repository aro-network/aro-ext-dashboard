import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext } from "react";

const Dashboard = () => {
  const { user: _user, logout: _logout } = useContext(AuthContext);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-1/6 bg-blue-100 flex flex-col h-full"></div>
      <div className="flex-1 flex justify-center gap-5">Dashboard</div>
    </div>
  );
};

export default Dashboard;

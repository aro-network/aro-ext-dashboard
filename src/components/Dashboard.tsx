import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext } from "react";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <h2>Welcome, {user?.role}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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

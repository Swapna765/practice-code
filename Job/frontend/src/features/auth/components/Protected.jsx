import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
    const { user, authLoading } = useAuth();

    // Wait until we finish checking the existing authentication cookie
    if (authLoading) {
        return (
            <main>
                <h1>Loading...</h1>
            </main>
        );
    }

    // User is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated
    return children;
};

export default Protected;
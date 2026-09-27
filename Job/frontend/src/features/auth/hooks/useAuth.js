import { useContext } from "react";
import { AuthContext } from "../auth.context";

import {
    login,
    register,
    logout,
} from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    const {
        user,
        setUser,
        loading,
        setLoading,
        authLoading,
    } = context;

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);

            const data = await login({
                email,
                password,
            });

            if (!data?.user) {
                throw new Error(data?.message || "Login failed");
            }

            setUser(data.user);

            return data;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);

            const data = await register({
                username,
                email,
                password,
            });

            if (!data?.user) {
                throw new Error(data?.message || "Registration failed");
            }

            setUser(data.user);

            return data;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);

            await logout();

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        authLoading,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};
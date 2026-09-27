import { createContext, useEffect, useState } from "react";
import { getme } from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Used for login/register/logout API requests
    const [loading, setLoading] = useState(false);

    // Used only when checking the existing authentication cookie
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const data = await getme();

                if (data?.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // No valid token/cookie means the user is not logged in.
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                authLoading,
                setAuthLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
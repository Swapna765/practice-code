import {
    createContext,
    useContext,
    useState
} from "react";

import {
    loginUser,
    logoutUser
} from "../services/authService";


const AuthContext =
    createContext();


export const AuthProvider = ({
    children
}) => {

    const [token, setToken] =
        useState(
            localStorage.getItem("token")
        );


    const [user, setUser] =
        useState(() => {

            const saved =
                localStorage.getItem(
                    "user"
                );

            return saved
                ? JSON.parse(saved)
                : null;
        });


    const login = async (
        email,
        password
    ) => {

        const data =
            await loginUser(
                email,
                password
            );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Login failed"
            );
        }


        localStorage.setItem(
            "token",
            data.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        setToken(data.token);

        setUser(data.user);


        return data;
    };


    const logout = () => {

        logoutUser();

        setToken(null);

        setUser(null);
    };


    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated:
                    !!token
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};


export const useAuth = () =>
    useContext(AuthContext);
import API from "./api";

export const loginUser = async (
    email,
    password
) => {

    const response =
        await API.post(
            "/auth/login",
            {
                email,
                password
            }
        );

    return response.data;
};


export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


export const getCurrentUser = () => {

    const user =
        localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};
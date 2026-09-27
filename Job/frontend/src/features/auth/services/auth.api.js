import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export async function register({ username, email, password }) {
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            {
                username,
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Register API error:", error);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await axios.get(
            `${API_URL}/logout`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Logout API error:", error);
        throw error;
    }
}

export async function getme() {
    try {
        const response = await axios.get(
            `${API_URL}/get-me`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get current user API error:",
            error.response?.data || error.message
        );

        throw error;
    }
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(email, password);
            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f8"
            }}
        >

            <div
                className="login-card"
                style={{
                    width: "400px",
                    padding: "30px",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow:
                        "0 4px 20px rgba(0,0,0,0.1)"
                }}
            >

                <h1>
                    Billing Desktop
                </h1>

                <h2>
                    Admin Login
                </h2>


                {error && (

                    <p
                        style={{
                            color: "red"
                        }}
                    >
                        {error}
                    </p>

                )}


                <form
                    onSubmit={handleLogin}
                >

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="admin@store.com"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />

                    </div>


                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter password"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            cursor: "pointer"
                        }}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;
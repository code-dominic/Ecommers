import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function Login({ token, setToken }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`${BackendUrl}/users/login`, { username, password });
            console.log("Received token:", res.data.token);
            setToken(res.data.token);
        } catch (error) {
            const message = error.response?.data?.message || "Login failed!";
            alert(message);
            console.error("Login failed:", message);
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg border-0" style={{ width: "28rem", borderRadius: "15px" }}>
                <div className="card-header text-center bg-info text-white" style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
                    <h4 className="mb-0">Welcome Back</h4>
                </div>
                <div className="card-body p-4">
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingUsername"
                            placeholder="User Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="floatingUsername">User Name</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <button
                        type="button"
                        className="btn btn-info w-100 text-white fw-bold"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>

                    <div className="text-center mt-3">
                        <small>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="btn btn-link p-0 text-info fw-semibold"
                                onClick={() => navigate("/register")}
                            >
                                Register here
                            </button>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

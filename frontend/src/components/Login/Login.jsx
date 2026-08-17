import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await axios.post(
            "http://localhost:8081/api/auth/login",
            user
        );

        const token = response.data;

        // Make sure backend returned a valid JWT
        if (
            typeof token !== "string" ||
            token.trim() === "" ||
            token.split(".").length !== 3
        ) {
            alert(token || "Invalid email or password");
            return;
        }

        // Save only valid JWT token
        if (response.data && response.data.split(".").length === 3) {
    localStorage.setItem("token", response.data);

    alert("Login Successful");
    navigate("/dashboard");
} else {
    alert(response.data);
}

        setUser({
            email: "",
            password: ""
        });

    } catch (error) {
    console.error(error);
    localStorage.removeItem("token");
    alert("Login Failed");
}
};

    return (

        <div className="login-page">

            {/* LEFT SIDE */}

            <div className="login-brand-section">

                <div className="brand-content">

                    <div className="large-lock">
                        🔐
                    </div>

                    <h1>PasswordVault</h1>

                    <p className="brand-subtitle">
                        Secure Credential Management System
                    </p>

                    <div className="security-features">

                        <div className="security-feature">
                            <span>🛡️</span>
                            <div>
                                <strong>Secure Storage</strong>
                                <small>
                                    Keep your credentials protected
                                </small>
                            </div>
                        </div>

                        <div className="security-feature">
                            <span>🔑</span>
                            <div>
                                <strong>Password Management</strong>
                                <small>
                                    Generate and manage strong passwords
                                </small>
                            </div>
                        </div>

                        <div className="security-feature">
                            <span>🤝</span>
                            <div>
                                <strong>Secure Sharing</strong>
                                <small>
                                    Share credentials with controlled access
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="login-form-section">

                <div className="login-card">

                    <div className="mobile-logo">
                        🔐
                    </div>

                    <h2>Welcome Back</h2>

                    <p className="login-description">
                        Sign in to access your secure password vault.
                    </p>


                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}

                        <div className="login-form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="login-form-group">

                            <div className="password-label">

                                <label>
                                    Password
                                </label>

                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>

                            </div>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                        >
                            Sign In
                        </button>


                        {/* REGISTER */}

                        <p className="register-text">

                            Don't have an account?

                            <Link to="/register">
                                Create an account
                            </Link>

                        </p>

                    </form>


                    {/* SECURITY MESSAGE */}

                    <div className="login-security">

                        <span>
                            🛡️
                        </span>

                        <div>
                            <strong>Secure Login</strong>

                            <small>
                                Your credentials are protected
                            </small>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
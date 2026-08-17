import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";

function Register() {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

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
                "http://localhost:8081/api/auth/register",
                user
            );

            alert(response.data);

            setUser({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

        } catch (error) {

            console.error(error);

            alert("Registration Failed");
        }
    };

    return (

        <div className="register-page">

            {/* LEFT SIDE */}

            <div className="register-brand-section">

                <div className="register-brand-content">

                    <div className="register-lock">
                        🔐
                    </div>

                    <h1>PasswordVault</h1>

                    <p className="register-brand-subtitle">
                        Secure Credential Management System
                    </p>

                    <div className="register-features">

                        <div className="register-feature">

                            <span>🛡️</span>

                            <div>
                                <strong>Secure Your Credentials</strong>

                                <small>
                                    Store passwords safely in your private vault
                                </small>
                            </div>

                        </div>


                        <div className="register-feature">

                            <span>🔑</span>

                            <div>
                                <strong>Strong Passwords</strong>

                                <small>
                                    Generate and manage secure passwords
                                </small>
                            </div>

                        </div>


                        <div className="register-feature">

                            <span>🤝</span>

                            <div>
                                <strong>Controlled Sharing</strong>

                                <small>
                                    Share credentials with selected users
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="register-form-section">

                <div className="register-card">

                    <div className="register-mobile-logo">
                        🔐
                    </div>

                    <h2>Create Account</h2>

                    <p className="register-description">
                        Create your secure PasswordVault account.
                    </p>


                    <form onSubmit={handleSubmit}>

                        {/* FIRST + LAST NAME */}

                        <div className="name-row">

                            <div className="register-form-group">

                                <label>First Name</label>

                                <div className="register-input-wrapper">

                                    <span>👤</span>

                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First name"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="register-form-group">

                                <label>Last Name</label>

                                <div className="register-input-wrapper">

                                    <span>👤</span>

                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last name"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="register-form-group">

                            <label>Email Address</label>

                            <div className="register-input-wrapper">

                                <span>✉️</span>

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

                        <div className="register-form-group">

                            <label>Password</label>

                            <div className="register-input-wrapper">

                                <span>🔒</span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a secure password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                            <small className="password-hint">
                                Use a strong password with letters,
                                numbers and special characters.
                            </small>

                        </div>


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            className="register-button"
                        >
                            Create Account
                        </button>


                        {/* LOGIN */}

                        <p className="login-text">

                            Already have an account?

                            <Link to="/login">
                                Sign In
                            </Link>

                        </p>

                    </form>


                    {/* SECURITY */}

                    <div className="register-security">

                        <span>
                            🛡️
                        </span>

                        <div>

                            <strong>Your security matters</strong>

                            <small>
                                Your account is protected by secure authentication.
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
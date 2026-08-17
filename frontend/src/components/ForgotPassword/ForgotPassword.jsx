import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../services/AuthService";
import "./ForgotPassword.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await forgotPassword(email);

            alert(response.data);

            if (response.data === "Email verified") {

                navigate("/reset-password");

            }

        } catch (error) {

            console.error(error);

            alert("Something went wrong");
        }
    };

    return (

        <div className="forgot-page">

            {/* LEFT SIDE */}

            <div className="forgot-brand-section">

                <div className="forgot-brand-content">

                    <div className="forgot-lock">
                        🔐
                    </div>

                    <h1>PasswordVault</h1>

                    <p>
                        Secure Credential Management System
                    </p>

                    <div className="forgot-security-list">

                        <div>
                            <span>🛡️</span>
                            <div>
                                <strong>Secure Account Recovery</strong>
                                <small>
                                    Verify your registered email securely
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>🔑</span>
                            <div>
                                <strong>Password Protection</strong>
                                <small>
                                    Keep your vault protected
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="forgot-form-section">

                <div className="forgot-card">

                    <div className="forgot-icon">
                        🔑
                    </div>

                    <h2>Forgot Password?</h2>

                    <p className="forgot-description">
                        Don't worry. Enter your registered email
                        address and we'll verify your account.
                    </p>


                    <form onSubmit={handleSubmit}>

                        <div className="forgot-form-group">

                            <label>
                                Registered Email
                            </label>

                            <div className="forgot-input-wrapper">

                                <span>✉️</span>

                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="verify-button"
                        >
                            Verify Email
                        </button>

                    </form>


                    <div className="back-login">

                        <Link to="/login">
                            ← Back to Login
                        </Link>

                    </div>


                    <div className="forgot-security">

                        <span>🛡️</span>

                        <div>
                            <strong>Secure Recovery</strong>

                            <small>
                                Your account information remains protected.
                            </small>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;
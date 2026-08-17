import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/AuthService";
import "./ResetPassword.css";

function ResetPassword() {

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            alert("Passwords do not match");
            return;

        }

        try {

            const response = await resetPassword(formData);

            alert(response.data);

            if (response.data === "Password Reset Successfully") {

                navigate("/login");

            }

        } catch (error) {

            alert("Failed to reset password");
            console.error(error);

        }

    };

    return (

        <div className="reset-page">

            {/* LEFT SIDE */}

            <div className="reset-brand-section">

                <div className="reset-brand-content">

                    <div className="reset-lock">
                        🔐
                    </div>

                    <h1>PasswordVault</h1>

                    <p>
                        Secure Credential Management System
                    </p>

                    <div className="reset-features">

                        <div className="reset-feature">

                            <span>🔑</span>

                            <div>
                                <strong>Create a New Password</strong>
                                <small>
                                    Protect your account with a strong password
                                </small>
                            </div>

                        </div>

                        <div className="reset-feature">

                            <span>🛡️</span>

                            <div>
                                <strong>Secure Recovery</strong>
                                <small>
                                    Your account remains protected
                                </small>
                            </div>

                        </div>

                        <div className="reset-feature">

                            <span>✓</span>

                            <div>
                                <strong>Stay Protected</strong>
                                <small>
                                    Use a unique password for your vault
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="reset-form-section">

                <div className="reset-card">

                    <div className="reset-icon">
                        🔑
                    </div>

                    <h2>Reset Password</h2>

                    <p className="reset-description">
                        Create a new password for your PasswordVault
                        account.
                    </p>


                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}

                        <div className="reset-form-group">

                            <label>
                                Registered Email
                            </label>

                            <div className="reset-input-wrapper">

                                <span>✉️</span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your registered email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="reset-form-group">

                            <label>
                                New Password
                            </label>

                            <div className="reset-input-wrapper">

                                <span>🔒</span>

                                <input
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="reset-password-toggle"
                                    onClick={() =>
                                        setShowNewPassword(
                                            !showNewPassword
                                        )
                                    }
                                >
                                    {showNewPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="reset-form-group">

                            <label>
                                Confirm New Password
                            </label>

                            <div className="reset-input-wrapper">

                                <span>🔒</span>

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="reset-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* PASSWORD MATCH */}

                        {formData.confirmPassword && (

                            <div
                                className={
                                    formData.newPassword ===
                                    formData.confirmPassword
                                        ? "password-match success"
                                        : "password-match error"
                                }
                            >

                                {formData.newPassword ===
                                formData.confirmPassword
                                    ? "✓ Passwords match"
                                    : "✕ Passwords do not match"}

                            </div>

                        )}


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="reset-button"
                        >
                            Reset Password
                        </button>

                    </form>


                    {/* BACK TO LOGIN */}

                    <div className="reset-back-login">

                        <Link to="/login">
                            ← Back to Login
                        </Link>

                    </div>


                    {/* SECURITY */}

                    <div className="reset-security">

                        <span>🛡️</span>

                        <div>

                            <strong>Secure Password Reset</strong>

                            <small>
                                Choose a strong and unique password.
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;
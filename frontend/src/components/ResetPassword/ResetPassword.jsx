import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/AuthService";

function ResetPassword() {

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

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

        <div className="container mt-5">

            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label>New Password</label>

                    <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                </div>

                <button type="submit" className="btn btn-success">
                    Reset Password
                </button>

            </form>

        </div>

    );

}

export default ResetPassword;
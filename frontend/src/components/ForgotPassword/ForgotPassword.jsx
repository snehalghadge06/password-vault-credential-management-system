import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/AuthService";

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

            alert("Something went wrong");

            console.error(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>Forgot Password</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Email</label>

                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                <button type="submit" className="btn btn-primary">
                    Verify Email
                </button>

            </form>

        </div>

    );

}

export default ForgotPassword;
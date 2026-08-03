import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {

    const [user, setUser] = useState({
       email: "",
       password: ""
   });

    const handleChange = (e) => {
     setUser({
        ...user,
       [e.target.name]: e.target.value
    });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        user
    );

    // Save JWT Token
    localStorage.setItem("token", response.data);

    alert("Login Successful");

    navigate("/dashboard");

    setUser({
        email: "",
        password: ""
    });

} catch (error) {

    alert("Login Failed");
    console.error(error);

}
};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Login
            </h2>

            <form onSubmit={handleSubmit}>

               <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>

              <div className="mt-3 text-center">
                 <Link to="/forgot-password">
                    Forgot Password?
                </Link>
             </div>

              <p className="text-center mt-3">
                  Don't have an account? <Link to="/register">Register</Link>
              </p>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
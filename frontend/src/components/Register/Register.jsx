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
    alert("Registration Failed");
    console.error(error);
  }
};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Register
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="Enter First Name"
                  value={user.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Enter Last Name"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </div>

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
                Register
              </button>

               <p className="text-center mt-3">
                  Already have an account? <Link to="/login">Login</Link>
               </p>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

function Profile() {

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
     const navigate = useNavigate();

   useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        navigate("/login");

        return;

    }

    loadProfile();

}, []);

const loadProfile = async () => {

    try {

        const response = await getProfile();

        setProfile(response.data);

    } catch (error) {

        console.error(error);

    }

};
const handleUpdate = async () => {

    try {

        const response = await updateProfile(profile);

        alert(response.data);

    } catch (error) {

        alert("Failed to update profile");

        console.error(error);

    }

};
    return (

        <div className="container mt-5">

            <h2>My Profile</h2>

            <div className="mb-3">

                <label>First Name</label>

                <input
                   type="text"
                   className="form-control"
                   value={profile.firstName}
                   onChange={(e) =>
                   setProfile({
                        ...profile,
                          firstName: e.target.value
                       })
                   }
                />

            </div>

            <div className="mb-3">

                <label>Last Name</label>

                <input
                   type="text"
                   className="form-control"
                   value={profile.lastName}
                   onChange={(e) =>
                   setProfile({
                     ...profile,
                      lastName: e.target.value
                   })
                   }
                />

            </div>

            <div className="mb-3">

                <label>Email</label>

                <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    readOnly
                />

            </div>

            <button
    className="btn btn-primary"
    onClick={handleUpdate}
>
    Update Profile
</button>

        </div>

    );

}

export default Profile;
import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    addCredential,
    getCredentials,
    updateCredential,
    deleteCredentialById,
     generatePassword,
    shareCredential,
    getSharedCredentials
} from "../../services/VaultService";

function Dashboard() {

    const [credential, setCredential] = useState({
        website: "",
        url: "",
        username: "",
        password: "",
        notes: ""
    });

    const [credentials, setCredentials] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [strength, setStrength] = useState("");
    const [showShare, setShowShare] = useState(false);

const [shareData, setShareData] = useState({
    credentialId: "",
    email: "",
    permission: "READ"
});

const [sharedCredentials, setSharedCredentials] = useState([]);
    const navigate = useNavigate();

   const handleChange = (e) => {

    const { name, value } = e.target;

    setCredential({
        ...credential,
        [name]: value
    });

    if (name === "password") {

        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[@$!%*?&]/.test(value)) score++;

        if (score <= 2)
            setStrength("Weak");
        else if (score <= 4)
            setStrength("Medium");
        else
            setStrength("Strong");
    }

};

    const handleLogout = () => {

    localStorage.removeItem("token");

    alert("Logged out successfully");

    navigate("/login");

};

   const handleGeneratePassword = async () => {

    try {

        const response = await generatePassword(12);

        setCredential({
            ...credential,
            password: response.data
        });

        setStrength("Strong");

    } catch (error) {

        console.error(error);

        alert("Failed to generate password");

    }

};
    const deleteCredential = async (id) => {

    try {

        await deleteCredentialById(id);

        alert("Credential deleted successfully");

        loadCredentials();

    } catch(error) {

        console.error(error);
        alert("Delete failed");

    }

};

const handleShare = async () => {

    try {

        await shareCredential(shareData);

        alert("Credential Shared Successfully");

        setShowShare(false);

        setShareData({
            credentialId: "",
            email: "",
            permission: "READ"
        });

    } catch (error) {

        console.error(error);

        alert("Failed to share credential");

    }

};

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if(isEdit){

    await updateCredential({
        ...credential,
        id: editId
    });

    alert("Credential Updated Successfully");

}
else{

    await addCredential(credential);

    alert("Credential Saved Successfully");

}


        setCredential({
    website: "",
    url: "",
    username: "",
    password: "",
    notes: ""
});
   setStrength("");

loadCredentials();
    } catch (error) {

        alert("Failed to Save Credential");
        console.error(error);

    }

};

 const loadCredentials = async () => {

    try {

        const response = await getCredentials();

        console.log("Credentials:", response.data);

        setCredentials(response.data);

        const sharedResponse = await getSharedCredentials();

        setSharedCredentials(sharedResponse.data);

    } catch (error) {

        console.log(error.response);
        console.log(error.response?.status);
        console.log(error.response?.data);

    }

};

const editCredential = (item) => {

    setCredential(item);

    setIsEdit(true);

    setEditId(item.id);

};

 useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please login first");

        navigate("/login");

        return;

    }

    loadCredentials();
    setShowForm(false);
    setIsEdit(false);
    setEditId(null);

}, []);


    return (
       <div className="container mt-5">
    <div className="card shadow-lg p-4">

            <div className="d-flex justify-content-between align-items-center mb-3">

    <h2 className="dashboard-title">
    🔐 Password Vault Dashboard
</h2>

    <button
        className="btn btn-danger logout-btn"
        onClick={handleLogout}
    >
        Logout
    </button>

</div>
  
  <div className="mb-4 text-center">
    <button
        className="btn btn-success"
       onClick={() => {
    setCredential({
        website: "",
        url: "",
        username: "",
        password: "",
        notes: ""
    });

    setStrength("");

    setIsEdit(false);
    setEditId(null);
    setShowForm(true);
}}
    >
        + Add Credential
    </button>
</div>

            {showForm && (
<form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Website</label>
                    <input
                       type="text"
                       name="website"
                       className="form-control"
                       value={credential.website}
                       onChange={handleChange}
                       placeholder="Enter website name"
                     />
                </div>

                <div className="mb-3">
                    <label>Website URL</label>
                    <input
                        type="text"
                        name="url"
                        className="form-control"
                        value={credential.url}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                    />
                </div>

                <div className="mb-3">
                    <label>Username</label>
                    <input
                       type="text"
                       name="username"
                       className="form-control"
                       value={credential.username}
                       onChange={handleChange}
                       placeholder="Enter username"
                    />
                </div>

               <div className="mb-3">
    <label>Password</label>

    <div className="d-flex gap-2">

        <input
            type="text"
            name="password"
            className="form-control"
            value={credential.password}
            onChange={handleChange}
            placeholder="Enter password"
        />

        <button
            type="button"
            className="btn btn-success"
            onClick={handleGeneratePassword}
        >
            Generate
        </button>

    </div>

    <div className="mt-2">

        <strong>Password Strength : </strong>

        <span
            style={{
                color:
                    strength === "Strong"
                        ? "green"
                        : strength === "Medium"
                        ? "orange"
                        : "red"
            }}
        >
            {strength}
        </span>

    </div>

</div>

        

                <div className="mb-3">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      value={credential.notes}
                      onChange={handleChange}
                      placeholder="Enter any notes"
                    />
                </div>

                <div className="d-flex gap-2">

<button className="btn btn-primary w-100">
    {isEdit ? "Update Credential" : "Save Credential"}
</button>

<button
    type="button"
    className="btn btn-secondary w-100"
    onClick={() => {
    setShowForm(false);

    setCredential({
        website: "",
        url: "",
        username: "",
        password: "",
        notes: ""
    });

    setStrength("");

    setIsEdit(false);
    setEditId(null);
}}
>
    Cancel
</button>

</div>

            </form>
            )}

{showShare && (

<div className="card p-3 mt-4 mb-4 border">

    <h4>Share Credential</h4>

    <div className="mb-3">

        <label>User Email</label>

        <input
            type="email"
            className="form-control"
            value={shareData.email}
            onChange={(e) =>
                setShareData({
                    ...shareData,
                    email: e.target.value
                })
            }
        />

    </div>

    <div className="mb-3">

        <label>Permission</label>

        <select
            className="form-control"
            value={shareData.permission}
            onChange={(e) =>
                setShareData({
                    ...shareData,
                    permission: e.target.value
                })
            }
        >

            <option value="READ">READ</option>
            <option value="WRITE">WRITE</option>

        </select>

    </div>

    <div className="d-flex gap-2">

        <button
            className="btn btn-primary"
            onClick={handleShare}
        >
            Share
        </button>

        <button
            className="btn btn-secondary"
            onClick={() => setShowShare(false)}
        >
            Cancel
        </button>

    </div>

</div>

)}

<hr className="my-5" />

<h3>Saved Credentials</h3>

<table className="table table-hover table-bordered mt-3">

    <thead>

        <tr>

            <th>ID</th>
            <th>Website</th>
            <th>URL</th>
            <th>Username</th>
            <th>Password</th>
            <th>Notes</th>
            <th>Actions</th>

        </tr>

    </thead>

    <tbody>

        {credentials.map((item) => (

            <tr key={item.id}>

                <td>{item.id}</td>
                <td>{item.website}</td>
                <td>{item.url}</td>
                <td>{item.username}</td>
                <td>{item.password}</td>
                <td>{item.notes}</td>

<td>
    <button
        className="btn btn-warning btn-sm me-2"
        onClick={() => editCredential(item)}
    >
        Edit
    </button>
    <button
    className="btn btn-danger btn-sm"
    onClick={() => deleteCredential(item.id)}
>
    Delete
</button>
<button
    className="btn btn-info btn-sm ms-2"
    onClick={() => {

        setShareData({
            credentialId: item.id,
            email: "",
            permission: "READ"
        });

        setShowShare(true);

    }}
>
    Share
</button>
</td>

            </tr>

        ))}

    </tbody>

</table>

 <hr className="my-5" />

<h3>Shared With Me</h3>

<table className="table table-bordered table-hover">

    <thead>

    <tr>

        <th>ID</th>
        <th>Website</th>
        <th>Username</th>
        <th>Permission</th>

    </tr>

    </thead>

    <tbody>

    {sharedCredentials.map((item) => (

        <tr key={item.id}>

            <td>{item.id}</td>

            <td>{item.credential.website}</td>

            <td>{item.credential.username}</td>

            <td>
    <span
        className={
            item.permission === "WRITE"
                ? "badge bg-success"
                : "badge bg-warning text-dark"
        }
    >
        {item.permission}
    </span>
</td>
        </tr>

    ))}

    </tbody>

</table>
        </div>
        </div>
        
    );
}

export default Dashboard;
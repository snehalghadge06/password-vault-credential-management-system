
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    addCredential, 
    getCredentials,
    updateCredential,
    deleteCredentialById
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredential({
            ...credential,
            [e.target.name]: e.target.value
        });
    };

    const handleLogout = () => {

    localStorage.removeItem("token");

    alert("Logged out successfully");

    navigate("/login");

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

loadCredentials();
    } catch (error) {

        alert("Failed to Save Credential");
        console.error(error);

    }

};

 const loadCredentials = async () => {

    try {

        const response = await getCredentials();

        setCredentials(response.data);

    } catch (error) {

        console.error(error);

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

}, []);


    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-3">

    <h2>Password Vault</h2>

    <button
        className="btn btn-danger"
        onClick={handleLogout}
    >
        Logout
    </button>

</div>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Website</label>
                    <input
                       type="text"
                       name="website"
                       className="form-control"
                       value={credential.website}
                       onChange={handleChange}
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
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={credential.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      value={credential.notes}
                      onChange={handleChange}
                    />
                </div>

                <button className="btn btn-primary">
                    {isEdit ? "Update Credential" : "Save Credential"}
                </button>

            </form>

<hr className="my-5" />

<h3>Saved Credentials</h3>

<table className="table table-bordered table-striped mt-3">

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
    onClick={async () => {

    await deleteCredentialById(item.id);

    loadCredentials();

}}
>
    Delete
</button>
</td>

            </tr>

        ))}

    </tbody>

</table>
        </div>
    );
}

export default Dashboard;
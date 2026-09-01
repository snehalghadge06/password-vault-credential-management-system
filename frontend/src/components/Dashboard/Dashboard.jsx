import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginActivity from "../LoginActivity/LoginActivity";

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

    // ===============================
    // EMPTY CREDENTIAL
    // ===============================

    const emptyCredential = {
        website: "",
        url: "",
        username: "",
        password: "",
        notes: ""
    };

    // ===============================
    // STATES
    // ===============================

    const [credential, setCredential] = useState(emptyCredential);
    const [credentials, setCredentials] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sharedCredentials, setSharedCredentials] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const [strength, setStrength] = useState("");
    const [showPasswords, setShowPasswords] = useState({});

    // Security menu
    const [showSecurityMenu, setShowSecurityMenu] = useState(false);

    // Login Activity page
    const [showLoginActivity, setShowLoginActivity] = useState(false);

    const [shareData, setShareData] = useState({
        credentialId: "",
        email: "",
        permission: "READ"
    });

    const navigate = useNavigate();

    // ===============================
    // INPUT CHANGE
    // ===============================

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

            if (!value) {
                setStrength("");
            } else if (score <= 2) {
                setStrength("Weak");
            } else if (score <= 4) {
                setStrength("Medium");
            } else {
                setStrength("Strong");
            }
        }
    };

    // ===============================
    // PASSWORD STRENGTH
    // ===============================

    const getStrengthClass = () => {

        if (strength === "Strong") return "strength-strong";
        if (strength === "Medium") return "strength-medium";
        if (strength === "Weak") return "strength-weak";

        return "";
    };

    // ===============================
    // LOGOUT
    // ===============================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    // ===============================
    // GENERATE PASSWORD
    // ===============================

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

    // ===============================
    // LOAD CREDENTIALS
    // ===============================

    const loadCredentials = async () => {

        try {

            const response = await getCredentials();

            setCredentials(response.data);

            const sharedResponse = await getSharedCredentials();

            console.log(
                "SHARED CREDENTIALS:",
                sharedResponse.data
            );

            setSharedCredentials(sharedResponse.data);

        } catch (error) {

            console.error(error);
        }
    };

    // ===============================
    // DELETE
    // ===============================

    const deleteCredential = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this credential?"
        );

        if (!confirmed) return;

        try {

            await deleteCredentialById(id);

            alert("Credential deleted successfully");

            loadCredentials();

        } catch (error) {

            console.error(error);

            alert("Delete failed");
        }
    };

    // ===============================
    // EDIT
    // ===============================

    const editCredential = (item) => {

        setCredential({
            website: item.website || "",
            url: item.url || "",
            username: item.username || "",
            password: item.password || "",
            notes: item.notes || ""
        });

        setIsEdit(true);
        setEditId(item.id);
        setShowForm(true);

        setStrength("Strong");
    };

    // ===============================
    // SUBMIT
    // ===============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (isEdit) {

                await updateCredential({
                    ...credential,
                    id: editId
                });

                alert("Credential updated successfully");

            } else {

                await addCredential(credential);

                alert("Credential saved successfully");
            }

            resetForm();

            loadCredentials();

        } catch (error) {

            console.error(error);

            alert("Failed to save credential");
        }
    };

    // ===============================
    // RESET FORM
    // ===============================

    const resetForm = () => {

        setCredential(emptyCredential);

        setStrength("");

        setIsEdit(false);

        setEditId(null);

        setShowForm(false);
    };

    // ===============================
    // SHARE
    // ===============================

    const openShare = (id) => {

        setShareData({
            credentialId: id,
            email: "",
            permission: "READ"
        });

        setShowShare(true);
    };

    const handleShare = async () => {

        if (!shareData.email) {

            alert("Please enter user email");

            return;
        }

        try {

            await shareCredential(shareData);

            alert("Credential shared successfully");

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

    // ===============================
    // PASSWORD VISIBILITY
    // ===============================

    const togglePassword = (id) => {

        setShowPasswords({
            ...showPasswords,
            [id]: !showPasswords[id]
        });
    };

    // ===============================
    // FILTER
    // ===============================

    const filteredCredentials = credentials.filter((item) => {

        const search = searchTerm.toLowerCase();

        return (
            item.website?.toLowerCase().includes(search) ||
            item.username?.toLowerCase().includes(search) ||
            item.url?.toLowerCase().includes(search)
        );
    });

    // ===============================
    // OPEN DASHBOARD
    // ===============================

    const openDashboard = () => {

        setShowLoginActivity(false);
    };

    // ===============================
    // OPEN LOGIN ACTIVITY
    // ===============================

    const openLoginActivity = () => {

        setShowLoginActivity(true);
        setShowSecurityMenu(true);
    };

    // ===============================
    // INITIAL LOAD
    // ===============================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;
        }

        loadCredentials();

    }, []);

    // ===============================
    // RETURN
    // ===============================

    return (

        <div className="dashboard-layout">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="sidebar">

                {/* BRAND */}

                <div className="brand">

                    <div className="brand-icon">
                        🔐
                    </div>

                    <div>

                        <h2>PasswordVault</h2>

                        <span>
                            Secure Manager
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    {/* DASHBOARD */}

                    <div
                        className={`nav-item ${
                            !showLoginActivity ? "active" : ""
                        }`}
                        onClick={openDashboard}
                    >

                        <span>
                            ▦
                        </span>

                        Dashboard

                    </div>


                    {/* MY CREDENTIALS */}

                    <div
                        className="nav-item"
                        onClick={() => {

                            setShowLoginActivity(false);

                            setTimeout(() => {

                                document
                                    .getElementById("credentials-section")
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    });

                            }, 50);

                        }}
                    >

                        <span>
                            🔑
                        </span>

                        My Credentials

                    </div>


                    {/* SHARED WITH ME */}

                    <div
                        className="nav-item"
                        onClick={() => {

                            setShowLoginActivity(false);

                            setTimeout(() => {

                                document
                                    .getElementById("shared-section")
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    });

                            }, 50);

                        }}
                    >

                        <span>
                            🤝
                        </span>

                        Shared With Me

                    </div>


                    {/* =================================================
                        SECURITY DROPDOWN
                    ================================================= */}

                    <div
                        className="nav-item security-nav-item"
                        onClick={() =>
                            setShowSecurityMenu(
                                !showSecurityMenu
                            )
                        }
                    >

                        <span>
                            🛡️
                        </span>

                        <span className="security-title">
                            Security
                        </span>

                        <span className="dropdown-arrow">
                            {showSecurityMenu
                                ? "▲"
                                : "▼"
                            }
                        </span>

                    </div>


                    {/* SECURITY SUBMENU */}

                    {showSecurityMenu && (

                        <div className="security-submenu">

                            <div
                                className={`security-subitem ${
                                    showLoginActivity
                                        ? "security-subitem-active"
                                        : ""
                                }`}
                                onClick={(e) => {

                                    e.stopPropagation();

                                    openLoginActivity();

                                }}
                            >

                                🔐 Login Activity

                            </div>

                        </div>

                    )}

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <div className="security-box">

                        <div className="security-icon">
                            🛡️
                        </div>

                        <div>

                            <strong>
                                Vault Protected
                            </strong>

                            <small>
                                Your credentials are secure
                            </small>

                        </div>

                    </div>


                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >

                        ↪ Logout

                    </button>

                </div>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="main-content">

                {showLoginActivity ? (

                    /* =================================================
                       LOGIN ACTIVITY PAGE
                    ================================================= */

                    <LoginActivity />

                ) : (

                    /* =================================================
                       DASHBOARD PAGE
                    ================================================= */

                    <>

                        {/* HEADER */}

                        <header className="top-header">

                            <div>

                                <h1>
                                    Dashboard
                                </h1>

                                <p>
                                    Manage your credentials securely
                                    in one place.
                                </p>

                            </div>


                            <div className="user-profile">

                                <div className="avatar">
                                    S
                                </div>

                                <div>

                                    <strong>
                                        User
                                    </strong>

                                    <small>
                                        Secure Account
                                    </small>

                                </div>

                            </div>

                        </header>


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <section className="stats-grid">

                            {/* TOTAL */}

                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    🔐
                                </div>

                                <div>

                                    <span>
                                        Total Credentials
                                    </span>

                                    <strong>
                                        {credentials.length}
                                    </strong>

                                </div>

                            </div>


                            {/* SHARED */}

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    🤝
                                </div>

                                <div>

                                    <span>
                                        Shared Credentials
                                    </span>

                                    <strong>
                                        {sharedCredentials.length}
                                    </strong>

                                </div>

                            </div>


                            {/* SECURITY */}

                            <div className="stat-card">

                                <div className="stat-icon green">
                                    🛡️
                                </div>

                                <div>

                                    <span>
                                        Security Status
                                    </span>

                                    <strong className="secure-text">
                                        Protected
                                    </strong>

                                </div>

                            </div>


                            {/* PASSWORD MANAGER */}

                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    🔑
                                </div>

                                <div>

                                    <span>
                                        Password Manager
                                    </span>

                                    <strong>
                                        Active
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            MY CREDENTIALS
                        ================================================= */}

                        <section
                            className="content-card"
                            id="credentials-section"
                        >

                            <div className="section-header">

                                <div>

                                    <h2>
                                        My Credentials
                                    </h2>

                                    <p>
                                        Securely manage your saved
                                        login credentials.
                                    </p>

                                </div>


                                <button
                                    className="add-btn"
                                    onClick={() => {

                                        resetForm();

                                        setShowForm(true);

                                    }}
                                >

                                    + Add Credential

                                </button>

                            </div>


                            {/* SEARCH */}

                            <div className="search-container">

                                <span>
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search by website, username or URL..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* TABLE */}

                            <div className="table-wrapper">

                                <table className="credentials-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Website
                                            </th>

                                            <th>
                                                Username
                                            </th>

                                            <th>
                                                Password
                                            </th>

                                            <th>
                                                Notes
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredCredentials.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="empty-state"
                                                >

                                                    🔐 No credentials found

                                                </td>

                                            </tr>

                                        ) : (

                                            filteredCredentials.map(
                                                (item) => (

                                                    <tr
                                                        key={item.id}
                                                    >

                                                        <td>

                                                            <div className="website-cell">

                                                                <div className="website-icon">
                                                                    🌐
                                                                </div>

                                                                <div>

                                                                    <strong>
                                                                        {item.website}
                                                                    </strong>

                                                                    <small>
                                                                        {item.url}
                                                                    </small>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {item.username}
                                                        </td>


                                                        <td>

                                                            <div className="password-cell">

                                                                <span>

                                                                    {showPasswords[item.id]
                                                                        ? item.password
                                                                        : "••••••••"
                                                                    }

                                                                </span>


                                                                <button
                                                                    className="eye-btn"
                                                                    onClick={() =>
                                                                        togglePassword(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >

                                                                    {showPasswords[item.id]
                                                                        ? "🙈"
                                                                        : "👁️"
                                                                    }

                                                                </button>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="notes-text">

                                                                {item.notes ||
                                                                    "—"}

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="action-buttons">

                                                                <button
                                                                    className="action edit"
                                                                    onClick={() =>
                                                                        editCredential(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    ✏
                                                                </button>


                                                                <button
                                                                    className="action delete"
                                                                    onClick={() =>
                                                                        deleteCredential(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    🗑
                                                                </button>


                                                                <button
                                                                    className="action share"
                                                                    onClick={() =>
                                                                        openShare(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    ↗
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>


                        {/* =================================================
                            SHARED WITH ME
                        ================================================= */}

                        <section
                            className="content-card"
                            id="shared-section"
                        >

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Shared With Me
                                    </h2>

                                    <p>
                                        Credentials shared with
                                        your account.
                                    </p>

                                </div>


                                <div className="shared-count">

                                    {sharedCredentials.length}
                                    {" "}Shared

                                </div>

                            </div>


                            <div className="table-wrapper">

                                <table className="credentials-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Website
                                            </th>

                                            <th>
                                                Username
                                            </th>

                                            <th>
                                                Permission
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {sharedCredentials.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="3"
                                                    className="empty-state"
                                                >

                                                    🤝 No credentials have
                                                    been shared with you.

                                                </td>

                                            </tr>

                                        ) : (

                                            sharedCredentials.map(
                                                (item) => (

                                                    <tr
                                                        key={item.id}
                                                    >

                                                        <td>

                                                            <div className="website-cell">

                                                                <div className="website-icon">
                                                                    🌐
                                                                </div>

                                                                <strong>
                                                                    {item.credential?.website}
                                                                </strong>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {item.credential?.username}
                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    item.permission ===
                                                                    "WRITE"

                                                                        ? "permission write"

                                                                        : item.permission ===
                                                                          "FULL_MANAGEMENT"

                                                                            ? "permission full-management"

                                                                            : "permission read"
                                                                }
                                                            >

                                                                {item.permission ===
                                                                "FULL_MANAGEMENT"

                                                                    ? "FULL MANAGEMENT"

                                                                    : item.permission}

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <footer className="dashboard-footer">

                            <span>
                                🔐 PasswordVault
                            </span>

                            <span>
                                Secure Credential Management System
                            </span>

                        </footer>

                    </>

                )}

            </main>


            {/* =========================================================
                ADD / EDIT MODAL
            ========================================================= */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal-box">

                        <div className="modal-header">

                            <div>

                                <h2>

                                    {isEdit
                                        ? "Edit Credential"
                                        : "Add New Credential"}

                                </h2>

                                <p>
                                    Store your login information securely.
                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={resetForm}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label>
                                    Website Name
                                </label>

                                <input
                                    type="text"
                                    name="website"
                                    value={credential.website}
                                    onChange={handleChange}
                                    placeholder="e.g. Google"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Website URL
                                </label>

                                <input
                                    type="url"
                                    name="url"
                                    value={credential.url}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Username / Email
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={credential.username}
                                    onChange={handleChange}
                                    placeholder="Enter username or email"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <div className="password-input-group">

                                    <input
                                        type="password"
                                        name="password"
                                        value={credential.password}
                                        onChange={handleChange}
                                        placeholder="Enter secure password"
                                        required
                                    />


                                    <button
                                        type="button"
                                        className="generate-btn"
                                        onClick={
                                            handleGeneratePassword
                                        }
                                    >

                                        ✨ Generate

                                    </button>

                                </div>


                                {strength && (

                                    <div className="strength-container">

                                        <div className="strength-header">

                                            <span>
                                                Password Strength
                                            </span>

                                            <strong
                                                className={
                                                    getStrengthClass()
                                                }
                                            >
                                                {strength}
                                            </strong>

                                        </div>


                                        <div className="strength-bar">

                                            <div
                                                className={`strength-fill ${getStrengthClass()}`}
                                            >
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>


                            <div className="form-group">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={credential.notes}
                                    onChange={handleChange}
                                    placeholder="Add any additional notes..."
                                    rows="3"
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                >

                                    {isEdit
                                        ? "Update Credential"
                                        : "Save Credential"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================================================
                SHARE MODAL
            ========================================================= */}

            {showShare && (

                <div className="modal-overlay">

                    <div className="modal-box share-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Share Credential
                                </h2>

                                <p>
                                    Give another user secure access.
                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowShare(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="form-group">

                            <label>
                                User Email
                            </label>

                            <input
                                type="email"
                                value={shareData.email}
                                onChange={(e) =>
                                    setShareData({
                                        ...shareData,
                                        email: e.target.value
                                    })
                                }
                                placeholder="Enter recipient email"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Permission
                            </label>

                            <select
                                value={shareData.permission}
                                onChange={(e) =>
                                    setShareData({
                                        ...shareData,
                                        permission: e.target.value
                                    })
                                }
                            >

                                <option value="READ">
                                    READ - View Credential
                                </option>

                                <option value="WRITE">
                                    WRITE - Edit Credential
                                </option>

                                <option value="FULL_MANAGEMENT">
                                    FULL MANAGEMENT - Full Access
                                </option>

                            </select>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setShowShare(false)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleShare}
                            >
                                🤝 Share Credential
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;
import "./DashboardLayout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function DashboardLayout() {

    const navigate = useNavigate();
    const location = useLocation();

    const [securityOpen, setSecurityOpen] = useState(
    location.pathname === "/login-activity" ||
    location.pathname === "/suspicious-activity" ||
    location.pathname === "/security-alerts" ||
    location.pathname === "/security-analytics" ||
    location.pathname === "/reports"
);

    const isDashboard =
        location.pathname === "/dashboard";

    const isLoginActivity =
        location.pathname === "/login-activity";

    const isSuspiciousActivity =
    location.pathname === "/suspicious-activity";

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    const openCredentials = () => {

        navigate("/dashboard");

        setTimeout(() => {

            document
                .getElementById("credentials-section")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }, 100);

    };

    const openShared = () => {

        navigate("/dashboard");

        setTimeout(() => {

            document
                .getElementById("shared-section")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }, 100);

    };

    return (

        <div className="dashboard-layout">

            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

                {/* ================= BRAND ================= */}

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


                {/* ================= NAVIGATION ================= */}

                <nav className="sidebar-nav">

                    {/* DASHBOARD */}

                    <div
                        className={`nav-item ${
                            isDashboard ? "active" : ""
                        }`}
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <span>▦</span>

                        Dashboard

                    </div>


                    {/* MY CREDENTIALS */}

                    <div
                        className="nav-item"
                        onClick={openCredentials}
                    >

                        <span>🔑</span>

                        My Credentials

                    </div>


                    {/* SHARED WITH ME */}

                    <div
                        className="nav-item"
                        onClick={openShared}
                    >

                        <span>🤝</span>

                        Shared With Me

                    </div>


                    {/* ================= SECURITY ================= */}

<div className="security-menu">

    <div
        className={`nav-item security-nav-item ${
            isLoginActivity ? "security-active" : ""
        }`}
        onClick={() =>
            setSecurityOpen(!securityOpen)
        }
    >

        <span>🛡️</span>

        <span className="security-title">
            Security
        </span>

        <span className="security-arrow">
            {securityOpen ? "▲" : "▼"}
        </span>

    </div>


    {/* ================= SECURITY SUBMENU ================= */}

    {securityOpen && (

        <div className="security-submenu">

            <div
                className={`security-subitem ${
                    isLoginActivity
                        ? "security-subitem-active"
                        : ""
                }`}
                onClick={() =>
                    navigate("/login-activity")
                }
            >

                <span>🔐</span>

                Login Activity

            </div>


            <div
    className={`security-subitem ${
        isSuspiciousActivity
            ? "security-subitem-active"
            : ""
    }`}
    onClick={() =>
        navigate("/suspicious-activity")
    }
>

    <span>⚠️</span>

    Suspicious Activity

</div>

            <div
    className={`security-subitem ${
        location.pathname === "/security-alerts"
            ? "security-subitem-active"
            : ""
    }`}
    onClick={() =>
        navigate("/security-alerts")
    }
>

    <span>🚨</span>

    Security Alerts

   </div>


            <div
    className={`security-subitem ${
        location.pathname === "/security-analytics"
            ? "security-subitem-active"
            : ""
    }`}
    onClick={() =>
        navigate("/security-analytics")
    }
>

    <span>📊</span>

    Security Analytics

</div>


            <div
    className={`security-subitem ${
        location.pathname === "/reports"
            ? "security-subitem-active"
            : ""
    }`}
    onClick={() =>
        navigate("/reports")
    }
>

    <span>📄</span>

    Reports

</div>

        </div>

    )}

</div>
                </nav>


                {/* ================= SIDEBAR BOTTOM ================= */}

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


            {/* ================= MAIN CONTENT ================= */}

            <main className="main-content">

                <Outlet />

            </main>

        </div>
    );
}

export default DashboardLayout;
import "./LoginActivity.css";
import { useEffect, useState } from "react";
import axios from "axios";

function LoginActivity() {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadLoginActivities = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:8081/api/security/login-activity",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setActivities(response.data);

            } catch (error) {

                console.error(
                    "Failed to load login activities:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadLoginActivities();

    }, []);

    return (
        <div className="login-activity-page">

            {/* ================= HEADER ================= */}

            <div className="login-activity-header">

                <div>
                    <h1>Login Activity</h1>

                    <p>
                        Monitor your recent login attempts and
                        security activity.
                    </p>
                </div>

                <div className="activity-summary">

                    <div className="activity-summary-icon">
                        🔐
                    </div>

                    <div>
                        <span>Total Attempts</span>

                        <strong>
                            {activities.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* ================= CONTENT CARD ================= */}

            <div className="login-activity-card">

                <div className="login-activity-card-header">

                    <div>

                        <h2>Recent Login Attempts</h2>

                        <p>
                            Review successful and failed login
                            attempts for your account.
                        </p>

                    </div>

                    <div className="activity-count">

                        {activities.length}{" "}
                        {activities.length === 1
                            ? "Attempt"
                            : "Attempts"}

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="login-activity-state">

                        <div className="loading-spinner"></div>

                        <span>
                            Loading login activity...
                        </span>

                    </div>

                ) : activities.length === 0 ? (

                    /* ================= EMPTY ================= */

                    <div className="login-activity-state">

                        <div className="empty-icon">
                            🔐
                        </div>

                        <strong>
                            No Login Activity
                        </strong>

                        <span>
                            No login attempts have been recorded yet.
                        </span>

                    </div>

                ) : (

                    /* ================= TABLE ================= */

                    <div className="login-table-wrapper">

                        <table className="login-activity-table">

                            <thead>

                                <tr>

                                    <th>EMAIL</th>

                                    <th>STATUS</th>

                                    <th>LOGIN TIME</th>

                                    <th>IP ADDRESS</th>

                                    <th>FAILURE REASON</th>

                                </tr>

                            </thead>


                            <tbody>

                                {activities.map((activity, index) => {

                                    const isSuccess =
                                        activity.status === "SUCCESS";

                                    return (

                                        <tr
                                            key={
                                                activity.id ||
                                                index
                                            }
                                        >

                                            {/* EMAIL */}

                                            <td>

                                                <div className="email-cell">

                                                    <div className="email-avatar">
                                                        {activity.email
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "U"}
                                                    </div>

                                                    <div className="email-details">

                                                        <strong>
                                                            {activity.email ||
                                                                "Unknown"}
                                                        </strong>

                                                        <small>
                                                            Login attempt
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        isSuccess
                                                            ? "login-status success"
                                                            : "login-status failed"
                                                    }
                                                >

                                                    <span className="status-dot"></span>

                                                    {isSuccess
                                                        ? "SUCCESS"
                                                        : "FAILED"}

                                                </span>

                                            </td>


                                            {/* LOGIN TIME */}

                                            <td>

                                                <div className="login-time">

                                                    <strong>
                                                        {activity.loginTime
                                                            ? new Date(
                                                                activity.loginTime
                                                            ).toLocaleDateString()
                                                            : "—"}
                                                    </strong>

                                                    <small>
                                                        {activity.loginTime
                                                            ? new Date(
                                                                activity.loginTime
                                                            ).toLocaleTimeString()
                                                            : ""}
                                                    </small>

                                                </div>

                                            </td>


                                            {/* IP ADDRESS */}

                                            <td>

                                                <span className="ip-address">

                                                    {activity.ipAddress ||
                                                        "—"}

                                                </span>

                                            </td>


                                            {/* FAILURE REASON */}

                                            <td>

                                                {activity.failureReason ? (

                                                    <span className="failure-reason">

                                                        {activity.failureReason}

                                                    </span>

                                                ) : (

                                                    <span className="no-failure">
                                                        —
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default LoginActivity;
import "./SuspiciousActivity.css";
import { useEffect, useState } from "react";
import axios from "axios";

function SuspiciousActivity() {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadSuspiciousActivities = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:8081/api/security/suspicious-activity",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setActivities(response.data);

            } catch (error) {

                console.error(
                    "Failed to load suspicious activities:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadSuspiciousActivities();

    }, []);

    return (
        <div className="suspicious-activity-page">

            {/* ================= HEADER ================= */}

            <div className="suspicious-header">

                <div>

                    <h1>Suspicious Activity</h1>

                    <p>
                        Monitor unusual and potentially suspicious
                        security activities.
                    </p>

                </div>

                <div className="suspicious-summary">

                    <div className="suspicious-summary-icon">
                        ⚠️
                    </div>

                    <div>

                        <span>Suspicious Activities</span>

                        <strong>
                            {activities.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= CONTENT CARD ================= */}

            <div className="suspicious-card">

                <div className="suspicious-card-header">

                    <div>

                        <h2>Detected Suspicious Activities</h2>

                        <p>
                            Review suspicious activities detected
                            by the security monitoring system.
                        </p>

                    </div>

                    <div className="suspicious-count">

                        {activities.length}{" "}
                        {activities.length === 1
                            ? "Activity"
                            : "Activities"}

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="suspicious-state">

                        <div className="loading-spinner"></div>

                        <span>
                            Loading suspicious activities...
                        </span>

                    </div>

                ) : activities.length === 0 ? (

                    /* ================= EMPTY ================= */

                    <div className="suspicious-state">

                        <div className="empty-icon">
                            🛡️
                        </div>

                        <strong>
                            No Suspicious Activity
                        </strong>

                        <span>
                            No suspicious activities have been
                            detected yet.
                        </span>

                    </div>

                ) : (

                    /* ================= TABLE ================= */

                    <div className="suspicious-table-wrapper">

                        <table className="suspicious-table">

                            <thead>

                                <tr>

                                    <th>EMAIL</th>
                                    <th>ACTIVITY TYPE</th>
                                    <th>FAILED ATTEMPTS</th>
                                    <th>IP ADDRESS</th>
                                    <th>DETECTED AT</th>
                                    <th>STATUS</th>

                                </tr>

                            </thead>

                            <tbody>

                                {activities.map((activity, index) => (

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
                                                        Suspicious activity
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* ACTIVITY TYPE */}

                                        <td>

                                            <span className="activity-type">

                                                ⚠️{" "}
                                                {activity.activityType ||
                                                    "Unknown"}

                                            </span>

                                        </td>


                                        {/* FAILED ATTEMPTS */}

                                        <td>

                                            <span className="failed-attempts">

                                                {activity.failedAttempts}

                                            </span>

                                        </td>


                                        {/* IP ADDRESS */}

                                        <td>

                                            <span className="ip-address">

                                                {activity.ipAddress ||
                                                    "—"}

                                            </span>

                                        </td>


                                        {/* DETECTED AT */}

                                        <td>

                                            <div className="detected-time">

                                                <strong>

                                                    {activity.detectedAt
                                                        ? new Date(
                                                            activity.detectedAt
                                                        ).toLocaleDateString()
                                                        : "—"}

                                                </strong>

                                                <small>

                                                    {activity.detectedAt
                                                        ? new Date(
                                                            activity.detectedAt
                                                        ).toLocaleTimeString()
                                                        : ""}

                                                </small>

                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span className="activity-status">

                                                <span className="status-dot"></span>

                                                {activity.status ||
                                                    "OPEN"}

                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default SuspiciousActivity;
import "./Reports.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {

    const [passwordHealth, setPasswordHealth] = useState(null);
    const [loginActivities, setLoginActivities] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadReports = async () => {

            try {

                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const passwordResponse = await axios.get(
                    "http://localhost:8081/api/security/reports/password-health",
                    config
                );

                const loginResponse = await axios.get(
                    "http://localhost:8081/api/security/login-activity",
                    config
                );

                setPasswordHealth(passwordResponse.data);
                setLoginActivities(loginResponse.data);

            } catch (error) {

                console.error(
                    "Failed to load reports:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadReports();

    }, []);

    if (loading) {

        return (
            <div className="reports-state">
                Loading security reports...
            </div>
        );
    }

    if (!passwordHealth) {

        return (
            <div className="reports-state">
                Unable to load reports.
            </div>
        );
    }

    const successfulLogins =
        loginActivities.filter(
            activity => activity.status === "SUCCESS"
        ).length;

    const failedLogins =
        loginActivities.filter(
            activity => activity.status === "FAILED"
        ).length;

    return (

        <div className="reports-page">

            {/* ================= HEADER ================= */}

            <div className="reports-header">

                <div>

                    <h1>Security Reports</h1>

                    <p>
                        Review password health and login
                        activity reports.
                    </p>

                </div>

            </div>


            {/* ================= PASSWORD HEALTH ================= */}

            <div className="report-section">

                <div className="report-section-header">

                    <div>

                        <h2>
                            🔐 Password Health
                        </h2>

                        <p>
                            Overview of the strength of your
                            stored passwords.
                        </p>

                    </div>

                    <div className="health-score">

                        <span>
                            Health Score
                        </span>

                        <strong>
                            {passwordHealth.healthScore}%
                        </strong>

                    </div>

                </div>


                <div className="password-health-grid">

                    <div className="report-card">

                        <span className="report-card-icon">
                            🔑
                        </span>

                        <div>

                            <span>
                                Total Passwords
                            </span>

                            <strong>
                                {passwordHealth.totalPasswords}
                            </strong>

                        </div>

                    </div>


                    <div className="report-card">

                        <span className="report-card-icon">
                            🟢
                        </span>

                        <div>

                            <span>
                                Strong
                            </span>

                            <strong>
                                {passwordHealth.strongPasswords}
                            </strong>

                        </div>

                    </div>


                    <div className="report-card">

                        <span className="report-card-icon">
                            🟡
                        </span>

                        <div>

                            <span>
                                Medium
                            </span>

                            <strong>
                                {passwordHealth.mediumPasswords}
                            </strong>

                        </div>

                    </div>


                    <div className="report-card">

                        <span className="report-card-icon">
                            🔴
                        </span>

                        <div>

                            <span>
                                Weak
                            </span>

                            <strong>
                                {passwordHealth.weakPasswords}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= LOGIN ACTIVITY ================= */}

            <div className="report-section">

                <div className="report-section-header">

                    <div>

                        <h2>
                            📊 Login Activity Report
                        </h2>

                        <p>
                            Summary of your recorded login
                            attempts.
                        </p>

                    </div>

                </div>


                <div className="login-report-summary">

                    <div className="report-card">

                        <span className="report-card-icon">
                            🔐
                        </span>

                        <div>

                            <span>
                                Total Attempts
                            </span>

                            <strong>
                                {loginActivities.length}
                            </strong>

                        </div>

                    </div>


                    <div className="report-card">

                        <span className="report-card-icon">
                            ✅
                        </span>

                        <div>

                            <span>
                                Successful
                            </span>

                            <strong>
                                {successfulLogins}
                            </strong>

                        </div>

                    </div>


                    <div className="report-card">

                        <span className="report-card-icon">
                            ❌
                        </span>

                        <div>

                            <span>
                                Failed
                            </span>

                            <strong>
                                {failedLogins}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ================= RECENT ACTIVITY ================= */}

                <div className="recent-report">

                    <h3>
                        Recent Login Activity
                    </h3>

                    {loginActivities.length === 0 ? (

                        <p>
                            No login activity available.
                        </p>

                    ) : (

                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th>Email</th>

                                        <th>Status</th>

                                        <th>Date</th>

                                        <th>IP Address</th>

                                        <th>Failure Reason</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {loginActivities
                                        .slice(0, 10)
                                        .map((activity, index) => (

                                        <tr
                                            key={
                                                activity.id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {activity.email}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        activity.status ===
                                                        "SUCCESS"
                                                            ? "report-success"
                                                            : "report-failed"
                                                    }
                                                >
                                                    {activity.status}
                                                </span>

                                            </td>

                                            <td>
                                                {activity.loginTime
                                                    ? new Date(
                                                        activity.loginTime
                                                    ).toLocaleString()
                                                    : "—"}
                                            </td>

                                            <td>
                                                {activity.ipAddress ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {activity.failureReason ||
                                                    "—"}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Reports;
import "./SecurityAnalytics.css";
import { useEffect, useState } from "react";
import axios from "axios";

function SecurityAnalytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadAnalytics = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:8081/api/security/analytics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAnalytics(response.data);

            } catch (error) {

                console.error(
                    "Failed to load security analytics:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadAnalytics();

    }, []);

    if (loading) {

        return (
            <div className="analytics-state">
                Loading security analytics...
            </div>
        );
    }

    if (!analytics) {

        return (
            <div className="analytics-state">
                Unable to load security analytics.
            </div>
        );
    }

    return (

        <div className="security-analytics-page">

            {/* HEADER */}

            <div className="analytics-header">

                <div>

                    <h1>Security Analytics</h1>

                    <p>
                        Overview of your security and login activity.
                    </p>

                </div>

            </div>


            {/* ANALYTICS CARDS */}

            <div className="analytics-grid">

                {/* TOTAL */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        🔐
                    </div>

                    <div>

                        <span>
                            Total Login Attempts
                        </span>

                        <strong>
                            {analytics.totalLoginAttempts}
                        </strong>

                    </div>

                </div>


                {/* SUCCESS */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        ✅
                    </div>

                    <div>

                        <span>
                            Successful Logins
                        </span>

                        <strong>
                            {analytics.successfulLogins}
                        </strong>

                    </div>

                </div>


                {/* FAILED */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        ❌
                    </div>

                    <div>

                        <span>
                            Failed Logins
                        </span>

                        <strong>
                            {analytics.failedLogins}
                        </strong>

                    </div>

                </div>


                {/* SUSPICIOUS */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        ⚠️
                    </div>

                    <div>

                        <span>
                            Suspicious Activities
                        </span>

                        <strong>
                            {analytics.suspiciousActivities}
                        </strong>

                    </div>

                </div>


                {/* ALERTS */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        🚨
                    </div>

                    <div>

                        <span>
                            Security Alerts
                        </span>

                        <strong>
                            {analytics.securityAlerts}
                        </strong>

                    </div>

                </div>

            </div>


            {/* SECURITY OVERVIEW */}

            <div className="analytics-overview">

                <h2>Security Overview</h2>

                <p>
                    The analytics above are calculated from
                    recorded login activities, suspicious
                    activities and security alerts.
                </p>

                <div className="overview-row">

                    <div>
                        <strong>
                            {analytics.successfulLogins}
                        </strong>

                        <span>
                            Successful
                        </span>
                    </div>

                    <div>
                        <strong>
                            {analytics.failedLogins}
                        </strong>

                        <span>
                            Failed
                        </span>
                    </div>

                    <div>
                        <strong>
                            {analytics.suspiciousActivities}
                        </strong>

                        <span>
                            Suspicious
                        </span>
                    </div>

                    <div>
                        <strong>
                            {analytics.securityAlerts}
                        </strong>

                        <span>
                            Alerts
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default SecurityAnalytics;
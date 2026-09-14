import { useEffect, useState } from "react";
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead
} from "../../services/NotificationService";
import { getProfile } from "../../services/AuthService";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

   
   const loadNotifications = async () => {
    try {

        const profileResponse = await getProfile();

        const userId = profileResponse.data.id;

        const notificationResponse =
            await getNotifications(userId);

        const countResponse =
            await getUnreadCount(userId);

        setNotifications(notificationResponse.data);
        setUnreadCount(countResponse.data);

    } catch (error) {

        console.error(
            "Failed to load notifications:",
            error
        );
    }
};
    

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {

        try {

            if (!notification.isRead) {

                await markNotificationAsRead(
                    notification.id
                );

                setUnreadCount((count) =>
                    Math.max(0, count - 1)
                );

                setNotifications((prev) =>
                    prev.map((item) =>
                        item.id === notification.id
                            ? { ...item, isRead: true }
                            : item
                    )
                );
            }

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };

    return (
        <div
            style={{
                position: "relative",
                display: "inline-block"
            }}
        >

            {/* Notification Bell */}

            <button
                onClick={() =>
                    setShowDropdown(!showDropdown)
                }
                style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    position: "relative"
                }}
            >
                🔔

                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            minWidth: "20px",
                            height: "20px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {unreadCount}
                    </span>
                )}

            </button>


            {/* Dropdown */}

            {showDropdown && (

                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "40px",
                        width: "350px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000
                    }}
                >

                    <div
                        style={{
                            padding: "12px",
                            borderBottom: "1px solid #ddd",
                            fontWeight: "bold"
                        }}
                    >
                        Notifications
                    </div>


                    {notifications.length === 0 ? (

                        <div
                            style={{
                                padding: "20px",
                                textAlign: "center",
                                color: "#777"
                            }}
                        >
                            No notifications
                        </div>

                    ) : (

                        notifications.map((notification) => (

                            <div
                                key={notification.id}
                                onClick={() =>
                                    handleNotificationClick(
                                        notification
                                    )
                                }
                                style={{
                                    padding: "12px",
                                    borderBottom:
                                        "1px solid #eee",
                                    background:
                                        notification.isRead
                                            ? "white"
                                            : "#f0f7ff",
                                    cursor: "pointer"
                                }}
                            >

                                <div
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: "4px"
                                    }}
                                >
                                    {notification.title}
                                </div>

                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: "#555"
                                    }}
                                >
                                    {notification.message}
                                </div>

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#999",
                                        marginTop: "5px"
                                    }}
                                >
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </div>

                            </div>

                        ))

                    )}

                </div>
            )}

        </div>
    );
}

export default NotificationBell;
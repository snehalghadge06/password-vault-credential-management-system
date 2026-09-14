import axios from "axios";

const API_URL = "https://securevault-backend-lo1o.onrender.com/api/notifications";

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Get all notifications
export const getNotifications = (userId) => {
    return axios.get(
        `${API_URL}/user/${userId}`,
        getAuthHeaders()
    );
};

// Get unread notifications
export const getUnreadNotifications = (userId) => {
    return axios.get(
        `${API_URL}/user/${userId}/unread`,
        getAuthHeaders()
    );
};

// Get unread notification count
export const getUnreadCount = (userId) => {
    return axios.get(
        `${API_URL}/user/${userId}/unread-count`,
        getAuthHeaders()
    );
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
    return axios.put(
        `${API_URL}/${notificationId}/read`,
        {},
        getAuthHeaders()
    );
};
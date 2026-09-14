import axios from "axios";

const API_URL = "https://securevault-backend-lo1o.onrender.com/api/auth";

export const forgotPassword = (email) => {
    return axios.post(`${API_URL}/forgot-password`, {
        email: email
    });
};

export const resetPassword = (data) => {
    return axios.post(`${API_URL}/reset-password`, data);
};

export const getProfile = () => {
    return axios.get("https://securevault-backend-lo1o.onrender.com/api/auth/profile", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const updateProfile = (profile) => {
    return axios.put(
        "https://securevault-backend-lo1o.onrender.com/api/auth/profile",
        profile,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
};
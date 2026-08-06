import axios from "axios";

const API_URL = "http://localhost:8081/api/vault";

const getToken = () => {
    return localStorage.getItem("token");
};

export const getCredentials = () => {
    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const addCredential = (credential) => {
    return axios.post(API_URL, credential, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const updateCredential = (credential) => {
    return axios.put(API_URL, credential, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const deleteCredentialById = (id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const generatePassword = (length) => {
    return axios.get(
        `http://localhost:8081/api/password/generate?length=${length}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );
};

export const shareCredential = (data) => {
    return axios.post(`${API_URL}/share`, data, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const getSharedCredentials = () => {
    return axios.get(`${API_URL}/shared`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};
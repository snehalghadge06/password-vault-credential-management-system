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
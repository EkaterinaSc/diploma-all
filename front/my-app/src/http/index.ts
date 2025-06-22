import axios from "axios";
import {AuthResponse} from "../models/response/authResponse";

export const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    withCredentials: true, // чтобы забирать в запрос куки автоматом
    baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
})

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,
                {withCredentials: true});
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            return api.request(originalRequest);
        } catch (e) {
            console.log('не авторизован');
        }
    }
    throw error;
})

export default api;
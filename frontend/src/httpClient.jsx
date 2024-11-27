import axios from "axios";

export default axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? window.location.origin  // In production, use the same origin as the frontend
        : 'http://127.0.0.1:5000',  // In development, use the local backend URL
    withCredentials: true  // Ensure cookies are included in requests
})
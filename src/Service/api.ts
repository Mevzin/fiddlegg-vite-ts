import axios from "axios"

export const apiBase = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

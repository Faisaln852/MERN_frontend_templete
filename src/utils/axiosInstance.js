import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/",
    withCredentials: true,
})

// Helper function to set token in cookie (for server-side access)
export const setTokenCookie = (token) => {
    try {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + 7)
        let cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax;`
        // Only add Secure if on HTTPS
        if (typeof window !== "undefined" && window.location.protocol === "https:") {
            cookie += " Secure"
        }
        document.cookie = cookie
    } catch (error) {
        console.error("Error setting token cookie:", error)
    }
}

// Helper function to remove token cookie
export const removeTokenCookie = () => {
    try {
        // Remove cookie for all possible paths
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax"
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure"
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure"
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict"
    } catch (error) {
        console.error("Error removing token cookie:", error)
    }
}

// Helper function to get token from cookie
const getTokenFromCookie = () => {
    if (typeof document === "undefined") return null
    const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : null
}

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {

        if (response.config.url?.includes("login") && response.data?.token) {
             setTokenCookie(response.data.token)
        }
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            removeTokenCookie()
        }
        return Promise.reject(error)
    },
)

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getTokenFromCookie()
        if (token) {
            config.headers = config.headers || {}
            config.headers["Authorization"] = `Bearer ${token}`
            config.headers["x-client-time"] = new Date().toISOString()
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default axiosInstance

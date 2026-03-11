import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setAuthCookies, getAuthFromCookies, clearAuthCookies } from "../utils/cookieUtils"

interface User {
    id: string
    email: string
    role: "admin" | "exhibitor" | "attendee"
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    // Restore auth state from cookies and localStorage on mount
    useEffect(() => {
        // Try to restore from cookies first (most persistent)
        const authFromCookies = getAuthFromCookies()
        if (authFromCookies) {
            setUser(authFromCookies.user)
            setToken(authFromCookies.token)
            localStorage.setItem("token", authFromCookies.token)
            localStorage.setItem("user", JSON.stringify(authFromCookies.user))
            return
        }

        // Fallback to localStorage
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
                setToken(storedToken)
                setAuthCookies(parsedUser, storedToken)
            } catch (error) {
                console.error("Failed to parse stored user data", error)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                clearAuthCookies()
            }
        }
    }, [])

    const login = (user: User, token: string) => {
        setUser(user)
        setToken(token)
        // All roles use persistent storage (localStorage + cookies)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        setAuthCookies(user, token)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        sessionStorage.removeItem("adminToken")
        sessionStorage.removeItem("adminUser")
        sessionStorage.removeItem("adminSessionActive")
        clearAuthCookies()
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/Auth.context.tsx"
import type { JSX } from "react"

interface Props {
    children: JSX.Element
    allowedRole?: "admin" | "exhibitor" | "attendee"
    allowedRoles?: Array<"admin" | "exhibitor" | "attendee">
}

const ProtectedRoute = ({ children, allowedRole, allowedRoles }: Props) => {
    const { user } = useAuth()

    if (!user) return <Navigate to="/" />

    const permittedRoles = allowedRoles ?? (allowedRole ? [allowedRole] : [])

    if (permittedRoles.length > 0 && !permittedRoles.includes(user.role)) {
        const fallbackPath = user.role === "attendee" ? "/" : `/${user.role}/dashboard`
        return <Navigate to={fallbackPath} />
    }

    return children
}

export default ProtectedRoute
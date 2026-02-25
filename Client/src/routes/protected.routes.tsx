import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/Auth.context.tsx"
import type {JSX} from "react";

interface Props {
    children: JSX.Element
    allowedRole: "admin" | "exhibitor" | "attendee"
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
    const { user } = useAuth()

    if (!user) return <Navigate to="/" />

    if (user.role !== allowedRole)
        return <Navigate to={`/${user.role}/dashboard`} />

    return children
}

export default ProtectedRoute
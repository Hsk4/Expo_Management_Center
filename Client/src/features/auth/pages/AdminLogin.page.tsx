import { Navigate } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"
import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import LoginForm from "../components/LoginForm.tsx";

const AdminLoginPage = () => {
    const { user } = useAuth()

    if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />
    }

    return (
        <AuthLayout title="Admin Portal" accent="text-indigo-400">
            <LoginForm role="admin" accent="focus:ring-indigo-400" />
        </AuthLayout>
    )
}
export default AdminLoginPage

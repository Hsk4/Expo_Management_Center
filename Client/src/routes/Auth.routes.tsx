import { Routes, Route } from "react-router-dom"
import AdminLoginPage from "../features/auth/pages/AdminLogin.page.tsx";
import ExhibitorLoginPage from "../features/auth/pages/ExhabitorLogin.page.tsx"
import AttendeeLoginPage from "../features/auth/pages/AttendeeLogin.page.tsx"
import AdminRegisterPage from "../features/auth/pages/AdminRegister.page.tsx"
import ExhibitorRegisterPage from "../features/auth/pages/ExhibitorRegister.page.tsx"
import AttendeeRegisterPage from "../features/auth/pages/AttendeeRegister.page.tsx"
import ProtectedRoute from "./protected.routes.tsx";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Login Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/exhibitor/login" element={<ExhibitorLoginPage />} />
            <Route path="/attendee/login" element={<AttendeeLoginPage />} />

            {/* Register Routes */}
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/exhibitor/register" element={<ExhibitorRegisterPage />} />
            <Route path="/attendee/register" element={<AttendeeRegisterPage />} />

            {/* Future Dashboards */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <div>Admin Dashboard</div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes
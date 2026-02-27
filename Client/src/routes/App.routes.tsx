import { Routes, Route } from "react-router-dom"
import AdminLoginPage from "../features/auth/pages/AdminLogin.page.tsx";
import ExhibitorLoginPage from "../features/auth/pages/ExhabitorLogin.page.tsx"
import AttendeeLoginPage from "../features/auth/pages/AttendeeLogin.page.tsx"
import AdminRegisterPage from "../features/auth/pages/AdminRegister.page.tsx"
import ExhibitorRegisterPage from "../features/auth/pages/ExhibitorRegister.page.tsx"
import AttendeeRegisterPage from "../features/auth/pages/AttendeeRegister.page.tsx"
import ForgotPasswordPage from "../features/auth/pages/ForgotPassword.page.tsx"
import ResetPasswordPage from "../features/auth/pages/ResetPassword.page.tsx"
import ProtectedRoute from "./protected.routes.tsx";
import RootLayout from "../components/layout/Root.layout.tsx";
import HomePage from "../features/landing/pages/Home.page.tsx";
import ExposPage from "../features/attendee/pages/ExposPage.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Home Routes */}

            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/expos"
                    element={
                        <ProtectedRoute allowedRole="attendee">
                            <ExposPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRole="attendee">
                            <div className="min-h-screen flex items-center justify-center">
                                <h1 className="text-3xl text-white">Profile Settings - Coming Soon</h1>
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tickets"
                    element={
                        <ProtectedRoute allowedRole="attendee">
                            <div className="min-h-screen flex items-center justify-center">
                                <h1 className="text-3xl text-white">My Tickets - Coming Soon</h1>
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Login Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/exhibitor/login" element={<ExhibitorLoginPage />} />
            <Route path="/attendee/login" element={<AttendeeLoginPage />} />

            {/* Register Routes */}
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/exhibitor/register" element={<ExhibitorRegisterPage />} />
            <Route path="/attendee/register" element={<AttendeeRegisterPage />} />

            {/* Password Reset Routes */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

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
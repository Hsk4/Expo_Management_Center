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
import AdminDashboardPage from "../features/admin/pages/Dashboard.page.tsx";
import ExhibitorDashboardPage from "../features/exhibitor/pages/Dashboard.page.tsx"
import ExhibitorBoothBookingPage from "../features/exhibitor/pages/BoothBooking.page.tsx"
import ExpoFloorViewPage from "../features/attendee/pages/ExpoFloorView.page.tsx"
import ProfilePage from "../features/account/pages/Profile.page.tsx"
import MyTicketsPage from "../features/account/pages/MyTickets.page.tsx"

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/expos"
                    element={
                        <ProtectedRoute allowedRoles={["attendee", "exhibitor"]}>
                            <ExposPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/expo/:expoId/floor"
                    element={
                        <ProtectedRoute allowedRoles={["attendee", "exhibitor"]}>
                            <ExpoFloorViewPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={["attendee", "exhibitor"]}>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tickets"
                    element={
                        <ProtectedRoute allowedRoles={["attendee", "exhibitor"]}>
                            <MyTicketsPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/exhibitor/login" element={<ExhibitorLoginPage />} />
            <Route path="/attendee/login" element={<AttendeeLoginPage />} />

            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/exhibitor/register" element={<ExhibitorRegisterPage />} />
            <Route path="/attendee/register" element={<AttendeeRegisterPage />} />

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/exhibitor/dashboard"
                element={
                    <ProtectedRoute allowedRole="exhibitor">
                        <ExhibitorDashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/exhibitor/book-booth/:expoId"
                element={
                    <ProtectedRoute allowedRole="exhibitor">
                        <ExhibitorBoothBookingPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes
// import React from 'react'
import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import LoginForm from "../components/LoginForm.tsx";

const AdminLoginPage = () => {
    return (
        <AuthLayout title="Admin Portal" accent="text-indigo-400">
            <LoginForm role="admin" accent="focus:ring-indigo-400" />
        </AuthLayout>
    )
}
export default AdminLoginPage

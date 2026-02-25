// import React from 'react'
import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import LoginForm from "../components/LoginForm.tsx";

const ExhibitorLoginPage = () => {
    return (
        <AuthLayout title="Exhibitor Portal" accent="text-cyan-400">
            <LoginForm role="exhibitor" accent="focus:ring-cyan-400" />
        </AuthLayout>
    )
}
export default ExhibitorLoginPage

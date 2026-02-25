// import React from 'react'
import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import LoginForm from "../components/LoginForm.tsx";

const AttendeeLoginPage = () => {
    return (
        <AuthLayout title="Attendee Portal" accent="text-emerald-400">
            <LoginForm role="attendee" accent="focus:ring-emerald-400" />
        </AuthLayout>
    )
}
export default AttendeeLoginPage

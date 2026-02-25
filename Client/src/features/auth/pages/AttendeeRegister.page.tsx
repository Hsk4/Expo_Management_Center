import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import RegisterForm from "../components/RegisterForm.tsx";

const AttendeeRegisterPage = () => {
    return (
        <AuthLayout title="Attendee Registration" accent="text-emerald-400">
            <RegisterForm role="attendee" accent="focus:ring-emerald-400" />
        </AuthLayout>
    )
}

export default AttendeeRegisterPage


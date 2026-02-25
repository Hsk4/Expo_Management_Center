import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import RegisterForm from "../components/RegisterForm.tsx";

const AdminRegisterPage = () => {
    return (
        <AuthLayout title="Admin Registration" accent="text-indigo-400">
            <RegisterForm role="admin" accent="focus:ring-indigo-400" />
        </AuthLayout>
    )
}

export default AdminRegisterPage


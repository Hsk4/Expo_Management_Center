import AuthLayout from "../../../components/layout/Auth.layout.tsx";
import RegisterForm from "../components/RegisterForm.tsx";

const ExhibitorRegisterPage = () => {
    return (
        <AuthLayout title="Exhibitor Registration" accent="text-cyan-400">
            <RegisterForm role="exhibitor" accent="focus:ring-cyan-400" />
        </AuthLayout>
    )
}

export default ExhibitorRegisterPage


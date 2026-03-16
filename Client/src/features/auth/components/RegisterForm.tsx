import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"
import { registerUser } from "../../../services/auth.service"

interface Props {
    role: "admin" | "exhibitor" | "attendee"
    accent: string
}

const RegisterForm = ({ role, accent }: Props) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const hasPasswordMismatch = Boolean(confirmPassword) && password !== confirmPassword
    const isPasswordTooShort = Boolean(password) && password.length < 6
    const canSubmit = !loading && name.trim().length > 1 && email.trim().length > 3 && !isPasswordTooShort && !hasPasswordMismatch && acceptTerms

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const data = await registerUser({
                name,
                email,
                password,
                role,
            });

            login(data.user, data.token);

            // Redirect attendees to home page, others to their respective dashboards
            if (data.user.role === "attendee") {
                navigate("/");
            } else {
                navigate(`/${data.user.role}/dashboard`);
            }
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm text-neutral-300">Full Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                    placeholder="Enter your full name"
                />
            </div>

            <div>
                <label className="text-sm text-neutral-300">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                    placeholder="Enter your email"
                />
            </div>

            {role === "exhibitor" && (
                <div>
                    <label className="text-sm text-neutral-300">Company Name</label>
                    <input
                        type="text"
                        className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                        placeholder="Enter your company name"
                    />
                    <p className="text-xs text-neutral-500 mt-1">You can complete your public company profile later in account settings.</p>
                </div>
            )}

            <div>
                <label className="text-sm text-neutral-300">Password</label>
                <div className="mt-2 flex gap-2">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                        placeholder="Create a password"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="px-3 rounded-xl border border-white/20 text-neutral-300 hover:text-white hover:bg-white/10 transition"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <p className={`text-xs mt-1 ${isPasswordTooShort ? 'text-red-400' : 'text-neutral-500'}`}>
                    Password should be at least 6 characters.
                </p>
            </div>

            <div>
                <label className="text-sm text-neutral-300">Confirm Password</label>
                <div className="mt-2 flex gap-2">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`flex-1 px-4 py-3 rounded-xl bg-white/10 border ${hasPasswordMismatch ? 'border-red-500/50' : 'border-white/20'} focus:outline-none focus:ring-2 ${accent} transition`}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="px-3 rounded-xl border border-white/20 text-neutral-300 hover:text-white hover:bg-white/10 transition"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {hasPasswordMismatch && <p className="text-xs text-red-400 mt-1">Passwords do not match.</p>}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1"
                    id="terms"
                />
                <label htmlFor="terms" className="text-sm text-neutral-400">
                    I agree to the{" "}
                    <a href="#" className={`${accent} hover:underline`}>
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className={`${accent} hover:underline`}>
                        Privacy Policy
                    </a>
                </label>
            </div>

            {/* Register button */}
            <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                    !canSubmit
                        ? "bg-neutral-600 cursor-not-allowed"
                        : "bg-white text-black hover:bg-neutral-200"
                }`}
            >
                {loading ? "Creating account..." : `Register as ${role}`}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-700" />
                <span className="text-xs text-neutral-400">OR</span>
                <div className="flex-1 h-px bg-neutral-700" />
            </div>

            {/* Google OAuth */}
            <button
                type="button"
                className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-neutral-400">
                Already have an account?{" "}
                <a href={`/${role}/login`} className={`${accent} hover:underline`}>
                    Login here
                </a>
            </p>
        </form>
    )
}

export default RegisterForm



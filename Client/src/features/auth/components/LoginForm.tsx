import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"
import { loginUser } from "../../../services/auth.service"
interface Props {
    role: "admin" | "exhibitor" | "attendee"
    accent: string
}

const LoginForm = ({ role, accent }: Props) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const data = await loginUser({ email, password });

            login(data.user, data.token);

            // Redirect attendees to home page, others to their respective dashboards
            if (data.user.role === "attendee") {
                navigate("/");
            } else {
                navigate(`/${data.user.role}/dashboard`);
            }
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed";
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

            <div>
                <label className="text-sm text-neutral-300">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                    placeholder="Enter your password"
                />
            </div>

            {/* Forgot password */}
            <div className="text-right">
                <a
                    href="/forgot-password"
                    className={`text-sm ${accent} hover:underline`}
                >
                    Forgot password?
                </a>
            </div>

            {/* Login button */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                    loading
                        ? "bg-neutral-600 cursor-not-allowed"
                        : "bg-white text-black hover:bg-neutral-200"
                }`}
            >
                {loading ? "Signing in..." : `Login as ${role}`}
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

            {/* Register link */}
            <p className="text-center text-sm text-neutral-400">
                Don't have an account?{" "}
                <a href={`/${role}/register`} className={`${accent} hover:underline`}>
                    Register here
                </a>
            </p>
        </form>
    )
}

export default LoginForm
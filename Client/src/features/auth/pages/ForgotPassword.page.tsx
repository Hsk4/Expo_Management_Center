import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthLayout from "../../../components/layout/Auth.layout.tsx"
import { forgotPassword } from "../../../services/auth.service"

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            await forgotPassword({ email })
            setSuccess(true)
            setEmail("")
            // Show success message for 3 seconds before redirecting
            setTimeout(() => {
                navigate("/attendee/login")
            }, 3000)
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send reset email"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout title="Reset Password" accent="text-blue-400">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="text-sm text-green-400 bg-green-500/10 p-4 rounded-lg border border-green-500/20 space-y-2">
                        <p className="font-semibold">Check your email!</p>
                        <p>We've sent a password reset link to <strong>{email}</strong></p>
                        <p className="text-xs text-green-300">Redirecting to login...</p>
                    </div>
                )}

                {/* Email Input */}
                {!success && (
                    <>
                        <div>
                            <label className="text-sm text-neutral-300">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Enter your registered email"
                                disabled={loading}
                            />
                            <p className="mt-2 text-xs text-neutral-400">
                                We'll send you a link to reset your password
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold transition ${
                                loading
                                    ? "bg-neutral-600 cursor-not-allowed"
                                    : "bg-white text-black hover:bg-neutral-200"
                            }`}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-neutral-700" />
                            <span className="text-xs text-neutral-400">OR</span>
                            <div className="flex-1 h-px bg-neutral-700" />
                        </div>

                        {/* Back to Login */}
                        <button
                            type="button"
                            onClick={() => navigate("/attendee/login")}
                            className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition font-medium"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </form>
        </AuthLayout>
    )
}

export default ForgotPasswordPage


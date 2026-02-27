import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthLayout from "../../../components/layout/Auth.layout.tsx"
import { resetPassword } from "../../../services/auth.service"

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [tokenValid, setTokenValid] = useState(true)
    const navigate = useNavigate()

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    // Validate token and email on mount
    useEffect(() => {
        if (!token || !email) {
            setTokenValid(false)
            setError("Invalid reset link")
        }
    }, [token, email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Client-side validation
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            setLoading(false)
            return
        }

        try {
            if (!token || !email) {
                throw new Error("Missing token or email")
            }

            await resetPassword({
                email,
                token,
                newPassword,
                confirmPassword,
            })
            setSuccess(true)
            setNewPassword("")
            setConfirmPassword("")
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/attendee/login")
            }, 2000)
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reset password"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (!tokenValid) {
        return (
            <AuthLayout title="Invalid Link" accent="text-red-400">
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-red-400 mb-6">The reset link is invalid or has expired.</p>
                        <button
                            onClick={() => navigate("/attendee/login")}
                            className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
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
                        <p className="font-semibold">Password reset successfully!</p>
                        <p className="text-xs text-green-300">Redirecting to login...</p>
                    </div>
                )}

                {/* Email Display */}
                {!success && (
                    <>
                        <div>
                            <label className="text-sm text-neutral-300">Email</label>
                            <input
                                type="email"
                                value={email || ""}
                                disabled
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-neutral-400"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="text-sm text-neutral-300">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Enter new password"
                                disabled={loading}
                                minLength={6}
                            />
                            <p className="mt-1 text-xs text-neutral-400">
                                Minimum 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm text-neutral-300">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Confirm your password"
                                disabled={loading}
                                minLength={6}
                            />
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
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

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

export default ResetPasswordPage


import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"

const HeroSection = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleAttendExpo = () => {
        if (user?.role === "attendee" || user?.role === "exhibitor") {
            navigate("/expos")
        } else {
            navigate("/attendee/login")
        }
    }

    const handleExhibitorAction = () => {
        if (user?.role === "exhibitor") {
            navigate("/exhibitor/dashboard")
        } else {
            navigate("/exhibitor/login")
        }
    }

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center px-6">

            {/* Background Glow Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl top-[-100px] left-[-100px]" />
                <div className="absolute w-[400px] h-[400px] bg-neutral-500/10 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />
            </div>

            {/* Content */}
            <div className="max-w-5xl text-center space-y-8">

                {/* Badge */}
                <div className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-neutral-300 backdrop-blur-md">
                    Multi-Expo Management Platform
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                    Experience Expos
                    <span className="block text-neutral-400">
            Like Never Before
          </span>
                </h1>

                {/* Subheading */}
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl">
                    EventSphere connects organizers, exhibitors, and attendees in one seamless
                    real-time platform. Manage booths, sessions, registrations, and analytics —
                    all in one place.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">

                    <button
                        onClick={handleAttendExpo}
                        className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition w-full md:w-auto text-center"
                    >
                        {user?.role === "attendee" || user?.role === "exhibitor" ? "Browse Expos" : "Attend an Expo"}
                    </button>

                    {user?.role !== "exhibitor" && (
                        <button
                            onClick={handleExhibitorAction}
                            className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition w-full md:w-auto text-center"
                        >
                            Become an Exhibitor
                        </button>
                    )}

                    {user?.role === "exhibitor" && (
                        <button
                            onClick={handleExhibitorAction}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition w-full md:w-auto text-center"
                        >
                            Go to Exhibitor Dashboard
                        </button>
                    )}

                </div>

                {/* Secondary Link */}
                <div className="pt-4 text-sm text-neutral-500">
                    {user?.role === "admin" ? (
                        <>
                            <button
                                onClick={() => navigate("/admin/dashboard")}
                                className="text-neutral-300 hover:text-white transition underline"
                            >
                                Go to Admin Dashboard
                            </button>
                        </>
                    ) : (
                        <>
                            Are you an organizer?{" "}
                            <Link to="/admin/login" className="text-neutral-300 hover:text-white transition">
                                Admin Login
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default HeroSection
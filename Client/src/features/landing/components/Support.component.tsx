import { Link } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"

const SupportSection = () => {
    const { user } = useAuth()
    const canAccessSupport = user?.role === "attendee" || user?.role === "exhibitor"

    return (
        <div className="max-w-6xl mx-auto px-6">

            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Need <span className="text-neutral-400">Support?</span>
                </h2>
                <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
                    Our team is here to help organizers, exhibitors, and attendees
                    every step of the way.
                </p>
            </div>

            {/* Support Cards */}
            <div className="grid md:grid-cols-3 gap-8">

                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-center">
                    <h3 className="font-semibold mb-3">Organizer Assistance</h3>
                    <p className="text-sm text-neutral-400">
                        Need help managing expos or approving exhibitors? Our admin support
                        team is ready to assist.
                    </p>
                </div>

                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-center">
                    <h3 className="font-semibold mb-3">Exhibitor Help</h3>
                    <p className="text-sm text-neutral-400">
                        Assistance with booth selection, profile setup, or documentation.
                    </p>
                </div>

                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-center">
                    <h3 className="font-semibold mb-3">Attendee Support</h3>
                    <p className="text-sm text-neutral-400">
                        Help with event registration, schedules, or session bookings.
                    </p>
                </div>

            </div>

            {/* CTA */}
            <div className="text-center mt-16">
                <p className="text-neutral-400 mb-6">
                    Ready to get started?
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {canAccessSupport ? (
                        <>
                            <Link
                                to="/support"
                                className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition"
                            >
                                Open Support Center
                            </Link>

                            <Link
                                to="/my-tickets"
                                className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition"
                            >
                                View My Activity
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/attendee/register"
                                className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition"
                            >
                                Create Account
                            </Link>

                            <Link
                                to="/exhibitor/login"
                                className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition"
                            >
                                Exhibitor Login
                            </Link>
                        </>
                    )}
                </div>
            </div>

        </div>
    )
}

export default SupportSection
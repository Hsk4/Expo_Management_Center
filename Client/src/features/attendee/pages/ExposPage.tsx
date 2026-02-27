import { useNavigate } from "react-router-dom"

const ExposPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back Navigation */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition mb-8 group"
                >
                    <svg
                        className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Home</span>
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-white">Explore </span>
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Upcoming Expos
                        </span>
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Discover amazing exhibitions and events tailored for you
                    </p>
                </div>

                {/* Placeholder for expo listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 mb-4 flex items-center justify-center">
                                <span className="text-neutral-500 text-sm">Expo Image</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Expo Event {item}
                            </h3>
                            <p className="text-neutral-400 text-sm mb-4">
                                Join us for an amazing experience with cutting-edge technology and innovations.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500">Dec 2026</span>
                                <button className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExposPage


import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { attendExpo, getAllExpos, type ExpoData } from "../../../services/expo.service"
import { useAuth } from "../../../contexts/Auth.context"

const ExposPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [expos, setExpos] = useState<ExpoData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [busyExpoId, setBusyExpoId] = useState<string | null>(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetchExpos()
    }, [])

    const fetchExpos = async () => {
        try {
            setLoading(true)
            const response = await getAllExpos()
            if (response.success) {
                const publishedExpos = response.data.filter((expo: ExpoData) => expo.status === "published")
                setExpos(publishedExpos)
            }
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch expos")
        } finally {
            setLoading(false)
        }
    }

    const handleAttendExpo = async (expoId: string) => {
        try {
            setBusyExpoId(expoId)
            setMessage("")
            const response = await attendExpo(expoId)
            setMessage(response?.message || "Attendance confirmed")
            await fetchExpos()
        } catch (err: unknown) {
            setMessage((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to mark attendance")
        } finally {
            setBusyExpoId(null)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const isUpcoming = (startDate: string) => {
        return new Date(startDate) > new Date()
    }

    const isOngoing = (startDate: string, endDate: string) => {
        const now = new Date()
        return new Date(startDate) <= now && new Date(endDate) >= now
    }

    const isExhibitor = user?.role === "exhibitor"

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
                            Available Expos
                        </span>
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Discover amazing exhibitions and events tailored for you
                    </p>
                </div>

                {/* Message State */}
                {message && (
                    <div className="text-center mb-6">
                        <p className="text-blue-300 text-sm">{message}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-neutral-400 mt-4">Loading expos...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">⚠️ {error}</p>
                        <button
                            onClick={fetchExpos}
                            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Expo Listings */}
                {!loading && !error && (
                    <>
                        {expos.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-neutral-400 text-lg">No expos available at the moment</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {expos.map((expo) => (
                                    <div
                                        key={expo._id}
                                        className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 mb-4 flex items-center justify-center relative overflow-hidden">
                                            <span className="text-neutral-500 text-sm">{expo.theme || "Expo"}</span>
                                            {isOngoing(expo.startDate, expo.endDate) && (
                                                <span className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/80 text-white">
                                                    Live Now
                                                </span>
                                            )}
                                            {isUpcoming(expo.startDate) && (
                                                <span className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/80 text-white">
                                                    Upcoming
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {expo.title}
                                        </h3>
                                        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                                            {expo.description}
                                        </p>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{expo.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDate(expo.startDate)} - {formatDate(expo.endDate)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-xs text-neutral-500 mb-4">
                                            <span>{expo.boothsBookedCount}/{expo.maxBooths} booths</span>
                                            <span>{expo.attendeesRegisteredCount}/{expo.maxAttendees} attendees</span>
                                        </div>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => navigate(`/expo/${expo._id}/floor`)}
                                                className="w-full text-sm px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 transition"
                                            >
                                                🏢 View 3D Floor
                                            </button>
                                            <button
                                                onClick={() => handleAttendExpo(expo._id)}
                                                disabled={busyExpoId === expo._id}
                                                className="w-full text-sm px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/60 transition"
                                            >
                                                {busyExpoId === expo._id ? "Processing..." : "Attend expo"}
                                            </button>
                                            {isExhibitor && (
                                                <button
                                                    onClick={() => navigate(`/exhibitor/book-booth/${expo._id}`)}
                                                    className="w-full text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                                                >
                                                    Attend as exhibitor and book booth
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ExposPage


import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { attendExpo, getAllExpos, type ExpoData } from "../../../services/expo.service"

const ExhibitorDashboardPage = () => {
    const navigate = useNavigate()
    const [expos, setExpos] = useState<ExpoData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionMessage, setActionMessage] = useState("")
    const [busyExpoId, setBusyExpoId] = useState<string | null>(null)

    useEffect(() => {
        fetchPublishedExpos()
    }, [])

    const fetchPublishedExpos = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await getAllExpos()
            if (response.success) {
                const publishedExpos = response.data.filter((expo: ExpoData) => expo.status === "published" && expo.isActive)
                setExpos(publishedExpos)
            }
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load expos"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleAttendAsAttendee = async (expoId: string) => {
        try {
            setBusyExpoId(expoId)
            setActionMessage("")
            const response = await attendExpo(expoId)
            setActionMessage(response?.message || "Attendance confirmed")
            await fetchPublishedExpos()
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to attend expo"
            setActionMessage(message)
        } finally {
            setBusyExpoId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Exhibitor Dashboard</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 rounded-lg border border-[#4c9aff]/30 hover:bg-white/10 transition text-white"
                    >
                        Back to Home
                    </button>
                </div>

                <div className="p-5 rounded-xl border border-[#4c9aff]/30 bg-white/5 backdrop-blur-md mb-8">
                    <h2 className="text-lg font-semibold text-white mb-2">Dual access enabled</h2>
                    <p className="text-sm text-[#a0a0b0]">
                        You can attend expos as an attendee and also book your exhibitor booth from the same account.
                    </p>
                    {actionMessage && <p className="text-sm mt-3 text-[#36d399]">{actionMessage}</p>}
                </div>

                {loading && <p className="text-[#a0a0b0]">Loading expos...</p>}
                {error && <p className="text-[#f87171]">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {expos.map((expo) => (
                            <div key={expo._id} className="p-6 rounded-2xl bg-[#0a0a0f] border border-[#4c9aff]/30 backdrop-blur-md hover:border-[#4c9aff]/50 transition">
                                <h3 className="text-xl font-semibold text-white mb-2">{expo.title}</h3>
                                <p className="text-sm text-[#a0a0b0] mb-4 line-clamp-2">{expo.description}</p>
                                <p className="text-xs text-[#707085] mb-1">📍 {expo.location}</p>
                                <p className="text-xs text-[#707085] mb-4">📅 {formatDate(expo.startDate)} - {formatDate(expo.endDate)}</p>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleAttendAsAttendee(expo._id)}
                                        disabled={busyExpoId === expo._id}
                                        className="w-full px-4 py-2 rounded-lg bg-[#36d399] hover:bg-[#10b981] disabled:bg-[#36d399]/60 text-white text-sm font-semibold transition shadow-lg"
                                    >
                                        {busyExpoId === expo._id ? "Processing..." : "Attend as attendee"}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/exhibitor/book-booth/${expo._id}`)}
                                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] text-white text-sm font-semibold transition shadow-lg"
                                    >
                                        Attend as exhibitor and book booth
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExhibitorDashboardPage

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { AlertTriangle, ArrowLeft, Building2, CalendarDays, MapPin } from "lucide-react"
import { attendExpoWithPayment, getAllExpos, type ExpoData, type PaymentSimulationPayload } from "../../../services/expo.service"
import { useAuth } from "../../../contexts/Auth.context"
import PaymentSimulationModal from "../../../components/common/PaymentSimulationModal"

const ExposPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [expos, setExpos] = useState<ExpoData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [busyExpoId, setBusyExpoId] = useState<string | null>(null)
    const [message, setMessage] = useState("")
    const [paymentExpoId, setPaymentExpoId] = useState<string | null>(null)
    const [seatSelections, setSeatSelections] = useState<Record<string, number>>({})
    const [selectedExpoForPayment, setSelectedExpoForPayment] = useState<ExpoData | null>(null)

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

    const handleAttendExpo = async (expoId: string, payment: PaymentSimulationPayload) => {
        try {
            setBusyExpoId(expoId)
            setMessage("")
            const seatsBooked = Math.max(1, Number(seatSelections[expoId] || 1))
            const response = await attendExpoWithPayment(expoId, seatsBooked, payment)
            setMessage(response?.message || "Attendance confirmed")
            await fetchExpos()
            setPaymentExpoId(null)
            setSelectedExpoForPayment(null)
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
        <>
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back Navigation */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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
                        <p className="text-red-500 mb-4 inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</p>
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
                                            {expo.coverImageUrl ? (
                                                <img
                                                    src={expo.coverImageUrl}
                                                    alt={`${expo.title} cover`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : null}
                                            <div className="absolute inset-0 bg-black/30" />
                                            <span className="relative z-10 text-neutral-200 text-sm">{expo.theme || "Expo"}</span>
                                            {isOngoing(expo.startDate, expo.endDate) && (
                                                <span className="relative z-10 absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/80 text-white">
                                                    Live Now
                                                </span>
                                            )}
                                            {isUpcoming(expo.startDate) && (
                                                <span className="relative z-10 absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/80 text-white">
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
                                                <MapPin className="w-4 h-4" />
                                                <span>{expo.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                <CalendarDays className="w-4 h-4" />
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
                                                <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" />View 3D Floor</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPaymentExpoId(expo._id)
                                                    setSelectedExpoForPayment(expo)
                                                }}
                                                disabled={busyExpoId === expo._id}
                                                className="w-full text-sm px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/60 transition"
                                            >
                                                {busyExpoId === expo._id ? "Processing..." : "Pay and attend expo"}
                                            </button>
                                            <input
                                                type="number"
                                                min={1}
                                                max={Math.max(expo.maxAttendees - expo.attendeesRegisteredCount, 1)}
                                                value={seatSelections[expo._id] || 1}
                                                onChange={(e) => setSeatSelections((prev) => ({ ...prev, [expo._id]: Math.max(1, Number(e.target.value || 1)) }))}
                                                className="w-full text-sm px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white"
                                                aria-label="Seats to book"
                                            />
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
        {paymentExpoId && selectedExpoForPayment && (
            <PaymentSimulationModal
                title="Complete attendee payment"
                subtitle={`Seats: ${seatSelections[paymentExpoId] || 1} × $${((selectedExpoForPayment.paymentAmount || 499) / 100).toFixed(2)} = $${(((seatSelections[paymentExpoId] || 1) * (selectedExpoForPayment.paymentAmount || 499)) / 100).toFixed(2)}`}
                ctaLabel="Pay and confirm"
                onClose={() => {
                    setPaymentExpoId(null)
                    setSelectedExpoForPayment(null)
                }}
                onConfirm={(payment) => handleAttendExpo(paymentExpoId, payment)}
            />
        )}
        </>
    )
}

export default ExposPage


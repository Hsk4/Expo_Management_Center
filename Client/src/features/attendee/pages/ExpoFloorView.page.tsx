import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CalendarDays, Clock3, MapPin, Users } from "lucide-react"
import { getExpoBoothGrid, getExpoById, type BoothData, type ExpoData, type ExpoSession } from "../../../services/expo.service"
import ExpoFloor2D from "../../../components/booth/ExpoFloor2D"
import ExpoFloor3D from "../../../components/three/ExpoFloor3D"
import { addSessionBookmark, getMySessionBookmarks, removeSessionBookmark, type BookmarkedSessionRegistration } from "../../../services/user.service"
import { useAuth } from "../../../contexts/Auth.context"

type ViewMode = "2d" | "3d"

const ExpoFloorViewPage = () => {
    const navigate = useNavigate()
    const { expoId } = useParams()
    const { user } = useAuth()

    const [expo, setExpo] = useState<ExpoData | null>(null)
    const [booths, setBooths] = useState<BoothData[]>([])
    const [gridRows, setGridRows] = useState(0)
    const [gridCols, setGridCols] = useState(0)
    const [bookmarkedSessionIds, setBookmarkedSessionIds] = useState<string[]>([])
    const [bookmarkBusyId, setBookmarkBusyId] = useState<string | null>(null)
    const [bookmarkMessage, setBookmarkMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("2d")

    const orderedSessions = useMemo(
        () => [...(expo?.sessions || [])].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
        [expo?.sessions]
    )

    useEffect(() => {
        if (!expoId) return
        fetchData(expoId)
    }, [expoId])

    const fetchData = async (currentExpoId: string) => {
        try {
            setLoading(true)
            setError("")

            const [expoResponse, boothResponse, bookmarkResponse] = await Promise.allSettled([
                getExpoById(currentExpoId),
                getExpoBoothGrid(currentExpoId),
                getMySessionBookmarks(currentExpoId),
            ])

            if (expoResponse.status === "rejected") {
                const messageText = (expoResponse.reason as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load expo floor"
                setError(messageText)
                return
            }

            if (boothResponse.status === "rejected") {
                const messageText = (boothResponse.reason as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load expo floor"
                setError(messageText)
                return
            }

            if (expoResponse.status === "fulfilled" && expoResponse.value.success) setExpo(expoResponse.value.data)
            if (boothResponse.status === "fulfilled" && boothResponse.value.success) {
                setBooths(boothResponse.value.data.booths)
                setGridRows(boothResponse.value.data.gridRows)
                setGridCols(boothResponse.value.data.gridCols)
            }
            if (bookmarkResponse.status === "fulfilled" && bookmarkResponse.value.success) {
                setBookmarkedSessionIds(bookmarkResponse.value.data.map((entry: BookmarkedSessionRegistration) => entry.session._id || ""))
            }
        } catch (err: unknown) {
            const messageText = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load expo floor"
            setError(messageText)
        } finally {
            setLoading(false)
        }
    }

    const formatDateTime = (value: string) =>
        new Date(value).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })

    const handleBookmarkToggle = async (session: ExpoSession) => {
        if (!expoId || !session._id) return

        try {
            setBookmarkBusyId(session._id)
            setBookmarkMessage("")

            if (bookmarkedSessionIds.includes(session._id)) {
                const response = await removeSessionBookmark(expoId, session._id)
                setBookmarkedSessionIds((prev) => prev.filter((id) => id !== session._id))
                setBookmarkMessage(response.message || "Reminder removed")
            } else {
                const response = await addSessionBookmark(expoId, session._id)
                setBookmarkedSessionIds((prev) => [...prev, session._id!])
                setBookmarkMessage(response.message || "Session bookmarked")
            }
        } catch (err: unknown) {
            setBookmarkMessage((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update bookmark")
        } finally {
            setBookmarkBusyId(null)
        }
    }

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/expos")}
                    className="flex items-center gap-2 text-[#a0a0b0] hover:text-white transition mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Expos
                </button>

                <div className="mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Expo Floor View</h1>
                            <p className="text-[#a0a0b0] mb-2">{expo?.title || "Loading expo..."}</p>
                            {expo && (
                                <div className="flex flex-wrap gap-4 text-sm text-[#707085]">
                                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{expo.location}</span>
                                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* View mode toggle */}
                        {!loading && (
                            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 self-start">
                                <button
                                    onClick={() => setViewMode("2d")}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                        viewMode === "2d"
                                            ? "bg-[#4c9aff] text-white shadow"
                                            : "text-[#a0a0b0] hover:text-white"
                                    }`}
                                >
                                    🗺️ 2D View
                                </button>
                                <button
                                    onClick={() => setViewMode("3d")}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                        viewMode === "3d"
                                            ? "bg-[#a78bfa] text-white shadow"
                                            : "text-[#a0a0b0] hover:text-white"
                                    }`}
                                >
                                    🏛️ 3D View
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {loading && <p className="text-[#a0a0b0]">Loading expo floor...</p>}
                {error && <p className="text-[#f87171] mb-4">{error}</p>}
                {bookmarkMessage && <p className="text-[#93c5fd] mb-4">{bookmarkMessage}</p>}

                {!loading && expoId && (
                    <div className="space-y-8">
                        {/* 2D Floor View */}
                        {viewMode === "2d" && (
                            <div style={{ minHeight: "600px" }}>
                                <ExpoFloor2D
                                    booths={booths}
                                    gridRows={gridRows}
                                    gridCols={gridCols}
                                    selectedBoothId={null}
                                    canBook={false}
                                    userRole={user?.role === "exhibitor" ? "exhibitor" : "attendee"}
                                    expoId={expoId}
                                />
                            </div>
                        )}

                        {/* 3D Floor View */}
                        {viewMode === "3d" && (
                            <div className="rounded-2xl overflow-hidden border border-[#a78bfa]/30" style={{ height: "680px" }}>
                                <ExpoFloor3D
                                    booths={booths}
                                    gridRows={gridRows}
                                    gridCols={gridCols}
                                    selectedBoothId={null}
                                    canInteract={false}
                                    showExhibitorNames={true}
                                />
                            </div>
                        )}

                        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Event Schedule</h2>
                                    <p className="text-sm text-[#a0a0b0] mt-1">
                                        Browse sessions, workshops, and keynotes for this expo and bookmark the ones you want to revisit.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate("/my-tickets")}
                                    className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                                >
                                    View saved sessions
                                </button>
                            </div>

                            {orderedSessions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-[#a0a0b0]">
                                    This expo schedule has not been published yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {orderedSessions.map((session) => {
                                        const isBookmarked = Boolean(session._id && bookmarkedSessionIds.includes(session._id))
                                        return (
                                            <div key={session._id || session.title} className="rounded-2xl border border-white/10 bg-[#050507] p-5 space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-white font-semibold text-lg">{session.title}</h3>
                                                        <p className="text-sm text-[#a0a0b0] mt-1">
                                                            {session.topic || "General session"}
                                                            {session.speaker ? ` • ${session.speaker}` : ""}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${isBookmarked ? "bg-[#36d399]/15 border-[#36d399]/30 text-[#86efac]" : "bg-[#4c9aff]/15 border-[#4c9aff]/30 text-[#93c5fd]"}`}>
                                                        {isBookmarked ? "Saved" : "Open"}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-[#d4d4d8]">
                                                    <p className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</p>
                                                    <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{session.location || "Location to be announced"}</p>
                                                    <p className="inline-flex items-center gap-2"><Users className="h-4 w-4" />Capacity: {session.capacity || 50}</p>
                                                </div>

                                                {session.description && (
                                                    <p className="text-sm text-[#a0a0b0] leading-6">{session.description}</p>
                                                )}

                                                <button
                                                    onClick={() => handleBookmarkToggle(session)}
                                                    disabled={!session._id || bookmarkBusyId === session._id}
                                                    className="px-4 py-2 rounded-xl bg-[#4c9aff]/15 border border-[#4c9aff]/30 text-[#93c5fd] hover:bg-[#4c9aff]/25 disabled:opacity-60 transition"
                                                >
                                                    {bookmarkBusyId === session._id ? "Updating..." : isBookmarked ? "Remove bookmark" : "Bookmark session"}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpoFloorViewPage

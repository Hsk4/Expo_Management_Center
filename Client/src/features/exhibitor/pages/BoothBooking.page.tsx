import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getExpoBoothGrid, getExpoById, type BoothData, type ExpoData } from "../../../services/expo.service"
import ExpoFloor2D from "../../../components/booth/ExpoFloor2D"
import ExpoFloor3D from "../../../components/three/ExpoFloor3D"

type ViewMode = "2d" | "3d"

const ExhibitorBoothBookingPage = () => {
    const navigate = useNavigate()
    const { expoId } = useParams()

    const [expo, setExpo] = useState<ExpoData | null>(null)
    const [booths, setBooths] = useState<BoothData[]>([])
    const [gridRows, setGridRows] = useState(0)
    const [gridCols, setGridCols] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("2d")
    const [selected3DBoothId, setSelected3DBoothId] = useState<string | null>(null)

    useEffect(() => {
        if (!expoId) return
        fetchData(expoId)
    }, [expoId])

    const fetchData = async (currentExpoId: string) => {
        try {
            setLoading(true)
            setError("")

            const [expoResponse, boothResponse] = await Promise.all([
                getExpoById(currentExpoId),
                getExpoBoothGrid(currentExpoId),
            ])

            if (expoResponse.success) {
                setExpo(expoResponse.data)
            }

            if (boothResponse.success) {
                setBooths(boothResponse.data.booths)
                setGridRows(boothResponse.data.gridRows)
                setGridCols(boothResponse.data.gridCols)
            }
        } catch (err: unknown) {
            const messageText = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load booth grid"
            setError(messageText)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/exhibitor/dashboard")}
                    className="flex items-center gap-2 text-[#a0a0b0] hover:text-white transition mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Exhibitor Dashboard
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Book Your Booth</h1>
                        <p className="text-[#a0a0b0]">{expo?.title || "Loading expo..."}</p>
                    </div>

                    {/* View mode toggle */}
                    {!loading && (
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
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

                {loading && <p className="text-[#a0a0b0]">Loading booth layout...</p>}
                {error && <p className="text-[#f87171] mb-4">{error}</p>}

                {!loading && expoId && viewMode === "2d" && (
                    <div style={{ minHeight: "600px" }}>
                        <ExpoFloor2D
                            booths={booths}
                            gridRows={gridRows}
                            gridCols={gridCols}
                            selectedBoothId={null}
                            onBoothSelect={() => {}}
                            canBook={true}
                            userRole="exhibitor"
                            expoId={expoId}
                        />
                    </div>
                )}

                {!loading && expoId && viewMode === "3d" && (
                    <div className="rounded-2xl overflow-hidden border border-[#a78bfa]/30" style={{ height: "680px" }}>
                        <ExpoFloor3D
                            booths={booths}
                            gridRows={gridRows}
                            gridCols={gridCols}
                            selectedBoothId={selected3DBoothId}
                            onBoothSelect={(boothId) => setSelected3DBoothId(boothId)}
                            canInteract={true}
                            showExhibitorNames={true}
                        />
                    </div>
                )}

                {/* 3D view selected booth hint */}
                {!loading && viewMode === "3d" && selected3DBoothId && (
                    <div className="mt-4 p-4 rounded-xl border border-[#4c9aff]/30 bg-[#4c9aff]/10 flex items-center justify-between">
                        <p className="text-[#93c5fd] text-sm">
                            Booth selected in 3D view. Switch to 2D view to complete your booking.
                        </p>
                        <button
                            onClick={() => setViewMode("2d")}
                            className="px-4 py-2 rounded-lg bg-[#4c9aff] hover:bg-[#3b82f6] text-white text-sm font-semibold transition"
                        >
                            Switch to 2D →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExhibitorBoothBookingPage

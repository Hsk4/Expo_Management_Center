import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getExpoBoothGrid, getExpoById, type BoothData, type ExpoData } from "../../../services/expo.service"
import ExpoFloor2D from "../../../components/booth/ExpoFloor2D"

const ExpoFloorViewPage = () => {
    const navigate = useNavigate()
    const { expoId } = useParams()

    const [expo, setExpo] = useState<ExpoData | null>(null)
    const [booths, setBooths] = useState<BoothData[]>([])
    const [gridRows, setGridRows] = useState(0)
    const [gridCols, setGridCols] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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

            if (expoResponse.success) setExpo(expoResponse.data)
            if (boothResponse.success) {
                setBooths(boothResponse.data.booths)
                setGridRows(boothResponse.data.gridRows)
                setGridCols(boothResponse.data.gridCols)
            }
        } catch (err: unknown) {
            const messageText = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load expo floor"
            setError(messageText)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/expos")}
                    className="flex items-center gap-2 text-[#a0a0b0] hover:text-white transition mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Expos
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Expo Floor View</h1>
                    <p className="text-[#a0a0b0] mb-2">{expo?.title || "Loading expo..."}</p>
                    {expo && (
                        <div className="flex flex-wrap gap-4 text-sm text-[#707085]">
                            <span>📍 {expo.location}</span>
                            <span>📅 {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {loading && <p className="text-[#a0a0b0]">Loading expo floor...</p>}
                {error && <p className="text-[#f87171] mb-4">{error}</p>}

                {!loading && expoId && (
                    <div style={{ minHeight: "600px" }}>
                        <ExpoFloor2D
                            booths={booths}
                            gridRows={gridRows}
                            gridCols={gridCols}
                            selectedBoothId={null}
                            canBook={false}
                            userRole="attendee"
                            expoId={expoId}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpoFloorViewPage

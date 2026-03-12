import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { BoothData } from "../../services/expo.service"
import BoothDetailsModal from "./BoothDetailsModal"
import BoothApplicationModal from "./BoothApplicationModal"

interface ExpoFloor2DProps {
    booths: BoothData[]
    gridRows: number
    gridCols: number
    selectedBoothId: string | null
    onBoothSelect?: (boothId: string | null) => void
    canBook?: boolean
    userRole?: "attendee" | "exhibitor" | "admin"
    expoId: string
}

const ExpoFloor2D = ({
    booths,
    gridRows,
    gridCols,
    selectedBoothId,
    onBoothSelect,
    canBook = false,
    userRole = "attendee",
    expoId
}: ExpoFloor2DProps) => {
    const [expandedBooth, setExpandedBooth] = useState<BoothData | null>(null)
    const [showApplicationModal, setShowApplicationModal] = useState(false)
    const [hoveredBoothId, setHoveredBoothId] = useState<string | null>(null)

    const companiesAttending = useMemo(() => {
        const companyMap = new Map<string, BoothData>();
        booths
            .filter((b) => b.status === "booked" && b.exhibitorDetails?.companyName)
            .forEach((b) => {
                const key = b.exhibitorDetails?.companyName || b._id;
                if (!companyMap.has(key)) companyMap.set(key, b);
            });
        return Array.from(companyMap.values());
    }, [booths]);

    const getBoothForCell = (row: number, col: number) => {
        return booths.find((booth) => booth.row === row && booth.col === col) || null
    }

    const getBoothColor = (booth: BoothData | null) => {
        if (!booth) return "bg-neutral-900 border-neutral-800"

        if (booth.status === "disabled") return "bg-neutral-800 border-neutral-700"
        if (booth.status === "booked") return "bg-[#f87171] border-[#dc2626]"
        if (booth._id === selectedBoothId) return "bg-[#4c9aff] border-[#3b82f6]"
        if (booth._id === hoveredBoothId) return "bg-[#36d399] border-[#10b981]"
        return "bg-[#36d399]/30 border-[#36d399]"
    }

    const handleBoothClick = (booth: BoothData | null) => {
        if (!booth) return

        // If booth is booked, show details
        if (booth.status === "booked") {
            setExpandedBooth(booth)
            return
        }

        // If exhibitor and booth is available
        if (userRole === "exhibitor" && booth.status === "available" && canBook) {
            setExpandedBooth(booth)
            setShowApplicationModal(true)
            return
        }

        // If attendee and booth is available, just show info
        if (userRole === "attendee" && booth.status === "available") {
            setExpandedBooth(booth)
            return
        }

        // Default: select booth
        if (onBoothSelect && booth.status === "available") {
            onBoothSelect(booth._id)
        }
    }

    const handleCloseModal = () => {
        setExpandedBooth(null)
        setShowApplicationModal(false)
    }

    return (
        <div className="relative w-full h-full bg-[#0a0a0f] rounded-xl p-6 overflow-auto">
            {/* Legend */}
            <div className="mb-6 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#36d399]/30 border border-[#36d399]" />
                    <span className="text-[#a0a0b0]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#f87171] border border-[#dc2626]" />
                    <span className="text-[#a0a0b0]">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#4c9aff] border border-[#3b82f6]" />
                    <span className="text-[#a0a0b0]">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700" />
                    <span className="text-[#a0a0b0]">Disabled</span>
                </div>
            </div>

            {/* Main Stage */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a78bfa] border border-[#4c9aff]/30 text-center">
                <h3 className="text-xl font-bold text-white">🎤 MAIN STAGE</h3>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-2 items-center">
                {Array.from({ length: gridRows }).map((_, rowIndex) => {
                    const row = rowIndex + 1
                    return (
                        <div key={row} className="flex gap-2">
                            {Array.from({ length: gridCols }).map((__, colIndex) => {
                                const col = colIndex + 1
                                const booth = getBoothForCell(row, col)

                                if (!booth) {
                                    return (
                                        <div
                                            key={`${row}-${col}`}
                                            className="w-24 h-24 rounded-lg bg-neutral-900/50 border border-neutral-800"
                                        />
                                    )
                                }

                                return (
                                    <motion.button
                                        key={booth._id}
                                        type="button"
                                        onClick={() => handleBoothClick(booth)}
                                        onMouseEnter={() => setHoveredBoothId(booth._id)}
                                        onMouseLeave={() => setHoveredBoothId(null)}
                                        disabled={booth.status === "disabled"}
                                        className={`w-24 h-24 rounded-lg border-2 transition-all ${getBoothColor(booth)} ${
                                            booth.status !== "disabled" ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-50"
                                        }`}
                                        whileHover={booth.status !== "disabled" ? { scale: 1.05 } : {}}
                                        whileTap={booth.status !== "disabled" ? { scale: 0.95 } : {}}
                                    >
                                        <div className="flex flex-col items-center justify-center h-full p-2">
                                            <span className="text-lg font-bold text-white">{booth.boothNumber}</span>
                                            <span className="text-xs text-white/60">
                                                R{booth.row}C{booth.col}
                                            </span>
                                            {booth.status === "booked" && (
                                                <span className="text-xs text-white mt-1">🔒</span>
                                            )}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    )
                })}
            </div>

            {/* Food Stalls */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#fbbf24]/20 border border-[#fbbf24]/50 text-center">
                    <span className="text-2xl">🍕</span>
                    <p className="text-sm text-[#fbbf24] font-semibold mt-1">Food Court</p>
                </div>
                <div className="p-4 rounded-lg bg-[#fbbf24]/20 border border-[#fbbf24]/50 text-center">
                    <span className="text-2xl">☕</span>
                    <p className="text-sm text-[#fbbf24] font-semibold mt-1">Cafe</p>
                </div>
                <div className="p-4 rounded-lg bg-[#fbbf24]/20 border border-[#fbbf24]/50 text-center">
                    <span className="text-2xl">🍔</span>
                    <p className="text-sm text-[#fbbf24] font-semibold mt-1">Snacks</p>
                </div>
            </div>

            {/* Companies Attending */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">Companies Attending</h3>
                {companiesAttending.length === 0 ? (
                    <p className="text-sm text-[#707085]">No approved companies yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {companiesAttending.map((booth) => (
                            <div key={`company-${booth._id}`} className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                                {booth.exhibitorDetails?.bannerImage && (
                                    <img
                                        src={booth.exhibitorDetails.bannerImage}
                                        alt={booth.exhibitorDetails.companyName}
                                        className="w-full h-24 object-cover"
                                    />
                                )}
                                <div className="p-3 space-y-2">
                                    <p className="text-white font-semibold">{booth.exhibitorDetails?.companyName}</p>
                                    <p className="text-xs text-[#a0a0b0]">Booth {booth.boothNumber}</p>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {booth.exhibitorDetails?.website && (
                                            <a href={booth.exhibitorDetails.website} target="_blank" rel="noreferrer" className="text-[#4c9aff] underline">Website</a>
                                        )}
                                        {booth.exhibitorDetails?.linkedin && (
                                            <a href={booth.exhibitorDetails.linkedin} target="_blank" rel="noreferrer" className="text-[#4c9aff] underline">LinkedIn</a>
                                        )}
                                        {booth.exhibitorDetails?.instagram && (
                                            <a href={booth.exhibitorDetails.instagram} target="_blank" rel="noreferrer" className="text-[#4c9aff] underline">Instagram</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booth Details Modal (for booked booths and attendees) */}
            <AnimatePresence>
                {expandedBooth && !showApplicationModal && (
                    <BoothDetailsModal
                        booth={expandedBooth}
                        onClose={handleCloseModal}
                        userRole={userRole}
                    />
                )}
            </AnimatePresence>

            {/* Booth Application Modal (for exhibitors booking) */}
            <AnimatePresence>
                {expandedBooth && showApplicationModal && userRole === "exhibitor" && (
                    <BoothApplicationModal
                        booth={expandedBooth}
                        expoId={expoId}
                        onClose={handleCloseModal}
                        onSuccess={() => {
                            handleCloseModal()
                            // Refresh booths list would be handled by parent
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default ExpoFloor2D

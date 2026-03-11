import { motion } from "framer-motion"
import type { BoothData } from "../../services/expo.service"

interface BoothDetailsModalProps {
    booth: BoothData
    onClose: () => void
    userRole: "attendee" | "exhibitor" | "admin"
}

const linkItem = (label: string, href?: string) => {
    if (!href) return null
    return (
        <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[#4c9aff] hover:text-[#a78bfa] text-sm underline"
        >
            {label}
        </a>
    )
}

const BoothDetailsModal = ({ booth, onClose, userRole }: BoothDetailsModalProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 100 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#0a0a0f] border border-[#4c9aff]/30 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Booth {booth.boothNumber}</h2>
                        <p className="text-[#a0a0b0]">Row {booth.row}, Column {booth.col}</p>
                    </div>
                    <button onClick={onClose} className="text-[#a0a0b0] hover:text-white transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                        booth.status === "available" ? "bg-[#36d399]/20 border border-[#36d399]/50" :
                        booth.status === "booked" ? "bg-[#f87171]/20 border border-[#f87171]/50" :
                        "bg-neutral-800 border border-neutral-700"
                    }`}>
                        <span className={`text-lg ${
                            booth.status === "available" ? "text-[#36d399]" :
                            booth.status === "booked" ? "text-[#f87171]" : "text-[#707085]"
                        }`}>
                            {booth.status === "available" ? "✓" : booth.status === "booked" ? "🔒" : "✗"}
                        </span>
                        <span className={`font-semibold capitalize ${
                            booth.status === "available" ? "text-[#36d399]" :
                            booth.status === "booked" ? "text-[#f87171]" : "text-[#707085]"
                        }`}>{booth.status}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {booth.status === "booked" && booth.exhibitorDetails && (
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-sm font-semibold text-white">Company Information</h3>

                            {booth.exhibitorDetails.bannerImage && (
                                <img
                                    src={booth.exhibitorDetails.bannerImage}
                                    alt={booth.exhibitorDetails.companyName || "Company banner"}
                                    className="w-full h-40 object-cover rounded-lg border border-white/10"
                                />
                            )}

                            <div>
                                <p className="text-white font-semibold text-lg">{booth.exhibitorDetails.companyName || "Exhibitor"}</p>
                                {booth.exhibitorDetails.description && (
                                    <p className="text-[#a0a0b0] text-sm mt-1">{booth.exhibitorDetails.description}</p>
                                )}
                            </div>

                            <div className="text-sm text-[#a0a0b0] space-y-1">
                                {booth.exhibitorDetails.contactName && <p>Contact: {booth.exhibitorDetails.contactName}</p>}
                                {booth.exhibitorDetails.contactEmail && <p>Email: {booth.exhibitorDetails.contactEmail}</p>}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {linkItem("Website", booth.exhibitorDetails.website)}
                                {linkItem("LinkedIn", booth.exhibitorDetails.linkedin)}
                                {linkItem("Instagram", booth.exhibitorDetails.instagram)}
                            </div>
                        </div>
                    )}

                    {booth.status === "booked" && !booth.exhibitorDetails && booth.exhibitorId && (
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold text-white mb-2">Exhibitor Information</h3>
                            <p className="text-[#a0a0b0] text-sm">
                                Exhibitor ID: <span className="text-[#fbbf24]">#{booth.exhibitorId.toString().slice(-6)}</span>
                            </p>
                        </div>
                    )}

                    {booth.status === "available" && (
                        <div className="p-4 rounded-lg bg-[#36d399]/10 border border-[#36d399]/30">
                            <h3 className="text-sm font-semibold text-[#36d399] mb-2">✓ Available for Booking</h3>
                            <p className="text-[#a0a0b0] text-sm">
                                {userRole === "exhibitor" ? "This booth is available! Click on it to submit an application." :
                                "This booth is currently available for exhibitors to book."}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] text-white font-semibold transition shadow-lg"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    )
}

export default BoothDetailsModal

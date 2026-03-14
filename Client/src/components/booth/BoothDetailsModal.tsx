import { motion } from "framer-motion"
import type { BoothData } from "../../services/expo.service"

interface BoothDetailsModalProps {
    booth: BoothData
    onClose: () => void
    userRole: "attendee" | "exhibitor" | "admin"
}

/* ---------- tiny helpers ---------- */

const IconLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#4c9aff] hover:bg-[#4c9aff]/10 hover:border-[#4c9aff]/30 text-xs transition"
    >
        {icon}
        {label}
    </a>
)

const WebsiteIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
)

const LinkedInIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
    </svg>
)

const InstagramIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
)

/* ---------------------------------- */

const BoothDetailsModal = ({ booth, onClose, userRole }: BoothDetailsModalProps) => {
    const ed = booth.exhibitorDetails

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
                className="bg-[#0a0a0f] border border-[#4c9aff]/30 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex justify-between items-start p-8 pb-5 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-white">Booth {booth.boothNumber}</h2>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                                booth.status === "available"
                                    ? "bg-[#36d399]/15 border-[#36d399]/40 text-[#36d399]"
                                    : booth.status === "booked"
                                    ? "bg-[#f87171]/15 border-[#f87171]/40 text-[#f87171]"
                                    : "bg-neutral-800 border-neutral-700 text-[#707085]"
                            } capitalize`}>{booth.status}</span>
                        </div>
                        <p className="text-[#707085] text-sm">Row {booth.row} · Column {booth.col}</p>
                    </div>
                    <button onClick={onClose} className="text-[#a0a0b0] hover:text-white transition mt-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Scrollable body ─────────────────────────────────── */}
                <div className="overflow-y-auto flex-1 px-8 pb-8 space-y-5">

                    {/* Company card for booked booths */}
                    {booth.status === "booked" && ed && (
                        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">

                            {/* Banner / placeholder */}
                            {ed.bannerImage ? (
                                <img
                                    src={ed.bannerImage}
                                    alt={ed.companyName || "Company banner"}
                                    className="w-full h-44 object-cover"
                                />
                            ) : (
                                <div className="w-full h-32 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
                                    <span className="text-5xl">🏢</span>
                                </div>
                            )}

                            <div className="p-5 space-y-4">

                                {/* Company name */}
                                <div>
                                    <h3 className="text-xl font-bold text-white leading-tight">
                                        {ed.companyName || "Exhibitor"}
                                    </h3>
                                    {ed.description && (
                                        <p className="text-sm text-[#a0a0b0] mt-2 leading-relaxed">{ed.description}</p>
                                    )}
                                </div>

                                {/* Contact row */}
                                {(ed.contactName || ed.contactEmail) && (
                                    <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1.5">
                                        <p className="text-xs font-semibold text-[#707085] uppercase tracking-wider mb-2">Contact</p>
                                        {ed.contactName && (
                                            <div className="flex items-center gap-2 text-sm text-[#d4d4d8]">
                                                <svg className="w-4 h-4 text-[#707085] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {ed.contactName}
                                            </div>
                                        )}
                                        {ed.contactEmail && (
                                            <div className="flex items-center gap-2 text-sm text-[#d4d4d8]">
                                                <svg className="w-4 h-4 text-[#707085] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href={`mailto:${ed.contactEmail}`} className="text-[#4c9aff] hover:underline">
                                                    {ed.contactEmail}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Social / web links */}
                                {(ed.website || ed.linkedin || ed.instagram) && (
                                    <div>
                                        <p className="text-xs font-semibold text-[#707085] uppercase tracking-wider mb-2">Links</p>
                                        <div className="flex flex-wrap gap-2">
                                            {ed.website && <IconLink href={ed.website} icon={<WebsiteIcon />} label="Website" />}
                                            {ed.linkedin && <IconLink href={ed.linkedin} icon={<LinkedInIcon />} label="LinkedIn" />}
                                            {ed.instagram && <IconLink href={ed.instagram} icon={<InstagramIcon />} label="Instagram" />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Booked but no exhibitorDetails object */}
                    {booth.status === "booked" && !ed && booth.exhibitorId && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold text-white mb-2">Exhibitor Information</h3>
                            <p className="text-[#a0a0b0] text-sm">
                                Exhibitor ID: <span className="text-[#fbbf24]">#{booth.exhibitorId.toString().slice(-6)}</span>
                            </p>
                        </div>
                    )}

                    {/* Available booth */}
                    {booth.status === "available" && (
                        <div className="p-4 rounded-xl bg-[#36d399]/10 border border-[#36d399]/30">
                            <h3 className="text-sm font-semibold text-[#36d399] mb-2">✓ Available for Booking</h3>
                            <p className="text-[#a0a0b0] text-sm">
                                {userRole === "exhibitor"
                                    ? "This booth is available! Click on it to submit an application."
                                    : "This booth is currently available for exhibitors to book."}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ─────────────────────────────────────────── */}
                <div className="px-8 pb-8 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] text-white font-semibold transition shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default BoothDetailsModal

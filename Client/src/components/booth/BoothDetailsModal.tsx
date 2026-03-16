import { motion } from "framer-motion"
import { Building2, Globe, Instagram, Linkedin, Mail, UserRound, X } from "lucide-react"
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
    <Globe className="w-3.5 h-3.5" />
)

const LinkedInIcon = () => (
    <Linkedin className="w-3.5 h-3.5" />
)

const InstagramIcon = () => (
    <Instagram className="w-3.5 h-3.5" />
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
                        <X className="w-6 h-6" />
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
                                    <Building2 className="h-12 w-12 text-white/80" />
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
                                                <UserRound className="w-4 h-4 text-[#707085] shrink-0" />
                                                {ed.contactName}
                                            </div>
                                        )}
                                        {ed.contactEmail && (
                                            <div className="flex items-center gap-2 text-sm text-[#d4d4d8]">
                                                <Mail className="w-4 h-4 text-[#707085] shrink-0" />
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

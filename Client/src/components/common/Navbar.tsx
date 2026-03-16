import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ChevronDown, LogOut, Menu, Ticket, UserCog, X } from "lucide-react"
import { useAuth } from "../../contexts/Auth.context"
import { getAttendedExposHistory, type AttendedExpoHistoryItem } from "../../services/expo.service"
import EventSphereLogo from "./EventSphereLogo"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const [attendedHistory, setAttendedHistory] = useState<AttendedExpoHistoryItem[]>([])
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false)
            }
        }

        if (showProfileDropdown) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showProfileDropdown])

    // Fetch attended expos history when dropdown is shown
    useEffect(() => {
        const canHaveHistory = user?.role === "attendee" || user?.role === "exhibitor"

        if (!showProfileDropdown || !canHaveHistory) return

        const fetchHistory = async () => {
            try {
                const response = await getAttendedExposHistory()
                if (response.success) {
                    setAttendedHistory(response.data.slice(0, 3))
                }
            } catch {
                setAttendedHistory([])
            }
        }

        fetchHistory()
    }, [showProfileDropdown, user?.role])

    const scrollToSection = (id: string) => {
        setIsOpen(false)

        // If not on home page, navigate to home first
        if (location.pathname !== "/") {
            navigate("/")
            // Wait for navigation to complete, then scroll
            setTimeout(() => {
                const section = document.getElementById(id)
                section?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        } else {
            // Already on home page, just scroll
            const section = document.getElementById(id)
            section?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleLogout = () => {
        logout()
        setShowProfileDropdown(false)
        navigate("/")
    }

    const isAuthenticated = Boolean(user)
    const canBrowseExpos = user?.role === "attendee" || user?.role === "exhibitor"
    const isExhibitor = user?.role === "exhibitor"

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div onClick={() => navigate("/")} className="cursor-pointer">
                    <EventSphereLogo size="md" />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
                    <button onClick={() => scrollToSection("home")} className="hover:text-white transition">
                        Home
                    </button>
                    <button onClick={() => scrollToSection("about")} className="hover:text-white transition">
                        About
                    </button>
                    {canBrowseExpos && (
                        <button onClick={() => navigate("/expos")} className="hover:text-white transition">
                            Expos
                        </button>
                    )}
                    {isExhibitor && (
                        <button onClick={() => navigate("/exhibitor/dashboard")} className="hover:text-white transition">
                            Exhibitor
                        </button>
                    )}
                    <button onClick={() => scrollToSection("gallery")} className="hover:text-white transition">
                        Gallery
                    </button>
                    <button onClick={() => scrollToSection("support")} className="hover:text-white transition">
                        Support
                    </button>
                </div>

                {/* Desktop Auth Buttons / Profile */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
                                    {user?.email.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-white/10 shadow-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-sm text-neutral-400">Signed in as</p>
                                        <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                        <p className="text-xs text-neutral-500 mt-1 capitalize">{user?.role}</p>
                                    </div>

                                    <div className="py-2">
                                        {canBrowseExpos && (
                                            <button
                                                onClick={() => {
                                                    setShowProfileDropdown(false)
                                                    navigate("/expos")
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                            >
                                                    <span className="inline-flex items-center gap-2"><Ticket className="h-4 w-4" />Attend expo as attendee</span>
                                            </button>
                                        )}

                                        {isExhibitor && (
                                            <button
                                                onClick={() => {
                                                    setShowProfileDropdown(false)
                                                    navigate("/exhibitor/dashboard")
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                            >
                                                    <span className="inline-flex items-center gap-2"><Ticket className="h-4 w-4" />Attend expo as exhibitor and book booth</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false)
                                                navigate("/profile")
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                        >
                                            <span className="inline-flex items-center gap-2"><UserCog className="h-4 w-4" />Profile settings</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false)
                                                navigate("/my-tickets")
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                        >
                                            My tickets & registrations
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false)
                                                navigate("/support")
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                        >
                                            Support & feedback
                                        </button>
                                    </div>

                                    <div className="border-t border-white/10 px-4 py-3">
                                        <p className="text-xs text-neutral-400 mb-2">Recent attended expos</p>
                                        {attendedHistory.length === 0 ? (
                                            <p className="text-xs text-neutral-500">No attended expo history yet.</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {attendedHistory.map((history) => (
                                                    <p key={`${history.expoId._id}-${history.visitedAt}`} className="text-xs text-neutral-300 truncate">
                                                        {history.expoId.title}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-white/10">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                                        >
                                            <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" />Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/attendee/login"
                                className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
                            >
                                Login
                            </Link>

                            <Link
                                to="/attendee/register"
                                className="text-sm px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-6 pb-6 space-y-4 text-neutral-300 bg-neutral-950/95 backdrop-blur-md">
                    <button onClick={() => scrollToSection("home")} className="block w-full text-left">
                        Home
                    </button>
                    <button onClick={() => scrollToSection("about")} className="block w-full text-left">
                        About
                    </button>
                    {canBrowseExpos && (
                        <button
                            onClick={() => {
                                navigate("/expos")
                                setIsOpen(false)
                            }}
                            className="block w-full text-left"
                        >
                            Expos
                        </button>
                    )}
                    {isExhibitor && (
                        <button
                            onClick={() => {
                                navigate("/exhibitor/dashboard")
                                setIsOpen(false)
                            }}
                            className="block w-full text-left"
                        >
                            Exhibitor
                        </button>
                    )}
                    <button onClick={() => scrollToSection("gallery")} className="block w-full text-left">
                        Gallery
                    </button>
                    <button onClick={() => scrollToSection("support")} className="block w-full text-left">
                        Support
                    </button>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 bg-white/5 rounded-lg">
                                    <p className="text-xs text-neutral-400">Signed in as</p>
                                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate("/profile")
                                        setIsOpen(false)
                                    }}
                                    className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    Profile settings
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/my-tickets")
                                        setIsOpen(false)
                                    }}
                                    className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    My tickets & registrations
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/support")
                                        setIsOpen(false)
                                    }}
                                    className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    Support & feedback
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/attendee/login" className="block">Login</Link>
                                <Link
                                    to="/attendee/register"
                                    className="block px-4 py-2 rounded-lg bg-white text-black text-center"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
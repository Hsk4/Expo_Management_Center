import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id)
        section?.scrollIntoView({ behavior: "smooth" })
        setIsOpen(false)
    }

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <div
                    onClick={() => navigate("/")}
                    className="cursor-pointer text-xl font-bold tracking-wide"
                >
                    <span className="text-white">Event</span>
                    <span className="text-neutral-400">Sphere</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
                    <button onClick={() => scrollToSection("home")} className="hover:text-white transition">
                        Home
                    </button>
                    <button onClick={() => scrollToSection("about")} className="hover:text-white transition">
                        About
                    </button>
                    <button onClick={() => scrollToSection("gallery")} className="hover:text-white transition">
                        Gallery
                    </button>
                    <button onClick={() => scrollToSection("support")} className="hover:text-white transition">
                        Support
                    </button>
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
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
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
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
                    <button onClick={() => scrollToSection("gallery")} className="block w-full text-left">
                        Gallery
                    </button>
                    <button onClick={() => scrollToSection("support")} className="block w-full text-left">
                        Support
                    </button>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                        <Link to="/attendee/login" className="block">
                            Login
                        </Link>
                        <Link
                            to="/attendee/register"
                            className="block px-4 py-2 rounded-lg bg-white text-black text-center"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
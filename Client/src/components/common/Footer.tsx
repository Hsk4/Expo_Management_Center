import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-neutral-950 text-neutral-400">
            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">
                            EventSphere
                        </h3>
                        <p className="text-sm leading-relaxed">
                            A modern multi-expo management platform connecting
                            organizers, exhibitors, and attendees in one seamless
                            real-time system.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-white font-medium mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#home" className="hover:text-white transition">Home</a></li>
                            <li><a href="#about" className="hover:text-white transition">About</a></li>
                            <li><a href="#gallery" className="hover:text-white transition">Gallery</a></li>
                            <li><a href="#support" className="hover:text-white transition">Support</a></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-white font-medium mb-4">Account</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/attendee/login" className="hover:text-white transition">Attendee Login</Link></li>
                            <li><Link to="/exhibitor/login" className="hover:text-white transition">Exhibitor Login</Link></li>
                            <li><Link to="/admin/login" className="hover:text-white transition">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-medium mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Email: support@eventsphere.com</li>
                            <li>Phone: +92 300 0000000</li>
                            <li>Karachi, Pakistan</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/10 text-sm text-center">
                    © {new Date().getFullYear()} EventSphere. All rights reserved.
                </div>

            </div>
        </footer>
    )
}

export default Footer
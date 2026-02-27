import { motion } from "framer-motion"

const ShowcaseSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-6">

            <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Built for Modern
                        <span className="block text-neutral-400">
              Expo Management
            </span>
                    </h2>

                    <p className="text-neutral-400 leading-relaxed">
                        EventSphere is engineered to handle multiple expos,
                        real-time approvals, booth allocation systems,
                        interactive schedules, and advanced analytics —
                        all within a secure and scalable architecture.
                    </p>

                    <ul className="space-y-3 text-neutral-300">
                        <li>✔ Multi-Expo Support</li>
                        <li>✔ Role-Based Access Control</li>
                        <li>✔ Real-Time System Updates</li>
                        <li>✔ Scalable SaaS Architecture</li>
                    </ul>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="rounded-2xl overflow-hidden border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80"
                            alt="Expo System"
                            className="w-full h-[400px] object-cover"
                        />
                    </div>

                    {/* Soft Glow */}
                    <div className="absolute -z-10 w-80 h-80 bg-white/10 rounded-full blur-3xl -bottom-20 -right-20" />
                </motion.div>

            </div>
        </div>
    )
}

export default ShowcaseSection
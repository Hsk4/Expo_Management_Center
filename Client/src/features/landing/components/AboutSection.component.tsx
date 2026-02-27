const AboutSection = () => {
    return (
        <div className="max-w-6xl mx-auto px-6">

            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold">
                    About <span className="text-neutral-400">EventSphere</span>
                </h2>
                <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
                    Transforming traditional expo management into a seamless,
                    intelligent, and real-time digital experience.
                </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* Left: Description */}
                <div className="space-y-6 text-neutral-300 leading-relaxed">
                    <p>
                        EventSphere is a modern multi-expo management platform designed
                        to simplify the complex coordination between organizers,
                        exhibitors, and attendees.
                    </p>

                    <p>
                        Traditional expo systems rely heavily on manual processes,
                        disconnected communication, and delayed updates. EventSphere
                        replaces that with real-time synchronization, smart booth
                        allocation, interactive scheduling, and centralized analytics.
                    </p>

                    <p>
                        Whether you are hosting an expo, showcasing your brand, or
                        attending sessions — everything happens in one integrated system.
                    </p>
                </div>

                {/* Right: Feature Highlights */}
                <div className="grid sm:grid-cols-2 gap-6">

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                        <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                        <p className="text-sm text-neutral-400">
                            Live booth status, session updates, and instant approvals.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                        <h3 className="font-semibold mb-2">Smart Booth Allocation</h3>
                        <p className="text-sm text-neutral-400">
                            Efficient floor plan management and exhibitor assignment.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                        <h3 className="font-semibold mb-2">Interactive Scheduling</h3>
                        <p className="text-sm text-neutral-400">
                            Manage sessions, speakers, and bookmarks effortlessly.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                        <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                        <p className="text-sm text-neutral-400">
                            Track engagement, popularity, and expo performance metrics.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default AboutSection
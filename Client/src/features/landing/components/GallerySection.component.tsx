import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const galleryImages = [
    "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
]

const GallerySection = () => {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])

    return (
        <div ref={ref} className="max-w-7xl mx-auto px-6">

            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Expo <span className="text-neutral-400">Gallery</span>
                </h2>
                <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
                    A glimpse into the dynamic experiences powered by EventSphere.
                </p>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryImages.map((src, index) => (
                    <motion.div
                        key={index}
                        style={{ y }}
                        className="relative group overflow-hidden rounded-2xl border border-white/10"
                    >
                        <img
                            src={`${src}?auto=format&fit=crop&w=800&q=80`}
                            alt="Expo"
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
              <span className="text-white font-medium">
                Live Expo Experience
              </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default GallerySection
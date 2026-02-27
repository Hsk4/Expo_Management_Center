import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
    children: ReactNode
    delay?: number
}

const Reveal = ({ children, delay = 0 }: RevealProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.8,
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    )
}

export default Reveal
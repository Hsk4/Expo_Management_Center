import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

const GlassCard = ({ children }: Props) => {
    return (
        <div
            className="relative z-10 backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            style={{
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
        >
            {children}
        </div>
    )
}

export default GlassCard
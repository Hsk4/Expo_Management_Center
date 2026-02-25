import type { ReactNode } from "react"
import BackgroundScene from "../three/BackgroundScene"
import GlassCard from "../ui/GlassCard"

interface Props {
    title: string
    accent: string
    children: ReactNode
}

const AuthLayout = ({ title, accent, children }: Props) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden px-4">
            <BackgroundScene />

            <div className="w-full max-w-md animate-fadeIn">
                {/* Branding */}
                <div className="text-center mb-6">
                    <h2 className={`text-3xl font-bold ${accent}`}>
                        EventSphere
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                        Expo Management Platform
                    </p>
                </div>

                <GlassCard>
                    <h1 className={`text-xl font-semibold mb-6 text-center ${accent}`}>
                        {title}
                    </h1>
                    {children}
                </GlassCard>
            </div>
        </div>
    )
}

export default AuthLayout
import { Orbit, Sparkles } from "lucide-react";

interface EventSphereLogoProps {
    className?: string;
    size?: "sm" | "md";
}

const sizeMap = {
    sm: {
        orb: "h-8 w-8",
        text: "text-lg",
        spark: "h-3.5 w-3.5",
    },
    md: {
        orb: "h-10 w-10",
        text: "text-xl",
        spark: "h-4 w-4",
    },
};

export default function EventSphereLogo({ className = "", size = "md" }: EventSphereLogoProps) {
    const s = sizeMap[size];

    return (
        <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
            <div className={`relative ${s.orb} rounded-full bg-gradient-to-br from-blue-500/90 via-violet-500/80 to-fuchsia-500/80 border border-white/20 shadow-lg shadow-blue-500/25 grid place-items-center`}>
                <Orbit className="h-4 w-4 text-white" strokeWidth={2.2} />
                <Sparkles className={`absolute -right-1 -top-1 ${s.spark} text-cyan-300`} strokeWidth={2.4} />
            </div>
            <div className={`font-bold tracking-wide ${s.text}`}>
                <span className="text-white">Event</span>
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Sphere</span>
            </div>
        </div>
    );
}


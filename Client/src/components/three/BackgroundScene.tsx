import { useEffect, useRef } from "react"
import * as THREE from "three"

const BackgroundScene = () => {
    const mountRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!mountRef.current) return

        const PARTICLE_COUNT = 900
        const TARGET_FPS = 30
        const FRAME_MS = 1000 / TARGET_FPS
        const PIXEL_RATIO_CAP = 1.5

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            powerPreference: "high-performance"
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP))

        // Ensure canvas has proper styling
        const canvas = renderer.domElement
        canvas.style.display = 'block'
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'

        mountRef.current.appendChild(canvas)

        const geometry = new THREE.BufferGeometry()
        const vertices = []

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            vertices.push(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            )
        }

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        )

        // Create circular texture for round particles
        const textureCanvas = document.createElement('canvas')
        textureCanvas.width = 64
        textureCanvas.height = 64
        const ctx = textureCanvas.getContext('2d')!
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(32, 32, 32, 0, Math.PI * 2)
        ctx.fill()

        const texture = new THREE.CanvasTexture(textureCanvas)

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            sizeAttenuation: true,
            map: texture,
            transparent: true,
            depthWrite: false
        })

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        camera.position.z = 5

        let animationId: number
        let lastFrameTime = 0

        const animate = (now: number) => {
            animationId = requestAnimationFrame(animate)

            if (document.hidden || now - lastFrameTime < FRAME_MS) return
            lastFrameTime = now

            particles.rotation.y += 0.0005
            renderer.render(scene, camera)
        }

        animate(0)

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP))
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
            geometry.dispose()
            material.dispose()
            texture.dispose()
            renderer.dispose()
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <div
            className="fixed inset-0 opacity-80"
            ref={mountRef}
            style={{
                pointerEvents: 'none',
                width: '100vw',
                height: '100vh',
                zIndex: 0
            }}
        />
    )
}

export default BackgroundScene
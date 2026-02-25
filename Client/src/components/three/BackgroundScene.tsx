import { useEffect, useRef } from "react"
import * as THREE from "three"

const BackgroundScene = () => {
    const mountRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!mountRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)

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

        for (let i = 0; i < 1500; i++) {
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

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            sizeAttenuation: true,
        })

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        camera.position.z = 5

        let animationId: number

        const animate = () => {
            animationId = requestAnimationFrame(animate)
            particles.rotation.y += 0.0005
            renderer.render(scene, camera)
        }

        animate()

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
            geometry.dispose()
            material.dispose()
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
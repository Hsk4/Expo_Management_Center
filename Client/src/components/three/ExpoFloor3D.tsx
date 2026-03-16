import { useEffect, useRef, useState } from "react"
import { Lightbulb } from "lucide-react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js"
import type { BoothData } from "../../services/expo.service"

interface ExpoFloor3DProps {
    booths: BoothData[]
    gridRows: number
    gridCols: number
    selectedBoothId: string | null
    onBoothSelect?: (boothId: string | null) => void
    canInteract?: boolean
    showExhibitorNames?: boolean
}

const ExpoFloor3D = ({
    booths,
    gridRows,
    gridCols,
    selectedBoothId,
    onBoothSelect,
    canInteract = true,
    showExhibitorNames = false,
}: ExpoFloor3DProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const controlsRef = useRef<OrbitControls | null>(null)
    const pointerLockControlsRef = useRef<PointerLockControls | null>(null)
    const boothMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
    const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
    const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
    const moveDirectionRef = useRef<THREE.Vector3>(new THREE.Vector3())
    const strafeDirectionRef = useRef<THREE.Vector3>(new THREE.Vector3())
    const hoveredBoothRef = useRef<string | null>(null)
    const isPointerInCanvasRef = useRef(false)
    const pointerDirtyRef = useRef(false)
    const lastRaycastAtRef = useRef(0)
    const [hoveredBoothId, setHoveredBoothId] = useState<string | null>(null)
    const [previewBooth, setPreviewBooth] = useState<BoothData | null>(null)
    const [walkthroughMode, setWalkthroughMode] = useState(false)
    const [showMiniMap, setShowMiniMap] = useState(true)
    const keysPressed = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (!containerRef.current) return

        // Wait for container to have dimensions
        if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) {
            return
        }

        // Scene setup with admin dashboard colors
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0a0a0f) // --bg-main from admin
        scene.fog = new THREE.Fog(0x0a0a0f, 40, 180)
        sceneRef.current = scene

        // Camera with optimized FOV
        const camera = new THREE.PerspectiveCamera(
            65,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        )
        camera.position.set(gridCols * 3, gridRows * 2.5, gridCols * 3)
        camera.lookAt(gridCols * 1.5, 0, gridRows * 1.5)
        cameraRef.current = camera

        // Renderer with enhanced quality
        const renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio <= 1.5,
            alpha: true,
            powerPreference: "high-performance"
        })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.1

        // Ensure canvas fills container
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        renderer.domElement.style.display = 'block'
        renderer.domElement.style.touchAction = 'none' // Enable touch gestures
        renderer.domElement.style.pointerEvents = 'auto' // Ensure mouse events work

        containerRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // Enhanced Controls for smoother experience
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enabled = true // Explicitly enable controls
        controls.enableDamping = true
        controls.dampingFactor = 0.08 // Smoother damping
        controls.minDistance = 8
        controls.maxDistance = 120
        controls.maxPolarAngle = Math.PI / 2.1
        controls.minPolarAngle = Math.PI / 6 // Prevent too low angle
        controls.rotateSpeed = 0.8
        controls.zoomSpeed = 1.2
        controls.panSpeed = 0.8
        controls.enablePan = true
        controls.screenSpacePanning = true
        controls.autoRotate = false
        controls.autoRotateSpeed = 0.5
        controlsRef.current = controls

        // Pointer Lock Controls for first-person walkthrough
        const pointerLockControls = new PointerLockControls(camera, renderer.domElement)
        pointerLockControlsRef.current = pointerLockControls
        scene.add(pointerLockControls.object)

        // Lighting with admin color scheme
        const ambientLight = new THREE.AmbientLight(0xa0a0b0, 0.4) // --text-secondary
        scene.add(ambientLight)

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.9)
        mainLight.position.set(20, 35, 20)
        mainLight.castShadow = true
        mainLight.shadow.mapSize.width = 1024
        mainLight.shadow.mapSize.height = 1024
        mainLight.shadow.camera.far = 120
        mainLight.shadow.bias = -0.0001
        scene.add(mainLight)

        // Accent lights matching admin dashboard
        const spotlight1 = new THREE.SpotLight(0x4c9aff, 0.7) // --accent-blue
        spotlight1.position.set(gridCols * 1.5, 18, -5)
        spotlight1.angle = Math.PI / 4
        spotlight1.penumbra = 0.4
        spotlight1.decay = 2
        scene.add(spotlight1)

        const spotlight2 = new THREE.SpotLight(0xa78bfa, 0.5) // --accent-purple
        spotlight2.position.set(-5, 18, gridRows * 1.5)
        spotlight2.angle = Math.PI / 5
        spotlight2.penumbra = 0.5
        spotlight2.decay = 2
        scene.add(spotlight2)

        // Fill light for better visibility
        const fillLight = new THREE.HemisphereLight(0x4c9aff, 0x0a0a0f, 0.3)
        scene.add(fillLight)

        // Floor with admin color scheme
        const floorGeometry = new THREE.PlaneGeometry(gridCols * 4, gridRows * 4)
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x0f0f14, // Slightly lighter than bg-main
            roughness: 0.7,
            metalness: 0.3,
        })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.1
        floor.receiveShadow = true
        scene.add(floor)

        // Grid lines with subtle accent
        const gridHelper = new THREE.GridHelper(
            Math.max(gridCols, gridRows) * 4,
            Math.max(gridCols, gridRows) * 2,
            0x4c9aff, // --accent-blue
            0x1a1a24  // Subtle grid
        )
        gridHelper.position.y = -0.05
        gridHelper.material.opacity = 0.15
        gridHelper.material.transparent = true
        scene.add(gridHelper)

        // Main Stage with admin purple accent
        const stageWidth = gridCols * 2.5
        const stageDepth = 2
        const stageHeight = 0.5

        const stageGeometry = new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth)
        const stageMaterial = new THREE.MeshStandardMaterial({
            color: 0x6366f1, // Purple-blue
            roughness: 0.3,
            metalness: 0.6,
            emissive: 0x4c9aff,
            emissiveIntensity: 0.2
        })
        const stage = new THREE.Mesh(stageGeometry, stageMaterial)
        stage.position.set(gridCols * 1.5, stageHeight / 2, -2)
        stage.castShadow = true
        stage.receiveShadow = true
        scene.add(stage)

        // Stage backdrop with gradient effect
        const backdropGeometry = new THREE.BoxGeometry(stageWidth, 4, 0.2)
        const backdropMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a4a,
            roughness: 0.4,
            emissive: 0xa78bfa, // --accent-purple
            emissiveIntensity: 0.15
        })
        const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial)
        backdrop.position.set(gridCols * 1.5, 2, -3)
        backdrop.castShadow = true
        scene.add(backdrop)

        // Stage label
        createTextLabel("MAIN STAGE", gridCols * 1.5, 4.5, -3, scene, 0xffffff)

        // Food stalls (in the middle)
        const centerRow = Math.floor(gridRows / 2)
        const centerCol = Math.floor(gridCols / 2)

        createFoodStall(centerCol * 3 - 4, centerRow * 3, scene, "Food")
        createFoodStall(centerCol * 3 + 1, centerRow * 3, scene, "Cafe")
        createFoodStall(centerCol * 3 - 1.5, centerRow * 3 + 3, scene, "Snacks")

        // Cleanup
        return () => {
            controls.dispose()
            pointerLockControls.unlock()
            pointerLockControls.disconnect()

            scene.traverse((obj) => {
                disposeObject3D(obj)
            })

            renderer.dispose()
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement)
            }
        }
    }, [gridRows, gridCols])

    // Create booths
    useEffect(() => {
        if (!sceneRef.current) return

        // Clear existing booth meshes
        boothMeshesRef.current.forEach((mesh) => {
            sceneRef.current?.remove(mesh)
            disposeObject3D(mesh)
        })
        boothMeshesRef.current.clear()

        // Create booth meshes
        booths.forEach((booth) => {
            const boothMesh = createBoothMesh(booth, showExhibitorNames)
            if (boothMesh) {
                boothMesh.userData = { boothId: booth._id, booth }
                sceneRef.current?.add(boothMesh)
                boothMeshesRef.current.set(booth._id, boothMesh)
            }
        })
    }, [booths, showExhibitorNames])

    // Update booth colors based on selection/hover
    useEffect(() => {
        boothMeshesRef.current.forEach((mesh, boothId) => {
            const booth = mesh.userData.booth as BoothData
            const material = mesh.material as THREE.MeshStandardMaterial

            if (boothId === selectedBoothId) {
                material.color.setHex(0x4c9aff) // --accent-blue (selected)
                material.emissive.setHex(0x3b82f6)
                material.emissiveIntensity = 0.4
            } else if (boothId === hoveredBoothId && booth.status === "available" && canInteract) {
                material.color.setHex(0x36d399) // --accent-green (hover)
                material.emissive.setHex(0x10b981)
                material.emissiveIntensity = 0.3
            } else {
                // Default colors based on status (admin dashboard colors)
                if (booth.status === "available") {
                    material.color.setHex(0x36d399) // --accent-green
                    material.emissive.setHex(0x059669)
                    material.emissiveIntensity = 0.15
                } else if (booth.status === "booked") {
                    material.color.setHex(0xf87171) // --accent-red
                    material.emissive.setHex(0xdc2626)
                    material.emissiveIntensity = 0.15
                } else {
                    material.color.setHex(0x4b5563) // Disabled gray
                    material.emissive.setHex(0x1f2937)
                    material.emissiveIntensity = 0.05
                }
            }
        })
    }, [selectedBoothId, hoveredBoothId, canInteract])

    // Mouse interaction
    useEffect(() => {
        if (!containerRef.current || !canInteract) return

        const handleMouseMove = (event: MouseEvent) => {
            const rect = containerRef.current!.getBoundingClientRect()
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            pointerDirtyRef.current = true
        }

        const handleMouseEnter = () => {
            isPointerInCanvasRef.current = true
            pointerDirtyRef.current = true
        }

        const handleMouseLeave = () => {
            isPointerInCanvasRef.current = false
            pointerDirtyRef.current = false
            hoveredBoothRef.current = null
            setHoveredBoothId(null)
            document.body.style.cursor = "default"
        }

        const handleClick = () => {
            if (!sceneRef.current || !cameraRef.current || walkthroughMode) return

            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
            const intersects = raycasterRef.current.intersectObjects(
                Array.from(boothMeshesRef.current.values())
            )

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object as THREE.Mesh
                const booth = clickedMesh.userData.booth as BoothData

                if (booth.status === "available" && onBoothSelect) {
                    onBoothSelect(booth._id)
                }
            }
        }

        const handleRightClick = (event: MouseEvent) => {
            event.preventDefault()
            if (!sceneRef.current || !cameraRef.current || walkthroughMode) return

            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
            const intersects = raycasterRef.current.intersectObjects(
                Array.from(boothMeshesRef.current.values())
            )

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object as THREE.Mesh
                const booth = clickedMesh.userData.booth as BoothData
                setPreviewBooth(booth)
            }
        }

        containerRef.current.addEventListener("mousemove", handleMouseMove)
        containerRef.current.addEventListener("mouseenter", handleMouseEnter)
        containerRef.current.addEventListener("mouseleave", handleMouseLeave)
        containerRef.current.addEventListener("click", handleClick)
        containerRef.current.addEventListener("contextmenu", handleRightClick)

        return () => {
            containerRef.current?.removeEventListener("mousemove", handleMouseMove)
            containerRef.current?.removeEventListener("mouseenter", handleMouseEnter)
            containerRef.current?.removeEventListener("mouseleave", handleMouseLeave)
            containerRef.current?.removeEventListener("click", handleClick)
            containerRef.current?.removeEventListener("contextmenu", handleRightClick)
        }
    }, [canInteract, onBoothSelect, walkthroughMode])

    // Keyboard controls for walkthrough mode
    useEffect(() => {
        if (!walkthroughMode) return

        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current.add(event.key.toLowerCase())
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current.delete(event.key.toLowerCase())
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [walkthroughMode])

    // Toggle walkthrough mode
    const toggleWalkthroughMode = () => {
        if (!cameraRef.current || !pointerLockControlsRef.current || !controlsRef.current) return

        if (!walkthroughMode) {
            // Enter walkthrough mode
            pointerLockControlsRef.current.lock()
            controlsRef.current.enabled = false
            cameraRef.current.position.y = 1.6 // Eye level
            setWalkthroughMode(true)
        } else {
            // Exit walkthrough mode
            pointerLockControlsRef.current.unlock()
            controlsRef.current.enabled = true
            setWalkthroughMode(false)
        }
    }

    // Listen for pointer lock changes
    useEffect(() => {
        if (!pointerLockControlsRef.current) return

        const handleLockChange = () => {
            if (!document.pointerLockElement) {
                setWalkthroughMode(false)
                if (controlsRef.current) {
                    controlsRef.current.enabled = true
                }
            }
        }

        document.addEventListener("pointerlockchange", handleLockChange)
        return () => document.removeEventListener("pointerlockchange", handleLockChange)
    }, [])

    // Animation loop
    useEffect(() => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return

        let animationId: number
        const TARGET_FRAME_MS = 1000 / 60
        const RAYCAST_INTERVAL_MS = 48
        let lastFrameAt = 0

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate)

            if (document.hidden || time - lastFrameAt < TARGET_FRAME_MS) return
            lastFrameAt = time

            // Walkthrough movement with sprint support
            if (walkthroughMode && pointerLockControlsRef.current?.isLocked && cameraRef.current) {
                const baseSpeed = 0.15
                const sprintMultiplier = keysPressed.current.has("shift") ? 2 : 1
                const speed = baseSpeed * sprintMultiplier
                const direction = moveDirectionRef.current
                const lateral = strafeDirectionRef.current

                if (keysPressed.current.has("w")) {
                    cameraRef.current.getWorldDirection(direction)
                    direction.y = 0
                    direction.normalize()
                    cameraRef.current.position.addScaledVector(direction, speed)
                }
                if (keysPressed.current.has("s")) {
                    cameraRef.current.getWorldDirection(direction)
                    direction.y = 0
                    direction.normalize()
                    cameraRef.current.position.addScaledVector(direction, -speed)
                }
                if (keysPressed.current.has("a")) {
                    cameraRef.current.getWorldDirection(direction)
                    direction.y = 0
                    direction.normalize()
                    lateral.set(-direction.z, 0, direction.x)
                    cameraRef.current.position.addScaledVector(lateral, speed)
                }
                if (keysPressed.current.has("d")) {
                    cameraRef.current.getWorldDirection(direction)
                    direction.y = 0
                    direction.normalize()
                    lateral.set(direction.z, 0, -direction.x)
                    cameraRef.current.position.addScaledVector(lateral, speed)
                }

                // Boundary checking - keep within expo floor
                const boundary = Math.max(gridCols, gridRows) * 2
                cameraRef.current.position.x = Math.max(-boundary, Math.min(boundary, cameraRef.current.position.x))
                cameraRef.current.position.z = Math.max(-boundary, Math.min(boundary, cameraRef.current.position.z))

                // Keep camera at eye level
                cameraRef.current.position.y = 1.6
            }

            // Always update controls when not in walkthrough mode
            if (controlsRef.current) {
                if (walkthroughMode) {
                    controlsRef.current.enabled = false
                } else {
                    controlsRef.current.enabled = true
                    controlsRef.current.update()
                }
            }

            // Raycasting for hover effect
            if (sceneRef.current && cameraRef.current && canInteract && !walkthroughMode) {
                const now = performance.now()
                if (isPointerInCanvasRef.current && (pointerDirtyRef.current || now - lastRaycastAtRef.current >= RAYCAST_INTERVAL_MS)) {
                    pointerDirtyRef.current = false
                    lastRaycastAtRef.current = now

                    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
                    const intersects = raycasterRef.current.intersectObjects(
                        Array.from(boothMeshesRef.current.values()),
                        false
                    )

                    const nextHoveredId = intersects.length > 0
                        ? (() => {
                            const hoveredMesh = intersects[0].object as THREE.Mesh
                            const booth = hoveredMesh.userData.booth as BoothData
                            return booth.status === "available" ? booth._id : null
                        })()
                        : null

                    if (nextHoveredId !== hoveredBoothRef.current) {
                        hoveredBoothRef.current = nextHoveredId
                        setHoveredBoothId(nextHoveredId)
                    }
                    document.body.style.cursor = nextHoveredId ? "pointer" : "default"
                }
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current)
            }
        }

        animate(0)

        return () => {
            cancelAnimationFrame(animationId)
            document.body.style.cursor = "default"
        }
    }, [canInteract, walkthroughMode, gridRows, gridCols])

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

            const width = containerRef.current.clientWidth
            const height = containerRef.current.clientHeight

            cameraRef.current.aspect = width / height
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(width, height)
            rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="relative w-full h-full" style={{ touchAction: 'none' }}>
            <div
                ref={containerRef}
                className="w-full h-full rounded-xl"
                style={{
                    overflow: 'hidden',
                    cursor: walkthroughMode ? 'none' : 'grab',
                    userSelect: 'none'
                }}
            />

            {/* Control Panel with admin colors */}
            <div className="absolute top-4 left-4 space-y-2 pointer-events-auto z-10">
                <button
                    onClick={toggleWalkthroughMode}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] text-white text-sm font-semibold shadow-lg transition flex items-center gap-2"
                    title={walkthroughMode ? "Exit First-Person Mode (ESC)" : "Enter First-Person Mode"}
                >
                    {walkthroughMode ? (
                        <>
                            <span>🚶</span>
                            <span>Exit Walkthrough</span>
                        </>
                    ) : (
                        <>
                            <span>👁️</span>
                            <span>First-Person View</span>
                        </>
                    )}
                </button>

                <button
                    onClick={() => setShowMiniMap(!showMiniMap)}
                    className="px-4 py-2 rounded-lg bg-[#a78bfa] hover:bg-[#9333ea] text-white text-sm font-semibold shadow-lg transition flex items-center gap-2"
                    title="Toggle Mini-Map"
                >
                    <span>🗺️</span>
                    <span>{showMiniMap ? "Hide" : "Show"} Mini-Map</span>
                </button>

                {!walkthroughMode && controlsRef.current && (
                    <button
                        onClick={() => {
                            if (controlsRef.current) {
                                controlsRef.current.autoRotate = !controlsRef.current.autoRotate
                            }
                        }}
                        className="px-4 py-2 rounded-lg bg-[#36d399] hover:bg-[#10b981] text-white text-sm font-semibold shadow-lg transition flex items-center gap-2"
                        title="Auto-rotate camera"
                    >
                        <span>🔄</span>
                        <span>Auto Rotate</span>
                    </button>
                )}
            </div>

            {/* Walkthrough Instructions with admin styling */}
            {walkthroughMode && (
                <div className="absolute top-4 right-4 p-4 rounded-lg bg-[#0a0a0f]/95 border border-[#4c9aff]/30 backdrop-blur-md text-white text-sm shadow-lg pointer-events-auto z-10">
                    <h3 className="font-semibold mb-2 text-[#4c9aff]">First-Person Controls</h3>
                    <div className="space-y-1 text-xs text-[#a0a0b0]">
                        <p>🖱️ Mouse: Look around</p>
                        <p><kbd className="px-1 py-0.5 rounded bg-[#4c9aff]/20 text-white">W</kbd> Move forward</p>
                        <p><kbd className="px-1 py-0.5 rounded bg-[#4c9aff]/20 text-white">S</kbd> Move backward</p>
                        <p><kbd className="px-1 py-0.5 rounded bg-[#4c9aff]/20 text-white">A</kbd> Move left</p>
                        <p><kbd className="px-1 py-0.5 rounded bg-[#4c9aff]/20 text-white">D</kbd> Move right</p>
                        <p><kbd className="px-1 py-0.5 rounded bg-[#36d399]/20 text-white">Shift</kbd> Sprint (2x speed)</p>
                        <p><kbd className="px-1 py-0.5 rounded bg-[#f87171]/20 text-white">ESC</kbd> Exit mode</p>
                    </div>
                </div>
            )}

            {/* Mini-Map with admin styling */}
            {showMiniMap && !walkthroughMode && (
                <div className="absolute bottom-4 right-4 w-52 h-52 rounded-lg bg-[#0a0a0f]/95 border border-[#4c9aff]/30 backdrop-blur-md overflow-hidden shadow-2xl pointer-events-auto z-10">
                    <div className="relative w-full h-full p-3">
                        <div className="text-xs text-[#4c9aff] font-semibold mb-2 text-center flex items-center justify-center gap-2">
                            <span>🗺️</span>
                            <span>Expo Map</span>
                        </div>
                        <div className="relative w-full h-full">
                            <svg viewBox={`0 0 ${gridCols * 10} ${gridRows * 10}`} className="w-full h-full">
                                {/* Floor */}
                                <rect x="0" y="0" width={gridCols * 10} height={gridRows * 10} fill="#0f0f14" />

                                {/* Stage with admin purple */}
                                <rect
                                    x={gridCols * 2.5}
                                    y="0"
                                    width={gridCols * 5}
                                    height="10"
                                    fill="#6366f1"
                                    stroke="#4c9aff"
                                    strokeWidth="0.5"
                                />

                                {/* Food stalls with yellow accent */}
                                <circle cx={gridCols * 3.5} cy={gridRows * 5} r="5" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
                                <circle cx={gridCols * 5.5} cy={gridRows * 5} r="5" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />
                                <circle cx={gridCols * 4.5} cy={gridRows * 6} r="5" fill="#fbbf24" stroke="#fff" strokeWidth="0.5" />

                                {/* Booths with admin colors */}
                                {booths.map((booth) => (
                                    <rect
                                        key={booth._id}
                                        x={booth.col * 10 - 4}
                                        y={booth.row * 10 - 4}
                                        width="8"
                                        height="8"
                                        fill={
                                            booth._id === selectedBoothId
                                                ? "#4c9aff" // --accent-blue
                                                : booth.status === "available"
                                                ? "#36d399" // --accent-green
                                                : booth.status === "booked"
                                                ? "#f87171" // --accent-red
                                                : "#4b5563"
                                        }
                                        stroke={booth._id === selectedBoothId ? "#fff" : "rgba(255,255,255,0.3)"}
                                        strokeWidth={booth._id === selectedBoothId ? "1" : "0.5"}
                                    />
                                ))}

                                {/* Camera position indicator */}
                                {cameraRef.current && (
                                    <g>
                                        <circle
                                            cx={(cameraRef.current.position.x / 3) * 10}
                                            cy={(cameraRef.current.position.z / 3) * 10}
                                            r="4"
                                            fill="#4c9aff"
                                            stroke="#ffffff"
                                            strokeWidth="1.5"
                                        />
                                        <circle
                                            cx={(cameraRef.current.position.x / 3) * 10}
                                            cy={(cameraRef.current.position.z / 3) * 10}
                                            r="2"
                                            fill="#ffffff"
                                        />
                                    </g>
                                )}
                            </svg>
                        </div>
                        <div className="text-xs text-[#36d399] mt-2 text-center font-medium">
                            {booths.filter(b => b.status === "available").length} available
                        </div>
                    </div>
                </div>
            )}

            {/* Booth Preview Modal with admin colors */}
            {previewBooth && (
                <div
                    className="absolute inset-0 bg-[#0a0a0f]/70 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setPreviewBooth(null)}
                >
                    <div
                        className="bg-[#0a0a0f]/95 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4 border border-[#4c9aff]/30 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{previewBooth.boothNumber}</h3>
                                <p className="text-sm text-[#a0a0b0]">
                                    Row {previewBooth.row}, Column {previewBooth.col}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewBooth(null)}
                                className="text-[#a0a0b0] hover:text-white transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-sm text-[#a0a0b0]">Status</span>
                                <span className={`text-sm font-semibold capitalize ${
                                    previewBooth.status === "available" 
                                        ? "text-[#36d399]" 
                                        : previewBooth.status === "booked" 
                                        ? "text-[#f87171]" 
                                        : "text-[#707085]"
                                }`}>
                                    {previewBooth.status}
                                </span>
                            </div>

                            {previewBooth.status === "booked" && previewBooth.exhibitorId && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-sm text-[#a0a0b0]">Exhibitor</span>
                                    <span className="text-sm font-semibold text-[#fbbf24]">
                                        Exhibitor #{previewBooth.exhibitorId.toString().slice(-6)}
                                    </span>
                                </div>
                            )}

                            <div className={`p-3 rounded-lg border ${
                                previewBooth.status === "available"
                                    ? "bg-[#36d399]/10 border-[#36d399]/30"
                                    : "bg-[#f87171]/10 border-[#f87171]/30"
                            }`}>
                                <p className={`text-xs ${
                                    previewBooth.status === "available"
                                        ? "text-[#36d399]"
                                        : "text-[#f87171]"
                                }`}>
                                    {previewBooth.status === "available"
                                        ? "✓ This booth is available for booking"
                                        : previewBooth.status === "booked"
                                        ? "✗ This booth has been reserved"
                                        : "This booth is not available"}
                                </p>
                            </div>

                            {previewBooth.status === "available" && canInteract && onBoothSelect && (
                                <button
                                    onClick={() => {
                                        onBoothSelect(previewBooth._id)
                                        setPreviewBooth(null)
                                    }}
                                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] text-white font-semibold transition"
                                >
                                    Select This Booth
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-[#707085] mt-4 text-center">
                            Right-click any booth to preview
                        </p>
                    </div>
                </div>
            )}

            {/* Info tooltip with admin styling */}
            {!walkthroughMode && (
                <div className="absolute bottom-4 left-4 text-xs text-[#a0a0b0] bg-[#0a0a0f]/90 border border-[#4c9aff]/30 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg pointer-events-auto z-10">
                    <span className="inline-flex items-center gap-1"><Lightbulb className="h-3.5 w-3.5 text-[#4c9aff]" />Left-click: Select | Right-click: Preview | Drag: Rotate | Scroll: Zoom</span>
                </div>
            )}
        </div>
    )
}

// Helper function to create booth mesh
function createBoothMesh(booth: BoothData, showExhibitorNames: boolean = false): THREE.Mesh {
    const boothWidth = 2
    const boothDepth = 2
    const boothHeight = 1.5

    const geometry = new THREE.BoxGeometry(boothWidth, boothHeight, boothDepth)
    const material = new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 0.3,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(booth.col * 3, boothHeight / 2, booth.row * 3)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Add booth number text plane
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 80px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(booth.boothNumber, 128, 128)

    const texture = new THREE.CanvasTexture(canvas)
    const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    })
    const textGeometry = new THREE.PlaneGeometry(1.5, 1.5)
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(0, boothHeight / 2 + 0.8, -boothDepth / 2 + 0.01)
    mesh.add(textMesh)

    // Add exhibitor name for booked booths
    if (showExhibitorNames && booth.status === "booked" && booth.exhibitorId) {
        const nameCanvas = document.createElement("canvas")
        nameCanvas.width = 512
        nameCanvas.height = 128
        const nameCtx = nameCanvas.getContext("2d")!
        nameCtx.fillStyle = "#fbbf24"
        nameCtx.font = "bold 40px Arial"
        nameCtx.textAlign = "center"
        nameCtx.textBaseline = "middle"
        // Show last 6 chars of exhibitor ID as placeholder
        nameCtx.fillText(`Exhibitor #${booth.exhibitorId.toString().slice(-6)}`, 256, 64)

        const nameTexture = new THREE.CanvasTexture(nameCanvas)
        const nameMaterial = new THREE.MeshBasicMaterial({
            map: nameTexture,
            transparent: true,
        })
        const nameGeometry = new THREE.PlaneGeometry(2, 0.5)
        const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial)
        nameMesh.position.set(0, boothHeight + 0.3, -boothDepth / 2 + 0.02)
        mesh.add(nameMesh)
    }

    return mesh
}

// Helper function to create food stall
function createFoodStall(x: number, z: number, scene: THREE.Scene, label: string) {
    const stallGeometry = new THREE.BoxGeometry(2.5, 2, 2.5)
    const stallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.6,
        metalness: 0.2,
    })
    const stall = new THREE.Mesh(stallGeometry, stallMaterial)
    stall.position.set(x, 1, z)
    stall.castShadow = true
    stall.receiveShadow = true
    scene.add(stall)

    // Roof
    const roofGeometry = new THREE.ConeGeometry(2, 1, 4)
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.7,
    })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.set(x, 2.5, z)
    roof.rotation.y = Math.PI / 4
    roof.castShadow = true
    scene.add(roof)

    createTextLabel(label, x, 3.5, z, scene, 0xfbbf24)
}

// Helper function to create text label
function createTextLabel(text: string, x: number, y: number, z: number, scene: THREE.Scene, color: number) {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, 256, 64)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(material)
    sprite.position.set(x, y, z)
    sprite.scale.set(4, 1, 1)
    scene.add(sprite)
}

function disposeObject3D(object: THREE.Object3D) {
    const mesh = object as THREE.Mesh
    if (mesh.geometry) {
        mesh.geometry.dispose()
    }

    const maybeMaterial = (mesh as THREE.Mesh).material
    const materials = Array.isArray(maybeMaterial) ? maybeMaterial : maybeMaterial ? [maybeMaterial] : []
    materials.forEach((material) => {
        const materialWithMap = material as THREE.Material & { map?: THREE.Texture }
        materialWithMap.map?.dispose()
        material.dispose()
    })
}

export default ExpoFloor3D


'use client'

import { useCallback, useEffect, useState, useRef, Suspense } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, PerspectiveCamera, Grid } from '@react-three/drei'
import * as THREE from 'three'

function Ball({ phrase, isAnswering, shake }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const { viewport } = useThree()

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, shake.x / 100 * viewport.width, 0.1)
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, shake.y / 100 * viewport.height, 0.1)
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="red" />
            <mesh position={[0, 0, 1]} scale={0.5}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="white" />
                <Text position={[0, 0, 0.6]} fontSize={0.2} color="black">
                    {isAnswering ? "..." : phrase}
                </Text>
            </mesh>
        </mesh>
    )
}

function Scene({ phrase, isAnswering, shake }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
                <Ball phrase={phrase} isAnswering={isAnswering} shake={shake} />
            </Suspense>
            <Grid infiniteGrid />
            <OrbitControls enableZoom={false} enablePan={false} />
        </>
    )
}

export default function EnhancedMagic8Ball3D() {
    const [phrase, setPhrase] = useState("8")
    const [isShaking, setIsShaking] = useState(false)
    const [isAnswering, setIsAnswering] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const shakeControls = useAnimation()

    useEffect(() => {
        setIsClient(true)
    }, [])

    const shake = useCallback(async () => {
        // ... (keep your existing shake function)
    }, [isShaking, isAnswering, shakeControls])

    if (!isClient) return null

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <motion.h1
                className="text-xl font-semibold mb-8 text-black"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ fontFamily: "Arial, sans-serif" }}
            >
                make a wish
            </motion.h1>

            <div style={{ width: '300px', height: '300px' }}>
                <Canvas>
                    <Scene phrase={phrase} isAnswering={isAnswering} shake={shakeControls} />
                </Canvas>
            </div>

            <motion.button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => shake()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Shake
            </motion.button>

            <motion.p
                className="text-lg mt-8 text-black tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontFamily: "Arial, sans-serif" }}
            >
                shake wisely
            </motion.p>
        </div>
    )
}
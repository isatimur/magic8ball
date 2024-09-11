'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Loader2 } from 'lucide-react'


const phrases = [
    "Yes,\nif \nyou \nmake\na\nplan",
    "\nFuck yes!\n",
    "Yes,\nif \nyou \nbelieve",
]

export default function EnhancedMagic8Ball() {
    const [phrase, setPhrase] = useState("8")
    const [isShaking, setIsShaking] = useState(false)
    const [isAnswering, setIsAnswering] = useState(false)
    const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });



    const shakeControls = useAnimation()


    const shake = useCallback(async () => {
        if (isShaking || isAnswering) return

        setIsShaking(true)
        setIsAnswering(true)

        // Add vibration
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }

        const crazyShake = async () => {
            const generateRandomShake = () => ({
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
            })

            const shakeSequence = Array.from({ length: 30 }, generateRandomShake)

            await shakeControls.start({
                x: 0,
                y: 0,
                transition: { duration: 0.3, ease: "easeIn" }
            })

            await shakeControls.start({
                x: shakeSequence.map(point => point.x),
                y: shakeSequence.map(point => point.y),
                transition: {
                    duration: 1.2,
                    times: shakeSequence.map((_, i) => i / (shakeSequence.length - 1)),
                    ease: "linear",
                    repeat: 1,
                    repeatType: "reverse",
                },
            })
            await shakeControls.start({
                x: 0,
                y: 0,
                transition: { duration: 0.3, ease: "easeOut" }
            })
        }

        // Simulate crazy shaking time
        await crazyShake()
        setIsShaking(false)

        // Simulate "thinking" time
        await new Promise(resolve => setTimeout(resolve, 800))

        const newAnswer = phrases[Math.floor(Math.random() * phrases.length)]
        setPhrase(newAnswer)
        setIsAnswering(false)
    }, [isShaking, isAnswering, shakeControls])


    useEffect(() => {
        let lastUpdate = 0;
        const shakeThreshold = 15;

        const handleMotion = (event: DeviceMotionEvent) => {
            const currentTime = new Date().getTime();
            if ((currentTime - lastUpdate) > 100) {
                const { x, y, z } = event.accelerationIncludingGravity || {};
                if (x !== null && y !== null && z !== null) {
                    const diffTime = currentTime - lastUpdate;
                    const speed = Math.abs((x ?? 0) + (y ?? 0) + (z ?? 0) - lastAcceleration.current.x - lastAcceleration.current.y - lastAcceleration.current.z) / diffTime * 10000;

                    if (speed > shakeThreshold) {
                        shake();
                    }

                    lastAcceleration.current = { x: x || 0, y: y || 0, z: z || 0 };
                    lastUpdate = currentTime;
                }
            }
        };

        const setupAccelerometer = async () => {
            if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
                try {
                    const response = await (DeviceMotionEvent as unknown as { requestPermission(): Promise<PermissionState> }).requestPermission();
                    if (response === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    } else {
                        console.log('Permission to use motion sensors denied.');
                    }
                } catch (error) {
                    console.error('Error requesting permission for motion sensors:', error);
                }
            } else if ('DeviceMotionEvent' in window) {
                window.addEventListener('devicemotion', handleMotion);
            }
        };

        setupAccelerometer();

        return () => {
            if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
                window.removeEventListener('devicemotion', handleMotion);
            }
        };
    }, [shake]);



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            {/* Header Text */}
            <motion.h1
                className="text-xl font-semibold mb-8 text-black"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ fontFamily: "Arial, sans-serif" }}
            >
                make a wish
            </motion.h1>

            {/* Magic 8 Ball */}
            <motion.div
                animate={shakeControls}
                initial={{ x: 0, y: 0 }}
            >
                <motion.div
                    className="w-64 h-64 bg-red-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                    onClick={shake}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ perspective: "1000px", marginBottom: '20px' }}  // Moves the triangle down by 20px
                >
                    <motion.div
                        className="w-full h-full rounded-full absolute"
                        style={{
                            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%)",
                        }}
                    />
                    <motion.div
                        className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isAnswering ? (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                                </motion.div>
                            ) : (
                                <>
                                    {phrase === "8" ? (
                                        // Correctly styled and rotated "8"
                                        <motion.span
                                            key="eight"
                                            className="text-black font-bold text-5xl"
                                            style={{
                                                transform: 'rotate(-90deg)', // Rotating 8 by -90 degrees (270 degrees)
                                                fontFamily: "Sevillana, sans-serif",
                                                fontSize: '7rem',
                                                willChange: 'transform, opacity'
                                            }}
                                        >
                                            8
                                        </motion.span>
                                    ) : (
                                        // Text inside upside-down triangle for other answers (SVG version)
                                        <motion.div
                                            key="triangle"
                                            className="relative flex items-center justify-center pt-5"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* SVG Transparent triangle with black borders */}
                                            <svg
                                                width="100"
                                                height="86.6"
                                                viewBox="0 0 100 86.6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ transform: 'rotate(180deg)' }}  // Triangle is rotated
                                            >
                                                <polygon
                                                    points="50,0 100,86.6 0,86.6"
                                                    fill="transparent"
                                                    stroke="black"
                                                    strokeWidth="2"
                                                    strokeLinejoin="miter"
                                                />
                                                <text
                                                    x="50%"
                                                    y="40%"
                                                    fontSize="9"
                                                    fill="black"
                                                    textAnchor="middle"
                                                    fontFamily="Arial, sans-serif"
                                                    transform="rotate(180, 50, 50)" // Rotate the text back to normal
                                                >
                                                    {phrase.split(" ").map((word, idx) => (
                                                        <tspan
                                                            key={idx}
                                                            x="50%"
                                                            dy={`${idx === 0 ? 0 : 12}`} // Move each line down
                                                        >
                                                            {word}
                                                        </tspan>
                                                    ))}
                                                </text>
                                            </svg>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </motion.div>
            {/* Footer Text */}
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

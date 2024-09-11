'use client'

import { useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const phrases = [
    "Yes,\nif\nyou make a plan",
    "\nFuck yes!\n",
    "Yes,\nif\nyou believe",
]

const shakeAnimation = {
    rotateX: [0, 10, 0, 10, 0],
    rotateY: [0, 10, 0, -10, 0],
    rotate: [0, -5, 5, -5, 5, 0],
    x: [0, -10, 10, -10, 10, 0],
    y: [0, -5, 5, -5, 5, 0],
    transition: {
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        repeat: 2,
        repeatType: "loop" as const,
    }
}

export default function EnhancedMagic8Ball() {
    const [phrase, setPhrase] = useState("8")
    const [isShaking, setIsShaking] = useState(false)
    const [isAnswering, setIsAnswering] = useState(false)
    const controls = useAnimation()

    const shake = async () => {
        if (isShaking || isAnswering) return

        setIsShaking(true)
        setIsAnswering(true)
        await controls.start(shakeAnimation)
        setIsShaking(false)

        // Simulate "thinking" time
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newAnswer = phrases[Math.floor(Math.random() * phrases.length)]
        setPhrase(newAnswer)
        setIsAnswering(false)
    }

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
                className="w-64 h-64 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                animate={controls}
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
                    <AnimatePresence mode="wait">
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

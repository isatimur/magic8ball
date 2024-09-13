'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import Image from 'next/image'

const phrases = [
    "Yes, if you\n make\na \nplan",
    "\nFuck yes!\n",
    "Yes, if you\n believe",
]

export default function EnhancedMagic8Ball() {
    const [phrase, setPhrase] = useState("8")
    const [isShaking, setIsShaking] = useState(false)
    const [isAnswering, setIsAnswering] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)



    const shakeControls = useAnimation()


    const shake = useCallback(async () => {
        if (isShaking || isAnswering) return

        setIsShaking(true)
        setIsAnswering(true)
        setShowAnswer(false)

        // Add vibration
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }

        const crazyShake = async () => {
            const generateRandomShake = () => ({
                x: Math.random() * 8 - 8,
                y: Math.random() * 8 - 8,
                z: Math.random() * 8 - 8,
                scale: 1.1,
            })

            const shakeSequence = Array.from({ length: 30 }, generateRandomShake)

            await shakeControls.start({
                x: 0,
                y: 0,
                z: 0,
                scale: 1,
                transition: { duration: 0.3, ease: "linear" }
            })

            await shakeControls.start({
                x: shakeSequence.map(point => point.x),
                y: shakeSequence.map(point => point.y),
                z: shakeSequence.map(point => point.z),
                scale: shakeSequence.map(point => point.scale),
                transition: {
                    duration: 1.0,
                    times: shakeSequence.map((_, i) => i / (shakeSequence.length - 1)),
                    ease: "linear",
                    repeat: 1,
                    repeatType: "reverse",
                },
            })
            await shakeControls.start({
                x: 0,
                y: 0,
                z: 0,
                scale: 1,
                transition: { duration: 0.3, ease: "linear" }
            })
        }

        // Simulate crazy shaking time
        await crazyShake()
        setIsShaking(false)

        // Simulate "thinking" time
        await new Promise(resolve => setTimeout(resolve, 500))

        const newAnswer = phrases[Math.floor(Math.random() * phrases.length)]
        setPhrase(newAnswer)
        setIsAnswering(false)
        setShowAnswer(true)
    }, [isShaking, isAnswering, shakeControls])

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
                className="relative w-[32rem] h-[32rem] cursor-pointer"
                onClick={shake}
                animate={isShaking ? shakeControls : {}}
            >
                <Image
                    src="/8ball.svg"
                    alt="Magic 8 Ball"
                    layout="fill"
                    objectFit="contain"
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {!showAnswer ? (
                            <motion.span
                                key="eight"
                                className="text-black font-bold text-5xl"
                                style={{
                                    transform: 'rotate(-90deg)',
                                    fontFamily: "Sevillana, sans-serif",
                                    fontSize: '9rem',
                                    marginTop: '-8rem',
                                    willChange: 'transform, opacity'
                                }}
                            >
                                8
                            </motion.span>
                        ) : (
                            // Text inside upside-down triangle for other answers (SVG version)
                            <motion.div
                                key="triangle"
                                className="relative flex items-center justify-center pt-5 mb-20 text-4xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* SVG Transparent triangle with black borders */}
                                <svg
                                    width="200"
                                    height="200"
                                    viewBox="0 0 100 100"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ transform: 'rotate(180deg)' }}
                                >
<polygon points="50,18 90,95 9,95" fill="transparent" stroke="black" stroke-width="2"></polygon>
                                    <text
                                        x="50%"
                                        y="17%"
                                        fontSize="10"
                                        fill="black"
                                        textAnchor="middle"
                                        fontFamily="Arial, sans-serif"
                                        transform="rotate(180, 50, 50)"
                                    >
                                        {phrase.split("\n").map((line, idx) => (
                                            <tspan
                                                key={idx}
                                                x="50%"
                                                dy={`${idx === 0 ? 0 : 14}`}
                                            >
                                                {line}
                                            </tspan>
                                        ))}
                                    </text>
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </motion.div>
            {/* Footer Text */}
            <motion.h1
                className="text-xl font-semibold mb-8 text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontFamily: "Arial, sans-serif" }}
            >
                shake wisely
            </motion.h1>
        </div>
    )
}

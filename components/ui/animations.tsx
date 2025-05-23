"use client"

import type React from "react"

import { motion } from "framer-motion"

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SlideUp = ({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const Pulse = ({
  children,
  duration = 2,
  ...props
}: {
  children: React.ReactNode
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

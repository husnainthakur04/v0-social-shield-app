"use client"

import React from "react"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  itemClassName?: string
  staggerDelay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
}

export function AnimatedList({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1,
  duration = 0.5,
  threshold = 0.1,
  rootMargin = "0px",
}: AnimatedListProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
      },
    },
  }

  // Clone children and wrap them in motion.div
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child

    return (
      <motion.div variants={itemVariants} className={cn(itemClassName)} custom={index} key={index}>
        {child}
      </motion.div>
    )
  })

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={cn(className)}
    >
      {animatedChildren}
    </motion.div>
  )
}

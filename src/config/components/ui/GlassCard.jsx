import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick,
  ...props 
}) => {
  const baseClasses = `
    backdrop-blur-xl bg-glass-gradient 
    border border-white/20 rounded-2xl 
    shadow-lg hover:shadow-xl 
    transition-all duration-300
  `
  
  const hoverClasses = hover ? 'hover:bg-white/10 hover:border-white/30' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(baseClasses, hoverClasses, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard

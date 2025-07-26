import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const NeonButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-neon-green to-emerald-400 
      text-gray-900 font-semibold
      shadow-lg shadow-neon-green/25
      hover:shadow-neon-green/40 hover:shadow-xl
      active:scale-95
    `,
    secondary: `
      bg-gradient-to-r from-neon-blue to-blue-400 
      text-white font-semibold
      shadow-lg shadow-neon-blue/25
      hover:shadow-neon-blue/40 hover:shadow-xl
      active:scale-95
    `,
    outline: `
      border-2 border-neon-green bg-transparent 
      text-neon-green font-semibold
      hover:bg-neon-green hover:text-gray-900
      active:scale-95
    `,
    ghost: `
      bg-transparent text-gray-300 font-medium
      hover:bg-white/10 hover:text-white
      active:scale-95
    `
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  }
  
  const baseClasses = `
    inline-flex items-center justify-center
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </motion.button>
  )
}

export default NeonButton

import React from 'react'
import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'up',
  className = '' 
}) => {
  const trendColors = {
    up: 'text-neon-green',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  }
  
  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  }
  
  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-white mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center text-sm ${trendColors[trend]}`}>
              <span className="mr-1">{trendIcons[trend]}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <motion.div 
            className="p-3 rounded-xl bg-glass-white"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Icon className="w-6 h-6 text-neon-green" />
          </motion.div>
        )}
      </div>
    </GlassCard>
  )
}

export default StatCard

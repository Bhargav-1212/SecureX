import React from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'

const Activity = () => {
  const activities = [
    {
      id: 1,
      action: 'Document Uploaded',
      document: 'project_overview.pdf',
      txHash: '0x1234567890abcdef...',
      timestamp: '2024-01-15 14:30:25',
      user: '0x8765...4321'
    },
    {
      id: 2,
      action: 'File Accessed',
      document: 'whitepaper.pdf',
      txHash: '0xabcdef1234567890...',
      timestamp: '2024-01-15 13:45:12',
      user: '0x1234...5678'
    },
    // Add more mock data...
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Activity Logs</h1>
        <p className="text-gray-300">Track all document activities and blockchain transactions</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search */}
        <GlassCard className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities, transactions, or documents..."
              className="w-full bg-transparent border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
            />
          </div>
        </GlassCard>

        {/* Activity List */}
        <GlassCard className="divide-y divide-white/10">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-white/5 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{activity.action}</h3>
                    <p className="text-gray-400">{activity.document}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 text-sm">{activity.timestamp}</p>
                  <code className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    {activity.txHash}
                  </code>
                </div>
              </div>
            </motion.div>
          ))}
        </GlassCard>
      </div>
    </div>
  )
}

export default Activity

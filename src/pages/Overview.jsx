import React from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentIcon, 
  CloudArrowUpIcon, 
  UsersIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import IntegrationStatus from '../components/ui/IntegrationStatus'
import ContractAddressValidator from '../components/ui/ContractAddressValidator'
import { useWallet } from '../contexts/WalletContext'
import { getContractConfig } from '../config/contract'
import { isValidAddress } from '../utils/addressUtils'

const Overview = () => {
  const { chainId, contractInitialized } = useWallet()

  // Check if contract setup is needed
  const needsContractSetup = () => {
    if (!chainId) return false
    const config = getContractConfig(chainId)
    const isExampleAddress = config.contractAddress?.toLowerCase() === '0x742d35cc6506c4a9e6d29f0f9f5a8df07c9c31a5'
    const isInvalidAddress = !isValidAddress(config.contractAddress)
    return isExampleAddress || isInvalidAddress || !contractInitialized
  }

  // Mock data for charts
  const uploadData = [
    { day: 'Mon', uploads: 12, downloads: 8 },
    { day: 'Tue', uploads: 19, downloads: 15 },
    { day: 'Wed', uploads: 8, downloads: 12 },
    { day: 'Thu', uploads: 25, downloads: 18 },
    { day: 'Fri', uploads: 32, downloads: 28 },
    { day: 'Sat', uploads: 15, downloads: 22 },
    { day: 'Sun', uploads: 28, downloads: 19 }
  ]

  const activityData = [
    { time: '00:00', activity: 5 },
    { time: '04:00', activity: 8 },
    { time: '08:00', activity: 25 },
    { time: '12:00', activity: 35 },
    { time: '16:00', activity: 42 },
    { time: '20:00', activity: 28 },
    { time: '24:00', activity: 15 }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard className="p-3 border border-white/20">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-neon-green font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </GlassCard>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="text-neon-green">SecureX</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your decentralized document management platform powered by blockchain technology
        </p>
      </motion.div>

      {/* Integration Status */}
      <IntegrationStatus />

      {/* Contract Setup Helper */}
      {needsContractSetup() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ContractAddressValidator />
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value="247"
          change="+12% from last week"
          trend="up"
          icon={DocumentIcon}
        />
        <StatCard
          title="Recent Uploads"
          value="32"
          change="+8% from yesterday"
          trend="up"
          icon={CloudArrowUpIcon}
        />
        <StatCard
          title="Unique Users"
          value="156"
          change="+5% from last month"
          trend="up"
          icon={UsersIcon}
        />
        <StatCard
          title="Total Views"
          value="1,429"
          change="+23% from last week"
          trend="up"
          icon={EyeIcon}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Trends */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Weekly Upload Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uploadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="uploads" 
                stroke="#00ff88" 
                strokeWidth={3}
                dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#00ff88', strokeWidth: 2 }}
                name="Uploads"
              />
              <Line 
                type="monotone" 
                dataKey="downloads" 
                stroke="#0099ff" 
                strokeWidth={3}
                dot={{ fill: '#0099ff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0099ff', strokeWidth: 2 }}
                name="Downloads"
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Activity Timeline */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#00ff88"
                strokeWidth={3}
                fill="url(#activityGradient)"
                name="Activity"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Document uploaded', file: 'contract_v2.pdf', time: '2 minutes ago', user: '0x1234...5678' },
            { action: 'File accessed', file: 'whitepaper.pdf', time: '15 minutes ago', user: '0x8765...4321' },
            { action: 'Document shared', file: 'roadmap.pdf', time: '1 hour ago', user: '0x2468...1357' },
            { action: 'Upload completed', file: 'terms.pdf', time: '2 hours ago', user: '0x9876...5432' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.file}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">{activity.time}</p>
                <p className="text-gray-500 text-xs">{activity.user}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default Overview

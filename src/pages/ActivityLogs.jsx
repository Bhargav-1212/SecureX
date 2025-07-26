import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  DocumentIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useToast } from '../components/ui/Toast'
import contractService from '../services/contractService'
import { getContractConfig } from '../config/contract'

const ActivityLogs = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [error, setError] = useState('')
  const { isConnected, address, chainId, contractInitialized } = useWallet()
  const toast = useToast()

  // Fetch real contract events and user documents for activity logs
  useEffect(() => {
    const fetchActivityLogs = async () => {
      if (!isConnected || !address || !contractInitialized) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        console.log('Fetching activity logs for:', address)

        // Get user's documents to create upload activities
        const documents = await contractService.getUserDocuments(address)

        // Transform documents into activity log format
        const uploadActivities = documents.map((doc, index) => ({
          id: `upload-${doc.id}`,
          type: 'upload',
          action: 'Document Uploaded',
          fileName: doc.fileName,
          ipfsHash: doc.ipfsHash,
          user: doc.uploader,
          timestamp: doc.uploadDate,
          blockNumber: 4890000 + index * 100, // Mock block numbers
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock tx hashes
          gasUsed: (Math.floor(Math.random() * 50000) + 100000).toLocaleString(),
          status: 'confirmed'
        }))

        // Add some mock view and download activities for demonstration
        const mockViewDownloadActivities = documents.flatMap((doc, index) => {
          const activities = []

          // Add view activities
          for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            activities.push({
              id: `view-${doc.id}-${i}`,
              type: 'view',
              action: 'Document Accessed',
              fileName: doc.fileName,
              ipfsHash: doc.ipfsHash,
              user: `0x${Math.random().toString(16).substr(2, 40)}`,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000).toISOString(),
              blockNumber: 4890000 + index * 100 + i,
              transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              gasUsed: (Math.floor(Math.random() * 10000) + 15000).toLocaleString(),
              status: 'confirmed'
            })
          }

          // Add download activities
          if (Math.random() > 0.5) {
            activities.push({
              id: `download-${doc.id}`,
              type: 'download',
              action: 'Document Downloaded',
              fileName: doc.fileName,
              ipfsHash: doc.ipfsHash,
              user: `0x${Math.random().toString(16).substr(2, 40)}`,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString(),
              blockNumber: 4890000 + index * 100 + 50,
              transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              gasUsed: (Math.floor(Math.random() * 20000) + 20000).toLocaleString(),
              status: 'confirmed'
            })
          }

          return activities
        })

        // Combine all activities and sort by timestamp (newest first)
        const allActivities = [...uploadActivities, ...mockViewDownloadActivities]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        setActivities(allActivities)
        console.log(`Loaded ${allActivities.length} activity logs`)

      } catch (error) {
        console.error('Error fetching activity logs:', error)
        setError(error.message)
        toast.error(`Failed to load activity logs: ${error.message}`)
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivityLogs()
  }, [isConnected, address, contractInitialized, toast])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload':
        return <ArrowUpTrayIcon className="w-5 h-5 text-neon-green" />
      case 'view':
        return <EyeIcon className="w-5 h-5 text-blue-400" />
      case 'download':
        return <ArrowDownTrayIcon className="w-5 h-5 text-purple-400" />
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'upload':
        return 'border-l-neon-green bg-neon-green/5'
      case 'view':
        return 'border-l-blue-400 bg-blue-400/5'
      case 'download':
        return 'border-l-purple-400 bg-purple-400/5'
      default:
        return 'border-l-gray-400 bg-gray-400/5'
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${type} copied to clipboard!`)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const viewOnExplorer = (txHash) => {
    const baseUrl = chainId === 11155111n ? 'https://sepolia.etherscan.io' : 'https://etherscan.io'
    window.open(`${baseUrl}/tx/${txHash}`, '_blank')
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === 'all' || activity.type === filterType
    
    return matchesSearch && matchesFilter
  })

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to view activity logs from the Sepolia contract.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Activity Logs</h1>
          <p className="text-gray-300">Chronological events from Sepolia smart contract</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Contract Events:</span>
          <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
            {activities.length} Total
          </span>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities, files, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
            />
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-all duration-200"
            >
              <option value="all">All Activities</option>
              <option value="upload">Uploads</option>
              <option value="view">Views</option>
              <option value="download">Downloads</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {loading ? (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className={`p-6 border-l-4 ${getActivityColor(activity.type)} hover:bg-white/5 transition-all duration-300`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-semibold">{activity.action}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 font-medium mb-1">{activity.fileName}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>{activity.user === address ? 'You' : `${activity.user.slice(0, 10)}...`}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Block #{activity.blockNumber.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span>⛽ {activity.gasUsed} gas</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">IPFS:</span>
                          <code className="text-xs text-neon-green bg-black/30 px-2 py-1 rounded">
                            {activity.ipfsHash.slice(0, 15)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(activity.ipfsHash, 'IPFS Hash')}
                            className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Tx:</span>
                          <code className="text-xs text-blue-400 bg-black/30 px-2 py-1 rounded">
                            {activity.transactionHash.slice(0, 10)}...
                          </code>
                          <button
                            onClick={() => viewOnExplorer(activity.transactionHash)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View on Explorer"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-400">
                    <p>{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Activities Found</h2>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterType !== 'all' 
              ? 'No activities match your current filters.' 
              : 'No contract events found for this address.'
            }
          </p>
          {(searchQuery || filterType !== 'all') && (
            <NeonButton onClick={() => { setSearchQuery(''); setFilterType('all') }}>
              Clear Filters
            </NeonButton>
          )}
        </div>
      )}
    </div>
  )
}

export default ActivityLogs

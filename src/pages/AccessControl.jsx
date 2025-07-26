import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon,
  UserIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'

const AccessControl = () => {
  const [accessLogs, setAccessLogs] = useState([])
  const [documents, setDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [loading, setLoading] = useState(true)
  const { isConnected, address } = useWallet()

  // Mock access control data
  useEffect(() => {
    const fetchAccessData = async () => {
      setLoading(true)
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isConnected && address) {
        const mockAccessLogs = [
          {
            id: 1,
            documentName: 'SecureX_Whitepaper_v2.pdf',
            userAddress: '0x742d35cc6bbf4c03...',
            action: 'view',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            ipAddress: '192.168.1.100',
            location: 'New York, US',
            browser: 'Chrome 120',
            duration: '5 minutes'
          },
          {
            id: 2,
            documentName: 'Smart_Contract_Audit_Report.pdf',
            userAddress: '0x8ba1f109551bd432...',
            action: 'download',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ipAddress: '10.0.0.50',
            location: 'London, UK',
            browser: 'Firefox 121',
            duration: '1 minute'
          },
          {
            id: 3,
            documentName: 'Technical_Documentation.docx',
            userAddress: address,
            action: 'view',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            ipAddress: '172.16.0.25',
            location: 'San Francisco, US',
            browser: 'Safari 17',
            duration: '12 minutes'
          },
          {
            id: 4,
            documentName: 'Project_Roadmap_2024.pdf',
            userAddress: '0x123abc456def789g...',
            action: 'view',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            ipAddress: '203.0.113.45',
            location: 'Tokyo, JP',
            browser: 'Edge 120',
            duration: '7 minutes'
          },
          {
            id: 5,
            documentName: 'API_Documentation.pdf',
            userAddress: '0x456def789abc123d...',
            action: 'download',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            ipAddress: '198.51.100.78',
            location: 'Berlin, DE',
            browser: 'Chrome 120',
            duration: '2 minutes'
          }
        ]

        const mockDocuments = [
          {
            id: 1,
            name: 'SecureX_Whitepaper_v2.pdf',
            totalViews: 145,
            uniqueViewers: 87,
            downloads: 23,
            lastAccessed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            accessLevel: 'public'
          },
          {
            id: 2,
            name: 'Smart_Contract_Audit_Report.pdf',
            totalViews: 89,
            uniqueViewers: 45,
            downloads: 34,
            lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            accessLevel: 'restricted'
          },
          {
            id: 3,
            name: 'Technical_Documentation.docx',
            totalViews: 234,
            uniqueViewers: 120,
            downloads: 67,
            lastAccessed: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            accessLevel: 'public'
          },
          {
            id: 4,
            name: 'Project_Roadmap_2024.pdf',
            totalViews: 178,
            uniqueViewers: 98,
            downloads: 45,
            lastAccessed: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            accessLevel: 'public'
          }
        ]

        setAccessLogs(mockAccessLogs)
        setDocuments(mockDocuments)
      }
      
      setLoading(false)
    }

    fetchAccessData()
  }, [isConnected, address])

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'view':
        return <EyeIcon className="w-4 h-4 text-blue-400" />
      case 'download':
        return <ArrowDownTrayIcon className="w-4 h-4 text-green-400" />
      default:
        return <DocumentIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'view':
        return 'text-blue-400 bg-blue-400/10'
      case 'download':
        return 'text-green-400 bg-green-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getAccessLevelBadge = (level) => {
    switch (level) {
      case 'public':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Public</span>
      case 'restricted':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Restricted</span>
      case 'private':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Private</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Unknown</span>
    }
  }

  const filteredLogs = accessLogs.filter(log =>
    log.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalViews = documents.reduce((sum, doc) => sum + doc.totalViews, 0)
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0)
  const uniqueUsers = new Set(accessLogs.map(log => log.userAddress)).size

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to access the access control dashboard.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <ShieldCheckIcon className="w-8 h-8 text-neon-green" />
          <span>Access Control</span>
        </h1>
        <p className="text-gray-300">Monitor who has accessed your documents</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
            </div>
            <EyeIcon className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Downloads</p>
              <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
            </div>
            <ArrowDownTrayIcon className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unique Users</p>
              <p className="text-2xl font-bold text-white">{uniqueUsers}</p>
            </div>
            <UserIcon className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Documents</p>
              <p className="text-2xl font-bold text-white">{documents.length}</p>
            </div>
            <DocumentIcon className="w-8 h-8 text-orange-400" />
          </div>
        </GlassCard>
      </div>

      {/* Document Statistics */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <ChartBarIcon className="w-5 h-5 text-neon-green" />
          <span>Document Access Statistics</span>
        </h3>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-2 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-gray-400 text-sm">Document</th>
                  <th className="text-left py-3 text-gray-400 text-sm">Views</th>
                  <th className="text-left py-3 text-gray-400 text-sm">Unique Viewers</th>
                  <th className="text-left py-3 text-gray-400 text-sm">Downloads</th>
                  <th className="text-left py-3 text-gray-400 text-sm">Access Level</th>
                  <th className="text-left py-3 text-gray-400 text-sm">Last Accessed</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <DocumentIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{doc.totalViews}</td>
                    <td className="py-4 text-gray-300">{doc.uniqueViewers}</td>
                    <td className="py-4 text-gray-300">{doc.downloads}</td>
                    <td className="py-4">{getAccessLevelBadge(doc.accessLevel)}</td>
                    <td className="py-4 text-gray-400 text-sm">{formatTimeAgo(doc.lastAccessed)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Access Logs */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-neon-green" />
            <span>Recent Access Activity</span>
          </h3>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200 text-sm"
              />
            </div>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-green transition-all duration-200 text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium">{log.documentName}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-3 h-3" />
                          <span>{log.userAddress === address ? 'You' : log.userAddress}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{log.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <GlobeAltIcon className="w-3 h-3" />
                          <span>{log.browser}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{log.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-400">
                    <p>{formatTimeAgo(log.timestamp)}</p>
                    <p className="text-xs">{log.ipAddress}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Access Logs Found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? 'No logs match your search criteria.' 
                : 'No access activity recorded yet.'
              }
            </p>
          </div>
        )}
      </GlassCard>

      {/* Privacy Notice */}
      <GlassCard className="p-6 border-l-4 border-l-blue-400 bg-blue-400/5">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-blue-400 font-semibold mb-2">Privacy & Security Notice</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Access logs are stored securely and encrypted</p>
              <p>• IP addresses are hashed for privacy protection</p>
              <p>• Only document owners can view access control data</p>
              <p>• Logs are automatically purged after 90 days</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default AccessControl

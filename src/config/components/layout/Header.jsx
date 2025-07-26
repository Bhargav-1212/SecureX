import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellIcon, UserCircleIcon, WalletIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import { useWallet } from '../../contexts/WalletContext'

const Header = ({ currentPage }) => {
  const { isConnected, address, connectWallet, disconnectWallet, loading, error, chainId, switchToTestnet } = useWallet()
  const [showNetworkInfo, setShowNetworkInfo] = useState(false)
  
  const pageNames = {
    overview: 'Dashboard Overview',
    upload: 'Upload Documents',
    recent: 'Recent Documents',
    access: 'Access Files',
    activity: 'Activity Logs',
    download: 'Download Center',
    chat: 'AI Document Chat',
    control: 'Access Control'
  }
  
  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkInfo = (id) => {
    const chainId = Number(id)
    switch (chainId) {
      case 1: return { name: 'Ethereum Mainnet', cost: 'Expensive ($10-100+)', color: 'text-red-400', free: false }
      case 5: return { name: 'Goerli Testnet', cost: 'FREE 🎉', color: 'text-green-400', free: true }
      case 137: return { name: 'Polygon Mainnet', cost: 'Cheap ($0.01-0.10)', color: 'text-yellow-400', free: false }
      case 80001: return { name: 'Mumbai Testnet', cost: 'FREE 🎉', color: 'text-green-400', free: true }
      case 80002: return { name: 'Amoy Testnet', cost: 'FREE 🎉', color: 'text-green-400', free: true }
      case 11155111: return { name: 'Sepolia Testnet', cost: 'FREE 🎉', color: 'text-green-400', free: true }
      case 1337: return { name: 'Local Network', cost: 'FREE 🎉', color: 'text-green-400', free: true }
      default: return { name: `Chain ${chainId}`, cost: 'Unknown', color: 'text-gray-400', free: false }
    }
  }

  const networkInfo = chainId ? getNetworkInfo(chainId) : null
  const isExpensiveNetwork = networkInfo && !networkInfo.free

  const handleTestnetSwitch = async (testnet) => {
    setShowNetworkInfo(false)
    await switchToTestnet(testnet)
  }

  return (
    <header className="sticky top-0 z-30 p-4 lg:p-6">
      <GlassCard className="flex items-center justify-between p-4">
        <div>
          <motion.h1 
            key={currentPage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white"
          >
            {pageNames[currentPage]}
          </motion.h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back to your secure document dashboard
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Network Cost Warning */}
          {isConnected && isExpensiveNetwork && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <button
                onClick={() => setShowNetworkInfo(!showNetworkInfo)}
                className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all duration-200"
              >
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Expensive Network</span>
                <InformationCircleIcon className="w-4 h-4 text-yellow-400" />
              </button>
              
              <AnimatePresence>
                {showNetworkInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 z-50"
                  >
                    <GlassCard className="p-4 border border-yellow-500/30">
                      <h3 className="text-white font-semibold mb-3">💡 Switch to Free Testnets</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Avoid gas fees by switching to a free testnet. Perfect for prototyping!
                      </p>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => handleTestnetSwitch('sepolia')}
                          disabled={loading}
                          className="w-full flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all duration-200 disabled:opacity-50"
                        >
                          <div className="text-left">
                            <p className="text-green-400 font-medium">Sepolia Testnet</p>
                            <p className="text-xs text-gray-400">Modern Ethereum testnet</p>
                          </div>
                          <span className="text-green-400 font-bold">FREE</span>
                        </button>
                        
                        <button
                          onClick={() => handleTestnetSwitch('goerli')}
                          disabled={loading}
                          className="w-full flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-all duration-200 disabled:opacity-50"
                        >
                          <div className="text-left">
                            <p className="text-blue-400 font-medium">Goerli Testnet</p>
                            <p className="text-xs text-gray-400">Stable Ethereum testnet</p>
                          </div>
                          <span className="text-blue-400 font-bold">FREE</span>
                        </button>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-400">
                          💡 Get free test ETH from faucets like{' '}
                          <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline">
                            sepoliafaucet.com
                          </a>
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Error Display */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg max-w-xs"
            >
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm truncate">{error}</span>
            </motion.div>
          )}

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <BellIcon className="w-6 h-6" />
          </motion.button>
          
          {/* Wallet Connection */}
          {isConnected ? (
            <div className="flex items-center space-x-3">
              <GlassCard className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${networkInfo?.free ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{formatAddress(address)}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-400">{networkInfo?.name}</span>
                      <span className={`text-xs font-medium ${networkInfo?.color}`}>
                        {networkInfo?.cost}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectWallet}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                title="Disconnect Wallet"
              >
                <UserCircleIcon className="w-6 h-6" />
              </motion.button>
            </div>
          ) : (
            <NeonButton 
              onClick={connectWallet}
              loading={loading}
              disabled={loading}
              size="sm"
              className="flex items-center space-x-2"
            >
              <WalletIcon className="w-4 h-4" />
              <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
            </NeonButton>
          )}
        </div>
      </GlassCard>
    </header>
  )
}

export default Header

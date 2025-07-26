import React from 'react'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'
import NeonButton from './NeonButton'
import { useWallet } from '../../contexts/WalletContext'

const NetworkStatus = () => {
  const { chainId, switchNetwork, isConnected } = useWallet()
  
  const POLYGON_MUMBAI_CHAIN_ID = 80001n
  const isCorrectNetwork = chainId === POLYGON_MUMBAI_CHAIN_ID
  
  const getNetworkName = (id) => {
    switch (id) {
      case 1n: return 'Ethereum Mainnet'
      case 5n: return 'Goerli Testnet'
      case 137n: return 'Polygon Mainnet'
      case 80001n: return 'Polygon Mumbai'
      default: return `Network ${id?.toString()}`
    }
  }

  if (!isConnected) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-40"
    >
      <GlassCard className={`p-4 border-l-4 ${
        isCorrectNetwork 
          ? 'border-l-neon-green bg-green-500/10' 
          : 'border-l-yellow-500 bg-yellow-500/10'
      }`}>
        <div className="flex items-center space-x-3">
          {isCorrectNetwork ? (
            <CheckCircleIcon className="w-5 h-5 text-neon-green" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
          )}
          
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              isCorrectNetwork ? 'text-neon-green' : 'text-yellow-400'
            }`}>
              {getNetworkName(chainId)}
            </p>
            {!isCorrectNetwork && (
              <p className="text-xs text-gray-400">
                Switch to Polygon Mumbai for full functionality
              </p>
            )}
          </div>
          
          {!isCorrectNetwork && (
            <NeonButton
              size="sm"
              onClick={() => switchNetwork(80001)}
              className="text-xs"
            >
              Switch
            </NeonButton>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default NetworkStatus

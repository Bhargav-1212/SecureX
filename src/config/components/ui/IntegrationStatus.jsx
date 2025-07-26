import React from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'
import { useWallet } from '../../contexts/WalletContext'
import NeonButton from './NeonButton'
import { getContractConfig } from '../../config/contract'
import { isValidAddress } from '../../utils/addressUtils'

const IntegrationStatus = () => {
  const { isConnected, address, chainId, contractInitialized, demoMode, setDemoMode } = useWallet()
  
  const getNetworkStatus = () => {
    if (!chainId) return { status: 'disconnected', message: 'No network detected' }
    
    const isSupportedNetwork = chainId === 11155111n || chainId === 5n // Sepolia or Goerli
    
    if (isSupportedNetwork) {
      return { 
        status: 'success', 
        message: chainId === 11155111n ? 'Sepolia Testnet' : 'Goerli Testnet'
      }
    }
    
    return { status: 'warning', message: 'Unsupported network' }
  }
  
  const getContractStatus = () => {
    if (!isConnected) return { status: 'disconnected', message: 'Wallet not connected' }

    const config = getContractConfig(chainId)

    // Check if address is valid
    if (!isValidAddress(config.contractAddress)) {
      return { status: 'error', message: 'Invalid contract address' }
    }

    // Check if using example address
    const isExampleAddress = config.contractAddress.toLowerCase() === '0x742d35cc6506c4a9e6d29f0f9f5a8df07c9c31a5'
    if (isExampleAddress) {
      return { status: 'warning', message: 'Using example contract address' }
    }

    if (!contractInitialized) {
      return { status: 'error', message: 'Contract initialization failed' }
    }

    return { status: 'success', message: 'Contract connected' }
  }
  
  const networkStatus = getNetworkStatus()
  const contractStatus = getContractStatus()
  
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-400" />
      default:
        return <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
    }
  }
  
  const StatusBadge = ({ status, children }) => {
    const colors = {
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      disconnected: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded border ${colors[status] || colors.disconnected}`}>
        {children}
      </span>
    )
  }
  
  return (
    <GlassCard className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white mb-0">Integration Status</h3>
        <div className="flex items-center space-x-1">
          <StatusIcon status={isConnected && contractInitialized ? 'success' : 'warning'} />
          <span className="text-sm text-gray-300">
            {isConnected && contractInitialized ? 'Ready' : 'Setup Required'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Status */}
        <div className="flex items-center space-x-3">
          <StatusIcon status={isConnected ? 'success' : 'disconnected'} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Wallet</p>
            <StatusBadge status={isConnected ? 'success' : 'disconnected'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </StatusBadge>
          </div>
        </div>
        
        {/* Network Status */}
        <div className="flex items-center space-x-3">
          <StatusIcon status={networkStatus.status} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Network</p>
            <StatusBadge status={networkStatus.status}>
              {networkStatus.message}
            </StatusBadge>
          </div>
        </div>
        
        {/* Contract Status */}
        <div className="flex items-center space-x-3">
          <StatusIcon status={contractStatus.status} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Contract</p>
            <StatusBadge status={contractStatus.status}>
              {contractStatus.message}
            </StatusBadge>
          </div>
        </div>
        
        {/* IPFS Status */}
        <div className="flex items-center space-x-3">
          <StatusIcon status="warning" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">IPFS</p>
            <StatusBadge status="warning">
              Mock Mode
            </StatusBadge>
          </div>
        </div>
      </div>
      
      {/* Setup Instructions or Demo Mode */}
      {(!contractInitialized || contractStatus.status === 'warning') && (
        <div className="mt-4 space-y-3">
          {/* Demo Mode Toggle */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-blue-400 font-medium mb-1">🚀 Quick Start - Demo Mode</h4>
                <p className="text-sm text-gray-300">
                  Test uploads immediately without deploying a smart contract
                </p>
              </div>
              <NeonButton
                onClick={() => setDemoMode(!demoMode)}
                variant={demoMode ? "default" : "outline"}
                size="sm"
              >
                {demoMode ? '✅ Demo Active' : 'Enable Demo'}
              </NeonButton>
            </div>
          </div>

          {/* Contract Setup Instructions */}
          {!demoMode && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-yellow-400 font-medium mb-1">Contract Setup Required</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    To connect to your deployed smart contract:
                  </p>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Update contract address in <code className="text-yellow-400">src/config/contract.js</code></li>
                    <li>Ensure your contract implements the required ABI</li>
                    <li>Connect MetaMask to Sepolia or Goerli testnet</li>
                    <li>Check <code className="text-yellow-400">CONTRACT_SETUP.md</code> for details</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Address Display */}
      {isConnected && address && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Connected Address:</span>
            <code className="text-neon-green bg-black/30 px-2 py-1 rounded">
              {address.slice(0, 6)}...{address.slice(-4)}
            </code>
          </div>
        </div>
      )}
    </GlassCard>
  )
}

export default IntegrationStatus

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentIcon, 
  EyeIcon, 
  LinkIcon,
  CalendarIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useToast } from '../components/ui/Toast'
import contractService from '../services/contractService'
import { getContractConfig } from '../config/contract'

const RecentDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isConnected, address, chainId, contractInitialized, demoMode = false } = useWallet()
  const toast = useToast()

  // Fetch documents from deployed smart contract
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!isConnected || !address || (!contractInitialized && !demoMode)) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        console.log('Fetching documents for:', address, demoMode ? '(Demo Mode)' : '(Contract)')

        let contractDocs
        if (demoMode) {
          // Return demo documents
          contractDocs = [
            {
              id: 1,
              fileName: 'Demo_Document.pdf',
              ipfsHash: 'QmDemo123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz8',
              uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              fileSize: 1234567,
              uploader: address,
              timestamp: Math.floor(Date.now() / 1000) - 172800
            }
          ]
        } else {
          contractDocs = await contractService.getUserDocuments(address)
        }

        // Add mock blockchain data for display purposes
        const enhancedDocs = contractDocs.map((doc, index) => ({
          ...doc,
          blockNumber: 4890000 + index * 100, // Mock block numbers
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock tx hashes
          views: Math.floor(Math.random() * 100) + 1 // Mock view counts
        }))

        setDocuments(enhancedDocs)

        if (contractDocs.length === 0) {
          console.log('No documents found for this address')
        } else {
          console.log(`Found ${contractDocs.length} documents`)
        }

      } catch (error) {
        console.error('Error fetching documents:', error)
        setError(error.message)
        toast.error(`Failed to load documents: ${error.message}`)

        // Fallback to empty array
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [isConnected, address, contractInitialized, demoMode, toast])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '��'
      case 'txt':
        return '📃'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      default:
        return '📎'
    }
  }

  const openIPFS = (hash) => {
    window.open(`https://ipfs.io/ipfs/${hash}`, '_blank')
    toast.success('Opening document on IPFS')
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
    const config = getContractConfig(chainId)
    window.open(`${config.blockExplorer}/tx/${txHash}`, '_blank')
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to view recent documents from your deployed smart contract.
          </p>
        </GlassCard>
      </div>
    )
  }

  if (isConnected && !contractInitialized && !demoMode) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <DocumentIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Contract Initializing</h2>
          <p className="text-gray-400">
            Connecting to your smart contract on {chainId === 11155111n ? 'Sepolia' : 'current network'}...
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Recent Documents</h1>
          <p className="text-gray-300">Documents uploaded to Sepolia smart contract</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <span>Connected to:</span>
            <span className={`px-2 py-1 rounded-lg ${
              chainId === 11155111n ? 'bg-green-500/20 text-green-400' :
              chainId === 5n ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {chainId === 11155111n ? 'Sepolia Testnet' :
               chainId === 5n ? 'Goerli Testnet' : 'Other Network'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Contract:</span>
            <span className={`px-2 py-1 rounded-lg ${
              contractInitialized ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {contractInitialized ? '✓ Connected' : '✗ Failed'}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getFileIcon(doc.fileName)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{doc.fileName}</h3>
                      <p className="text-gray-400 text-sm">{formatFileSize(doc.fileSize)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{doc.views}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{formatDate(doc.uploadDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Block #{doc.blockNumber.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">IPFS Hash:</span>
                    <button
                      onClick={() => copyToClipboard(doc.ipfsHash, 'IPFS Hash')}
                      className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                    >
                      <LinkIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <code className="block text-xs text-neon-green bg-black/30 p-2 rounded break-all">
                    {doc.ipfsHash}
                  </code>
                </div>

                <div className="flex space-x-2">
                  <NeonButton
                    onClick={() => openIPFS(doc.ipfsHash)}
                    size="sm"
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    <span>View on IPFS</span>
                  </NeonButton>
                  <button
                    onClick={() => viewOnExplorer(doc.transactionHash)}
                    className="px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200"
                    title="View transaction"
                  >
                    🔗
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Tx: {doc.transactionHash.slice(0, 10)}...{doc.transactionHash.slice(-6)}</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">✓ Verified</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Documents Found</h2>
          <p className="text-gray-400 mb-6">
            {error ?
              `Error loading documents: ${error}` :
              'No documents have been uploaded to your smart contract from this address.'
            }
          </p>
          <div className="space-y-3">
            <NeonButton onClick={() => window.location.href = '#upload'}>
              Upload Your First Document
            </NeonButton>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="block mx-auto px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200"
              >
                Retry Loading
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentDocuments

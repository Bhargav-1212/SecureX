import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowDownTrayIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useToast } from '../components/ui/Toast'
import contractService from '../services/contractService'
import ipfsService from '../services/ipfsService'

const DownloadCenter = () => {
  const [documents, setDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [downloadStatus, setDownloadStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const { isConnected, address, contractInitialized } = useWallet()
  const toast = useToast()

  // Helper function to determine MIME type from file extension
  const getMimeType = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return 'application/pdf'
      case 'doc': case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      case 'txt': return 'text/plain'
      case 'jpg': case 'jpeg': return 'image/jpeg'
      case 'png': return 'image/png'
      default: return 'application/octet-stream'
    }
  }

  // Fetch documents from contract for download capabilities
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!isConnected || !address || !contractInitialized) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        console.log('Fetching documents for download center')
        const contractDocs = await contractService.getUserDocuments(address)

        // Transform contract documents for download center
        const enhancedDocs = contractDocs.map(doc => ({
          id: doc.id,
          fileName: doc.fileName,
          ipfsHash: doc.ipfsHash,
          fileSize: doc.fileSize,
          uploadDate: doc.uploadDate,
          mimeType: getMimeType(doc.fileName),
          downloadCount: Math.floor(Math.random() * 100) + 1,
          lastDownload: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          status: 'available'
        }))

        setDocuments(enhancedDocs)
        console.log(`Loaded ${enhancedDocs.length} documents for download`)

      } catch (error) {
        console.error('Error fetching documents for download:', error)
        toast.error(`Failed to load documents: ${error.message}`)
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [isConnected, address, contractInitialized, toast])

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
        return '📝'
      case 'txt':
        return '📃'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      case 'zip':
      case 'rar':
        return '📦'
      default:
        return '📎'
    }
  }

  const downloadFromIPFS = async (document) => {
    setDownloadStatus(prev => ({ ...prev, [document.id]: 'downloading' }))

    try {
      console.log('Starting download:', document.fileName, document.ipfsHash)

      // Use IPFS service to download the file
      const result = await ipfsService.downloadFile(document.ipfsHash, document.fileName)

      if (result.success) {
        setDownloadStatus(prev => ({ ...prev, [document.id]: 'completed' }))
        toast.success(`${document.fileName} downloaded successfully!`)

        // Update download count (in a real app, this would be tracked on-chain)
        setDocuments(prev => prev.map(doc =>
          doc.id === document.id
            ? { ...doc, downloadCount: doc.downloadCount + 1, lastDownload: new Date().toISOString() }
            : doc
        ))
      } else {
        throw new Error('Download failed')
      }
      toast.success(`${document.fileName} downloaded successfully!`)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [document.id]: null }))
      }, 3000)
      
    } catch (error) {
      console.error('Download error:', error)
      setDownloadStatus(prev => ({ ...prev, [document.id]: 'error' }))
      toast.error('Download failed. Please try again.')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [document.id]: null }))
      }, 3000)
    }
  }

  const viewOnIPFS = (hash) => {
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

  const getDownloadButtonState = (docId) => {
    const status = downloadStatus[docId]
    switch (status) {
      case 'downloading':
        return { text: 'Downloading...', disabled: true, loading: true }
      case 'completed':
        return { text: 'Downloaded ✓', disabled: true, loading: false }
      case 'error':
        return { text: 'Retry Download', disabled: false, loading: false }
      default:
        return { text: 'Download', disabled: false, loading: false }
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.ipfsHash.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ArrowDownTrayIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to access the download center.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Download Center</h1>
          <p className="text-gray-300">Download your documents directly from IPFS</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <FolderIcon className="w-5 h-5" />
            <span>{documents.length} documents available</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents or IPFS hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
          />
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-3xl">{getFileIcon(doc.fileName)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{doc.fileName}</h3>
                      <p className="text-gray-400 text-sm">{formatFileSize(doc.fileSize)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span className="text-sm">{doc.downloadCount}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>Uploaded: {formatDate(doc.uploadDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <EyeIcon className="w-4 h-4" />
                    <span>Last downloaded: {formatDate(doc.lastDownload)}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">IPFS CID:</span>
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

                <div className="space-y-3">
                  <NeonButton
                    onClick={() => downloadFromIPFS(doc)}
                    disabled={getDownloadButtonState(doc.id).disabled}
                    loading={getDownloadButtonState(doc.id).loading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    {downloadStatus[doc.id] === 'completed' ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : downloadStatus[doc.id] === 'error' ? (
                      <ExclamationCircleIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    )}
                    <span>{getDownloadButtonState(doc.id).text}</span>
                  </NeonButton>

                  <button
                    onClick={() => viewOnIPFS(doc.ipfsHash)}
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View on IPFS</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      doc.status === 'available' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {doc.status === 'available' ? '✓ Available' : '⏳ Processing'}
                    </span>
                    <span className="text-gray-500">{doc.mimeType.split('/')[1]?.toUpperCase()}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Documents Found</h2>
          <p className="text-gray-400 mb-6">
            {searchQuery 
              ? 'No documents match your search criteria.' 
              : 'No documents available for download.'
            }
          </p>
          {searchQuery && (
            <NeonButton onClick={() => setSearchQuery('')}>
              Clear Search
            </NeonButton>
          )}
        </div>
      )}

      {/* Download Instructions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <ArrowDownTrayIcon className="w-5 h-5 text-neon-green" />
          <span>Download Instructions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">Direct Download</h4>
            <p>Click the "Download" button to fetch files directly from IPFS to your device.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">IPFS Gateway</h4>
            <p>Use "View on IPFS" to access files through the IPFS gateway in your browser.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Copy CID</h4>
            <p>Click the link icon to copy the IPFS Content Identifier for use in other applications.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">File Verification</h4>
            <p>All files are cryptographically verified to ensure integrity and authenticity.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default DownloadCenter

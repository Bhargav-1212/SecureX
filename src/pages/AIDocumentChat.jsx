import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  LinkIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useToast } from '../components/ui/Toast'

const AIDocumentChat = () => {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [documents, setDocuments] = useState([])
  const messagesEndRef = useRef(null)
  const { isConnected, address } = useWallet()
  const toast = useToast()

  // Mock documents data
  useEffect(() => {
    if (isConnected && address) {
      const mockDocuments = [
        {
          id: 1,
          fileName: 'SecureX_Whitepaper_v2.pdf',
          ipfsHash: 'QmXyZ123abc456def789ghi012jkl345mno678pqr',
          uploadDate: '2024-01-15',
          description: 'Technical whitepaper describing SecureX architecture'
        },
        {
          id: 2,
          fileName: 'Smart_Contract_Audit_Report.pdf',
          ipfsHash: 'QmAbc456def789xyz123uvw456qrs789tuv012wxy',
          uploadDate: '2024-01-14',
          description: 'Security audit results for smart contracts'
        },
        {
          id: 3,
          fileName: 'Technical_Documentation.docx',
          ipfsHash: 'QmDef789ghi012jkl345mno678pqr901stu234vwx',
          uploadDate: '2024-01-13',
          description: 'Comprehensive technical documentation'
        },
        {
          id: 4,
          fileName: 'Project_Roadmap_2024.pdf',
          ipfsHash: 'QmGhi012jkl345mno678pqr901stu234vwx567yz8',
          uploadDate: '2024-01-12',
          description: 'Development roadmap and milestones'
        }
      ]
      setDocuments(mockDocuments)
    }
  }, [isConnected, address])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      default:
        return '📎'
    }
  }

  const generateAIResponse = (userMessage, document) => {
    // Mock AI responses based on document type and message content
    const responses = {
      whitepaper: [
        "Based on the SecureX whitepaper, the platform uses a hybrid approach combining IPFS for decentralized storage with smart contracts for verification. The architecture ensures both security and scalability.",
        "According to the whitepaper, SecureX implements zero-knowledge proofs to maintain privacy while ensuring document integrity. This allows for verification without revealing document contents.",
        "The whitepaper outlines three key components: the storage layer (IPFS), the verification layer (smart contracts), and the access control layer (cryptographic permissions)."
      ],
      audit: [
        "The audit report indicates that all critical vulnerabilities have been addressed. The smart contracts passed security analysis with no high-risk issues identified.",
        "According to the audit findings, the access control mechanisms are properly implemented with role-based permissions and time-locked administrative functions.",
        "The audit confirms that the IPFS integration follows best practices for content addressing and maintains immutable document references."
      ],
      documentation: [
        "The technical documentation explains that documents are encrypted client-side before IPFS storage, ensuring only authorized users can decrypt the content.",
        "Based on the documentation, the system supports multiple file formats and implements content verification through cryptographic hashing.",
        "The documentation details the API endpoints for document management, including upload, retrieval, and permission management functions."
      ],
      roadmap: [
        "The 2024 roadmap indicates several upcoming features including advanced AI document analysis, cross-chain compatibility, and enhanced privacy features.",
        "According to the roadmap, Q2 2024 will focus on implementing advanced search capabilities and document relationship mapping.",
        "The roadmap shows plans for integrating with additional blockchain networks and expanding IPFS gateway options for improved reliability."
      ]
    }

    let responseCategory = 'whitepaper'
    if (document.fileName.toLowerCase().includes('audit')) responseCategory = 'audit'
    else if (document.fileName.toLowerCase().includes('documentation')) responseCategory = 'documentation'
    else if (document.fileName.toLowerCase().includes('roadmap')) responseCategory = 'roadmap'

    const categoryResponses = responses[responseCategory]
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
  }

  const sendMessage = async () => {
    if (!message.trim() || !selectedDocument || isTyping) return

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    const aiResponse = {
      id: Date.now() + 1,
      text: generateAIResponse(message, selectedDocument),
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
      document: selectedDocument.fileName,
      ipfsHash: selectedDocument.ipfsHash
    }

    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
    toast.success('AI analysis complete!')
  }

  const clearChat = () => {
    setMessages([])
    toast.info('Chat cleared')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('IPFS hash copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const openIPFS = (hash) => {
    window.open(`https://ipfs.io/ipfs/${hash}`, '_blank')
    toast.success('Opening document on IPFS')
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to access AI document chat features.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-neon-green" />
          <span>AI Document Chat</span>
        </h1>
        <p className="text-gray-300">Ask questions about your uploaded documents using AI analysis</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Selection */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <DocumentIcon className="w-5 h-5" />
              <span>Select Document</span>
            </h3>
            
            <div className="space-y-3">
              {documents.map((doc) => (
                <motion.button
                  key={doc.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDocument(doc)}
                  className={`
                    w-full p-3 rounded-xl text-left transition-all duration-200
                    ${selectedDocument?.id === doc.id
                      ? 'bg-neon-green/20 border border-neon-green/30 text-neon-green'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getFileIcon(doc.fileName)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.fileName}</p>
                      <p className="text-xs opacity-70 mt-1">{doc.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(doc.ipfsHash)
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Copy IPFS hash"
                        >
                          <LinkIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openIPFS(doc.ipfsHash)
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="View on IPFS"
                        >
                          <InformationCircleIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedDocument && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-neon-green/10 border border-neon-green/30 rounded-xl"
              >
                <p className="text-neon-green text-sm font-medium mb-2">Selected Document:</p>
                <p className="text-white text-sm">{selectedDocument.fileName}</p>
                <code className="text-xs text-gray-400 break-all">
                  {selectedDocument.ipfsHash.slice(0, 20)}...
                </code>
              </motion.div>
            )}
          </GlassCard>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <GlassCard className="h-96 lg:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-emerald-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">SecureX AI Assistant</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedDocument ? `Analyzing: ${selectedDocument.fileName}` : 'Select a document to start'}
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Clear chat"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center mt-20">
                  <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {selectedDocument 
                      ? 'Start asking questions about your document!' 
                      : 'Select a document from the sidebar to begin'
                    }
                  </p>
                  {selectedDocument && (
                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      <p>Try asking:</p>
                      <div className="space-y-1">
                        <p>"What is the main purpose of this document?"</p>
                        <p>"Summarize the key findings"</p>
                        <p>"What are the security implications?"</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl
                      ${msg.sender === 'user'
                        ? 'bg-neon-green text-gray-900'
                        : 'bg-white/10 text-white border border-white/20'
                      }
                    `}>
                      {msg.sender === 'ai' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <SparklesIcon className="w-4 h-4 text-neon-green" />
                          <span className="text-xs text-gray-400">AI Analysis</span>
                          {msg.document && (
                            <span className="text-xs text-neon-green">• {msg.document}</span>
                          )}
                        </div>
                      )}
                      <p className="text-sm lg:text-base">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-2">{msg.timestamp}</p>
                    </div>
                  </motion.div>
                ))
              )}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 text-white border border-white/20 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-4 h-4 text-neon-green animate-pulse" />
                      <span className="text-sm">AI is analyzing the document...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={selectedDocument ? "Ask about your document..." : "Select a document first"}
                  disabled={!selectedDocument || isTyping}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200 disabled:opacity-50"
                />
                <NeonButton 
                  onClick={sendMessage}
                  disabled={!selectedDocument || !message.trim() || isTyping}
                  size="sm"
                  className="px-4"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </NeonButton>
              </div>
              
              {selectedDocument && (
                <p className="text-xs text-gray-400 mt-2">
                  💡 AI will analyze "{selectedDocument.fileName}" to answer your questions
                </p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default AIDocumentChat

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PaperAirplaneIcon, DocumentIcon } from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'

const Chat = () => {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const documents = [
    { id: 1, name: 'Project Whitepaper.pdf' },
    { id: 2, name: 'Smart Contract Audit.pdf' },
    { id: 3, name: 'Technical Documentation.docx' }
  ]

  const sendMessage = () => {
    if (!message.trim() || !selectedDocument) return
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }
    
    setMessages([...messages, newMessage])
    setMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I'm analyzing your document. This feature will be available soon with LangChain integration!",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">AI Document Assistant</h1>
        <p className="text-gray-300">Ask questions about your uploaded documents</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Selection */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Select Document</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`
                    w-full p-3 rounded-xl text-left transition-all duration-200
                    ${selectedDocument?.id === doc.id
                      ? 'bg-neon-green/20 border border-neon-green/30 text-neon-green'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="w-4 h-4" />
                    <span className="text-sm truncate">{doc.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <GlassCard className="h-96 flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <p>Select a document and start asking questions!</p>
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
                      max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                      ${msg.sender === 'user'
                        ? 'bg-neon-green text-gray-900'
                        : 'bg-white/10 text-white'
                      }
                    `}>
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={selectedDocument ? "Ask about your document..." : "Select a document first"}
                  disabled={!selectedDocument}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
                />
                <NeonButton 
                  onClick={sendMessage}
                  disabled={!selectedDocument || !message.trim()}
                  size="sm"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default Chat

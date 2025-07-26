import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'
import NeonButton from './NeonButton'

const WalletModal = ({ isOpen, onClose, onConnect, loading, error }) => {
  const MetaMaskIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 318.6 318.6">
      <defs>
        <linearGradient id="metamask-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2761B" />
          <stop offset="100%" stopColor="#F6851B" />
        </linearGradient>
      </defs>
      <polygon fill="url(#metamask-gradient)" points="274.1,35.5 174.6,109.4 193,65.8"/>
      <g fill="#E4761B">
        <polygon points="44.4,35.5 143.1,110.1 125.6,65.8"/>
        <polygon points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7"/>
        <polygon points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8"/>
        <polygon points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,101.3"/>
        <polygon points="214.9,138.2 175.9,101.3 174.6,164.6 230.8,162.1"/>
        <polygon points="106.8,247.4 140.6,230.9 111.4,208.1"/>
        <polygon points="177.9,230.9 211.8,247.4 207.1,208.1"/>
      </g>
      <g fill="#D7C1B3">
        <polygon points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3"/>
        <polygon points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9"/>
      </g>
    </svg>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
                >
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-300 mb-4">
                    Connect your MetaMask wallet to access SecureX Dashboard
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span>Secure • Decentralized • Private</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConnect}
                  disabled={loading}
                  className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold flex items-center justify-center space-x-3 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <MetaMaskIcon />
                      <span>Connect MetaMask</span>
                    </>
                  )}
                </motion.button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Don't have MetaMask?{' '}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-green hover:underline"
                    >
                      Install here
                    </a>
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-white font-semibold mb-2">What you'll get:</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                      <span>Secure document storage on IPFS</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                      <span>Blockchain-verified transactions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                      <span>AI-powered document analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WalletModal

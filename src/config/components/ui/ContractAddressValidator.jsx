import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'
import NeonButton from './NeonButton'
import { isValidAddress, getChecksumAddress } from '../../utils/addressUtils'
import { useToast } from './Toast'

const ContractAddressValidator = ({ onAddressValidated }) => {
  const [inputAddress, setInputAddress] = useState('')
  const [validationResult, setValidationResult] = useState(null)
  const toast = useToast()

  const validateAddress = () => {
    if (!inputAddress.trim()) {
      setValidationResult({ valid: false, error: 'Please enter an address' })
      return
    }

    try {
      const checksummed = getChecksumAddress(inputAddress.trim())
      setValidationResult({ 
        valid: true, 
        checksummed,
        original: inputAddress.trim(),
        needsUpdate: inputAddress.trim() !== checksummed
      })
    } catch (error) {
      setValidationResult({ 
        valid: false, 
        error: error.message,
        original: inputAddress.trim()
      })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Address copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy address')
    })
  }

  const generateConfigCode = (address) => {
    return `// Update your contract address in src/config/contract.js
export const CONTRACT_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockExplorer: 'https://sepolia.etherscan.io',
    contractAddress: '${address}', // ← Updated with your contract address
  },
  // ... rest of config
}`
  }

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Contract Address Validator</h3>
          <p className="text-gray-400 text-sm">
            Validate and get the correct checksum format for your contract address
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contract Address
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="0x742d35Cc6506C4A9E6D29F0f9F5a8dF07c9c31A5"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
              />
              <NeonButton onClick={validateAddress} size="sm">
                Validate
              </NeonButton>
            </div>
          </div>

          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                validationResult.valid 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                {validationResult.valid ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1 space-y-3">
                  {validationResult.valid ? (
                    <>
                      <div>
                        <h4 className="text-green-400 font-medium">✅ Valid Ethereum Address</h4>
                        {validationResult.needsUpdate && (
                          <p className="text-yellow-400 text-sm mt-1">
                            ⚠️ Address case updated for proper checksum
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-400">Checksummed Address:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="text-green-400 bg-black/30 px-2 py-1 rounded text-sm flex-1">
                              {validationResult.checksummed}
                            </code>
                            <button
                              onClick={() => copyToClipboard(validationResult.checksummed)}
                              className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                              title="Copy address"
                            >
                              <ClipboardDocumentIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-400">Configuration Code:</span>
                          <div className="mt-1 relative">
                            <pre className="text-xs bg-black/50 p-3 rounded border overflow-x-auto text-gray-300">
                              {generateConfigCode(validationResult.checksummed)}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(generateConfigCode(validationResult.checksummed))}
                              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-green-400 transition-colors"
                              title="Copy config code"
                            >
                              <ClipboardDocumentIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h4 className="text-red-400 font-medium">❌ Invalid Address</h4>
                      <p className="text-red-300 text-sm mt-1">{validationResult.error}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        <p>Make sure your address:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Starts with "0x"</li>
                          <li>Is 42 characters long (0x + 40 hex characters)</li>
                          <li>Contains only valid hexadecimal characters (0-9, a-f, A-F)</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

export default ContractAddressValidator

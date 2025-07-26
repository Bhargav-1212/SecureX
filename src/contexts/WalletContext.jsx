import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import contractService from '../services/contractService'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contractInitialized, setContractInitialized] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Check if wallet is already connected on app load
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const network = await provider.getNetwork()
          
          setProvider(provider)
          setSigner(signer)
          setAddress(address)
          setChainId(network.chainId)
          setIsConnected(true)

          // Initialize contract service
          const initialized = await contractService.initialize(provider, signer, network.chainId)
          setContractInitialized(initialized)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAddress(address)
      setChainId(network.chainId)
      setIsConnected(true)
      setError('')

      // Initialize contract service
      const initialized = await contractService.initialize(provider, signer, network.chainId)
      setContractInitialized(initialized)

      if (initialized) {
        console.log('Wallet connected and contract initialized:', address)
      } else {
        console.log('Wallet connected but contract initialization failed:', address)
      }

      console.log('Wallet connected:', address)

    } catch (error) {
      console.error('Error connecting wallet:', error)
      let errorMsg = 'Failed to connect wallet'
      
      if (error.code === 4001) {
        errorMsg = 'Connection rejected by user'
      } else if (error.code === -32002) {
        errorMsg = 'Connection request already pending'
      } else if (error.message) {
        errorMsg = error.message
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress('')
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setError('')
    setContractInitialized(false)

    // Clean up contract service
    contractService.removeEventListeners()

    console.log('Wallet disconnected')
  }

  const addSepoliaNetwork = async () => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xaa36a7',
          chainName: 'Sepolia Testnet',
          nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'SEP',
            decimals: 18
          },
          rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
          blockExplorerUrls: ['https://sepolia.etherscan.io/']
        }]
      })
      return true
    } catch (error) {
      console.error('Error adding Sepolia network:', error)
      return false
    }
  }

  const addGoerliNetwork = async () => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x5',
          chainName: 'Goerli Testnet',
          nativeCurrency: {
            name: 'Goerli ETH',
            symbol: 'gETH',
            decimals: 18
          },
          rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
          blockExplorerUrls: ['https://goerli.etherscan.io/']
        }]
      })
      return true
    } catch (error) {
      console.error('Error adding Goerli network:', error)
      return false
    }
  }

  const switchToTestnet = async (testnet = 'sepolia') => {
    if (!window.ethereum) return false

    setLoading(true)
    try {
      const chainId = testnet === 'sepolia' ? '0xaa36a7' : '0x5'
      
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
      
      console.log(`Switched to ${testnet} testnet successfully`)
      return true
    } catch (error) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        const added = testnet === 'sepolia' ? 
          await addSepoliaNetwork() : 
          await addGoerliNetwork()
        return added
      } else {
        console.error(`Error switching to ${testnet}:`, error)
        setError(`Failed to switch to ${testnet} testnet`)
        return false
      }
    } finally {
      setLoading(false)
    }
  }

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          // Account changed, update connection
          setTimeout(checkConnection, 100)
        }
      }

      const handleChainChanged = (chainId) => {
        setChainId(BigInt(chainId))
        setContractInitialized(false)
        // Reload connection after chain change
        setTimeout(checkConnection, 100)
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [])

  const value = {
    isConnected,
    address,
    provider,
    signer,
    chainId,
    loading,
    error,
    contractInitialized,
    connectWallet,
    disconnectWallet,
    switchToTestnet,
    demoMode,
    setDemoMode
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

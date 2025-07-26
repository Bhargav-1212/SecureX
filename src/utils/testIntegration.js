// Integration Test Utility for SecureX Dashboard
// This file helps test the smart contract integration

import contractService from '../services/contractService'
import ipfsService from '../services/ipfsService'
import { getContractConfig } from '../config/contract'

export class IntegrationTester {
  constructor() {
    this.testResults = []
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const result = { timestamp, message, type }
    this.testResults.push(result)
    console.log(`[${type.toUpperCase()}] ${timestamp}: ${message}`)
    return result
  }

  // Test contract configuration
  async testContractConfig(chainId) {
    try {
      const config = getContractConfig(chainId)
      
      if (!config.contractAddress || config.contractAddress === '0x742d35Cc6506C4A9E6D29F0f9F5a8dF07c9c31a5') {
        this.log('⚠️ Using example contract address. Please update with your deployed contract address.', 'warning')
        return false
      }
      
      this.log(`✅ Contract configuration found for chain ${chainId}`, 'success')
      this.log(`📋 Contract Address: ${config.contractAddress}`, 'info')
      this.log(`🌐 Network: ${config.name}`, 'info')
      this.log(`🔍 Explorer: ${config.blockExplorer}`, 'info')
      
      return true
    } catch (error) {
      this.log(`❌ Contract configuration test failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test wallet connection
  async testWalletConnection(provider, signer, chainId) {
    try {
      if (!provider || !signer) {
        this.log('❌ Provider or signer not available', 'error')
        return false
      }

      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      
      this.log(`✅ Wallet connected successfully`, 'success')
      this.log(`👤 Address: ${address}`, 'info')
      this.log(`⛓️ Chain ID: ${network.chainId}`, 'info')
      
      return true
    } catch (error) {
      this.log(`❌ Wallet connection test failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test contract service initialization
  async testContractService(provider, signer, chainId) {
    try {
      const initialized = await contractService.initialize(provider, signer, chainId)
      
      if (!initialized) {
        this.log('❌ Contract service initialization failed', 'error')
        return false
      }

      this.log('✅ Contract service initialized successfully', 'success')
      
      // Test contract address
      const contractAddress = contractService.getContractAddress()
      if (contractAddress) {
        this.log(`📋 Contract initialized at: ${contractAddress}`, 'info')
      }
      
      return true
    } catch (error) {
      this.log(`❌ Contract service test failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test IPFS service
  async testIPFSService() {
    try {
      // Test IPFS URL generation
      const testHash = 'QmTestHash123'
      const ipfsUrl = ipfsService.getIPFSUrl(testHash)
      
      if (!ipfsUrl.includes(testHash)) {
        this.log('❌ IPFS URL generation failed', 'error')
        return false
      }

      this.log('✅ IPFS service working correctly', 'success')
      this.log(`🔗 Test IPFS URL: ${ipfsUrl}`, 'info')
      
      return true
    } catch (error) {
      this.log(`❌ IPFS service test failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test document fetching (requires contract deployment)
  async testDocumentFetching(userAddress) {
    try {
      this.log('🔍 Testing document fetching...', 'info')
      
      const documents = await contractService.getUserDocuments(userAddress)
      
      this.log(`✅ Document fetching successful`, 'success')
      this.log(`📄 Found ${documents.length} documents for address: ${userAddress}`, 'info')
      
      if (documents.length > 0) {
        const firstDoc = documents[0]
        this.log(`📋 Sample document: ${firstDoc.fileName} (${firstDoc.ipfsHash})`, 'info')
      }
      
      return true
    } catch (error) {
      this.log(`⚠️ Document fetching failed (expected if no contract deployed): ${error.message}`, 'warning')
      return false
    }
  }

  // Run all tests
  async runAllTests(walletContext) {
    this.log('🚀 Starting SecureX Integration Tests...', 'info')
    this.log('=' * 50, 'info')
    
    const { provider, signer, chainId, address, isConnected, contractInitialized } = walletContext
    
    // Test 1: Contract Configuration
    await this.testContractConfig(chainId)
    
    // Test 2: Wallet Connection
    if (isConnected) {
      await this.testWalletConnection(provider, signer, chainId)
    } else {
      this.log('⚠️ Wallet not connected - skipping wallet tests', 'warning')
    }
    
    // Test 3: Contract Service
    if (contractInitialized) {
      await this.testContractService(provider, signer, chainId)
    } else {
      this.log('⚠️ Contract not initialized - check contract address and network', 'warning')
    }
    
    // Test 4: IPFS Service
    await this.testIPFSService()
    
    // Test 5: Document Fetching
    if (contractInitialized && address) {
      await this.testDocumentFetching(address)
    } else {
      this.log('⚠️ Skipping document fetch test - contract not ready', 'warning')
    }
    
    this.log('=' * 50, 'info')
    this.log('🏁 Integration tests completed!', 'info')
    
    return this.testResults
  }

  // Get test summary
  getTestSummary() {
    const total = this.testResults.length
    const errors = this.testResults.filter(r => r.type === 'error').length
    const warnings = this.testResults.filter(r => r.type === 'warning').length
    const successes = this.testResults.filter(r => r.type === 'success').length
    
    return {
      total,
      errors,
      warnings,
      successes,
      status: errors === 0 ? 'passed' : 'failed'
    }
  }
}

// Export singleton instance
export const integrationTester = new IntegrationTester()
export default integrationTester

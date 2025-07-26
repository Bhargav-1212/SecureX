import { safeGetChecksumAddress } from '../utils/addressUtils'

// SecureX Smart Contract Configuration
export const CONTRACT_CONFIG = {
  // Sepolia Testnet Configuration
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockExplorer: 'https://sepolia.etherscan.io',
    // Replace with your deployed contract address (use proper checksum format)
    contractAddress: '0x742d35Cc6506C4A9E6D29F0f9F5a8dF07c9c31A5', // Example address - update with yours
  },
  // Goerli Testnet Configuration
  goerli: {
    chainId: 5,
    name: 'Goerli Testnet', 
    rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    blockExplorer: 'https://goerli.etherscan.io',
    contractAddress: '0x742d35Cc6506C4A9E6D29F0f9F5a8dF07c9c31A5', // Example address - update with yours
  }
}

// SecureX Contract ABI - Document Storage Smart Contract
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getDocumentCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "documents",
    "outputs": [
      {"internalType": "string", "name": "fileName", "type": "string"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "address", "name": "uploader", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "fileSize", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_fileName", "type": "string"},
      {"internalType": "string", "name": "_ipfsHash", "type": "string"},
      {"internalType": "uint256", "name": "_fileSize", "type": "uint256"}
    ],
    "name": "uploadDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserDocuments",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_documentId", "type": "uint256"}],
    "name": "getDocument",
    "outputs": [
      {"internalType": "string", "name": "fileName", "type": "string"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "address", "name": "uploader", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "fileSize", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "documentId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "uploader", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "fileName", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string"}
    ],
    "name": "DocumentUploaded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "documentId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "viewer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "DocumentViewed",
    "type": "event"
  }
]

// Helper function to get contract config based on chain ID
export const getContractConfig = (chainId) => {
  const chainIdNum = Number(chainId)

  let config
  switch (chainIdNum) {
    case 11155111:
      config = CONTRACT_CONFIG.sepolia
      break
    case 5:
      config = CONTRACT_CONFIG.goerli
      break
    default:
      // Default to Sepolia if unknown network
      config = CONTRACT_CONFIG.sepolia
      break
  }

  // Ensure the contract address is properly checksummed
  const checksummedAddress = safeGetChecksumAddress(config.contractAddress)
  if (!checksummedAddress) {
    console.warn(`Invalid contract address for chain ${chainIdNum}: ${config.contractAddress}`)
  }

  return {
    ...config,
    contractAddress: checksummedAddress || config.contractAddress
  }
}

// IPFS Configuration
export const IPFS_CONFIG = {
  gateways: [
    'https://ipfs.io/ipfs',
    'https://gateway.pinata.cloud/ipfs',
    'https://cloudflare-ipfs.com/ipfs'
  ],
  uploadEndpoints: {
    pinata: {
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      // Note: API keys should be stored in environment variables
      // This is for demo purposes only
    },
    nftStorage: {
      url: 'https://api.nft.storage/upload',
      // Note: API keys should be stored in environment variables
    }
  }
}

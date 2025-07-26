# SecureX Smart Contract Integration Setup

## Overview
Your SecureX dashboard is now configured to connect to your deployed smart contract on Sepolia testnet. Follow these steps to complete the setup.

## Configuration Required

### 1. Update Contract Address
Edit `src/config/contract.js` and replace the example contract address with your actual deployed contract address:

```javascript
// Replace this example address with your deployed contract address
contractAddress: '0x742d35Cc6506C4A9E6D29F0f9F5a8dF07c9c31a5'
```

### 2. Smart Contract ABI
The current ABI in `src/config/contract.js` expects your smart contract to have these functions:

**Required Functions:**
- `uploadDocument(string _fileName, string _ipfsHash, uint256 _fileSize)`
- `getUserDocuments(address _user) returns (uint256[])`
- `getDocument(uint256 _documentId) returns (string, string, address, uint256, uint256, bool)`
- `getDocumentCount() returns (uint256)`

**Required Events:**
- `DocumentUploaded(uint256 indexed documentId, address indexed uploader, string fileName, string ipfsHash)`
- `DocumentViewed(uint256 indexed documentId, address indexed viewer, uint256 timestamp)`

### 3. Example Solidity Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureXDocuments {
    struct Document {
        string fileName;
        string ipfsHash;
        address uploader;
        uint256 timestamp;
        uint256 fileSize;
        bool isActive;
    }
    
    mapping(uint256 => Document) public documents;
    mapping(address => uint256[]) public userDocuments;
    uint256 public documentCount;
    
    event DocumentUploaded(uint256 indexed documentId, address indexed uploader, string fileName, string ipfsHash);
    event DocumentViewed(uint256 indexed documentId, address indexed viewer, uint256 timestamp);
    
    function uploadDocument(string memory _fileName, string memory _ipfsHash, uint256 _fileSize) public {
        documentCount++;
        documents[documentCount] = Document(_fileName, _ipfsHash, msg.sender, block.timestamp, _fileSize, true);
        userDocuments[msg.sender].push(documentCount);
        emit DocumentUploaded(documentCount, msg.sender, _fileName, _ipfsHash);
    }
    
    function getUserDocuments(address _user) public view returns (uint256[] memory) {
        return userDocuments[_user];
    }
    
    function getDocument(uint256 _documentId) public view returns (string memory, string memory, address, uint256, uint256, bool) {
        Document memory doc = documents[_documentId];
        return (doc.fileName, doc.ipfsHash, doc.uploader, doc.timestamp, doc.fileSize, doc.isActive);
    }
    
    function getDocumentCount() public view returns (uint256) {
        return documentCount;
    }
}
```

## Network Configuration

### Sepolia Testnet (Recommended)
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
- Block Explorer: https://sepolia.etherscan.io

### Goerli Testnet (Alternative)
- Chain ID: 5
- RPC URL: https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
- Block Explorer: https://goerli.etherscan.io

## Testing the Integration

1. **Connect Wallet**: Connect MetaMask to Sepolia testnet
2. **Upload Document**: Use the Upload page to test file upload to IPFS and blockchain
3. **View Documents**: Check Recent Documents page to see uploaded files
4. **Activity Logs**: Monitor contract events in Activity Logs
5. **Download**: Test file downloads from IPFS in Download Center

## Expected Behavior

✅ **Working Features:**
- Wallet connection with MetaMask
- Network detection and switching
- Real contract interaction for document uploads
- IPFS file uploads (mock implementation)
- Document retrieval from blockchain
- Activity log generation from contract events
- Download functionality from IPFS

⚠️ **Current Limitations:**
- IPFS uploads are mocked (need real IPFS API keys)
- Some activity events are simulated for demo purposes
- Download counts and view statistics are mock data

## Troubleshooting

### Contract Not Connected
- Verify contract address is correct
- Check network (should be Sepolia/Goerli)
- Ensure contract is deployed and verified

### Upload Failures
- Check MetaMask has sufficient ETH for gas
- Verify contract has uploadDocument function
- Check IPFS service is working

### No Documents Showing
- Confirm wallet address has uploaded documents
- Check contract getUserDocuments function
- Verify ABI matches deployed contract

## Production Considerations

For production deployment:

1. **Real IPFS Integration**: Replace mock IPFS service with real Pinata/NFT.Storage API
2. **Mainnet Deployment**: Deploy to Ethereum mainnet or Polygon
3. **Gas Optimization**: Optimize smart contract for lower gas usage
4. **Security Audit**: Conduct thorough security audit
5. **API Keys**: Secure IPFS API keys in environment variables

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify contract deployment on block explorer
3. Test contract functions directly on Etherscan
4. Ensure MetaMask is connected to correct network

import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { config } from 'dotenv'

config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'securex-dev-secret'

// File upload configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SecureX Backend is running!' })
})

// Authentication endpoint
app.post('/api/auth', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body
    
    // In production, verify the signature properly
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' })
    }

    const token = jwt.sign(
      { walletAddress, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ 
      token, 
      walletAddress,
      message: 'Authentication successful' 
    })
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' })
  }
})

// Upload endpoint (placeholder for IPFS integration)
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { file } = req
    const { walletAddress } = req.user

    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    // TODO: Implement IPFS upload
    const mockIPFSHash = `Qm${Math.random().toString(36).substring(2, 15)}`
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`

    // In production, upload to IPFS and store transaction on blockchain
    const response = {
      success: true,
      fileName: file.originalname,
      fileSize: file.size,
      ipfsHash: mockIPFSHash,
      transactionHash: mockTxHash,
      uploader: walletAddress,
      timestamp: new Date().toISOString()
    }

    res.json(response)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Get user documents
app.get('/api/documents', authenticateToken, (req, res) => {
  try {
    const { walletAddress } = req.user
    
    // Mock data - in production, fetch from database
    const documents = [
      {
        id: 1,
        name: 'Project Whitepaper.pdf',
        ipfsHash: 'QmXyZ123abc456def789',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        uploadDate: '2024-01-15T14:30:25Z',
        fileSize: 2458624,
        uploader: walletAddress,
        views: 45
      },
      {
        id: 2,
        name: 'Smart Contract Audit.pdf',
        ipfsHash: 'QmAbc456def789xyz123',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        uploadDate: '2024-01-14T13:45:12Z',
        fileSize: 1888256,
        uploader: walletAddress,
        views: 23
      }
    ]

    res.json({ documents })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

// Get activity logs
app.get('/api/activity', authenticateToken, (req, res) => {
  try {
    const { walletAddress } = req.user
    
    // Mock activity data
    const activities = [
      {
        id: 1,
        action: 'Document Uploaded',
        document: 'project_overview.pdf',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        timestamp: '2024-01-15T14:30:25Z',
        user: walletAddress
      },
      {
        id: 2,
        action: 'File Accessed',
        document: 'whitepaper.pdf',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        timestamp: '2024-01-15T13:45:12Z',
        user: walletAddress
      }
    ]

    res.json({ activities })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs' })
  }
})

// AI Chat endpoint (placeholder)
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, documentId } = req.body
    
    // TODO: Implement LangChain integration
    const mockResponse = `I understand you're asking about "${message}". This AI chat feature will be implemented with LangChain to analyze your uploaded documents and provide intelligent responses based on their content.`

    res.json({ 
      response: mockResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Chat request failed' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 SecureX Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

import React from 'react'
import { motion } from 'framer-motion'
import { DocumentIcon, EyeIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'

const Access = () => {
  // Mock data for documents
  const documents = [
    {
      id: 1,
      name: 'Project Whitepaper.pdf',
      hash: 'QmXyZ123...',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      views: 45
    },
    {
      id: 2,
      name: 'Smart Contract Audit.pdf',
      hash: 'QmAbc456...',
      uploadDate: '2024-01-14',
      size: '1.8 MB',
      views: 23
    },
    {
      id: 3,
      name: 'Technical Documentation.docx',
      hash: 'QmDef789...',
      uploadDate: '2024-01-13',
      size: '3.2 MB',
      views: 67
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Documents</h1>
        <p className="text-gray-300">Manage and access your uploaded documents</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Your Documents</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Document</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">IPFS Hash</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Upload Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Views</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {documents.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="w-6 h-6 text-neon-green" />
                        <div>
                          <p className="text-white font-medium">{doc.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">
                        {doc.hash}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{doc.uploadDate}</td>
                    <td className="px-6 py-4 text-gray-300">{doc.size}</td>
                    <td className="px-6 py-4 text-gray-300">{doc.views}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default Access

import React from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header currentPage={currentPage} />
        
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

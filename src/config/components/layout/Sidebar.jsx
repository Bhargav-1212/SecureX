import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon, 
  CloudArrowUpIcon, 
  DocumentIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  FolderOpenIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../ui/GlassCard'

const Sidebar = ({ currentPage, onPageChange, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const navigation = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'upload', name: 'Upload', icon: CloudArrowUpIcon },
    { id: 'recent', name: 'Recent Documents', icon: FolderOpenIcon },
    { id: 'access', name: 'Access Files', icon: DocumentIcon },
    { id: 'activity', name: 'Activity Logs', icon: ClockIcon },
    { id: 'download', name: 'Download Center', icon: ArrowDownTrayIcon },
    { id: 'chat', name: 'AI Document Chat', icon: ChatBubbleLeftRightIcon },
    { id: 'control', name: 'Access Control', icon: ShieldCheckIcon }
  ]
  
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' }
  }
  
  const NavItem = ({ item, isActive }) => (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        onPageChange(item.id)
        setIsMobileOpen(false)
      }}
      className={`
        w-full flex items-center px-4 py-3 rounded-xl
        transition-all duration-200 group relative
        ${isActive 
          ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
          : 'text-gray-300 hover:text-white hover:bg-white/10'
        }
      `}
    >
      <item.icon className={`
        w-6 h-6 transition-all duration-200
        ${isActive ? 'text-neon-green' : 'text-gray-400 group-hover:text-white'}
      `} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="ml-3 font-medium"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute right-0 w-1 h-8 bg-neon-green rounded-l-full"
        />
      )}
    </motion.button>
  )
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-6 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-emerald-400 rounded-xl flex items-center justify-center">
          <span className="text-gray-900 font-bold text-xl">S</span>
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3"
            >
              <h1 className="text-xl font-bold text-white">SecureX</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavItem 
            key={item.id} 
            item={item} 
            isActive={currentPage === item.id}
          />
        ))}
      </nav>
      
      {/* Collapse Toggle */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 hidden lg:flex items-center justify-center"
        >
          <Bars3Icon className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
  
  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-glass-dark backdrop-blur-sm border border-white/20 text-white"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className={`
          hidden lg:flex flex-col
          fixed left-0 top-0 h-full z-40
          ${className}
        `}
      >
        <GlassCard className="h-full rounded-none rounded-r-2xl border-l-0">
          <SidebarContent />
        </GlassCard>
      </motion.aside>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              <GlassCard className="h-full rounded-none rounded-r-2xl border-l-0">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <SidebarContent />
              </GlassCard>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar

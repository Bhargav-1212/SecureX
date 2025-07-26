import { ethers } from 'ethers'

/**
 * Utility functions for Ethereum address handling
 */

/**
 * Validates and returns a proper checksummed Ethereum address
 * @param {string} address - The address to validate and checksum
 * @returns {string} - The properly checksummed address
 * @throws {Error} - If the address is invalid
 */
export const getChecksumAddress = (address) => {
  try {
    if (!address || typeof address !== 'string') {
      throw new Error('Invalid address format')
    }
    
    // Remove any whitespace and ensure it starts with 0x
    const cleanAddress = address.trim()
    if (!cleanAddress.startsWith('0x')) {
      throw new Error('Address must start with 0x')
    }
    
    // Use ethers.js to get the proper checksum address
    return ethers.getAddress(cleanAddress)
  } catch (error) {
    throw new Error(`Invalid Ethereum address: ${error.message}`)
  }
}

/**
 * Validates if an address is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidAddress = (address) => {
  try {
    getChecksumAddress(address)
    return true
  } catch {
    return false
  }
}

/**
 * Safely gets a checksummed address or returns null if invalid
 * @param {string} address - The address to process
 * @returns {string|null} - The checksummed address or null if invalid
 */
export const safeGetChecksumAddress = (address) => {
  try {
    return getChecksumAddress(address)
  } catch {
    return null
  }
}

/**
 * Formats an address for display (truncated with ellipsis)
 * @param {string} address - The address to format
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  try {
    const checksummed = getChecksumAddress(address)
    if (checksummed.length <= startChars + endChars) {
      return checksummed
    }
    return `${checksummed.slice(0, startChars)}...${checksummed.slice(-endChars)}`
  } catch {
    return 'Invalid Address'
  }
}

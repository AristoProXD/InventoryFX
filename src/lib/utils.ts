import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Product } from '@/types'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in Argentine Pesos
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Format date to local string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Determine product status based on stock levels
 */
export function getProductStatus(stock: number, minStock: number): Product['status'] {
  if (stock === 0) return 'out_of_stock'
  if (stock <= minStock) return 'low_stock'
  return 'active'
}

/**
 * Generate random SKU
 */
export function generateSKU(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 3).toUpperCase()
  return `FUX-${timestamp}${random}`.slice(0, 12)
}

/**
 * Validate SKU format
 */
export function isValidSKU(sku: string): boolean {
  const skuPattern = /^[A-Z0-9]{3,}-[A-Z0-9]{3,}$/
  return skuPattern.test(sku)
}

/**
 * Calculate stock percentage for progress bars
 */
export function getStockPercentage(current: number, minimum: number): number {
  if (current === 0) return 0
  const target = minimum * 2 // Target is double the minimum
  return Math.min(100, (current / target) * 100)
}

/**
 * Search products by name or SKU
 */
export function searchProducts(products: Product[], searchTerm: string): Product[] {
  if (!searchTerm.trim()) return products
  
  const term = searchTerm.toLowerCase()
  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.sku.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  )
}

/**
 * Filter products by category
 */
export function filterProductsByCategory(products: Product[], category: string): Product[] {
  if (category === 'all') return products
  return products.filter(product => product.category === category)
}

/**
 * Sort products by different criteria
 */
export function sortProducts(products: Product[], sortBy: 'name' | 'stock' | 'price' | 'lastUpdated', order: 'asc' | 'desc' = 'asc'): Product[] {
  return [...products].sort((a, b) => {
    let aVal: any, bVal: any
    
    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
        break
      case 'stock':
        aVal = a.stock
        bVal = b.stock
        break
      case 'price':
        aVal = a.price
        bVal = b.price
        break
      case 'lastUpdated':
        aVal = new Date(a.lastUpdated).getTime()
        bVal = new Date(b.lastUpdated).getTime()
        break
      default:
        return 0
    }
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Calculate inventory statistics
 */
export function calculateInventoryStats(products: Product[]) {
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const lowStockProducts = products.filter(p => p.status === 'low_stock').length
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock').length
  const inactiveProducts = products.filter(p => p.status === 'inactive').length
  
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0)
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0)
  
  return {
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    inactiveProducts,
    totalValue,
    totalUnits,
    averageValue: totalProducts > 0 ? totalValue / totalProducts : 0
  }
}

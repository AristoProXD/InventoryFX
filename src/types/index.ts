// ===== PRODUCTO =====
export interface Product {
  id: string
  name: string
  description: string
  category: string
  color: string
  sku: string
  stock: number
  minStock: number
  price: number
  location: string
  supplier: string
  lastUpdated: string
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock'
  order?: number
}

// ===== USUARIO FAMILIAR =====
export interface User {
  username: string
  name: string
  loginTime: string
}

// ===== DEUDA =====
export interface Debt {
  id: string
  type: 'owe_us' | 'we_owe'
  personName: string
  productName: string
  quantity: number
  unitPrice: number
  totalAmount: number
  description: string
  date: string
  status: 'pending' | 'paid' | 'cancelled'
}

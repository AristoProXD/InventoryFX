'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Minus, Edit3, Save, X, Users, CreditCard, Clock, LogOut } from 'lucide-react'
import AddProductModal from '@/components/AddProductModal'
import { Product, Debt } from '@/types'

// Productos FUXION con precios en Soles
const MOCK_PRODUCTS_BASE = [
  // Sistema Base
  {
    id: '1',
    name: 'REXET',
    description: 'Complemento nutricional para el sistema base',
    category: 'Sistema Base',
    sku: 'FUX-REXET-001',
    stock: 45,
    minStock: 15,
    price: 185.00,
    location: 'Estante A-1',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'PRUNEX 1',
    description: 'Suplemento nutricional para el bienestar digestivo',
    category: 'Sistema Base',
    sku: 'FUX-PRUNEX-002',
    stock: 28,
    minStock: 12,
    price: 165.00,
    location: 'Estante A-2',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '3',
    name: 'B-PROTE',
    description: 'Proteína vegetal de alta calidad',
    category: 'Sistema Base / Inmunológica',
    sku: 'FUX-BPROTE-003',
    stock: 8,
    minStock: 20,
    price: 195.00,
    location: 'Estante A-3',
    supplier: 'FUXION',
    status: 'low_stock' as const
  },
  // Inmunológica
  {
    id: '4',
    name: 'VERA+',
    description: 'Potenciador del sistema inmunológico con aloe vera',
    category: 'Inmunológica',
    sku: 'FUX-VERA-004',
    stock: 32,
    minStock: 10,
    price: 125.00,
    location: 'Estante B-1',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '5',
    name: 'GANO CAPPUCCINO+',
    description: 'Cappuccino funcional con Ganoderma',
    category: 'Inmunológica',
    sku: 'FUX-GANO-005',
    stock: 15,
    minStock: 8,
    price: 85.00,
    location: 'Estante B-2',
    supplier: 'FUXION',
    status: 'active' as const
  },
  // Control de peso
  {
    id: '6',
    name: 'THERMO T3',
    description: 'Termogénico natural para control de peso',
    category: 'Control de Peso',
    sku: 'FUX-THERMO-006',
    stock: 22,
    minStock: 15,
    price: 145.00,
    location: 'Estante C-1',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '7',
    name: 'NOCARB-T',
    description: 'Bloqueador de carbohidratos',
    category: 'Control de Peso',
    sku: 'FUX-NOCARB-007',
    stock: 12,
    minStock: 18,
    price: 135.00,
    location: 'Estante C-2',
    supplier: 'FUXION',
    status: 'low_stock' as const
  },
  {
    id: '8',
    name: 'CAFÉ',
    description: 'Café funcional FUXION',
    category: 'Control de Peso',
    sku: 'FUX-CAFE-008',
    stock: 38,
    minStock: 12,
    price: 75.00,
    location: 'Estante C-3',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '9',
    name: 'CAFÉ FIT',
    description: 'Café funcional para control de peso',
    category: 'Control de Peso',
    sku: 'FUX-CAFEFIT-009',
    stock: 0,
    minStock: 10,
    price: 95.00,
    location: 'Estante C-4',
    supplier: 'FUXION',
    status: 'out_of_stock' as const
  },
  {
    id: '10',
    name: 'BIOPRO+ FIT',
    description: 'Proteína especializada para fitness',
    category: 'Control de Peso',
    sku: 'FUX-BIOPROFIT-010',
    stock: 18,
    minStock: 12,
    price: 225.00,
    location: 'Estante C-5',
    supplier: 'FUXION',
    status: 'active' as const
  },
  // Anti-edad
  {
    id: '11',
    name: 'YOUTH ELIXIR',
    description: 'Elixir anti-edad con antioxidantes',
    category: 'Anti-edad',
    sku: 'FUX-YOUTH-011',
    stock: 25,
    minStock: 8,
    price: 285.00,
    location: 'Estante D-1',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '12',
    name: 'BEAUTY-IN',
    description: 'Suplemento para la belleza desde adentro',
    category: 'Anti-edad',
    sku: 'FUX-BEAUTY-012',
    stock: 14,
    minStock: 15,
    price: 215.00,
    location: 'Estante D-2',
    supplier: 'FUXION',
    status: 'low_stock' as const
  },
  // Vigor mental
  {
    id: '13',
    name: 'PASSION',
    description: 'Potenciador de la vitalidad y energía',
    category: 'Vigor Mental',
    sku: 'FUX-PASSION-013',
    stock: 35,
    minStock: 12,
    price: 165.00,
    location: 'Estante E-1',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '14',
    name: 'GOLDEN FLX',
    description: 'Suplemento para la flexibilidad mental',
    category: 'Vigor Mental',
    sku: 'FUX-GOLDEN-014',
    stock: 19,
    minStock: 10,
    price: 195.00,
    location: 'Estante E-2',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '15',
    name: 'PROBAL',
    description: 'Equilibrio probiótico para bienestar digestivo',
    category: 'Vigor Mental',
    sku: 'FUX-PROBAL-015',
    stock: 23,
    minStock: 12,
    price: 175.00,
    location: 'Estante E-3',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '16',
    name: 'ON',
    description: 'Activador de energía mental',
    category: 'Vigor Mental',
    sku: 'FUX-ON-016',
    stock: 31,
    minStock: 15,
    price: 145.00,
    location: 'Estante E-4',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '17',
    name: 'NO STRESS',
    description: 'Reductor natural del estrés',
    category: 'Vigor Mental',
    sku: 'FUX-NOSTRESS-017',
    stock: 7,
    minStock: 15,
    price: 155.00,
    location: 'Estante E-5',
    supplier: 'FUXION',
    status: 'low_stock' as const
  },
  // Sport
  {
    id: '18',
    name: 'BIOPRO SPORT',
    description: 'Proteína especializada para deportistas',
    category: 'Sport',
    sku: 'FUX-BIOPROSP-018',
    stock: 42,
    minStock: 20,
    price: 245.00,
    location: 'Estante F-1',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '19',
    name: 'PROTEIN ACTIVE SPORT',
    description: 'Proteína activa para rendimiento deportivo',
    category: 'Sport',
    sku: 'FUX-PROTEINACTIVE-019',
    stock: 29,
    minStock: 18,
    price: 265.00,
    location: 'Estante F-2',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '20',
    name: 'PRE SPORT',
    description: 'Pre-entreno para máximo rendimiento',
    category: 'Sport',
    sku: 'FUX-PRESPORT-020',
    stock: 26,
    minStock: 15,
    price: 175.00,
    location: 'Estante F-3',
    supplier: 'FUXION',
    status: 'active' as const
  },
  {
    id: '21',
    name: 'POST SPORT',
    description: 'Recuperación post-entreno',
    category: 'Sport',
    sku: 'FUX-POSTSPORT-021',
    stock: 0,
    minStock: 12,
    price: 185.00,
    location: 'Estante F-4',
    supplier: 'FUXION',
    status: 'out_of_stock' as const
  }
] as const

// Convertir productos base a productos completos con lastUpdated
const MOCK_PRODUCTS: Product[] = MOCK_PRODUCTS_BASE.map(product => ({
  ...product,
  lastUpdated: new Date()
}))

// Datos mock para deudas
const MOCK_DEBTS: Debt[] = [
  {
    id: '1',
    type: 'owe_us',
    personName: 'Juan Pérez',
    productName: 'REXET',
    quantity: 2,
    unitPrice: 185.00,
    totalAmount: 370.00,
    description: 'Venta fiado',
    date: new Date('2025-07-15'),
    status: 'pending'
  },
  {
    id: '2',
    type: 'we_owe',
    personName: 'Proveedor ABC',
    productName: 'THERMO T3',
    quantity: 10,
    unitPrice: 145.00,
    totalAmount: 1450.00,
    description: 'Mercadería recibida pendiente de pago',
    date: new Date('2025-07-18'),
    status: 'pending'
  },
  {
    id: '3',
    type: 'owe_us',
    personName: 'María González',
    productName: 'CAFÉ FIT',
    quantity: 1,
    unitPrice: 95.00,
    totalAmount: 95.00,
    description: 'Venta a crédito',
    date: new Date('2025-07-20'),
    status: 'pending'
  }
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [debts, setDebts] = useState<Debt[]>(MOCK_DEBTS)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ price: 0, description: '', sku: '' })
  const [activeTab, setActiveTab] = useState<'inventory' | 'debts'>('inventory')
  const [isAddDebtModalOpen, setIsAddDebtModalOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('fuxion_user')
      if (userData) {
        setCurrentUser(JSON.parse(userData))
      } else {
        // Redirigir al login si no está autenticado
        window.location.href = '/login'
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('fuxion_user')
    window.location.href = '/login'
  }

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * p.price), 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value)
  }

  // Función para actualizar el estado del producto basado en el stock
  const updateProductStatus = (stock: number, minStock: number): Product['status'] => {
    if (stock <= 1) return 'out_of_stock'
    if (stock <= 3) return 'low_stock'
    return 'active'
  }

  // Función para incrementar stock
  const incrementStock = (productId: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newStock = product.stock + 1
        return {
          ...product,
          stock: newStock,
          lastUpdated: new Date(),
          status: updateProductStatus(newStock, product.minStock)
        }
      }
      return product
    }))
  }

  // Función para decrementar stock
  const decrementStock = (productId: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId && product.stock > 1) {
        const newStock = product.stock - 1
        return {
          ...product,
          stock: newStock,
          lastUpdated: new Date(),
          status: updateProductStatus(newStock, product.minStock)
        }
      }
      return product
    }))
  }

  // Función para agregar nuevo producto
  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'lastUpdated'>) => {
    const product: Product = {
      ...newProduct,
      id: (products.length + 1).toString(),
      lastUpdated: new Date(),
      status: updateProductStatus(newProduct.stock, newProduct.minStock)
    }
    setProducts(prev => [...prev, product])
    setIsAddModalOpen(false)
  }

  // Función para iniciar edición
  const startEdit = (product: Product) => {
    setEditingProduct(product.id)
    setEditForm({
      price: product.price,
      description: product.description,
      sku: product.sku
    })
  }

  // Función para guardar edición
  const saveEdit = (productId: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          price: editForm.price,
          description: editForm.description,
          sku: editForm.sku,
          lastUpdated: new Date()
        }
      }
      return product
    }))
    setEditingProduct(null)
  }

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm({ price: 0, description: '', sku: '' })
  }

  // Funciones para manejar deudas
  const addDebt = (newDebt: Omit<Debt, 'id' | 'date' | 'totalAmount'>) => {
    const debt: Debt = {
      ...newDebt,
      id: (debts.length + 1).toString(),
      date: new Date(),
      totalAmount: newDebt.quantity * newDebt.unitPrice
    }
    setDebts(prev => [...prev, debt])
    setIsAddDebtModalOpen(false)
  }

  const markDebtAsPaid = (debtId: string) => {
    setDebts(prev => prev.map(debt => 
      debt.id === debtId ? { ...debt, status: 'paid' as const } : debt
    ))
  }

  const deleteDebt = (debtId: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== debtId))
  }

  const debtStats = {
    totalOwedToUs: debts.filter(d => d.type === 'owe_us' && d.status === 'pending').reduce((sum, d) => sum + d.totalAmount, 0),
    totalWeOwe: debts.filter(d => d.type === 'we_owe' && d.status === 'pending').reduce((sum, d) => sum + d.totalAmount, 0),
    pendingDebts: debts.filter(d => d.status === 'pending').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Inventario Fuxion Casa</h1>
                <p className="text-sm text-slate-500">Sistema de Gestión de Almacén</p>
              </div>
            </div>
            
            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">
                  👋 {currentUser?.name}
                </p>
                <p className="text-xs text-slate-500">
                  Usuario Autorizado
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación por pestañas */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventario
                </div>
              </button>
              <button
                onClick={() => setActiveTab('debts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'debts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Deudas
                  {debtStats.pendingDebts > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      {debtStats.pendingDebts}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'inventory' ? (
          <>
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Productos</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <Package className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o QV..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow p-6"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 text-lg">{product.name}</h3>
                  <button
                    onClick={() => startEdit(product)}
                    className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                    title="Editar producto"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                
                {editingProduct === product.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Descripción</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">QV (Puntos)</label>
                      <input
                        type="text"
                        value={editForm.sku}
                        onChange={(e) => setEditForm(prev => ({ ...prev, sku: e.target.value }))}
                        className="w-full p-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Precio</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full p-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-600 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">QV: {product.sku}</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(product.price)}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Stock</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementStock(product.id)}
                      disabled={product.stock <= 1}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className={`text-lg font-bold min-w-[2rem] text-center ${
                      product.stock <= 1 ? 'text-red-600' : 
                      product.stock <= 3 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                    <button
                      onClick={() => incrementStock(product.id)}
                      className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  <span>Mínimo: {product.minStock}</span>
                </div>
              </div>
              
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                product.status === 'active' ? 'bg-green-100 text-green-800' :
                product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {product.status === 'active' ? 'Activo' :
                 product.status === 'low_stock' ? 'Stock Bajo' :
                 'Sin Stock'}
              </div>
            </div>
          ))}
        </div>

        {/* Modal para agregar producto */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
        />
        </>
        ) : (
          <>
        {/* Sección de Deudas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Nos Deben</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(debtStats.totalOwedToUs)}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Debemos</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(debtStats.totalWeOwe)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Deudas Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{debtStats.pendingDebts}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Controles de deudas */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Gestión de Deudas</h2>
            <button 
              onClick={() => setIsAddDebtModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Agregar Deuda
            </button>
          </div>
        </div>

        {/* Lista de deudas */}
        <div className="grid grid-cols-1 gap-4">
          {debts.filter(debt => debt.status === 'pending').map(debt => (
            <div key={debt.id} className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      debt.type === 'owe_us' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {debt.type === 'owe_us' ? 'Nos Deben' : 'Debemos'}
                    </span>
                    <h3 className="font-semibold text-slate-900">{debt.personName}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium">{debt.productName}</span> - Cantidad: {debt.quantity} - 
                    Precio unitario: {formatCurrency(debt.unitPrice)}
                  </p>
                  <p className="text-sm text-slate-500 mb-2">{debt.description}</p>
                  <p className="text-xs text-slate-400">
                    Fecha: {debt.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(debt.totalAmount)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markDebtAsPaid(debt.id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors"
                    >
                      Marcar Pagado
                    </button>
                    <button
                      onClick={() => deleteDebt(debt.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple Modal para agregar deuda */}
        {isAddDebtModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Agregar Nueva Deuda</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addDebt({
                  type: formData.get('type') as 'owe_us' | 'we_owe',
                  personName: formData.get('personName') as string,
                  productName: formData.get('productName') as string,
                  quantity: parseInt(formData.get('quantity') as string),
                  unitPrice: parseFloat(formData.get('unitPrice') as string),
                  description: formData.get('description') as string,
                  status: 'pending'
                })
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select name="type" required className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="owe_us">Nos Deben</option>
                    <option value="we_owe">Debemos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Persona</label>
                  <input name="personName" type="text" required className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
                  <input name="productName" type="text" required className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
                    <input name="quantity" type="number" min="1" required className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Precio Unitario</label>
                    <input name="unitPrice" type="number" step="0.01" min="0" required className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                  <textarea name="description" className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2}></textarea>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
                    Agregar
                  </button>
                  <button type="button" onClick={() => setIsAddDebtModalOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  )
}

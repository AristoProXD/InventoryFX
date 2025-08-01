'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Minus, Save, LogOut, Clock, Edit2, Trash2, UserPlus, Wifi, WifiOff } from 'lucide-react'
import { 
  isSupabaseConfigured, 
  getSupabaseStatus, 
  getProducts, 
  updateProductStock,
  addProduct as addProductToDb,
  getDebts,
  addDebt as addDebtToDb,
  removeDebt as removeDebtFromDb,
  supabase 
} from '@/lib/supabase'

// Configuración del sistema
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 horas

// Datos iniciales de productos (fallback si no hay Supabase)
const INITIAL_PRODUCTS = [
  { id: '1', name: 'REXET', stock: 45, price: 185, qv: 45 },
  { id: '2', name: 'PRUNEX 1', stock: 8, price: 165, qv: 8 },
  { id: '3', name: 'B-PROTE', stock: 0, price: 195, qv: 0 },
  { id: '4', name: 'THERMATRIX', stock: 22, price: 175, qv: 22 },
  { id: '5', name: 'HGH X3', stock: 12, price: 220, qv: 12 }
]

// Datos iniciales de cuentas
const INITIAL_DEBTS: Array<{
  id: string
  type: 'nos_deben' | 'debemos'
  name: string
  amount: number
  description: string
  date: string
}> = []

export function InventoryApp() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [debts, setDebts] = useState(INITIAL_DEBTS)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION)
  const [activeTab, setActiveTab] = useState('inventory')
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [showDebtForm, setShowDebtForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [productForm, setProductForm] = useState({ name: '', price: '', qv: '', stock: '' })
  const [debtForm, setDebtForm] = useState({ type: 'nos_deben', name: '', amount: '', description: '' })
  const [isOnline, setIsOnline] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState(getSupabaseStatus())

  // Verificar estado de Supabase y cargar datos
  useEffect(() => {
    const initializeData = async () => {
      setSupabaseStatus(getSupabaseStatus())
      
      if (isSupabaseConfigured()) {
        // Cargar datos desde Supabase
        try {
          const [productsData, debtsData] = await Promise.all([
            getProducts(),
            getDebts()
          ])
          
          if (productsData && productsData.length > 0) {
            setProducts(productsData.map(product => ({
              id: product.id,
              name: product.name,
              stock: product.stock,
              price: product.price,
              qv: product.qv
            })))
          }
          
          if (debtsData && debtsData.length > 0) {
            setDebts(debtsData.map(debt => ({
              id: debt.id,
              type: debt.type,
              name: debt.name,
              amount: debt.amount,
              description: debt.description || '',
              date: debt.date || new Date().toLocaleDateString()
            })))
          }
          
          setIsOnline(true)
        } catch (error) {
          console.error('Error loading data from Supabase:', error)
          setIsOnline(false)
          // Fallback a localStorage
          loadFromLocalStorage()
        }
      } else {
        // Usar localStorage como fallback
        loadFromLocalStorage()
      }
    }

    initializeData()
  }, [])

  // Suscribirse a cambios en tiempo real de Supabase
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    const productsSubscription = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Products change detected:', payload)
        // Recargar productos
        getProducts().then(data => {
          if (data) {
            setProducts(data.map(product => ({
              id: product.id,
              name: product.name,
              stock: product.stock,
              price: product.price,
              qv: product.qv
            })))
          }
        })
      })
      .subscribe()

    const debtsSubscription = supabase
      .channel('debts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'debts' }, (payload) => {
        console.log('Debts change detected:', payload)
        // Recargar deudas
        getDebts().then(data => {
          if (data) {
            setDebts(data.map(debt => ({
              id: debt.id,
              type: debt.type,
              name: debt.name,
              amount: debt.amount,
              description: debt.description || '',
              date: debt.date || new Date().toLocaleDateString()
            })))
          }
        })
      })
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(productsSubscription)
        supabase.removeChannel(debtsSubscription)
      }
    }
  }, [])

  // Función para cargar desde localStorage (fallback)
  const loadFromLocalStorage = () => {
    const savedProducts = localStorage.getItem('fuxion-products')
    const savedDebts = localStorage.getItem('fuxion-debts')
    const savedTime = localStorage.getItem('fuxion-last-saved')
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts))
    }
    if (savedTime) {
      setLastSaved(new Date(savedTime).toLocaleTimeString())
    }
  }

  // Actualizar tiempo restante
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionData = localStorage.getItem('fuxion-session')
      if (sessionData) {
        const { timestamp } = JSON.parse(sessionData)
        const elapsed = Date.now() - timestamp
        const remaining = SESSION_DURATION - elapsed

        if (remaining <= 0) {
          handleLogout()
        } else {
          setTimeRemaining(remaining)
        }
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const updateStock = async (productId: string, change: number) => {
    const currentProduct = products.find(p => p.id === productId)
    if (!currentProduct) return

    const newStock = Math.max(0, currentProduct.stock + change)
    
    // Actualizar estado local inmediatamente
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return { ...product, stock: newStock }
      }
      return product
    }))

    // Intentar actualizar en Supabase
    if (isSupabaseConfigured()) {
      try {
        await updateProductStock(productId, newStock)
        setIsOnline(true)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      } catch (error) {
        console.error('Error updating stock in Supabase:', error)
        setIsOnline(false)
        // Marcar cambios como no guardados para localStorage
        setHasUnsavedChanges(true)
      }
    } else {
      setHasUnsavedChanges(true)
    }
  }

  const updateProduct = (productId: string, field: string, value: any) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return { ...product, [field]: value }
      }
      return product
    }))
    setHasUnsavedChanges(true)
    setSaveSuccess(false)
  }

  const addDebt = async () => {
    if (!debtForm.name || !debtForm.amount) return
    
    const newDebt = {
      id: Date.now().toString(),
      type: debtForm.type as 'nos_deben' | 'debemos',
      name: debtForm.name,
      amount: parseFloat(debtForm.amount),
      description: debtForm.description,
      date: new Date().toLocaleDateString()
    }

    // Actualizar estado local
    setDebts(prev => [...prev, newDebt])
    setDebtForm({ type: 'nos_deben', name: '', amount: '', description: '' })
    setShowDebtForm(false)

    // Intentar guardar en Supabase
    if (isSupabaseConfigured()) {
      try {
        await addDebtToDb({
          type: newDebt.type,
          name: newDebt.name,
          amount: newDebt.amount,
          description: newDebt.description
        })
        setIsOnline(true)
      } catch (error) {
        console.error('Error adding debt to Supabase:', error)
        setIsOnline(false)
        setHasUnsavedChanges(true)
      }
    } else {
      setHasUnsavedChanges(true)
    }
  }

  const addProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.qv) return
    
    const newProduct = {
      id: Date.now().toString(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      qv: parseInt(productForm.qv),
      stock: parseInt(productForm.stock) || 0
    }

    // Actualizar estado local
    setProducts(prev => [...prev, newProduct])
    setProductForm({ name: '', price: '', qv: '', stock: '' })
    setShowProductForm(false)

    // Intentar guardar en Supabase
    if (isSupabaseConfigured()) {
      try {
        await addProductToDb({
          name: newProduct.name,
          price: newProduct.price,
          qv: newProduct.qv,
          stock: newProduct.stock
        })
        setIsOnline(true)
      } catch (error) {
        console.error('Error adding product to Supabase:', error)
        setIsOnline(false)
        setHasUnsavedChanges(true)
      }
    } else {
      setHasUnsavedChanges(true)
    }
  }

  const removeDebt = async (debtId: string) => {
    // Actualizar estado local
    setDebts(prev => prev.filter(debt => debt.id !== debtId))

    // Intentar eliminar de Supabase
    if (isSupabaseConfigured()) {
      try {
        await removeDebtFromDb(debtId)
        setIsOnline(true)
      } catch (error) {
        console.error('Error removing debt from Supabase:', error)
        setIsOnline(false)
        setHasUnsavedChanges(true)
      }
    } else {
      setHasUnsavedChanges(true)
    }
  }

  const handleSave = () => {
    // Guardar en localStorage como respaldo
    localStorage.setItem('fuxion-products', JSON.stringify(products))
    localStorage.setItem('fuxion-debts', JSON.stringify(debts))
    localStorage.setItem('fuxion-last-saved', new Date().toISOString())
    setHasUnsavedChanges(false)
    setSaveSuccess(true)
    setLastSaved(new Date().toLocaleTimeString())
    
    // Ocultar mensaje de éxito después de 3 segundos
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('fuxion-session')
    window.location.reload()
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (product: any) => {
    if (product.stock === 0) return 'bg-red-50 border-red-200 text-red-800'
    if (product.stock === 1) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-green-50 border-green-200 text-green-800'
  }

  const getStatusText = (product: any) => {
    if (product.stock === 0) return 'Sin Stock'
    if (product.stock === 1) return 'Stock Bajo'
    return 'Disponible'
  }

  const stats = {
    total: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    lowStock: products.filter(p => p.stock === 1).length,
    outStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * p.price), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de error Supabase */}
      {(!isSupabaseConfigured() || !isOnline) && (
        <div className="w-full bg-red-600 text-white text-center py-2 warehouse-alert shadow-lg transition-all duration-200">
          <span className="font-semibold">{!isSupabaseConfigured() ? 'Error: Supabase no está configurado correctamente. La app está en modo local.' : 'Error: Sin conexión con Supabase. Cambios no se sincronizan.'}</span>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Inventario Fuxion Casa</h1>
              
              {/* Indicador de estado de Supabase */}
              <div className="flex items-center gap-2">
                {isSupabaseConfigured() ? (
                  <div className="flex items-center gap-1">
                    {isOnline ? (
                      <Wifi className="h-4 w-4 text-green-600" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                      {isOnline ? 'Sincronizado' : 'Sin conexión'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Modo local</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Botón guardar - Solo visible si no hay Supabase o hay cambios sin guardar */}
              {(!isSupabaseConfigured() || hasUnsavedChanges) && (
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    hasUnsavedChanges
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </button>
              )}

              {/* Estado */}
              <div className="text-sm">
                {hasUnsavedChanges && (
                  <span className="text-amber-600">⚠️ Cambios sin guardar</span>
                )}
                {saveSuccess && (
                  <span className="text-green-600">✅ Guardado exitoso</span>
                )}
                {lastSaved && !hasUnsavedChanges && !saveSuccess && (
                  <span className="text-gray-500">Última vez: {lastSaved}</span>
                )}
              </div>

              {/* Tiempo y logout */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Productos</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalStock}</div>
            <div className="text-sm text-gray-600">Stock Total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <div className="text-sm text-gray-600">Stock Bajo</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-red-600">{stats.outStock}</div>
            <div className="text-sm text-gray-600">Sin Stock</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">S/ {stats.totalValue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📦 Inventario
              </button>
              <button
                onClick={() => setActiveTab('debts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'debts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💰 Cuentas
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Productos en Inventario</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Agregar Producto
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          {editingProduct === product.id ? (
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                              onBlur={() => setEditingProduct(null)}
                              onKeyDown={(e) => e.key === 'Enter' && setEditingProduct(null)}
                              className="font-semibold text-lg bg-transparent border-b border-blue-500 focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                          )}
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">Precio: S/ {product.price}</span>
                            <span className="text-sm text-gray-600">QV: {product.qv}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product)}`}>
                            {getStatusText(product)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStock(product.id, -1)}
                          disabled={product.stock === 0}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{product.stock}</span>
                        <button
                          onClick={() => updateStock(product.id, 1)}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => setEditingProduct(editingProduct === product.id ? null : product.id)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'debts' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Cuentas y Deudas</h2>
              <button
                onClick={() => setShowDebtForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                Agregar Cuenta
              </button>
            </div>

            <div className="p-6">
              {debts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay cuentas registradas</p>
                  <p className="text-sm mt-2">Agrega la primera cuenta para comenzar</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {debts.map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            debt.type === 'nos_deben' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {debt.type === 'nos_deben' ? 'Nos deben' : 'Debemos'}
                          </span>
                          <h3 className="font-semibold text-gray-900">{debt.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{debt.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Fecha: {debt.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">S/ {debt.amount.toFixed(2)}</span>
                        <button
                          onClick={() => removeDebt(debt.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Producto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">QV</label>
                <input
                  type="number"
                  value={productForm.qv}
                  onChange={(e) => setProductForm(prev => ({ ...prev, qv: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addProduct}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowProductForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDebtForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Agregar Nueva Cuenta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={debtForm.type}
                  onChange={(e) => setDebtForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="nos_deben">Nos deben</option>
                  <option value="debemos">Debemos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={debtForm.name}
                  onChange={(e) => setDebtForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nombre de la persona"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <input
                  type="number"
                  value={debtForm.amount}
                  onChange={(e) => setDebtForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  value={debtForm.description}
                  onChange={(e) => setDebtForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Descripción de la deuda"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addDebt}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowDebtForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

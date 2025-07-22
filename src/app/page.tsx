'use client'

import { useState, useEffect } from 'react'
import { Product, Debt } from '@/types'
import { useRealtimeProducts, useRealtimeDebts } from '@/lib/hooks'
import { Package, Plus, Search, Users } from 'lucide-react'

export default function InventoryPage() {
  // Hooks de sincronización
  const { products, loading: productsLoading, updateProduct, addProduct } = useRealtimeProducts()
  const { debts, loading: debtsLoading, addDebt, updateDebt, deleteDebt } = useRealtimeDebts()

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddDebt, setShowAddDebt] = useState(false)

  // Función simplificada para actualizar stock
  const handleStockChange = async (productId: string, change: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newStock = Math.max(0, product.stock + change)
    const newStatus = newStock === 0 ? 'out_of_stock' 
                    : newStock <= product.minStock ? 'low_stock' 
                    : 'active' as const

    const updatedProduct: Product = {
      ...product,
      stock: newStock,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    }

    await updateProduct(updatedProduct)
  }

  // Función para agregar producto
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string || '',
      category: formData.get('category') as string || 'General',
      sku: formData.get('sku') as string,
      stock: parseInt(formData.get('stock') as string),
      minStock: parseInt(formData.get('minStock') as string),
      price: parseFloat(formData.get('price') as string),
      location: formData.get('location') as string || '',
      supplier: formData.get('supplier') as string || '',
      status: 'active' as const,
      lastUpdated: new Date().toISOString()
    }

    await addProduct(newProduct)
    setShowAddProduct(false)
    ;(e.target as HTMLFormElement).reset()
  }

  // Función para agregar deuda
  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const quantity = parseInt(formData.get('quantity') as string)
    const unitPrice = parseFloat(formData.get('unitPrice') as string)
    
    const newDebt: Debt = {
      id: Date.now().toString(),
      type: formData.get('type') as 'owe_us' | 'we_owe',
      personName: formData.get('personName') as string,
      productName: formData.get('productName') as string,
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      description: formData.get('description') as string || '',
      status: 'pending' as const,
      date: new Date().toISOString()
    }

    await addDebt(newDebt)
    setShowAddDebt(false)
    ;(e.target as HTMLFormElement).reset()
  }

  // Función para marcar deuda como pagada
  const handleMarkPaid = async (debtId: string) => {
    const debt = debts.find(d => d.id === debtId)
    if (!debt) return

    const updatedDebt: Debt = { ...debt, status: 'paid' as const }
    await updateDebt(updatedDebt)
  }

  // Filtros
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingDebts = debts.filter(d => d.status === 'pending')

  // Estadísticas
  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.reduce((acc, p) => acc + (p.stock * p.price), 0),
    pendingDebts: pendingDebts.length,
    debtAmount: pendingDebts.reduce((acc, d) => acc + d.totalAmount, 0)
  }

  if (productsLoading || debtsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando inventario...</p>
          <p className="text-sm text-slate-500 mt-2">🔄 Sincronizando con la base de datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold text-slate-800">Inventario Fuxion Casa</h1>
              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                🔄 Tiempo Real
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
            <div className="text-sm text-slate-600">Productos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <div className="text-sm text-slate-600">Stock Bajo</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <div className="text-sm text-slate-600">Sin Stock</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">${stats.totalValue.toFixed(0)}</div>
            <div className="text-sm text-slate-600">Valor Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.pendingDebts}</div>
            <div className="text-sm text-slate-600">Deudas</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">${stats.debtAmount.toFixed(0)}</div>
            <div className="text-sm text-slate-600">Total Deudas</div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Productos ({filteredProducts.length})
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>
          </div>

          {/* Formulario para agregar producto */}
          {showAddProduct && (
            <form onSubmit={handleAddProduct} className="bg-slate-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="name" placeholder="Nombre" required className="px-3 py-2 border rounded-lg" />
                <input name="sku" placeholder="SKU/QV" required className="px-3 py-2 border rounded-lg" />
                <input name="category" placeholder="Categoría" className="px-3 py-2 border rounded-lg" />
                <input name="stock" type="number" placeholder="Stock" required className="px-3 py-2 border rounded-lg" />
                <input name="minStock" type="number" placeholder="Stock Mínimo" required className="px-3 py-2 border rounded-lg" />
                <input name="price" type="number" step="0.01" placeholder="Precio" required className="px-3 py-2 border rounded-lg" />
                <input name="location" placeholder="Ubicación" className="px-3 py-2 border rounded-lg" />
                <input name="supplier" placeholder="Proveedor" className="px-3 py-2 border rounded-lg" />
                <input name="description" placeholder="Descripción" className="px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowAddProduct(false)} className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Lista de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className={`p-4 rounded-lg border-l-4 ${
                product.status === 'out_of_stock' ? 'border-red-500 bg-red-50' :
                product.status === 'low_stock' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 text-sm">{product.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                    product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {product.status === 'out_of_stock' ? 'Sin Stock' :
                     product.status === 'low_stock' ? 'Stock Bajo' : 'Disponible'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">QV: {product.sku}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-slate-800">{product.stock}</span>
                  <span className="text-sm text-slate-600">Min: {product.minStock}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  <button
                    onClick={() => handleStockChange(product.id, -1)}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white text-sm py-1 rounded"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleStockChange(product.id, 1)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1 rounded"
                  >
                    +1
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-700">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deudas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Deudas ({pendingDebts.length} pendientes)
            </h2>
            <button
              onClick={() => setShowAddDebt(!showAddDebt)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Agregar Deuda
            </button>
          </div>

          {/* Formulario para agregar deuda */}
          {showAddDebt && (
            <form onSubmit={handleAddDebt} className="bg-slate-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="type" required className="px-3 py-2 border rounded-lg">
                  <option value="">Tipo de deuda</option>
                  <option value="owe_us">Nos deben</option>
                  <option value="we_owe">Debemos</option>
                </select>
                <input name="personName" placeholder="Nombre persona" required className="px-3 py-2 border rounded-lg" />
                <input name="productName" placeholder="Producto" required className="px-3 py-2 border rounded-lg" />
                <input name="quantity" type="number" placeholder="Cantidad" required className="px-3 py-2 border rounded-lg" />
                <input name="unitPrice" type="number" step="0.01" placeholder="Precio unitario" required className="px-3 py-2 border rounded-lg" />
                <input name="description" placeholder="Descripción" className="px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowAddDebt(false)} className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Lista de deudas */}
          <div className="space-y-3">
            {pendingDebts.map((debt) => (
              <div key={debt.id} className={`p-4 rounded-lg border-l-4 ${
                debt.type === 'owe_us' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${
                        debt.type === 'owe_us' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {debt.type === 'owe_us' ? '⬆️ Nos deben' : '⬇️ Debemos'}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800">{debt.personName}</p>
                    <p className="text-sm text-slate-600">
                      {debt.quantity}x {debt.productName} a ${debt.unitPrice}
                    </p>
                    {debt.description && (
                      <p className="text-sm text-slate-500 mt-1">{debt.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">${debt.totalAmount.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleMarkPaid(debt.id)}
                        className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Marcar Pagado
                      </button>
                      <button
                        onClick={() => deleteDebt(debt.id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pendingDebts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">No hay deudas pendientes</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

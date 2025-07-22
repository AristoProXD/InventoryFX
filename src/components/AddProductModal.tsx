'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { X, Package } from 'lucide-react'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: Omit<Product, 'id' | 'lastUpdated'>) => void
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    sku: '',
    stock: 0,
    minStock: 0,
    price: 0,
    location: 'Almacén Principal',
    supplier: 'FUXION',
    status: 'active' as const
  })

  const categories = [
    'Sistema Base',
    'Inmunológica', 
    'Control de Peso',
    'Anti-edad',
    'Vigor Mental',
    'Sport'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.sku || !formData.category) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    let status: Product['status'] = 'active'
    if (formData.stock === 0) {
      status = 'out_of_stock'
    } else if (formData.stock <= formData.minStock) {
      status = 'low_stock'
    }

    onAdd({
      ...formData,
      status
    })

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      sku: '',
      stock: 0,
      minStock: 0,
      price: 0,
      location: '',
      supplier: '',
      status: 'active'
    })

    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-slate-900">Agregar Nuevo Producto</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="warehouse-input"
                placeholder="Ej: Proteína Whey Premium"
                required
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="warehouse-input resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            {/* QV */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                QV (Puntos) *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="warehouse-input"
                placeholder="FUX-001"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="warehouse-input"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Actual */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stock Actual
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="warehouse-input"
                placeholder="0"
              />
            </div>

            {/* Stock Mínimo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                min="0"
                className="warehouse-input"
                placeholder="5"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio (ARS)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="warehouse-input"
                placeholder="0.00"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="warehouse-input"
                placeholder="Ej: Almacén Principal"
              />
            </div>

            {/* Proveedor */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Proveedor
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="warehouse-input"
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="warehouse-button"
            >
              Agregar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

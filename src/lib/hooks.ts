import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { Product, Debt } from '@/types'

// Hook para productos con sincronización tiempo real
export function useRealtimeProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Cargar productos iniciales
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      
      // Intentar cargar desde Supabase primero
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name')

        if (!error && data) {
          const mappedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            category: item.category,
            sku: item.qv_points?.toString() || '0', // QV como string
            supplier: item.supplier,
            price: item.price,
            stock: item.stock,
            minStock: item.min_stock,
            location: item.location,
            lastUpdated: new Date(item.updated_at || item.created_at),
            status: item.status
          }))
          setProducts(mappedProducts)
          // Guardar en localStorage como backup
          localStorage.setItem('products', JSON.stringify(mappedProducts))
          setLoading(false)
          return
        }
      }

      // Fallback a localStorage si Supabase no está disponible
      const savedProducts = localStorage.getItem('products')
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback a localStorage
      const savedProducts = localStorage.getItem('products')
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }
      setLoading(false)
    }
  }, [])

  // Actualizar producto con sincronización
  const updateProduct = useCallback(async (updatedProduct: Product) => {
    try {
      setSyncing(true)
      
      // Actualizar localmente primero (UI optimista)
      setProducts(prev => prev.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ))
      
      // Actualizar localStorage
      const updatedProducts = products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      )
      localStorage.setItem('products', JSON.stringify(updatedProducts))

      // Intentar sincronizar con Supabase
      if (supabase) {
        const { error } = await supabase
          .from('products')
          .upsert({
            id: updatedProduct.id,
            name: updatedProduct.name,
            description: updatedProduct.description,
            category: updatedProduct.category,
            supplier: updatedProduct.supplier,
            price: updatedProduct.price,
            stock: updatedProduct.stock,
            min_stock: updatedProduct.minStock,
            qv_points: parseInt(updatedProduct.sku) || 0, // SKU como QV
            location: updatedProduct.location,
            status: updatedProduct.status,
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error syncing product:', error)
        }
      }
      
      setSyncing(false)
    } catch (error) {
      console.error('Error updating product:', error)
      setSyncing(false)
    }
  }, [products])

  // Agregar producto con sincronización
  const addProduct = useCallback(async (newProduct: Product) => {
    try {
      setSyncing(true)
      
      // Actualizar localmente primero
      setProducts(prev => [...prev, newProduct])
      
      // Actualizar localStorage
      const updatedProducts = [...products, newProduct]
      localStorage.setItem('products', JSON.stringify(updatedProducts))

      // Intentar sincronizar con Supabase
      if (supabase) {
        const { error } = await supabase
          .from('products')
          .insert({
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            category: newProduct.category,
            supplier: newProduct.supplier,
            price: newProduct.price,
            stock: newProduct.stock,
            min_stock: newProduct.minStock,
            qv_points: parseInt(newProduct.sku) || 0, // SKU como QV
            location: newProduct.location,
            status: newProduct.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error syncing new product:', error)
        }
      }
      
      setSyncing(false)
    } catch (error) {
      console.error('Error adding product:', error)
      setSyncing(false)
    }
  }, [products])

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    loadProducts()

    // Configurar suscripción tiempo real si Supabase está disponible
    let subscription: any = null
    
    if (supabase) {
      subscription = supabase
        .channel('products_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            console.log('Cambio detectado:', payload)
            // Recargar productos cuando hay cambios
            loadProducts()
          }
        )
        .subscribe()
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [loadProducts])

  return {
    products,
    loading,
    syncing,
    updateProduct,
    addProduct,
    refreshProducts: loadProducts
  }
}

// Hook para deudas con sincronización tiempo real
export function useRealtimeDebts() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const loadDebts = useCallback(async () => {
    try {
      setLoading(true)
      
      if (supabase) {
        const { data, error } = await supabase
          .from('debts')
          .select('*')
          .order('date', { ascending: false })

        if (!error && data) {
          const mappedDebts: Debt[] = data.map(item => ({
            id: item.id,
            type: item.type,
            personName: item.person_name,
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalAmount: item.total_amount,
            description: item.description,
            date: new Date(item.date),
            status: item.status
          }))
          setDebts(mappedDebts)
          localStorage.setItem('debts', JSON.stringify(mappedDebts))
          setLoading(false)
          return
        }
      }

      const savedDebts = localStorage.getItem('debts')
      if (savedDebts) {
        setDebts(JSON.parse(savedDebts))
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading debts:', error)
      const savedDebts = localStorage.getItem('debts')
      if (savedDebts) {
        setDebts(JSON.parse(savedDebts))
      }
      setLoading(false)
    }
  }, [])

  const addDebt = useCallback(async (newDebt: Debt) => {
    try {
      setSyncing(true)
      
      setDebts(prev => [...prev, newDebt])
      const updatedDebts = [...debts, newDebt]
      localStorage.setItem('debts', JSON.stringify(updatedDebts))

      if (supabase) {
        const { error } = await supabase
          .from('debts')
          .insert({
            id: newDebt.id,
            type: newDebt.type,
            person_name: newDebt.personName,
            product_name: newDebt.productName,
            quantity: newDebt.quantity,
            unit_price: newDebt.unitPrice,
            total_amount: newDebt.totalAmount,
            description: newDebt.description,
            date: newDebt.date.toISOString(),
            status: newDebt.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error syncing debt:', error)
        }
      }
      
      setSyncing(false)
    } catch (error) {
      console.error('Error adding debt:', error)
      setSyncing(false)
    }
  }, [debts])

  const updateDebt = useCallback(async (updatedDebt: Debt) => {
    try {
      setSyncing(true)
      
      setDebts(prev => prev.map(d => 
        d.id === updatedDebt.id ? updatedDebt : d
      ))
      
      const updatedDebts = debts.map(d => 
        d.id === updatedDebt.id ? updatedDebt : d
      )
      localStorage.setItem('debts', JSON.stringify(updatedDebts))

      if (supabase) {
        const { error } = await supabase
          .from('debts')
          .update({
            type: updatedDebt.type,
            person_name: updatedDebt.personName,
            product_name: updatedDebt.productName,
            quantity: updatedDebt.quantity,
            unit_price: updatedDebt.unitPrice,
            total_amount: updatedDebt.totalAmount,
            description: updatedDebt.description,
            date: updatedDebt.date.toISOString(),
            status: updatedDebt.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedDebt.id)

        if (error) {
          console.error('Error updating debt:', error)
        }
      }
      
      setSyncing(false)
    } catch (error) {
      console.error('Error updating debt:', error)
      setSyncing(false)
    }
  }, [debts])

  const deleteDebt = useCallback(async (debtId: string) => {
    try {
      setSyncing(true)
      
      setDebts(prev => prev.filter(d => d.id !== debtId))
      const updatedDebts = debts.filter(d => d.id !== debtId)
      localStorage.setItem('debts', JSON.stringify(updatedDebts))

      if (supabase) {
        const { error } = await supabase
          .from('debts')
          .delete()
          .eq('id', debtId)

        if (error) {
          console.error('Error deleting debt:', error)
        }
      }
      
      setSyncing(false)
    } catch (error) {
      console.error('Error deleting debt:', error)
      setSyncing(false)
    }
  }, [debts])

  useEffect(() => {
    loadDebts()

    let subscription: any = null
    
    if (supabase) {
      subscription = supabase
        .channel('debts_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'debts' },
          (payload) => {
            console.log('Debt change detected:', payload)
            loadDebts()
          }
        )
        .subscribe()
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [loadDebts])

  return {
    debts,
    loading,
    syncing,
    addDebt,
    updateDebt,
    deleteDebt,
    refreshDebts: loadDebts
  }
}

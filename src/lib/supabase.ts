// =====================
// MOVIMIENTOS DE PRODUCTOS
// =====================
import { ProductMovement } from '../types'

// Registrar un movimiento de producto (egreso/ingreso)
export const addProductMovement = async (movement: Omit<ProductMovement, 'id' | 'created_at'>) => {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('product_movements')
      .insert([{ ...movement }])
      .select()
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error adding product movement:', error)
    return null
  }
}

// Consultar movimientos de productos (por rango de fechas, opcional)
export const getProductMovements = async (from?: string, to?: string) => {
  if (!supabase) return null
  try {
    let query = supabase
      .from('product_movements')
      .select('*')
      .order('created_at', { ascending: false })
    if (from) query = query.gte('created_at', from)
    if (to) query = query.lte('created_at', to)
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching product movements:', error)
    return null
  }
}
// =====================
// LISTAS DE CLIENTES
// =====================
export interface DatabaseListaCliente {
  id: string
  nombre: string
  fecha: string // ISO date
  direccion?: string
  productos: any[] // [{id, name, cantidad, price, qv}]
  created_at?: string
  updated_at?: string
}

export const getListasClientes = async () => {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('listas_clientes')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching listas_clientes:', error)
    return null
  }
}

export const addListaCliente = async (lista: Omit<DatabaseListaCliente, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('listas_clientes')
      .insert([{ ...lista }])
      .select()
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error adding lista_cliente:', error)
    return null
  }
}

export const updateListaCliente = async (id: string, lista: Partial<DatabaseListaCliente>) => {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('listas_clientes')
      .update({ ...lista, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error updating lista_cliente:', error)
    return null
  }
}

export const removeListaCliente = async (id: string) => {
  if (!supabase) return null
  try {
    const { error } = await supabase
      .from('listas_clientes')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing lista_cliente:', error)
    return false
  }
}
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase - Actualizado para Inventario Fuxion Casa 2025
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Crear cliente de Supabase
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null

// Función para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey && supabase)
}

// Función para obtener estado de conexión
export const getSupabaseStatus = () => {
  if (!supabaseUrl || !supabaseKey) {
    return { configured: false, connected: false, message: 'Credenciales no configuradas' }
  }
  
  if (!supabase) {
    return { configured: false, connected: false, message: 'Cliente no inicializado' }
  }
  
  return { configured: true, connected: true, message: 'Supabase conectado y sincronizando' }
}

// Tipos para la base de datos actualizados
export interface DatabaseProduct {
  id: string
  name: string
  stock: number
  price: number
  qv: number
  min_stock?: number
  status?: 'active' | 'low_stock' | 'out_of_stock' | 'inactive'
  description?: string
  category?: string
  color?: string
  created_at?: string
  updated_at?: string
}

export interface DatabaseDebt {
  id: string
  type: 'nos_deben' | 'debemos'
  name: string
  amount: number
  description?: string
  date?: string
  status?: 'pending' | 'paid' | 'cancelled'
  created_at?: string
  updated_at?: string
}

// Funciones de utilidad para productos
export const getProducts = async () => {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return null
  }
}

export const updateProductStock = async (id: string, stock: number) => {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ stock, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error updating product stock:', error)
    return null
  }
}

export const addProduct = async (product: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
    
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error adding product:', error)
    return null
  }
}

// Funciones de utilidad para deudas
export const getDebts = async () => {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching debts:', error)
    return null
  }
}

export const addDebt = async (debt: Omit<DatabaseDebt, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('debts')
      .insert([debt])
      .select()
    
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error adding debt:', error)
    return null
  }
}

export const removeDebt = async (id: string) => {
  if (!supabase) return null
  
  try {
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing debt:', error)
    return false
  }
}

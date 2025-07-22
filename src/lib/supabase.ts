import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Solo crear cliente si tenemos las credenciales
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
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
  
  return { configured: true, connected: true, message: 'Supabase conectado' }
}

// Tipos para la base de datos
export interface DatabaseProduct {
  id: string
  name: string
  category: string
  supplier: string
  price: number
  stock: number
  min_stock: number
  qv_points: number
  location: string
  status: 'active' | 'low_stock' | 'out_of_stock' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface DatabaseDebt {
  id: string
  debtor_name: string
  amount: number
  description: string
  date: string
  status: 'pending' | 'paid'
  created_at?: string
  updated_at?: string
}

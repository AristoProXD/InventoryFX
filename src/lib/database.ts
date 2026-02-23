/**
 * Database Connection Layer - PostgreSQL (Neon)
 * Reemplaza Supabase con conexión directa a Neon + Vercel Postgres
 */

import { sql } from '@vercel/postgres'
import { EventEmitter } from 'events'

// ===== TIPOS =====
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

export interface DatabaseListaCliente {
  id: string
  nombre: string
  fecha: string
  direccion?: string
  productos: any[]
  created_at?: string
  updated_at?: string
}

// Event Emitter para cambios de datos (simula real-time de Supabase)
export const dbEvents = new EventEmitter()

// ===== VERIFICACIÓN DE CONEXIÓN =====
export const isDatabaseConfigured = () => {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
}

export const getDatabaseStatus = () => {
  if (!isDatabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      message: 'Base de datos no configurada',
    }
  }

  return {
    configured: true,
    connected: true,
    message: 'Conectado a Neon PostgreSQL',
  }
}

// ===== FUNCIONES DE PRODUCTOS =====

export const getProducts = async (): Promise<DatabaseProduct[] | null> => {
  try {
    console.log('[DATABASE] Fetching products...')
    const result = await sql<DatabaseProduct>`
      SELECT * FROM products 
      ORDER BY created_at ASC
    `
    console.log('[DATABASE] Products fetched:', result.rows.length)
    dbEvents.emit('products-loaded', result.rows)
    return result.rows
  } catch (error) {
    console.error('[DATABASE] Error fetching products:', error)
    return null
  }
}

export const addProduct = async (
  product: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabaseProduct | null> => {
  try {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql<DatabaseProduct>`
      INSERT INTO products 
      (id, name, stock, price, qv, min_stock, status, description, category, color, created_at, updated_at)
      VALUES 
      (${id}, ${product.name}, ${product.stock}, ${product.price}, ${product.qv}, 
       ${product.min_stock || 10}, ${product.status || 'active'}, 
       ${product.description || ''}, ${product.category || ''}, 
       ${product.color || '#1e293b'}, ${now}, ${now})
      RETURNING *
    `

    const newProduct = result.rows[0]
    dbEvents.emit('product-added', newProduct)
    return newProduct
  } catch (error) {
    console.error('Error adding product:', error)
    return null
  }
}

export const updateProductStock = async (
  id: string,
  stock: number
): Promise<DatabaseProduct | null> => {
  try {
    const now = new Date().toISOString()

    const result = await sql<DatabaseProduct>`
      UPDATE products
      SET stock = ${stock}, updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) return null

    const updatedProduct = result.rows[0]
    dbEvents.emit('product-updated', updatedProduct)
    return updatedProduct
  } catch (error) {
    console.error('Error updating product stock:', error)
    return null
  }
}

export const updateProduct = async (
  id: string,
  data: Partial<DatabaseProduct>
): Promise<DatabaseProduct | null> => {
  try {
    const now = new Date().toISOString()

    // Construir dinámicamente el UPDATE
    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push(`name = $${updates.length + 1}`)
      values.push(data.name)
    }
    if (data.stock !== undefined) {
      updates.push(`stock = $${updates.length + 1}`)
      values.push(data.stock)
    }
    if (data.price !== undefined) {
      updates.push(`price = $${updates.length + 1}`)
      values.push(data.price)
    }
    if (data.qv !== undefined) {
      updates.push(`qv = $${updates.length + 1}`)
      values.push(data.qv)
    }
    if (data.description !== undefined) {
      updates.push(`description = $${updates.length + 1}`)
      values.push(data.description)
    }
    if (data.category !== undefined) {
      updates.push(`category = $${updates.length + 1}`)
      values.push(data.category)
    }
    if (data.color !== undefined) {
      updates.push(`color = $${updates.length + 1}`)
      values.push(data.color)
    }

    updates.push(`updated_at = $${updates.length + 1}`)
    values.push(now)
    values.push(id)

    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`
    const result = await sql.query(query, values)

    if (result.rows.length === 0) return null

    const updatedProduct = result.rows[0] as DatabaseProduct
    dbEvents.emit('product-updated', updatedProduct)
    return updatedProduct
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`
    dbEvents.emit('product-deleted', { id })
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}

// ===== FUNCIONES DE DEUDAS =====

export const getDebts = async (): Promise<DatabaseDebt[] | null> => {
  try {
    const result = await sql<DatabaseDebt>`
      SELECT * FROM debts 
      ORDER BY created_at DESC
    `
    dbEvents.emit('debts-loaded', result.rows)
    return result.rows
  } catch (error) {
    console.error('Error fetching debts:', error)
    return null
  }
}

export const addDebt = async (
  debt: Omit<DatabaseDebt, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabaseDebt | null> => {
  try {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql<DatabaseDebt>`
      INSERT INTO debts 
      (id, type, name, amount, description, date, status, created_at, updated_at)
      VALUES 
      (${id}, ${debt.type}, ${debt.name}, ${debt.amount}, 
       ${debt.description || ''}, ${debt.date || now}, 
       ${debt.status || 'pending'}, ${now}, ${now})
      RETURNING *
    `

    const newDebt = result.rows[0]
    dbEvents.emit('debt-added', newDebt)
    return newDebt
  } catch (error) {
    console.error('Error adding debt:', error)
    return null
  }
}

export const deleteDebt = async (id: string): Promise<boolean> => {
  try {
    await sql`DELETE FROM debts WHERE id = ${id}`
    dbEvents.emit('debt-deleted', { id })
    return true
  } catch (error) {
    console.error('Error deleting debt:', error)
    return false
  }
}

// ===== FUNCIONES DE LISTAS DE CLIENTES =====

export const getListasClientes = async (): Promise<DatabaseListaCliente[] | null> => {
  try {
    const result = await sql<DatabaseListaCliente>`
      SELECT * FROM listas_clientes 
      ORDER BY created_at ASC
    `
    dbEvents.emit('listas-loaded', result.rows)
    return result.rows
  } catch (error) {
    console.error('Error fetching listas_clientes:', error)
    return null
  }
}

export const addListaCliente = async (
  lista: Omit<DatabaseListaCliente, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabaseListaCliente | null> => {
  try {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql<DatabaseListaCliente>`
      INSERT INTO listas_clientes 
      (id, nombre, fecha, direccion, productos, created_at, updated_at)
      VALUES 
      (${id}, ${lista.nombre}, ${lista.fecha}, ${lista.direccion || ''}, 
       ${JSON.stringify(lista.productos)}, ${now}, ${now})
      RETURNING *
    `

    const newLista = result.rows[0]
    dbEvents.emit('lista-added', newLista)
    return newLista
  } catch (error) {
    console.error('Error adding lista_cliente:', error)
    return null
  }
}

export const updateListaCliente = async (
  id: string,
  lista: Partial<DatabaseListaCliente>
): Promise<DatabaseListaCliente | null> => {
  try {
    const now = new Date().toISOString()

    const result = await sql<DatabaseListaCliente>`
      UPDATE listas_clientes
      SET 
        nombre = COALESCE(${lista.nombre || null}, nombre),
        fecha = COALESCE(${lista.fecha || null}, fecha),
        direccion = COALESCE(${lista.direccion || null}, direccion),
        productos = COALESCE(${lista.productos ? JSON.stringify(lista.productos) : null}, productos),
        updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) return null

    const updatedLista = result.rows[0]
    dbEvents.emit('lista-updated', updatedLista)
    return updatedLista
  } catch (error) {
    console.error('Error updating lista_cliente:', error)
    return null
  }
}

export const deleteListaCliente = async (id: string): Promise<boolean> => {
  try {
    await sql`DELETE FROM listas_clientes WHERE id = ${id}`
    dbEvents.emit('lista-deleted', { id })
    return true
  } catch (error) {
    console.error('Error deleting lista_cliente:', error)
    return false
  }
}

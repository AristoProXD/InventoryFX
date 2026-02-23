/**
 * Debug endpoint - Verifica el estado de la base de datos
 * Solo para desarrollo - Usar con cuidado
 */

import { getProducts, getDebts, getListasClientes, getDatabaseStatus } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const dbStatus = getDatabaseStatus()
    
    const products = await getProducts()
    const debts = await getDebts()
    const listas = await getListasClientes()

    return NextResponse.json(
      {
        dbStatus,
        data: {
          products: {
            count: products?.length || 0,
            data: products || [],
          },
          debts: {
            count: debts?.length || 0,
            data: debts || [],
          },
          listas: {
            count: listas?.length || 0,
            data: listas || [],
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

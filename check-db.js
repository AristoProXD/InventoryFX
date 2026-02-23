#!/usr/bin/env node

/**
 * Script para verificar y preparar la base de datos
 */

const { sql } = require('@vercel/postgres')
const pg = require('pg')

async function main() {
  let client
  try {
    console.log('🔍 Verificando estado de la base de datos...\n')

    // Conectar directamente con pg
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!connectionString) {
      console.error('❌ DATABASE_URL no está configurada')
      process.exit(1)
    }

    client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
    
    await client.connect()
    console.log('✅ Conexión a BD: OK\n')

    // Contar tablas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    console.log(`📊 Tablas en BD:`)
    if (tablesResult.rows.length === 0) {
      console.log('   ❌ NO hay tablas. Necesitas crear las tablas primero.')
      console.log('   Usa: npm run build && npm run dev')
      await client.end()
      process.exit(0)
    }
    
    for (const row of tablesResult.rows) {
      console.log(`   ✅ ${row.table_name}`)
    }

    // Contar registros
    console.log('\n📈 Cantidad de registros:')
    
    try {
      const productsCount = await client.query('SELECT COUNT(*) as count FROM products')
      console.log(`   Productos: ${productsCount.rows[0]?.count || 0}`)
    } catch (e) {
      console.log('   Productos: (tabla no existe)')
    }

    try {
      const debtsCount = await client.query('SELECT COUNT(*) as count FROM debts')
      console.log(`   Cuentas: ${debtsCount.rows[0]?.count || 0}`)
    } catch (e) {
      console.log('   Cuentas: (tabla no existe)')
    }

    try {
      const listasCount = await client.query('SELECT COUNT(*) as count FROM listas_clientes')
      console.log(`   Listas: ${listasCount.rows[0]?.count || 0}`)
    } catch (e) {
      console.log('   Listas: (tabla no existe)')
    }

    console.log('\n✅ Verificación completada')
    
    await client.end()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (client) await client.end()
    process.exit(1)
  }
}

main()

#!/usr/bin/env node

/**
 * Script para migrar datos de Supabase a Neon
 * O para agregar datos de prueba
 */

import { sql } from '@vercel/postgres'

async function setupDatabase() {
  try {
    console.log('🔧 Inicializando base de datos...')

    // Crear tablas si no existen
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        qv DECIMAL(10, 2) NOT NULL DEFAULT 0,
        min_stock INTEGER DEFAULT 10,
        status VARCHAR(50) DEFAULT 'active',
        description TEXT,
        category VARCHAR(255),
        color VARCHAR(7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Tabla products creada/verificada')

    await sql`
      CREATE TABLE IF NOT EXISTS debts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Tabla debts creada/verificada')

    await sql`
      CREATE TABLE IF NOT EXISTS listas_clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        direccion TEXT,
        productos JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Tabla listas_clientes creada/verificada')

    // Insertar datos de prueba
    console.log('\n📊 Agregando datos de prueba...')

    const testProducts = [
      { name: 'Producto Test 1', stock: 10, price: 100, qv: 5, category: 'Limpia' },
      { name: 'Producto Test 2', stock: 5, price: 200, qv: 10, category: 'Nutrición y Regeneración' },
      { name: 'Producto Test 3', stock: 0, price: 150, qv: 7.5, category: 'Energía y Revitalización' },
    ]

    for (const product of testProducts) {
      await sql`
        INSERT INTO products (name, stock, price, qv, category, status)
        VALUES (
          ${product.name},
          ${product.stock},
          ${product.price},
          ${product.qv},
          ${product.category},
          ${product.stock === 0 ? 'out_of_stock' : product.stock <= 1 ? 'low_stock' : 'active'}
        )
        ON CONFLICT DO NOTHING
      `
    }
    console.log(`✅ ${testProducts.length} productos de prueba agregados`)

    // Verificar datos
    const result = await sql`SELECT COUNT(*) as count FROM products`
    console.log(`\n📈 Total de productos en BD: ${result.rows[0]?.count || 0}`)

    const debtsResult = await sql`SELECT COUNT(*) as count FROM debts`
    console.log(`📈 Total de cuentas en BD: ${debtsResult.rows[0]?.count || 0}`)

    console.log('\n✅ Base de datos lista!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

setupDatabase()

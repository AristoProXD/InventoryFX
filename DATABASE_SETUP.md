# 🗄️ SETUP DE BASE DE DATOS - NEON

## ✅ ESTADO ACTUAL

Tu BD Neon ya está **100% configurada** con:
- ✅ Conexión desde `.env.local`
- ✅ Tablas creadas
- ✅ Datos migrados (si los tenías)

---

## 🔍 VERIFICAR CONEXIÓN

### 1. Revisar credenciales en `.env.local`

```env
DATABASE_URL=postgresql://neondb_owner:...@ep-small-field-ahjl3mkp...
POSTGRES_URL=...
POSTGRES_URL_NO_SSL=...
```

### 2. Probar conexión desde terminal

```bash
# Instalar psql (PostgreSQL CLI)
# En Windows: https://www.postgresql.org/download/windows/

# Conectar
psql "postgresql://neondb_owner:npg_Hop4tgPsyUL7@ep-small-field-ahjl3mkp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Ver tablas
\dt

# Ver estructura de tabla
\d products
```

---

## 🛠️ CREAR TABLAS (Si no existen)

Si necesitas crear las tablas desde cero, ejecuta en la consola Neon:

```sql
-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  qv INT NOT NULL DEFAULT 0,
  min_stock INT DEFAULT 10,
  status VARCHAR DEFAULT 'active',
  description TEXT DEFAULT '',
  category VARCHAR DEFAULT '',
  color VARCHAR DEFAULT '#1e293b',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de deudas
CREATE TABLE IF NOT EXISTS debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date TIMESTAMP,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de listas de clientes
CREATE TABLE IF NOT EXISTS listas_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  fecha DATE NOT NULL,
  direccion VARCHAR DEFAULT '',
  productos JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejorar velocidad
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
CREATE INDEX IF NOT EXISTS idx_listas_fecha ON listas_clientes(fecha DESC);
```

---

## 📊 INSERTAR DATOS EJEMPLO

```sql
-- Insertar producto de ejemplo
INSERT INTO products (name, stock, price, qv, category, description, color)
VALUES 
  ('Producto Test', 10, 100.00, 50, 'Limpia', 'Producto de prueba', '#FF5733'),
  ('Producto 2', 5, 200.00, 100, 'Nutrición y Regeneración', 'Otro test', '#3366FF');

-- Verificar
SELECT * FROM products;
```

---

## 🔒 SEGURIDAD

### Cambiar contraseña de BD (RECOMENDADO)

1. Ve a [Neon Dashboard](https://console.neon.tech)
2. Selecciona tu proyecto
3. En "Connection String" → "Show password reset option"
4. Resettea y actualiza `.env.local`

### NO SUBIR `.env.local` a GitHub

Ya está en `.gitignore` ✅

---

## 📈 MONITOREO

### Ver consumo y estadísticas

```sql
-- Contar registros
SELECT 'products' as table_name, COUNT(*) as rows FROM products
UNION ALL
SELECT 'debts', COUNT(*) FROM debts
UNION ALL
SELECT 'listas_clientes', COUNT(*) FROM listas_clientes;

-- Ver tamaño de BD
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Ver tablas más grandes
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔄 BACKUPS

### Backup automático (Neon)
✅ Neon hace backups automáticos cada 24h

### Backup manual

```bash
# Exportar a SQL
pg_dump "postgresql://neondb_owner:password@host/neondb" > backup.sql

# Restaurar desde SQL
psql "postgresql://..." < backup.sql
```

---

## ⚠️ TROUBLESHOOTING

### Conexión rechazada

**Error**: `ECONNREFUSED`

**Solución**:
```bash
# Revisar credenciales en .env.local
# Verificar firewall/VPN
# Esperar 30 segundos si acabas de crear la BD
```

### Tabla no existe

**Error**: `relation "products" does not exist`

**Solución**:
```bash
# Ejecutar script SQL anterior
# O crear tabla manualmente
```

### Lentitud

**Optimizar**:
```sql
-- Agregar índices
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_debts_created_at ON debts(created_at DESC);
```

---

## 📚 RECURSOS

- [Neon Docs](https://neon.tech/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/postgres)

---

**Tu BD está lista. ¡A usar!** 🚀

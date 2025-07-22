-- ======================================
-- INVENTARIO FUXION CASA - BASE DE DATOS
-- Script para Supabase
-- ======================================

-- 1. Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  supplier TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 1,
  qv_points INTEGER DEFAULT 0,
  location TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'low_stock', 'out_of_stock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de deudas
CREATE TABLE IF NOT EXISTS debts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('owe_us', 'we_owe')),
  person_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  description TEXT DEFAULT '',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Crear triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_debts_updated_at ON debts;
CREATE TRIGGER update_debts_updated_at
    BEFORE UPDATE ON debts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Insertar productos FUXION iniciales (opcional)
INSERT INTO products (id, name, description, category, supplier, price, stock, min_stock, qv_points, location, status) VALUES
('1', 'PROLIFE + Colágeno', 'Proteína con colágeno hidrolizado', 'Proteínas & Nutrición', 'FUXION', 139.00, 25, 5, 15, 'Estante A-1', 'active'),
('2', 'OMNILIFE Shake Vainilla', 'Batido nutricional sabor vainilla', 'Proteínas & Nutrición', 'FUXION', 119.00, 30, 5, 13, 'Estante A-2', 'active'),
('3', 'THERMOGEN Café', 'Quemador de grasa sabor café', 'Proteínas & Nutrición', 'FUXION', 89.00, 20, 3, 10, 'Estante A-3', 'active'),
('4', 'POWER MAKER Chocolate', 'Proteína para masa muscular', 'Proteínas & Nutrición', 'FUXION', 109.00, 15, 3, 12, 'Estante A-4', 'active'),
('5', 'FIBER N PLUS', 'Fibra natural para digestión', 'Proteínas & Nutrición', 'FUXION', 99.00, 22, 5, 11, 'Estante A-5', 'active'),
('6', 'OPTIMUS Verde', 'Multivitamínico natural', 'Proteínas & Nutrición', 'FUXION', 129.00, 18, 3, 14, 'Estante A-6', 'active'),
('7', 'TEATINO Original', 'Té herbal digestivo', 'Proteínas & Nutrición', 'FUXION', 49.00, 35, 10, 6, 'Estante A-7', 'active'),
('8', 'DUAL C MIX', 'Vitamina C natural', 'Proteínas & Nutrición', 'FUXION', 79.00, 28, 5, 9, 'Estante A-8', 'active'),
('9', 'ALOE BETA Original', 'Gel de aloe vera natural', 'Suplementos & Wellness', 'FUXION', 69.00, 25, 5, 8, 'Estante B-1', 'active'),
('10', 'FENIX Natural', 'Energizante natural', 'Suplementos & Wellness', 'FUXION', 79.00, 20, 3, 9, 'Estante B-2', 'active'),
('11', 'STARBIEN Digestivo', 'Probiótico digestivo', 'Suplementos & Wellness', 'FUXION', 59.00, 30, 5, 7, 'Estante B-3', 'active'),
('12', 'SUPREME Klb6', 'Metabolismo graso', 'Suplementos & Wellness', 'FUXION', 89.00, 15, 3, 10, 'Estante B-4', 'active'),
('13', 'EGO VITA', 'Antioxidante natural', 'Suplementos & Wellness', 'FUXION', 99.00, 18, 3, 11, 'Estante B-5', 'active'),
('14', 'DOLCE VITA Bebida', 'Bebida energética natural', 'Suplementos & Wellness', 'FUXION', 39.00, 40, 10, 5, 'Estante B-6', 'active'),
('15', 'SEYTU Cosmética', 'Línea de belleza', 'Cuidado Personal', 'FUXION', 69.00, 12, 2, 8, 'Estante C-1', 'active'),
('16', 'SEYTU Shampoo', 'Shampoo natural', 'Cuidado Personal', 'FUXION', 49.00, 20, 5, 6, 'Estante C-2', 'active'),
('17', 'SEYTU Crema', 'Crema hidratante', 'Cuidado Personal', 'FUXION', 59.00, 15, 3, 7, 'Estante C-3', 'active'),
('18', 'SEYTU Jabón', 'Jabón artesanal', 'Cuidado Personal', 'FUXION', 29.00, 25, 5, 4, 'Estante C-4', 'active'),
('19', 'HYGIVIT Desinfectante', 'Desinfectante natural', 'Hogar & Limpieza', 'FUXION', 39.00, 30, 10, 5, 'Estante D-1', 'active'),
('20', 'ECO KLINZ Limpiador', 'Limpiador multiusos', 'Hogar & Limpieza', 'FUXION', 45.00, 20, 5, 5, 'Estante D-2', 'active'),
('21', 'NUTRIVIT Fertilizante', 'Fertilizante orgánico', 'Hogar & Limpieza', 'FUXION', 35.00, 15, 3, 4, 'Estante D-3', 'active')
ON CONFLICT (id) DO NOTHING;

-- 6. Habilitar Row Level Security (RLS) - Opcional para mayor seguridad
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas básicas (opcional)
-- CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON debts FOR ALL USING (true);

-- ======================================
-- SCRIPT COMPLETADO
-- ======================================

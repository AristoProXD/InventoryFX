# 🚀 PROMPT PARA NUEVO PROYECTO - INVENTARIO FUXION MEJORADO V2

## 📌 VISIÓN GENERAL

Crear un **sistema de gestión de inventario empresarial** para Fuxion Casa, accesible desde cualquier dispositivo (web, tablet, móvil), con sincronización en tiempo real, autenticación segura, y almacenamiento de datos robusto y gratuito.

**Stack Tecnológico Recomendado:**
- **Frontend**: Next.js 16+ con TypeScript + Tailwind CSS
- **Hosting**: Vercel (gratis, superior a GitHub Pages)
- **Base de Datos**: PostgreSQL en Neon (gratis, 10GB, mejor que Supabase)
- **Autenticación**: Sistema propio + OAuth (Google) opcional
- **Real-time**: Polling + EventSource (sin Socket.io)

---

## 🎨 INTERFAZ Y DISEÑO

### HEADER / NAVBAR
```
┌─────────────────────────────────────────────────────────────────┐
│ 📦 Inventario Fuxion Casa    [Status] 🟢 Sincronizado  [👤] [🚪] │
│                              Última sync: hace 2 segundos       │
└─────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Logo + Nombre de la aplicación (responsive, desaparece en móvil)
- Status indicador de sincronización (verde/amarillo/rojo)
- Última sincronización (timestamp)
- Perfil usuario (avatar circular)
- Botón Logout

**Responsividad:**
- Desktop: Todos los elementos visibles
- Tablet: Nombre reducido, status comprimido
- Móvil: Solo logo, status como botón, logout oculto

---

### TABS / NAVEGACIÓN PRINCIPAL

```
📦 Inventario  |  💰 Cuentas  |  📝 Listas de Clientes
```

**Funcionalidad:**
- Tabs activo tiene subrayado azul y escala ligeramente
- Transición suave entre tabs
- Cada tab carga datos independientes
- No se recarga la página, solo cambia contenido

---

## 📊 TAB 1: INVENTARIO

### Dashboard de Métricas (Grid 2x3 en móvil, 5 columnas en desktop)
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 50 Prods │ 150 Stock│ 5 Bajo ↓ │ 0 Sin ✗  │ $2,500   │
│ Productos│Stock Tot │Stock Bajo│Sin Stock │Val.Total│
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Colores:**
- Productos: Azul
- Stock Total: Azul  
- Stock Bajo: Amarillo
- Sin Stock: Rojo
- Valor Total: Verde

---

### Búsqueda y Filtros

```
[🔍 Buscar producto...]  [▼ Categorías]  [⬇️ Stock Bajo]  [+ Agregar]
```

**Campos:**
1. **Búsqueda**: Busca por nombre del producto (en tiempo real)
2. **Categoría**: Dropdown con todas las categorías (Limpia, Nutrición, etc.)
3. **Filtro Bajo Stock**: Toggle para mostrar solo productos con stock ≤ 1
4. **Botón Agregar**: Abre modal para nuevo producto

---

### Grid de Productos (Responsive)

```
┌─────────────────────────────────────┐
│ [🟢 Activo]     [Editar] [Eliminar] │
│ NOMBRE PRODUCTO                     │
│ Descripción del producto            │
│ [−] 50 unidades [+]                 │
│ Precio: S/ 100.50                   │
│ QV: 5 puntos                        │
│ Categoría | Color (barra lateral)   │
└─────────────────────────────────────┘
```

**Diseño:**
- Grid responsive: 1 col (móvil), 2 (tablet), 4 (desktop)
- Cada card tiene gradiente oscuro con borde violeta
- Hover: Escala ligeramente (1.03x)
- Color de fondo personalizable por producto
- Stock con botones +/- integrados

**Información por Producto:**
- ID (oculto, pero usado internamente)
- Nombre (texto grande, bold)
- Descripción (texto pequeño)
- Stock (número grande, con ±)
- Precio (S/ con 2 decimales)
- QV (Quantum Value)
- Categoría (badge)
- Color (previsualizador)
- Estado automático: Activo / Bajo Stock / Sin Stock
- Botones: Editar, Eliminar

---

### Modal Agregar/Editar Producto

```
┌──────────────────────────────────┐
│ ✎ Agregar Producto              │
├──────────────────────────────────┤
│ Nombre:        [_______________] │
│ Descripción:   [_______________] │
│ Categoría:     [▼ Categorías] │
│ Color:         [██████]          │
│ Precio (S/):   [−] 100.50 [+]   │
│ QV:            [−] 5.00  [+]    │
│ Stock:         [−] 50    [+]    │
│                                 │
│              [Cancelar] [Guardar]│
└──────────────────────────────────┘
```

**Campos:**
1. **Nombre*** - Requerido, máx 255 chars
2. **Descripción** - Opcional, máx 1000 chars
3. **Categoría** - Dropdown (11 opciones predefinidas)
4. **Color** - Color picker (para visual identify)
5. **Precio*** - Número, 2 decimales
6. **QV*** - Quantum Value (puntos)
7. **Stock*** - Número entero, con botones ±

**Validaciones:**
- Campos requeridos marcados con *
- Valores numéricos validados
- Campos con error resaltados en rojo
- Mensaje de error claro debajo del campo

---

## 💰 TAB 2: CUENTAS

### Listado de Cuentas

```
┌─────────────────────────────────────────┐
│ Juan Pérez              [Pendiente] ✎ 🗑 │
│ 15/02/2026                              │
│ Monto: S/ 500.00                        │
└─────────────────────────────────────────┘
```

**Por Cuenta:**
- Nombre de la persona
- Fecha de la deuda
- Tipo: "Monto" (cantidad) o "Productos" (detalle)
- Si es Monto: mostrar cantidad S/
- Si es Productos: listar productos con cantidades
- Estado: Pendiente (amarillo) / Cancelado (verde)
- Botones: Editar, Eliminar

---

### Modal Agregar/Editar Cuenta

```
┌──────────────────────────────────┐
│ ✎ Agregar Cuenta                │
├──────────────────────────────────┤
│ Nombre:      [_______________]   │
│ Fecha:       [DD/MM/YYYY]        │
│ Tipo:        (• Monto ○ Productos│
│              [Monto: _____ S/]   │
│ Estado:      [▼ Pendiente]       │
│                                 │
│              [Cancelar] [Guardar]│
└──────────────────────────────────┘
```

**Lógica:**
- Selector de Tipo (Monto vs Productos)
- Si Monto: Input para cantidad S/
- Si Productos: Lista con selector de producto + cantidad
- Botón para agregar productos adicionales
- Estado: Pendiente / Cancelado

---

## 📝 TAB 3: LISTAS DE CLIENTES

### Listado de Listas

```
┌───────────────────────────────────────────┐
│ Lista Bodega Central                  ✎ 🗑 │
│ 15/02/2026 | San Isidro, Lima            │
│ Productos: 5 items                        │
│ Total Costo: S/ 1,250.00                 │
│ Total QV: 62.5 puntos                    │
└───────────────────────────────────────────┘
```

**Por Lista:**
- Nombre de la lista
- Fecha
- Dirección de entrega
- Cantidad de productos
- Total costo (suma de precio × cantidad)
- Total QV (suma de QV × cantidad)
- Botones: Editar, Eliminar

---

### Modal Agregar/Editar Lista

```
┌──────────────────────────────────┐
│ ✎ Agregar Lista                 │
├──────────────────────────────────┤
│ Nombre:      [_______________]   │
│ Fecha:       [DD/MM/YYYY]        │
│ Dirección:   [_______________]   │
│                                 │
│ Productos agregados:            │
│ [Producto 1] x5 [− +] [🗑]      │
│ [Producto 2] x3 [− +] [🗑]      │
│                                 │
│ [+ Agregar Producto]            │
│                                 │
│              [Cancelar] [Guardar]│
└──────────────────────────────────┘
```

---

## 🔐 AUTENTICACIÓN

### Login Screen

```
┌─────────────────────────────────────┐
│         INVENTARIO FUXION CASA      │
│                                     │
│ Contraseña: [••••••••••]            │
│                                     │
│            [   Ingresar    ]        │
│                                     │
│ © 2026 Fuxion Casa                  │
└─────────────────────────────────────┘
```

**Opciones:**
1. **Simple (Actual)**: Solo contraseña maestra
2. **Mejorado V2**: Email + Contraseña con roles
3. **Futuro**: OAuth con Google

**Para V2 (Nueva):**
- Login con email + contraseña
- Roles: Admin, Vendedor, Gerente
- Sesión basada en JWT
- Remember me (opcional)

---

## 🔄 SINCRONIZACIÓN Y REAL-TIME

### Indicador de Estado

```
Desktop:                          Móvil:
🟢 Sincronizado                   [🟢 Sync]
Última sync: hace 2 segundos      [Sincronizar...]
                                  [🔴 Error]
```

**Colores:**
- 🟢 Verde: Sincronizado exitosamente
- 🟡 Amarillo: Sincronizando en progreso
- 🔴 Rojo: Error de conexión

**Comportamiento:**
- Polling automático cada 3 segundos
- Sincronización inmediata después de CRUD
- Offline mode: Mostrar spinner, reintentar cada 5s
- No bloquear UI durante sync

---

## 💾 ESTRUCTURA DE BASE DE DATOS

### Tabla: PRODUCTS
```sql
id (UUID)
name (STRING, required)
description (TEXT)
stock (INTEGER, default: 0)
price (DECIMAL, required)
qv (DECIMAL, required)
min_stock (INTEGER, default: 10)
status (ENUM: active | low_stock | out_of_stock | inactive)
category (STRING)
color (HEX, default: #1e293b)
sku (STRING, unique, optional)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabla: DEBTS (Cuentas)
```sql
id (UUID)
type (ENUM: nos_deben | debemos)
name (STRING, required)
amount (DECIMAL)
description (JSONB) -- {tipo, productos[], estado}
date (TIMESTAMP)
status (ENUM: pending | paid | cancelled)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabla: LISTAS_CLIENTES
```sql
id (UUID)
nombre (STRING, required)
fecha (TIMESTAMP, required)
direccion (TEXT)
productos (JSONB) -- [{id, name, cantidad, price, qv}, ...]
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 🛠️ FUNCIONALIDADES CORE

### INVENTARIO
- ✅ Listar productos con paginación
- ✅ Buscar por nombre
- ✅ Filtrar por categoría
- ✅ Filtro de stock bajo
- ✅ Agregar producto
- ✅ Editar producto
- ✅ Eliminar producto (con confirmación)
- ✅ Aumentar/disminuir stock con botones
- ✅ Dashboard con métricas
- ✅ Mostrar estado automático

### CUENTAS
- ✅ Crear cuenta (Monto o Productos)
- ✅ Editar cuenta
- ✅ Eliminar cuenta
- ✅ Marcar como Cancelado
- ✅ Listar por fecha
- ✅ Filtrar por estado

### LISTAS DE CLIENTES
- ✅ Crear lista con múltiples productos
- ✅ Editar lista
- ✅ Eliminar lista
- ✅ Calcular totales automáticos (costo, QV)
- ✅ Seleccionar productos del inventario
- ✅ Personalizar cantidades

---

## 🎯 MEJORAS PARA V2

### Comparado con V1:
1. **Mejor UX**: Formularios más limpios, validaciones más claras
2. **Performance**: Caché en cliente, menos requests
3. **Offline Support**: Guardar datos locales, sincronizar cuando hay conexión
4. **Seguridad**: Autenticación mejorada, roles y permisos
5. **Reporting**: Exportar datos a PDF/Excel
6. **Multi-user**: Soporte para múltiples usuarios con roles
7. **Historial**: Log de cambios quién y cuándo
8. **Mobile First**: Diseño optimizado para móvil desde el inicio
9. **Analytics**: Dashboard con gráficos de stock, ventas, tendencias
10. **Backup**: Exportar/Importar BD automáticamente

---

## 🌐 HOSTING Y DEPLOYMENT

### Arquitectura Recomendada V2

```
┌──────────────────────────────────────────────────────────┐
│                    USUARIO (Navegador)                   │
│                   (Web / Tablet / Móvil)                 │
└────────────────────────────────────────────────────────┬─┘
                                                            │
                                                    ┌─────────────┐
                                                    │   VERCEL    │
                                                    │             │
                                                    │ Next.js App │
                                                    │ (Frontend)  │
                                                    │   (FREE)    │
                                                    └─────────────┘
                                                            │
                                                    ┌─────────────┐
                                                    │    NEON     │
                                                    │             │
                                                    │ PostgreSQL  │
                                                    │  (10GB GRATIS)
                                                    │ (Backend DB)│
                                                    └─────────────┘
```

---

## 🔑 CREDENCIALES Y VARIABLES DE ENTORNO

### .env.local (NUNCA commitar)
```
# Neon PostgreSQL
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...

# Autenticación
JWT_SECRET=tu_super_secret_key_123
NEXT_PUBLIC_MASTER_PASSWORD=fuxion2025!

# Configuración
NEXT_PUBLIC_APP_NAME=Inventario Fuxion Casa
NEXT_PUBLIC_API_URL=https://tu-app.vercel.app
```

### Vercel Secrets
Agregar todos los valores en Vercel Dashboard > Project Settings > Environment Variables

---

## 📱 RESPONSIVIDAD GARANTIZADA

### Breakpoints
- **Móvil**: 0-640px (1 columna, botones grandes)
- **Tablet**: 641-1024px (2 columnas)
- **Desktop**: 1025px+ (4-5 columnas)

### Mobile First
- Todos los inputs con tamaño táctil mínimo (44x44px)
- Fuentes grandes para legibilidad
- Espacios amplios entre elementos
- Botones accesibles sin necesidad de zoom

---

## 🎨 SISTEMA DE DISEÑO V2

### Colores
- **Primario**: #3b82f6 (Azul)
- **Secundario**: #a78bfa (Violeta)
- **Success**: #10b981 (Verde)
- **Warning**: #f59e0b (Amarillo)
- **Danger**: #ef4444 (Rojo)
- **Dark BG**: #0f172a (Gris muy oscuro)

### Tipografía
- **Título**: 24-32px, Bold
- **Subtítulo**: 18-20px, Semibold
- **Body**: 14-16px, Regular
- **Caption**: 12px, Regular

### Componentes
- **Botones**: Rounded-xl, con hover y active states
- **Inputs**: Rounded-2xl, con focus ring
- **Cards**: Rounded-2xl, con shadow y hover effect
- **Modals**: Centered, backdrop oscuro 30%, animate-fadeIn

---

## 🚀 FASES DE IMPLEMENTACIÓN

### Fase 1: MVP (Semana 1-2)
- Setup: Next.js + Vercel + Neon
- Auth: Login simple con contraseña
- CRUD Productos: Crear, Editar, Eliminar
- Dashboard: Métricas básicas
- Sincronización: Polling cada 3s

### Fase 2: Mejoras (Semana 3-4)
- CRUD Cuentas: Sistema completo
- CRUD Listas: Con cálculos automáticos
- Filtros y búsqueda avanzada
- Formularios mejorados con validaciones

### Fase 3: Características Avanzadas (Futuro)
- Multi-usuario con roles
- Reportes y exportación
- Historial de cambios
- Offline support
- Analytics y gráficos
- Backup automático

---

## ✅ CHECKLIST ANTES DE PRODUCCIÓN

- [ ] Neon PostgreSQL configurado
- [ ] Vercel conectado a GitHub
- [ ] Variables de entorno en Vercel
- [ ] Autenticación funcionando
- [ ] CRUD básico testeado
- [ ] Responsividad en móvil verificada
- [ ] Sincronización estable
- [ ] Sin errores en consola (F12)
- [ ] Documentación actualizada
- [ ] Backup de BD configurado

---

## 📚 REFERENCIAS ÚTILES

**Neon PostgreSQL:**
- https://console.neon.tech
- Free tier: 10GB, 3 projects
- Ideal para startups y MVP

**Vercel:**
- https://vercel.com
- Deployment automático desde GitHub
- Free tier: unlimited bandwidth

**Next.js 16:**
- https://nextjs.org
- App Router (recomendado)
- TypeScript built-in

**PostgreSQL Queries:**
- Usar @vercel/postgres para queries type-safe
- Prepared statements automáticos contra SQL injection

---

**RESUMEN:** 
Sistema moderno, escalable, completamente gratis, con mejor UX que V1, 
listo para crecer con tu negocio Fuxion Casa.

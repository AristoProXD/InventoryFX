# 🏢 **INVENTARIO FUXION CASA**

Sistema de Gestión de Inventario Familiar para Productos FUXION

## 🎯 **CARACTERÍSTICAS PRINCIPALES**

### ✅ **Gestión Completa de Inventario**
- 21 Productos FUXION preconfigurados con precios en Soles (S/)
- Control de stock con botones +/- directo en la interfaz
- Estados automáticos: Sin Stock (≤1), Stock Bajo (≤3), Stock Normal (>3)
- Sistema QV (Qualified Volume) para productos FUXION

### 🔐 **Acceso Restringido Familiar**
- Solo 5 usuarios familiares autorizados
- Autenticación simplificada con sesiones persistentes
- Sistema optimizado para uso doméstico

### 💰 **Sistema de Deudas Integrado**
- Registro y gestión de deudas familiares
- Seguimiento de pagos y saldos pendientes
- Interfaz organizada en pestañas

### 🎨 **Diseño Profesional**
- Interface moderna con tema warehouse
- Colores industriales y diseño limpio
- Completamente responsive

## 🚀 **INSTALACIÓN RÁPIDA**

```bash
# Instalar dependencias
npm install

# Ejecutar aplicación
npm run dev
```

Accede en: `http://localhost:3000`

## 🔑 **USUARIOS FAMILIARES**

| Usuario   | Contraseña      | Rol                 |
|-----------|-----------------|---------------------|
| admin     | fuxion2025      | Administrador       |
| familia1  | casa123         | Usuario Familiar 1  |
| familia2  | fuxion456       | Usuario Familiar 2  |
| familia3  | inventario789   | Usuario Familiar 3  |
| familia4  | almacen321      | Usuario Familiar 4  |

## 📦 **PRODUCTOS PRECONFIGURADOS**

### **Proteínas & Nutrición (8 productos)**
- PROLIFE + Colágeno - S/ 139.00 (15 QV)
- OMNILIFE Shake Vainilla - S/ 119.00 (13 QV)
- THERMOGEN Café - S/ 89.00 (10 QV)
- POWER MAKER Chocolate - S/ 109.00 (12 QV)
- FIBER N PLUS - S/ 99.00 (11 QV)
- OPTIMUS Verde - S/ 129.00 (14 QV)
- TEATINO Original - S/ 49.00 (6 QV)
- DUAL C MIX - S/ 79.00 (9 QV)

### **Suplementos & Wellness (6 productos)**
- ALOE BETA Original - S/ 69.00 (8 QV)
- FENIX Natural - S/ 79.00 (9 QV)
- STARBIEN Digestivo - S/ 59.00 (7 QV)
- SUPREME Klb6 - S/ 89.00 (10 QV)
- EGO VITA - S/ 99.00 (11 QV)
- DOLCE VITA Bebida - S/ 39.00 (5 QV)

### **Cuidado Personal (4 productos)**
- SEYTU Cosmética - S/ 69.00 (8 QV)
- SEYTU Shampoo - S/ 49.00 (6 QV)
- SEYTU Crema - S/ 59.00 (7 QV)
- SEYTU Jabón - S/ 29.00 (4 QV)

### **Hogar & Limpieza (3 productos)**
- HYGIVIT Desinfectante - S/ 39.00 (5 QV)
- ECO KLINZ Limpiador - S/ 45.00 (5 QV)
- NUTRIVIT Fertilizante - S/ 35.00 (4 QV)

## ⚙️ **STACK TECNOLÓGICO**

- **Framework**: Next.js 15.4.2
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: React Hooks + localStorage
- **Build**: Optimizado para producción

## 📁 **ARQUITECTURA LIMPIA**

```
src/
├── app/
│   ├── page.tsx              # Dashboard principal (inventario + deudas)
│   ├── login/page.tsx        # Autenticación familiar
│   ├── layout.tsx           # Layout con metadata
│   └── globals.css          # Estilos Tailwind + custom
├── components/
│   └── AddProductModal.tsx  # Modal optimizado para nuevos productos
├── lib/
│   └── utils.ts            # Utilidades TypeScript
└── types/
    └── index.ts            # Interfaces limpias y documentadas
```

## 🎯 **FUNCIONALIDADES**

### **Dashboard de Inventario**
- ✅ Lista completa de productos FUXION
- ✅ Control de stock en tiempo real (+/-)
- ✅ Estados visuales por nivel de stock
- ✅ Búsqueda rápida por nombre
- ✅ Filtros por categoría y estado
- ✅ Modal para agregar nuevos productos

### **Gestión de Deudas**
- ✅ CRUD completo de deudas familiares
- ✅ Seguimiento de montos y fechas
- ✅ Interfaz separada en pestañas
- ✅ Cálculos automáticos de saldos

### **Sistema de Autenticación**
- ✅ Login familiar restringido
- ✅ Sesiones persistentes
- ✅ Logout seguro
- ✅ Redirección automática

## 🚀 **DEPLOYMENT**

### **Scripts NPM**
```bash
npm run dev        # Desarrollo (localhost:3000)
npm run build      # Build optimizado
npm run start      # Servidor producción
npm run lint       # Linting ESLint
npm run type-check # Verificación TypeScript
```

### **Vercel (1-Click Deploy)**
```bash
# Conectar GitHub repo con Vercel
# Deploy automático en cada push
```

### **Build Manual**
```bash
npm run build
npm run start
# Servidor en puerto 3000
```

## 📊 **ESTADO DEL PROYECTO**

- ✅ **Código limpio y optimizado**
- ✅ **TypeScript sin errores**
- ✅ **Build exitoso**
- ✅ **Componentes modulares**
- ✅ **Responsive design**
- ✅ **Documentación completa**
- ✅ **Listo para producción**

## 🔧 **CONFIGURACIÓN**

El proyecto incluye configuración optimizada para:
- **TypeScript strict mode**
- **ESLint + Next.js rules**
- **Tailwind CSS custom theme**
- **Vercel deployment**
- **Lucide React icons**

---

**💚 Sistema familiar completo y optimizado para Fuxion Casa**

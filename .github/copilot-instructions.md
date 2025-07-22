<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Inventario Fuxion Casa - Instrucciones para GitHub Copilot

## Contexto del Proyecto
Este es un sistema de gestión de inventario en tiempo real para Fuxion Casa, diseñado como una aplicación web moderna con autenticación y acceso restringido.

## Tecnologías Principales
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Base de datos**: SQLite/PostgreSQL (futuro)
- **Tiempo Real**: Socket.io (futuro)

## Estructura del Código

### Componentes
- Usar `'use client'` para componentes interactivos
- Implementar TypeScript estricto con interfaces
- Seguir patrones de React Hooks
- Usar Tailwind CSS para estilos

### Naming Conventions
- **Archivos**: PascalCase para componentes (ProductCard.tsx)
- **Variables**: camelCase (productList, isLoading)
- **Constantes**: UPPER_SNAKE_CASE (MAX_STOCK_LIMIT)
- **CSS Classes**: Tailwind utilities con prefijo warehouse- para custom

### Patrones de Diseño
- **Estados**: useState para estado local, useEffect para side effects
- **Props**: Interfaces tipadas para todas las props
- **Estilos**: Classes de Tailwind con sistema de colores warehouse
- **Formularios**: Controlled components con validación

## Guías de Estilo

### CSS/Tailwind
- Usar palette de colores: blue-500 (primario), slate-* (grises), warehouse-* (custom)
- Responsivo: mobile-first approach
- Espaciado consistente: p-4, p-6, gap-4, gap-6
- Sombras: shadow-md, shadow-lg para elevation

### TypeScript
- Definir interfaces en `/types/index.ts`
- Usar tipos estrictos, evitar `any`
- Props interface para cada componente
- Return types explícitos en funciones

### Funcionalidades Específicas

#### Productos
- Estados: 'active' | 'low_stock' | 'out_of_stock' | 'inactive'
- Validación automática de stock vs minStock
- Formato de moneda: ARS (peso argentino)
- SKU único obligatorio

#### UI/UX
- Tema "almacén" con colores industriales
- Iconografía consistente con Lucide React
- Animaciones suaves: transition-all duration-200
- Estados de loading y error

#### Formularios
- Validación en tiempo real
- Campos obligatorios marcados con *
- Mensajes de error claros
- Reset automático después de submit

## Mejores Prácticas

### Performance
- Lazy loading para componentes pesados
- Memoización con useMemo/useCallback cuando sea necesario
- Optimización de imágenes con Next.js Image

### Seguridad
- Validación tanto client-side como server-side
- Sanitización de inputs
- Autenticación JWT (futuro)

### Accesibilidad
- Labels apropiados en formularios
- Contraste de colores adecuado
- Navegación por teclado
- ARIA labels cuando sea necesario

## Ejemplos de Código

### Componente Típico
```tsx
'use client'

interface ComponentProps {
  data: SomeType
  onAction: (id: string) => void
}

export default function Component({ data, onAction }: ComponentProps) {
  const [loading, setLoading] = useState(false)
  
  return (
    <div className="warehouse-card">
      {/* Content */}
    </div>
  )
}
```

### Estado de Producto
```tsx
const getProductStatus = (stock: number, minStock: number): Product['status'] => {
  if (stock === 0) return 'out_of_stock'
  if (stock <= minStock) return 'low_stock'
  return 'active'
}
```

### Estilos Consistentes
```tsx
// Botones
className="warehouse-button" // Primario
className="bg-red-500 hover:bg-red-600 text-white..." // Destructivo

// Cards
className="warehouse-card" // Card estándar

// Inputs
className="warehouse-input" // Input estándar
```

## Debugging y Testing
- Console.log para development, remover en producción
- Error boundaries para componentes críticos
- Validación exhaustiva de props

## Futuras Características
- Socket.io para tiempo real
- Base de datos persistente
- Sistema de roles completo
- Reportes y analytics
- App móvil

Mantén estas guidelines al generar código para asegurar consistencia y calidad en el proyecto.

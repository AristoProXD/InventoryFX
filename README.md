# 📦 Inventario Fuxion Casa

Sistema de gestión de inventario en tiempo real desarrollado con Next.js 15 y diseñado para funcionar 24/7 en la nube.

## 🚀 Características

- ✅ **Interfaz moderna y responsive** con Tailwind CSS
- ✅ **Autenticación por contraseña** con sesiones de 8 horas
- ✅ **Gestión de inventario en tiempo real** (agregar/quitar stock)
- ✅ **Sistema de cuentas y deudas** ("nos deben" / "debemos")
- ✅ **Estadísticas en tiempo real** (stock total, productos sin stock, valor total)
- ✅ **Almacenamiento local** (localStorage) con sincronización automática
- ✅ **Lista para desplegar** en Vercel con configuración optimizada

## 🛠️ Tecnologías

- **Next.js 15** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconos modernos
- **Vercel** - Plataforma de despliegue

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en Vercel (para despliegue)

## 🚦 Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd inventario-fuxion-casa
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🌐 Despliegue en Vercel (2025)

### Opción 1: Desde GitHub (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "Deploy setup"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno en Vercel**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega estas variables:
     ```
     NEXT_PUBLIC_MASTER_PASSWORD=tu_contraseña_segura_aqui
     NEXT_PUBLIC_APP_NAME=Inventario Fuxion Casa
     NEXT_PUBLIC_APP_VERSION=1.0.0
     ```

4. **Hacer deploy**
   - Vercel hará el deploy automáticamente
   - Tu app estará disponible en: `https://tu-proyecto.vercel.app`

### Opción 2: Desde CLI de Vercel

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Hacer login**
   ```bash
   vercel login
   ```

3. **Hacer deploy**
   ```bash
   vercel --prod
   ```

## 🔒 Configuración de Seguridad

### Cambiar contraseña maestra

1. **En desarrollo** - Edita `.env.local`:
   ```env
   NEXT_PUBLIC_MASTER_PASSWORD=tu_nueva_contraseña_segura
   ```

2. **En producción** - En Vercel:
   - Settings > Environment Variables
   - Actualiza `NEXT_PUBLIC_MASTER_PASSWORD`
   - Redeploy el proyecto

### Consideraciones de Seguridad 2025

- ✅ Headers de seguridad configurados en `vercel.json`
- ✅ Autenticación basada en sesiones con expiración
- ✅ Variables de entorno para datos sensibles
- ⚠️ **Importante**: Cambia la contraseña por defecto antes del despliegue

## 📊 Funcionalidades del Sistema

### Gestión de Inventario
- Ver todos los productos con stock actual
- Agregar/quitar stock con botones +/-
- Editar nombres de productos inline
- Agregar nuevos productos
- Indicadores visuales de stock (Sin Stock, Stock Bajo, Disponible)

### Sistema de Cuentas
- Registrar deudas: "Nos deben" o "Debemos"
- Agregar descripción y monto
- Eliminar cuentas saldadas
- Fecha automática de registro

### Estadísticas en Tiempo Real
- Total de productos
- Stock total en almacén
- Productos con stock bajo
- Productos sin stock
- Valor total del inventario

## 🔄 Actualizaciones y Mantenimiento

### Para actualizar el proyecto en producción:

1. **Hacer cambios localmente**
2. **Probar en desarrollo**
   ```bash
   npm run dev
   ```
3. **Subir cambios**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
4. **Vercel hará auto-deploy** de los cambios

### Comandos útiles:

```bash
# Verificar el build local
npm run build

# Verificar tipos de TypeScript
npm run type-check

# Verificar linting
npm run lint
```

## 📱 Uso del Sistema

1. **Acceso**: Ingresa la contraseña maestra
2. **Inventario**: Usa los botones +/- para ajustar stock
3. **Cuentas**: Agrega deudas y pagos pendientes
4. **Guardar**: Los cambios se guardan automáticamente cada vez que haces una modificación
5. **Sesión**: La sesión dura 8 horas, después debes volver a ingresar

## 🆘 Solución de Problemas

### El sitio no carga
- Verifica que el deploy en Vercel haya sido exitoso
- Revisa los logs en el dashboard de Vercel

### Problemas con variables de entorno
- Asegúrate de que todas las variables estén configuradas en Vercel
- Las variables que empiezan con `NEXT_PUBLIC_` son visibles en el cliente

### Problemas con localStorage
- Los datos se guardan localmente en cada navegador
- Para reset completo, limpia el localStorage del navegador

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, crea un issue en el repositorio del proyecto.

## 📄 Licencia

Proyecto desarrollado para uso interno de Fuxion Casa.

---

**Desarrollado con ❤️ para la gestión eficiente de inventarios en 2025**

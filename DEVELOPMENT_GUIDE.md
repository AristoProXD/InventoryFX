# 📖 GUÍA RÁPIDA - DESARROLLO LOCAL

## 🚀 Arrancar el Proyecto

```bash
# Instalar dependencias
npm install

# Arrancar en modo desarrollo
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000)

---

## 🔐 Autenticación

**Contraseña maestra**: `fuxion2025!`

---

## 🗄️ Base de Datos

### Conexión
- **BD**: Neon PostgreSQL
- **Credenciales**: En `.env.local`
- **Tablas**: products, debts, listas_clientes

### Ejecutar queries
```typescript
import { sql } from '@vercel/postgres'

// Ejemplo
const result = await sql`SELECT * FROM products`
```

---

## 🔄 Real-time (Socket.io)

Automático en desarrollo. En producción necesitas:

```bash
# Crear servidor Socket.io (opcional)
# Por ahora funciona con polling
```

---

## 📁 Estructura

```
src/
├── app/              # Next.js app router
├── components/       # React components
│   └── InventoryApp.tsx   # Componente principal
├── lib/
│   ├── database.ts   # 🆕 BD + queries SQL
│   └── socket.ts     # 🆕 Socket.io server
├── hooks/
│   └── useSocket.ts  # 🆕 Hook para Socket.io
└── types/
    └── index.ts      # TypeScript interfaces
```

---

## 🧪 Validaciones

```bash
# Type-check (TypeScript)
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## 🌍 Desplegar a Producción

```bash
# En Vercel (ya está configurado)
vercel deploy
```

---

## 💡 Tips

- Cambios en BD se sincronizan automáticamente (Socket.io)
- Los types están bien tipados (no uses `any`)
- Si hay error, revisa la consola del navegador (F12)

---

## 🆘 Solucionar Problemas

**P: No se conecta a BD**
- Revisa `.env.local`
- Verifica conexión a Neon

**P: No funciona el real-time**
- Socket.io está en desarrollo
- En producción necesita servidor separado

**P: Error de TypeScript**
- Ejecuta `npm run type-check`
- Revisa los tipos en `src/types/index.ts`

---

**¿Necesitas ayuda?** Revisa `MIGRATION_GUIDE.md`

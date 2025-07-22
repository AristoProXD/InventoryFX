# 🚀 Guía de Publicación - Inventario Fuxion Casa

## 📋 **Sistema de Usuarios Familiares**

La aplicación está configurada con **acceso restringido** solo para familiares autorizados:

### 👥 **Usuarios Familiares Configurados:**
| Usuario | Contraseña | Nombre |
|---------|------------|--------|
| `admin` | `fuxion2025` | Administrador |
| `familia1` | `casa123` | Usuario Familiar 1 |
| `familia2` | `fuxion456` | Usuario Familiar 2 |
| `familia3` | `inventario789` | Usuario Familiar 3 |
| `familia4` | `almacen321` | Usuario Familiar 4 |

## 🌐 **Opción 1: Publicar en Vercel (Recomendado)**

### **Paso 1: Preparar el proyecto**
```bash
# 1. Verificar que el proyecto compile correctamente
npm run build

# 2. Crear repositorio en GitHub
git init
git add .
git commit -m "Initial commit - Inventario Fuxion Casa"
```

### **Paso 2: Subir a GitHub**
1. Ve a [GitHub.com](https://github.com) y crea un nuevo repositorio
2. Nombra el repositorio: `inventario-fuxion-casa`
3. Ejecuta estos comandos:
```bash
git remote add origin https://github.com/TU_USUARIO/inventario-fuxion-casa.git
git branch -M main
git push -u origin main
```

### **Paso 3: Desplegar en Vercel**
1. Ve a [Vercel.com](https://vercel.com) y crea una cuenta
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `inventario-fuxion-casa`
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Click en "Deploy"
6. ¡Listo! Tu aplicación estará disponible en una URL como: `https://inventario-fuxion-casa.vercel.app`

---

## 🌐 **Opción 2: Publicar en Netlify**

### **Paso 1: Preparar para Netlify**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build del proyecto
npm run build
npm run export
```

### **Paso 2: Desplegar**
```bash
# Login en Netlify
netlify login

# Desplegar
netlify deploy --prod --dir=out
```

---

## 🛡️ **Configuración de Seguridad Adicional**

### **1. Variables de Entorno (Opcional)**
Puedes mover las credenciales a variables de entorno en Vercel:

En Vercel Dashboard → Settings → Environment Variables:
```
AUTHORIZED_USERS=admin:admin123:Administrador:admin,gerente:fuxion2025:Gerente:manager
```

### **2. Dominio Personalizado**
En Vercel Dashboard → Settings → Domains:
- Puedes agregar tu propio dominio como `inventario.fuxioncasa.com`

### **3. Protección con Contraseña**
En Vercel Dashboard → Settings → Password Protection:
- Activar protección adicional con contraseña

---

## 🔧 **Configuraciones Adicionales**

### **Cambiar Lista de Usuarios Autorizados**
Edita el archivo `src/app/login/page.tsx` líneas 7-13:
```typescript
const AUTHORIZED_USERS = [
  { username: 'nuevo_usuario', password: 'nueva_contraseña', name: 'Nombre Completo', role: 'employee' },
  // ... más usuarios
]
```

### **Configurar Roles y Permisos**
- `admin`: Acceso completo
- `manager`: Gestión de inventario y deudas
- `employee`: Solo visualización y operaciones básicas

---

## 📱 **Acceso desde Dispositivos**

Una vez publicado, los usuarios autorizados podrán acceder desde:
- ✅ Computadoras
- ✅ Tablets
- ✅ Smartphones
- ✅ Cualquier navegador moderno

---

## 🔒 **Seguridad Implementada**

- ✅ **Acceso restringido**: Solo usuarios en la lista pueden ingresar
- ✅ **Sesiones**: Los usuarios permanecen logueados hasta cerrar sesión
- ✅ **Redirección automática**: Si no está logueado, va al login
- ✅ **Roles diferenciados**: Admin, Manager, Employee
- ✅ **HTTPS automático**: Vercel incluye certificado SSL

---

## 🚀 **URLs de Ejemplo**

Después del despliegue tendrás:
- **Aplicación**: `https://tu-app.vercel.app`
- **Login**: `https://tu-app.vercel.app/login`

¡Listo! Tu sistema de inventario estará disponible 24/7 para el personal autorizado de Fuxion Casa.

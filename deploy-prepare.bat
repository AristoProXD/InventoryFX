@echo off
echo ====================================
echo    Preparando para Publicacion
echo    Inventario Fuxion Casa
echo ====================================
echo.

echo [1/4] Verificando Node.js...
node --version
echo.

echo [2/4] Instalando dependencias...
npm install
echo.

echo [3/4] Compilando proyecto...
npm run build
echo.

echo [4/4] Verificando que todo funcione...
echo ✅ Proyecto listo para publicar!
echo.

echo ====================================
echo        SIGUIENTES PASOS:
echo ====================================
echo 1. Subir codigo a GitHub
echo 2. Conectar repositorio en Vercel.com
echo 3. Hacer deploy automatico
echo.
echo Ver instrucciones completas en: DEPLOYMENT.md
echo.
echo Usuarios familiares autorizados para acceso:
echo - admin / fuxion2025 (Administrador)
echo - familia1 / casa123 (Usuario Familiar 1)
echo - familia2 / fuxion456 (Usuario Familiar 2)
echo - familia3 / inventario789 (Usuario Familiar 3)
echo - familia4 / almacen321 (Usuario Familiar 4)
echo.
pause

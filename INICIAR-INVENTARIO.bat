@echo off
title Inventario Fuxion Casa - Iniciando...
color 0A

echo.
echo ====================================
echo    🏢 INVENTARIO FUXION CASA 🏢
echo ====================================
echo.
echo ⚡ Iniciando aplicacion...
echo.

:: Cambiar al directorio del proyecto
cd /d "%~dp0"

:: Verificar si Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no encontrado
    echo.
    echo 📥 Descarga Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

:: Verificar si las dependencias estan instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias por primera vez...
    echo    (Esto puede tomar unos minutos)
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
)

:: Iniciar la aplicacion
echo ✅ Node.js encontrado
echo 🚀 Iniciando Inventario Fuxion Casa...
echo.
echo 🌐 La aplicacion se abrira en: http://localhost:3000
echo 👥 Usuarios disponibles:
echo    - admin / fuxion2025
echo    - familia1 / casa123
echo    - familia2 / fuxion456
echo    - familia3 / inventario789
echo    - familia4 / almacen321
echo.
echo ⚠️  IMPORTANTE: NO CERRAR esta ventana
echo    Para detener el servidor presiona Ctrl+C
echo.

:: Esperar un momento antes de abrir el navegador
timeout /t 3 /nobreak >nul

:: Abrir automáticamente en el navegador
start http://localhost:3000

:: Iniciar el servidor de desarrollo
npm run dev

:: Si llega aqui, el servidor se detuvo
echo.
echo 🛑 Servidor detenido
pause

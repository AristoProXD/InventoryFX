@echo off
title Configurar Supabase - Inventario Fuxion Casa
color 0A

echo ====================================
echo   CONFIGURAR SUPABASE
echo   Sincronizacion Tiempo Real 24/7
echo ====================================
echo.

echo 📋 Necesitas tener listos:
echo    1. Project URL (https://xyz.supabase.co)
echo    2. anon/public key (eyJ...)
echo.

echo 🔗 Si aun no tienes el proyecto:
echo    1. Ir a https://supabase.com
echo    2. Crear nuevo proyecto
echo    3. Ejecutar el script SQL (database-setup.sql)
echo    4. Obtener credenciales en Settings > API
echo.

set /p supabase_url="🌐 Pega tu Project URL: "
if "%supabase_url%"=="" (
    echo ❌ URL vacia. Intenta de nuevo.
    pause
    exit /b 1
)

echo.
set /p supabase_key="🔑 Pega tu anon/public key: "
if "%supabase_key%"=="" (
    echo ❌ Key vacia. Intenta de nuevo.
    pause
    exit /b 1
)

echo.
echo 💾 Guardando configuracion...

:: Crear archivo .env.local
echo # Variables de entorno para Supabase > .env.local
echo NEXT_PUBLIC_SUPABASE_URL=%supabase_url% >> .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%supabase_key% >> .env.local

echo.
echo ✅ Configuracion guardada en .env.local
echo.
echo 🚀 Ahora puedes:
echo    1. Reiniciar la aplicacion (npm run dev)
echo    2. Sincronizacion automatica activada!
echo.
echo 🌟 FUNCIONALIDADES DISPONIBLES:
echo    - Sincronizacion tiempo real entre dispositivos
echo    - Backup automatico en la nube
echo    - Cambios instantaneos en celular/tablet/PC
echo    - Botón de actualizacion manual
echo.

pause

echo.
echo 🔄 ¿Quieres reiniciar la aplicacion ahora? (S/N)
set /p reiniciar="> "

if /i "%reiniciar%"=="S" (
    echo.
    echo 🚀 Reiniciando aplicacion con Supabase...
    start cmd /k "npm run dev"
    echo.
    echo ✅ Aplicacion iniciada con sincronizacion 24/7
    echo    URL: http://localhost:3000
)

pause

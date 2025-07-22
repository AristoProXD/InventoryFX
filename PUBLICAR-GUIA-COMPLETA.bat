@echo off
title 🚀 PUBLICAR INVENTARIO 24/7 - GUIA COMPLETA
color 0A

echo ====================================
echo   🏢 INVENTARIO FUXION CASA 🏢
echo   PUBLICACION 24/7 - GUIA COMPLETA
echo ====================================
echo.

echo 🎯 OBJETIVO: Tener tu inventario disponible 24/7
echo    desde cualquier lugar del mundo
echo.
echo 📋 PROCESO COMPLETO (4 pasos simples):
echo.
echo    1️⃣ Instalar Git (herramienta necesaria)
echo    2️⃣ Preparar proyecto para publicacion
echo    3️⃣ Subir a GitHub (almacenamiento en la nube)
echo    4️⃣ Desplegar en Vercel (24/7 online)
echo.
echo ✨ RESULTADO FINAL:
echo    URL como: https://inventario-fuxion-casa.vercel.app
echo    Accesible 24/7 desde celular, tablet, PC
echo.
echo ⏱️  TIEMPO TOTAL: 15-20 minutos
echo 💰 COSTO: GRATIS (para siempre)
echo.
echo 👥 ACCESO FAMILIAR:
echo    Mismos usuarios: admin, familia1, familia2, etc.
echo    Mismas contraseñas que ya configuramos
echo.

echo =======================================
echo   ¿EMPEZAMOS LA PUBLICACION 24/7?
echo =======================================
echo.
echo Elige una opcion:
echo.
echo [1] 🚀 SI - Empezar publicacion 24/7
echo [2] 📖 Ver guia detallada primero  
echo [3] ❌ Cancelar
echo.

set /p opcion="Ingresa tu opcion (1, 2 o 3): "

if "%opcion%"=="1" goto iniciar_publicacion
if "%opcion%"=="2" goto mostrar_guia
if "%opcion%"=="3" goto cancelar

echo ❌ Opcion invalida
pause
goto inicio

:iniciar_publicacion
echo.
echo 🚀 ¡PERFECTO! Empezando publicacion 24/7...
echo.
echo 📋 PASO 1: Verificando Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git no encontrado - necesario instalarlo
    echo.
    echo 🔧 Ejecutando instalador de Git...
    pause
    call publicar-paso-1-instalar-git.bat
) else (
    echo ✅ Git ya está instalado
    echo.
    echo 🔧 Ejecutando preparacion del proyecto...
    pause
    call publicar-paso-2-preparar.bat
)
goto fin

:mostrar_guia
echo.
echo 📖 GUIA DETALLADA DE PUBLICACION 24/7
echo ====================================
echo.
echo 🎯 ¿QUE VAMOS A LOGRAR?
echo    Tu inventario funcionara 24/7 en internet
echo    Accesible desde cualquier dispositivo
echo    URL permanente para compartir con familia
echo.
echo 🔧 ¿QUE NECESITAMOS?
echo    - Git (herramienta para subir codigo)
echo    - Cuenta GitHub (gratis - almacenamiento)
echo    - Cuenta Vercel (gratis - hosting 24/7)
echo.
echo 📋 PROCESO DETALLADO:
echo.
echo    PASO 1: Instalar Git
echo    ----------------
echo    - Descargar desde git-scm.com
echo    - Instalar con opciones por defecto
echo    - Reiniciar aplicacion
echo.
echo    PASO 2: Preparar proyecto
echo    -------------------------
echo    - Configurar Git con tu nombre/email
echo    - Crear repositorio local
echo    - Preparar archivos para publicacion
echo.
echo    PASO 3: Subir a GitHub  
echo    ----------------------
echo    - Crear cuenta en github.com (gratis)
echo    - Crear repositorio "inventario-fuxion-casa"
echo    - Subir todo el codigo a la nube
echo.
echo    PASO 4: Desplegar en Vercel
echo    ---------------------------
echo    - Crear cuenta en vercel.com (gratis)
echo    - Conectar con GitHub
echo    - Deploy automatico (1 clic)
echo    - Obtener URL 24/7
echo.
echo ✅ BENEFICIOS:
echo    - Acceso 24/7 desde cualquier lugar
echo    - URL permanente para la familia
echo    - Backups automaticos
echo    - Actualizaciones sin problemas
echo    - 99.9%% de disponibilidad
echo    - HTTPS seguro automatico
echo.
pause
goto inicio

:cancelar
echo.
echo ❌ Publicacion cancelada
echo.
echo 💡 Puedes ejecutar este script cuando quieras
echo    publicar tu inventario 24/7
echo.
goto fin

:inicio
cls
goto start

:fin
echo.
echo 📞 ¿NECESITAS AYUDA?
echo.
echo Si tienes problemas en cualquier paso:
echo - Lee cuidadosamente los mensajes de error
echo - Verifica tu conexion a internet
echo - Asegurate de seguir los pasos en orden
echo.
echo 🎯 OBJETIVO: Tu inventario 24/7 online
echo.
pause

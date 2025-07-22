@echo off
title Publicar Inventario 24/7 - Paso 2
color 0A

echo ====================================
echo   PASO 2: SUBIR A GITHUB
echo   Publicacion 24/7
echo ====================================
echo.

:: Cambiar al directorio del proyecto
cd /d "%~dp0"

:: Verificar Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git no encontrado
    echo 📥 Ejecuta primero: publicar-paso-1-instalar-git.bat
    pause
    exit /b 1
)

echo ✅ Git encontrado
echo.

:: Configurar Git (si no está configurado)
echo 👤 Configurando Git...
echo.
echo Necesitamos configurar tu nombre y email para Git:
echo (Esto es solo para identificar los commits)
echo.

set /p git_name="🏷️  Ingresa tu nombre (ej: Juan Perez): "
set /p git_email="📧 Ingresa tu email (ej: juan@email.com): "

git config --global user.name "%git_name%"
git config --global user.email "%git_email%"

echo.
echo ✅ Git configurado correctamente
echo.

:: Crear archivo .gitignore optimizado
echo # Dependencias > .gitignore
echo node_modules/ >> .gitignore
echo .pnp >> .gitignore
echo .pnp.js >> .gitignore
echo. >> .gitignore
echo # Produccion >> .gitignore
echo /build >> .gitignore
echo /dist >> .gitignore
echo. >> .gitignore
echo # Next.js >> .gitignore
echo .next/ >> .gitignore
echo out/ >> .gitignore
echo. >> .gitignore
echo # Logs >> .gitignore
echo *.log >> .gitignore
echo npm-debug.log* >> .gitignore
echo. >> .gitignore
echo # Variables de entorno >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.production >> .gitignore
echo. >> .gitignore
echo # Cache >> .gitignore
echo .eslintcache >> .gitignore
echo. >> .gitignore
echo # Sistema >> .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore

echo 📁 Archivo .gitignore creado
echo.

:: Inicializar repositorio Git
echo 🔧 Inicializando repositorio Git...
git init

:: Agregar todos los archivos
echo 📦 Agregando archivos al repositorio...
git add .

:: Crear commit inicial
echo 💾 Creando commit inicial...
git commit -m "Inventario Fuxion Casa - Sistema completo para publicacion 24/7"

:: Crear rama main
git branch -M main

echo.
echo ✅ Repositorio Git creado exitosamente
echo.
echo 📋 PROXIMO PASO:
echo.
echo 1. 🌐 Crear cuenta en GitHub (si no tienes):
echo    👉 https://github.com
echo.
echo 2. 📁 Crear nuevo repositorio:
echo    - Nombre: inventario-fuxion-casa
echo    - Publico o Privado (tu eliges)
echo    - NO agregar README, .gitignore, ni licencia
echo.
echo 3. 📤 Copiar la URL del repositorio que GitHub te dé
echo    (algo como: https://github.com/TU_USUARIO/inventario-fuxion-casa.git)
echo.
echo 4. 🚀 Ejecutar: publicar-paso-3-subir.bat
echo.
echo ⏳ Presiona cualquier tecla cuando hayas creado el repositorio en GitHub...
pause

echo.
echo 🌐 Abriendo GitHub para crear el repositorio...
start https://github.com/new

echo.
echo ✅ Despues de crear el repositorio en GitHub:
echo    📁 Ejecuta: publicar-paso-3-subir.bat
echo.
pause

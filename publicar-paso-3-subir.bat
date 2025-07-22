@echo off
title Publicar Inventario 24/7 - Paso 3
color 0A

echo ====================================
echo   PASO 3: SUBIR A GITHUB
echo   Publicacion 24/7
echo ====================================
echo.

:: Cambiar al directorio del proyecto
cd /d "%~dp0"

echo 📤 Vamos a subir tu inventario a GitHub
echo.
echo Necesito la URL de tu repositorio de GitHub:
echo (Ejemplo: https://github.com/tuusuario/inventario-fuxion-casa.git)
echo.

set /p repo_url="🔗 Pega aqui la URL de tu repositorio: "

if "%repo_url%"=="" (
    echo ❌ URL vacia. Intenta de nuevo.
    pause
    exit /b 1
)

echo.
echo 🔗 Conectando con GitHub...
git remote add origin "%repo_url%"

echo 📤 Subiendo archivos a GitHub...
echo    (Esto puede tomar unos minutos)
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ ¡EXITO! Tu inventario está ahora en GitHub
    echo.
    echo 🎉 REPOSITORIO CREADO EN GITHUB ✅
    echo.
    echo 📋 PROXIMO PASO:
    echo    🚀 Ejecutar: publicar-paso-4-vercel.bat
    echo.
    echo Esto creará tu aplicación 24/7 en internet
    echo.
) else (
    echo.
    echo ❌ Error subiendo a GitHub
    echo 💡 Verifica que:
    echo    - La URL del repositorio sea correcta
    echo    - Tengas permisos en el repositorio
    echo    - Tu conexion a internet funcione
    echo.
    echo 🔄 Puedes intentar de nuevo ejecutando este script
    echo.
)

pause

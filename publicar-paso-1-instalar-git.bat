@echo off
title Instalar Git - Paso 1 para Publicar 24/7
color 0A

echo ====================================
echo   PASO 1: INSTALAR GIT
echo   Necesario para publicar 24/7
echo ====================================
echo.

echo 📝 Git es necesario para subir tu proyecto a GitHub
echo    y luego publicarlo en Vercel (24/7)
echo.
echo 🔗 Se abrira la pagina de descarga de Git
echo    Descarga la version para Windows de 64-bit
echo.
echo 📋 Instrucciones de instalacion:
echo    1. Hacer clic en "Download for Windows"
echo    2. Ejecutar el archivo descargado
echo    3. Dejar todas las opciones por defecto
echo    4. Hacer clic en "Next" hasta "Install"
echo    5. Esperar que termine la instalacion
echo    6. Hacer clic en "Finish"
echo.
echo 🔄 Despues de instalar Git:
echo    - Reiniciar esta aplicacion
echo    - Ejecutar: publicar-paso-2.bat
echo.

pause
echo.
echo 🌐 Abriendo pagina de descarga de Git...
start https://git-scm.com/download/win

echo.
echo ✅ Despues de instalar Git, ejecuta:
echo    📁 publicar-paso-2.bat
echo.
pause

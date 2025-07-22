@echo off
:: Script para configurar inicio automático con Windows
title Configurar Inicio Automatico - Inventario Fuxion Casa
color 0E

echo ====================================
echo   Configurar Inicio Automatico
echo   Inventario Fuxion Casa  
echo ====================================
echo.
echo ⚠️  ADVERTENCIA: Esto hara que la aplicacion
echo    se inicie automaticamente con Windows
echo.
echo ¿Deseas continuar? (S/N)
set /p respuesta="> "

if /i not "%respuesta%"=="S" (
    echo Operacion cancelada.
    pause
    exit /b 0
)

echo.
echo 📝 Configurando inicio automatico...

:: Crear script de inicio
set "startupScript=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\inventario-fuxion-casa.bat"

echo @echo off > "%startupScript%"
echo title Inventario Fuxion Casa - Inicio Automatico >> "%startupScript%"
echo cd /d "%~dp0" >> "%startupScript%"
echo timeout /t 10 /nobreak ^>nul >> "%startupScript%"
echo start "" "%~dp0INICIAR-INVENTARIO.bat" >> "%startupScript%"

echo.
echo ✅ Configuracion completa
echo.
echo 🚀 La aplicacion se iniciara automaticamente
echo    cuando Windows arranque (con 10 seg de retraso)
echo.
echo 📍 Para desactivar, elimina el archivo:
echo    %startupScript%
echo.
pause

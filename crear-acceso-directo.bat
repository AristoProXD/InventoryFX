@echo off
:: Script para crear acceso directo en el escritorio
title Crear Acceso Directo - Inventario Fuxion Casa

echo ====================================
echo   Creando Acceso Directo
echo   Inventario Fuxion Casa
echo ====================================
echo.

:: Crear archivo .vbs para el acceso directo
set "vbsFile=%temp%\crear_acceso_directo.vbs"
set "projectPath=%~dp0"
set "desktopPath=%USERPROFILE%\Desktop"

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%vbsFile%"
echo sLinkFile = "%desktopPath%\🏢 Inventario Fuxion Casa.lnk" >> "%vbsFile%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%vbsFile%"
echo oLink.TargetPath = "%projectPath%INICIAR-INVENTARIO.bat" >> "%vbsFile%"
echo oLink.WorkingDirectory = "%projectPath%" >> "%vbsFile%"
echo oLink.Description = "Sistema de Inventario Familiar Fuxion Casa" >> "%vbsFile%"
echo oLink.IconLocation = "shell32.dll,21" >> "%vbsFile%"
echo oLink.Save >> "%vbsFile%"

:: Ejecutar el script VBS
cscript //nologo "%vbsFile%"

:: Limpiar archivo temporal
del "%vbsFile%"

echo ✅ Acceso directo creado en el escritorio
echo.
echo 🏢 Nombre: "Inventario Fuxion Casa"
echo 📍 Ubicacion: Escritorio
echo.
echo Ahora puedes hacer doble clic en el icono
echo del escritorio para iniciar la aplicacion.
echo.
pause

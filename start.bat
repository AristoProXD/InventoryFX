@echo off
echo ====================================
echo   Iniciando Inventario Fuxion Casa
echo ====================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado
    echo Por favor ejecuta setup.bat primero
    pause
    exit /b 1
)

echo Verificando dependencias...
if not exist "node_modules" (
    echo ❌ Dependencias no instaladas
    echo Ejecutando instalación...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Iniciando servidor de desarrollo...
echo.
echo 📱 La aplicación estará disponible en: http://localhost:3000
echo 🔑 Usuario: admin  |  Contraseña: admin123
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev

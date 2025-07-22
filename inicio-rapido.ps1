# Inventario Fuxion Casa - Script de Inicio PowerShell
# Ejecutar: .\inicio-rapido.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "    🏢 INVENTARIO FUXION CASA 🏢     " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del script
Set-Location $PSScriptRoot

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js no encontrado" -ForegroundColor Red
    Write-Host "📥 Descarga desde: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar dependencias
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

# Mostrar información
Write-Host "🚀 Iniciando aplicación..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "👥 Usuarios familiares:" -ForegroundColor Yellow
Write-Host "   • admin / fuxion2025" -ForegroundColor White
Write-Host "   • familia1 / casa123" -ForegroundColor White
Write-Host "   • familia2 / fuxion456" -ForegroundColor White
Write-Host "   • familia3 / inventario789" -ForegroundColor White
Write-Host "   • familia4 / almacen321" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  NO CERRAR esta ventana" -ForegroundColor Red
Write-Host "   Para detener: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Esperar y abrir navegador
Start-Sleep 2
Start-Process "http://localhost:3000"

# Iniciar servidor
npm run dev

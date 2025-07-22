'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Wifi, WifiOff, Download, Upload } from 'lucide-react'

interface QuickSyncProps {
  onSyncProducts: () => void
  onSyncDebts: () => void
}

export default function QuickSync({ onSyncProducts, onSyncDebts }: QuickSyncProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  // Detectar conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleManualSync = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    try {
      // Sincronizar productos y deudas
      await Promise.all([
        onSyncProducts(),
        onSyncDebts()
      ])
      setLastSync(new Date())
    } catch (error) {
      console.error('Error en sincronización:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Nunca'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Ahora'
    if (minutes === 1) return '1 min'
    if (minutes < 60) return `${minutes} min`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hora'
    if (hours < 24) return `${hours}h`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      {/* Indicador de conexión */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Botón de sincronización */}
      <button
        onClick={handleManualSync}
        disabled={isSyncing || !isOnline}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all
          ${isSyncing 
            ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
            : isOnline
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Sincronizando...' : 'Actualizar Datos'}
      </button>

      {/* Información de última sincronización */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Download className="h-3 w-3" />
        <span>Última: {formatLastSync(lastSync)}</span>
      </div>

      {/* Indicador de cambios pendientes */}
      {!isOnline && (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
          <Upload className="h-3 w-3" />
          <span>Cambios pendientes</span>
        </div>
      )}
    </div>
  )
}

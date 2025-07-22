'use client'

import { useState } from 'react'
import { RefreshCw, Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react'

interface SyncStatusProps {
  isOnline: boolean
  isSyncing: boolean
  lastSync?: Date
  onManualSync: () => void
}

export default function SyncStatus({ isOnline, isSyncing, lastSync, onManualSync }: SyncStatusProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Nunca'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Hace unos segundos'
    if (minutes === 1) return 'Hace 1 minuto'
    if (minutes < 60) return `Hace ${minutes} minutos`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return 'Hace 1 hora'
    if (hours < 24) return `Hace ${hours} horas`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* Indicador de estado */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Cloud className="h-4 w-4 text-green-500" />
        ) : (
          <CloudOff className="h-4 w-4 text-gray-400" />
        )}
        
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-gray-400" />
        )}
      </div>

      {/* Botón de sincronización manual */}
      <button
        onClick={onManualSync}
        disabled={isSyncing}
        className={`
          flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
          ${isSyncing 
            ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }
        `}
      >
        <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Sincronizando...' : 'Actualizar'}
      </button>

      {/* Estado detallado */}
      <div 
        className="relative"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <div className={`
          px-2 py-1 rounded text-xs
          ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}
        `}>
          {isOnline ? 'Online' : 'Offline'}
        </div>

        {/* Tooltip con detalles */}
        {showDetails && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
            <div>Estado: {isOnline ? 'Conectado a la nube' : 'Solo local'}</div>
            <div>Última sync: {formatLastSync(lastSync)}</div>
            {!isOnline && (
              <div className="text-yellow-300 mt-1">
                Los cambios se guardarán cuando vuelvas a conectarte
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

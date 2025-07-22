'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react'
import { isSupabaseConfigured, getSupabaseStatus } from '@/lib/supabase'

interface SyncButtonProps {
  onSync: () => Promise<void>
}

export default function SyncButton({ onSync }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const supabaseStatus = getSupabaseStatus()

  // Detectar conexión
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

  const handleSync = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    try {
      await onSync()
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

  if (!supabaseStatus.configured) {
    return (
      <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <CloudOff className="h-4 w-4 text-yellow-600" />
        <span className="text-yellow-700">Solo modo local</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 border rounded">
      {/* Estado de conexión */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Cloud className="h-4 w-4 text-green-500" />
        ) : (
          <CloudOff className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Botón de sincronización */}
      <button
        onClick={handleSync}
        disabled={isSyncing || !isOnline}
        className={`
          flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all
          ${isSyncing 
            ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
            : isOnline
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Sincronizando...' : 'Actualizar'}
      </button>

      {/* Última sincronización */}
      <span className="text-xs text-gray-500">
        Última: {formatLastSync(lastSync)}
      </span>
    </div>
  )
}

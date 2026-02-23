/**
 * Hook para polling de datos (sin Socket.io)
 * Funciona correctamente en Vercel Serverless
 * Sincroniza datos cada 3 segundos
 */

'use client'

import { useEffect, useRef, useState } from 'react'

interface PollingOptions {
  interval?: number
  onDataChange?: (data: any) => void
}

/**
 * Hook para polling automático de datos desde la base de datos
 * @param fetchFn Función async que retorna los datos
 * @param options Configuración de polling
 */
export const usePolling = (
  fetchFn: () => Promise<any>,
  options: PollingOptions = {}
) => {
  const { interval = 3000, onDataChange } = options
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const prevDataRef = useRef<string>('')

  useEffect(() => {
    let isMounted = true
    let intervalId: NodeJS.Timeout

    const fetchData = async () => {
      try {
        setLoading(true)
        setSyncStatus('loading')
        const result = await fetchFn()
        
        if (!isMounted) return

        // Comparar con datos anteriores para detectar cambios
        const currentDataStr = JSON.stringify(result)
        if (prevDataRef.current !== currentDataStr) {
          prevDataRef.current = currentDataStr
          setData(result)
          
          if (onDataChange) {
            onDataChange(result)
          }
        }

        setError(null)
        setSyncStatus('ok')
        setLoading(false)
      } catch (err) {
        if (!isMounted) return
        
        setError(err instanceof Error ? err.message : 'Error fetching data')
        setSyncStatus('error')
        setLoading(false)
      }
    }

    // Fetch inicial
    fetchData()

    // Polling cada N segundos
    intervalId = setInterval(fetchData, interval)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [fetchFn, interval, onDataChange])

  return { data, loading, error, syncStatus }
}

/**
 * Hook para polling múltiple de diferentes tipos de datos
 * Retorna también función para forzar sync inmediato
 */
export const useMultiplePolling = (
  fetchFunctions: { [key: string]: () => Promise<any> },
  options: PollingOptions = {}
) => {
  const { interval = 3000 } = options
  const [data, setData] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const prevDataRef = useRef<string>('')
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

  const fetchAllData = async () => {
    try {
      setSyncStatus('loading')
      setLoading(true)
      console.log('[POLLING] Fetching all data...')

      const results = await Promise.all(
        Object.entries(fetchFunctions).map(async ([key, fn]) => {
          try {
            console.log(`[POLLING] Fetching ${key}...`)
            const result = await fn()
            console.log(`[POLLING] ${key} result:`, result?.length || 'null')
            return [key, result] as const
          } catch (err) {
            console.error(`[POLLING] Error fetching ${key}:`, err)
            return [key, null] as const
          }
        })
      )

      const newData = Object.fromEntries(results)
      console.log('[POLLING] All data fetched, comparing...')
      
      // Comparar con datos anteriores
      const currentDataStr = JSON.stringify(newData)
      if (prevDataRef.current !== currentDataStr) {
        console.log('[POLLING] Data changed, updating state')
        prevDataRef.current = currentDataStr
        setData(newData)
      } else {
        console.log('[POLLING] Data unchanged')
      }

      console.log('[POLLING] Setting sync status to ok')
      setSyncStatus('ok')
      setLoading(false)
    } catch (err) {
      console.error('[POLLING] Error in fetchAllData:', err)
      setSyncStatus('error')
      setLoading(false)
    }
  }

  // Función para forzar sync inmediato
  const forceSync = async () => {
    await fetchAllData()
  }

  useEffect(() => {
    let isMounted = true

    // Fetch inicial
    if (isMounted) {
      fetchAllData()
    }

    // Polling cada N segundos
    intervalIdRef.current = setInterval(() => {
      if (isMounted) {
        fetchAllData()
      }
    }, interval)

    return () => {
      isMounted = false
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [fetchFunctions, interval])

  return { data, loading, syncStatus, forceSync }
}

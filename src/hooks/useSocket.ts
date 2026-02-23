/**
 * Hook para Socket.io - Cliente
 * Conecta a tiempo real y maneja eventos
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const getSocket = (): Socket => {
  if (!socket) {
    socket = io(undefined, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

export const useSocket = () => {
  const [connected, setConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const socket = getSocket()

    const handleConnect = () => {
      console.log('✅ Socket.io conectado')
      setConnected(true)
      setIsLoading(false)
    }

    const handleDisconnect = () => {
      console.log('❌ Socket.io desconectado')
      setConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    if (socket.connected) {
      setConnected(true)
      setIsLoading(false)
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [])

  const emit = useCallback((event: string, data?: any) => {
    const socket = getSocket()
    if (socket.connected) {
      socket.emit(event, data)
    }
  }, [])

  const on = useCallback((event: string, callback: (data: any) => void) => {
    const socket = getSocket()
    socket.on(event, callback)

    return () => {
      socket.off(event, callback)
    }
  }, [])

  const once = useCallback((event: string, callback: (data: any) => void) => {
    const socket = getSocket()
    socket.once(event, callback)
  }, [])

  return {
    socket: getSocket(),
    connected,
    isLoading,
    emit,
    on,
    once,
  }
}

export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  const { on } = useSocket()

  useEffect(() => {
    return on(event, callback)
  }, [event, callback, on])
}

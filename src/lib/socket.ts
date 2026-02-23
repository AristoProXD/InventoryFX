/**
 * Socket.io Real-time Server
 * Maneja actualizaciones en tiempo real de datos
 */

import { Server as SocketIOServer, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { dbEvents } from './database'

let io: SocketIOServer | null = null

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL || 'https://inventario-fuxion-casa.vercel.app'
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  // Escuchar cambios en la BD y emitir a clientes
  io.on('connection', (socket: Socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`)

    // Sincronizar cambios de productos
    socket.on('request-products-sync', () => {
      socket.emit('products-sync-requested')
    })

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`)
    })
  })

  // Escuchar eventos de la BD
  dbEvents.on('products-loaded', (products) => {
    io?.emit('products-updated', products)
  })

  dbEvents.on('product-added', (product) => {
    io?.emit('product-added', product)
  })

  dbEvents.on('product-updated', (product) => {
    io?.emit('product-updated', product)
  })

  dbEvents.on('product-deleted', (data) => {
    io?.emit('product-deleted', data)
  })

  dbEvents.on('debts-loaded', (debts) => {
    io?.emit('debts-updated', debts)
  })

  dbEvents.on('debt-added', (debt) => {
    io?.emit('debt-added', debt)
  })

  dbEvents.on('debt-deleted', (data) => {
    io?.emit('debt-deleted', data)
  })

  dbEvents.on('listas-loaded', (listas) => {
    io?.emit('listas-updated', listas)
  })

  dbEvents.on('lista-added', (lista) => {
    io?.emit('lista-added', lista)
  })

  dbEvents.on('lista-updated', (lista) => {
    io?.emit('lista-updated', lista)
  })

  dbEvents.on('lista-deleted', (data) => {
    io?.emit('lista-deleted', data)
  })

  return io
}

export const getIO = (): SocketIOServer | null => io

export const emitToAll = (event: string, data: any) => {
  if (io) {
    io.emit(event, data)
  }
}

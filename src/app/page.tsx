'use client'

import { useState, useEffect } from 'react'
import { LoginForm } from '@/components/LoginForm'
import InventoryApp from '@/components/InventoryApp'

// Configuración del sistema
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 horas

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const sessionData = localStorage.getItem('fuxion-session')
    if (sessionData) {
      const { timestamp } = JSON.parse(sessionData)
      const elapsed = Date.now() - timestamp
      
      if (elapsed < SESSION_DURATION) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('fuxion-session')
      }
    }
  }, [])

  const handleLogin = (password: string) => {
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true
    }
    localStorage.setItem('fuxion-session', JSON.stringify(sessionData))
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <InventoryApp />
}

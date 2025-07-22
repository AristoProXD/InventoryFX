'use client'

import { useState } from 'react'
import { Lock, User, Package, Eye, EyeOff } from 'lucide-react'

// Lista de usuarios autorizados (familiares)
const AUTHORIZED_USERS = [
  { username: 'admin', password: 'fuxion2025', name: 'Administrador' },
  { username: 'familia1', password: 'casa123', name: 'Usuario Familiar 1' },
  { username: 'familia2', password: 'fuxion456', name: 'Usuario Familiar 2' },
  { username: 'familia3', password: 'inventario789', name: 'Usuario Familiar 3' },
  { username: 'familia4', password: 'almacen321', name: 'Usuario Familiar 4' },
]

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Buscar usuario en la lista de autorizados
    const user = AUTHORIZED_USERS.find(u => 
      u.username === formData.username && u.password === formData.password
    )

    setTimeout(() => {
      if (user) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('fuxion_user', JSON.stringify({
          username: user.username,
          name: user.name,
          loginTime: new Date().toISOString()
        }))
        
        // Redirigir al dashboard principal
        window.location.href = '/'
      } else {
        alert('❌ Acceso denegado. Solo personal autorizado puede ingresar al sistema.')
      }
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Inventario Fuxion Casa
          </h1>
          <p className="text-slate-600">
            Sistema de Gestión de Almacén
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-slate-600">
              Accede con tus credenciales autorizadas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Información de usuarios autorizados */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-3">
              👥 Usuarios Autorizados:
            </h4>
            <div className="text-xs text-blue-600 space-y-2">
              {AUTHORIZED_USERS.map((user, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                  <div>
                    <strong>{user.username}</strong> - {user.name}
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    Usuario
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-500 mt-2 italic">
              Solo usuarios familiares autorizados pueden acceder
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2025 Fuxion Casa. Sistema de Inventario.</p>
          <p className="mt-1">Acceso restringido únicamente a personal autorizado.</p>
        </div>
      </div>
    </div>
  )
}

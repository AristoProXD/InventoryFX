import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inventario Fuxion Casa - Sistema de Gestión de Almacén',
  description: 'Sistema de gestión de inventario en tiempo real para Fuxion Casa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviders>
          <div id="root">{children}</div>
        </ClientProviders>
      </body>
    </html>
  )
}

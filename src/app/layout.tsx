'use client'

import { usePathname } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import SiteLayout from '@/components/layout/SiteLayout'
import { Toaster } from '@/components/ui/sonner'
import { Provider } from 'react-redux'
import { store, persistor } from '@/store' 
import { PersistGate } from 'redux-persist/integration/react'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
const isAuthenticated = false; 
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <title>My App Title</title>
        <link rel="icon" href="favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {isAdminRoute ? (
              <>
                {children}
                <Toaster richColors />
              </>
            ) : (
              <SiteLayout isAuthenticated={isAuthenticated}>
                {children}
                <Toaster richColors />
              </SiteLayout>
            )}
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}
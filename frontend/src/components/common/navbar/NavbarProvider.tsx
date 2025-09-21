'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '.'

interface NavbarProviderProps {
  children: React.ReactNode
}

export const NavbarProvider: React.FC<NavbarProviderProps> = ({ children }) => {
  const pathname = usePathname()
  
  // Show logout button on dashboard pages
  const showLogout = pathname?.startsWith('/dashboard')
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="SafarPlan" showLogout={showLogout} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

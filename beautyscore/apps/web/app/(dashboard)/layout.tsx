'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavItem {
  icon: string
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: '🔍', label: 'Сканер', href: '/app' },
  { icon: '📦', label: 'Моя полка', href: '/app/shelf' },
  { icon: '📚', label: 'Энциклопедия', href: '/app/encyclopedia' },
  { icon: '⭐', label: 'Тренды', href: '/app/discover' },
  { icon: '👤', label: 'Профиль', href: '/app/profile' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) throw new Error('Unauthorized')
        const userData = await response.json()
        setUser(userData)
      } catch {
        localStorage.removeItem('accessToken')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (isLoading) {
    return (
      <div style={{ 
        backgroundColor: '#FDFCFB',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2rem' }}>🔬</div>
          <div style={{
            width: '32px',
            height: '32px',
            border: '4px solid #EDE9E4',
            borderTopColor: '#2D7A4F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDFCFB' }}>
      {/* Sidebar (Desktop) */}
      <aside style={{
        width: '260px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: '#F7F5F3',
        borderRight: '1px solid #EDE9E4',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
      }} className="hidden md:flex">
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #EDE9E4' }}>
          <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>🔬</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1714' }}>
              Beauty<span style={{ color: '#2D7A4F' }}>Score</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/app' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: isActive ? 'white' : '#6B6259',
                  backgroundColor: isActive ? '#2D7A4F' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '24px', borderTop: '1px solid #EDE9E4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              backgroundColor: '#2D7A4F',
              color: 'white'
            }}>
              {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1714' }}>
                {user?.name || 'Пользователь'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8C8177' }}>
                {user?.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header 
        className="md:hidden"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '16px',
          backgroundColor: '#FDFCFB',
          borderBottom: '1px solid #EDE9E4'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>🔬</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1714' }}>
              Beauty<span style={{ color: '#2D7A4F' }}>Score</span>
            </span>
          </Link>
          <Link 
            href="/app/encyclopedia"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              backgroundColor: '#F7F5F3',
              textDecoration: 'none'
            }}
          >
            📚
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: '260px',
        minHeight: '100vh',
        paddingTop: 0,
        paddingBottom: 0
      }} className="md:ml-[260px] pt-16 md:pt-0 pb-20 md:pb-0">
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '32px 48px'
        }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - hidden on md+ screens */}
      <nav 
        className="flex md:!hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FDFCFB',
          borderTop: '1px solid #EDE9E4',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 200,
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/app' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '12px',
                color: isActive ? '#2D7A4F' : '#8C8177',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'color 0.15s',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

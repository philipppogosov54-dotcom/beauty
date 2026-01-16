'use client'

import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#FDFCFB',
    }}>
      {/* Left side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px',
        maxWidth: '560px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔬</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1714' }}>
              Beauty<span style={{ color: '#2D7A4F' }}>Score</span>
            </span>
          </Link>
          
          {children}
        </div>
      </div>

      {/* Right side - Decorative */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1A5C3A 50%, #0F3D26 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '48px',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          color: 'white',
          maxWidth: '420px',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            Узнай правду о своей косметике
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.85,
            marginBottom: '40px',
            lineHeight: 1.6,
          }}>
            Присоединяйся к 10,000+ пользователей, которые уже делают осознанный выбор.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Анализ 50,000+ продуктов',
              'Персональные рекомендации',
              '100% бесплатно',
            ].map((feature) => (
              <div key={feature} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}>
                  ✓
                </div>
                <span style={{ opacity: 0.95 }}>{feature}</span>
              </div>
            ))}
          </div>

          {/* Phone mockup */}
          <div style={{
            marginTop: '48px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '16px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#2D7A4F',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '18px',
              }}>
                82
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1A1714', fontSize: '14px' }}>
                  CeraVe Увлажняющий крем
                </div>
                <div style={{ fontSize: '12px', color: '#8C8177' }}>
                  Отличный выбор! ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

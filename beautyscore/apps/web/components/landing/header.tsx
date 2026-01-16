'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(253, 252, 251, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(237, 233, 228, 0.5)',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔬</span>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1A1714',
          }}>
            Beauty<span style={{ color: '#2D7A4F' }}>Score</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
        }}>
          {[
            { label: 'Возможности', href: '#features' },
            { label: 'Как это работает', href: '#how-it-works' },
            { label: 'Демо', href: '/demo' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#6B6259',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <Link href="/login" style={{
            padding: '10px 20px',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: '#1A1714',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            Войти
          </Link>
          <Link href="/register" style={{
            padding: '10px 24px',
            backgroundColor: '#2D7A4F',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(45, 122, 79, 0.25)',
            transition: 'all 0.2s',
          }}>
            Регистрация
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

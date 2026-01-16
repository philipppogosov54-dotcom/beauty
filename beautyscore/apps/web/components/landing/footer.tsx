'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const footerLinks = {
  product: [
    { label: 'Возможности', href: '#features' },
    { label: 'Как это работает', href: '#how-it-works' },
    { label: 'Демо', href: '/demo' },
  ],
  company: [
    { label: 'О нас', href: '/about' },
    { label: 'Контакты', href: '/contact' },
    { label: 'Блог', href: '/blog' },
  ],
  legal: [
    { label: 'Конфиденциальность', href: '/privacy' },
    { label: 'Условия', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1A1714',
      color: '#FDFCFB',
      padding: '80px 24px 40px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Main footer content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '60px',
          marginBottom: '60px',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '1.75rem' }}>🔬</span>
              <span style={{
                fontSize: '1.375rem',
                fontWeight: 600,
                color: '#FDFCFB',
              }}>
                Beauty<span style={{ color: '#5B9A6F' }}>Score</span>
              </span>
            </Link>
            <p style={{
              fontSize: '0.9375rem',
              color: 'rgba(253, 252, 251, 0.6)',
              lineHeight: 1.7,
              maxWidth: '280px',
            }}>
              Переводим сложные составы косметики на понятный язык. 
              Заботься о себе с уверенностью.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(253, 252, 251, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}>
              Продукт
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.product.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <Link href={link.href} style={{
                    fontSize: '0.9375rem',
                    color: 'rgba(253, 252, 251, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(253, 252, 251, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}>
              Компания
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.company.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <Link href={link.href} style={{
                    fontSize: '0.9375rem',
                    color: 'rgba(253, 252, 251, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(253, 252, 251, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}>
              Правовая информация
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.legal.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <Link href={link.href} style={{
                    fontSize: '0.9375rem',
                    color: 'rgba(253, 252, 251, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'rgba(253, 252, 251, 0.1)',
          marginBottom: '32px',
        }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(253, 252, 251, 0.4)',
          }}>
            © 2026 BeautyScore. Все права защищены.
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(253, 252, 251, 0.4)',
          }}>
            Сделано с ❤️ в России
          </p>
        </div>
      </div>
    </footer>
  )
}

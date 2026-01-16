'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Users } from 'lucide-react'

export function CTA() {
  return (
    <section style={{
      padding: '120px 24px',
      background: 'linear-gradient(135deg, #1A1714 0%, #2D2926 50%, #1A1714 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(45, 122, 79, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(196, 128, 77, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'rgba(45, 122, 79, 0.2)',
            borderRadius: '100px',
            marginBottom: '32px',
            border: '1px solid rgba(45, 122, 79, 0.3)',
          }}
        >
          <Users size={16} style={{ color: '#5B9A6F' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#5B9A6F' }}>
            Присоединяйся к 10,000+ пользователей
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#FDFCFB',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          Начни заботиться о себе{' '}
          <span style={{
            background: 'linear-gradient(135deg, #5B9A6F 0%, #2D7A4F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            с уверенностью
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: '1.125rem',
            color: 'rgba(253, 252, 251, 0.7)',
            marginBottom: '48px',
            lineHeight: 1.7,
          }}
        >
          Регистрация занимает меньше минуты. Никакой рекламы, никаких скрытых платежей.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/register" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 36px',
            backgroundColor: '#2D7A4F',
            color: 'white',
            borderRadius: '16px',
            fontSize: '1.0625rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(45, 122, 79, 0.4)',
            transition: 'all 0.3s',
          }}>
            <Sparkles size={20} />
            Создать аккаунт бесплатно
            <ArrowRight size={20} />
          </Link>
          <Link href="#features" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '18px 36px',
            backgroundColor: 'transparent',
            color: '#FDFCFB',
            border: '2px solid rgba(253, 252, 251, 0.2)',
            borderRadius: '16px',
            fontSize: '1.0625rem',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}>
            Узнать больше
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Бесплатно', icon: '🆓' },
            { label: 'Без рекламы', icon: '🚫' },
            { label: 'Приватно', icon: '🔒' },
          ].map((badge) => (
            <div
              key={badge.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(253, 252, 251, 0.5)',
                fontSize: '0.875rem',
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

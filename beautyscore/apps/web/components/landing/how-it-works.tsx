'use client'

import { motion } from 'framer-motion'
import { Scan, BarChart3, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Scan,
    title: 'Сканируй',
    description: 'Наведи камеру на штрих-код продукта или найди его по названию в поиске.',
    color: '#2D7A4F',
  },
  {
    step: '02',
    icon: BarChart3,
    title: 'Анализируй',
    description: 'Получи детальный разбор состава, рейтинг безопасности и предупреждения.',
    color: '#4A7C9B',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Решай',
    description: 'Сделай осознанный выбор на основе персональных рекомендаций.',
    color: '#C4804D',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: '120px 24px',
        backgroundColor: '#F7F5F3',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #EDE9E4, transparent)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '80px',
          }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#1A1714',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            Как это работает
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6B6259',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Три простых шага до осознанного выбора косметики
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          position: 'relative',
        }}>
          {/* Connection line */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, #2D7A4F, #4A7C9B, #C4804D)',
            opacity: 0.3,
            zIndex: 0,
          }} />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Step number */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: step.color,
                    letterSpacing: '0.1em',
                    marginBottom: '20px',
                  }}
                >
                  Шаг {step.step}
                </motion.div>

                {/* Icon */}
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: `0 20px 40px ${step.color}33`,
                  }}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '28px',
                    backgroundColor: 'white',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '28px',
                    border: '1px solid #EDE9E4',
                    transition: 'all 0.3s',
                  }}
                >
                  <Icon size={40} style={{ color: step.color }} />
                </motion.div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#1A1714',
                  marginBottom: '12px',
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.9375rem',
                  color: '#6B6259',
                  lineHeight: 1.6,
                  maxWidth: '280px',
                }}>
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

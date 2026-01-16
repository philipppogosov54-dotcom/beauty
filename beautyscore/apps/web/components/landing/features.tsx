'use client'

import { motion } from 'framer-motion'
import { Scan, FlaskConical, Sparkles, Box, BookOpen, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Scan,
    title: 'Сканирование штрих-кода',
    description: 'Мгновенно получи информацию о продукте, просто наведя камеру на штрих-код.',
    color: '#2D7A4F',
    bgColor: 'rgba(45, 122, 79, 0.08)',
  },
  {
    icon: FlaskConical,
    title: 'Анализ ингредиентов',
    description: 'Детальный разбор каждого компонента состава с научными объяснениями.',
    color: '#4A7C9B',
    bgColor: 'rgba(74, 124, 155, 0.08)',
  },
  {
    icon: Sparkles,
    title: 'Персональные рекомендации',
    description: 'Советы на основе твоего типа кожи, возраста и предпочтений.',
    color: '#C4804D',
    bgColor: 'rgba(196, 128, 77, 0.08)',
  },
  {
    icon: Box,
    title: 'Умная полка',
    description: 'Храни свои продукты, отслеживай сроки годности и получай напоминания.',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
  },
  {
    icon: BookOpen,
    title: 'Энциклопедия',
    description: 'База знаний о 500+ ингредиентах с понятными объяснениями.',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.08)',
  },
  {
    icon: TrendingUp,
    title: 'Тренды и рейтинги',
    description: 'Узнай, что популярно и что реально работает по отзывам пользователей.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.08)',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function Features() {
  return (
    <section
      id="features"
      style={{
        padding: '120px 24px',
        backgroundColor: '#FDFCFB',
        position: 'relative',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(45, 122, 79, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
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
            Всё для осознанного выбора косметики
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6B6259',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Мы превращаем сложные составы в понятную информацию, 
            чтобы ты мог заботиться о себе с уверенностью.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 24px 48px rgba(0,0,0,0.08)',
                }}
                style={{
                  padding: '36px',
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  border: '1px solid #EDE9E4',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: feature.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  <Icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1A1714',
                  marginBottom: '12px',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.9375rem',
                  color: '#6B6259',
                  lineHeight: 1.6,
                }}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

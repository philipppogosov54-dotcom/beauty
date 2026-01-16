'use client'

import { useState } from 'react'
import Link from 'next/link'

// Моковые данные для демо
const recentScans = [
  {
    id: 'cerave-moisturizer',
    name: 'CeraVe Увлажняющий крем',
    brand: 'CeraVe',
    category: 'Уход за кожей',
    score: 82,
  },
  {
    id: 'natura-shampoo',
    name: 'Шампунь восстанавливающий',
    brand: 'Natura Siberica',
    category: 'Волосы',
    score: 71,
  },
  {
    id: 'la-roche-toleriane',
    name: 'La Roche-Posay Toleriane',
    brand: 'La Roche-Posay',
    category: 'Очищение',
    score: 91,
  },
]

function getScoreClass(score: number): string {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'average'
  return 'poor'
}

export default function ScannerPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Узнай правду о косметике
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Сканируй штрих-код или найди по названию
        </p>
      </div>

      {/* Scan Area */}
      <div 
        className="relative rounded-[var(--radius-xl)] overflow-hidden mb-6"
        style={{ 
          background: 'var(--bg-dark)',
          aspectRatio: '4/3',
        }}
      >
        {/* Viewfinder */}
        <div 
          className="absolute rounded-[var(--radius-lg)]"
          style={{
            inset: '15%',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          {/* Scan line */}
          <div 
            className="absolute left-0 right-0 h-1 rounded-sm"
            style={{
              background: 'var(--accent-green)',
              boxShadow: '0 0 20px var(--accent-green)',
              animation: 'scan 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Hint */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm"
          style={{ 
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
          }}
        >
          📷 Наведи камеру на штрих-код
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <Link href="/app/product/cerave-moisturizer" className="btn btn-primary flex-1">
          🔍 Сканировать
        </Link>
        <button 
          className="btn btn-secondary flex-1"
          onClick={() => document.getElementById('search-input')?.focus()}
        >
          🔎 Поиск
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          id="search-input"
          type="text"
          placeholder="🔍 Найти продукт по названию или бренду..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
        />
      </div>

      {/* Recent Scans */}
      <div>
        <div className="section-title">Недавние сканы</div>
        <div className="flex flex-col gap-2">
          {recentScans.map((product) => (
            <Link
              key={product.id}
              href={`/app/product/${product.id}`}
              className="card flex items-center gap-4 cursor-pointer"
            >
              <div className={`score-badge ${getScoreClass(product.score)}`}>
                {product.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {product.name}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {product.brand} • {product.category}
                </div>
              </div>
              <span className="arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Tip */}
      <div className="mt-8">
        <div 
          className="flex gap-4 p-4 rounded-[var(--radius-lg)]"
          style={{ 
            background: 'var(--accent-green-light)',
            border: '1px solid var(--accent-green)',
          }}
        >
          <span className="text-2xl">💡</span>
          <div>
            <strong className="block mb-1" style={{ color: 'var(--text-primary)' }}>
              Совет дня
            </strong>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Ниацинамид и витамин C лучше наносить в разное время суток — 
              так они работают эффективнее.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

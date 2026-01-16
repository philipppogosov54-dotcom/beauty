'use client'

import Link from 'next/link'
import { use } from 'react'

// Типы для продукта
interface ScoreFactor {
  name: string
  score: number
  weight: string
}

interface Ingredient {
  inci: string
  name: string
  position: string
  description: string
  concentration?: string
  ph?: string
  type?: string
  tags: Array<{ label: string; color: 'green' | 'blue' | 'orange' }>
}

interface Compatibility {
  name: string
  status: 'yes' | 'warn' | 'no'
  examples: string
  why: string
  how: string
}

interface SkinMatch {
  type: string
  match: 'yes' | 'ok' | 'no'
}

interface Product {
  id: string
  name: string
  brand: string
  volume: string
  price: string
  image: string
  score: number
  verdict: string
  verdictDesc: string
  tags: string[]
  scoreFactors: ScoreFactor[]
  skinMatches: SkinMatch[]
  recommendation: string
  ingredients: Ingredient[]
  compatibility: Compatibility[]
  alternatives: Array<{ name: string; score: number; price: string; badge?: string }>
}

// Моковые данные продукта (в реальности будет API)
const mockProducts: Record<string, Product> = {
  'cerave-moisturizer': {
    id: 'cerave-moisturizer',
    name: 'CeraVe Увлажняющий крем для лица',
    brand: 'CeraVe',
    volume: '52 мл',
    price: '~890 ₽',
    image: '🧴',
    score: 82,
    verdict: 'Отличный выбор! 👍',
    verdictDesc: 'Подходит для сухой и чувствительной кожи',
    tags: ['Увлажнение', 'Восстановление барьера'],
    scoreFactors: [
      { name: 'Состав', score: 85, weight: '30%' },
      { name: 'Эффективность', score: 80, weight: '30%' },
      { name: 'Безопасность', score: 90, weight: '25%' },
      { name: 'Цена/Качество', score: 75, weight: '15%' },
    ],
    skinMatches: [
      { type: 'Сухая кожа', match: 'yes' },
      { type: 'Чувствительная', match: 'yes' },
      { type: 'Нормальная', match: 'ok' },
      { type: 'Жирная', match: 'no' },
    ],
    recommendation: 'Идеально для сухой кожи: в составе <strong>церамиды</strong> (восстанавливают барьер), <strong>гиалуроновая кислота</strong> (связывает до 1000x воды) и <strong>ниацинамид</strong> (укрепляет барьер). Используй утром и вечером после очищения.',
    ingredients: [
      {
        inci: 'HYALURONIC ACID',
        name: 'Гиалуроновая кислота',
        position: '4-е место',
        description: 'Связывает до 1000x своего веса воды — мощнейшее увлажнение',
        concentration: '0.1-2%',
        ph: '5.0-7.5',
        type: 'Увлажнитель (humectant)',
        tags: [
          { label: 'Увлажнение', color: 'green' },
          { label: 'Упругость', color: 'green' },
          { label: 'Совместим со всем', color: 'blue' },
        ],
      },
      {
        inci: 'CERAMIDE NP',
        name: 'Церамид 3',
        position: '6-е место',
        description: 'Восстанавливает липидный барьер кожи — меньше сухости и раздражений',
        type: 'Барьерная защита',
        tags: [
          { label: 'Барьер', color: 'green' },
          { label: 'Защита', color: 'green' },
          { label: 'Идентичен коже', color: 'blue' },
        ],
      },
      {
        inci: 'NIACINAMIDE',
        name: 'Ниацинамид (Витамин B3)',
        position: '8-е место',
        description: 'Универсальный ингредиент: сужает поры, выравнивает тон, контролирует жирность',
        concentration: '2-10%',
        ph: '5.0-7.0',
        tags: [
          { label: 'Поры', color: 'green' },
          { label: 'Тон', color: 'green' },
          { label: 'Универсальный', color: 'green' },
        ],
      },
    ],
    compatibility: [
      {
        name: 'Ретинол',
        status: 'yes',
        examples: 'La Roche-Posay Retinol B3, CeraVe Resurfacing Retinol, The Ordinary Retinol 0.5%',
        why: 'Церамиды и ниацинамид смягчают раздражение от ретинола, укрепляя барьер. Гиалуроновая кислота компенсирует сухость.',
        how: 'Сначала ретинол, через 20 мин крем',
      },
      {
        name: 'Витамин C',
        status: 'yes',
        examples: 'The Ordinary Vitamin C 23%, SkinCeuticals CE Ferulic, Timeless Vitamin C',
        why: 'Витамин C работает на pH 2.5-3.5, а церамиды стабильны при любом pH. Подождать 15-20 мин.',
        how: 'Утром: Vit C → подождать → крем → SPF',
      },
      {
        name: 'AHA/BHA кислоты',
        status: 'warn',
        examples: 'The Ordinary AHA 30%, Paula\'s Choice BHA, COSRX BHA, Pixi Glow Tonic',
        why: 'Кислоты pH 3-4 разрушают липидный барьер. После пилинга подождать 30 мин.',
        how: 'Лучше: кислоты вечером, крем через 30 мин или утром',
      },
      {
        name: 'Бензоилпероксид',
        status: 'no',
        examples: 'Базирон АС, La Roche-Posay Effaclar Duo+, Clearasil',
        why: 'BPO — сильный окислитель, разрушает ниацинамид и повышает раздражение.',
        how: 'BPO точечно на прыщи утром, крем вечером',
      },
    ],
    alternatives: [
      { name: 'La Roche-Posay Toleriane', score: 85, price: '~1200 ₽' },
      { name: 'Librederm Гиалуроновый', score: 78, price: '~650 ₽', badge: '💰 Дешевле' },
    ],
  },
}

function getScoreClass(score: number): string {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'average'
  return 'poor'
}

function getMatchIcon(match: 'yes' | 'ok' | 'no'): string {
  if (match === 'yes') return '✅'
  if (match === 'ok') return '👌'
  return '⚠️'
}

function getCompatIcon(status: 'yes' | 'warn' | 'no'): string {
  if (status === 'yes') return '✅'
  if (status === 'warn') return '⚠️'
  return '❌'
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = mockProducts[id] ?? mockProducts['cerave-moisturizer']!
  
  if (!product) {
    return <div>Продукт не найден</div>
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <Link 
        href="/app" 
        className="inline-block mb-4 font-medium"
        style={{ color: 'var(--accent-green)' }}
      >
        ← Назад
      </Link>

      {/* Product Header */}
      <div className="flex gap-6 mb-8">
        <div 
          className="w-20 h-20 rounded-[var(--radius-lg)] flex items-center justify-center text-4xl flex-shrink-0"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {product.image}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h1>
          <div className="text-sm mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {product.brand} • {product.volume} • {product.price}
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.tags.map((tag, i) => (
              <span key={i} className="tag tag-green">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Score Card */}
      <div 
        className="rounded-[var(--radius-xl)] p-6 mb-6"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ 
                background: `conic-gradient(var(--score-${getScoreClass(product.score)}) ${product.score}%, var(--bg-tertiary) 0)`,
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <span className="text-2xl font-bold">{product.score}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>/100</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">{product.verdict}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{product.verdictDesc}</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          {product.scoreFactors.map((factor) => (
            <div key={factor.name} className="flex items-center gap-3">
              <span className="w-28 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {factor.name}
              </span>
              <div className="flex-1 progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <span className="w-8 text-sm font-medium text-right">{factor.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Explanation */}
      <div className="mb-8">
        <div className="section-title">📊 Как рассчитывается оценка?</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>🧪</span>
              <span className="font-medium">Состав (30%)</span>
            </div>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>✅ Позиция активов в составе</li>
              <li>✅ Концентрация активных ингредиентов</li>
              <li>❌ Наличие потенциальных раздражителей</li>
            </ul>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>⚡</span>
              <span className="font-medium">Эффективность (30%)</span>
            </div>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>✅ Научные исследования ингредиентов</li>
              <li>✅ Концентрация в рабочем диапазоне</li>
              <li>✅ Синергия между компонентами</li>
            </ul>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>🛡️</span>
              <span className="font-medium">Безопасность (25%)</span>
            </div>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>✅ Отсутствие спорных ингредиентов</li>
              <li>✅ Низкий риск аллергии</li>
              <li>✅ Некомедогенность</li>
            </ul>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>💰</span>
              <span className="font-medium">Цена/Качество (15%)</span>
            </div>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>✅ Стоимость за мл активов</li>
              <li>✅ Сравнение с аналогами</li>
              <li>✅ Доступность в России</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Skin Match */}
      <div className="mb-8">
        <div className="section-title">👤 Подходит для твоего типа кожи</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {product.skinMatches.map((match) => (
            <div 
              key={match.type}
              className="card flex items-center gap-2 justify-center py-3"
              style={{
                background: match.match === 'yes' ? 'var(--accent-green-light)' : 
                           match.match === 'ok' ? 'var(--bg-secondary)' : 
                           'var(--accent-orange-light)',
              }}
            >
              <span>{getMatchIcon(match.match)}</span>
              <span className="text-sm">{match.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="mb-8">
        <div 
          className="rounded-[var(--radius-lg)] p-4"
          style={{ 
            background: 'var(--accent-blue-light)',
            border: '1px solid var(--accent-blue)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span>💡</span>
            <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>
              Персональная рекомендация
            </span>
          </div>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: product.recommendation }}
          />
        </div>
      </div>

      {/* Key Ingredients */}
      <div className="mb-8">
        <div className="section-title">🧪 Ключевые ингредиенты</div>
        <div className="space-y-4">
          {product.ingredients.map((ing) => (
            <div key={ing.inci} className="card-elevated p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {ing.inci}
                  </div>
                  <div className="font-medium">{ing.name}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  {ing.position}
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {ing.description}
              </p>
              {(ing.concentration || ing.ph || ing.type) && (
                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                  {ing.concentration && (
                    <div>
                      <span style={{ color: 'var(--text-tertiary)' }}>Концентрация: </span>
                      <span>{ing.concentration}</span>
                    </div>
                  )}
                  {ing.ph && (
                    <div>
                      <span style={{ color: 'var(--text-tertiary)' }}>pH: </span>
                      <span>{ing.ph}</span>
                    </div>
                  )}
                  {ing.type && (
                    <div>
                      <span style={{ color: 'var(--text-tertiary)' }}>Тип: </span>
                      <span>{ing.type}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {ing.tags.map((tag, i) => (
                  <span key={i} className={`tag tag-${tag.color}`}>{tag.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility */}
      <div className="mb-8">
        <div className="section-title">⚗️ Совместимость с другими средствами</div>
        <div className="space-y-4">
          {product.compatibility.map((compat) => (
            <div 
              key={compat.name} 
              className="card-elevated p-4"
              style={{
                borderLeft: `4px solid ${
                  compat.status === 'yes' ? 'var(--score-excellent)' :
                  compat.status === 'warn' ? 'var(--score-avg)' :
                  'var(--score-poor)'
                }`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{getCompatIcon(compat.status)}</span>
                <span className="font-medium">{compat.name}</span>
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                📦 {compat.examples}
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                <strong>Почему: </strong>{compat.why}
              </p>
              <p className="text-sm" style={{ color: 'var(--accent-green)' }}>
                💡 {compat.how}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternatives */}
      <div className="mb-8">
        <div className="section-title">🔄 Альтернативы</div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {product.alternatives.map((alt) => (
            <div 
              key={alt.name}
              className="card flex-shrink-0 p-4"
              style={{ minWidth: '200px' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`score-badge ${getScoreClass(alt.score)}`}>
                  {alt.score}
                </div>
                <div>
                  <div className="font-medium text-sm">{alt.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {alt.price}
                  </div>
                </div>
              </div>
              {alt.badge && (
                <span className="tag tag-orange">{alt.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <button className="btn btn-primary w-full">
        📥 Добавить в мою полку
      </button>
    </div>
  )
}

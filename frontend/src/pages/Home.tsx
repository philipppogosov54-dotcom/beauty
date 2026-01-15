import { Link } from 'react-router-dom'
import { MessageCircle, Calendar, Scan, Sparkles, Shield, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Home() {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Консультант',
      description: 'Получите персональные рекомендации по уходу за кожей от нашего AI-консультанта',
      link: '/chat',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Calendar,
      title: 'Планировщик Рутин',
      description: 'Создавайте и отслеживайте свои бьюти-рутины с напоминаниями',
      link: '/routines',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Scan,
      title: 'Анализатор Составов',
      description: 'Сканируйте составы косметики и узнайте о безопасности ингредиентов',
      link: '/analyzer',
      color: 'from-blue-500 to-purple-500',
    },
  ]

  const benefits = [
    {
      icon: Sparkles,
      title: 'Персонализация',
      description: 'Рекомендации на основе вашего типа кожи и предпочтений',
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Проверка составов на аллергены и потенциально опасные компоненты',
    },
    {
      icon: Clock,
      title: 'Экономия времени',
      description: 'Автоматическое планирование и напоминания о рутинах',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 lg:py-20">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 gradient-text">
          Добро пожаловать в AI Beauty Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Ваш персональный AI-консультант по красоте и уходу за кожей. 
          Получайте умные рекомендации, планируйте рутины и анализируйте составы косметики.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/chat">
            <Button>Начать консультацию</Button>
          </Link>
          <Link to="/analyzer">
            <Button variant="secondary">Проанализировать состав</Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
          Основные возможности
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link key={index} to={feature.link}>
                <Card>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
          Почему выбирают нас
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-lg mb-6 opacity-90">
            Присоединяйтесь к тысячам пользователей, которые уже доверяют AI Beauty Platform
          </p>
          <Link to="/chat">
            <Button variant="secondary" className="bg-white text-pink-600 hover:bg-gray-50">
              Попробовать бесплатно
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}

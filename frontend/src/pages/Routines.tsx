import { useState } from 'react'
import { Plus, Clock, CheckCircle, Calendar } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { Routine } from '@/types'

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      name: 'Утренняя рутина',
      type: 'morning',
      scheduled_time: '08:00',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      is_active: true,
      steps: [
        {
          id: '1-1',
          product_name: 'Очищающий гель',
          category: 'cleanser',
          order: 1,
          duration_minutes: 2,
          instructions: 'Нанести на влажное лицо, помассировать, смыть',
          is_optional: false,
        },
        {
          id: '1-2',
          product_name: 'Тоник',
          category: 'toner',
          order: 2,
          duration_minutes: 1,
          instructions: 'Нанести на ватный диск, протереть лицо',
          is_optional: false,
        },
        {
          id: '1-3',
          product_name: 'Увлажняющий крем',
          category: 'moisturizer',
          order: 3,
          duration_minutes: 2,
          instructions: 'Нанести на лицо и шею легкими массажными движениями',
          is_optional: false,
        },
        {
          id: '1-4',
          product_name: 'Солнцезащитный крем SPF 50',
          category: 'sunscreen',
          order: 4,
          duration_minutes: 1,
          instructions: 'Нанести на все открытые участки кожи',
          is_optional: false,
        },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Вечерняя рутина',
      type: 'evening',
      scheduled_time: '21:00',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      is_active: true,
      steps: [
        {
          id: '2-1',
          product_name: 'Мицеллярная вода',
          category: 'cleanser',
          order: 1,
          duration_minutes: 2,
          instructions: 'Нанести на ватный диск, очистить лицо',
          is_optional: false,
        },
        {
          id: '2-2',
          product_name: 'Сыворотка с ретинолом',
          category: 'serum',
          order: 2,
          duration_minutes: 1,
          instructions: 'Нанести на очищенную кожу, избегая области вокруг глаз',
          is_optional: true,
        },
        {
          id: '2-3',
          product_name: 'Ночной крем',
          category: 'moisturizer',
          order: 3,
          duration_minutes: 2,
          instructions: 'Нанести на лицо и шею',
          is_optional: false,
        },
      ],
      created_at: new Date().toISOString(),
    },
  ])

  const getTypeLabel = (type: string) => {
    const labels = {
      morning: 'Утро',
      evening: 'Вечер',
      weekly: 'Еженедельно',
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      morning: 'from-yellow-400 to-orange-500',
      evening: 'from-purple-400 to-pink-500',
      weekly: 'from-blue-400 to-purple-500',
    }
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Мои Рутины</h1>
          <p className="text-gray-600">Планируйте и отслеживайте свои бьюти-рутины</p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Создать рутину
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {routines.map((routine) => (
          <Card key={routine.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getTypeColor(routine.type)}`}></div>
                  <span className="text-sm text-gray-500">{getTypeLabel(routine.type)}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{routine.name}</h2>
                {routine.scheduled_time && (
                  <div className="flex items-center space-x-1 text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{routine.scheduled_time}</span>
                  </div>
                )}
              </div>
              {routine.is_active && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Активна
                </span>
              )}
            </div>

            <div className="space-y-3 mb-4">
              {routine.steps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-pink-500 flex items-center justify-center font-bold text-pink-600">
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{step.product_name}</h3>
                      <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                        {step.category}
                      </span>
                    </div>
                    {step.instructions && (
                      <p className="text-sm text-gray-600 mt-1">{step.instructions}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.duration_minutes} мин
                      </span>
                      {step.is_optional && (
                        <span className="text-orange-600">Опционально</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{routine.days_of_week.length} дней в неделю</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="py-2 px-4 text-sm">
                  Редактировать
                </Button>
                <Button className="py-2 px-4 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Выполнить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {routines.length === 0 && (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет рутин</h3>
          <p className="text-gray-600 mb-6">Создайте свою первую бьюти-рутину</p>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Создать рутину
          </Button>
        </Card>
      )}
    </div>
  )
}

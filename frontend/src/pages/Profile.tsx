import { useState } from 'react'
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Profile() {
  const { user } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skin_type: 'combination',
    age_group: '25-34',
    allergies: [] as string[],
  })

  const skinTypes = [
    { value: 'dry', label: 'Сухая' },
    { value: 'oily', label: 'Жирная' },
    { value: 'combination', label: 'Комбинированная' },
    { value: 'normal', label: 'Нормальная' },
    { value: 'sensitive', label: 'Чувствительная' },
  ]

  const ageGroups = [
    { value: '18-24', label: '18-24 года' },
    { value: '25-34', label: '25-34 года' },
    { value: '35-44', label: '35-44 года' },
    { value: '45+', label: '45+ лет' },
  ]

  const handleSave = () => {
    // Save logic here
    setEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Мой Профиль</h1>
        <p className="text-gray-600">Управляйте своими данными и настройками</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.name || 'Пользователь'}</h2>
            <p className="text-gray-600 text-sm">{user?.email}</p>
            {user?.is_verified && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ✓ Подтверждён
              </span>
            )}
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Настройки профиля</h2>
            {!editing ? (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{formData.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{formData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип кожи
              </label>
              {editing ? (
                <select
                  value={formData.skin_type}
                  onChange={(e) => setFormData({ ...formData, skin_type: e.target.value })}
                  className="input-field"
                >
                  {skinTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <span>
                    {skinTypes.find((t) => t.value === formData.skin_type)?.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Возрастная группа
              </label>
              {editing ? (
                <select
                  value={formData.age_group}
                  onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                  className="input-field"
                >
                  {ageGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>
                    {ageGroups.find((g) => g.value === formData.age_group)?.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Card */}
      <Card className="mt-6">
        <h2 className="text-xl font-bold mb-4">Статистика</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-xl">
            <div className="text-3xl font-bold text-pink-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Рутин создано</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-1">48</div>
            <div className="text-sm text-gray-600">Сообщений в чате</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-1">23</div>
            <div className="text-sm text-gray-600">Анализов составов</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-1">89%</div>
            <div className="text-sm text-gray-600">Выполнение рутин</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

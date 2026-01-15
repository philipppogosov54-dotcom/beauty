import { useState, useRef } from 'react'
import { Camera, Upload, CheckCircle, AlertTriangle, XCircle, History } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { AnalysisResult } from '@/types'

export default function Analyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setImage(imageData)
        setShowCamera(false)
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (err) {
      alert('Не удалось получить доступ к камере')
    }
  }

  const analyzeImage = async () => {
    if (!image) return

    setAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setResult({
        id: '1',
        product_name: 'Увлажняющий крем',
        brand: 'Example Brand',
        extracted_text: 'AQUA, GLYCERIN, DIMETHICONE, CETYL ALCOHOL, STEARIC ACID, PARFUM',
        parsed_ingredients: [
          {
            input_name: 'AQUA',
            matched: true,
            inci_name: 'AQUA',
            safety_level: 'safe',
            ewg_score: 1,
            functions: ['solvent'],
            concerns: [],
          },
          {
            input_name: 'GLYCERIN',
            matched: true,
            inci_name: 'GLYCERIN',
            safety_level: 'safe',
            ewg_score: 1,
            functions: ['humectant', 'moisturizer'],
            concerns: [],
          },
          {
            input_name: 'DIMETHICONE',
            matched: true,
            inci_name: 'DIMETHICONE',
            safety_level: 'safe',
            ewg_score: 3,
            functions: ['emollient'],
            concerns: [],
          },
          {
            input_name: 'PARFUM',
            matched: true,
            inci_name: 'PARFUM',
            safety_level: 'caution',
            ewg_score: 8,
            functions: ['fragrance'],
            concerns: ['Может вызывать аллергические реакции'],
          },
        ],
        overall_safety_score: 75,
        warnings: ['Содержит отдушку (PARFUM)'],
        allergen_alerts: ['PARFUM может вызывать аллергию'],
        total_ingredients: 6,
        recognized_count: 4,
        safe_count: 3,
        caution_count: 1,
        avoid_count: 0,
        created_at: new Date().toISOString(),
      })
      setAnalyzing(false)
    }, 2000)
  }

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'text-green-600 bg-green-50'
      case 'caution':
        return 'text-yellow-600 bg-yellow-50'
      case 'avoid':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getSafetyLabel = (level: string) => {
    switch (level) {
      case 'safe':
        return 'Безопасен'
      case 'caution':
        return 'Осторожно'
      case 'avoid':
        return 'Избегать'
      default:
        return 'Неизвестно'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Анализатор Составов</h1>
        <p className="text-gray-600">Сканируйте состав косметики и узнайте о безопасности ингредиентов</p>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Загрузите изображение</h2>
            {!image ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-pink-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Перетащите изображение сюда или</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-5 h-5 mr-2" />
                      Выбрать файл
                    </Button>
                    <Button variant="outline" onClick={startCamera}>
                      <Camera className="w-5 h-5 mr-2" />
                      Камера
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={image} alt="Uploaded" className="w-full h-auto" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <Button onClick={analyzeImage} className="w-full" disabled={analyzing}>
                  {analyzing ? 'Анализ...' : 'Проанализировать'}
                </Button>
              </div>
            )}
          </Card>

          {/* Camera Modal */}
          {showCamera && (
            <Card>
              <h2 className="text-xl font-bold mb-4">Камера</h2>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-xl"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex space-x-3 mt-4">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="w-5 h-5 mr-2" />
                  Сделать фото
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowCamera(false)
                    if (videoRef.current?.srcObject) {
                      const stream = videoRef.current.srcObject as MediaStream
                      stream.getTracks().forEach(track => track.stop())
                    }
                  }}
                >
                  Отмена
                </Button>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Как это работает?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Сфотографируйте состав</h3>
                  <p className="text-sm text-gray-600">
                    Используйте камеру или загрузите изображение с составом продукта
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">OCR распознавание</h3>
                  <p className="text-sm text-gray-600">
                    Наш AI распознает текст с изображения и извлекает список ингредиентов
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Анализ безопасности</h3>
                  <p className="text-sm text-gray-600">
                    Каждый ингредиент проверяется по базе данных на безопасность и аллергены
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Result Header */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{result.product_name}</h2>
                {result.brand && <p className="text-gray-600">{result.brand}</p>}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {result.overall_safety_score}/100
                </div>
                <p className="text-sm text-gray-600">Общая безопасность</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.safe_count}</div>
                <div className="text-xs text-gray-600">Безопасных</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{result.caution_count}</div>
                <div className="text-xs text-gray-600">Осторожно</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{result.avoid_count}</div>
                <div className="text-xs text-gray-600">Избегать</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {result.total_ingredients - result.recognized_count}
                </div>
                <div className="text-xs text-gray-600">Неизвестных</div>
              </div>
            </div>
          </Card>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Предупреждения</h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800">
                    {result.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Ingredients List */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Анализ ингредиентов</h2>
            <div className="space-y-3">
              {result.parsed_ingredients.map((ingredient, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{ingredient.inci_name}</h3>
                      {ingredient.input_name !== ingredient.inci_name && (
                        <p className="text-sm text-gray-500">{ingredient.input_name}</p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSafetyColor(ingredient.safety_level)}`}>
                      {getSafetyLabel(ingredient.safety_level)}
                    </div>
                  </div>
                  {ingredient.ewg_score && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-600">EWG Score:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                        <div
                          className={`h-2 rounded-full ${
                            ingredient.ewg_score <= 3
                              ? 'bg-green-500'
                              : ingredient.ewg_score <= 6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${(ingredient.ewg_score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{ingredient.ewg_score}/10</span>
                    </div>
                  )}
                  {ingredient.functions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ingredient.functions.map((func, j) => (
                        <span
                          key={j}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                        >
                          {func}
                        </span>
                      ))}
                    </div>
                  )}
                  {ingredient.concerns.length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      ⚠️ {ingredient.concerns.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button onClick={() => setResult(null)} className="flex-1">
              Новый анализ
            </Button>
            <Button variant="secondary">
              <History className="w-5 h-5 mr-2" />
              История
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

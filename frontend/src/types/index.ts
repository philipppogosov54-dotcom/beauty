export interface User {
  id: string
  email: string
  name: string
  is_verified: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Routine {
  id: string
  name: string
  type: 'morning' | 'evening' | 'weekly'
  scheduled_time?: string
  days_of_week: number[]
  is_active: boolean
  steps: RoutineStep[]
  created_at: string
}

export interface RoutineStep {
  id: string
  product_name: string
  category: string
  order: number
  duration_minutes: number
  instructions?: string
  is_optional: boolean
}

export interface Ingredient {
  id: string
  inci_name: string
  common_names_ru: string[]
  safety_level: 'safe' | 'caution' | 'avoid'
  ewg_score?: number
  functions: string[]
  concerns: string[]
  description?: string
}

export interface AnalysisResult {
  id: string
  product_name?: string
  brand?: string
  extracted_text?: string
  parsed_ingredients: ParsedIngredient[]
  overall_safety_score: number
  warnings: string[]
  allergen_alerts: string[]
  total_ingredients: number
  recognized_count: number
  safe_count: number
  caution_count: number
  avoid_count: number
  created_at: string
}

export interface ParsedIngredient {
  input_name: string
  matched: boolean
  inci_name: string
  safety_level: string
  ewg_score?: number
  functions: string[]
  concerns: string[]
}

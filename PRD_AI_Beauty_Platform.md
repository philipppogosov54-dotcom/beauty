# Product Requirements Document (PRD)
# AI Beauty Platform — Техническое задание

**Версия:** 1.0  
**Дата:** 13 января 2026  
**Автор:** CTO  
**Статус:** Draft  

---

## 1. Executive Summary

### 1.1. Описание продукта
Веб-платформа (PWA), объединяющая три ключевых модуля:
- **AI Beauty Consultant** — интеллектуальный чат-бот консультант
- **Beauty Routine Planner** — планировщик бьюти-рутин с трекингом
- **Ingredient Analyzer** — анализатор составов косметических средств

### 1.2. Тип приложения
Progressive Web Application (PWA) с возможностью установки на мобильные устройства и десктоп.

### 1.3. Инфраструктура
Полностью отечественная инфраструктура на базе **TimeWeb Cloud** с соблюдением требований 152-ФЗ о персональных данных.

---

## 2. Системная архитектура

### 2.1. Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              КЛИЕНТСКИЙ УРОВЕНЬ                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PWA (React + TypeScript)                          │   │
│  │   ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐   │   │
│  │   │  Consultant  │ │   Planner    │ │   Ingredient Analyzer    │   │   │
│  │   │    Module    │ │    Module    │ │         Module           │   │   │
│  │   └──────────────┘ └──────────────┘ └──────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                         (Nginx + Rate Limiting)                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND SERVICES                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Auth Service  │  │   API Service   │  │      AI Orchestrator        │ │
│  │   (FastAPI)     │  │   (FastAPI)     │  │        (FastAPI)            │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │ Routine Service │  │Ingredient Svc   │  │   Notification Service      │ │
│  │   (FastAPI)     │  │  (FastAPI)      │  │        (FastAPI)            │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   PostgreSQL    │  │     Redis       │  │       S3 Storage            │ │
│  │  (Primary DB)   │  │    (Cache)      │  │   (TimeWeb Object Storage)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐                                   │
│  │  Elasticsearch  │  │   ClickHouse    │                                   │
│  │   (Search)      │  │  (Analytics)    │                                   │
│  └─────────────────┘  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AI/ML LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    GigaChat API (Сбер)                               │   │
│  │                    YandexGPT API                                     │   │
│  │                    Custom ML Models (PyTorch)                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2. Архитектурный паттерн
**Modular Monolith** с возможностью эволюции в микросервисы.

Обоснование:
- Быстрый time-to-market для MVP
- Упрощённый деплой и мониторинг
- Единая кодовая база на начальном этапе
- Чёткие границы модулей для будущего разделения

### 2.3. Модульная структура Backend

```
ai-beauty-platform/
├── src/
│   ├── core/                    # Ядро приложения
│   │   ├── config/              # Конфигурация
│   │   ├── database/            # Подключение к БД
│   │   ├── security/            # Безопасность, шифрование
│   │   ├── middleware/          # Middleware
│   │   └── exceptions/          # Кастомные исключения
│   │
│   ├── modules/
│   │   ├── auth/                # Модуль аутентификации
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   └── schemas/
│   │   │
│   │   ├── users/               # Модуль пользователей
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   └── schemas/
│   │   │
│   │   ├── consultant/          # AI Beauty Consultant
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   │   ├── chat_service.py
│   │   │   │   ├── knowledge_base.py
│   │   │   │   └── recommendation_engine.py
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   └── prompts/         # System prompts для LLM
│   │   │
│   │   ├── planner/             # Beauty Routine Planner
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   │   ├── routine_service.py
│   │   │   │   ├── product_tracker.py
│   │   │   │   ├── reminder_service.py
│   │   │   │   └── calendar_service.py
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   └── schemas/
│   │   │
│   │   ├── analyzer/            # Ingredient Analyzer
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   │   ├── ocr_service.py
│   │   │   │   ├── ingredient_parser.py
│   │   │   │   ├── safety_analyzer.py
│   │   │   │   └── compatibility_engine.py
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   └── ml_models/       # Предобученные модели
│   │   │
│   │   ├── products/            # Каталог продуктов
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   └── schemas/
│   │   │
│   │   ├── notifications/       # Уведомления
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   │   ├── push_service.py
│   │   │   │   ├── email_service.py
│   │   │   │   └── telegram_service.py
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   └── schemas/
│   │   │
│   │   └── social/              # Социальные функции
│   │       ├── api/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── models/
│   │       └── schemas/
│   │
│   ├── shared/                  # Общие компоненты
│   │   ├── utils/
│   │   ├── constants/
│   │   └── types/
│   │
│   └── main.py                  # Точка входа
│
├── tests/
├── migrations/
├── scripts/
├── docker/
└── docs/
```

---

## 3. Технологический стек

### 3.1. Frontend

| Компонент | Технология | Версия | Обоснование |
|-----------|------------|--------|-------------|
| **Framework** | React | 18.x | Широкая экосистема, производительность |
| **Language** | TypeScript | 5.x | Типизация, надёжность кода |
| **State Management** | Zustand | 4.x | Легковесность, простота |
| **API Client** | TanStack Query | 5.x | Кэширование, оптимистичные обновления |
| **Styling** | Tailwind CSS | 3.x | Utility-first, быстрая разработка |
| **Build Tool** | Vite | 5.x | Скорость сборки |
| **PWA** | Workbox | 7.x | Service Workers, офлайн |
| **Forms** | React Hook Form | 7.x | Производительные формы |
| **Validation** | Zod | 3.x | Runtime валидация схем |
| **Camera/OCR** | react-webcam | 7.x | Доступ к камере для сканирования |
| **Charts** | Recharts | 2.x | Визуализация прогресса |

### 3.2. Backend

| Компонент | Технология | Версия | Обоснование |
|-----------|------------|--------|-------------|
| **Framework** | FastAPI | 0.109.x | Высокая производительность, автодокументация |
| **Language** | Python | 3.12 | Зрелая ML экосистема |
| **ASGI Server** | Uvicorn | 0.27.x | Асинхронность, производительность |
| **ORM** | SQLAlchemy | 2.x | Async поддержка, гибкость |
| **Migrations** | Alembic | 1.13.x | Версионирование схемы БД |
| **Validation** | Pydantic | 2.x | Строгая типизация данных |
| **Task Queue** | Celery | 5.x | Фоновые задачи |
| **Message Broker** | Redis | 7.x | Pub/Sub, очереди |
| **HTTP Client** | httpx | 0.27.x | Async HTTP запросы |
| **WebSocket** | python-socketio | 5.x | Real-time чат |

### 3.3. AI/ML

| Компонент | Технология | Обоснование |
|-----------|------------|-------------|
| **LLM Primary** | GigaChat API (Сбер) | Отечественный LLM, ГОСТ-совместимость |
| **LLM Fallback** | YandexGPT API | Резервный LLM |
| **OCR** | Yandex Vision API | Распознавание текста на русском |
| **ML Framework** | PyTorch | 2.x | Кастомные модели |
| **Embeddings** | sentence-transformers | Векторизация для RAG |
| **Vector DB** | pgvector (PostgreSQL) | Векторный поиск |
| **Model Serving** | ONNX Runtime | Инференс оптимизированных моделей |

### 3.4. Базы данных

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **Primary DB** | PostgreSQL 16 | Основное хранилище данных |
| **Cache** | Redis 7 | Кэширование, сессии, очереди |
| **Search** | Elasticsearch 8 | Полнотекстовый поиск ингредиентов |
| **Analytics** | ClickHouse | Аналитика, метрики |
| **Vector Store** | pgvector | Хранение эмбеддингов для RAG |

### 3.5. Инфраструктура (TimeWeb Cloud)

| Компонент | Сервис TimeWeb | Спецификация |
|-----------|----------------|--------------|
| **Compute** | Cloud Servers | 4 vCPU, 8GB RAM, NVMe SSD |
| **Kubernetes** | Managed Kubernetes | 3 worker nodes |
| **Database** | Managed PostgreSQL | HA конфигурация, 100GB |
| **Cache** | Managed Redis | Cluster mode, 4GB |
| **Object Storage** | S3-compatible | Для изображений, файлов |
| **CDN** | TimeWeb CDN | Статика, медиа |
| **DNS** | TimeWeb DNS | Управление доменами |
| **SSL** | Let's Encrypt | Автоматическое обновление |
| **Backup** | TimeWeb Backup | Ежедневные бэкапы |

### 3.6. DevOps & CI/CD

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **Containerization** | Docker | Контейнеризация сервисов |
| **Orchestration** | Kubernetes (K8s) | Оркестрация контейнеров |
| **CI/CD** | GitLab CI | Pipeline автоматизация |
| **Registry** | GitLab Registry | Хранение Docker образов |
| **IaC** | Terraform | Инфраструктура как код |
| **Secrets** | HashiCorp Vault | Управление секретами |
| **Monitoring** | Prometheus + Grafana | Метрики и дашборды |
| **Logging** | Loki + Promtail | Централизованные логи |
| **Tracing** | Jaeger | Распределённая трассировка |
| **APM** | Sentry | Мониторинг ошибок |

---

## 4. Детализация модулей

### 4.1. AI Beauty Consultant Module

#### 4.1.1. Архитектура чат-бота

```
┌─────────────────────────────────────────────────────────────────┐
│                        Chat Interface                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Message Handler                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Intent     │  │  Context    │  │     Entity              │ │
│  │  Classifier │  │  Manager    │  │     Extractor           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RAG Pipeline                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Query → Embedding → Vector Search → Context Retrieval   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLM Orchestrator                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  GigaChat   │  │  YandexGPT  │  │     Response            │ │
│  │   Primary   │  │   Fallback  │  │     Formatter           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Recommendation Engine (ML)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  User Profile + Context → Product/Routine Suggestions    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.1.2. База знаний (Knowledge Base)

Структура базы знаний для RAG:

```python
# Категории знаний
KNOWLEDGE_CATEGORIES = [
    "ingredients",           # Информация об ингредиентах
    "skin_types",           # Типы кожи и их особенности
    "skin_conditions",      # Проблемы кожи
    "product_categories",   # Категории косметики
    "application_methods",  # Методы нанесения
    "routines",            # Готовые рутины ухода
    "trends",              # Бьюти-тренды
    "brands",              # Информация о брендах
    "faq",                 # Частые вопросы
]
```

#### 4.1.3. Интенты чат-бота

```python
CHAT_INTENTS = {
    "product_recommendation": "Рекомендация продуктов",
    "ingredient_question": "Вопрос об ингредиентах",
    "routine_help": "Помощь с рутиной",
    "skin_concern": "Проблема с кожей",
    "product_comparison": "Сравнение продуктов",
    "application_guide": "Инструкция по применению",
    "budget_optimization": "Оптимизация бюджета",
    "allergy_check": "Проверка на аллергены",
    "general_question": "Общий вопрос",
    "small_talk": "Разговор",
}
```

#### 4.1.4. Конфигурация LLM

```python
LLM_CONFIG = {
    "gigachat": {
        "model": "GigaChat-Pro",
        "max_tokens": 2048,
        "temperature": 0.7,
        "timeout": 30,
        "retry_attempts": 3,
    },
    "yandexgpt": {
        "model": "yandexgpt-lite",
        "max_tokens": 2000,
        "temperature": 0.6,
        "timeout": 30,
        "retry_attempts": 3,
    },
    "fallback_strategy": "primary_first",  # или "load_balance"
}
```

### 4.2. Beauty Routine Planner Module

#### 4.2.1. Структура рутины

```python
from enum import Enum
from datetime import time
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class RoutineType(Enum):
    MORNING = "morning"
    EVENING = "evening"
    WEEKLY = "weekly"
    CUSTOM = "custom"

class RoutineStep(BaseModel):
    id: UUID
    order: int
    product_id: Optional[UUID]
    product_name: str
    category: str  # cleanser, toner, serum, moisturizer, sunscreen, etc.
    duration_minutes: int
    instructions: str
    is_optional: bool = False
    days_of_week: list[int] = [0, 1, 2, 3, 4, 5, 6]  # 0 = Monday

class Routine(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    type: RoutineType
    steps: list[RoutineStep]
    scheduled_time: time
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
```

#### 4.2.2. Трекинг продуктов

```python
class ProductUsage(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    opened_date: date
    expected_expiry: date  # PAO (Period After Opening)
    usage_rate: float  # 0.0 - 1.0 (процент использования)
    last_used: datetime
    estimated_remaining_days: int
    cost_per_use: Decimal

class ProductAlert(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    alert_type: str  # "expiry_warning", "low_stock", "repurchase_reminder"
    scheduled_date: date
    is_sent: bool = False
```

#### 4.2.3. Система напоминаний

```python
class ReminderConfig(BaseModel):
    routine_reminder_offset: int = 15  # минут до рутины
    expiry_warning_days: int = 30      # дней до истечения
    low_stock_threshold: float = 0.2   # 20% остатка
    channels: list[str] = ["push", "email"]  # Каналы уведомлений
```

#### 4.2.4. Интеграция с календарём

```python
class CalendarEvent(BaseModel):
    id: UUID
    user_id: UUID
    routine_id: UUID
    title: str
    start_time: datetime
    end_time: datetime
    recurrence_rule: Optional[str]  # RRULE формат
    reminder_minutes: list[int] = [15, 5]
```

### 4.3. Ingredient Analyzer Module

#### 4.3.1. Пайплайн анализа

```
┌─────────────────────────────────────────────────────────────────┐
│                      Image Input                                 │
│              (Camera / Gallery / URL)                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Image Preprocessing                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Resize    │  │  Contrast   │  │      Deskew             │ │
│  │             │  │  Enhance    │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OCR (Yandex Vision)                           │
│                    Извлечение текста                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Ingredient Parser                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  NLP → Tokenization → Entity Recognition → Normalization │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database Lookup                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Ingredient → CosIng/EWG/Internal DB → Safety Data       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Analysis Engine                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Safety    │  │Compatibility│  │      Allergen           │ │
│  │   Score     │  │   Check     │  │      Detection          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Report Generator                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Summary + Details + Recommendations + Alternatives      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.3.2. Схема ингредиента

```python
class IngredientSafetyLevel(Enum):
    SAFE = "safe"           # Безопасен
    CAUTION = "caution"     # Требует внимания
    AVOID = "avoid"         # Лучше избегать
    DANGEROUS = "dangerous" # Опасен

class IngredientFunction(Enum):
    MOISTURIZER = "moisturizer"
    PRESERVATIVE = "preservative"
    FRAGRANCE = "fragrance"
    SURFACTANT = "surfactant"
    EMULSIFIER = "emulsifier"
    ANTIOXIDANT = "antioxidant"
    EXFOLIANT = "exfoliant"
    SUNSCREEN = "sunscreen"
    COLORANT = "colorant"
    PH_ADJUSTER = "ph_adjuster"
    # ... и другие

class Ingredient(BaseModel):
    id: UUID
    inci_name: str                    # Международное название
    common_names: list[str]           # Общие названия (RU, EN)
    cas_number: Optional[str]         # CAS номер
    ec_number: Optional[str]          # EC номер
    functions: list[IngredientFunction]
    safety_level: IngredientSafetyLevel
    ewg_score: Optional[int]          # 1-10 шкала EWG
    cosing_ref: Optional[str]         # Ссылка на CosIng
    description: str
    concerns: list[str]               # Потенциальные проблемы
    benefits: list[str]               # Преимущества
    is_vegan: bool
    is_natural: bool
    comedogenic_rating: Optional[int] # 0-5
    irritation_potential: Optional[int] # 0-5
    allergen_flags: list[str]         # Типы аллергий
    incompatible_with: list[str]      # Несовместимые ингредиенты
    best_with: list[str]              # Хорошо сочетается с
    concentration_range: Optional[str] # Рекомендуемая концентрация
    regulatory_notes: Optional[str]   # Регуляторные ограничения
```

#### 4.3.3. Результат анализа

```python
class AnalysisResult(BaseModel):
    id: UUID
    user_id: UUID
    product_name: Optional[str]
    brand: Optional[str]
    original_image_url: str
    extracted_text: str
    ingredients: list[ParsedIngredient]
    overall_safety_score: float  # 0-100
    safety_breakdown: dict[str, int]  # По категориям
    allergen_warnings: list[str]
    user_specific_warnings: list[str]  # На основе профиля
    compatibility_issues: list[str]
    highlighted_ingredients: list[str]  # Особо активные
    recommendations: list[str]
    alternative_products: list[UUID]  # ID альтернативных продуктов
    created_at: datetime
```

---

## 5. API Specification

### 5.1. API Design Principles

- **RESTful** для CRUD операций
- **WebSocket** для real-time (чат)
- **GraphQL** опционально для сложных запросов (Phase 2)
- **Versioning**: `/api/v1/`
- **Response format**: JSON
- **Authentication**: JWT + Refresh Token
- **Rate Limiting**: Token Bucket algorithm

### 5.2. Основные эндпоинты

#### Authentication

```
POST   /api/v1/auth/register        # Регистрация
POST   /api/v1/auth/login           # Вход
POST   /api/v1/auth/logout          # Выход
POST   /api/v1/auth/refresh         # Обновление токена
POST   /api/v1/auth/password/reset  # Сброс пароля
POST   /api/v1/auth/verify-email    # Подтверждение email
GET    /api/v1/auth/me              # Текущий пользователь
```

#### User Profile

```
GET    /api/v1/users/profile              # Получить профиль
PUT    /api/v1/users/profile              # Обновить профиль
PUT    /api/v1/users/profile/skin         # Обновить данные о коже
PUT    /api/v1/users/profile/allergies    # Обновить аллергии
PUT    /api/v1/users/profile/preferences  # Обновить предпочтения
DELETE /api/v1/users/profile              # Удалить аккаунт
```

#### AI Consultant

```
WS     /api/v1/consultant/chat            # WebSocket чат
POST   /api/v1/consultant/message         # Отправить сообщение (fallback)
GET    /api/v1/consultant/history         # История чата
GET    /api/v1/consultant/suggestions     # Предложенные вопросы
POST   /api/v1/consultant/feedback        # Оценка ответа
```

#### Routine Planner

```
GET    /api/v1/routines                   # Список рутин
POST   /api/v1/routines                   # Создать рутину
GET    /api/v1/routines/{id}              # Получить рутину
PUT    /api/v1/routines/{id}              # Обновить рутину
DELETE /api/v1/routines/{id}              # Удалить рутину
POST   /api/v1/routines/{id}/complete     # Отметить выполнение
GET    /api/v1/routines/suggestions       # AI-рекомендации рутин
POST   /api/v1/routines/generate          # Сгенерировать рутину AI

GET    /api/v1/products/tracked           # Отслеживаемые продукты
POST   /api/v1/products/track             # Начать отслеживание
PUT    /api/v1/products/{id}/usage        # Обновить использование
GET    /api/v1/products/{id}/stats        # Статистика продукта

GET    /api/v1/calendar                   # Календарь рутин
GET    /api/v1/reminders                  # Напоминания
PUT    /api/v1/reminders/{id}             # Обновить напоминание
```

#### Ingredient Analyzer

```
POST   /api/v1/analyzer/scan              # Сканировать изображение
POST   /api/v1/analyzer/text              # Анализ текста состава
GET    /api/v1/analyzer/history           # История сканирований
GET    /api/v1/analyzer/{id}              # Результат анализа

GET    /api/v1/ingredients                # Поиск ингредиентов
GET    /api/v1/ingredients/{id}           # Информация об ингредиенте
GET    /api/v1/ingredients/compare        # Сравнение ингредиентов
POST   /api/v1/ingredients/compatibility  # Проверка совместимости
```

#### Products Catalog

```
GET    /api/v1/catalog/products           # Каталог продуктов
GET    /api/v1/catalog/products/{id}      # Информация о продукте
GET    /api/v1/catalog/categories         # Категории
GET    /api/v1/catalog/brands             # Бренды
GET    /api/v1/catalog/search             # Поиск продуктов
```

#### Social Features

```
GET    /api/v1/social/routines/shared     # Публичные рутины
POST   /api/v1/social/routines/{id}/share # Поделиться рутиной
POST   /api/v1/social/routines/{id}/copy  # Скопировать рутину
GET    /api/v1/social/bloggers            # Блогеры
POST   /api/v1/social/bloggers/{id}/follow # Подписаться
```

### 5.3. WebSocket Events (Chat)

```python
# Client → Server
{
    "event": "message",
    "data": {
        "content": "Какой крем подойдёт для сухой кожи?",
        "attachments": []
    }
}

# Server → Client
{
    "event": "message_start",
    "data": {
        "message_id": "uuid"
    }
}

{
    "event": "message_chunk",  # Streaming response
    "data": {
        "message_id": "uuid",
        "chunk": "Для сухой кожи рекомендую..."
    }
}

{
    "event": "message_end",
    "data": {
        "message_id": "uuid",
        "recommendations": [...],
        "sources": [...]
    }
}

{
    "event": "typing",
    "data": {
        "is_typing": true
    }
}
```

### 5.4. Error Response Format

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Ошибка валидации данных",
        "details": [
            {
                "field": "email",
                "message": "Некорректный формат email"
            }
        ],
        "request_id": "req_abc123",
        "timestamp": "2026-01-13T10:00:00Z"
    }
}
```

### 5.5. Rate Limiting

```python
RATE_LIMITS = {
    "default": {
        "requests": 100,
        "window": 60,  # секунд
    },
    "auth": {
        "requests": 10,
        "window": 60,
    },
    "consultant_chat": {
        "requests": 30,
        "window": 60,
    },
    "analyzer_scan": {
        "requests": 20,
        "window": 60,
    },
    "premium": {
        "requests": 500,
        "window": 60,
    },
}
```

---

## 6. Database Schema

### 6.1. ER Diagram (Core Entities)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│      users       │────<│   user_profiles  │     │   user_allergies │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │────<│ id (PK)          │
│ email            │     │ user_id (FK)     │     │ user_id (FK)     │
│ password_hash    │     │ skin_type        │     │ ingredient_id (FK)│
│ is_verified      │     │ skin_concerns    │     │ severity         │
│ is_premium       │     │ age_group        │     └──────────────────┘
│ created_at       │     │ preferences      │
│ updated_at       │     └──────────────────┘
└──────────────────┘
         │
         │
         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    routines      │────<│  routine_steps   │────>│    products      │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │     │ id (PK)          │
│ user_id (FK)     │     │ routine_id (FK)  │     │ name             │
│ name             │     │ product_id (FK)  │     │ brand_id (FK)    │
│ type             │     │ order            │     │ category_id (FK) │
│ scheduled_time   │     │ duration         │     │ ingredients      │
│ is_active        │     │ instructions     │     │ description      │
│ created_at       │     └──────────────────┘     │ image_url        │
└──────────────────┘                              │ price            │
         │                                        └──────────────────┘
         │                                                 │
         ▼                                                 │
┌──────────────────┐     ┌──────────────────┐             │
│routine_completions│    │  product_usages  │<────────────┘
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ routine_id (FK)  │     │ user_id (FK)     │
│ user_id (FK)     │     │ product_id (FK)  │
│ completed_at     │     │ opened_date      │
│ skipped_steps    │     │ usage_rate       │
└──────────────────┘     │ last_used        │
                         └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  chat_sessions   │────<│  chat_messages   │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ user_id (FK)     │     │ session_id (FK)  │
│ started_at       │     │ role             │
│ ended_at         │     │ content          │
│ context          │     │ metadata         │
└──────────────────┘     │ created_at       │
                         └──────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   ingredients    │────<│product_ingredients│───>│ analysis_results │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ product_id (FK)  │     │ id (PK)          │
│ inci_name        │     │ ingredient_id (FK)│    │ user_id (FK)     │
│ common_names     │     │ concentration    │     │ image_url        │
│ safety_level     │     │ order            │     │ extracted_text   │
│ ewg_score        │     └──────────────────┘     │ parsed_ingredients│
│ functions        │                              │ safety_score     │
│ concerns         │                              │ warnings         │
│ embedding (vector)│                             │ created_at       │
└──────────────────┘                              └──────────────────┘
```

### 6.2. Индексы

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Routines
CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_routines_type ON routines(type);
CREATE INDEX idx_routine_steps_routine_id ON routine_steps(routine_id);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_name_gin ON products USING gin(name gin_trgm_ops);

-- Ingredients (with vector index for similarity search)
CREATE INDEX idx_ingredients_inci_name ON ingredients(inci_name);
CREATE INDEX idx_ingredients_embedding ON ingredients USING ivfflat (embedding vector_cosine_ops);

-- Chat
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Analysis
CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
```

### 6.3. Миграции

Используем Alembic с версионированием:

```
migrations/
├── versions/
│   ├── 001_initial_schema.py
│   ├── 002_add_user_profiles.py
│   ├── 003_add_routines.py
│   ├── 004_add_ingredients.py
│   ├── 005_add_chat_tables.py
│   ├── 006_add_vector_extension.py
│   └── ...
├── env.py
└── alembic.ini
```

---

## 7. Безопасность

### 7.1. Authentication & Authorization

```python
# JWT Configuration
JWT_CONFIG = {
    "algorithm": "RS256",
    "access_token_expire": 900,       # 15 минут
    "refresh_token_expire": 2592000,  # 30 дней
    "issuer": "ai-beauty-platform",
}

# Roles & Permissions
ROLES = {
    "user": ["read:own", "write:own"],
    "premium": ["read:own", "write:own", "premium:features"],
    "admin": ["read:all", "write:all", "admin:*"],
}
```

### 7.2. Data Encryption

```python
# Шифрование персональных данных
ENCRYPTION_CONFIG = {
    "algorithm": "AES-256-GCM",
    "key_rotation_days": 90,
    "encrypted_fields": [
        "user_profiles.medical_data",
        "user_allergies.details",
        "analysis_results.extracted_text",
    ],
}
```

### 7.3. Security Headers

```python
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; ...",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}
```

### 7.4. Compliance (152-ФЗ)

```yaml
# Требования 152-ФЗ
data_localization:
  - Все персональные данные хранятся на территории РФ (TimeWeb Cloud)
  - Резервные копии только на территории РФ

consent_management:
  - Явное согласие на обработку ПД при регистрации
  - Возможность отзыва согласия
  - Журналирование изменений согласий

data_subject_rights:
  - Право на доступ к данным (экспорт)
  - Право на удаление (GDPR-style)
  - Право на исправление

security_measures:
  - Шифрование данных at-rest и in-transit
  - Разграничение доступа (RBAC)
  - Журналирование доступа к ПД
  - Регулярный аудит безопасности
```

### 7.5. API Security

```python
# Input Validation
VALIDATION_RULES = {
    "max_request_size": "10MB",
    "max_file_size": "5MB",
    "allowed_image_types": ["image/jpeg", "image/png", "image/webp"],
    "sanitize_html": True,
    "sql_injection_protection": True,
}

# Rate Limiting per IP
IP_RATE_LIMITS = {
    "requests_per_minute": 60,
    "ban_threshold": 1000,  # requests per minute to trigger ban
    "ban_duration": 3600,   # seconds
}
```

---

## 8. Инфраструктура и DevOps

### 8.1. Kubernetes Architecture (TimeWeb Managed K8s)

```yaml
# Namespace structure
namespaces:
  - production
  - staging
  - development

# Deployments
deployments:
  api:
    replicas: 3
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
      limits:
        cpu: "2000m"
        memory: "4Gi"
    autoscaling:
      min: 2
      max: 10
      cpu_threshold: 70%

  worker:
    replicas: 2
    resources:
      requests:
        cpu: "250m"
        memory: "512Mi"
      limits:
        cpu: "1000m"
        memory: "2Gi"

  ml-service:
    replicas: 2
    resources:
      requests:
        cpu: "1000m"
        memory: "2Gi"
      limits:
        cpu: "4000m"
        memory: "8Gi"
```

### 8.2. CI/CD Pipeline (GitLab CI)

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - security
  - build
  - deploy

variables:
  DOCKER_REGISTRY: registry.gitlab.com/aibeauty

lint:
  stage: lint
  script:
    - ruff check .
    - mypy src/
    - eslint frontend/

test:
  stage: test
  script:
    - pytest --cov=src tests/
    - npm run test -- --coverage
  coverage: '/TOTAL.*\s+(\d+%)/'

security:
  stage: security
  script:
    - bandit -r src/
    - safety check
    - trivy image $DOCKER_REGISTRY/api:$CI_COMMIT_SHA

build:
  stage: build
  script:
    - docker build -t $DOCKER_REGISTRY/api:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/api:$CI_COMMIT_SHA

deploy_staging:
  stage: deploy
  environment: staging
  script:
    - kubectl apply -f k8s/staging/
  only:
    - develop

deploy_production:
  stage: deploy
  environment: production
  script:
    - kubectl apply -f k8s/production/
  when: manual
  only:
    - main
```

### 8.3. Мониторинг

```yaml
# Prometheus metrics
metrics:
  system:
    - cpu_usage
    - memory_usage
    - disk_io
    - network_io

  application:
    - http_requests_total
    - http_request_duration_seconds
    - http_response_size_bytes
    - active_websocket_connections

  business:
    - user_registrations_total
    - chat_messages_total
    - ingredient_scans_total
    - routine_completions_total
    - llm_requests_total
    - llm_tokens_used

  ml:
    - ocr_accuracy_rate
    - llm_response_time
    - ingredient_parse_success_rate

# Alerts
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    severity: critical

  - name: HighLatency
    condition: p99_latency > 3s
    severity: warning

  - name: LLMServiceDown
    condition: llm_health_check == 0
    severity: critical

  - name: DatabaseConnectionsHigh
    condition: db_connections > 80%
    severity: warning
```

### 8.4. Logging

```python
# Structured logging configuration
LOGGING_CONFIG = {
    "format": "json",
    "level": "INFO",
    "fields": [
        "timestamp",
        "level",
        "logger",
        "message",
        "request_id",
        "user_id",
        "trace_id",
        "span_id",
    ],
    "sensitive_fields_mask": [
        "password",
        "token",
        "authorization",
        "cookie",
    ],
}
```

### 8.5. Backup Strategy

```yaml
# TimeWeb Backup Configuration
backups:
  postgresql:
    type: continuous  # WAL archiving
    retention: 30 days
    point_in_time_recovery: true
    schedule: "0 2 * * *"  # Daily at 2 AM

  redis:
    type: rdb_snapshot
    schedule: "0 */6 * * *"  # Every 6 hours
    retention: 7 days

  s3_storage:
    type: cross_region_replication
    destination: timeweb-backup-bucket
    lifecycle: 90 days

  secrets:
    type: encrypted_backup
    schedule: "0 0 * * 0"  # Weekly
    storage: separate_encrypted_bucket
```

---

## 9. Интеграции

### 9.1. AI/ML API Интеграции

```python
# GigaChat Integration
GIGACHAT_CONFIG = {
    "base_url": "https://gigachat.devices.sberbank.ru/api/v1",
    "auth_url": "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    "scope": "GIGACHAT_API_PERS",  # или GIGACHAT_API_CORP для бизнеса
    "model": "GigaChat-Pro",
    "timeout": 30,
    "max_retries": 3,
}

# YandexGPT Integration
YANDEXGPT_CONFIG = {
    "base_url": "https://llm.api.cloud.yandex.net/foundationModels/v1",
    "folder_id": "${YANDEX_FOLDER_ID}",
    "model_uri": "gpt://${YANDEX_FOLDER_ID}/yandexgpt-lite",
    "timeout": 30,
}

# Yandex Vision (OCR)
YANDEX_VISION_CONFIG = {
    "base_url": "https://vision.api.cloud.yandex.net/vision/v1",
    "folder_id": "${YANDEX_FOLDER_ID}",
    "features": ["TEXT_DETECTION"],
    "language_hints": ["ru", "en"],
}
```

### 9.2. Notification Services

```python
# Email (отечественные сервисы)
EMAIL_CONFIG = {
    "provider": "unisender",  # или sendpulse
    "api_url": "https://api.unisender.com/ru/api",
    "from_email": "noreply@aibeauty.ru",
    "templates": {
        "welcome": "template_id_1",
        "password_reset": "template_id_2",
        "routine_reminder": "template_id_3",
        "product_expiry": "template_id_4",
    },
}

# Push Notifications
PUSH_CONFIG = {
    "provider": "firebase",  # Web Push через FCM
    "vapid_key": "${VAPID_PUBLIC_KEY}",
}

# Telegram Bot (опционально)
TELEGRAM_CONFIG = {
    "bot_token": "${TELEGRAM_BOT_TOKEN}",
    "webhook_url": "https://api.aibeauty.ru/webhooks/telegram",
}
```

### 9.3. Payment Integration (для Premium подписки)

```python
# ЮKassa (бывшие Яндекс.Деньги)
YOOKASSA_CONFIG = {
    "shop_id": "${YOOKASSA_SHOP_ID}",
    "secret_key": "${YOOKASSA_SECRET_KEY}",
    "return_url": "https://aibeauty.ru/payment/success",
    "webhook_url": "https://api.aibeauty.ru/webhooks/payment",
}

# Тарифы
SUBSCRIPTION_PLANS = {
    "premium_monthly": {
        "price": 799,  # рублей
        "currency": "RUB",
        "interval": "month",
    },
    "premium_yearly": {
        "price": 6990,
        "currency": "RUB",
        "interval": "year",
        "discount": "27%",
    },
}
```

### 9.4. Analytics

```python
# Yandex Metrika
YANDEX_METRIKA_CONFIG = {
    "counter_id": "${YANDEX_METRIKA_ID}",
    "webvisor": True,
    "track_links": True,
    "accurate_bounce": True,
}

# Internal Analytics (ClickHouse)
ANALYTICS_EVENTS = [
    "user_registered",
    "user_login",
    "chat_message_sent",
    "routine_created",
    "routine_completed",
    "ingredient_scanned",
    "product_tracked",
    "subscription_started",
    "subscription_cancelled",
]
```

---

## 10. Performance Requirements

### 10.1. SLA/SLO

| Метрика | Target | Critical |
|---------|--------|----------|
| Uptime | 99.9% | 99.5% |
| API Response Time (p50) | < 200ms | < 500ms |
| API Response Time (p99) | < 1s | < 3s |
| LLM Response Time | < 5s | < 10s |
| OCR Processing Time | < 3s | < 8s |
| Error Rate | < 0.1% | < 1% |

### 10.2. Capacity Planning

```yaml
# Ожидаемая нагрузка (Year 1)
expected_load:
  daily_active_users: 5000
  concurrent_users: 500
  requests_per_second: 50
  chat_messages_per_day: 10000
  scans_per_day: 5000

# Ресурсы
resources:
  api_servers: 3
  worker_servers: 2
  ml_servers: 2
  database_size: 100GB
  s3_storage: 500GB
  redis_memory: 4GB
```

### 10.3. Caching Strategy

```python
CACHE_CONFIG = {
    "default_ttl": 3600,  # 1 час

    "strategies": {
        "user_profile": {
            "ttl": 300,  # 5 минут
            "invalidation": "on_update",
        },
        "ingredients": {
            "ttl": 86400,  # 24 часа
            "invalidation": "on_admin_update",
        },
        "products": {
            "ttl": 3600,  # 1 час
            "invalidation": "scheduled",
        },
        "chat_context": {
            "ttl": 1800,  # 30 минут
            "storage": "redis",
        },
        "llm_responses": {
            "ttl": 86400,  # Кэширование похожих вопросов
            "similarity_threshold": 0.95,
        },
    },
}
```

---

## 11. Roadmap

### Phase 1: MVP (3 месяца)

**Month 1:**
- [ ] Настройка инфраструктуры TimeWeb Cloud
- [ ] Базовая архитектура Backend (FastAPI)
- [ ] Аутентификация и авторизация
- [ ] Базовый Frontend (React PWA)
- [ ] Интеграция с GigaChat (базовый чат)

**Month 2:**
- [ ] AI Consultant: RAG pipeline
- [ ] База знаний ингредиентов (1000+ записей)
- [ ] Ingredient Analyzer: OCR + базовый парсинг
- [ ] Beauty Routine Planner: CRUD рутин

**Month 3:**
- [ ] Система уведомлений (Push, Email)
- [ ] Трекинг продуктов
- [ ] Интеграция аналитики
- [ ] Тестирование и исправление багов
- [ ] Soft launch

### Phase 2: Enhancement (3 месяца)

**Month 4-5:**
- [ ] Расширенный анализ совместимости ингредиентов
- [ ] ML-модель рекомендаций
- [ ] Социальные функции (шаринг рутин)
- [ ] Premium подписка

**Month 6:**
- [ ] Каталог продуктов (5000+ товаров)
- [ ] Интеграция с e-commerce
- [ ] A/B тестирование
- [ ] Оптимизация производительности

### Phase 3: Scale (ongoing)

- [ ] Расширение базы ингредиентов (10000+)
- [ ] Персонализированные ML-модели
- [ ] Мобильные приложения (React Native)
- [ ] B2B API для партнёров
- [ ] Международная локализация

---

## 12. Тестирование

### 12.1. Стратегия тестирования

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                           │
│                                                              │
│                        ┌───────┐                            │
│                       /   E2E   \                           │
│                      /  (10-15%) \                          │
│                     ├─────────────┤                         │
│                    /  Integration  \                        │
│                   /    (25-30%)     \                       │
│                  ├───────────────────┤                      │
│                 /       Unit Tests    \                     │
│                /        (55-65%)       \                    │
│               └─────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 12.2. Test Coverage Requirements

```python
COVERAGE_REQUIREMENTS = {
    "overall": 80,
    "critical_paths": 95,  # Auth, Payments, Data handling
    "api_endpoints": 90,
    "ml_pipelines": 75,
}
```

### 12.3. Testing Tools

```yaml
backend:
  unit: pytest
  integration: pytest + testcontainers
  api: pytest + httpx
  load: locust
  
frontend:
  unit: vitest
  integration: testing-library
  e2e: playwright
  
security:
  sast: bandit, semgrep
  dast: owasp zap
  dependency: safety, snyk
```

---

## 13. Документация

### 13.1. Техническая документация

```
docs/
├── architecture/
│   ├── overview.md
│   ├── decisions/          # ADR (Architecture Decision Records)
│   └── diagrams/
│
├── api/
│   ├── openapi.yaml        # Auto-generated
│   └── websocket.md
│
├── development/
│   ├── setup.md
│   ├── coding-standards.md
│   ├── git-workflow.md
│   └── deployment.md
│
├── modules/
│   ├── consultant/
│   ├── planner/
│   └── analyzer/
│
├── operations/
│   ├── runbooks/
│   ├── monitoring.md
│   └── incident-response.md
│
└── security/
    ├── security-policy.md
    └── compliance.md
```

### 13.2. API Documentation

- **OpenAPI/Swagger**: Автогенерация из FastAPI
- **Postman Collection**: Для ручного тестирования
- **SDK Documentation**: Для будущего B2B API

---

## 14. Команда и ресурсы

### 14.1. Рекомендуемый состав команды

| Роль | Количество | Приоритет |
|------|------------|-----------|
| Tech Lead / Architect | 1 | P0 |
| Backend Developer (Python) | 2 | P0 |
| Frontend Developer (React) | 2 | P0 |
| ML Engineer | 1-2 | P0 |
| DevOps Engineer | 1 | P0 |
| QA Engineer | 1 | P1 |
| Product Manager | 1 | P0 |

### 14.2. Бюджет инфраструктуры (TimeWeb Cloud)

```yaml
# Ежемесячные расходы (оценка)
monthly_costs:
  compute:
    kubernetes_cluster: 15000 RUB  # 3 worker nodes
    ml_servers: 10000 RUB          # GPU instances
  
  database:
    postgresql_ha: 8000 RUB
    redis_cluster: 4000 RUB
    elasticsearch: 6000 RUB
    clickhouse: 5000 RUB
  
  storage:
    s3: 2000 RUB
    cdn: 3000 RUB
  
  external_apis:
    gigachat: 15000-50000 RUB  # В зависимости от использования
    yandex_vision: 5000-15000 RUB
  
  other:
    dns: 500 RUB
    ssl: 0 RUB  # Let's Encrypt
    monitoring: 0 RUB  # Self-hosted

  total_estimate: 70000-120000 RUB/month
```

---

## 15. Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Недоступность GigaChat API | Средняя | Высокое | Fallback на YandexGPT |
| Низкая точность OCR | Средняя | Среднее | Ручной ввод как альтернатива |
| Высокая стоимость LLM | Высокая | Среднее | Кэширование, rate limiting |
| Проблемы с масштабируемостью | Низкая | Высокое | Архитектура с учётом роста |
| Утечка персональных данных | Низкая | Критическое | Шифрование, аудит, compliance |
| Изменение API сторонних сервисов | Средняя | Среднее | Абстракции, версионирование |

---

## 16. Приложения

### Appendix A: Технические спецификации LLM Prompts

```python
SYSTEM_PROMPTS = {
    "consultant": """
Ты — AI Beauty Consultant, эксперт в области ухода за кожей и косметики.
Твоя задача — помогать пользователям с вопросами о красоте, 
рекомендовать продукты и составлять рутины ухода.

Правила:
1. Всегда учитывай тип кожи и аллергии пользователя
2. Рекомендуй только проверенные ингредиенты
3. Не давай медицинских советов — рекомендуй обратиться к дерматологу
4. Используй дружелюбный, но профессиональный тон
5. Отвечай на русском языке
""",

    "ingredient_analyzer": """
Ты — эксперт по анализу составов косметических средств.
Проанализируй предоставленный состав и дай оценку:
1. Общая безопасность (1-10)
2. Потенциальные аллергены
3. Активные ингредиенты и их действие
4. Несовместимые компоненты
5. Рекомендации по использованию
""",
}
```

### Appendix B: Структура данных ингредиентов

Источники данных:
- CosIng (Cosmetic Ingredient Database)
- EWG Skin Deep
- Paula's Choice Ingredient Dictionary
- Внутренняя база данных (редактируется экспертами)

### Appendix C: Контрольный список безопасности

- [ ] HTTPS everywhere (TLS 1.3)
- [ ] Secure cookie flags (HttpOnly, Secure, SameSite)
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers
- [ ] Dependency vulnerability scanning
- [ ] Secrets management
- [ ] Audit logging
- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Regular security audits

---

**Документ подготовлен:** CTO Team  
**Дата последнего обновления:** 13 января 2026  
**Следующий review:** Февраль 2026

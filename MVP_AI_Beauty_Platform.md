# MVP Technical Specification
# AI Beauty Platform — Minimum Viable Product

**Версия:** 1.0  
**Дата:** 13 января 2026  
**Автор:** CTO  
**Статус:** Production-Ready  
**Целевая нагрузка:** 500 000 посещений/месяц

---

## 1. Executive Summary

### 1.1. Scope MVP
MVP включает три функциональных модуля в минимально жизнеспособной конфигурации:

| Модуль | MVP Scope | Full Scope (будущее) |
|--------|-----------|---------------------|
| **AI Beauty Consultant** | Чат-бот с базовыми ответами на вопросы, рекомендации продуктов | RAG с полной базой знаний, персонализация |
| **Beauty Routine Planner** | CRUD рутин, базовые напоминания | ML-рекомендации, социальные функции |
| **Ingredient Analyzer** | OCR + анализ 500 топ-ингредиентов | 10000+ ингредиентов, полный compatibility check |

### 1.2. Целевые метрики производительности

```yaml
target_load:
  monthly_visits: 500,000
  daily_visits: ~17,000
  peak_concurrent_users: 200-300
  requests_per_second_avg: 20
  requests_per_second_peak: 100
  
sla_requirements:
  uptime: 99.5%
  response_time_p50: < 300ms
  response_time_p99: < 2s
  llm_response_time: < 8s
  error_rate: < 1%
```

### 1.3. Timeline
- **Фаза разработки:** 10-12 недель
- **Бета-тестирование:** 2-3 недели
- **Production launch:** 14-16 недель от старта

---

## 2. Системная архитектура MVP

### 2.1. Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                           │
│                        (Mobile / Desktop PWA)                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TIMEWEB LOAD BALANCER                                │
│                    (2 ноды, 1 Gbit/s, SSL termination)                      │
│                              675 ₽/мес                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │   APP SERVER 1  │ │   APP SERVER 2  │ │   APP SERVER 3  │
          │  Cloud MSK 80   │ │  Cloud MSK 80   │ │  Cloud MSK 80   │
          │  4 vCPU, 8 GB   │ │  4 vCPU, 8 GB   │ │  4 vCPU, 8 GB   │
          │  1,782 ₽/мес    │ │  1,782 ₽/мес    │ │  1,782 ₽/мес    │
          │                 │ │                 │ │   (hot standby) │
          │  FastAPI +      │ │  FastAPI +      │ │                 │
          │  Nginx + PWA    │ │  Nginx + PWA    │ │                 │
          └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │   PostgreSQL    │     │     Redis       │     │   S3 Storage    │
    │ Cloud DB 2/4/40 │     │ Cloud DB 1/2/20 │     │    250 GB       │
    │  2 vCPU, 4 GB   │     │  1 vCPU, 2 GB   │     │   639 ₽/мес     │
    │  1,422 ₽/мес    │     │   711 ₽/мес     │     │                 │
    └─────────────────┘     └─────────────────┘     └─────────────────┘
              │
              ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                      EXTERNAL AI APIs                            │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
    │  │   GigaChat   │  │  YandexGPT   │  │   Yandex Vision      │  │
    │  │   (Primary)  │  │  (Fallback)  │  │       (OCR)          │  │
    │  └──────────────┘  └──────────────┘  └──────────────────────┘  │
    └─────────────────────────────────────────────────────────────────┘
```

### 2.2. Архитектурные решения MVP

| Аспект | Решение | Обоснование |
|--------|---------|-------------|
| **Архитектура** | Монолит (modular) | Быстрая разработка, простой деплой |
| **Масштабирование** | Горизонтальное (3 сервера) | Готовность к нагрузке 500k/мес |
| **Отказоустойчивость** | Active-Active + Hot Standby | 1 сервер в резерве |
| **Сессии** | Stateless + Redis | Возможность балансировки |
| **Файлы** | S3-совместимое хранилище | Масштабируемость, CDN-ready |
| **База данных** | Managed PostgreSQL | Автобэкапы, мониторинг |
| **Кэширование** | Redis | Сессии, кэш, очереди |

### 2.3. Структура проекта (Monorepo)

```
ai-beauty-mvp/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entrypoint
│   │   ├── config.py               # Configuration
│   │   ├── database.py             # DB connection
│   │   │
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py         # Auth endpoints
│   │   │   │   ├── users.py        # User endpoints
│   │   │   │   ├── consultant.py   # Chat endpoints
│   │   │   │   ├── routines.py     # Routine endpoints
│   │   │   │   ├── analyzer.py     # Analyzer endpoints
│   │   │   │   └── products.py     # Products endpoints
│   │   │   └── deps.py             # Dependencies
│   │   │
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── routine.py
│   │   │   ├── product.py
│   │   │   ├── ingredient.py
│   │   │   └── chat.py
│   │   │
│   │   ├── schemas/                # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── routine.py
│   │   │   ├── product.py
│   │   │   ├── ingredient.py
│   │   │   └── chat.py
│   │   │
│   │   ├── services/               # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── consultant/
│   │   │   │   ├── chat_service.py
│   │   │   │   ├── llm_client.py
│   │   │   │   └── prompts.py
│   │   │   ├── planner/
│   │   │   │   ├── routine_service.py
│   │   │   │   └── reminder_service.py
│   │   │   └── analyzer/
│   │   │       ├── ocr_service.py
│   │   │       ├── parser_service.py
│   │   │       └── safety_service.py
│   │   │
│   │   ├── repositories/           # Data access layer
│   │   │   ├── user_repo.py
│   │   │   ├── routine_repo.py
│   │   │   ├── product_repo.py
│   │   │   └── ingredient_repo.py
│   │   │
│   │   └── utils/
│   │       ├── security.py
│   │       ├── cache.py
│   │       └── s3.py
│   │
│   ├── migrations/                 # Alembic migrations
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pyproject.toml
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable UI components
│   │   │   ├── chat/               # Consultant chat
│   │   │   ├── routines/           # Routine planner
│   │   │   └── analyzer/           # Ingredient analyzer
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Routines.tsx
│   │   │   ├── Analyzer.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Auth.tsx
│   │   ├── hooks/
│   │   ├── stores/                 # Zustand stores
│   │   ├── api/                    # API client
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   └── sw.js                   # Service worker
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.prod.yml
│   │   └── nginx/
│   │       └── nginx.conf
│   ├── scripts/
│   │   ├── deploy.sh
│   │   ├── backup.sh
│   │   └── seed_ingredients.py
│   └── monitoring/
│       └── prometheus.yml
│
├── data/
│   └── ingredients_seed.json       # Initial 500 ingredients
│
├── .gitlab-ci.yml
├── .env.example
└── README.md
```

---

## 3. Технологический стек MVP

### 3.1. Frontend (PWA)

| Компонент | Технология | Версия | Обоснование MVP |
|-----------|------------|--------|-----------------|
| **Framework** | React | 18.x | Быстрая разработка |
| **Language** | TypeScript | 5.x | Типобезопасность |
| **State** | Zustand | 4.x | Простой, легковесный |
| **API Client** | TanStack Query | 5.x | Кэширование запросов |
| **Styling** | Tailwind CSS | 3.x | Utility-first |
| **Build** | Vite | 5.x | Быстрая сборка |
| **PWA** | Workbox | 7.x | Service Worker |
| **Forms** | React Hook Form + Zod | 7.x + 3.x | Валидация |
| **Router** | React Router | 6.x | Навигация |
| **Camera** | react-webcam | 7.x | Сканирование |

### 3.2. Backend

| Компонент | Технология | Версия | Обоснование MVP |
|-----------|------------|--------|-----------------|
| **Framework** | FastAPI | 0.109+ | Высокая производительность |
| **Language** | Python | 3.12 | ML-экосистема |
| **Server** | Uvicorn + Gunicorn | 0.27+ | ASGI, multi-worker |
| **ORM** | SQLAlchemy | 2.x | Async, надёжность |
| **Migrations** | Alembic | 1.13+ | Версионирование схемы |
| **Validation** | Pydantic | 2.x | Строгая типизация |
| **Task Queue** | Celery (опционально) | 5.x | Фоновые задачи |
| **Cache** | redis-py | 5.x | Async Redis client |
| **HTTP Client** | httpx | 0.27+ | Async HTTP |
| **WebSocket** | FastAPI WebSockets | native | Real-time чат |

### 3.3. AI/ML (MVP)

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **LLM Primary** | GigaChat API | Консультации |
| **LLM Fallback** | YandexGPT API | Резерв |
| **OCR** | Yandex Vision API | Сканирование состава |
| **Text Processing** | spaCy (ru_core_news_sm) | Парсинг ингредиентов |

### 3.4. Инфраструктура TimeWeb Cloud (Детальный расчёт)

#### Конфигурация серверов

| Сервис | Тариф | Спецификация | Количество | Цена/мес |
|--------|-------|--------------|------------|----------|
| **App Servers** | Cloud MSK 80 | 4 vCPU, 8 GB RAM, 80 GB NVMe | 3 | 5,346 ₽ |
| **PostgreSQL** | Cloud DB 2/4/40 | 2 vCPU, 4 GB RAM, 40 GB NVMe | 1 | 1,422 ₽ |
| **Redis** | Cloud DB 1/2/20 | 1 vCPU, 2 GB RAM, 20 GB NVMe | 1 | 711 ₽ |
| **Load Balancer** | LB Premium | 2 ноды, 1 Gbit/s | 1 | 675 ₽ |
| **S3 Storage** | Standard 250GB | 250 GB + 100 GB трафик | 1 | 639 ₽ |
| | | | **ИТОГО** | **8,793 ₽** |

#### Внешние API (оценка)

| API | Тариф | Объём MVP | Оценка/мес |
|-----|-------|-----------|------------|
| **GigaChat** | Pay-as-you-go | ~100k токенов/день | 10,000-20,000 ₽ |
| **YandexGPT** | Pay-as-you-go | Fallback ~10% | 1,000-3,000 ₽ |
| **Yandex Vision** | Pay-as-you-go | ~5k сканов/мес | 2,000-5,000 ₽ |
| **Unisender** | Базовый | ~50k писем | 1,500 ₽ |
| | | **ИТОГО API** | **14,500-29,500 ₽** |

#### Общий бюджет MVP

| Категория | Min | Max |
|-----------|-----|-----|
| Инфраструктура TimeWeb | 8,793 ₽ | 8,793 ₽ |
| Внешние API | 14,500 ₽ | 29,500 ₽ |
| Резерв (15%) | 3,500 ₽ | 5,750 ₽ |
| **ИТОГО/месяц** | **26,793 ₽** | **44,043 ₽** |

---

## 4. Детализация модулей MVP

### 4.1. AI Beauty Consultant (MVP)

#### 4.1.1. Функциональность MVP

```yaml
features_mvp:
  - Текстовый чат с AI
  - Ответы на типовые вопросы о косметике
  - Базовые рекомендации продуктов
  - История сообщений (последние 50)
  - Streaming ответов (typing indicator)

features_excluded:
  - RAG с полной базой знаний
  - Персонализация по профилю кожи
  - Голосовой ввод
  - Мультимодальность (фото в чате)
```

#### 4.1.2. Архитектура чат-сервиса

```python
# services/consultant/llm_client.py

from abc import ABC, abstractmethod
from typing import AsyncGenerator
import httpx

class LLMClient(ABC):
    @abstractmethod
    async def generate_stream(
        self, 
        messages: list[dict], 
        system_prompt: str
    ) -> AsyncGenerator[str, None]:
        pass

class GigaChatClient(LLMClient):
    def __init__(self, credentials: str):
        self.base_url = "https://gigachat.devices.sberbank.ru/api/v1"
        self.auth_url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
        self.credentials = credentials
        self._token = None
        self._token_expires = 0

    async def _get_token(self) -> str:
        # OAuth flow для GigaChat
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.post(
                self.auth_url,
                headers={
                    "Authorization": f"Basic {self.credentials}",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data={"scope": "GIGACHAT_API_PERS"}
            )
            data = response.json()
            self._token = data["access_token"]
            return self._token

    async def generate_stream(
        self, 
        messages: list[dict], 
        system_prompt: str
    ) -> AsyncGenerator[str, None]:
        token = await self._get_token()
        
        payload = {
            "model": "GigaChat",
            "messages": [
                {"role": "system", "content": system_prompt},
                *messages
            ],
            "stream": True,
            "max_tokens": 1024,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(verify=False) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {token}"},
                json=payload,
                timeout=30.0
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data != "[DONE]":
                            chunk = json.loads(data)
                            content = chunk["choices"][0]["delta"].get("content", "")
                            if content:
                                yield content


class YandexGPTClient(LLMClient):
    """Fallback LLM клиент"""
    
    def __init__(self, api_key: str, folder_id: str):
        self.base_url = "https://llm.api.cloud.yandex.net/foundationModels/v1"
        self.api_key = api_key
        self.folder_id = folder_id

    async def generate_stream(
        self, 
        messages: list[dict], 
        system_prompt: str
    ) -> AsyncGenerator[str, None]:
        # Yandex GPT implementation
        pass


class LLMOrchestrator:
    """Оркестратор с fallback логикой"""
    
    def __init__(
        self,
        primary: LLMClient,
        fallback: LLMClient,
        max_retries: int = 2
    ):
        self.primary = primary
        self.fallback = fallback
        self.max_retries = max_retries

    async def generate(
        self, 
        messages: list[dict], 
        system_prompt: str
    ) -> AsyncGenerator[str, None]:
        for attempt in range(self.max_retries):
            try:
                async for chunk in self.primary.generate_stream(messages, system_prompt):
                    yield chunk
                return
            except Exception as e:
                logger.warning(f"Primary LLM failed: {e}")
                if attempt == self.max_retries - 1:
                    # Переключаемся на fallback
                    async for chunk in self.fallback.generate_stream(messages, system_prompt):
                        yield chunk
```

#### 4.1.3. System Prompt MVP

```python
BEAUTY_CONSULTANT_PROMPT = """
Ты — AI Beauty Consultant, дружелюбный эксперт в области ухода за кожей и косметики.

## Твои возможности:
- Отвечать на вопросы об уходе за кожей
- Рекомендовать типы продуктов для разных проблем
- Объяснять назначение ингредиентов
- Давать советы по макияжу

## Правила:
1. Отвечай ТОЛЬКО на вопросы о красоте и косметике
2. Если вопрос не по теме — вежливо перенаправь к теме красоты
3. НЕ давай медицинских советов — при серьёзных проблемах рекомендуй дерматолога
4. Используй дружелюбный, но профессиональный тон
5. Отвечай на русском языке
6. Давай конкретные рекомендации с объяснениями
7. Если не знаешь ответ — признай это честно

## Формат ответа:
- Краткий и по существу (2-4 абзаца)
- Используй эмодзи умеренно (1-2 на ответ)
- Структурируй длинные ответы списками

Начни общение!
"""
```

#### 4.1.4. WebSocket API для чата

```python
# api/v1/consultant.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.consultant.chat_service import ChatService
from app.api.deps import get_current_user_ws, get_chat_service

router = APIRouter(prefix="/consultant", tags=["consultant"])

@router.websocket("/chat")
async def chat_websocket(
    websocket: WebSocket,
    chat_service: ChatService = Depends(get_chat_service)
):
    await websocket.accept()
    
    # Аутентификация через первое сообщение
    try:
        auth_message = await websocket.receive_json()
        user = await verify_ws_token(auth_message.get("token"))
        if not user:
            await websocket.close(code=4001, reason="Unauthorized")
            return
    except Exception:
        await websocket.close(code=4001, reason="Auth required")
        return
    
    # Получаем или создаём сессию
    session = await chat_service.get_or_create_session(user.id)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "message":
                content = data.get("content", "").strip()
                if not content:
                    continue
                
                # Сохраняем сообщение пользователя
                await chat_service.save_message(
                    session_id=session.id,
                    role="user",
                    content=content
                )
                
                # Отправляем typing indicator
                await websocket.send_json({
                    "type": "typing",
                    "is_typing": True
                })
                
                # Генерируем ответ (streaming)
                message_id = str(uuid.uuid4())
                await websocket.send_json({
                    "type": "message_start",
                    "message_id": message_id
                })
                
                full_response = ""
                async for chunk in chat_service.generate_response(
                    session_id=session.id,
                    user_message=content,
                    user=user
                ):
                    full_response += chunk
                    await websocket.send_json({
                        "type": "message_chunk",
                        "message_id": message_id,
                        "chunk": chunk
                    })
                
                # Сохраняем ответ ассистента
                await chat_service.save_message(
                    session_id=session.id,
                    role="assistant",
                    content=full_response
                )
                
                await websocket.send_json({
                    "type": "message_end",
                    "message_id": message_id
                })
                
            elif data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
                
    except WebSocketDisconnect:
        await chat_service.end_session(session.id)
```

### 4.2. Beauty Routine Planner (MVP)

#### 4.2.1. Функциональность MVP

```yaml
features_mvp:
  - Создание утренних/вечерних рутин
  - Добавление шагов с продуктами
  - Отметка выполнения рутины
  - Базовые push-напоминания
  - Календарь рутин (неделя)

features_excluded:
  - ML-рекомендации рутин
  - Трекинг продуктов (срок годности)
  - Социальные функции
  - Синхронизация с календарём
```

#### 4.2.2. Модели данных

```python
# models/routine.py

from sqlalchemy import Column, String, Integer, Boolean, Time, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.database import Base
import uuid
import enum

class RoutineType(str, enum.Enum):
    MORNING = "morning"
    EVENING = "evening"
    WEEKLY = "weekly"

class Routine(Base):
    __tablename__ = "routines"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(Enum(RoutineType), nullable=False)
    scheduled_time = Column(Time, nullable=True)
    days_of_week = Column(ARRAY(Integer), default=[0,1,2,3,4,5,6])  # 0=Mon
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="routines")
    steps = relationship("RoutineStep", back_populates="routine", order_by="RoutineStep.order")
    completions = relationship("RoutineCompletion", back_populates="routine")


class RoutineStep(Base):
    __tablename__ = "routine_steps"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    routine_id = Column(UUID(as_uuid=True), ForeignKey("routines.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    product_name = Column(String(200), nullable=False)  # Для кастомных продуктов
    category = Column(String(50), nullable=False)  # cleanser, toner, serum, etc.
    order = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, default=1)
    instructions = Column(String(500), nullable=True)
    is_optional = Column(Boolean, default=False)
    
    # Relationships
    routine = relationship("Routine", back_populates="steps")
    product = relationship("Product")


class RoutineCompletion(Base):
    __tablename__ = "routine_completions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    routine_id = Column(UUID(as_uuid=True), ForeignKey("routines.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    skipped_steps = Column(ARRAY(UUID(as_uuid=True)), default=[])
    notes = Column(String(500), nullable=True)
    
    # Relationships
    routine = relationship("Routine", back_populates="completions")
    user = relationship("User")
```

#### 4.2.3. API Endpoints

```python
# api/v1/routines.py

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.routine import (
    RoutineCreate, RoutineUpdate, RoutineResponse,
    RoutineStepCreate, CompletionCreate
)
from app.services.planner.routine_service import RoutineService
from app.api.deps import get_current_user, get_routine_service

router = APIRouter(prefix="/routines", tags=["routines"])

@router.get("/", response_model=list[RoutineResponse])
async def get_routines(
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Получить все рутины пользователя"""
    return await service.get_user_routines(current_user.id)


@router.post("/", response_model=RoutineResponse, status_code=status.HTTP_201_CREATED)
async def create_routine(
    routine_data: RoutineCreate,
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Создать новую рутину"""
    return await service.create_routine(current_user.id, routine_data)


@router.get("/{routine_id}", response_model=RoutineResponse)
async def get_routine(
    routine_id: UUID,
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Получить рутину по ID"""
    routine = await service.get_routine(routine_id, current_user.id)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    return routine


@router.put("/{routine_id}", response_model=RoutineResponse)
async def update_routine(
    routine_id: UUID,
    routine_data: RoutineUpdate,
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Обновить рутину"""
    routine = await service.update_routine(routine_id, current_user.id, routine_data)
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    return routine


@router.delete("/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routine(
    routine_id: UUID,
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Удалить рутину"""
    success = await service.delete_routine(routine_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Routine not found")


@router.post("/{routine_id}/complete", status_code=status.HTTP_201_CREATED)
async def complete_routine(
    routine_id: UUID,
    completion_data: CompletionCreate,
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Отметить выполнение рутины"""
    return await service.mark_completed(routine_id, current_user.id, completion_data)


@router.get("/calendar/week")
async def get_weekly_calendar(
    current_user = Depends(get_current_user),
    service: RoutineService = Depends(get_routine_service)
):
    """Получить календарь рутин на неделю"""
    return await service.get_weekly_calendar(current_user.id)
```

### 4.3. Ingredient Analyzer (MVP)

#### 4.3.1. Функциональность MVP

```yaml
features_mvp:
  - Сканирование состава через камеру (OCR)
  - Ручной ввод списка ингредиентов
  - Анализ 500 топ-ингредиентов
  - Оценка безопасности (safe/caution/avoid)
  - Выявление потенциальных аллергенов
  - История сканирований (последние 20)

features_excluded:
  - Полная база 10000+ ингредиентов
  - Проверка совместимости ингредиентов
  - Сравнение продуктов
  - Рекомендации альтернатив
```

#### 4.3.2. Модели данных

```python
# models/ingredient.py

from sqlalchemy import Column, String, Integer, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from app.database import Base
import uuid
import enum

class SafetyLevel(str, enum.Enum):
    SAFE = "safe"
    CAUTION = "caution"
    AVOID = "avoid"

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inci_name = Column(String(200), unique=True, nullable=False, index=True)
    common_names_ru = Column(ARRAY(String), default=[])
    common_names_en = Column(ARRAY(String), default=[])
    
    # Safety
    safety_level = Column(Enum(SafetyLevel), default=SafetyLevel.SAFE)
    ewg_score = Column(Integer, nullable=True)  # 1-10
    
    # Properties
    functions = Column(ARRAY(String), default=[])  # moisturizer, preservative, etc.
    concerns = Column(ARRAY(String), default=[])   # Потенциальные проблемы
    benefits = Column(ARRAY(String), default=[])   # Преимущества
    
    # Allergen flags
    is_common_allergen = Column(Boolean, default=False)
    allergen_type = Column(String(50), nullable=True)  # fragrance, preservative, etc.
    
    # Classification
    is_vegan = Column(Boolean, nullable=True)
    is_natural = Column(Boolean, nullable=True)
    comedogenic_rating = Column(Integer, nullable=True)  # 0-5
    
    # Description
    description = Column(String(1000), nullable=True)
    

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Input
    image_url = Column(String(500), nullable=True)
    input_text = Column(String, nullable=True)
    input_type = Column(String(20))  # "ocr" or "manual"
    
    # Extracted data
    extracted_text = Column(String, nullable=True)
    product_name = Column(String(200), nullable=True)
    brand = Column(String(100), nullable=True)
    
    # Analysis results
    parsed_ingredients = Column(JSONB)  # [{name, matched_id, safety, ...}]
    overall_safety_score = Column(Integer)  # 0-100
    warnings = Column(ARRAY(String), default=[])
    allergen_alerts = Column(ARRAY(String), default=[])
    
    # Stats
    total_ingredients = Column(Integer)
    recognized_count = Column(Integer)
    safe_count = Column(Integer)
    caution_count = Column(Integer)
    avoid_count = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
```

#### 4.3.3. OCR Service

```python
# services/analyzer/ocr_service.py

import httpx
import base64
from typing import Optional

class YandexVisionOCR:
    def __init__(self, api_key: str, folder_id: str):
        self.api_key = api_key
        self.folder_id = folder_id
        self.base_url = "https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze"
    
    async def extract_text(self, image_bytes: bytes) -> str:
        """Извлечь текст из изображения"""
        
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        
        payload = {
            "folderId": self.folder_id,
            "analyze_specs": [{
                "content": image_base64,
                "features": [{
                    "type": "TEXT_DETECTION",
                    "text_detection_config": {
                        "language_codes": ["ru", "en"]
                    }
                }]
            }]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                headers={
                    "Authorization": f"Api-Key {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
        
        # Извлекаем текст из ответа
        text_blocks = []
        for result in data.get("results", []):
            for res in result.get("results", []):
                text_annotation = res.get("textDetection", {})
                for page in text_annotation.get("pages", []):
                    for block in page.get("blocks", []):
                        for line in block.get("lines", []):
                            words = [w.get("text", "") for w in line.get("words", [])]
                            text_blocks.append(" ".join(words))
        
        return "\n".join(text_blocks)
```

#### 4.3.4. Ingredient Parser

```python
# services/analyzer/parser_service.py

import re
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.ingredient_repo import IngredientRepository

class IngredientParser:
    """Парсер списка ингредиентов"""
    
    # Паттерны для разделения ингредиентов
    SEPARATORS = re.compile(r'[,;/•·\n]')
    
    # Паттерны для очистки
    CLEANUP_PATTERNS = [
        (r'\([^)]*\)', ''),           # Убираем скобки с содержимым
        (r'\[[^\]]*\]', ''),          # Убираем квадратные скобки
        (r'\d+%', ''),                # Убираем проценты
        (r'ingredients?:?\s*', ''),   # Убираем заголовок "Ingredients:"
        (r'состав:?\s*', ''),         # Убираем заголовок "Состав:"
        (r'[*†‡]', ''),               # Убираем сноски
        (r'\s+', ' '),                # Нормализуем пробелы
    ]
    
    def __init__(self, ingredient_repo: IngredientRepository):
        self.repo = ingredient_repo
    
    def parse_text(self, text: str) -> list[str]:
        """Разбить текст на отдельные ингредиенты"""
        
        # Приводим к нижнему регистру
        text = text.lower()
        
        # Очищаем текст
        for pattern, replacement in self.CLEANUP_PATTERNS:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        # Разделяем по разделителям
        raw_ingredients = self.SEPARATORS.split(text)
        
        # Очищаем каждый ингредиент
        cleaned = []
        for ing in raw_ingredients:
            ing = ing.strip()
            if ing and len(ing) > 2 and len(ing) < 100:
                cleaned.append(ing)
        
        return cleaned
    
    async def match_ingredients(
        self, 
        session: AsyncSession,
        ingredient_names: list[str]
    ) -> list[dict]:
        """Сопоставить названия с базой ингредиентов"""
        
        results = []
        
        for name in ingredient_names:
            # Ищем точное совпадение по INCI
            ingredient = await self.repo.find_by_inci(session, name)
            
            if not ingredient:
                # Ищем по common names
                ingredient = await self.repo.find_by_common_name(session, name)
            
            if ingredient:
                results.append({
                    "input_name": name,
                    "matched": True,
                    "ingredient_id": str(ingredient.id),
                    "inci_name": ingredient.inci_name,
                    "safety_level": ingredient.safety_level.value,
                    "ewg_score": ingredient.ewg_score,
                    "functions": ingredient.functions,
                    "concerns": ingredient.concerns,
                    "is_common_allergen": ingredient.is_common_allergen,
                    "allergen_type": ingredient.allergen_type
                })
            else:
                results.append({
                    "input_name": name,
                    "matched": False,
                    "ingredient_id": None,
                    "inci_name": name,
                    "safety_level": "unknown",
                    "ewg_score": None,
                    "functions": [],
                    "concerns": [],
                    "is_common_allergen": False,
                    "allergen_type": None
                })
        
        return results
```

#### 4.3.5. API Endpoints

```python
# api/v1/analyzer.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.services.analyzer.analyzer_service import AnalyzerService
from app.schemas.analyzer import AnalysisResponse, TextAnalysisRequest
from app.api.deps import get_current_user, get_analyzer_service

router = APIRouter(prefix="/analyzer", tags=["analyzer"])

@router.post("/scan", response_model=AnalysisResponse)
async def scan_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    service: AnalyzerService = Depends(get_analyzer_service)
):
    """Сканировать изображение состава"""
    
    # Валидация файла
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    
    if file.size > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(400, "File too large (max 5MB)")
    
    image_bytes = await file.read()
    
    return await service.analyze_image(current_user.id, image_bytes)


@router.post("/text", response_model=AnalysisResponse)
async def analyze_text(
    data: TextAnalysisRequest,
    current_user = Depends(get_current_user),
    service: AnalyzerService = Depends(get_analyzer_service)
):
    """Анализировать текст состава"""
    return await service.analyze_text(current_user.id, data.text, data.product_name)


@router.get("/history", response_model=list[AnalysisResponse])
async def get_history(
    limit: int = 20,
    current_user = Depends(get_current_user),
    service: AnalyzerService = Depends(get_analyzer_service)
):
    """Получить историю сканирований"""
    return await service.get_user_history(current_user.id, limit)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: UUID,
    current_user = Depends(get_current_user),
    service: AnalyzerService = Depends(get_analyzer_service)
):
    """Получить результат анализа по ID"""
    result = await service.get_analysis(analysis_id, current_user.id)
    if not result:
        raise HTTPException(404, "Analysis not found")
    return result
```

---

## 5. API Specification MVP

### 5.1. Все эндпоинты MVP

```yaml
# Authentication
POST   /api/v1/auth/register          # Регистрация
POST   /api/v1/auth/login             # Вход
POST   /api/v1/auth/logout            # Выход
POST   /api/v1/auth/refresh           # Обновление токена
GET    /api/v1/auth/me                # Текущий пользователь

# User Profile
GET    /api/v1/users/profile          # Получить профиль
PUT    /api/v1/users/profile          # Обновить профиль
PUT    /api/v1/users/allergies        # Обновить аллергии

# AI Consultant
WS     /api/v1/consultant/chat        # WebSocket чат
GET    /api/v1/consultant/history     # История чата (REST fallback)
DELETE /api/v1/consultant/history     # Очистить историю

# Routine Planner
GET    /api/v1/routines               # Список рутин
POST   /api/v1/routines               # Создать рутину
GET    /api/v1/routines/{id}          # Получить рутину
PUT    /api/v1/routines/{id}          # Обновить рутину
DELETE /api/v1/routines/{id}          # Удалить рутину
POST   /api/v1/routines/{id}/complete # Отметить выполнение
GET    /api/v1/routines/calendar/week # Календарь на неделю

# Ingredient Analyzer
POST   /api/v1/analyzer/scan          # Сканировать изображение
POST   /api/v1/analyzer/text          # Анализ текста
GET    /api/v1/analyzer/history       # История сканирований
GET    /api/v1/analyzer/{id}          # Результат анализа

# Products (read-only каталог)
GET    /api/v1/products               # Список продуктов
GET    /api/v1/products/{id}          # Информация о продукте
GET    /api/v1/products/search        # Поиск продуктов
GET    /api/v1/products/categories    # Категории
```

### 5.2. Rate Limiting MVP

```python
RATE_LIMITS_MVP = {
    "auth": {
        "register": "5/hour",
        "login": "10/minute",
    },
    "consultant": {
        "chat_messages": "30/minute",
    },
    "analyzer": {
        "scan": "20/hour",
        "text": "60/hour",
    },
    "default": "120/minute",
}
```

---

## 6. Database Schema MVP

### 6.1. Миграции

```sql
-- 001_initial.sql

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Для fuzzy search

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- User Profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skin_type VARCHAR(50),  -- dry, oily, combination, normal, sensitive
    skin_concerns TEXT[],   -- acne, aging, pigmentation, etc.
    age_group VARCHAR(20),  -- 18-24, 25-34, 35-44, 45+
    allergies TEXT[],       -- Known allergens
    preferences JSONB DEFAULT '{}'
);

CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Routines
CREATE TYPE routine_type AS ENUM ('morning', 'evening', 'weekly');

CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type routine_type NOT NULL,
    scheduled_time TIME,
    days_of_week INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_routines_user_id ON routines(user_id);

-- Routine Steps
CREATE TABLE routine_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
    product_id UUID,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    "order" INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 1,
    instructions VARCHAR(500),
    is_optional BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_routine_steps_routine_id ON routine_steps(routine_id);

-- Routine Completions
CREATE TABLE routine_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT NOW(),
    skipped_steps UUID[],
    notes VARCHAR(500)
);

CREATE INDEX idx_routine_completions_routine_id ON routine_completions(routine_id);
CREATE INDEX idx_routine_completions_user_id ON routine_completions(user_id);
CREATE INDEX idx_routine_completions_date ON routine_completions(completed_at);

-- Ingredients
CREATE TYPE safety_level AS ENUM ('safe', 'caution', 'avoid');

CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inci_name VARCHAR(200) UNIQUE NOT NULL,
    common_names_ru TEXT[],
    common_names_en TEXT[],
    safety_level safety_level DEFAULT 'safe',
    ewg_score INTEGER,
    functions TEXT[],
    concerns TEXT[],
    benefits TEXT[],
    is_common_allergen BOOLEAN DEFAULT FALSE,
    allergen_type VARCHAR(50),
    is_vegan BOOLEAN,
    is_natural BOOLEAN,
    comedogenic_rating INTEGER,
    description TEXT
);

CREATE INDEX idx_ingredients_inci_name ON ingredients(inci_name);
CREATE INDEX idx_ingredients_inci_name_trgm ON ingredients USING gin(inci_name gin_trgm_ops);

-- Analysis Results
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    input_text TEXT,
    input_type VARCHAR(20),
    extracted_text TEXT,
    product_name VARCHAR(200),
    brand VARCHAR(100),
    parsed_ingredients JSONB,
    overall_safety_score INTEGER,
    warnings TEXT[],
    allergen_alerts TEXT[],
    total_ingredients INTEGER,
    recognized_count INTEGER,
    safe_count INTEGER,
    caution_count INTEGER,
    avoid_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at);

-- Chat Sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    message_count INTEGER DEFAULT 0
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,  -- user, assistant
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Products (базовый каталог)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    ingredients_raw TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
```

---

## 7. Безопасность MVP

### 7.1. Authentication

```python
# config.py

JWT_CONFIG = {
    "algorithm": "HS256",  # RS256 для production с rotate keys
    "access_token_expire_minutes": 30,
    "refresh_token_expire_days": 7,
    "secret_key": os.getenv("JWT_SECRET_KEY"),
}

PASSWORD_CONFIG = {
    "min_length": 8,
    "require_uppercase": True,
    "require_lowercase": True,
    "require_digit": True,
    "hash_algorithm": "bcrypt",
}
```

### 7.2. Security Headers

```python
# middleware/security.py

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "connect-src 'self' wss: https:; "
        "font-src 'self'"
    ),
}
```

### 7.3. Input Validation

```python
# Ограничения для MVP
VALIDATION_LIMITS = {
    "max_message_length": 2000,
    "max_routine_steps": 15,
    "max_routines_per_user": 20,
    "max_file_size_mb": 5,
    "allowed_image_types": ["image/jpeg", "image/png", "image/webp"],
}
```

### 7.4. Compliance 152-ФЗ (MVP)

```yaml
data_localization:
  - Все данные хранятся в РФ (TimeWeb Cloud, Москва)
  - Бэкапы только на территории РФ

consent:
  - Согласие на обработку ПД при регистрации (checkbox)
  - Политика конфиденциальности

user_rights:
  - Экспорт данных (GET /api/v1/users/export)
  - Удаление аккаунта (DELETE /api/v1/users/profile)
```

---

## 8. Deployment & DevOps MVP

### 8.1. Docker Configuration

```dockerfile
# backend/Dockerfile

FROM python:3.12-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application code
COPY app ./app
COPY migrations ./migrations
COPY alembic.ini .

# Run
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

```dockerfile
# frontend/Dockerfile

FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### 8.2. Docker Compose (Production)

```yaml
# docker-compose.prod.yml

version: '3.8'

services:
  app:
    build: ./backend
    image: ai-beauty-api:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/aibeauty
      - REDIS_URL=redis://redis:6379/0
      - GIGACHAT_CREDENTIALS=${GIGACHAT_CREDENTIALS}
      - YANDEX_API_KEY=${YANDEX_API_KEY}
      - YANDEX_FOLDER_ID=${YANDEX_FOLDER_ID}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - S3_ENDPOINT=${S3_ENDPOINT}
      - S3_ACCESS_KEY=${S3_ACCESS_KEY}
      - S3_SECRET_KEY=${S3_SECRET_KEY}
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '2'
          memory: 4G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    image: ai-beauty-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - app
```

### 8.3. Nginx Configuration

```nginx
# nginx.conf

upstream api_backend {
    least_conn;
    server app1:8000;
    server app2:8000;
    server app3:8000 backup;
}

server {
    listen 80;
    server_name aibeauty.ru;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aibeauty.ru;
    
    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/private/privkey.pem;
    
    # Frontend static files
    root /var/www/html;
    index index.html;
    
    # API Proxy
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket for chat
    location /api/v1/consultant/chat {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;
}
```

### 8.4. CI/CD Pipeline (GitLab CI)

```yaml
# .gitlab-ci.yml

stages:
  - test
  - build
  - deploy

variables:
  DOCKER_REGISTRY: registry.gitlab.com/aibeauty
  
# =============
# TEST STAGE
# =============

test-backend:
  stage: test
  image: python:3.12
  script:
    - cd backend
    - pip install -r requirements.txt -r requirements-dev.txt
    - pytest tests/ --cov=app --cov-report=term
  coverage: '/TOTAL.*\s+(\d+%)/'
  only:
    - merge_requests
    - main
    - develop

test-frontend:
  stage: test
  image: node:20
  script:
    - cd frontend
    - npm ci
    - npm run lint
    - npm run test
  only:
    - merge_requests
    - main
    - develop

# =============
# BUILD STAGE
# =============

build-backend:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_REGISTRY/api:$CI_COMMIT_SHA ./backend
    - docker push $DOCKER_REGISTRY/api:$CI_COMMIT_SHA
    - docker tag $DOCKER_REGISTRY/api:$CI_COMMIT_SHA $DOCKER_REGISTRY/api:latest
    - docker push $DOCKER_REGISTRY/api:latest
  only:
    - main

build-frontend:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_REGISTRY/frontend:$CI_COMMIT_SHA ./frontend
    - docker push $DOCKER_REGISTRY/frontend:$CI_COMMIT_SHA
    - docker tag $DOCKER_REGISTRY/frontend:$CI_COMMIT_SHA $DOCKER_REGISTRY/frontend:latest
    - docker push $DOCKER_REGISTRY/frontend:latest
  only:
    - main

# =============
# DEPLOY STAGE
# =============

deploy-production:
  stage: deploy
  image: alpine
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST "
        cd /opt/aibeauty &&
        docker-compose -f docker-compose.prod.yml pull &&
        docker-compose -f docker-compose.prod.yml up -d --remove-orphans &&
        docker system prune -f
      "
  environment:
    name: production
    url: https://aibeauty.ru
  when: manual
  only:
    - main
```

### 8.5. Мониторинг MVP

```yaml
# Минимальный мониторинг для MVP

monitoring_stack:
  - Uptime monitoring: UptimeRobot (бесплатно)
  - Error tracking: Sentry (бесплатный тариф)
  - Logs: Docker logs + simple log rotation
  - Metrics: Built-in FastAPI /metrics endpoint

health_endpoints:
  - GET /health          # Basic health check
  - GET /health/db       # Database connectivity
  - GET /health/redis    # Redis connectivity
  - GET /health/ready    # Full readiness check

alerts:
  - Downtime > 1 min    # Telegram notification
  - Error rate > 5%     # Email notification
  - Response time > 3s  # Log warning
```

---

## 9. Roadmap MVP → Full Product

### Phase 1: MVP Launch (Week 1-12)
```
Week 1-4:   Backend core + Auth + DB setup
Week 5-8:   AI Consultant + Routine Planner + Analyzer
Week 9-10:  Frontend PWA + Integration
Week 11-12: Testing + Bug fixes + Soft launch
```

### Phase 2: MVP Stabilization (Week 13-16)
```
- Performance optimization
- Bug fixes from user feedback
- Expand ingredient database (500 → 2000)
- Basic analytics
```

### Phase 3: Growth Features (Week 17-24)
```
- Premium subscription
- ML recommendations
- Social features
- Product tracking
- Full ingredient compatibility
```

---

## 10. Приложения

### Appendix A: Environment Variables

```bash
# .env.example

# App
APP_ENV=production
APP_DEBUG=false
APP_SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/aibeauty

# Redis
REDIS_URL=redis://host:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret

# GigaChat
GIGACHAT_CREDENTIALS=base64-encoded-credentials

# Yandex Cloud
YANDEX_API_KEY=your-api-key
YANDEX_FOLDER_ID=your-folder-id

# S3 (TimeWeb)
S3_ENDPOINT=https://s3.timeweb.cloud
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=aibeauty-media

# Sentry
SENTRY_DSN=https://your-sentry-dsn
```

### Appendix B: Seed Data Structure

```json
// data/ingredients_seed.json (пример структуры)
{
  "ingredients": [
    {
      "inci_name": "AQUA",
      "common_names_ru": ["вода", "дистиллированная вода"],
      "common_names_en": ["water", "purified water"],
      "safety_level": "safe",
      "ewg_score": 1,
      "functions": ["solvent"],
      "is_common_allergen": false,
      "is_vegan": true,
      "is_natural": true,
      "description": "Вода — основа большинства косметических средств."
    },
    {
      "inci_name": "GLYCERIN",
      "common_names_ru": ["глицерин"],
      "common_names_en": ["glycerin", "glycerine"],
      "safety_level": "safe",
      "ewg_score": 1,
      "functions": ["humectant", "moisturizer"],
      "is_common_allergen": false,
      "is_vegan": true,
      "is_natural": true,
      "description": "Увлажняющий компонент, притягивает влагу к коже."
    }
    // ... 498 more ingredients
  ]
}
```

### Appendix C: Чеклист запуска MVP

```markdown
## Pre-Launch Checklist

### Infrastructure
- [ ] TimeWeb Cloud серверы созданы и настроены
- [ ] Load Balancer настроен
- [ ] PostgreSQL и Redis развёрнуты
- [ ] S3 bucket создан
- [ ] SSL сертификат установлен
- [ ] DNS записи настроены

### Backend
- [ ] Все миграции применены
- [ ] Seed data загружен (500 ингредиентов)
- [ ] Environment variables настроены
- [ ] Health endpoints работают
- [ ] API документация доступна (/docs)

### Frontend
- [ ] PWA manifest настроен
- [ ] Service worker работает
- [ ] Favicon и иконки установлены
- [ ] Meta tags для SEO

### Security
- [ ] HTTPS работает
- [ ] Rate limiting настроен
- [ ] CORS настроен
- [ ] Security headers установлены
- [ ] Secrets не в коде

### Integrations
- [ ] GigaChat API работает
- [ ] Yandex Vision OCR работает
- [ ] Email отправляется
- [ ] Sentry подключён

### Monitoring
- [ ] UptimeRobot настроен
- [ ] Alerts настроены
- [ ] Логирование работает

### Legal
- [ ] Политика конфиденциальности
- [ ] Пользовательское соглашение
- [ ] Cookie consent
```

---

**Документ подготовлен:** CTO  
**Дата:** 13 января 2026  
**Версия:** 1.0 MVP  
**Статус:** Ready for Development

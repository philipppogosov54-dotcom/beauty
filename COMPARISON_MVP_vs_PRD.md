# Technical Comparison: MVP vs Full PRD
# AI Beauty Platform — Детальное сравнение

**Версия:** 1.0  
**Дата:** 14 января 2026  
**Автор:** CTO  

---

## 1. Executive Summary

| Параметр | MVP | Full PRD | Δ Delta |
|----------|-----|----------|---------|
| **Бюджет/месяц** | 27-44k ₽ | 70-120k ₽ | **-60%** |
| **Time to Market** | 12-16 недель | 24+ недель | **-50%** |
| **Нагрузка** | 500k visits/мес | Unlimited (autoscale) | — |
| **Ингредиенты в базе** | 500 | 10,000+ | -95% |
| **Сложность DevOps** | Низкая (Docker) | Высокая (K8s) | ↓ |
| **Масштабируемость** | Ручная | Автоматическая | ↓ |

---

## 2. Архитектурные различия

### 2.1. Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MVP ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   [Users] → [Load Balancer] → [App Server 1]                                │
│                             → [App Server 2]  → [PostgreSQL]                │
│                             → [App Server 3]     [Redis]                    │
│                                    ↓             [S3]                       │
│                            [GigaChat/YandexGPT]                             │
│                            [Yandex Vision]                                  │
│                                                                              │
│   Характеристики:                                                           │
│   • Монолитное приложение                                                   │
│   • Docker Compose                                                          │
│   • Ручное масштабирование                                                  │
│   • Простой деплой                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FULL PRD ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   [Users] → [CDN] → [API Gateway] → [Kubernetes Cluster]                    │
│                                          ↓                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  [Auth Service] [API Service] [AI Orchestrator]                     │  │
│   │  [Routine Svc]  [Ingredient Svc] [Notification Svc] [Social Svc]    │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                          ↓                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  [PostgreSQL HA] [Redis Cluster] [Elasticsearch] [ClickHouse]       │  │
│   │  [S3 + CDN]      [pgvector]                                         │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                          ↓                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  [GigaChat] [YandexGPT] [Custom ML Models] [RAG Pipeline]           │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   Характеристики:                                                           │
│   • Modular Monolith → Микросервисы                                         │
│   • Managed Kubernetes                                                       │
│   • Автомасштабирование                                                      │
│   • Full observability stack                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2. Детальное сравнение компонентов

| Компонент | MVP | Full PRD | Обоснование |
|-----------|-----|----------|-------------|
| **Оркестрация** | Docker Compose | Kubernetes (Managed) | MVP: простота; PRD: масштаб |
| **Серверы приложений** | 3x Cloud MSK 80 | K8s pods с autoscaling | MVP: фиксированное число |
| **API Gateway** | Nginx (на сервере) | Nginx Ingress + Rate Limit | PRD: централизованный gateway |
| **Service Mesh** | Нет | Опционально (Istio) | PRD: для микросервисов |

---

## 3. Инфраструктура и стоимость

### 3.1. TimeWeb Cloud — детальное сравнение

| Ресурс | MVP | Full PRD | Разница |
|--------|-----|----------|---------|
| **Compute** | | | |
| App Servers | 3× Cloud MSK 80 (4 vCPU, 8GB) | Kubernetes Cluster (3 worker nodes) | |
| | 5,346 ₽/мес | ~15,000 ₽/мес | +9,654 ₽ |
| ML Servers | — | 2× GPU instances | |
| | — | ~10,000 ₽/мес | +10,000 ₽ |
| **Database** | | | |
| PostgreSQL | Cloud DB 2/4/40 | HA конфигурация, 100GB | |
| | 1,422 ₽/мес | ~8,000 ₽/мес | +6,578 ₽ |
| Redis | Cloud DB 1/2/20 | Cluster mode, 4GB | |
| | 711 ₽/мес | ~4,000 ₽/мес | +3,289 ₽ |
| Elasticsearch | — | Managed ES | |
| | — | ~6,000 ₽/мес | +6,000 ₽ |
| ClickHouse | — | Managed CH | |
| | — | ~5,000 ₽/мес | +5,000 ₽ |
| **Storage** | | | |
| S3 | 250 GB | 500+ GB | |
| | 639 ₽/мес | ~2,000 ₽/мес | +1,361 ₽ |
| CDN | — | TimeWeb CDN | |
| | — | ~3,000 ₽/мес | +3,000 ₽ |
| **Networking** | | | |
| Load Balancer | 2 ноды, 1Gbit | Included in K8s | |
| | 675 ₽/мес | — | — |
| **Итого инфраструктура** | **~8,800 ₽** | **~53,000 ₽** | **+44,200 ₽** |

### 3.2. Внешние API

| API | MVP | Full PRD | Разница |
|-----|-----|----------|---------|
| GigaChat | 10-20k ₽ (~100k tokens/day) | 15-50k ₽ (больше запросов) | +5-30k ₽ |
| YandexGPT | 1-3k ₽ (fallback 10%) | 5-10k ₽ (load balance) | +4-7k ₽ |
| Yandex Vision | 2-5k ₽ (~5k scans) | 5-15k ₽ (больше сканов) | +3-10k ₽ |
| Unisender | 1.5k ₽ | 3k ₽ | +1.5k ₽ |
| **Итого API** | **14.5-29.5k ₽** | **28-78k ₽** | **+13.5-48.5k ₽** |

### 3.3. Общая стоимость

```
┌────────────────────────────────────────────────────────────────┐
│                    MONTHLY COST COMPARISON                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MVP:                                                           │
│  ├── Infrastructure:    8,793 ₽                                │
│  ├── External APIs:    14,500 - 29,500 ₽                       │
│  ├── Reserve (15%):     3,500 - 5,750 ₽                        │
│  └── TOTAL:           26,793 - 44,043 ₽/мес                    │
│                                                                 │
│  Full PRD:                                                      │
│  ├── Infrastructure:   53,000 ₽                                │
│  ├── External APIs:    28,000 - 78,000 ₽                       │
│  ├── Monitoring:        0 ₽ (self-hosted)                      │
│  └── TOTAL:           70,000 - 120,000 ₽/мес                   │
│                                                                 │
│  Delta: MVP экономит 43,000 - 76,000 ₽/мес (≈60%)              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Технологический стек

### 4.1. Backend

| Аспект | MVP | Full PRD | Примечание |
|--------|-----|----------|------------|
| **Framework** | FastAPI | FastAPI | Одинаково |
| **Python** | 3.12 | 3.12 | Одинаково |
| **Server** | Uvicorn + Gunicorn | Uvicorn | PRD: K8s управляет workers |
| **ORM** | SQLAlchemy 2 | SQLAlchemy 2 | Одинаково |
| **Task Queue** | Celery (опционально) | Celery (обязательно) | PRD: больше фоновых задач |
| **WebSocket** | FastAPI native | python-socketio | PRD: масштабируемость WS |
| **Message Broker** | Redis | Redis Pub/Sub | Одинаково |

### 4.2. AI/ML Stack

| Компонент | MVP | Full PRD | Критичность для MVP |
|-----------|-----|----------|---------------------|
| **LLM Primary** | GigaChat API | GigaChat API | ✅ Есть |
| **LLM Fallback** | YandexGPT API | YandexGPT API | ✅ Есть |
| **OCR** | Yandex Vision | Yandex Vision | ✅ Есть |
| **RAG Pipeline** | ❌ Нет | ✅ Да | ⚠️ Упрощено |
| **Vector DB** | ❌ Нет | pgvector | ⚠️ Упрощено |
| **Embeddings** | ❌ Нет | sentence-transformers | ⚠️ Упрощено |
| **Custom ML** | ❌ Нет | PyTorch + ONNX | ⚠️ В будущем |
| **NLP** | spaCy (basic) | spaCy + Custom NER | ⚠️ Упрощено |

### 4.3. Базы данных

| БД | MVP | Full PRD | Назначение |
|----|-----|----------|------------|
| **PostgreSQL** | ✅ Managed, single | ✅ HA, 100GB | Основные данные |
| **Redis** | ✅ 2GB | ✅ Cluster, 4GB | Кэш, сессии |
| **Elasticsearch** | ❌ Нет | ✅ Managed | Полнотекстовый поиск |
| **ClickHouse** | ❌ Нет | ✅ Managed | Аналитика |
| **pgvector** | ❌ Нет | ✅ Extension | Векторный поиск |

```
MVP: PostgreSQL выполняет функции поиска через pg_trgm (fuzzy search)
PRD: Elasticsearch для расширенного поиска + ClickHouse для аналитики
```

### 4.4. DevOps & Observability

| Компонент | MVP | Full PRD |
|-----------|-----|----------|
| **Containerization** | Docker | Docker |
| **Orchestration** | Docker Compose | Kubernetes |
| **CI/CD** | GitLab CI (simplified) | GitLab CI (full) |
| **IaC** | — | Terraform |
| **Secrets** | .env files | HashiCorp Vault |
| **Monitoring** | UptimeRobot | Prometheus + Grafana |
| **Logging** | Docker logs | Loki + Promtail |
| **Tracing** | — | Jaeger |
| **APM** | Sentry (free tier) | Sentry (paid) |

---

## 5. Функциональные различия модулей

### 5.1. AI Beauty Consultant

| Функция | MVP | Full PRD |
|---------|-----|----------|
| **Текстовый чат** | ✅ | ✅ |
| **Streaming ответов** | ✅ | ✅ |
| **История (50 сообщений)** | ✅ | ✅ (полная) |
| **RAG Pipeline** | ❌ | ✅ |
| **Intent Classification** | ❌ | ✅ |
| **Entity Extraction** | ❌ | ✅ |
| **Персонализация по профилю** | ❌ | ✅ |
| **Рекомендации продуктов** | Базовые | ML-based |
| **Мультимодальность (фото)** | ❌ | ✅ |
| **Голосовой ввод** | ❌ | ✅ |
| **Feedback loop** | ❌ | ✅ |
| **Предложенные вопросы** | ❌ | ✅ |

```python
# MVP: Прямой запрос к LLM
async def generate_response(message: str) -> str:
    return await llm.generate(system_prompt + message)

# Full PRD: RAG Pipeline
async def generate_response(message: str, user_id: UUID) -> str:
    # 1. Intent classification
    intent = await classify_intent(message)
    
    # 2. Entity extraction
    entities = await extract_entities(message)
    
    # 3. User context retrieval
    user_profile = await get_user_profile(user_id)
    
    # 4. RAG: Vector search
    relevant_docs = await vector_search(message, top_k=5)
    
    # 5. Context assembly
    context = assemble_context(user_profile, entities, relevant_docs)
    
    # 6. LLM generation with context
    response = await llm.generate(system_prompt, context, message)
    
    # 7. Post-processing
    return await format_response(response, intent)
```

### 5.2. Beauty Routine Planner

| Функция | MVP | Full PRD |
|---------|-----|----------|
| **CRUD рутин** | ✅ | ✅ |
| **Утро/Вечер/Кастом** | ✅ | ✅ + Weekly |
| **Шаги с продуктами** | ✅ | ✅ |
| **Отметка выполнения** | ✅ | ✅ |
| **Календарь (неделя)** | ✅ | ✅ (месяц) |
| **Push напоминания** | ✅ Basic | ✅ Advanced |
| **Email напоминания** | ❌ | ✅ |
| **Telegram бот** | ❌ | ✅ |
| **Трекинг продуктов** | ❌ | ✅ |
| **PAO (срок годности)** | ❌ | ✅ |
| **Расход продукта** | ❌ | ✅ |
| **Напоминание о покупке** | ❌ | ✅ |
| **AI-генерация рутин** | ❌ | ✅ |
| **Социальный шаринг** | ❌ | ✅ |
| **Копирование рутин** | ❌ | ✅ |
| **Интеграция с календарём** | ❌ | ✅ |

### 5.3. Ingredient Analyzer

| Функция | MVP | Full PRD |
|---------|-----|----------|
| **OCR сканирование** | ✅ | ✅ |
| **Ручной ввод** | ✅ | ✅ |
| **База ингредиентов** | 500 | 10,000+ |
| **Safety score** | ✅ (basic) | ✅ (advanced) |
| **Allergen detection** | ✅ | ✅ + user-specific |
| **EWG score** | ✅ | ✅ |
| **История (20)** | ✅ | ✅ (unlimited) |
| **Compatibility check** | ❌ | ✅ |
| **Ingredient synergies** | ❌ | ✅ |
| **Product comparison** | ❌ | ✅ |
| **Alternative suggestions** | ❌ | ✅ |
| **Image preprocessing** | Basic | Advanced (deskew, enhance) |
| **NLP parsing** | Regex + basic | NER + ML-based |

```python
# MVP: База 500 ингредиентов
ingredients_mvp = {
    "AQUA": {"safety": "safe", "ewg": 1},
    "GLYCERIN": {"safety": "safe", "ewg": 1},
    # ... 498 more
}

# Full PRD: 10,000+ с полными данными
ingredients_full = {
    "AQUA": {
        "inci_name": "AQUA",
        "cas_number": "7732-18-5",
        "functions": ["solvent"],
        "safety_level": "safe",
        "ewg_score": 1,
        "cosing_ref": "...",
        "incompatible_with": [],
        "best_with": ["GLYCERIN", "HYALURONIC ACID"],
        "concentration_range": "60-95%",
        "regulatory_notes": "No restrictions",
        "embedding": [0.12, -0.34, ...]  # для vector search
    },
    # ... 9,999 more
}
```

---

## 6. API Differences

### 6.1. Эндпоинты

| Категория | MVP | Full PRD | Difference |
|-----------|-----|----------|------------|
| **Auth** | 5 | 7 | +password/reset, verify-email |
| **User** | 3 | 6 | +skin, preferences, export |
| **Consultant** | 3 | 5 | +suggestions, feedback |
| **Routines** | 7 | 11 | +generate, products tracking |
| **Analyzer** | 4 | 8 | +compare, compatibility |
| **Products** | 4 | 5 | +brands |
| **Social** | 0 | 5 | Полностью отсутствует в MVP |
| **Calendar** | 0 | 3 | Отсутствует в MVP |
| **TOTAL** | ~26 | ~50 | **+24 эндпоинта** |

### 6.2. Rate Limiting

```python
# MVP: Упрощённый
RATE_LIMITS_MVP = {
    "auth/register": "5/hour",
    "auth/login": "10/minute",
    "consultant/chat": "30/minute",
    "analyzer/scan": "20/hour",
    "default": "120/minute",
}

# Full PRD: Расширенный
RATE_LIMITS_FULL = {
    "default": {"requests": 100, "window": 60},
    "auth": {"requests": 10, "window": 60},
    "consultant_chat": {"requests": 30, "window": 60},
    "analyzer_scan": {"requests": 20, "window": 60},
    "premium": {"requests": 500, "window": 60},  # Для premium юзеров
}
```

---

## 7. Безопасность

### 7.1. Authentication

| Аспект | MVP | Full PRD |
|--------|-----|----------|
| **JWT Algorithm** | HS256 | RS256 |
| **Access Token TTL** | 30 min | 15 min |
| **Refresh Token TTL** | 7 days | 30 days |
| **Key Rotation** | Manual | Automatic (90 days) |
| **MFA** | ❌ | ✅ (Phase 2) |

### 7.2. Data Protection

| Аспект | MVP | Full PRD |
|--------|-----|----------|
| **Encryption at rest** | PostgreSQL native | AES-256-GCM |
| **Encryption in transit** | TLS 1.2+ | TLS 1.3 |
| **Field-level encryption** | ❌ | ✅ (sensitive fields) |
| **Key Management** | .env | HashiCorp Vault |
| **Audit logging** | Basic | Comprehensive |

### 7.3. Compliance

| Требование | MVP | Full PRD |
|------------|-----|----------|
| **Data localization (152-ФЗ)** | ✅ | ✅ |
| **Consent management** | Basic (checkbox) | Full (журналирование) |
| **Data export** | ✅ | ✅ |
| **Account deletion** | ✅ | ✅ |
| **Security audit** | ❌ | ✅ Регулярный |

---

## 8. Производительность и масштабирование

### 8.1. SLA Targets

| Метрика | MVP | Full PRD |
|---------|-----|----------|
| **Uptime** | 99.5% | 99.9% |
| **API p50** | < 300ms | < 200ms |
| **API p99** | < 2s | < 1s |
| **LLM Response** | < 8s | < 5s |
| **Error Rate** | < 1% | < 0.1% |

### 8.2. Capacity

| Параметр | MVP | Full PRD |
|----------|-----|----------|
| **Monthly visits** | 500,000 | Unlimited (autoscale) |
| **Concurrent users** | 200-300 | 500+ |
| **RPS average** | 20 | 50 |
| **RPS peak** | 100 | 200+ (autoscale) |
| **DB size** | 40 GB | 100 GB |
| **S3 storage** | 250 GB | 500+ GB |

### 8.3. Масштабирование

```yaml
# MVP: Ручное масштабирование
scaling_mvp:
  strategy: manual
  steps:
    - Мониторинг нагрузки (UptimeRobot)
    - При необходимости добавить сервер
    - Перенастроить Load Balancer
    - Время: часы

# Full PRD: Автоматическое
scaling_full:
  strategy: horizontal_pod_autoscaler
  config:
    min_replicas: 2
    max_replicas: 10
    cpu_threshold: 70%
    memory_threshold: 80%
  time: секунды
```

---

## 9. DevOps Pipeline

### 9.1. CI/CD Stages

| Stage | MVP | Full PRD |
|-------|-----|----------|
| **Lint** | ❌ | ✅ (ruff, mypy, eslint) |
| **Test** | ✅ (pytest, vitest) | ✅ + coverage gates |
| **Security** | ❌ | ✅ (bandit, safety, trivy) |
| **Build** | ✅ | ✅ |
| **Deploy Staging** | ❌ | ✅ (auto) |
| **Deploy Production** | ✅ (manual SSH) | ✅ (kubectl, manual) |

### 9.2. Environments

| Environment | MVP | Full PRD |
|-------------|-----|----------|
| **Development** | Local Docker | K8s namespace |
| **Staging** | ❌ | ✅ |
| **Production** | Docker Compose | K8s namespace |

---

## 10. Monitoring & Observability

### 10.1. Инструменты

| Категория | MVP | Full PRD |
|-----------|-----|----------|
| **Uptime** | UptimeRobot (free) | Prometheus + Alertmanager |
| **Errors** | Sentry (free) | Sentry (paid) |
| **Logs** | Docker logs | Loki + Promtail |
| **Metrics** | /health endpoint | Prometheus + Grafana |
| **Tracing** | ❌ | Jaeger |
| **APM** | ❌ | Custom dashboards |

### 10.2. Alerts

```yaml
# MVP: Базовые алерты
alerts_mvp:
  - type: downtime
    threshold: 1 min
    channel: telegram
  - type: error_rate
    threshold: 5%
    channel: email

# Full PRD: Расширенные
alerts_full:
  - name: HighErrorRate
    condition: error_rate > 5%
    severity: critical
    channels: [pagerduty, slack, email]
  
  - name: HighLatency
    condition: p99_latency > 3s
    severity: warning
    channels: [slack]
  
  - name: LLMServiceDown
    condition: llm_health_check == 0
    severity: critical
    channels: [pagerduty, slack, telegram]
  
  - name: DatabaseConnectionsHigh
    condition: db_connections > 80%
    severity: warning
    channels: [slack]
  
  # + ещё 10+ правил
```

---

## 11. Roadmap Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MVP ROADMAP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Week 1-4     │  Week 5-8     │  Week 9-10   │  Week 11-12  │  Week 13-16   │
│  ───────────  │  ───────────  │  ──────────  │  ──────────  │  ───────────  │
│  Backend      │  AI Module    │  Frontend    │  Testing     │  Stabilize    │
│  Core + Auth  │  Routines     │  PWA         │  Bug fixes   │  Expand DB    │
│  DB Setup     │  Analyzer     │  Integration │  Soft launch │  Analytics    │
│                                                                               │
│  Total: 12-16 weeks to production                                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FULL PRD ROADMAP                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Phase 1: MVP (3 months)                                                      │
│  ├── Month 1: Infrastructure + Backend core + Auth                           │
│  ├── Month 2: AI (RAG) + Routines + Analyzer                                 │
│  └── Month 3: Frontend + Notifications + Soft launch                         │
│                                                                               │
│  Phase 2: Enhancement (3 months)                                              │
│  ├── Month 4-5: Compatibility engine + ML recommendations + Social           │
│  └── Month 6: Product catalog + E-commerce + A/B testing                     │
│                                                                               │
│  Phase 3: Scale (ongoing)                                                     │
│  ├── 10,000+ ingredients                                                      │
│  ├── Personalized ML models                                                   │
│  ├── Mobile apps (React Native)                                               │
│  └── B2B API                                                                  │
│                                                                               │
│  Total: 24+ weeks to full feature set                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Команда

| Роль | MVP (минимум) | Full PRD |
|------|---------------|----------|
| Tech Lead | 1 (part-time) | 1 |
| Backend Developer | 1-2 | 2 |
| Frontend Developer | 1 | 2 |
| ML Engineer | 0 (API only) | 1-2 |
| DevOps | 0 (developer handles) | 1 |
| QA | 0 (manual) | 1 |
| Product Manager | 1 | 1 |
| **TOTAL** | **3-5** | **9-11** |

---

## 13. Риски и митигации

| Риск | MVP Impact | PRD Impact | Митигация |
|------|------------|------------|-----------|
| **GigaChat недоступен** | Высокий | Средний | YandexGPT fallback |
| **OCR низкая точность** | Средний | Средний | Ручной ввод |
| **Высокая стоимость LLM** | Высокий | Средний | Кэширование, rate limits |
| **Проблемы масштабирования** | Высокий | Низкий | MVP: ручное, PRD: autoscale |
| **Утечка данных** | Критический | Критический | 152-ФЗ compliance, encryption |
| **Изменение API** | Средний | Низкий | Абстракции, версионирование |

---

## 14. Рекомендации по эволюции MVP → PRD

### Phase 1: Стабилизация MVP (Week 13-16)
```
✓ Мониторинг production
✓ Сбор обратной связи
✓ Bug fixes
✓ Performance tuning
✓ Расширение базы ингредиентов (500 → 2000)
```

### Phase 2: Добавление RAG (Week 17-20)
```
→ Установка pgvector extension
→ Генерация embeddings для базы знаний
→ Реализация vector search
→ Интеграция RAG в чат-бота
```

### Phase 3: Переход на Kubernetes (Week 21-24)
```
→ Подготовка Helm charts
→ Настройка TimeWeb Managed K8s
→ Миграция PostgreSQL на HA
→ Настройка autoscaling
→ Добавление Prometheus/Grafana
```

### Phase 4: Расширение функционала (Week 25+)
```
→ Product tracking
→ Ingredient compatibility
→ Social features
→ Premium subscription (ЮKassa)
→ ML recommendations
```

---

## 15. Заключение

### MVP — подходит если:
- ✅ Ограниченный бюджет (~30-45k ₽/мес)
- ✅ Нужен быстрый time-to-market (12-16 недель)
- ✅ Команда 3-5 человек
- ✅ Нагрузка до 500k visits/месяц
- ✅ Приоритет — валидация идеи

### Full PRD — подходит если:
- ✅ Бюджет 70-120k ₽/мес
- ✅ Время на разработку 6+ месяцев
- ✅ Команда 9-11 человек
- ✅ Ожидается высокая нагрузка
- ✅ Нужен полный функционал сразу
- ✅ Приоритет — масштабируемость

---

## 16. Анализ полноты MVP документа

### 16.1. ✅ Что хорошо проработано

| Раздел | Оценка | Комментарий |
|--------|--------|-------------|
| **Архитектура** | ⭐⭐⭐⭐⭐ | Полная схема, обоснование решений |
| **Инфраструктура TimeWeb** | ⭐⭐⭐⭐⭐ | Актуальные цены, детальный расчёт |
| **Технологический стек** | ⭐⭐⭐⭐⭐ | Полный список с версиями |
| **Backend структура** | ⭐⭐⭐⭐⭐ | Модульная архитектура |
| **Database schema** | ⭐⭐⭐⭐⭐ | Полные миграции SQL |
| **API endpoints** | ⭐⭐⭐⭐ | Основные эндпоинты |
| **LLM интеграция** | ⭐⭐⭐⭐⭐ | GigaChat + fallback |
| **OCR сервис** | ⭐⭐⭐⭐ | Yandex Vision |
| **Security basics** | ⭐⭐⭐⭐ | JWT, headers, 152-ФЗ |
| **CI/CD** | ⭐⭐⭐⭐ | GitLab pipeline |
| **Docker** | ⭐⭐⭐⭐ | Dockerfile, compose |
| **Nginx** | ⭐⭐⭐⭐⭐ | Полная конфигурация |

### 16.2. ⚠️ Что требует доработки/добавления

#### 16.2.1. Frontend (недостаточно детализирован)

```typescript
// ❌ Отсутствует: PWA Manifest
// public/manifest.json
{
  "name": "AI Beauty Platform",
  "short_name": "AI Beauty",
  "description": "Ваш AI-консультант по красоте",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ec4899",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

```typescript
// ❌ Отсутствует: Service Worker базовый
// public/sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);
```

```typescript
// ❌ Отсутствует: Zustand stores
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        set({
          user: response.data.user,
          token: response.data.access_token,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      refreshToken: async () => {
        const response = await api.post('/auth/refresh');
        set({ token: response.data.access_token });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

```typescript
// ❌ Отсутствует: API Client
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await useAuthStore.getState().refreshToken();
        return api.request(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 16.2.2. Backend (недостающие компоненты)

```python
# ❌ Отсутствует: requirements.txt
# requirements.txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
gunicorn==21.2.0
sqlalchemy[asyncio]==2.0.25
alembic==1.13.1
asyncpg==0.29.0
pydantic==2.5.3
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
httpx==0.26.0
redis==5.0.1
celery==5.3.6
python-multipart==0.0.6
boto3==1.34.0  # S3
sentry-sdk[fastapi]==1.39.0
structlog==24.1.0
```

```python
# ❌ Отсутствует: Health Check Endpoints
# api/v1/health.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "service": "ai-beauty-api"}

@router.get("/db")
async def db_health(db: AsyncSession = Depends(get_db)):
    """Database connectivity check"""
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

@router.get("/redis")
async def redis_health(redis: Redis = Depends(get_redis)):
    """Redis connectivity check"""
    try:
        await redis.ping()
        return {"status": "healthy", "redis": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "redis": str(e)}

@router.get("/ready")
async def readiness_check(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    """Full readiness check"""
    checks = {
        "database": False,
        "redis": False,
    }
    
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = True
    except:
        pass
    
    try:
        await redis.ping()
        checks["redis"] = True
    except:
        pass
    
    all_healthy = all(checks.values())
    return {
        "status": "ready" if all_healthy else "not_ready",
        "checks": checks
    }
```

```python
# ❌ Отсутствует: CORS Configuration
# core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://aibeauty.ru",
        "https://www.aibeauty.ru",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]

# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)
```

```python
# ❌ Отсутствует: S3 Service
# utils/s3.py
import boto3
from botocore.config import Config
import uuid

class S3Service:
    def __init__(self, endpoint: str, access_key: str, secret_key: str, bucket: str):
        self.s3 = boto3.client(
            's3',
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version='s3v4')
        )
        self.bucket = bucket
    
    async def upload_image(self, file_bytes: bytes, content_type: str) -> str:
        """Upload image and return URL"""
        key = f"images/{uuid.uuid4()}.{content_type.split('/')[-1]}"
        
        self.s3.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
            ACL='public-read'
        )
        
        return f"{self.endpoint}/{self.bucket}/{key}"
    
    async def delete_file(self, key: str):
        """Delete file from S3"""
        self.s3.delete_object(Bucket=self.bucket, Key=key)
```

```python
# ❌ Отсутствует: Error Handling Middleware
# core/middleware/error_handler.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import traceback
import structlog

logger = structlog.get_logger()

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as e:
            logger.error(
                "Unhandled exception",
                error=str(e),
                traceback=traceback.format_exc(),
                path=request.url.path,
                method=request.method,
            )
            
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": {
                        "code": "INTERNAL_ERROR",
                        "message": "Внутренняя ошибка сервера",
                        "request_id": request.state.request_id,
                    }
                }
            )
```

```python
# ❌ Отсутствует: Database Connection Pooling
# core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

# Production config with connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=20,           # Количество постоянных соединений
    max_overflow=10,        # Дополнительные соединения при пиках
    pool_timeout=30,        # Таймаут ожидания соединения
    pool_recycle=3600,      # Переподключение каждый час
    pool_pre_ping=True,     # Проверка соединения перед использованием
    echo=settings.DEBUG,
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

```python
# ❌ Отсутствует: Graceful Shutdown
# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting application...")
    await init_db()
    await init_redis()
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await close_redis()
    await engine.dispose()

app = FastAPI(lifespan=lifespan)
```

#### 16.2.3. Уведомления (упрощённо описаны)

```python
# ❌ Отсутствует: Push Notification Service
# services/notifications/push_service.py
from pywebpush import webpush, WebPushException
import json

class PushService:
    def __init__(self, vapid_private_key: str, vapid_claims: dict):
        self.private_key = vapid_private_key
        self.claims = vapid_claims
    
    async def send_notification(
        self,
        subscription: dict,
        title: str,
        body: str,
        url: str = None
    ):
        """Send push notification"""
        payload = json.dumps({
            "title": title,
            "body": body,
            "url": url or "/",
            "icon": "/icons/icon-192.png",
        })
        
        try:
            webpush(
                subscription_info=subscription,
                data=payload,
                vapid_private_key=self.private_key,
                vapid_claims=self.claims,
            )
        except WebPushException as e:
            if e.response.status_code == 410:
                # Subscription expired, remove it
                await self.remove_subscription(subscription["endpoint"])
            raise
```

```python
# ❌ Отсутствует: Email Service (Unisender)
# services/notifications/email_service.py
import httpx

class UnisenderService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.unisender.com/ru/api"
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        template_id: str,
        substitutions: dict
    ):
        """Send transactional email"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/sendEmail",
                data={
                    "api_key": self.api_key,
                    "email": to_email,
                    "sender_email": "noreply@aibeauty.ru",
                    "sender_name": "AI Beauty",
                    "subject": subject,
                    "template_id": template_id,
                    "params": substitutions,
                }
            )
            return response.json()
    
    async def send_welcome_email(self, user_email: str, user_name: str):
        return await self.send_email(
            to_email=user_email,
            subject="Добро пожаловать в AI Beauty! 💄",
            template_id="welcome_template",
            substitutions={"name": user_name}
        )
```

#### 16.2.4. Auth flows (недостаточно детализированы)

```python
# ❌ Отсутствует: Password Reset Flow
# api/v1/auth.py

@router.post("/password/forgot")
async def forgot_password(
    email: EmailStr,
    service: AuthService = Depends(get_auth_service)
):
    """Запрос на сброс пароля"""
    user = await service.get_user_by_email(email)
    if user:
        token = await service.create_reset_token(user.id)
        await email_service.send_password_reset(user.email, token)
    
    # Всегда возвращаем успех (безопасность)
    return {"message": "Если email существует, вы получите письмо"}

@router.post("/password/reset")
async def reset_password(
    token: str,
    new_password: str,
    service: AuthService = Depends(get_auth_service)
):
    """Сброс пароля по токену"""
    success = await service.reset_password(token, new_password)
    if not success:
        raise HTTPException(400, "Недействительный или истёкший токен")
    return {"message": "Пароль успешно изменён"}

@router.post("/verify-email")
async def verify_email(
    token: str,
    service: AuthService = Depends(get_auth_service)
):
    """Подтверждение email"""
    success = await service.verify_email(token)
    if not success:
        raise HTTPException(400, "Недействительный токен")
    return {"message": "Email подтверждён"}
```

#### 16.2.5. Тестирование (нет примеров)

```python
# ❌ Отсутствует: Примеры тестов
# tests/test_auth.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_register():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "SecurePass123",
            "name": "Test User"
        })
        assert response.status_code == 201
        assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "SecurePass123"
        })
        assert response.status_code == 200
        assert "access_token" in response.json()

# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

@pytest.fixture
async def db_session():
    engine = create_async_engine(
        "postgresql+asyncpg://test:test@localhost:5432/test_db"
    )
    async with AsyncSession(engine) as session:
        yield session
```

### 16.3. 🔴 Критические пробелы

| # | Пробел | Критичность | Рекомендация |
|---|--------|-------------|--------------|
| 1 | **Нет requirements.txt** | 🔴 Высокая | Добавить с pinned версиями |
| 2 | **Нет health endpoints** | 🔴 Высокая | Добавить /health, /ready |
| 3 | **Нет CORS config** | 🔴 Высокая | Добавить в middleware |
| 4 | **Нет connection pooling** | 🟡 Средняя | Настроить pool_size |
| 5 | **Нет graceful shutdown** | 🟡 Средняя | Добавить lifespan |
| 6 | **Frontend слабо описан** | 🟡 Средняя | Добавить PWA, stores |
| 7 | **Нет примеров тестов** | 🟡 Средняя | Добавить pytest examples |
| 8 | **Нет S3 upload кода** | 🟡 Средняя | Добавить boto3 service |
| 9 | **Email/Push не детализированы** | 🟡 Средняя | Добавить сервисы |
| 10 | **Нет migration rollback** | 🟢 Низкая | Документировать процедуру |

### 16.4. Рекомендации по улучшению MVP документа

1. **Добавить раздел "Dependencies"** с requirements.txt и package.json
2. **Расширить раздел Frontend** с примерами PWA, stores, components
3. **Добавить Health Check endpoints** с кодом
4. **Добавить CORS и Security middleware** конфигурации
5. **Добавить примеры unit/integration тестов**
6. **Детализировать Email и Push сервисы**
7. **Добавить схемы данных frontend (TypeScript types)**
8. **Добавить Structured Logging конфигурацию**

---

**Документ подготовлен:** CTO  
**Дата:** 14 января 2026  
**Версия:** 1.0

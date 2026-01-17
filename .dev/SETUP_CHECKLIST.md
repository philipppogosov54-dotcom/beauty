# Чеклист установки окружения BeautyScore

> Этот документ содержит все шаги для настройки локального окружения разработки.

---

## 1. Базовые инструменты

### Homebrew (менеджер пакетов macOS)

```bash
# Проверить установку
brew --version

# Если не установлен:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- [ ] Homebrew установлен

### Node.js 20.x LTS

```bash
# Установка через Homebrew
brew install node@20
brew link --force --overwrite node@20

# Проверка
node -v  # должно быть v20.x.x
npm -v   # должно быть 10.x.x
```

- [ ] Node.js 20.x установлен
- [ ] npm работает

### pnpm (менеджер пакетов)

```bash
# Активация через corepack (встроен в Node.js)
corepack enable
corepack prepare pnpm@latest --activate

# Проверка
pnpm -v
```

- [ ] pnpm установлен

---

## 2. Docker

### Docker Desktop для macOS

```bash
# Установка через Homebrew
brew install --cask docker

# Или скачать с официального сайта:
# https://www.docker.com/products/docker-desktop/

# После установки запустить Docker Desktop из Applications
```

- [ ] Docker Desktop установлен
- [ ] Docker Desktop запущен

### Проверка Docker

```bash
docker --version
docker-compose --version
docker ps  # должен показать пустой список контейнеров
```

- [ ] docker работает
- [ ] docker-compose работает

---

## 3. Базы данных (через Docker)

### PostgreSQL + Redis (docker-compose.yml)

Файл будет создан в `beautyscore/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: beautyscore-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: beautyscore
      POSTGRES_PASSWORD: beautyscore_dev_password
      POSTGRES_DB: beautyscore
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U beautyscore"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: beautyscore-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Опционально: pgAdmin для управления БД
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: beautyscore-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@beautyscore.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
```

- [ ] docker-compose.yml создан
- [ ] PostgreSQL контейнер запущен
- [ ] Redis контейнер запущен

### Команды для работы с Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f postgres
docker-compose logs -f redis

# Подключение к PostgreSQL
docker exec -it beautyscore-postgres psql -U beautyscore

# Подключение к Redis
docker exec -it beautyscore-redis redis-cli
```

---

## 4. IDE и расширения

### VS Code / Cursor расширения

Рекомендуемые расширения:
- [ ] ESLint
- [ ] Prettier
- [ ] Prisma
- [ ] Tailwind CSS IntelliSense
- [ ] TypeScript Vue Plugin (Volar) — если будет Vue
- [ ] Docker
- [ ] GitLens

---

## 5. Переменные окружения

### Файл .env.local (НЕ коммитить!)

```bash
# Database
DATABASE_URL="postgresql://beautyscore:beautyscore_dev_password@localhost:5432/beautyscore"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# OAuth (заполнить реальными данными)
VK_CLIENT_ID=""
VK_CLIENT_SECRET=""
YANDEX_CLIENT_ID=""
YANDEX_CLIENT_SECRET=""
TELEGRAM_BOT_TOKEN=""

# SMS (заполнить реальными данными)
SMS_API_KEY=""
SMS_SENDER=""

# App
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- [ ] .env.local создан для frontend
- [ ] .env создан для backend
- [ ] .gitignore обновлён

---

## 6. Проверка готовности

После выполнения всех шагов, выполните:

```bash
# Проверка Node.js
node -v && npm -v && pnpm -v

# Проверка Docker
docker --version && docker-compose --version

# Запуск инфраструктуры
cd beautyscore
docker-compose up -d

# Проверка контейнеров
docker ps

# Должны быть запущены:
# - beautyscore-postgres
# - beautyscore-redis
# - beautyscore-pgadmin (опционально)
```

---

## Быстрая установка (все команды)

```bash
# 1. Homebrew (если нет)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Node.js
brew install node@20
brew link --force --overwrite node@20

# 3. pnpm
corepack enable
corepack prepare pnpm@latest --activate

# 4. Docker Desktop
brew install --cask docker
# Затем открыть Docker Desktop из Applications

# 5. Проверка
node -v && pnpm -v && docker --version
```

---

## Возможные проблемы

### "command not found: corepack"
Node.js версия слишком старая. Обновите до 20.x.

### Docker не запускается
Откройте Docker Desktop из Applications и дождитесь запуска (иконка кита в меню).

### Порт 5432 занят
Локальный PostgreSQL уже запущен. Остановите его:
```bash
brew services stop postgresql
```

### Порт 6379 занят
Локальный Redis уже запущен. Остановите его:
```bash
brew services stop redis
```

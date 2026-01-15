# Инструкция по установке и запуску

## Требования

Для запуска проекта необходим Node.js версии 18 или выше.

### Установка Node.js

**macOS:**
```bash
# Через Homebrew
brew install node

# Или скачайте с официального сайта
# https://nodejs.org/
```

**Проверка установки:**
```bash
node --version
npm --version
```

## Установка зависимостей

```bash
cd frontend
npm install
```

## Запуск проекта

```bash
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:5173**

## Быстрый просмотр дизайна (без Node.js)

Откройте файл `demo.html` в браузере для просмотра статической версии дизайна.

## Структура проекта

```
frontend/
├── src/
│   ├── components/     # React компоненты
│   ├── pages/          # Страницы приложения
│   ├── stores/         # Zustand stores
│   ├── api/            # API клиент
│   └── types/          # TypeScript типы
├── public/             # Статические файлы
└── package.json        # Зависимости
```

## Основные страницы

- `/` - Главная страница
- `/chat` - AI Консультант (чат)
- `/routines` - Планировщик рутин
- `/analyzer` - Анализатор составов
- `/profile` - Профиль пользователя

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **Tailwind CSS** - Стилизация
- **React Router** - Маршрутизация
- **Zustand** - State management
- **TanStack Query** - Data fetching

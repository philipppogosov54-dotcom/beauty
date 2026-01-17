# Context7 MCP Test

## Проверка работы Context7

После перезапуска Cursor, откройте новый чат в режиме **Agent** и попробуйте эти запросы:

### 1. Resolve Library ID
```
use context7 to resolve library id for "react"
```

Ожидаемый результат: Context7 вернёт ID библиотеки React (например `/facebook/react`)

### 2. Get Documentation
```
use context7 to get React hooks documentation
```

Ожидаемый результат: Актуальная документация по React Hooks

### 3. Practical Example
```
use context7 to show me how to use Tailwind CSS with Next.js 14
```

Ожидаемый результат: Примеры кода и инструкции из актуальной документации

---

## Конфигурация MCP

Файл: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "context7": {
      "command": "/Users/philippe/.nvm/versions/node/v24.13.0/bin/npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-..."
      }
    }
  }
}
```

## Как понять что работает?

В логах MCP (Settings → MCP → context7) должно быть:
- `Found 2 tools` — инструменты загружены
- При использовании в чате — вызовы `resolve-library-id` и `get-library-docs`

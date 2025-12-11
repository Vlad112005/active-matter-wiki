# Active Matter Wiki API Документация

## Общие сведения

**Base URL:** `http://localhost:3001/api/v1`

**Response Format:** JSON

**Authentication:** Bearer Token (JWT) для защищенных endpoints

### Ошибки

Все ошибки возвращаются в следующем формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки",
    "details": {}
  }
}
```

---

## ПУБЛИЧНЫЕ ENDPOINTS

### Предметы (Items)

#### Получить все предметы

```
GET /items
```

**Query Parameters:**
- `type` (string): Фильтр по типу (weapon, armor, consumable, quest, other)
- `rarity` (string): Фильтр по редкости (common, uncommon, rare, epic, legendary)
- `minPrice` (number): Минимальная цена
- `maxPrice` (number): Максимальная цена
- `page` (number): Номер страницы (default: 1)
- `limit` (number): Кол-во результатов на странице (default: 20)
- `sort` (string): Сортировка (name, price, rarity)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Меч",
      "description": "Описание предмета",
      "image": "url",
      "type": "weapon",
      "rarity": "rare",
      "price": 5000,
      "weight": 2.5,
      "stackable": false,
      "source": ["Доп храм"],
      "tags": ["metal", "sharp"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Получить по деталь

```
GET /items/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Меч",
    "description": "Описание",
    "image": "url",
    "type": "weapon",
    "rarity": "rare",
    "price": 5000,
    "weight": 2.5,
    "stackable": false,
    "source": ["Доп храм"],
    "craftRecipe": {
      "ingredients": [
        {"itemId": "uuid", "quantity": 2}
      ]
    },
    "tags": ["metal", "sharp"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Поиск предметов

```
GET /items/search?q=sword
```

**Query Parameters:**
- `q` (string, required): Текст поиска
- `limit` (number): Максимум результатов (default: 10)

**Response:** Такое же как для списка предметов

---

### Локации (Locations)

#### Получить все локации

```
GET /locations
```

**Query Parameters:**
- `difficulty` (string): Фильтр по сложности (easy, medium, hard, nightmare)
- `page` (number): Номер страницы
- `limit` (number): Кол-во результатов

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Лес",
      "description": "Описание локации",
      "difficulty": "medium",
      "mapImage": "url",
      "enemies": [
        {"type": "Goblin", "count": 3}
      ],
      "loot": [
        {"itemId": "uuid", "spawnChance": 0.5}
      ],
      "tips": ["Avoid north"],
      "recommendedGear": ["uuid"]
    }
  ]
}
```

#### Получить локацию по деталь

```
GET /locations/:id
```

---

### Гайды (Guides)

#### Получить все гайды

```
GET /guides
```

**Query Parameters:**
- `category` (string): Категория гайда
- `sort` (string): Сортировка (newest, popular, rating)
- `page` (number), `limit` (number)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "beginner-guide",
      "title": Гайд для новичков",
      "author": "username",
      "category": "beginner",
      "tags": ["starter"],
      "rating": 4.5,
      "views": 1000,
      "published": true,
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Получить гайд по slug

```
GET /guides/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "beginner-guide",
    "title": "Гайд для новичков",
    "author": "username",
    "content": "# Markdown content",
    "category": "beginner",
    "tags": ["starter"],
    "rating": 4.5,
    "views": 1000,
    "published": true,
    "versions": [
      {
        "version": 1,
        "content": "# Old content",
        "changedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Получить историю версий

```
GET /guides/:id/versions
```

---

### Патч-ноты (Patches)

#### Получить все релизы

```
GET /patches
```

**Query Parameters:**
- `type` (string): Фильтр по типу (feature, bugfix, balance, hotfix)
- `page` (number), `limit` (number)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "version": "1.2.0",
      "releaseDate": "2024-01-15T00:00:00Z",
      "title": "Обновление 1.2.0",
      "changes": [
        {"type": "NEW", "description": "Новые смертельные оружия"},
        {"type": "FIXED", "description": "Поправлен баг с навеской"}
      ]
    }
  ]
}
```

---

### Персонажи (Characters)

#### Получить всех персонажей

```
GET /characters
```

#### Получить персонажа

```
GET /characters/:id
```

---

### Поиск (Глобальный)

#### Осыевые результаты

```
GET /search?q=stone
```

**Query Parameters:**
- `q` (string, required): Текст поиска
- `types` (string): Фильтр по типам (через запятую: items,guides,locations)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {"id": "uuid", "name": "Stone", "type": "consumable"}
    ],
    "guides": [
      {"id": "uuid", "title": "Stone Farming", "slug": "stone-farming"}
    ],
    "locations": [
      {"id": "uuid", "name": "Stone Quarry", "difficulty": "easy"}
    ]
  }
}
```

---

## АДМИН ENDPOINTS (защищенные)

### Аутентификация

#### Вход админа

```
POST /admin/auth/login
```

**Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "eyJhbGc...",
  "expiresIn": "7d"
}
```

#### Выход

```
POST /admin/auth/logout
Authorization: Bearer <token>
```

#### Обновить токен

```
POST /admin/auth/refresh
Authorization: Bearer <token>
```

---

### Управление предметами

#### Создать предмет

```
POST /admin/items
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Новый меч",
  "description": "Описание",
  "type": "weapon",
  "rarity": "rare",
  "price": 5000,
  "weight": 2.5,
  "stackable": false,
  "source": ["На карте"],
  "tags": ["metal", "sharp"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Новый меч",
    ...
  }
}
```

#### Обновить предмет

```
PUT /admin/items/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Удалить предмет

```
DELETE /admin/items/:id
Authorization: Bearer <token>
```

#### Загрузить изображение

```
PATCH /admin/items/:id/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image` (file): JPG, PNG, WebP. Макс. 5MB

---

### Управление гайдами

#### Создать гайд

```
POST /admin/guides
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Guide Title",
  "category": "beginner",
  "content": "# Markdown content",
  "tags": ["guide", "new"],
  "published": true
}
```

#### Обновить гайд

```
PUT /admin/guides/:id
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Коды ошибок

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Успешные операция |
| 201 | Created | Ресурс создан |
| 400 | Bad Request | Невалидные данные |
| 401 | Unauthorized | Неавторизован |
| 403 | Forbidden | Нет доступа |
| 404 | Not Found | Ресурс не найден |
| 500 | Server Error | Ошибка сервера |

---

## Примеры запросов

### curl: Получить редкие оружия

```bash
curl -X GET 'http://localhost:3001/api/v1/items?type=weapon&rarity=rare' \
  -H 'Accept: application/json'
```

### curl: Логин

```bash
curl -X POST 'http://localhost:3001/api/v1/admin/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### curl: Создать предмет (с токеном)

```bash
curl -X POST 'http://localhost:3001/api/v1/admin/items' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGc...' \
  -d '{
    "name": "Скала",
    "type": "armor",
    "rarity": "epic",
    "price": 15000,
    "weight": 5.0
  }'
```

---

## Роот API

```bash
GET / - Информация о сервисе
```

**Response:**
```json
{
  "service": "Active Matter Wiki API",
  "version": "1.0.0",
  "docs": "http://localhost:3001/api/docs",
  "status": "running"
}
```

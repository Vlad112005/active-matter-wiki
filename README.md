# Active Matter Wiki

**Информационный портал для игры Active Matter** — полный каталог предметов, локаций, гайдов и патчей.

## Технологии

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication + Discord OAuth2
- Роли: user, premium, moderator, admin, founder

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Query + Zustand
- React Router

## Быстрый старт

### 1. Клонируй репозиторий

```bash
git clone https://github.com/Vlad112005/active-matter-wiki.git
cd active-matter-wiki
```

### 2. Backend

```bash
cd backend
npm install
```

Создай `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/active_matter_wiki"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

Миграция БД:

```bash
npx prisma migrate dev --name init
```

Сиды (роли, предметы, локации, гайды):

```bash
npx tsx src/database/seeders/seedRoles.ts
npx tsx src/database/seeders/seedItems.ts
npx tsx src/database/seeders/seedLocations.ts
npx tsx src/database/seeders/seedGuides.ts
npx tsx src/database/seeders/seedPatches.ts
```

Запуск:

```bash
npm run dev
```

Сервер поднимется на `http://localhost:3001`

### 3. Frontend

```bash
cd ../frontend
npm install
```

Создай `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_TITLE="Active Matter Wiki"
VITE_APP_DESCRIPTION="Information portal for Active Matter game"
```

Запуск:

```bash
npm run dev
```

Открой `http://localhost:5173`

## Роли и доступ

| Роль | Описание | Права |
|------|----------|-------|
| **user** | Обычный пользователь после регистрации | Просмотр контента |
| **premium** | Пользователь с подпиской | Эксклюзивный контент |
| **moderator** | Модератор контента | Редактирование гайдов, новостей |
| **admin** | Администратор | Управление модераторами, добавление предметов |
| **founder** | Основатель | Полный доступ ко всему |

### Получение роли founder

1. Зарегистрируйся на сайте
2. Найди своего пользователя в БД:
   ```sql
   SELECT * FROM "User" WHERE email = 'твой@email.com';
   ```
3. Обнови роль:
   ```sql
   UPDATE "User" 
   SET "roleId" = (SELECT id FROM "Role" WHERE name = 'founder')
   WHERE email = 'твой@email.com';
   ```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `POST /api/v1/auth/logout` - Выход
- `GET /api/v1/auth/me` - Профиль

### Items
- `GET /api/v1/items` - Список предметов
- `GET /api/v1/items/:id` - Предмет
- `POST /api/v1/items` - Создать (admin+)
- `PUT /api/v1/items/:id` - Обновить (admin+)
- `DELETE /api/v1/items/:id` - Удалить (founder)

### Locations
- `GET /api/v1/locations` - Список локаций
- `GET /api/v1/locations/:id` - Локация
- `POST /api/v1/locations` - Создать (admin+)
- `PUT /api/v1/locations/:id` - Обновить (admin+)
- `DELETE /api/v1/locations/:id` - Удалить (founder)

## Структура проекта

```
active-matter-wiki/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── database/
│   │   │   ├── client.ts
│   │   │   └── seeders/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Разработка

### Backend
```bash
cd backend
npm run dev     # Запуск с hot-reload
npm run build   # Сборка
npm start       # Прод
```

### Frontend
```bash
cd frontend
npm run dev     # Запуск dev сервера
npm run build   # Сборка для прода
npm run preview # Просмотр прод билда
```

## Discord OAuth2 (в разработке)

Для полной интеграции Discord OAuth:

1. Создай приложение на [Discord Developer Portal](https://discord.com/developers/applications)
2. Добавь redirect URI: `http://localhost:3001/api/v1/discord/callback`
3. Получи Client ID и Secret
4. Добавь в `.env`:
   ```env
   DISCORD_CLIENT_ID=твой_client_id
   DISCORD_CLIENT_SECRET=твой_secret
   DISCORD_REDIRECT_URI=http://localhost:3001/api/v1/discord/callback
   ```

## Лицензия

MIT

## Контакты

- GitHub: [@Vlad112005](https://github.com/Vlad112005)
- Репозиторий: [active-matter-wiki](https://github.com/Vlad112005/active-matter-wiki)

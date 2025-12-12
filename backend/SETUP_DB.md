# 💾 ПОЛНАЯ ПОстановка БД (вариант для настоящего отновления)

## Опция 1: Новый контейнер ПостгресКл (должен быть Docker Desktop запущен)

### Шаг 1: Удалить старый контейнер

```powershell
# Выполняются из Любого PowerShell

# Остановить контейнер
 docker stop postgres-am

# Удалить контейнер
 docker rm postgres-am

# Удалить волюм (ОПЦИОНАЛО, только если хотите окончательно очистить данные)
 docker volume rm postgres_data
```

### Шаг 2: Создать новый контейнер

```powershell
docker run --name postgres-am `
  -e POSTGRES_USER=activematter `
  -e POSTGRES_PASSWORD=SecurePass123!@# `
  -e POSTGRES_DB=active_matter_wiki `
  -p 5432:5432 `
  -v postgres_data:/var/lib/postgresql/data `
  -d postgres:15

# Проверить контейнер запущен
docker ps
```

### Шаг 3: Очистить Node данные

```powershell
# В backend директории
cd C:\Users\vladi\OneDrive\Рабочий стол\wiki\active-matter-wiki\backend

# Удалить node_modules и prisma
rm -Recurse node_modules, .prisma, prisma/.env

# Переустановить депенденси
 npm ci
 npm install -D prisma
```

### Шаг 4: Генерировать Prisma и создать БД

```powershell
# Генерируем ПрисмаМодел
 npx prisma generate

# Создаём базу и таблицы
 npx prisma migrate deploy

# Эльтернатив: если требуется окончательная ресет:
 # npx prisma migrate reset --force
```

### Шаг 5: Пзаполнить тестовые данные

```powershell
# Сеединг (Seed)
 npx prisma db seed

# Открыть Prisma Studio для проверки
 npm run prisma:studio
 # Открывается http://localhost:5555
```

### Шаг 6: Построить и запустить бэкенд

```powershell
# Тесты
 npm run build

# Разработка (активные бёлье обновления)
 npm run dev

 # Ожидаем:
 # 🚀 Server running on http://localhost:3001
 # 📚 API Docs: http://localhost:3001/api/docs
 # 🌐 CORS enabled for: http://localhost:5173
```

---

## Опция 2: Полная чистка (КОГДА СНОВА все сломалось)

```powershell
# На Мав (Windows)

# 1. Стоп всего
 docker stop postgres-am
 docker rm postgres-am
 docker volume rm postgres_data

# 2. Очистка backend
 cd backend
 rm -r node_modules .prisma prisma/migrations
 npm ci

# 3. Построить новый контейнер
 docker run --name postgres-am -e POSTGRES_USER=activematter -e POSTGRES_PASSWORD=SecurePass123!@# -e POSTGRES_DB=active_matter_wiki -p 5432:5432 -v postgres_data:/var/lib/postgresql/data -d postgres:15

 # Подождите ~5 секунд
 Start-Sleep -Seconds 5

# 4. Очистка Prisma
 npx prisma generate
 npx prisma migrate reset --force

# 5. Гружим данные
 npx prisma db seed

# 6. Проверим данные
 npm run prisma:studio

# 7. И запустим
 npm run dev
```

---

## Что чистить

| Наименование | Где | Что делать |
|---|---|---|
| Docker volume | `docker volume ls` | `docker volume rm postgres_data` |
| Node modules | `backend/node_modules` | `rm -r node_modules` |
| Prisma client | `backend/.prisma` | Авто очистится |
| Миграции | `prisma/migrations` | Опционально, ОБЫЧНО НЕ делать |

---

## Очистка фронтенда

```powershell
cd frontend

# Остановить dev сервер (Ctrl+C)
# Очистить
 npm ci
 rm -r node_modules
 npm ci

# Перезагружить dev
 npm run dev
```

---

## Тесты работоспособности

```bash
# Проверь
 curl http://localhost:3001/health

# Ответ:
 # {"success":true,"message":"Service is healthy"}

# Получить предметы
 curl http://localhost:3001/api/v1/items
```

---

## Гит Обновления

КОГДА МЫ ОБНОВЛЯЕМ КОД НА GitHub, НАПИШУ ТЕБЕ О ЭТОМ (НЕ ЗАБУДь!):

```powershell
# В backend или frontend директории
git pull origin main

# Переустановить депенденси (ЕСЛИ ОНИ МЕНОВОГОЛись)
npm ci

# Обновить Prisma (ОСТОРОЖНО backend)
npx prisma generate
```

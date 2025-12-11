# 🐳 Установка PostgreSQL через Docker Desktop (Полная инструкция)

## Шаг 1: Установка Docker Desktop

### 1.1 Скачивание
1. Открой браузер
2. Перейди на: https://www.docker.com/products/docker-desktop/
3. Нажми **"Download for Windows"**
4. Дождись завершения загрузки (~500 MB)

### 1.2 Установка
1. Запусти скачанный файл `Docker Desktop Installer.exe`
2. Если появится запрос UAC (Контроль учётных записей) → нажми **"Да"**
3. В окне установки:
   - ✅ Оставь галочку **"Use WSL 2 instead of Hyper-V"** (рекомендуется)
   - ✅ Оставь галочку **"Add shortcut to desktop"**
4. Нажми **"Ok"**
5. Дождись установки (3-5 минут)
6. Нажми **"Close and restart"** - компьютер перезагрузится

### 1.3 Первый запуск
1. После перезагрузки Docker Desktop запустится автоматически
2. Если появится окно "Docker Subscription Service Agreement":
   - Прочитай и нажми **"Accept"**
3. Если появится "Welcome to Docker Desktop":
   - Можешь пропустить регистрацию → **"Skip"**
4. Дождись пока Docker полностью запустится
   - В трее (правый нижний угол) появится иконка кита 🐳
   - Она должна быть зелёной/активной

## Шаг 2: Запуск PostgreSQL в Docker

### 2.1 Открой PowerShell
1. Нажми `Win + X`
2. Выбери **"Windows PowerShell"** или **"Терминал"**
3. Откроется синее окно с мигающим курсором

### 2.2 Запусти PostgreSQL контейнер

Скопируй эту команду **ЦЕЛИКОМ** и вставь в PowerShell:

```powershell
docker run --name active-matter-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=active_matter_wiki -p 5432:5432 -d postgres:16
```

**Что происходит:**
- Docker скачает PostgreSQL 16 (~150 MB)
- Создаст контейнер с именем `active-matter-db`
- Создаст базу данных `active_matter_wiki`
- Пароль: `password`
- Порт: `5432`

**Прогресс:**
```
Unable to find image 'postgres:16' locally
16: Pulling from library/postgres
abcdef123456: Pull complete
...
Status: Downloaded newer image for postgres:16
1a2b3c4d5e6f7g8h9i0j...  ← это ID контейнера (значит успех!)
```

### 2.3 Проверь что всё работает

```powershell
docker ps
```

**Должна быть такая таблица:**
```
CONTAINER ID   IMAGE         STATUS         PORTS                    NAMES
1a2b3c4d5e     postgres:16   Up 10 seconds  0.0.0.0:5432->5432/tcp   active-matter-db
```

✅ Если видишь `active-matter-db` и `Up` - **УСПЕХ!**

## Шаг 3: Проверка в Docker Desktop GUI

1. Открой **Docker Desktop** (двойной клик на иконку)
2. Слева выбери **"Containers"**
3. Ты должен увидеть:
   ```
   active-matter-db
   🟢 Running
   postgres:16
   ```
4. Можешь кликнуть на него → увидишь логи и детали

## Шаг 4: Настройка Backend

### 4.1 Проверь файл .env

1. Открой папку проекта: `active-matter-wiki/backend/`
2. Найди файл `.env`
3. Убедись что там написано:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/active_matter_wiki"
JWT_SECRET="your-super-secret-jwt-key-CHANGE-THIS-IN-PRODUCTION-12345"
PORT=3001
CLIENT_URL="http://localhost:5173"
NODE_ENV=development
```

✅ Если всё так - переходи дальше!

### 4.2 Установи зависимости

В PowerShell перейди в папку backend:

```powershell
cd C:\Users\vladi\OneDrive\Рабочий стол\wiki\active-matter-wiki\backend
```

_(Замени путь на свой!)_

Установи пакеты:

```powershell
npm install
```

### 4.3 Создай таблицы в базе

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

**Должно быть:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

### 4.4 Заполни базу данными

```powershell
npm run db:seed
```

**Должно быть:**
```
Base roles seeded
Seeded 15 items
Seeded 5 locations
Seeded 3 guides
Seeded 3 patches
```

### 4.5 Запусти Backend

```powershell
npm run dev
```

**Успех выглядит так:**
```
🚀 Server running on http://localhost:3001
📚 API Docs: http://localhost:3001/api/docs
🌐 CORS enabled for: http://localhost:5173
```

✅ **НЕ ЗАКРЫВАЙ ЭТО ОКНО!** Backend должен работать постоянно.

## Шаг 5: Запуск Frontend

### 5.1 Открой ВТОРОЙ PowerShell

1. Нажми `Win + X` → **"Windows PowerShell"** (ещё раз)
2. Перейди в папку frontend:

```powershell
cd C:\Users\vladi\OneDrive\Рабочий стол\wiki\active-matter-wiki\frontend
```

### 5.2 Установи зависимости

```powershell
npm install
```

### 5.3 Запусти Frontend

```powershell
npm run dev
```

**Успех:**
```
VITE v7.2.7  ready in 455 ms

➜  Local:   http://localhost:5173/
```

## Шаг 6: Открой сайт!

1. Открой браузер
2. Перейди на: **http://localhost:5173**
3. 🎉 **ГОТОВО!** Ты должен увидеть красивый сайт с градиентами!

---

## 🛠️ Полезные команды

### Управление Docker контейнером

```powershell
# Остановить базу данных
docker stop active-matter-db

# Запустить снова
docker start active-matter-db

# Посмотреть логи
docker logs active-matter-db

# Полностью удалить (удалит все данные!)
docker rm -f active-matter-db
```

### Если нужно пересоздать базу

```powershell
# 1. Удали старый контейнер
docker rm -f active-matter-db

# 2. Создай новый
docker run --name active-matter-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=active_matter_wiki -p 5432:5432 -d postgres:16

# 3. В папке backend:
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

---

## ❌ Решение проблем

### "docker: command not found"
**Решение:**
1. Docker Desktop не запущен
2. Открой Docker Desktop из меню Пуск
3. Дождись пока иконка в трее станет зелёной
4. Попробуй команду снова

### "port 5432 is already in use"
**Решение:**
1. У тебя уже запущен другой PostgreSQL
2. Либо останови его, либо используй другой порт:

```powershell
docker run --name active-matter-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=active_matter_wiki -p 5433:5432 -d postgres:16
```

Тогда в `.env` измени:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/active_matter_wiki"
```

### "Can't reach database server"
**Решение:**
1. Проверь что Docker запущен:
   ```powershell
   docker ps
   ```
2. Если пусто, запусти базу:
   ```powershell
   docker start active-matter-db
   ```

### Frontend показывает белый экран
**Решение:**
1. Открой DevTools (F12)
2. Посмотри ошибки в Console
3. Убедись что backend запущен (шаг 4.5)
4. Проверь что в `.env` правильный URL

---

## 📝 Краткая шпаргалка

```powershell
# 1. Запусти Docker Desktop (один раз)

# 2. Создай базу (один раз)
docker run --name active-matter-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=active_matter_wiki -p 5432:5432 -d postgres:16

# 3. Backend (первый PowerShell)
cd backend
npm run dev

# 4. Frontend (второй PowerShell)
cd frontend
npm run dev

# 5. Открой http://localhost:5173
```

## 🎯 Следующие запуски

После первой настройки, для запуска сайта нужно:

1. ✅ Запустить Docker Desktop
2. ✅ Запустить backend: `cd backend && npm run dev`
3. ✅ Запустить frontend: `cd frontend && npm run dev`
4. ✅ Открыть http://localhost:5173

Всё! 🚀

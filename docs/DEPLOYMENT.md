# Принтипы растърования Active Matter Wiki

Полные инструкции по распределению на водяные тесты.

## Таблица Настроек

| Компонент | Платформа | Фрея | Сложность |
|------------|----------|-----|------------|
| **Frontend** | Vercel | Free (высоко до 100GB) | Очень просто |
| **Backend** | Railway | $5/месяц | Легко |
| **База Данных** | Neon/Supabase | Free (3 проекта) | Просто |
| **Хранение** | AWS S3 | ~бесплатно | Знава проэктов |

---

## Frontend: Vercel

### Краткие шаги

1. **Откройте [vercel.com](https://vercel.com) и валидируйте**

2. **Откройте GitHub проект:**
   ```bash
   npm install -g vercel
   cd frontend
   vercel --prod
   ```

3. **спросите и поставьте переменные:**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api/v1
   ```

### Автоматические распределения

1. **Vercel Git Integration:**
   - Коннектите репозиторий в Vercel
   - Каждые присоединения к main видет автоматические
   - Превью выпаровывается автоматические

2. **Настроение домена:**
   - Перейдите на Settings → Domains
   - Добавьте ваш домен (пример: `wiki.activematter.io`)
   - Конфигурируйте DNS рецеїводителі

3. **HTTPS (Automatic):**
   - Vercel автоматически содагрижвает SSL/TLS сертификатов

---

## Backend: Railway

### Краткие шаги

1. **Откройте [railway.app](https://railway.app) и валидируйте деньгами GitHub**

2. **Использование Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   cd backend
   railway init
   railway up
   ```

3. **Конфигурируйте неохходимые переменные:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-super-secret-key
   NODE_ENV=production
   PORT=3001
   ```

### Настройка ДБ

1. **Присоединения Постгрес в Railway:**
   - Клавиша `Add` → Database → PostgreSQL
   - Railway автоматически нарисует `DATABASE_URL`

2. **Миграция Мядба:
   ```bash
   # Локально
   npm run migrate:prod
   
   # или через Railway CLI
   railway run npm run migrate
   ```

3. **сеединг:**
   ```bash
   # Локально (необязательно)
   npm run seed:prod
   ```

---

## БАЗА ДАННЫХ: Neon или Supabase

### Опция 1: Neon (Рекомендуется)

1. **Откройте [neon.tech](https://neon.tech)**
2. **Содавайте время проект:**
   - Project: `active-matter-wiki`
   - Region: выбрание васыние
3. **Настроите `DATABASE_URL` в Railway**

### Опция 2: Supabase

1. **Откройте [supabase.com](https://supabase.com)**
2. **Содавайте проект:**
   - Organization: ваша организация
   - Database Password: генерируятся автоматические
3. **Перейдите на Settings → Database → URI**
4. **Настроите `DATABASE_URL`**

---

## Этапы распределения

### Шаг 1: Подготовка

```bash
# Клонируйте репозиторий
git clone https://github.com/yourusername/active-matter-wiki.git
cd active-matter-wiki

# Настройка локального окружения
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### Шаг 2: Frontend на Vercel

```bash
cd frontend
npm install
vercel --prod
```

Опрос:
- Scope: `your-name` (личный аккаунт)
- Link: Yes
- Build command: `npm run build`
- Install command: `npm install`

### Шаг 3: Backend на Railway

```bash
cd backend
railway init
```

Выберите:
- Existing project: No
- Type: Node.js
- Author: ваше имя

### Шаг 4: Переменные окружения

**В Railway Dashboard:**
1. Переходим на Variables
2. Добавляем:
   - `DATABASE_URL` (из Neon/Supabase)
   - `JWT_SECRET` (сгенерируйте: `openssl rand -hex 32`)
   - `JWT_EXPIRE=7d`
   - `NODE_ENV=production`

### Шаг 5: Миграция БД

```bash
# Локально или через Railway
railway run npm run migrate
```

### Шаг 6: Настройка доменов

**Frontend:**
- Vercel Dashboard → Settings → Domains → Add Domain
- Добавьте: `api.example.com`

**Backend:**
- Railway Dashboard → Settings → Domain
- Включить Custom Domain: `api.example.com`

---

## CI/CD Конвейер

### GitHub Actions

**.github/workflows/deploy.yml:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Backend
        run: |
          cd backend
          railway up --token=${{ secrets.RAILWAY_TOKEN }}
```

**Настройка:**
1. Перейдите в GitHub → Settings → Secrets
2. Добавьте:
   - `VERCEL_TOKEN` (из [https://vercel.com/account/tokens](https://vercel.com/account/tokens))
   - `RAILWAY_TOKEN` (из Railway API)

---

## Мониторинг

### Uptime Monitoring

**Сервис: UptimeRobot**

1. Перейдите на [uptimerobot.com](https://uptimerobot.com)
2. Добавьте мониторы:
   - Frontend: `https://wiki.example.com/`
   - Backend: `https://api.example.com/api/v1/`
3. Установите оповещения

### Логи

**Railway:**
- Dashboard → Deploy → Logs
- Все логи автоматически собираются

**Vercel:**
- Dashboard → Deployments → Select → Logs

---

## Масштабирование

### Если трафик растет:

1. **Vercel:** Автоматически масштабируется
2. **Railway:** Обновить план с $5 на $12/месяц
3. **Database:** Neon автоматически масштабируется
4. **CDN:** Добавить Cloudflare впереди Vercel

---

## Проверка Здоровья

### Здоровье Frontend

```bash
curl https://wiki.example.com/
# ✓ Должен вернуть HTML с 200 статусом
```

### Здоровье Backend

```bash
curl https://api.example.com/api/v1/
# ✓ Должен вернуть JSON с информацией о сервисе
```

### Здоровье БД

```bash
# В backend коде
GET /api/v1/health
# ✓ Должен проверить подключение к БД
```

---

## Резервное копирование

### Автоматические резервные копии

**Neon:**
- Автоматические ежедневные резервные копии
- Хранятся 7 дней
- Перейдите на Settings → Backups

**Supabase:**
- Перейдите на Settings → Database → Backups
- Загрузите на S3 (опционально)

---

## Отладка проблем

### 503 Service Unavailable

```bash
# Проверьте логи
railway logs

# Перезагрузитесь
railway redeploy
```

### CORS ошибки

**Убедитесь, что `backend/.env` имеет:**
```
CLIENT_URL=https://wiki.example.com
```

### Проблемы с БД

```bash
# Проверьте DATABASE_URL
echo $DATABASE_URL

# Попробуйте миграцию снова
npm run migrate:prod
```

---

## Контрольный список перед продакшеном

- [ ] Все переменные окружения установлены
- [ ] HTTPS включен везде
- [ ] Миграции БД завершены
- [ ] Базовые данные (seeds) загружены
- [ ] Frontend может связаться с Backend
- [ ] Логирование включено
- [ ] Резервные копии настроены
- [ ] Мониторинг включен
- [ ] CDN кэш настроен
- [ ] SSL сертификаты валидны
- [ ] Тесты пройдены локально
- [ ] Deploy провел без ошибок

---

## Поддержка

Если у вас есть вопросы:

1. Проверьте [GitHub Issues](https://github.com/Vlad112005/active-matter-wiki/issues)
2. Создайте новый issue с подробной информацией
3. Укажите: ошибка, версия Node, OS, все логи

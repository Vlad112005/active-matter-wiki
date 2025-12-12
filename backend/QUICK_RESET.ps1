# Автоматические скрипты для чистки и ресета

# Мод 1: Docker reset (ПОЛНАЯ ЧИСтКА)
# function Reset-DB {
#   Write-Host "💾 Останавливаю Контейнер..." -ForegroundColor Yellow
#   docker stop postgres-am
#   docker rm postgres-am
#   docker volume rm postgres_data
#
#   Write-Host "🚀 Создаю новый контейнер..." -ForegroundColor Yellow
#   docker run --name postgres-am `
#     -e POSTGRES_USER=activematter `
#     -e POSTGRES_PASSWORD=SecurePass123!@# `
#     -e POSTGRES_DB=active_matter_wiki `
#     -p 5432:5432 `
#     -v postgres_data:/var/lib/postgresql/data `
#     -d postgres:15
#
#   Start-Sleep -Seconds 5
#
#   Write-Host "📚 Обновляю присму..." -ForegroundColor Yellow
#   npx prisma generate
#   npx prisma migrate reset --force
#
#   Write-Host "🌟 Загружаю тестовые данные..." -ForegroundColor Yellow
#   npx prisma db seed
#
#   Write-Host "✅ готово! Выполни: npm run dev" -ForegroundColor Green
# }
# Reset-DB

# Мод 2: Присма обновление
Write-Host "📚 Обновляю Prisma..." -ForegroundColor Yellow
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
Write-Host "✅ Готово!" -ForegroundColor Green

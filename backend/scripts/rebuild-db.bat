@echo off
echo ========================================
echo   ACTIVE MATTER WIKI - DATABASE REBUILD
echo ========================================
echo.

echo [1/6] Stopping backend...
taskkill /F /IM node.exe 2>nul

echo [2/6] Cleaning Docker containers...
docker stop postgres-am 2>nul
docker rm postgres-am 2>nul
docker volume rm postgres_data 2>nul

echo [3/6] Creating new PostgreSQL container...
docker run --name postgres-am ^
  -e POSTGRES_USER=activematter ^
  -e POSTGRES_PASSWORD=ActiveMatter2025 ^
  -e POSTGRES_DB=active_matter_wiki ^
  -p 5432:5432 ^
  -v postgres_data:/var/lib/postgresql/data ^
  -d postgres:15

echo [4/6] Waiting for PostgreSQL to start (10 seconds)...
timeout /t 10 /nobreak >nul

echo [5/6] Generating Prisma client and migrating...
cd ..
npx prisma generate
npx prisma migrate deploy

echo [6/6] Seeding database...
npx prisma db seed

echo.
echo ========================================
echo   DATABASE REBUILD COMPLETE!
echo ========================================
echo.
echo Founder credentials:
echo   Email: founder@activematter.wiki
echo   Password: ActiveMatter2025!
echo.
echo Run: npm run dev
echo.
pause

# PostgreSQL Setup Guide

## Windows

### Option 1: Official PostgreSQL (Recommended)

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download latest version (16.x)
   - Run installer

2. **Installation**
   - Choose installation directory
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   - Set password for `postgres` user (remember this!)
   - Port: `5432` (default)
   - Locale: Default
   - Complete installation

3. **Verify Installation**
   ```cmd
   # Open Command Prompt
   psql --version
   ```

4. **Create Database**
   ```cmd
   # Connect to PostgreSQL
   psql -U postgres
   
   # Enter your password
   # Then create database:
   CREATE DATABASE active_matter_wiki;
   
   # Exit
   \q
   ```

5. **Update backend/.env**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/active_matter_wiki"
   ```

### Option 2: Docker (Easier)

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop

2. **Run PostgreSQL Container**
   ```cmd
   docker run --name active-matter-db ^
     -e POSTGRES_PASSWORD=password ^
     -e POSTGRES_DB=active_matter_wiki ^
     -p 5432:5432 ^
     -d postgres:16
   ```

3. **Verify**
   ```cmd
   docker ps
   ```

4. **backend/.env is already configured** for Docker setup!

### Option 3: Supabase (Cloud, Free)

1. Go to https://supabase.com
2. Create account
3. Create new project
4. Get connection string from Settings > Database
5. Update `DATABASE_URL` in `backend/.env`

## Check if PostgreSQL is Running

### Windows
```cmd
# Check service
sc query postgresql-x64-16

# Or check port
netstat -ano | findstr :5432
```

### If not running:
```cmd
# Start service
net start postgresql-x64-16
```

## Common Issues

### Error: Can't reach database server at localhost:5432

**Solution 1: Start PostgreSQL**
```cmd
net start postgresql-x64-16
```

**Solution 2: Check if port is in use**
```cmd
netstat -ano | findstr :5432
```

**Solution 3: Use Docker**
```cmd
docker start active-matter-db
```

### Error: Password authentication failed

1. Open `backend/.env`
2. Update password:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/active_matter_wiki"
   ```

## After PostgreSQL is Running

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run db:seed

# Start backend
npm run dev
```

## Quick Test

```bash
# Test connection
psql -U postgres -h localhost -p 5432 -d active_matter_wiki

# If successful, you'll see:
active_matter_wiki=#
```

## Recommended: Docker Approach (Easiest)

Docker is the easiest way to get PostgreSQL running without complex setup:

1. Install Docker Desktop
2. Run one command:
   ```cmd
   docker run --name active-matter-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=active_matter_wiki -p 5432:5432 -d postgres:16
   ```
3. Database is ready!

To stop:
```cmd
docker stop active-matter-db
```

To start again:
```cmd
docker start active-matter-db
```

To remove (deletes all data):
```cmd
docker rm -f active-matter-db
```

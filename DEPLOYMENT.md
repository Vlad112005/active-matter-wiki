# Active Matter Wiki - Deployment & Launch Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Vlad112005/active-matter-wiki.git
cd active-matter-wiki
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/active_matter_wiki"
JWT_SECRET="your-super-secret-jwt-key-CHANGE-THIS"
PORT=3001
CLIENT_URL="http://localhost:5173"
NODE_ENV=development
```

Create database:
```bash
creatdb active_matter_wiki
```

Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Seed database:
```bash
npm run db:seed
```

Or manually:
```bash
npx tsx src/database/seeders/seedRoles.ts
npx tsx src/database/seeders/seedItems.ts
npx tsx src/database/seeders/seedLocations.ts
npx tsx src/database/seeders/seedGuides.ts
npx tsx src/database/seeders/seedPatches.ts
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_TITLE="Active Matter Wiki"
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔑 Getting Founder Access

1. Register on the site at `http://localhost:5173/login`
2. Open Prisma Studio:
   ```bash
   cd backend
   npx prisma studio
   ```
3. Navigate to `User` table
4. Find your user
5. Change `roleId` to the `id` of the `founder` role from `Role` table
6. Refresh the site and you'll have full admin access

Or via SQL:
```sql
UPDATE "User" 
SET "roleId" = (SELECT id FROM "Role" WHERE name = 'founder')
WHERE email = 'your@email.com';
```

## 🎯 Project Structure Overview

### Backend (`/backend`)
- **Prisma Schema**: User roles, Items, Locations, Guides, Patches
- **Auth**: JWT + Discord OAuth (Discord WIP)
- **Roles**: user → premium → moderator → admin → founder
- **API**: RESTful endpoints with role-based access control

### Frontend (`/frontend`)
- **React + TypeScript**: Modern UI with Tailwind CSS
- **State**: Zustand (auth) + React Query (data fetching)
- **Pages**: Home, Items, Locations, Guides, Patches, Admin Panel
- **Auth**: Protected routes for admin/premium content

## 📊 Current Features

✅ **Backend**
- Full REST API with auth
- Role-based permissions (5 levels)
- CRUD for items, locations, guides, patches
- Real Active Matter game data seeded
- PostgreSQL + Prisma ORM

✅ **Frontend**
- Responsive UI with dark theme
- Items catalog with filters
- Location browser
- Guide system
- Patch notes
- Admin dashboard (basic)
- Login/register flow

## 🛠️ Admin Panel Access

URL: `http://localhost:5173/admin`

**Permissions by Role:**
| Action | User | Premium | Moderator | Admin | Founder |
|--------|------|---------|-----------|-------|--------|
| View content | ✅ | ✅ | ✅ | ✅ | ✅ |
| Premium content | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit guides | ❌ | ❌ | ✅ | ✅ | ✅ |
| Add/edit items | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete anything | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage roles | ❌ | ❌ | ❌ | ❌ | ✅ |

## 📝 API Documentation

Base URL: `http://localhost:3001/api/v1`

### Auth Endpoints
```
POST /auth/register - Register new user
POST /auth/login - Login
GET /auth/me - Get current user (requires auth)
POST /auth/logout - Logout
```

### Items
```
GET /items - List items (public)
GET /items/:id - Get item (public)
GET /items/search?q=... - Search items (public)
POST /items - Create (admin+)
PUT /items/:id - Update (admin+)
DELETE /items/:id - Delete (founder)
```

### Locations
```
GET /locations - List locations (public)
GET /locations/:id - Get location (public)
POST /locations - Create (admin+)
PUT /locations/:id - Update (admin+)
DELETE /locations/:id - Delete (founder)
```

### Guides
```
GET /guides - List guides (public)
GET /guides/:slug - Get guide (public)
POST /guides - Create (moderator+)
PUT /guides/:slug - Update (moderator+)
DELETE /guides/:slug - Delete (admin+)
```

### Patches
```
GET /patches - List patches (public)
GET /patches/:version - Get patch (public)
POST /patches - Create (admin+)
PUT /patches/:version - Update (admin+)
DELETE /patches/:version - Delete (founder)
```

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npx prisma studio    # Open database GUI
```

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🚀 Production Deployment

### Backend (Node.js)
1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm start`

### Frontend (Vite)
1. Set `VITE_API_BASE_URL` to production API
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

### Database
- Use managed PostgreSQL (AWS RDS, Supabase, Railway, etc.)
- Run migrations before deploying backend
- Seed data with `npm run db:seed`

## 📚 Seeded Data

### Items (15+)
- **Weapons**: M4A1, AK-103, MP5, SPAS-12, SV-98, Combat Knife, War Hammer
- **Armor**: A3 Helmet, Tactical Vest
- **Consumables**: Medkit, Painkiller, Energy Drink
- **Other**: Crystallised Active Matter, Backpacks

### Locations (5)
- Factory (Easy)
- Scrapyard (Easy)
- Cargo Port (Medium)
- Military Base (Hard)
- Headquarters (Nightmare)

### Guides (3)
- Beginner's Guide
- Best Weapons Ranked
- Headquarters Map Guide

### Patches (3)
- v0.9.2 - Balance Update
- v0.9.1 - New Map: Headquarters
- v0.9.0 - Early Access Launch

## ❗ Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Run migrations: `npx prisma migrate dev`

### Frontend can't connect to API
- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check CORS settings in backend `index.ts`

### Login not working
- Verify JWT_SECRET is set in backend `.env`
- Check browser console for errors
- Clear localStorage and try again

### No data showing
- Run seeders: `npm run db:seed` (in backend)
- Check Prisma Studio to verify data: `npx prisma studio`

## 💬 Discord OAuth (Coming Soon)

Discord integration is prepared but not fully implemented. To complete:

1. Create Discord application at https://discord.com/developers/applications
2. Add redirect URI: `http://localhost:3001/api/v1/discord/callback`
3. Add to backend `.env`:
   ```env
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_secret
   DISCORD_REDIRECT_URI=http://localhost:3001/api/v1/discord/callback
   ```
4. Implement OAuth flow in `backend/src/controllers/authController.ts`

## 🎓 Next Steps

- [ ] Complete Discord OAuth integration
- [ ] Add premium content sections
- [ ] Implement crafting system
- [ ] Add interactive maps
- [ ] Build advanced admin panel
- [ ] Add user profiles
- [ ] Implement search across all content
- [ ] Add favorites/bookmarks
- [ ] Create mobile app

---

**© 2025 Active Matter Wiki** | Made with ❤️ for the community

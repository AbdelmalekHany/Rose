# 🚀 Deployment Guide - How to Run Your App on a Host

This guide shows you how to deploy and run your Next.js application on different hosting platforms.

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- [ ] Your code pushed to GitHub/GitLab (or ready to upload)
- [ ] Environment variables ready (see below)
- [ ] Database ready (SQLite won't work in production - you'll need PostgreSQL)
- [ ] Node.js 18+ available on your hosting platform

---

## 🔑 Environment Variables Required

You'll need to set these in your hosting platform's dashboard:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-random-secret-here"
```

**Generate NEXTAUTH_SECRET:**
- Visit: https://generate-secret.vercel.app/32
- Or run: `openssl rand -base64 32`

---

## 🌐 Option 1: Vercel (Easiest - Recommended)

Vercel is made by the creators of Next.js and is the easiest option.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to your project → Settings → Environment Variables
   - Add these:
     - `DATABASE_URL` (see database setup below)
     - `NEXTAUTH_URL` (your Vercel URL: `https://your-project.vercel.app`)
     - `NEXTAUTH_SECRET` (generate one above)

4. **Set up Database**
   - Go to: https://vercel.com/storage → Create Postgres database
   - Copy the connection string and use it as `DATABASE_URL`
   - OR use Railway, Supabase, or Neon (see below)

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies (`npm install`)
     - Build your app (`npm run build`)
     - Run migrations (you may need to add a build command - see below)

6. **Run Database Migrations**
   - After deployment, go to your project → Settings → Deployment
   - Add a build command: `npx prisma generate && npm run build`
   - Or manually run migrations:
     - Install Vercel CLI: `npm i -g vercel`
     - Run: `vercel env pull` to get env vars locally
     - Run: `npx prisma migrate deploy`
     - Or use Vercel's CLI: `vercel exec "npx prisma migrate deploy"`

### Vercel Build Settings:

If you need to customize, add these in Vercel dashboard:

**Build Command:**
```bash
npx prisma generate && npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

---

## 🚂 Option 2: Railway

Railway is great for full-stack apps with databases.

### Steps:

1. **Push code to GitHub** (same as above)

2. **Go to Railway**
   - Visit: https://railway.app
   - Sign up/login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "+ New"
   - Select "PostgreSQL"
   - Railway will create a database automatically
   - Copy the `DATABASE_URL` from the database service

4. **Configure Environment Variables**
   - Go to your app service → Variables
   - Add:
     - `DATABASE_URL` (from PostgreSQL service)
     - `NEXTAUTH_URL` (Railway will provide a URL like `https://your-app.up.railway.app`)
     - `NEXTAUTH_SECRET` (generate one)

5. **Update Prisma Schema for PostgreSQL**
   - Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

6. **Configure Build Settings**
   - Railway will auto-detect Next.js
   - Add a build command: `npx prisma generate && npm run build`
   - Start command: `npm start`

7. **Deploy**
   - Railway will automatically deploy
   - After deployment, open the generated URL
   - Run migrations manually or add to build:
     - Go to your app → Deployments → Latest deployment
     - Click "..." → Run Command
     - Run: `npx prisma migrate deploy`

---

## 🎨 Option 3: Render

Render is another good option with free tier.

### Steps:

1. **Push code to GitHub**

2. **Go to Render**
   - Visit: https://render.com
   - Sign up/login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name:** Your app name
   - **Environment:** Node
   - **Build Command:** `npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18 or 20

4. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Create database
   - Copy the `Internal Database URL`

5. **Set Environment Variables**
   - In your web service → Environment
   - Add:
     - `DATABASE_URL` (from PostgreSQL)
     - `NEXTAUTH_URL` (Render will provide: `https://your-app.onrender.com`)
     - `NEXTAUTH_SECRET`

6. **Update Prisma Schema**
   - Change `provider = "sqlite"` to `provider = "postgresql"`

7. **Deploy**
   - Click "Create Web Service"
   - After deployment, run migrations:
     - Go to your service → Shell
     - Run: `npx prisma migrate deploy`

---

## 🐘 Option 4: Using External Database (Supabase/Neon)

You can use a free PostgreSQL database from:

- **Supabase:** https://supabase.com (free tier available)
- **Neon:** https://neon.tech (free tier available)

### Steps for Supabase:

1. **Create Supabase Project**
   - Sign up at https://supabase.com
   - Create new project
   - Go to Settings → Database
   - Copy "Connection string" (use "URI" format)

2. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Set DATABASE_URL**
   - Use the connection string from Supabase
   - Format: `postgresql://user:password@host:port/database`

4. **Deploy your app** (Vercel/Railway/Render)
   - Use the Supabase connection string as `DATABASE_URL`

---

## 🔧 Important: Database Migration Steps

Before your app runs, you need to set up the database tables:

### Method 1: Add to Build Command (Recommended)

Most platforms let you add this to your build command:

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

### Method 2: Manual Migration

After deployment, connect to your server and run:

```bash
npx prisma generate
npx prisma migrate deploy
```

Or if using migrations for the first time:

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy
```

### Method 3: Using Prisma Migrate

1. **Create migration locally first:**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Push to production:**
   ```bash
   npx prisma migrate deploy
   ```

---

## 📝 Required Changes for Production

### 1. Update Prisma Schema

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Update next.config.js

Add your production domain to image domains:

```javascript
const nextConfig = {
  images: {
    domains: ['localhost', 'your-domain.com', 'your-app.vercel.app'],
  },
}
```

### 3. Create .env.production (Optional)

You can create a `.env.production` file locally, but it's better to set these in your hosting platform's dashboard.

---

## 🎯 Quick Reference: Commands Your Host Needs

**Build Command:**
```bash
npx prisma generate && npm run build
```

**Start Command:**
```bash
npm start
```

**Install Command:**
```bash
npm install
```

---

## ✅ After Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables set correctly
- [ ] App builds without errors
- [ ] Can access the homepage
- [ ] Can register/login
- [ ] Database is accessible
- [ ] Admin panel works (create admin user first)

---

## 🆘 Troubleshooting

### "Cannot find module @prisma/client"
- Make sure `npx prisma generate` runs before build
- Add it to your build command

### "Database connection failed"
- Check `DATABASE_URL` is set correctly
- Make sure database allows connections from your host
- For Supabase/Neon, check connection pooling settings

### "NEXTAUTH_SECRET missing"
- Set `NEXTAUTH_SECRET` in environment variables
- Make sure `NEXTAUTH_URL` matches your actual domain

### "Migration failed"
- Make sure Prisma schema uses `postgresql` not `sqlite`
- Run `npx prisma generate` first
- Check database connection string is correct

---

## 🎓 Recommended: Vercel + Supabase

**Best combination for beginners:**
1. Deploy app to Vercel (easiest Next.js deployment)
2. Use Supabase for free PostgreSQL database
3. Set environment variables in Vercel dashboard
4. Done! 🎉

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

**Need help?** Check your hosting platform's documentation or logs for specific error messages!


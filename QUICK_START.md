# ⚡ Quick Start Checklist

Follow these steps in order. Check each one off as you complete it:

## ✅ Pre-Setup Checklist

- [ ] **Node.js installed?** 
  - Open terminal and type: `node --version`
  - If you see a version number, you're good!
  - If not: Download from https://nodejs.org/

- [ ] **In the right folder?**
  - Open terminal
  - Type: `cd D:\Rose` (or your project location)
  - Type: `dir` (Windows) or `ls` (Mac) to see files

## 🚀 Setup Steps

- [ ] **Step 1: Install packages**
  ```bash
  npm install
  ```
  Wait until it finishes (2-5 minutes)

- [ ] **Step 2: Create .env file**
  - Copy `.env.example` to `.env`
  - Open `.env` in a text editor
  - Change `NEXTAUTH_SECRET` to a random string (or use: https://generate-secret.vercel.app/32)
  - Save the file

- [ ] **Step 3: Setup database**
  ```bash
  npx prisma generate
  ```
  Then:
  ```bash
  npx prisma db push
  ```

- [ ] **Step 4: Add sample data** (Optional)
  ```bash
  npm run db:seed
  ```

- [ ] **Step 5: Start the website**
  ```bash
  npm run dev
  ```

- [ ] **Step 6: Open in browser**
  - Go to: http://localhost:3000
  - You should see your shop! 🎉

## 🧪 Test It Out

- [ ] Browse products
- [ ] Register a new account
- [ ] Login
- [ ] Add items to cart
- [ ] Try checkout

## 🔐 Admin Access

- [ ] Login with: `admin@bigrose.com` / `admin123`
- [ ] Click "Admin" in navbar
- [ ] Add your own products!

---

**Need more details?** Read `SETUP_GUIDE.md` for full explanations!


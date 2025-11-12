# 🌹 START HERE - Simple Instructions

Welcome! If you're new to coding, follow these simple steps.

## 📋 What You Need First

**Install Node.js** (if you haven't already):
1. Go to https://nodejs.org/
2. Download the "LTS" version
3. Install it (just click Next, Next, Install)
4. Restart your computer

## 🎯 The 6 Steps to Get Started

### Step 1: Open Terminal
- **Windows:** Press `Windows Key + R`, type `cmd`, press Enter
- **Mac:** Press `Command + Space`, type `Terminal`, press Enter

### Step 2: Go to Your Project
Type this (press Enter after each line):

```bash
cd D:\Rose
```

### Step 3: Install Everything
Type this and wait 2-5 minutes:

```bash
npm install
```

You'll see a lot of text scrolling - that's normal! ✅

### Step 4: Setup Database
Type these two commands (one at a time):

```bash
npx prisma generate
```

Wait for it to finish, then:

```bash
npx prisma db push
```

### Step 5: Add Test Data (Optional)
This adds sample products so you can test:

```bash
npm run db:seed
```

**Test Login Info Created:**
- Admin: `admin@bigrose.com` / password: `admin123`
- User: `user@bigrose.com` / password: `user123`

### Step 6: Start Your Website!
Type:

```bash
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

**Now open your browser and go to:** `http://localhost:3000`

## 🎉 You're Done!

Your online shop is now running! You can:
- Browse products
- Register/Login
- Add items to cart
- Place orders
- Access admin panel (login as admin first)

## ⚠️ IMPORTANT: Create .env File First!

**Do this BEFORE Step 3!**

1. Open your project folder in Windows File Explorer: `D:\Rose`
2. Right-click in the folder → New → Text Document
3. Name it `.env` (make sure to include the dot at the start!)
4. Right-click the file → Open with → Notepad
5. Copy and paste this EXACT text:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="my-super-secret-key-change-this-12345-rose-shop-abcxyz"
```

6. Change the part `my-super-secret-key-change-this-12345-rose-shop-abcxyz` to ANY random text you want (keep the quotes)
7. Save the file (Ctrl+S)

**Example of what it should look like:**
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rose-shop-2024-secret-xyz789"
```

**Note:** If Windows won't let you name it `.env`, name it `env` first, then rename it to `.env` afterwards.

## 🆘 Having Problems?

**"npm is not recognized"**
→ Install Node.js from nodejs.org

**"Cannot find module"**
→ Delete the `node_modules` folder, then run `npm install` again

**Port already in use**
→ Close other programs or press `Ctrl+C` to stop, then try again

**Website won't load**
→ Make sure you ran `npm run dev` and see "Local: http://localhost:3000"

## 📚 Want More Details?

- Read `SETUP_GUIDE.md` for detailed explanations
- Read `QUICK_START.md` for a checklist version
- Read `README.md` for technical details

---

**Good luck! You've got this! 💪**


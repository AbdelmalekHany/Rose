# 🌹 The Big Rose - Setup Guide for Beginners

This guide will walk you through setting up your online shop step by step. Don't worry if you're new to coding - we'll explain everything!

## What You Need First

1. **Node.js installed** - This is like the engine that runs your website
   - Download from: https://nodejs.org/
   - Download the "LTS" version (Long Term Support)
   - During installation, make sure to check "Add to PATH"
   - After installing, open a terminal/command prompt and type: `node --version`
   - If you see a version number (like v18.17.0), you're good! ✅

## Step-by-Step Setup

### Step 1: Open Your Project Folder

1. Open your terminal/command prompt:
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
   
2. Navigate to your project folder:
   ```bash
   cd D:\Rose
   ```
   (Or wherever your project is located)

### Step 2: Install Dependencies

Think of this like downloading all the tools your website needs to work.

```bash
npm install
```

**What this does:** Downloads all the packages your website needs (like Next.js, React, database tools, etc.)

**Wait time:** 2-5 minutes (it's downloading a lot of stuff!)

**What you'll see:** A bunch of text scrolling by - that's normal! ✅

### Step 3: Create Environment File

Your website needs some secret settings (like passwords) that you don't want to share.

1. Look for a file called `.env.example` in your project
2. Copy it and rename the copy to `.env` (remove the `.example` part)

**Or do this in terminal:**
```bash
copy .env.example .env
```
(Windows) or
```bash
cp .env.example .env
```
(Mac/Linux)

3. Open the `.env` file in any text editor (Notepad, VS Code, etc.)

4. You'll see something like this:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   ```

5. **IMPORTANT:** You need to create a secret key. Here's how:
   
   **Option A - Easy way (but less secure):**
   - Just type any random long string of letters and numbers
   - Example: `my-super-secret-key-12345-rose-shop-abcxyz`
   
   **Option B - Secure way:**
   - Go to: https://generate-secret.vercel.app/32
   - Copy the generated secret
   - Paste it where it says `your-secret-key-here-change-this-in-production`

6. Save the file

### Step 4: Set Up the Database

Your website needs a database to store products, users, and orders.

```bash
npx prisma generate
```

**What this does:** Creates database tools

**Wait time:** 30 seconds

Then:
```bash
npx prisma db push
```

**What this does:** Creates your database file and tables

**Wait time:** 10 seconds

**You should see:** "Your database is now in sync with your schema" ✅

### Step 5: Add Sample Data (Optional but Recommended!)

This adds some example products so you can see how the shop works.

```bash
npm run db:seed
```

**What this does:** Adds sample products and test users to your database

**Wait time:** 10 seconds

**What you'll see:** Messages like "Created admin user", "Created product: Premium Rose Bouquet", etc.

**Test accounts created:**
- **Admin:** Email: `admin@bigrose.com` | Password: `admin123`
- **Regular User:** Email: `user@bigrose.com` | Password: `user123`

### Step 6: Start Your Website! 🚀

```bash
npm run dev
```

**What this does:** Starts your development server (makes your website available)

**Wait time:** 30 seconds

**What you'll see:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

**This means:** Your website is running! ✅

### Step 7: View Your Website

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: `http://localhost:3000`
3. You should see your beautiful online shop! 🎉

## What to Do Next

### Test the Shop:

1. **Browse Products:**
   - Click "Products" in the navigation
   - You should see the sample products we added

2. **Create an Account:**
   - Click "Register" 
   - Enter your name, email, and password
   - Click "Sign Up"

3. **Login:**
   - Use the test accounts or your new account
   - Login and explore!

4. **Try Shopping:**
   - Click on a product
   - Click "Add to Cart"
   - Go to Cart (cart icon in navbar)
   - Click "Proceed to Checkout"
   - Enter a shipping address
   - Place an order!

5. **Access Admin Panel:**
   - Login with: `admin@bigrose.com` / `admin123`
   - Click "Admin" in the navbar
   - You can add/edit/delete products here!

## Troubleshooting

### "npm is not recognized"
- **Problem:** Node.js isn't installed or not in your PATH
- **Solution:** Install Node.js from nodejs.org and restart your terminal

### "Cannot find module..."
- **Problem:** Dependencies didn't install correctly
- **Solution:** Delete the `node_modules` folder and run `npm install` again

### "Port 3000 is already in use"
- **Problem:** Something else is using port 3000
- **Solution:** Close other programs or change the port:
  ```bash
  npm run dev -- -p 3001
  ```
  Then go to `http://localhost:3001`

### "Error: ENOENT: no such file or directory"
- **Problem:** You're not in the right folder
- **Solution:** Make sure you're in `D:\Rose` (or your project folder)

### Database errors
- **Problem:** Database file might be corrupted
- **Solution:** Delete `prisma/dev.db` and run `npx prisma db push` again

## Common Commands You'll Use

```bash
npm run dev          # Start your website (do this every time you work on it)
npm run build        # Build for production (when ready to deploy)
npm run db:studio    # Open database viewer (to see/edit data visually)
```

## Need Help?

- Check the main README.md for more details
- Look for error messages - they usually tell you what's wrong
- Make sure all steps completed successfully before moving to the next one

## Next Steps After Setup

1. **Customize Products:** Add your own products through the admin panel
2. **Change Branding:** Edit colors/text in the components
3. **Add Images:** Use image URLs when creating products
4. **Deploy:** When ready, deploy to Vercel, Netlify, or your own server

---

**Remember:** Don't worry if something doesn't work the first time! Every developer goes through this. Just follow the steps one at a time, and you'll be fine! 🎯


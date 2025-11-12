# The Big Rose - Online Shop

A full-featured e-commerce platform built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog**: Browse, search, and filter products by category
- 🛒 **Shopping Cart**: Add items, update quantities, and manage your cart
- 💳 **Checkout**: Secure checkout process with order management
- 👤 **User Authentication**: Login and registration with secure password hashing
- 📦 **Admin Panel**: Manage products, orders, and view user data
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Rose
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database with sample data (optional):
```bash
npm run db:seed
```

This will create:
- Admin user: `admin@bigrose.com` / `admin123`
- Regular user: `user@bigrose.com` / `user123`
- Sample products (roses, candles, jewelry, etc.)

6. Create an admin user (if not using seed):

You can create an admin user directly in the database or through Prisma Studio:
```bash
npx prisma studio
```

In Prisma Studio, create a user and set the `role` field to `ADMIN`.

Alternatively, you can register a regular user first, then update their role to ADMIN in the database.

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating an Admin User

After setting up the database, you need to create an admin user. You can do this by:

1. Register a regular user through the website
2. Open Prisma Studio: `npx prisma studio`
3. Find your user in the User table
4. Change the `role` field from `USER` to `ADMIN`
5. Save the changes

Now you can access the admin panel at `/admin`.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── login/             # Login page
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema
└── public/                # Static assets
```

## Admin Features

- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order status
- **User Management**: View user accounts

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/cart/*` - Shopping cart operations
- `/api/orders/*` - Order management
- `/api/admin/*` - Admin-only operations

## Database Schema

The application uses Prisma with SQLite. Key models:

- **User**: User accounts with authentication
- **Product**: Product catalog
- **CartItem**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Order line items

## Payment Integration

The project is set up for Stripe integration. To enable:

1. Add your Stripe keys to `.env`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
```

2. Set up webhook endpoints (see Stripe documentation)

## Production Deployment

Before deploying to production:

1. Change `DATABASE_URL` to a production database (PostgreSQL recommended)
2. Update `NEXTAUTH_SECRET` to a secure random value
3. Set proper environment variables
4. Run database migrations: `npx prisma migrate deploy`
5. Build the application: `npm run build`

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.


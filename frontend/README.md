# Frontend README

Modern Next.js 14 frontend for Test Agency e-commerce platform.

## Features

- **Server-Side Rendering** (SSR) for SEO
- **Client-Side Navigation** for speed
- **Responsive Design** with Tailwind CSS
- **Admin Panel** with authentication
- **Image Optimization** with Next.js Image
- **Type Safety** with TypeScript

## Project Structure

```
src/
├── app/
│   ├── (public)/      # Public pages
│   │   ├── page.tsx           # Homepage
│   │   └── products/          # Product pages
│   └── admin/         # Admin panel
│       ├── login/             # Admin login
│       ├── dashboard/         # Dashboard
│       ├── products/          # Product management
│       └── categories/        # Category management
├── components/        # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── lib/              # Utilities & API clients
│   ├── api.ts                 # Axios instance
│   ├── auth.ts                # Auth service
│   ├── products.ts            # Product service
│   ├── categories.ts          # Category service
│   └── upload.ts              # Upload service
└── types/            # TypeScript definitions
    └── index.ts
```

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Test Agency
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## Routes

### Public Routes
- `/` - Homepage
- `/products` - Product listing
- `/products/[id]` - Product detail

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Create product
- `/admin/categories` - Category management

## API Integration

Uses Axios with interceptors for:
- Automatic token injection
- Token refresh on 401
- Error handling
- Request/response logging

## Authentication Flow

1. Login stores tokens in localStorage
2. Axios interceptor adds token to requests
3. On 401, automatically refreshes token
4. On refresh failure, redirects to login
5. AdminLayout protects admin routes

## Styling

Tailwind CSS with custom design system:

```css
.btn-primary      # Primary button style
.btn-secondary    # Secondary button style
.card            # Card container
.input           # Form input
.label           # Form label
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Production Build

```bash
npm run build
npm start
```

## Deployment

Deployed alongside backend on AWS Lightsail.
See [infrastructure/DEPLOYMENT.md](../infrastructure/DEPLOYMENT.md)

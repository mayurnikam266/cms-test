# Test Agency Backend

Production-ready NestJS backend for Test Agency e-commerce platform.

## Features

- ✅ Secure JWT authentication with refresh tokens
- ✅ Admin-only access control
- ✅ AWS S3 integration with pre-signed URLs
- ✅ PostgreSQL database with TypeORM
- ✅ Rate limiting and security headers
- ✅ Input validation and sanitization
- ✅ OWASP Top 10 protection

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- AWS Account with S3 bucket

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- Database credentials
- JWT secrets (generate strong 32+ character strings)
- AWS credentials and S3 bucket name
- CORS origin

### Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE test_agency_db;

# Run schema
psql -U postgres -d test_agency_db -f src/database/schema.sql
```

### Run Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Public Endpoints

- `GET /api/products` - List all active products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - List all categories
- `POST /api/auth/login` - Admin login

### Protected Admin Endpoints (requires JWT)

- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/categories` - Create category
- `POST /api/upload/signed-url` - Get S3 upload URL

## Security Features

1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control
3. **Password Hashing**: bcrypt with configurable rounds
4. **Rate Limiting**: 5 requests per 15 minutes on auth endpoints
5. **Input Validation**: class-validator on all DTOs
6. **SQL Injection Protection**: TypeORM parameterized queries
7. **CORS**: Configurable origins
8. **Security Headers**: Helmet.js
9. **S3 Security**: Private bucket with signed URLs

## Default Admin Credentials

**Email**: admin@test-agency.com  
**Password**: SecureAdminPassword123!

⚠️ **IMPORTANT**: Change these credentials after first login!

## Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication & authorization
│   ├── categories/     # Category management
│   ├── products/       # Product management
│   ├── users/          # User management
│   ├── upload/         # S3 upload service
│   ├── database/       # Database config & migrations
│   ├── app.module.ts   # Main application module
│   └── main.ts         # Application entry point
├── .env.example        # Environment variables template
└── package.json        # Dependencies
```

# 🌞 Test Agency - Solar Panels & Electronics E-commerce Platform

Production-ready, full-stack e-commerce platform for selling solar panels and electronic products. Built with modern security practices following OWASP Top 10 guidelines.

## 🚀 Features

### Security-First Architecture
- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **Admin-Only Access** - No public registration
- ✅ **Password Security** - bcrypt hashing with configurable rounds
- ✅ **Rate Limiting** on authentication endpoints
- ✅ **CORS Protection** with configurable origins
- ✅ **SQL Injection Protection** via TypeORM parameterized queries
- ✅ **Input Validation** using class-validator
- ✅ **Security Headers** via Helmet.js
- ✅ **Private S3 Bucket** with pre-signed URLs
- ✅ **CSRF Protection** built-in

### Product Management
- Full CRUD operations for products and categories
- Image upload to AWS S3 with signed URLs
- Product status management (Active/Inactive/Draft)
- Category-based filtering
- Stock management
- Specifications and detailed descriptions

### Admin Dashboard
- Secure admin-only login
- Product statistics and analytics
- Category management
- Image upload interface
- Real-time product status updates

### Public Website
- Modern, responsive design
- Product browsing and filtering
- Detailed product pages
- Category navigation
- SEO-friendly structure

## 📁 Project Structure

```
test-agency/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication & JWT
│   │   ├── categories/     # Category management
│   │   ├── products/       # Product management
│   │   ├── users/          # User management
│   │   ├── upload/         # S3 upload service
│   │   ├── database/       # DB config & migrations
│   │   ├── app.module.ts   # Main module
│   │   └── main.ts         # Entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/  # Public pages
│   │   │   └── admin/     # Admin panel
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # API clients & utilities
│   │   └── types/         # TypeScript definitions
│   ├── .env.example
│   └── package.json
│
├── infrastructure/         # Deployment configs
│   ├── DEPLOYMENT.md      # Step-by-step deployment guide
│   ├── ecosystem.config.js # PM2 configuration
│   ├── nginx.conf         # Nginx reverse proxy
│   ├── backup-db.sh       # Database backup script
│   ├── deploy.sh          # Deployment automation
│   └── s3-iam-policy.json # S3 IAM policy
│
├── docs/                  # Additional documentation
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator
- **Security**: Helmet.js, bcrypt, rate-limit
- **Storage**: AWS S3
- **Process Manager**: PM2

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Type Safety**: TypeScript

### Infrastructure
- **Hosting**: AWS Lightsail
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **Database**: PostgreSQL (on Lightsail)
- **Object Storage**: AWS S3

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- AWS Account (for S3)
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd test-agency
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Create PostgreSQL database
createdb test_agency_db

# Run database schema
psql test_agency_db < src/database/schema.sql

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local
nano .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3001`

### 4. Default Admin Credentials

```
Email: admin@test-agency.com
Password: SecureAdminPassword123!
```

⚠️ **Change these immediately after first login!**

## 🔐 Security Configuration

### JWT Tokens

Generate secure random strings for JWT secrets:

```bash
# Generate 32-character random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to backend `.env`:
```env
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
```

### Database Security

- Use strong passwords
- Never expose database credentials
- Enable SSL in production
- Regular backups

### S3 Security

- Bucket is **private** by default
- Images served via pre-signed URLs
- IAM user with minimal permissions
- See `infrastructure/s3-iam-policy.json`

## 📊 API Endpoints

### Public Endpoints

```
GET  /api/products           # List all active products
GET  /api/products/:id       # Get product details
GET  /api/categories         # List categories
POST /api/auth/login         # Admin login
```

### Protected Admin Endpoints (requires JWT)

```
POST   /api/products         # Create product
PUT    /api/products/:id     # Update product
DELETE /api/products/:id     # Delete product
PUT    /api/products/:id/status  # Update status
GET    /api/products/stats   # Get statistics

POST   /api/categories       # Create category
PUT    /api/categories/:id   # Update category
DELETE /api/categories/:id   # Delete category

POST   /api/upload/signed-url    # Get S3 upload URL
POST   /api/upload/delete/:key   # Delete S3 file

GET    /api/auth/me          # Get current user
POST   /api/auth/logout      # Logout
POST   /api/auth/refresh     # Refresh token
```

## 🚢 Production Deployment

### AWS Lightsail Deployment

Complete step-by-step guide: [infrastructure/DEPLOYMENT.md](infrastructure/DEPLOYMENT.md)

### Quick Deployment Steps

1. **Create Lightsail Instance** ($10-20/month)
2. **Configure Networking** (Static IP, Firewall)
3. **Install Dependencies** (Node.js, PostgreSQL, Nginx)
4. **Clone & Build Application**
5. **Configure PM2** for process management
6. **Setup Nginx** reverse proxy
7. **Install SSL Certificate** (Let's Encrypt)
8. **Configure S3 Bucket** for images
9. **Setup Monitoring & Backups**

### Environment Variables

#### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=testadmin
DATABASE_PASSWORD=SECURE_PASSWORD
DATABASE_NAME=test_agency_db

JWT_SECRET=LONG_RANDOM_STRING
JWT_REFRESH_SECRET=LONG_RANDOM_STRING

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET
AWS_S3_BUCKET=test-agency-products

NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_NAME=Test Agency
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📖 Database Schema

### Tables

- **users** - Admin users with authentication
- **categories** - Product categories
- **products** - Product listings
- **images** - Product images (S3 references)

### Key Features

- UUID primary keys for security
- Automatic timestamps
- Indexes for performance
- Foreign key constraints
- Cascading deletes where appropriate

See [backend/src/database/schema.sql](backend/src/database/schema.sql) for complete schema.

## 🔧 Development

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Monitoring

### View Logs

```bash
# PM2 logs
pm2 logs test-agency-backend
pm2 logs test-agency-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Process Monitoring

```bash
# View status
pm2 status

# Monitor resources
pm2 monit

# Restart services
pm2 restart all
```

## 💾 Backup & Recovery

### Automatic Daily Backups

```bash
# Setup cron job
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * /home/ubuntu/test-agency/infrastructure/backup-db.sh
```

### Manual Backup

```bash
# Backup database
pg_dump -U testadmin test_agency_db > backup.sql

# Restore database
psql -U testadmin test_agency_db < backup.sql
```

## 🔒 Security Checklist

- [x] JWT authentication with refresh tokens
- [x] Admin-only access (no public registration)
- [x] Password hashing (bcrypt)
- [x] Rate limiting on auth endpoints
- [x] Input validation on all endpoints
- [x] SQL injection protection (TypeORM)
- [x] CORS configuration
- [x] Security headers (Helmet)
- [x] Private S3 bucket
- [x] Pre-signed URLs for images
- [x] HTTPS/SSL in production
- [x] Environment variables for secrets
- [x] Firewall configuration
- [x] Regular security updates

## 📈 Performance Optimization

- Nginx reverse proxy with caching
- Gzip compression enabled
- Database indexing on key columns
- PM2 cluster mode (optional)
- CDN for static assets (optional)
- Image optimization before upload

## 💰 Cost Estimate

### Monthly Costs

- **Lightsail Instance**: $10-20/month
- **S3 Storage**: ~$1-5/month (for images)
- **Data Transfer**: 1TB free with Lightsail
- **Domain**: $12/year (~$1/month)

**Total**: ~$15-30/month

## 🤝 Support & Maintenance

### Regular Tasks

- **Weekly**: Check logs and monitor services
- **Monthly**: Review S3 storage usage
- **Monthly**: Test backup restoration
- **Quarterly**: Update dependencies
- **Quarterly**: Security audit

### Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
npm outdated
npm update
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS Lightsail Documentation](https://aws.amazon.com/lightsail/docs/)

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
```bash
pm2 logs test-agency-backend
# Check database connection
psql -U testadmin -d test_agency_db
```

**Frontend build fails**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Database connection issues**
```bash
sudo systemctl status postgresql
# Check credentials in .env
```

**S3 upload failing**
```bash
# Verify AWS credentials
aws s3 ls s3://test-agency-products
# Check IAM permissions
```

## 📝 License

This project is proprietary and confidential.

## 👨‍💻 Author

Built with ❤️ for Test Agency

---

## 🎯 Next Steps

1. ✅ Setup development environment
2. ✅ Configure database
3. ✅ Test admin login
4. ✅ Create sample categories
5. ✅ Add test products
6. ✅ Upload product images
7. ✅ Deploy to production
8. ✅ Configure domain and SSL
9. ✅ Setup monitoring
10. ✅ Launch! 🚀

For deployment instructions, see [infrastructure/DEPLOYMENT.md](infrastructure/DEPLOYMENT.md)
# cms

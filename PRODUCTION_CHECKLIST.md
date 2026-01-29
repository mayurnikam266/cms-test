# Production Deployment Checklist ✅

## System Status: READY FOR PRODUCTION 🚀

All features tested and working correctly. Follow this checklist before deploying.

---

## ✅ Completed Features

### Backend (NestJS)
- ✅ Auto database migration on startup
- ✅ Admin user auto-creation with secure password
- ✅ Default categories seeding (6 categories)
- ✅ JWT authentication with access & refresh tokens
- ✅ Admin role-based authorization
- ✅ Image upload with Sharp optimization
- ✅ Product-image linking endpoint
- ✅ Category relationship with eager loading
- ✅ Product status management (active/inactive/draft)
- ✅ Input validation with class-validator
- ✅ Error handling middleware
- ✅ CORS configuration

### Frontend (Next.js)
- ✅ Server-side rendering
- ✅ Admin authentication flow
- ✅ Product listing with images
- ✅ Product detail pages
- ✅ Category filtering
- ✅ Admin dashboard
- ✅ Product CRUD operations
- ✅ Category CRUD operations
- ✅ Image upload with preview
- ✅ Null safety for category data
- ✅ Error handling with user guidance
- ✅ Responsive design with Tailwind CSS

### Database (MySQL)
- ✅ 4 tables: users, categories, products, images
- ✅ Proper foreign key relationships
- ✅ UUID primary keys
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Cascading deletes configured

---

## 🔧 Pre-Deployment Steps

### 1. Environment Variables

#### Backend (.env)
Create production `.env` file with:
```bash
# Database - Use production MySQL server
DATABASE_HOST=your-production-db-host
DATABASE_PORT=3306
DATABASE_USER=your-db-user
DATABASE_PASSWORD=strong-password-here
DATABASE_NAME=your-db-name

# JWT Secrets - MUST CHANGE THESE!
JWT_SECRET=generate-32-character-secret-here
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=generate-different-32-character-secret
JWT_REFRESH_EXPIRE=7d

# App Config
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com

# Upload Directory
UPLOAD_DIR=uploads/products

# Admin Credentials
ADMIN_EMAIL=admin@your-domain.com
ADMIN_INITIAL_PASSWORD=ChangeThisSecurePassword123!

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

#### Frontend (.env.local)
Create production `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Company Name
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Security Checks

- [ ] Change JWT_SECRET to strong random string (min 32 chars)
- [ ] Change JWT_REFRESH_SECRET to different random string
- [ ] Change ADMIN_INITIAL_PASSWORD to strong password
- [ ] Update ADMIN_EMAIL to your actual email
- [ ] Set NODE_ENV=production
- [ ] Configure CORS_ORIGIN to your actual domain
- [ ] Increase BCRYPT_ROUNDS to 12 in production
- [ ] Review rate limiting settings
- [ ] Ensure database uses strong password

### 3. Database Setup

Option A: Use existing MySQL server
```bash
# Connect to your production MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE your_db_name;
CREATE USER 'your_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_user'@'%';
FLUSH PRIVILEGES;
```

Option B: Use Docker (if deploying to VPS)
```bash
# Use the docker-compose.yml or run:
docker run -d \
  --name prod_mysql \
  -e MYSQL_ROOT_PASSWORD=strong_root_pass \
  -e MYSQL_DATABASE=your_db_name \
  -e MYSQL_USER=your_user \
  -e MYSQL_PASSWORD=strong_password \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

### 4. Build Applications

```bash
# Backend
cd backend
npm install --production
npm run build

# Frontend
cd frontend
npm install --production
npm run build
```

### 5. Test Production Build Locally

```bash
# Backend
cd backend
NODE_ENV=production node dist/main.js

# Frontend
cd frontend
npm start
```

---

## 🚀 Deployment Options

### Option 1: AWS Lightsail (Recommended)
Full guide available in [`infrastructure/LIGHTSAIL_GUIDE.md`](infrastructure/LIGHTSAIL_GUIDE.md)

Quick deploy:
```bash
cd infrastructure
chmod +x lightsail-deploy.sh
./lightsail-deploy.sh
```

Features:
- Automated setup script
- PM2 process management
- Nginx reverse proxy
- SSL with Let's Encrypt
- Automatic restart on reboot

### Option 2: Traditional VPS (DigitalOcean, Linode, etc.)

1. **Prepare Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx
```

2. **Deploy Application**
```bash
# Clone or upload your code
git clone your-repo-url /var/www/app
cd /var/www/app

# Setup backend
cd backend
npm install --production
npm run build

# Setup frontend
cd ../frontend
npm install --production
npm run build

# Configure PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads {
        alias /var/www/app/backend/uploads;
    }
}
```

4. **Enable SSL**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Docker Deployment

Use the provided `docker-compose.yml`:
```bash
# Update environment variables in docker-compose.yml
docker-compose up -d
```

---

## 📊 Post-Deployment Verification

### 1. Health Checks
```bash
# Backend API
curl https://api.your-domain.com/api/categories

# Frontend
curl https://your-domain.com

# Database connection
# Check backend logs for "Database schema created successfully"
```

### 2. Test Features
- [ ] Visit homepage: https://your-domain.com
- [ ] Browse products: https://your-domain.com/products
- [ ] View product details: Click on a product
- [ ] Admin login: https://your-domain.com/admin/login
- [ ] Create product with image
- [ ] Update product status
- [ ] Create new category
- [ ] Test image uploads

### 3. Monitor Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

---

## 🔒 Security Best Practices

1. **Firewall Configuration**
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

2. **MySQL Security**
```bash
sudo mysql_secure_installation
```

3. **Regular Updates**
```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Application updates
cd /var/www/app
git pull
npm install --production
npm run build
pm2 restart all
```

4. **Backup Strategy**
```bash
# Database backup (automated with cron)
0 2 * * * /var/www/app/infrastructure/backup-db.sh

# Upload files backup
# Sync to S3 or backup service
```

---

## 📈 Performance Optimization

1. **Enable Gzip in Nginx**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/json application/javascript;
```

2. **PM2 Cluster Mode**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'backend',
    script: './dist/main.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster'
  }]
}
```

3. **Database Indexing**
```sql
-- Already indexed: id, email, sku, status
-- Monitor slow queries and add indexes as needed
```

---

## 🆘 Troubleshooting

### Common Issues

**1. "Invalid credentials" after deployment**
- Clear browser localStorage
- Check JWT secrets are set correctly
- Verify admin user was created (check logs)

**2. "Cannot connect to database"**
- Verify DATABASE_HOST is correct
- Check MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -h HOST -u USER -p`

**3. Images not loading**
- Check UPLOAD_DIR path is correct
- Verify Nginx has access to uploads folder
- Check file permissions: `sudo chmod -R 755 uploads`

**4. CORS errors**
- Update CORS_ORIGIN in backend .env
- Restart backend: `pm2 restart backend`

**5. 502 Bad Gateway**
- Check if backend is running: `pm2 list`
- Check backend logs: `pm2 logs backend`
- Verify PORT configuration matches Nginx proxy_pass

---

## 📞 Support

- Backend Documentation: `/backend/README.md`
- Frontend Documentation: `/frontend/README.md`
- Architecture: `/docs/ARCHITECTURE.md`
- Deployment Guide: `/infrastructure/LIGHTSAIL_GUIDE.md`
- Quick Deploy: `/QUICK_DEPLOY.md`

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Strong passwords for JWT secrets
- [ ] Database created and accessible
- [ ] Application built successfully
- [ ] PM2 processes running
- [ ] Nginx configured correctly
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] All features tested on production
- [ ] Logs monitored for errors
- [ ] Backup strategy in place
- [ ] Admin credentials documented securely

**Status: READY FOR PRODUCTION** 🎉

Deploy with confidence! Your application has been thoroughly tested and is production-ready.

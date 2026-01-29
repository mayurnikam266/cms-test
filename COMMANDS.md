# Quick Command Reference 🚀

Essential commands for development and production management.

---

## 🏗️ Development

### Start Development Servers

```bash
# Start MySQL (Docker)
docker start test_agency_mysql

# Backend (Terminal 1)
cd backend
npm run start:dev

# Frontend (Terminal 2)
cd frontend
PORT=3001 npm run dev
```

### Access Applications
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Admin Panel: http://localhost:3001/admin/login

### Default Admin Credentials
```
Email: admin@test-agency.com
Password: SecureAdminPassword123!
```

---

## 🗄️ Database Operations

### Access MySQL Container
```bash
docker exec -it test_agency_mysql mysql -utestuser -ptestpass test_agency_db
```

### Common Queries
```sql
-- View all tables
SHOW TABLES;

-- Check admin user
SELECT id, email, role FROM users;

-- Check categories
SELECT id, name FROM categories;

-- Check products with categories
SELECT p.id, p.name, p.status, c.name as category 
FROM products p 
LEFT JOIN categories c ON p.categoryId = c.id;

-- Check product images
SELECT p.name, i.url, i.isFeatured 
FROM products p 
LEFT JOIN images i ON i.productId = p.id;
```

### Reset Database
```bash
# Restart backend to auto-migrate
pm2 restart backend

# Or manually drop and recreate
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db \
  -e "DROP DATABASE test_agency_db; CREATE DATABASE test_agency_db;"
```

---

## 🧪 Testing APIs

### Test Auth
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test-agency.com","password":"SecureAdminPassword123!"}'

# Get token for subsequent requests
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test-agency.com","password":"SecureAdminPassword123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")
```

### Test Categories
```bash
# Get all categories
curl http://localhost:3000/api/categories

# Get single category
curl http://localhost:3000/api/categories/{id}

# Create category (admin only)
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Category","description":"Test"}'
```

### Test Products
```bash
# Get all products
curl http://localhost:3000/api/products

# Get products by category
curl "http://localhost:3000/api/products?categoryId={categoryId}"

# Get single product
curl http://localhost:3000/api/products/{id}

# Create product (admin only)
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Product",
    "description":"Description",
    "price":99.99,
    "categoryId":"{categoryId}",
    "stock":10,
    "status":"active"
  }'

# Update product status
curl -X PUT http://localhost:3000/api/products/{id}/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'

# Add image to product
curl -X POST http://localhost:3000/api/products/{id}/images \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url":"/uploads/products/image.jpg",
    "key":"image.jpg",
    "isFeatured":true
  }'
```

---

## 🔧 Process Management (Production)

### PM2 Commands
```bash
# Start applications
pm2 start ecosystem.config.js

# View status
pm2 list

# View logs
pm2 logs
pm2 logs backend
pm2 logs frontend

# Restart
pm2 restart all
pm2 restart backend
pm2 restart frontend

# Stop
pm2 stop all
pm2 stop backend

# Monitor
pm2 monit

# Save process list
pm2 save

# Startup script
pm2 startup
```

### Check Running Processes
```bash
# Check if ports are in use
lsof -ti:3000  # Backend
lsof -ti:3001  # Frontend

# Kill processes on ports
lsof -ti:3000,3001 | xargs kill -9

# Check Node processes
ps aux | grep node
```

---

## 🌐 Nginx Commands

### Manage Nginx
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Edit Configuration
```bash
# Edit site configuration
sudo nano /etc/nginx/sites-available/your-site

# Enable site
sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/

# Remove site
sudo rm /etc/nginx/sites-enabled/your-site
```

---

## 📦 Deployment

### Quick Deploy (AWS Lightsail)
```bash
cd infrastructure
chmod +x lightsail-deploy.sh
./lightsail-deploy.sh
```

### Manual Deploy
```bash
# Pull latest code
git pull origin main

# Backend
cd backend
npm install --production
npm run build
pm2 restart backend

# Frontend
cd frontend
npm install --production
npm run build
pm2 restart frontend
```

### Database Backup
```bash
# Manual backup
docker exec test_agency_mysql mysqldump -utestuser -ptestpass test_agency_db > backup.sql

# Restore backup
docker exec -i test_agency_mysql mysql -utestuser -ptestpass test_agency_db < backup.sql

# Automated backup (use provided script)
./infrastructure/backup-db.sh
```

---

## 🔍 Debugging

### Check Application Health
```bash
# Full system check
curl http://localhost:3000/api/categories >/dev/null && echo "✅ Backend" || echo "❌ Backend"
curl http://localhost:3001 >/dev/null && echo "✅ Frontend" || echo "❌ Frontend"

# Check database connection
docker exec test_agency_mysql mysql -utestuser -ptestpass -e "SELECT 1"
```

### Common Issues

**Backend not starting**
```bash
# Check logs
cd backend
npm run start:dev 2>&1 | tee error.log

# Check if port is in use
lsof -ti:3000
```

**Frontend not building**
```bash
# Clear cache
cd frontend
rm -rf .next
npm run build
```

**Database connection failed**
```bash
# Check if MySQL is running
docker ps | grep mysql

# Check connection
docker exec test_agency_mysql mysql -utestuser -ptestpass -e "SHOW DATABASES;"
```

**Invalid credentials error**
```bash
# Clear browser cache/localStorage
# Or check if admin user exists
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db \
  -e "SELECT email, role FROM users WHERE role='admin';"
```

---

## 🛠️ Maintenance

### Update Dependencies
```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Clear Caches
```bash
# Backend
cd backend
rm -rf dist/
rm -rf node_modules/.cache/

# Frontend
cd frontend
rm -rf .next/
rm -rf node_modules/.cache/
```

### Check Disk Space
```bash
# System
df -h

# Docker
docker system df

# Upload directory
du -sh backend/uploads/
```

---

## 📊 Monitoring

### System Resources
```bash
# CPU and Memory
top
htop

# Disk usage
df -h

# Network
netstat -tuln | grep -E ':(3000|3001|3306)'
```

### Application Metrics
```bash
# PM2 monitoring
pm2 monit

# Check memory usage
pm2 list

# View detailed info
pm2 show backend
pm2 show frontend
```

---

## 🔐 Security

### SSL Certificate (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Renew certificate
sudo certbot renew

# Test auto-renewal
sudo certbot renew --dry-run
```

### Firewall
```bash
# Check status
sudo ufw status

# Allow ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS

# Enable firewall
sudo ufw enable
```

---

## 📝 Logs

### Application Logs
```bash
# PM2 logs
pm2 logs backend --lines 100
pm2 logs frontend --lines 100

# Follow logs
pm2 logs backend --follow
```

### System Logs
```bash
# Nginx
sudo tail -f /var/log/nginx/error.log

# MySQL
sudo tail -f /var/log/mysql/error.log

# System
sudo journalctl -u nginx -f
sudo journalctl -u mysql -f
```

---

## 🎯 Quick Fixes

### Restart Everything
```bash
# Kill all processes
lsof -ti:3000,3001 | xargs kill -9

# Start fresh
cd backend && npm run start:dev &
cd frontend && PORT=3001 npm run dev &
```

### Reset Admin Password
```bash
# In MySQL
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e \
  "UPDATE users SET password='$2b$10$...' WHERE email='admin@test-agency.com';"

# Or restart backend to recreate admin with default password
```

### Fix Image Permissions
```bash
cd backend
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

---

**Pro Tip**: Bookmark this file for quick reference during development and production operations! 🔖

# Manual AWS Lightsail Deployment Guide
## Deploy via GitHub Clone - Step by Step

---

## 📋 What You'll Deploy

- NestJS Backend (Node.js)
- Next.js Frontend
- MySQL Database
- Nginx Reverse Proxy
- PM2 Process Manager

**Time Required:** 45-60 minutes  
**Cost:** $10-20/month

---

## Step 1: Create AWS Lightsail Instance

### 1.1 Login and Create Instance

1. Go to https://lightsail.aws.amazon.com/
2. Click **"Create instance"**
3. Select:
   - **Instance location:** Choose your region (e.g., Mumbai, US East, Singapore)
   - **Platform:** Linux/Unix
   - **Blueprint:** OS Only → **Ubuntu 22.04 LTS**
4. Choose instance plan:
   - **$10/month:** 2GB RAM, 1 vCPU, 60GB SSD (Recommended)
   - **$20/month:** 4GB RAM, 2 vCPUs (For more traffic)
5. Name: `test-agency-prod`
6. Click **"Create instance"**
7. Wait 2-3 minutes until status shows "Running"

### 1.2 Setup Static IP

1. Click on your instance name
2. Go to **"Networking"** tab
3. Click **"Create static IP"**
4. Click **"Create"**
5. **Copy and save your static IP** (e.g., 13.127.45.123)

### 1.3 Configure Firewall

1. In Networking tab → IPv4 Firewall
2. Click **"+ Add rule"** three times and add:
   - **HTTP** - Port 80 - TCP
   - **HTTPS** - Port 443 - TCP
   - **Custom** - Port 3000 - TCP (for testing)
   - **Custom** - Port 3001 - TCP (for testing)

---

## Step 2: Connect to Your Instance

### Option A: Browser SSH (Easiest)

1. On instance page, click **"Connect using SSH"** button
2. Terminal opens in browser

### Option B: SSH from Terminal

```bash
# Download key from: Account → SSH Keys
ssh -i ~/Downloads/LightsailDefaultKey-*.pem ubuntu@YOUR_STATIC_IP
```

---

## Step 3: Initial Server Setup

### 3.1 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 3.2 Install Node.js 20

```bash
# Add Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version   # Should show v20.x
npm --version
```

### 3.3 Install MySQL

```bash
# Install MySQL
sudo apt install -y mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL (set root password)
sudo mysql

# In MySQL prompt, paste these commands:
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword123!';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Now login with password
mysql -u root -p
# Enter: YourRootPassword123!
```

### 3.4 Create Database and User

```sql
-- In MySQL prompt, run:

CREATE DATABASE test_agency_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';

GRANT ALL PRIVILEGES ON test_agency_db.* TO 'testuser'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

```bash
# Test login with new user
mysql -u testuser -p
# Enter: YourSecurePassword123!
# Type: EXIT
```

---

## Step 4: Clone Your Application

### 4.1 Install Git

```bash
sudo apt install -y git
```

### 4.2 Clone Repository

```bash
# Create directory
sudo mkdir -p /var/www
cd /var/www

# Clone your repository
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git test-agency

# Set ownership
sudo chown -R ubuntu:ubuntu /var/www/test-agency

# Navigate to project
cd /var/www/test-agency
```

---

## Step 5: Setup Backend

### 5.1 Create Backend Environment File

```bash
cd /var/www/test-agency/backend

# Create .env file
nano .env
```

**Paste this configuration (update passwords):**

```env
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=testuser
DATABASE_PASSWORD=YourSecurePassword123!
DATABASE_NAME=test_agency_db

# JWT Secrets - Generate with: openssl rand -base64 64
JWT_SECRET=generate-a-long-random-string-here-use-openssl-command
JWT_REFRESH_SECRET=generate-another-long-random-string-here

# CORS
FRONTEND_URL=http://YOUR_STATIC_IP:3001

# File Upload
UPLOAD_DIR=/var/www/test-agency/backend/uploads
MAX_FILE_SIZE=10485760
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Generate JWT secrets:**

```bash
# Run these commands and copy output into .env file
echo "JWT_SECRET:"
openssl rand -base64 64

echo "JWT_REFRESH_SECRET:"
openssl rand -base64 64

# Edit .env again and paste the generated secrets
nano .env
```

### 5.2 Install Backend Dependencies

```bash
cd /var/www/test-agency/backend

# Install packages
npm install
```

### 5.3 Setup Database Schema

```bash
# Import database schema
mysql -u testuser -p test_agency_db < src/database/schema-mysql.sql
# Enter password: YourSecurePassword123!

# Verify tables created
mysql -u testuser -p test_agency_db -e "SHOW TABLES;"
```

### 5.4 Create Uploads Directory

```bash
mkdir -p uploads/products
chmod 755 uploads
```

### 5.5 Build Backend (if TypeScript)

```bash
npm run build
```

---

## Step 6: Setup Frontend

### 6.1 Create Frontend Environment File

```bash
cd /var/www/test-agency/frontend

# Create .env.local file
nano .env.local
```

**Paste this (replace YOUR_STATIC_IP):**

```env
NEXT_PUBLIC_API_URL=http://YOUR_STATIC_IP:3000
NEXT_PUBLIC_FRONTEND_URL=http://YOUR_STATIC_IP:3001
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### 6.2 Install Frontend Dependencies

```bash
# Install packages
npm install
```

### 6.3 Build Frontend

```bash
# Build for production
npm run build
```

This will take 2-5 minutes.

---

## Step 7: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

---

## Step 8: Start Applications with PM2

### 8.1 Start Backend

```bash
cd /var/www/test-agency/backend

# Start backend
pm2 start npm --name "backend" -- run dev

# Or for production build:
# pm2 start npm --name "backend" -- start
```

### 8.2 Start Frontend

```bash
cd /var/www/test-agency/frontend

# Start frontend on port 3001
pm2 start npm --name "frontend" -- start -- -p 3001
```

### 8.3 Configure PM2

```bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup systemd

# Copy and run the command it outputs (will look like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### 8.4 Verify Applications

```bash
# Check status
pm2 status

# Check logs
pm2 logs backend --lines 20
pm2 logs frontend --lines 20

# Test backend
curl http://localhost:3000/api/categories

# Test frontend
curl http://localhost:3001
```

---

## Step 9: Install and Configure Nginx

### 9.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 9.2 Create Nginx Configuration

```bash
# Create new configuration file
sudo nano /etc/nginx/sites-available/test-agency
```

**Paste this configuration (replace YOUR_STATIC_IP with your domain or IP):**

```nginx
server {
    listen 80;
    server_name YOUR_STATIC_IP;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Frontend - Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Backend API - NestJS
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Serve uploaded files
    location /uploads {
        alias /var/www/test-agency/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### 9.3 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/test-agency /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Should show:
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 9.4 Start Nginx

```bash
# Restart Nginx
sudo systemctl restart nginx

# Enable on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Step 10: Create Admin User

```bash
# Connect to database
mysql -u testuser -p test_agency_db
# Enter password: YourSecurePassword123!
```

**In MySQL prompt, paste:**

```sql
INSERT INTO users (id, email, password, firstName, lastName, role, isActive)
VALUES (
  UUID(),
  'admin@test-agency.com',
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
  'Admin',
  'User',
  'admin',
  true
);

SELECT email, role FROM users WHERE email = 'admin@test-agency.com';

EXIT;
```

**Default admin credentials:**
- Email: `admin@test-agency.com`
- Password: `SecureAdminPassword123!`

---

## Step 11: Test Your Deployment

### 11.1 Test from Browser

Open your browser and go to:

**Frontend:**
```
http://YOUR_STATIC_IP
```

**Backend API:**
```
http://YOUR_STATIC_IP/api/categories
```

**Admin Login:**
```
http://YOUR_STATIC_IP/admin/login
```

### 11.2 Test from Server

```bash
# Test backend
curl http://localhost:3000/api/categories

# Test frontend
curl http://localhost:3001

# Test Nginx
curl http://localhost/api/categories
```

### 11.3 Check Logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Step 12: Setup SSL (If You Have Domain)

**Skip this if using IP address only**

### 12.1 Point Domain to IP

Go to your domain registrar and add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_STATIC_IP | 3600 |
| A | www | YOUR_STATIC_IP | 3600 |

Wait 5-30 minutes for DNS propagation.

### 12.2 Update Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/test-agency

# Change this line:
server_name YOUR_STATIC_IP;

# To:
server_name yourdomain.com www.yourdomain.com;

# Save and test
sudo nginx -t
sudo systemctl reload nginx
```

### 12.3 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)
```

### 12.4 Update Environment Variables

```bash
# Update backend .env
nano /var/www/test-agency/backend/.env
# Change: FRONTEND_URL=https://yourdomain.com

# Update frontend .env.local
nano /var/www/test-agency/frontend/.env.local
# Change both URLs to use https://yourdomain.com

# Restart applications
pm2 restart all
```

### 12.5 Test Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Renewal is automatic (runs twice daily)
```

---

## Step 13: Setup Firewall (UFW)

```bash
# Allow OpenSSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 14: Setup Database Backup

### 14.1 Create Backup Script

```bash
# Create backup directory
mkdir -p ~/backups

# Create backup script
nano ~/backup-database.sh
```

**Paste this:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$HOME/backups"
DB_NAME="test_agency_db"
DB_USER="testuser"
DB_PASS="YourSecurePassword123!"

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup-$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup-*.sql" -mtime +7 -delete

echo "Backup completed: backup-$DATE.sql"
```

**Save and make executable:**

```bash
chmod +x ~/backup-database.sh

# Test backup
./backup-database.sh

# Check backup created
ls -lh ~/backups/
```

### 14.2 Setup Automated Backups

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * /home/ubuntu/backup-database.sh >> /home/ubuntu/backups/backup.log 2>&1
```

---

## 📊 Monitoring Commands

### Check Application Status

```bash
# PM2 status
pm2 status

# Detailed process info
pm2 show backend
pm2 show frontend

# Real-time monitoring
pm2 monit

# View logs
pm2 logs backend --lines 50
pm2 logs frontend --lines 50
```

### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU and processes
top
# Press 'q' to exit
```

### Check Services

```bash
# Nginx status
sudo systemctl status nginx

# MySQL status
sudo systemctl status mysql

# Check ports
sudo lsof -i :80
sudo lsof -i :3000
sudo lsof -i :3001
```

---

## 🔄 Deploying Updates

### Method 1: Git Pull

```bash
cd /var/www/test-agency

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
pm2 restart backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart frontend

# Check status
pm2 status
```

### Method 2: Manual Upload

```bash
# On your local machine
cd /Users/mayurnikam/mytasks/freelance/demo
git archive --format=tar.gz -o update.tar.gz HEAD
scp update.tar.gz ubuntu@YOUR_IP:~/

# On server
cd /var/www/test-agency
tar -xzf ~/update.tar.gz

# Then rebuild and restart
cd backend && npm install && pm2 restart backend
cd ../frontend && npm install && npm run build && pm2 restart frontend
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs backend --lines 100

# Check if port is in use
sudo lsof -i :3000

# Restart backend
pm2 restart backend

# Test database connection
mysql -u testuser -p test_agency_db
```

### Frontend Build Failed

```bash
# Clear cache and rebuild
cd /var/www/test-agency/frontend
rm -rf .next node_modules
npm install
npm run build
pm2 restart frontend
```

### Nginx Errors

```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Database Connection Error

```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u testuser -p test_agency_db

# Check credentials in .env file
cat /var/www/test-agency/backend/.env
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process (replace PID)
sudo kill -9 PID

# Restart application
pm2 restart backend
```

---

## 📱 Useful Commands

### PM2 Commands

```bash
pm2 status              # Show all processes
pm2 restart all         # Restart all processes
pm2 stop all           # Stop all processes
pm2 delete all         # Remove all processes
pm2 logs               # Show all logs
pm2 logs backend       # Show backend logs only
pm2 flush              # Clear log files
pm2 save               # Save process list
```

### Nginx Commands

```bash
sudo nginx -t                      # Test configuration
sudo systemctl start nginx         # Start Nginx
sudo systemctl stop nginx          # Stop Nginx
sudo systemctl restart nginx       # Restart Nginx
sudo systemctl reload nginx        # Reload config without restart
sudo systemctl status nginx        # Check status
```

### MySQL Commands

```bash
mysql -u testuser -p test_agency_db              # Connect to database
mysqldump -u testuser -p test_agency_db > backup.sql   # Backup database
mysql -u testuser -p test_agency_db < backup.sql       # Restore database
sudo systemctl restart mysql                           # Restart MySQL
```

### System Commands

```bash
sudo reboot                # Restart server
df -h                      # Disk space
free -h                    # Memory usage
top                        # CPU usage
sudo systemctl status      # System status
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Nginx serving on port 80/443
- [ ] Admin login works
- [ ] Can create/edit products
- [ ] Can create/edit categories
- [ ] Quote request system works
- [ ] Contact form works
- [ ] Image uploads work
- [ ] Database backups scheduled
- [ ] SSL certificate installed (if domain)
- [ ] Changed default admin password
- [ ] Firewall configured
- [ ] PM2 startup script enabled

---

## 🎉 Your Site is Live!

**Access URLs:**

If using IP:
- Frontend: `http://YOUR_STATIC_IP`
- Admin: `http://YOUR_STATIC_IP/admin/login`
- API: `http://YOUR_STATIC_IP/api`

If using domain:
- Frontend: `https://yourdomain.com`
- Admin: `https://yourdomain.com/admin/login`
- API: `https://yourdomain.com/api`

**Admin Login:**
- Email: `admin@test-agency.com`
- Password: `SecureAdminPassword123!`

**Important: Change admin password immediately after first login!**

---

## 📞 Need Help?

Common issues and solutions:

1. **Can't access website** - Check firewall rules in Lightsail
2. **502 Bad Gateway** - Backend not running, check `pm2 status`
3. **Database connection error** - Check credentials in `.env`
4. **Images not loading** - Check uploads folder permissions
5. **SSL not working** - Verify DNS propagation with `dig yourdomain.com`

**Check logs:**
```bash
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

Good luck with your deployment! 🚀

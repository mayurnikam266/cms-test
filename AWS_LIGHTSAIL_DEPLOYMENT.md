# Complete AWS Lightsail Deployment Guide
## Test Agency Platform - Production Deployment

---

## 🎯 Overview

This guide will help you deploy your complete Test Agency application (Backend + Frontend + Database) to AWS Lightsail in under 30 minutes.

**What you'll deploy:**
- ✅ NestJS Backend API (Port 3000)
- ✅ Next.js Frontend (Port 3001)
- ✅ MySQL Database
- ✅ Nginx Reverse Proxy with SSL
- ✅ PM2 Process Manager
- ✅ Auto-restart on crash
- ✅ Automated backups

**Cost:** $10-20/month for Lightsail instance

---

## 📋 Prerequisites

### On Your Local Machine
- ✅ AWS Account (free tier available)
- ✅ Domain name (optional but recommended)
- ✅ Your application code ready

### What You'll Need
- AWS Lightsail access
- 30 minutes of time
- Basic command line knowledge

---

## 🚀 Quick Start (Automated Deployment)

### Step 1: Create Lightsail Instance (5 minutes)

1. **Login to AWS Lightsail**
   - Go to: https://lightsail.aws.amazon.com/
   - Sign in with your AWS account

2. **Create Instance**
   - Click "Create instance" (orange button)
   - **Location:** Choose closest to your users (e.g., US East, Mumbai, Singapore)
   - **Platform:** Linux/Unix
   - **Blueprint:** "OS Only" → **Ubuntu 22.04 LTS**
   - **Instance Plan:** 
     - **Recommended:** $10/month (2GB RAM, 1 vCPU, 60GB SSD)
     - **For heavy traffic:** $20/month (4GB RAM, 2 vCPUs)
   - **Instance Name:** `test-agency-prod`
   - Click "**Create instance**"

3. **Wait for Launch** (2-3 minutes)
   - Status will change from "Pending" → "Running"

### Step 2: Setup Networking (2 minutes)

1. **Create Static IP**
   - Click on your instance name
   - Go to "**Networking**" tab
   - Click "**Create static IP**"
   - Keep default name or change to: `test-agency-ip`
   - Click "**Create**"
   - **Note down the IP address** (you'll need it!)

2. **Configure Firewall**
   - In Networking tab → "**IPv4 Firewall**"
   - You should see SSH (22) already added
   - Click "**+ Add rule**" and add:
     - **HTTP** - Port 80
     - **HTTPS** - Port 443
   - Click "**Create**"

### Step 3: Connect to Your Instance (2 minutes)

**Option A: Browser SSH (Easiest)**
- Click "**Connect using SSH**" button on instance page
- A terminal will open in your browser

**Option B: SSH Key (Recommended for regular use)**
```bash
# Download SSH key from Lightsail → Account → SSH keys
# Then connect:
ssh -i ~/Downloads/LightsailDefaultKey-*.pem ubuntu@YOUR_STATIC_IP
```

### Step 4: Upload Your Application (3 minutes)

**On your local machine:**
```bash
# Navigate to your project
cd /Users/mayurnikam/mytasks/freelance/demo

# Create deployment package
tar --exclude='node_modules' --exclude='.git' --exclude='*.log' \
    --exclude='backend/uploads' --exclude='frontend/.next' \
    -czf test-agency.tar.gz .

# Upload to Lightsail (replace YOUR_IP with your static IP)
scp -i ~/Downloads/LightsailDefaultKey-*.pem \
    test-agency.tar.gz ubuntu@YOUR_IP:~/

# Or if using password:
scp test-agency.tar.gz ubuntu@YOUR_IP:~/
```

**On Lightsail instance:**
```bash
# Extract application
cd ~
tar -xzf test-agency.tar.gz
sudo mkdir -p /var/www/test-agency
sudo mv * /var/www/test-agency/ 2>/dev/null || true
sudo chown -R ubuntu:ubuntu /var/www/test-agency
cd /var/www/test-agency
```

### Step 5: Run Automated Deployment (10 minutes)

```bash
# Make deployment script executable
chmod +x infrastructure/lightsail-deploy.sh

# Set your domain (or use IP address if no domain)
export DOMAIN="yourdomain.com"

# Run deployment
sudo -E ./infrastructure/lightsail-deploy.sh
```

**What the script does:**
1. ✅ Installs Node.js 20, MySQL, Nginx, PM2
2. ✅ Creates database and secure user
3. ✅ Installs backend dependencies
4. ✅ Runs database migrations
5. ✅ Builds frontend
6. ✅ Configures Nginx
7. ✅ Sets up SSL (if domain provided)
8. ✅ Starts applications with PM2
9. ✅ Creates admin user

**Wait for completion:** Script will show progress. Takes about 8-10 minutes.

### Step 6: Verify Deployment (1 minute)

```bash
# Check backend
pm2 status

# Check logs
pm2 logs backend --lines 50
pm2 logs frontend --lines 50

# Test backend API
curl http://localhost:3000/api/categories

# Check Nginx
sudo systemctl status nginx
```

### Step 7: Access Your Application

**If using domain:**
- Frontend: `https://yourdomain.com`
- Backend API: `https://yourdomain.com/api`
- Admin Panel: `https://yourdomain.com/admin/login`

**If using IP only:**
- Frontend: `http://YOUR_IP:3001`
- Backend API: `http://YOUR_IP:3000/api`
- Admin Panel: `http://YOUR_IP:3001/admin/login`

**Default Admin Credentials:**
- Email: `admin@test-agency.com`
- Password: (shown at end of deployment script)

---

## 🔧 Manual Deployment (Step by Step)

If you prefer manual control or the automated script fails:

### 1. Install Node.js

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # Should show v20.x
npm --version
```

### 2. Install MySQL

```bash
# Install MySQL 8.0
sudo apt-get update
sudo apt-get install -y mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL
sudo mysql

# In MySQL prompt, run:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourSecureRootPassword';
CREATE DATABASE test_agency_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'YourSecurePassword';
GRANT ALL PRIVILEGES ON test_agency_db.* TO 'testuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configure Backend

```bash
cd /var/www/test-agency/backend

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=testuser
DATABASE_PASSWORD=YourSecurePassword
DATABASE_NAME=test_agency_db

# JWT Secrets (generate with: openssl rand -base64 64)
JWT_SECRET=your-generated-jwt-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here

# CORS
FRONTEND_URL=http://YOUR_IP:3001

# File Upload
UPLOAD_DIR=/var/www/test-agency/backend/uploads
MAX_FILE_SIZE=10485760
EOF

# Install dependencies
npm install --production

# Create uploads directory
mkdir -p uploads/products
chmod 755 uploads

# Run database migrations
mysql -u testuser -p'YourSecurePassword' test_agency_db < src/database/schema-mysql.sql
```

### 4. Configure Frontend

```bash
cd /var/www/test-agency/frontend

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://YOUR_IP:3000
NEXT_PUBLIC_FRONTEND_URL=http://YOUR_IP:3001
EOF

# Install dependencies
npm install

# Build production version
npm run build
```

### 5. Install PM2 and Start Applications

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend
cd /var/www/test-agency/backend
pm2 start npm --name "backend" -- run dev
# Or for production:
pm2 start npm --name "backend" -- start

# Start frontend
cd /var/www/test-agency/frontend
pm2 start npm --name "frontend" -- start -- -p 3001

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command it outputs
```

### 6. Install and Configure Nginx

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/test-agency

# Paste this configuration:
```

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend
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
    }

    # Backend API
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
        
        # Increase timeouts for large uploads
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Product images
    location /uploads {
        alias /var/www/test-agency/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # File upload size
    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/test-agency /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 7. Setup SSL (Optional but Recommended)

**Only if you have a domain:**

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure Nginx for HTTPS
# Auto-renewal is setup automatically
```

### 8. Create Admin User

```bash
# Connect to MySQL
mysql -u testuser -p'YourSecurePassword' test_agency_db

# Run this SQL:
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
EXIT;

# Default password is: SecureAdminPassword123!
```

---

## 🔐 Security Checklist

### Essential Security Steps

```bash
# 1. Update firewall (UFW)
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# 2. Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Change: PermitRootLogin no
sudo systemctl restart ssh

# 3. Setup fail2ban
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 4. Setup automatic security updates
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Environment Variables

**Never commit these to git:**
- Database passwords
- JWT secrets
- API keys

**Store securely in `.env` files with restricted permissions:**
```bash
chmod 600 /var/www/test-agency/backend/.env
chmod 600 /var/www/test-agency/frontend/.env.local
```

---

## 📊 Monitoring & Maintenance

### Check Application Status

```bash
# PM2 status
pm2 status
pm2 monit  # Real-time monitoring

# View logs
pm2 logs backend --lines 100
pm2 logs frontend --lines 100

# Check specific process
pm2 show backend
pm2 show frontend

# Restart applications
pm2 restart backend
pm2 restart frontend
pm2 restart all
```

### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

```bash
# Create backup directory
mkdir -p ~/backups

# Manual backup
mysqldump -u testuser -p'YourPassword' test_agency_db > ~/backups/test-agency-$(date +%Y%m%d-%H%M%S).sql

# Automated daily backup (add to crontab)
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * mysqldump -u testuser -p'YourPassword' test_agency_db > ~/backups/test-agency-$(date +\%Y\%m\%d).sql && find ~/backups -name "test-agency-*.sql" -mtime +7 -delete
```

---

## 🔄 Deploying Updates

When you make changes to your application:

```bash
# On your local machine
cd /Users/mayurnikam/mytasks/freelance/demo
tar --exclude='node_modules' --exclude='.git' -czf test-agency-update.tar.gz .
scp test-agency-update.tar.gz ubuntu@YOUR_IP:~/

# On Lightsail instance
cd /var/www/test-agency

# Backup current version
sudo cp -r /var/www/test-agency /var/www/test-agency-backup-$(date +%Y%m%d)

# Extract updates
tar -xzf ~/test-agency-update.tar.gz

# Update backend
cd backend
npm install --production
pm2 restart backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart frontend

# Clear old backups (keep last 3)
ls -t /var/www/test-agency-backup-* | tail -n +4 | xargs rm -rf
```

### Quick Update Script

Create a file `/var/www/test-agency/update.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Updating Test Agency..."

cd /var/www/test-agency

# Pull latest code (if using git)
# git pull origin main

# Update backend
echo "📦 Updating backend..."
cd backend
npm install --production
pm2 restart backend

# Update frontend
echo "📦 Updating frontend..."
cd ../frontend
npm install
npm run build
pm2 restart frontend

# Run migrations if needed
# cd ../backend
# mysql -u testuser -p test_agency_db < src/database/migrations/latest.sql

echo "✅ Update complete!"
pm2 status
```

```bash
chmod +x /var/www/test-agency/update.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs backend --lines 100

# Common issues:
# 1. Database connection
mysql -u testuser -p test_agency_db  # Test connection

# 2. Port already in use
sudo lsof -i :3000
sudo kill -9 PID  # Kill process using port

# 3. Environment variables
cat backend/.env  # Verify configuration

# 4. Permissions
sudo chown -R ubuntu:ubuntu /var/www/test-agency
```

### Frontend Not Starting

```bash
# Check logs
pm2 logs frontend --lines 100

# Common issues:
# 1. Build failed
cd frontend
npm run build  # Rebuild manually

# 2. API URL incorrect
cat .env.local  # Verify NEXT_PUBLIC_API_URL

# 3. Port in use
sudo lsof -i :3001
```

### Nginx Errors

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Database Connection Issues

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u testuser -p test_agency_db

# Check user permissions
mysql -u root -p
SHOW GRANTS FOR 'testuser'@'localhost';

# Restart MySQL
sudo systemctl restart mysql
```

### SSL Certificate Issues

```bash
# Test SSL renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Check certificate status
sudo certbot certificates
```

---

## 📱 Domain Configuration

### If Using Domain Name

**1. Add DNS Records at your domain registrar:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_STATIC_IP | 3600 |
| A | www | YOUR_STATIC_IP | 3600 |

**2. Wait for DNS propagation (5-30 minutes)**

Check status:
```bash
dig yourdomain.com
nslookup yourdomain.com
```

**3. Update configurations:**

```bash
# Update backend .env
nano /var/www/test-agency/backend/.env
# Change: FRONTEND_URL=https://yourdomain.com

# Update frontend .env.local
nano /var/www/test-agency/frontend/.env.local
# Change: NEXT_PUBLIC_API_URL=https://yourdomain.com

# Update Nginx
sudo nano /etc/nginx/sites-available/test-agency
# Change: server_name yourdomain.com www.yourdomain.com;

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

---

## 💰 Cost Optimization

### Lightsail Plans

- **$5/month** - 1GB RAM, 1 vCPU - Good for testing
- **$10/month** - 2GB RAM, 1 vCPU - **Recommended for small production**
- **$20/month** - 4GB RAM, 2 vCPUs - Good for growing traffic
- **$40/month** - 8GB RAM, 2 vCPUs - High traffic

### Tips to Reduce Costs

1. **Use Lightsail data transfer** (1-3TB free)
2. **Optimize images** before upload
3. **Enable Nginx caching** for static files
4. **Use CDN** for images (AWS CloudFront)
5. **Monitor resource usage** - upgrade only when needed

---

## 📞 Support & Next Steps

### After Deployment

1. ✅ Test all features (products, categories, quotes, contacts)
2. ✅ Change admin password
3. ✅ Add your actual business data
4. ✅ Setup email notifications (future enhancement)
5. ✅ Configure backups schedule
6. ✅ Setup monitoring (UptimeRobot, etc.)

### Useful Commands Cheat Sheet

```bash
# Application Management
pm2 status              # Check all processes
pm2 restart all         # Restart everything
pm2 logs --lines 50     # View recent logs
pm2 monit              # Real-time monitoring

# Database
mysql -u testuser -p test_agency_db                    # Connect to DB
mysqldump -u testuser -p test_agency_db > backup.sql   # Backup DB
mysql -u testuser -p test_agency_db < backup.sql       # Restore DB

# Nginx
sudo nginx -t                    # Test config
sudo systemctl restart nginx     # Restart Nginx
sudo tail -f /var/log/nginx/error.log  # View errors

# System
df -h                  # Disk space
free -h                # Memory usage
top                    # CPU usage
sudo reboot            # Restart server
```

---

## 🎉 Success!

Your Test Agency application should now be live on AWS Lightsail!

**Access your site:**
- 🌐 Frontend: `https://yourdomain.com` or `http://YOUR_IP:3001`
- 🔧 Admin Panel: `https://yourdomain.com/admin/login`
- 📡 API: `https://yourdomain.com/api`

**Next Steps:**
1. Change admin password
2. Add your products and categories
3. Test quote request system
4. Configure email notifications
5. Add Google Analytics (optional)
6. Setup monitoring alerts

---

## 📚 Additional Resources

- [AWS Lightsail Documentation](https://docs.aws.amazon.com/lightsail/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt SSL](https://letsencrypt.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Need Help?**
- Check logs: `pm2 logs`
- Review Nginx errors: `sudo tail -f /var/log/nginx/error.log`
- Test database: `mysql -u testuser -p test_agency_db`
- Verify ports: `sudo lsof -i :3000,3001,80,443`

Good luck with your deployment! 🚀

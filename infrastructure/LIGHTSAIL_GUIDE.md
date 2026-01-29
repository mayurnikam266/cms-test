# AWS Lightsail Deployment Guide
## Complete Step-by-Step Instructions

---

## 🚀 Quick Deploy (Automated)

### Prerequisites
1. AWS Lightsail instance ($5-10/month plan recommended)
2. Ubuntu 20.04 or 22.04 LTS
3. Your domain name (optional but recommended)
4. SSH access to your Lightsail instance

### One-Command Deployment

```bash
# 1. SSH into your Lightsail instance
ssh ubuntu@YOUR_LIGHTSAIL_IP

# 2. Upload your code (from your local machine)
scp -r /Users/mayurnikam/mytasks/freelance/demo ubuntu@YOUR_LIGHTSAIL_IP:/tmp/

# 3. On Lightsail, move code and run deployment
sudo mv /tmp/demo /var/www/test-agency
cd /var/www/test-agency
sudo chmod +x infrastructure/lightsail-deploy.sh

# 4. Run deployment (set your domain)
export DOMAIN="your-domain.com"
sudo ./infrastructure/lightsail-deploy.sh
```

**That's it!** The script will:
- ✅ Install all dependencies (Node.js, MySQL, Nginx, PM2)
- ✅ Configure database with secure passwords
- ✅ Build and start backend + frontend
- ✅ Setup SSL certificates (Let's Encrypt)
- ✅ Configure firewall
- ✅ Setup automated backups
- ✅ Create admin account

---

## 📋 Manual Deployment (Step by Step)

### Step 1: Create Lightsail Instance

1. Go to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click "Create instance"
3. Select:
   - **Platform**: Linux/Unix
   - **Blueprint**: OS Only → Ubuntu 22.04 LTS
   - **Instance plan**: $5-10/month (1GB-2GB RAM)
4. Name your instance: `test-agency-prod`
5. Click "Create instance"
6. Wait 2-3 minutes for instance to start

### Step 2: Configure Networking

1. Go to your instance's "Networking" tab
2. Click "Create static IP"
3. Attach it to your instance
4. Note the static IP address
5. Add firewall rules:
   - SSH (22) - Already enabled
   - HTTP (80) - Add
   - HTTPS (443) - Add

### Step 3: Setup Domain (Optional)

1. Go to your domain registrar
2. Add A records:
   ```
   @ → YOUR_STATIC_IP
   www → YOUR_STATIC_IP
   ```
3. Wait for DNS propagation (5-30 minutes)

### Step 4: Connect to Instance

```bash
# Download SSH key from Lightsail console
# Then connect:
ssh -i ~/Downloads/LightsailKey.pem ubuntu@YOUR_STATIC_IP

# Or use browser-based SSH from Lightsail console
```

### Step 5: Upload Application

**Option A: From Local Machine**
```bash
# On your local machine
cd /Users/mayurnikam/mytasks/freelance/demo
tar -czf test-agency.tar.gz .
scp -i ~/Downloads/LightsailKey.pem test-agency.tar.gz ubuntu@YOUR_STATIC_IP:~/

# On Lightsail instance
cd ~
tar -xzf test-agency.tar.gz
sudo mv demo /var/www/test-agency
```

**Option B: From Git Repository**
```bash
# On Lightsail instance
sudo mkdir -p /var/www/test-agency
cd /var/www/test-agency
git clone YOUR_GIT_REPO_URL .
```

### Step 6: Run Deployment Script

```bash
cd /var/www/test-agency
sudo chmod +x infrastructure/lightsail-deploy.sh

# Set your domain (or use IP)
export DOMAIN="your-domain.com"  # or YOUR_STATIC_IP

# Run deployment
sudo ./infrastructure/lightsail-deploy.sh
```

The script runs for 5-10 minutes. Watch for any errors.

### Step 7: Save Credentials

After deployment completes, save the displayed credentials:

```bash
# View credentials
cat /var/www/test-agency/CREDENTIALS.txt

# Copy them somewhere secure, then delete
sudo rm /var/www/test-agency/CREDENTIALS.txt
```

### Step 8: Test Your Application

1. Open browser: `https://your-domain.com` (or `http://YOUR_IP`)
2. Go to admin: `https://your-domain.com/admin`
3. Login with credentials from Step 7
4. Upload a test product with image
5. View on public site

---

## 🔧 Post-Deployment Configuration

### Change Admin Password

```bash
# Login to admin panel
# Go to Profile → Change Password
# Or via MySQL:

sudo mysql -utestuser -p test_agency_db
# Enter DB password from CREDENTIALS.txt

-- Generate new hash (use Node.js)
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('NEW_PASSWORD', 10, (e,h) => console.log(h));"

-- Update password
UPDATE users SET password = 'NEW_HASH' WHERE email = 'admin@your-domain.com';
exit;
```

### Monitor Application

```bash
# View real-time logs
pm2 logs

# Check status
pm2 status

# Resource monitoring
pm2 monit

# View Nginx logs
sudo tail -f /var/log/nginx/test-agency_access.log
sudo tail -f /var/log/nginx/test-agency_error.log
```

### Restart Services

```bash
# Restart backend only
pm2 restart test-agency-backend

# Restart frontend only
pm2 restart test-agency-frontend

# Restart all
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx

# Restart MySQL
sudo systemctl restart mysql
```

---

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs --err

# Check if ports are in use
sudo netstat -tulpn | grep -E ':(3000|3001|80|443)'

# Manually test backend
cd /var/www/test-agency/backend
node dist/main.js

# Manually test frontend
cd /var/www/test-agency/frontend
npm start
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -utestuser -p test_agency_db

# Check MySQL status
sudo systemctl status mysql

# Reset MySQL password
sudo mysql
ALTER USER 'testuser'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
exit;

# Update .env file
sudo nano /var/www/test-agency/backend/.env
# Change DATABASE_PASSWORD

# Restart backend
pm2 restart test-agency-backend
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Test auto-renewal
sudo certbot renew --dry-run

# If SSL fails, use HTTP temporarily
sudo nano /etc/nginx/sites-available/test-agency
# Change listen 443 ssl to listen 80
sudo nginx -t
sudo systemctl reload nginx
```

### Nginx Configuration Issues

```bash
# Test configuration
sudo nginx -t

# View error log
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx

# Check if Nginx is running
sudo systemctl status nginx
```

### "Invalid Credentials" Error

This usually means browser cache issue:

1. **Frontend Solution**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Run: `localStorage.clear(); location.reload();`
   - Try logging in again

2. **Backend Solution**:
   ```bash
   # Generate fresh password hash
   cd /var/www/test-agency/backend
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SecureAdminPassword123!', 10, (e,h) => console.log(h));"
   
   # Copy the hash and update database
   mysql -utestuser -p test_agency_db
   UPDATE users SET password = 'PASTE_HASH_HERE' WHERE email = 'admin@your-domain.com';
   exit;
   ```

### Upload Issues

```bash
# Check uploads directory permissions
sudo chown -R www-data:www-data /var/www/test-agency/backend/uploads
sudo chmod -R 755 /var/www/test-agency/backend/uploads

# Check disk space
df -h

# Test upload manually
curl -X POST http://localhost:3000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg"
```

---

## 📊 Monitoring & Maintenance

### Daily Checks

```bash
# Check application status
pm2 status

# Check disk space
df -h

# Check memory usage
free -h

# Check recent logs
pm2 logs --lines 50
```

### Weekly Maintenance

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Check and clean old logs
sudo journalctl --vacuum-time=7d

# Verify backups
ls -lh /var/backups/test-agency/

# Check SSL certificate expiry
sudo certbot certificates
```

### Automated Backups

Backups run daily at 2 AM automatically. To restore:

```bash
# List backups
ls -lh /var/backups/test-agency/

# Restore database
gunzip < /var/backups/test-agency/db_YYYYMMDD_HHMMSS.sql.gz | mysql -utestuser -p test_agency_db

# Restore uploads
tar -xzf /var/backups/test-agency/uploads_YYYYMMDD_HHMMSS.tar.gz -C /
```

### Manual Backup

```bash
# Backup everything
cd /var/www/test-agency
sudo ./backup.sh

# Or manually:
mysqldump -utestuser -p test_agency_db | gzip > ~/backup_$(date +%Y%m%d).sql.gz
tar -czf ~/uploads_$(date +%Y%m%d).tar.gz /var/www/test-agency/backend/uploads
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords

```bash
# Admin user password - do via UI
# Database password
sudo mysql
ALTER USER 'testuser'@'localhost' IDENTIFIED BY 'STRONG_NEW_PASSWORD';
FLUSH PRIVILEGES;
exit;

# Update .env
sudo nano /var/www/test-agency/backend/.env
pm2 restart test-agency-backend
```

### 2. Regular Updates

```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Application updates
cd /var/www/test-agency/backend
npm audit fix
npm update

cd /var/www/test-agency/frontend
npm audit fix
npm update

# Rebuild and restart
npm run build
pm2 restart all
```

### 3. Monitor Access Logs

```bash
# Check for suspicious activity
sudo tail -f /var/log/nginx/test-agency_access.log | grep -E '(404|500|login)'

# Check failed login attempts
sudo journalctl -u nginx | grep "POST /api/auth/login" | grep "401"
```

### 4. Setup Fail2Ban (Optional)

```bash
# Install
sudo apt install fail2ban -y

# Configure for Nginx
sudo nano /etc/fail2ban/jail.local
# Add:
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/*error.log
maxretry = 5
bantime = 3600

sudo systemctl restart fail2ban
```

---

## 📈 Scaling & Performance

### Increase PM2 Instances

```bash
# Edit ecosystem config
sudo nano /var/www/test-agency/ecosystem.config.js

# Change instances to match CPU cores
instances: 4  # for 4-core instance

# Reload
pm2 reload ecosystem.config.js
```

### Enable Nginx Caching

```bash
sudo nano /etc/nginx/sites-available/test-agency

# Add before server block:
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

# Add in location /api/ block:
proxy_cache api_cache;
proxy_cache_valid 200 5m;
add_header X-Cache-Status $upstream_cache_status;

sudo nginx -t
sudo systemctl reload nginx
```

### Optimize MySQL

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add:
innodb_buffer_pool_size = 512M
max_connections = 200
query_cache_size = 32M
query_cache_limit = 2M

sudo systemctl restart mysql
```

---

## 🎯 Environment-Specific Configuration

### Production (.env)

```env
NODE_ENV=production
PORT=3000
DATABASE_HOST=localhost
CORS_ORIGIN=https://your-domain.com
# ... other settings
```

### Staging

```bash
# Create staging instance
# Use different domain: staging.your-domain.com
# Same deployment process
```

---

## 📞 Support & Resources

### Useful Commands Reference

```bash
# Application
pm2 [start|stop|restart|delete] [app-name]
pm2 logs [app-name]
pm2 monit
pm2 save
pm2 resurrect

# System
sudo systemctl [start|stop|restart|status] [nginx|mysql]
sudo journalctl -u [service] -f
df -h  # Disk space
free -h  # Memory
htop  # Resource monitor

# Database
mysql -utestuser -p test_agency_db
SHOW TABLES;
SELECT COUNT(*) FROM products;

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/*.log
```

### Log Locations

```
Application logs: /var/www/test-agency/logs/
PM2 logs: ~/.pm2/logs/
Nginx logs: /var/log/nginx/
MySQL logs: /var/log/mysql/
System logs: /var/log/syslog
Backups: /var/backups/test-agency/
```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Static IP attached to instance
- [ ] Domain DNS configured (if using domain)
- [ ] SSL certificate installed and working
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Database backups scheduled
- [ ] Admin password changed from default
- [ ] Upload directory writable
- [ ] Test image upload
- [ ] Test product creation
- [ ] Test public product browsing
- [ ] Check mobile responsiveness
- [ ] Monitor logs for errors
- [ ] Document admin credentials securely
- [ ] Setup monitoring/alerts (optional)

---

**Need Help?**
- Check logs: `pm2 logs --err`
- Test backend: `curl http://localhost:3000/api/categories`
- Test database: `mysql -utestuser -p test_agency_db`
- Restart all: `pm2 restart all && sudo systemctl restart nginx`

**Estimated Costs:**
- Lightsail $5-10/month
- Domain $10-15/year
- Total: ~$70-130/year

**Deployment Time:** 15-30 minutes (automated script)

---

Last Updated: January 2026

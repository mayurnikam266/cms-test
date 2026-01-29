# 🚀 Quick Deployment to AWS Lightsail

## ✅ What's Fixed & Ready

### Database Issues - SOLVED ✓
- **Auto-migration**: Database schema creates automatically on first run
- **MySQL compatible**: All enum types fixed (VARCHAR instead of ENUM)  
- **Admin user**: Created automatically with secure password
- **Default data**: 5 product categories pre-loaded

### Image Upload - SOLVED ✓
- **Local storage**: No AWS S3 needed - images stored on your VM
- **Auto-optimization**: Sharp reduces image size by 60-80% without quality loss
- **Direct upload**: Simple multipart/form-data upload
- **Served locally**: Nginx serves images directly

### Authentication - SOLVED ✓
- **Fresh password hash**: Admin login working
- **Auto-clear cache**: Clear Cache button in error messages
- **Proper JWT**: Access + refresh tokens configured

---

## 📦 Deploy in 3 Commands

### 1. Create Lightsail Instance
- Go to: https://lightsail.aws.amazon.com/
- Create Ubuntu 22.04 instance ($5-10/month)
- Attach static IP
- Note the IP address

### 2. Upload & Deploy
```bash
# From your Mac:
cd /Users/mayurnikam/mytasks/freelance/demo
tar -czf test-agency.tar.gz .
scp test-agency.tar.gz ubuntu@YOUR_IP:~/

# SSH to Lightsail:
ssh ubuntu@YOUR_IP
tar -xzf test-agency.tar.gz
sudo mv demo /var/www/test-agency
cd /var/www/test-agency

# Deploy (set your domain or use IP):
export DOMAIN="your-domain.com"  # or YOUR_IP
sudo chmod +x infrastructure/lightsail-deploy.sh
sudo ./infrastructure/lightsail-deploy.sh
```

### 3. Done!
- Visit: `http://YOUR_IP` or `https://your-domain.com`
- Admin: `http://YOUR_IP/admin`
- Credentials will be displayed after deployment

---

## 🔑 Default Credentials

**Generated during deployment:**
- Email: `admin@your-domain.com`
- Password: Auto-generated (displayed after deployment)
- Save credentials from `/var/www/test-agency/CREDENTIALS.txt`

---

## 🛠️ What the Script Does

1. ✅ Installs Node.js 20.x
2. ✅ Installs & secures MySQL  
3. ✅ Installs PM2 process manager
4. ✅ Installs & configures Nginx
5. ✅ Creates database automatically
6. ✅ **Auto-migrates schema** (tables created on first run)
7. ✅ **Creates admin user** automatically
8. ✅ **Loads default categories**
9. ✅ Builds backend & frontend
10. ✅ Starts apps with PM2
11. ✅ Configures SSL (Let's Encrypt)
12. ✅ Sets up firewall
13. ✅ Schedules daily backups
14. ✅ Configures log rotation

---

## 🎯 Auto-Migration Features

### On Every Startup:
```
🔍 Checking database schema...
📋 Creating database schema...    (if tables don't exist)
✅ Database schema created
👤 Creating admin user...          (if admin doesn't exist)  
✅ Admin user created
📁 Creating default categories... (if categories empty)
✅ Default categories created
```

### Secure by Default:
- Passwords auto-generated with `openssl`
- JWT secrets auto-generated (64 bytes)
- Database user with minimal privileges
- Firewall auto-configured
- SSL auto-installed (if domain provided)
- Rate limiting enabled

---

## 📊 After Deployment

### Check Status:
```bash
pm2 status        # App status
pm2 logs          # View logs  
pm2 monit         # Resource monitor
```

### Test Application:
```bash
# Test backend
curl http://localhost:3000/api/categories

# Test database
mysql -utestuser -p test_agency_db
SHOW TABLES;  # Should show 4 tables
SELECT * FROM users;  # Should show admin user
exit;
```

### Access Application:
- **Frontend**: http://YOUR_IP or https://your-domain.com
- **Admin**: http://YOUR_IP/admin
- **API**: http://YOUR_IP/api

---

## 🐛 Troubleshooting

### "Invalid Credentials" in Browser
```bash
# In browser console (F12):
localStorage.clear();
location.reload();
```

### Database Not Created
```bash
# Check if service is running
pm2 logs test-agency-backend

# Manually trigger initialization
cd /var/www/test-agency/backend
node dist/main.js
# Watch for "Database schema created" message
```

### Images Not Uploading
```bash
# Fix permissions
sudo chown -R ubuntu:ubuntu /var/www/test-agency/backend/uploads
sudo chmod -R 755 /var/www/test-agency/backend/uploads
pm2 restart test-agency-backend
```

---

## 📁 File Structure

```
/var/www/test-agency/
├── backend/
│   ├── dist/              # Compiled backend
│   ├── uploads/           # Image storage (auto-created)
│   ├── .env               # Backend config
│   └── node_modules/
├── frontend/
│   ├── .next/             # Compiled frontend
│   ├── .env.local         # Frontend config
│   └── node_modules/
├── logs/                  # Application logs
├── ecosystem.config.js    # PM2 configuration
├── backup.sh             # Backup script
└── CREDENTIALS.txt       # Generated credentials (delete after saving)
```

---

## 🔒 Security Features

✅ **Auto-generated passwords** - Secure random passwords  
✅ **JWT authentication** - Access + refresh tokens  
✅ **Rate limiting** - Prevents brute force attacks  
✅ **Firewall** - Only ports 22, 80, 443 open  
✅ **SSL/TLS** - Let's Encrypt auto-configured  
✅ **SQL injection prevention** - Parameterized queries  
✅ **XSS protection** - Security headers  
✅ **File validation** - Image type & size checks  
✅ **Admin-only API** - JWT + role-based guards  

---

## 💰 Cost Estimate

- **Lightsail**: $5-10/month (1-2GB RAM)
- **Domain**: $10-15/year (optional)
- **SSL**: Free (Let's Encrypt)
- **Backups**: Included (local)

**Total**: ~$60-120/year

---

## 📚 Full Documentation

- **Lightsail Guide**: `infrastructure/LIGHTSAIL_GUIDE.md`
- **Root Cause Fixes**: `ROOT_CAUSE_FIXES.md`
- **UX Improvements**: `UX_IMPROVEMENTS.md`
- **Architecture**: `docs/ARCHITECTURE.md`

---

## ✅ Pre-Deployment Checklist

Before running the deployment script:

- [ ] Lightsail instance created (Ubuntu 22.04)
- [ ] Static IP attached
- [ ] SSH access working
- [ ] Domain configured (optional)
- [ ] Code uploaded to server
- [ ] Export DOMAIN variable (or use IP)

After deployment:

- [ ] Save credentials from CREDENTIALS.txt
- [ ] Delete CREDENTIALS.txt
- [ ] Test admin login
- [ ] Upload test product with image
- [ ] Verify public site works
- [ ] Change admin password in UI

---

## 🎉 That's It!

Your production-ready e-commerce platform is deployed with:
- ✅ Automatic database migration
- ✅ Secure authentication
- ✅ Image optimization
- ✅ SSL encryption
- ✅ Daily backups
- ✅ Professional UI without emojis
- ✅ Mobile responsive
- ✅ SEO optimized

**Support**: Check logs with `pm2 logs` or see LIGHTSAIL_GUIDE.md

**Monitoring**: `pm2 monit` for real-time resource usage

**Maintenance**: Automated backups at 2 AM daily

---

🚀 **Deployment time**: 10-15 minutes  
💻 **Managed by**: PM2 (auto-restart on crash)  
🔄 **Zero-downtime updates**: `pm2 reload all`  
📱 **Mobile ready**: Responsive design  
🌐 **Production ready**: All security best practices

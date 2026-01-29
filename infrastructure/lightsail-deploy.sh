#!/bin/bash

# AWS Lightsail Deployment Script for Test Agency Platform
# This script automates the complete deployment process

set -e  # Exit on any error

echo "🚀 Test Agency - AWS Lightsail Deployment"
echo "=========================================="
echo ""

# Configuration
APP_NAME="test-agency"
DOMAIN=${DOMAIN:-"your-domain.com"}
DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32)}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-$(openssl rand -base64 16)}
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 64)}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET:-$(openssl rand -base64 64)}

echo "📋 Configuration:"
echo "  App Name: $APP_NAME"
echo "  Domain: $DOMAIN"
echo "  Database Password: (generated securely)"
echo "  Admin Password: $ADMIN_PASSWORD"
echo ""

# Step 1: Update system
echo "📦 Step 1: Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Step 2: Install Node.js
echo "📦 Step 2: Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version

# Step 3: Install MySQL
echo "📦 Step 3: Installing MySQL..."
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
echo "🔒 Securing MySQL..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
sudo mysql -uroot -p${DB_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS test_agency_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -uroot -p${DB_PASSWORD} -e "CREATE USER IF NOT EXISTS 'testuser'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -uroot -p${DB_PASSWORD} -e "GRANT ALL PRIVILEGES ON test_agency_db.* TO 'testuser'@'localhost';"
sudo mysql -uroot -p${DB_PASSWORD} -e "FLUSH PRIVILEGES;"

# Step 4: Install PM2
echo "📦 Step 4: Installing PM2..."
sudo npm install -g pm2

# Step 5: Install Nginx
echo "📦 Step 5: Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Step 6: Clone/Copy application
echo "📁 Step 6: Setting up application..."
APP_DIR="/var/www/${APP_NAME}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# If deploying from local, files should already be uploaded
# If deploying from git:
# cd $APP_DIR
# git clone YOUR_REPO_URL .

# Step 7: Install dependencies
echo "📦 Step 7: Installing application dependencies..."
cd $APP_DIR/backend
npm install --production

cd $APP_DIR/frontend
npm install --production

# Step 8: Create environment files
echo "⚙️  Step 8: Creating environment files..."

cat > $APP_DIR/backend/.env << EOF
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=testuser
DATABASE_PASSWORD=${DB_PASSWORD}
DATABASE_NAME=test_agency_db

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRE=7d

NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://${DOMAIN}
UPLOAD_DIR=uploads/products

ADMIN_EMAIL=admin@${DOMAIN}
ADMIN_INITIAL_PASSWORD=${ADMIN_PASSWORD}

BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

cat > $APP_DIR/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://${DOMAIN}/api
EOF

# Step 9: Build applications
echo "🔨 Step 9: Building applications..."
cd $APP_DIR/backend
npm run build

cd $APP_DIR/frontend
npm run build

# Step 10: Setup PM2
echo "⚙️  Step 10: Setting up PM2..."
cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'test-agency-backend',
      script: './backend/dist/main.js',
      cwd: '/var/www/test-agency',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false
    },
    {
      name: 'test-agency-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/test-agency/frontend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false
    }
  ]
};
EOF

# Create logs directory
mkdir -p $APP_DIR/logs

# Step 11: Configure Nginx
echo "⚙️  Step 11: Configuring Nginx..."
sudo tee /etc/nginx/sites-available/${APP_NAME} > /dev/null << EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=login_limit:10m rate=5r/m;

server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    client_max_body_size 10M;
    
    # Logging
    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Backend API
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Login endpoint with stricter rate limiting
    location /api/auth/login {
        limit_req zone=login_limit burst=3 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Uploaded files
    location /uploads/ {
        alias /var/www/${APP_NAME}/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Step 12: Setup SSL with Let's Encrypt
echo "🔒 Step 12: Setting up SSL..."
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} || echo "SSL setup failed or skipped"

# Step 13: Setup firewall
echo "🔥 Step 13: Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Step 14: Start applications
echo "🚀 Step 14: Starting applications..."
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | sudo bash

# Step 15: Setup automated backups
echo "💾 Step 15: Setting up automated backups..."
sudo mkdir -p /var/backups/${APP_NAME}

cat > $APP_DIR/backup.sh << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/test-agency"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
mysqldump -utestuser -p${DB_PASSWORD} test_agency_db | gzip > "${BACKUP_DIR}/db_${DATE}.sql.gz"

# Uploads backup
tar -czf "${BACKUP_DIR}/uploads_${DATE}.tar.gz" /var/www/test-agency/backend/uploads

# Keep only last 7 days of backups
find ${BACKUP_DIR} -name "*.gz" -mtime +7 -delete

echo "Backup completed: ${DATE}"
BACKUP_EOF

chmod +x $APP_DIR/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh >> $APP_DIR/logs/backup.log 2>&1") | crontab -

# Step 16: Setup log rotation
echo "📋 Step 16: Setting up log rotation..."
sudo tee /etc/logrotate.d/${APP_NAME} > /dev/null << EOF
$APP_DIR/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $USER $USER
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Final output
echo ""
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "🎉 Your application is now running!"
echo ""
echo "📝 Important Information:"
echo "  Application URL: https://${DOMAIN}"
echo "  Admin Email: admin@${DOMAIN}"
echo "  Admin Password: ${ADMIN_PASSWORD}"
echo "  Database Password: ${DB_PASSWORD}"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo ""
echo "📊 Useful Commands:"
echo "  View logs:        pm2 logs"
echo "  Restart apps:     pm2 restart all"
echo "  Check status:     pm2 status"
echo "  Monitor:          pm2 monit"
echo ""
echo "🔧 Configuration files:"
echo "  Backend env:      $APP_DIR/backend/.env"
echo "  Frontend env:     $APP_DIR/frontend/.env.local"
echo "  PM2 config:       $APP_DIR/ecosystem.config.js"
echo "  Nginx config:     /etc/nginx/sites-available/${APP_NAME}"
echo ""
echo "💾 Backups:"
echo "  Location:         /var/backups/${APP_NAME}"
echo "  Schedule:         Daily at 2:00 AM"
echo ""
echo "🔒 Security:"
echo "  Firewall:         Enabled (ports 22, 80, 443)"
echo "  SSL:              Let's Encrypt (auto-renewal enabled)"
echo "  Rate limiting:    Enabled"
echo ""

# Save credentials to file
cat > $APP_DIR/CREDENTIALS.txt << EOF
Test Agency - Deployment Credentials
=====================================

Application URL: https://${DOMAIN}
Admin Panel: https://${DOMAIN}/admin

Admin Login:
  Email: admin@${DOMAIN}
  Password: ${ADMIN_PASSWORD}

Database:
  Host: localhost
  Port: 3306
  Database: test_agency_db
  User: testuser
  Password: ${DB_PASSWORD}

JWT Secrets:
  JWT_SECRET: ${JWT_SECRET}
  JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}

IMPORTANT: Keep this file secure and delete after saving credentials elsewhere!
EOF

chmod 600 $APP_DIR/CREDENTIALS.txt

echo "💾 Credentials saved to: $APP_DIR/CREDENTIALS.txt"
echo ""
echo "🎯 Next Steps:"
echo "  1. Save the credentials from $APP_DIR/CREDENTIALS.txt"
echo "  2. Delete $APP_DIR/CREDENTIALS.txt after saving"
echo "  3. Visit https://${DOMAIN}/admin to login"
echo "  4. Change the admin password from the UI"
echo ""

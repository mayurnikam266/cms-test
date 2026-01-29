# AWS Lightsail Deployment Guide
# Test Agency - Production Deployment

## Prerequisites

- AWS Account with Lightsail access
- Domain name (optional but recommended)
- AWS CLI installed locally
- Git repository

## Step 1: Create Lightsail Instance

1. **Go to AWS Lightsail Console**
   - Navigate to https://lightsail.aws.amazon.com/

2. **Create Instance**
   - Click "Create instance"
   - Choose Region: Select closest to your users
   - Platform: Linux/Unix
   - Blueprint: OS Only → Ubuntu 22.04 LTS
   - Instance Plan: Minimum $10/month (2GB RAM, 1 vCPU)
     - For production with traffic: $20/month (4GB RAM, 2 vCPU)
   - Instance Name: `test-agency-production`
   - Click "Create instance"

3. **Wait for Instance to Start**
   - Status should show "Running" (takes ~2 minutes)

## Step 2: Configure Networking

1. **Assign Static IP**
   - Go to Networking tab
   - Click "Create static IP"
   - Attach to your instance
   - Name it: `test-agency-ip`

2. **Configure Firewall**
   - Add rules in Networking → Firewall:
     - SSH (22) - Already enabled
     - HTTP (80) - Add
     - HTTPS (443) - Add
     - Custom TCP (3000) - Add temporarily for testing

## Step 3: Connect and Setup Server

### Connect to Instance

```bash
# Download SSH key from Lightsail console
# Connect via SSH
ssh -i LightsailDefaultKey-us-east-1.pem ubuntu@YOUR_STATIC_IP
```

### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x
npm --version
```

### Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE test_agency_db;
CREATE USER testadmin WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE test_agency_db TO testadmin;
\q
```

### Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Install Certbot (for SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 4: Setup Application

### Clone Repository

```bash
cd /home/ubuntu
git clone YOUR_REPOSITORY_URL test-agency
cd test-agency
```

### Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Backend .env contents:**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=testadmin
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD
DATABASE_NAME=test_agency_db

JWT_SECRET=GENERATE_RANDOM_32_CHAR_STRING
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=GENERATE_RANDOM_32_CHAR_STRING
JWT_REFRESH_EXPIRE=7d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
AWS_S3_BUCKET=test-agency-products
AWS_S3_SIGNED_URL_EXPIRE=3600

NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com

ADMIN_EMAIL=admin@test-agency.com
ADMIN_INITIAL_PASSWORD=SecureAdminPassword123!

BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

```bash
# Build backend
npm run build

# Initialize database
psql -U testadmin -d test_agency_db -h localhost -f src/database/schema.sql
```

### Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
nano .env.production
```

**Frontend .env.production contents:**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Test Agency
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

```bash
# Build frontend
npm run build
```

## Step 5: Configure PM2

```bash
cd /home/ubuntu/test-agency

# Create PM2 ecosystem file
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'test-agency-backend',
      cwd: '/home/ubuntu/test-agency/backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'test-agency-frontend',
      cwd: '/home/ubuntu/test-agency/frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
```

```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs
```

## Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/test-agency
```

**Nginx configuration:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/test-agency /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 7: Setup SSL with Let's Encrypt

**Note:** Only do this after your domain DNS is pointing to the Lightsail IP

```bash
# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Certbot will:
# 1. Verify domain ownership
# 2. Generate SSL certificates
# 3. Automatically update Nginx config
# 4. Setup auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 8: Setup AWS S3 Bucket

### Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://test-agency-products --region us-east-1

# Set bucket to private
aws s3api put-public-access-block \
    --bucket test-agency-products \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning (optional)
aws s3api put-bucket-versioning \
    --bucket test-agency-products \
    --versioning-configuration Status=Enabled
```

### Create IAM User for S3 Access

1. Go to AWS IAM Console
2. Create new user: `test-agency-s3-user`
3. Attach policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::test-agency-products",
        "arn:aws:s3:::test-agency-products/*"
      ]
    }
  ]
}
```

4. Create access keys and save them
5. Update backend .env with access keys

## Step 9: Configure CORS (Backend)

Ensure backend .env has correct CORS_ORIGIN:

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Restart backend:
```bash
pm2 restart test-agency-backend
```

## Step 10: Monitoring & Logs

### View Logs

```bash
# Backend logs
pm2 logs test-agency-backend

# Frontend logs
pm2 logs test-agency-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PM2 Monitoring

```bash
# View process status
pm2 status

# Monitor resources
pm2 monit
```

### Database Backup

```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U testadmin -h localhost test_agency_db > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /home/ubuntu/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

## Step 11: Security Hardening

### Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### Setup Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Step 12: Deployment Workflow

### Update Application

```bash
cd /home/ubuntu/test-agency

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
npm run build
pm2 restart test-agency-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart test-agency-frontend
```

### Create Deployment Script

```bash
nano /home/ubuntu/deploy.sh
```

```bash
#!/bin/bash
set -e

cd /home/ubuntu/test-agency

echo "📥 Pulling latest code..."
git pull origin main

echo "🔨 Building backend..."
cd backend
npm install
npm run build

echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

echo "🔄 Restarting services..."
pm2 restart test-agency-backend
pm2 restart test-agency-frontend

echo "✅ Deployment complete!"
```

```bash
chmod +x /home/ubuntu/deploy.sh
```

## Troubleshooting

### Backend not starting
```bash
pm2 logs test-agency-backend --lines 50
# Check database connection
psql -U testadmin -d test_agency_db -h localhost
```

### Frontend build issues
```bash
cd /home/ubuntu/test-agency/frontend
rm -rf .next node_modules
npm install
npm run build
```

### Database connection issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL config
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ensure: local   all   all   md5
```

### SSL certificate issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

## Performance Optimization

### Enable Gzip in Nginx

Already enabled by default, verify:
```bash
sudo nano /etc/nginx/nginx.conf
# Ensure gzip is on
```

### Database Indexing

Indexes are already in schema.sql. Monitor slow queries:
```sql
-- In psql
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

## Cost Optimization

- **Instance**: Start with $10/month, scale to $20 if needed
- **S3**: Pay per GB stored + requests (minimal for images)
- **Data Transfer**: 1TB free per month with Lightsail
- **Total Estimated**: $15-30/month

## Success Checklist

- [ ] Lightsail instance running
- [ ] Static IP assigned
- [ ] Domain DNS configured
- [ ] PostgreSQL installed and configured
- [ ] Backend built and running
- [ ] Frontend built and running
- [ ] Nginx configured
- [ ] SSL certificates installed
- [ ] S3 bucket created and configured
- [ ] Admin login working
- [ ] Product creation working
- [ ] Image upload to S3 working
- [ ] Backups configured
- [ ] Monitoring setup

## Support & Maintenance

### Regular Tasks
- Weekly: Check PM2 status and logs
- Monthly: Review S3 storage usage
- Monthly: Test backup restoration
- Quarterly: Update dependencies and rebuild

### Security Updates
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

## Additional Resources

- [Lightsail Documentation](https://aws.amazon.com/lightsail/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

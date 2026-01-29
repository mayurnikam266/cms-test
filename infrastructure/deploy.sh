#!/bin/bash
# Deployment Script for Test Agency

set -e

PROJECT_DIR="/home/ubuntu/test-agency"

echo "🚀 Starting deployment..."

# Navigate to project
cd $PROJECT_DIR

# Pull latest code
echo "📥 Pulling latest code from repository..."
git pull origin main

# Backend deployment
echo "🔨 Building backend..."
cd $PROJECT_DIR/backend
npm install --production
npm run build

# Frontend deployment
echo "🎨 Building frontend..."
cd $PROJECT_DIR/frontend
npm install --production
npm run build

# Restart services
echo "🔄 Restarting services..."
pm2 restart test-agency-backend
pm2 restart test-agency-frontend

# Wait for services to start
sleep 5

# Check service status
echo "✅ Checking service status..."
pm2 status

echo "🎉 Deployment complete!"
echo "📊 View logs with: pm2 logs"

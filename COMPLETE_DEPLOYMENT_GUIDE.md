# 🚀 COMPLETE DEPLOYMENT GUIDE - TEST AGENCY
## From Zero to Production in 30 Minutes

**Last Updated**: February 6, 2026  
**Difficulty**: Beginner-Friendly  
**Time Required**: 30-45 minutes  
**Cost**: $0 (Free tier for everything)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Sanity CMS Setup](#phase-1-sanity-cms-setup)
3. [Phase 2: Sanity Studio Deployment](#phase-2-sanity-studio-deployment)
4. [Phase 3: Backend Deployment](#phase-3-backend-deployment)
5. [Phase 4: Frontend Deployment (Vercel)](#phase-4-frontend-deployment-vercel)
6. [Phase 5: Database Setup](#phase-5-database-setup)
7. [Phase 6: Environment Configuration](#phase-6-environment-configuration)
8. [Phase 7: Testing & Verification](#phase-7-testing--verification)
9. [Phase 8: Client Handover](#phase-8-client-handover)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] GitHub account (free at github.com)
- [ ] Vercel account (free at vercel.com)
- [ ] Sanity account (free at sanity.io)
- [ ] Railway or Render account (free at railway.app or render.com)
- [ ] Node.js 18+ installed
- [ ] Code pushed to GitHub repository

**Time**: 5 minutes to create accounts

---

## 🎯 PHASE 1: Sanity CMS Setup

### Step 1.1: Create Sanity Account

1. **Go to**: https://www.sanity.io
2. **Click**: "Get Started" or "Sign Up"
3. **Choose**: Sign up with GitHub (recommended) or email
4. **Complete**: Email verification if needed

**Time**: 2 minutes

---

### Step 1.2: Create Sanity Project

1. **In Sanity Dashboard**: Click "Create New Project"
2. **Project Name**: `test-agency-cms` (or your choice)
3. **Dataset**: `production` (leave as default)
4. **Region**: Choose closest to you (e.g., `us-east-1`)
5. **Plan**: Select "Free" tier

**Save These Values**:
```
Project ID: abc123xyz (example)
Dataset: production
```

**Time**: 2 minutes

---

### Step 1.3: Generate API Token

1. **In Sanity Dashboard**: Go to your project
2. **Navigate**: API → Tokens
3. **Click**: "Add API Token"
4. **Name**: `backend-api-token`
5. **Permissions**: Select "Editor" (read + write)
6. **Click**: "Create"

**⚠️ IMPORTANT**: Copy and save this token immediately! You won't see it again.

```
Token: skAbCd123xyz... (example)
```

**Time**: 1 minute

---

### Step 1.4: Configure CORS Origins

1. **In Sanity Dashboard**: API → CORS Origins
2. **Click**: "Add CORS Origin"
3. **Add these origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   https://your-domain.vercel.app
   https://*.vercel.app
   ```
4. **Allow Credentials**: ✅ Check this box
5. **Click**: "Save"

**Time**: 2 minutes

---

## 🎨 PHASE 2: Sanity Studio Deployment

### Step 2.1: Install Studio Dependencies

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/studio
npm install
```

**Expected Output**:
```
added 245 packages in 30s
```

**Time**: 1-2 minutes

---

### Step 2.2: Configure Studio Environment

Create `studio/.env.local`:

```bash
cat > studio/.env.local << 'EOF'
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
EOF
```

**Replace** `your_project_id_here` with your actual Project ID from Step 1.2

**Time**: 1 minute

---

### Step 2.3: Login to Sanity CLI

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/studio
npx sanity login
```

**Steps**:
1. Browser window opens
2. Click "Authorize"
3. Return to terminal
4. See "Login successful"

**Time**: 1 minute

---

### Step 2.4: Deploy Sanity Studio

```bash
npm run deploy
```

**You'll be asked**:
- **Studio hostname**: Choose a unique name (e.g., `test-agency-cms`)
- **Confirm**: Press Enter

**Expected Output**:
```
✔ Checking configuration files...
✔ Compiling...
✔ Uploading...
✔ Deploying...

Success! Studio deployed to:
https://test-agency-cms.sanity.studio

You can access it at the URL above.
```

**⭐ SAVE THIS URL**: You'll need it for frontend configuration!

**Time**: 2-3 minutes

---

### Step 2.5: Verify Studio Deployment

1. **Open**: The studio URL from previous step
2. **Login**: With your Sanity account
3. **You should see**: Your empty CMS dashboard with:
   - Products
   - Categories
   - Announcements
   - Contact Submissions
   - Quote Requests

**Time**: 1 minute

---

## 🖥️ PHASE 3: Backend Deployment

### Step 3.1: Prepare Backend Code

Update `backend/.env.production`:

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/backend

cat > .env.production << 'EOF'
# Database
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=test_agency_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Sanity CMS
SANITY_PROJECT_ID=your_project_id_here
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
SANITY_API_VERSION=2024-02-01

# CORS
FRONTEND_URL=https://your-domain.vercel.app

# Port
PORT=3000
EOF
```

**Time**: 2 minutes

---

### Step 3.2: Choose Backend Hosting

**Option A: Railway (Recommended - Easier)**

1. **Go to**: https://railway.app
2. **Sign up**: With GitHub
3. **Click**: "New Project"
4. **Select**: "Deploy from GitHub repo"
5. **Choose**: Your repository
6. **Root Directory**: `/backend`
7. **Build Command**: `npm install && npm run build`
8. **Start Command**: `npm run start:prod`

**Add Environment Variables** (in Railway dashboard):
- Copy all from `.env.production`
- Add each variable individually

**Time**: 5 minutes

---

**Option B: Render**

1. **Go to**: https://render.com
2. **Sign up**: With GitHub
3. **Click**: "New +" → "Web Service"
4. **Connect**: Your GitHub repository
5. **Settings**:
   - **Name**: `test-agency-backend`
   - **Region**: Closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free

**Add Environment Variables**:
- Click "Environment" tab
- Add all from `.env.production`

**Time**: 5 minutes

---

### Step 3.3: Get Backend URL

After deployment completes:

**Railway**: 
```
https://test-agency-backend-production.up.railway.app
```

**Render**:
```
https://test-agency-backend.onrender.com
```

**⭐ SAVE THIS URL**: You'll need it for frontend!

**Time**: 3-5 minutes (deployment time)

---

## 🌐 PHASE 4: Frontend Deployment (Vercel)

### Step 4.1: Prepare Frontend

Update `frontend/.env.production`:

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/frontend

cat > .env.production << 'EOF'
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend-url-here

# Site Config
NEXT_PUBLIC_SITE_NAME=Test Agency
NEXT_PUBLIC_SITE_DESCRIPTION=Your trusted testing partner

# Sanity Studio URL
NEXT_PUBLIC_SANITY_STUDIO_URL=https://test-agency-cms.sanity.studio
EOF
```

**Replace**:
- `your-backend-url-here` → Your backend URL from Step 3.3
- `test-agency-cms.sanity.studio` → Your studio URL from Step 2.4

**Time**: 2 minutes

---

### Step 4.2: Push Code to GitHub

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms

# Add all files
git add .

# Commit
git commit -m "Add Sanity CMS integration - production ready"

# Push to GitHub
git push origin main
```

**Time**: 1 minute

---

### Step 4.3: Deploy to Vercel

1. **Go to**: https://vercel.com
2. **Sign up/Login**: With GitHub
3. **Click**: "Add New..." → "Project"
4. **Import**: Your GitHub repository
5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

6. **Environment Variables** - Click "Environment Variables":

Add these variables:

```
NEXT_PUBLIC_API_URL = https://your-backend-url-here
NEXT_PUBLIC_SITE_NAME = Test Agency
NEXT_PUBLIC_SITE_DESCRIPTION = Your trusted testing partner
NEXT_PUBLIC_SANITY_STUDIO_URL = https://test-agency-cms.sanity.studio
```

7. **Click**: "Deploy"

**Time**: 5 minutes

---

### Step 4.4: Get Vercel URL

After deployment:

```
https://test-agency.vercel.app
```

**Vercel gives you**:
- Production URL: `https://your-project.vercel.app`
- Preview URLs: For each branch/PR
- Custom domain option (optional)

**⭐ SAVE THIS URL**: This is your live website!

**Time**: 2-3 minutes (deployment time)

---

### Step 4.5: Add Custom Domain (Optional)

1. **In Vercel Dashboard**: Go to your project
2. **Settings** → **Domains**
3. **Add Domain**: Enter your domain (e.g., `testagency.com`)
4. **Follow DNS instructions**: Add records to your domain registrar
5. **Wait**: 5-60 minutes for DNS propagation

**Time**: 5 minutes + propagation time

---

## 🗄️ PHASE 5: Database Setup

### Step 5.1: Choose Database Provider

**Option A: Railway MySQL (Recommended)**

1. **In Railway Dashboard**: Click "New"
2. **Select**: "Database" → "MySQL"
3. **Railway creates**: MySQL instance automatically
4. **Get Connection Details**:
   - Click on MySQL service
   - Go to "Connect" tab
   - Copy connection details

```
Host: containers-us-west-1.railway.app
Port: 6379
User: root
Password: abc123xyz
Database: railway
```

**Time**: 2 minutes

---

**Option B: PlanetScale (Free MySQL)**

1. **Go to**: https://planetscale.com
2. **Sign up**: With GitHub
3. **Create Database**: `test-agency-db`
4. **Region**: Closest to you
5. **Get Connection**: Copy connection string

**Time**: 3 minutes

---

**Option C: Keep Existing (If you have one)**

Use your existing MySQL database credentials.

---

### Step 5.2: Initialize Database Schema

**Upload schema to your database**:

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/backend

# If using Railway MySQL:
mysql -h your-host -P your-port -u your-user -p your-database < src/database/schema.sql

# Or using MySQL Workbench:
# 1. Connect to your database
# 2. File → Run SQL Script
# 3. Select backend/src/database/schema.sql
```

**Tables created**:
- users
- categories
- products
- images
- announcements
- contacts
- quotes

**Time**: 2 minutes

---

### Step 5.3: Update Backend Environment

**In Railway/Render Dashboard**, update these environment variables:

```
DB_HOST=your-railway-mysql-host
DB_PORT=6379
DB_USERNAME=root
DB_PASSWORD=your-mysql-password
DB_NAME=railway
```

**Click**: "Redeploy" or "Restart"

**Time**: 2 minutes + deployment time

---

## ⚙️ PHASE 6: Environment Configuration

### Step 6.1: Update Backend CORS

**In Railway/Render**, add/update:

```
FRONTEND_URL=https://test-agency.vercel.app
```

Replace with your actual Vercel URL.

**Time**: 1 minute

---

### Step 6.2: Update Sanity CORS

1. **Sanity Dashboard**: API → CORS Origins
2. **Add**: Your production URLs
   ```
   https://test-agency.vercel.app
   https://test-agency-backend.onrender.com
   ```
3. **Save**

**Time**: 1 minute

---

### Step 6.3: Verify All Environment Variables

**Backend (Railway/Render)**:
- ✅ DB_HOST
- ✅ DB_PORT
- ✅ DB_USERNAME
- ✅ DB_PASSWORD
- ✅ DB_NAME
- ✅ JWT_SECRET
- ✅ SANITY_PROJECT_ID
- ✅ SANITY_DATASET
- ✅ SANITY_API_TOKEN
- ✅ FRONTEND_URL

**Frontend (Vercel)**:
- ✅ NEXT_PUBLIC_API_URL
- ✅ NEXT_PUBLIC_SITE_NAME
- ✅ NEXT_PUBLIC_SANITY_STUDIO_URL

**Studio (Sanity)**:
- ✅ Deployed and accessible
- ✅ CORS configured

**Time**: 2 minutes

---

## 🧪 PHASE 7: Testing & Verification

### Step 7.1: Test Backend API

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/api/health

# Expected response:
{"status":"ok","timestamp":"2026-02-06T12:00:00.000Z"}
```

```bash
# Test products endpoint
curl https://your-backend-url.onrender.com/api/products

# Expected response:
{"data":[],"total":0,"page":1,"limit":10}
```

**Time**: 2 minutes

---

### Step 7.2: Test Frontend

1. **Open**: Your Vercel URL
2. **Check**:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Products page loads (empty is OK)
   - ✅ Contact form works
   - ✅ Images load properly

**Time**: 3 minutes

---

### Step 7.3: Test Sanity Studio

1. **Open**: Your Studio URL
2. **Login**: With Sanity account
3. **Create Test Product**:
   - Click "Products"
   - Click "Create"
   - Fill in:
     - Name: "Test Product"
     - Slug: Auto-generated
     - Price: 99.99
     - Description: "Test description"
   - Click "Publish"

4. **Verify on Frontend**:
   - Reload your website
   - Check products page
   - Should see "Test Product"

**Time**: 3 minutes

---

### Step 7.4: Test Admin Button

1. **Go to**: Your website
2. **Click**: "Admin" button (top-right)
3. **Should**:
   - Open new tab
   - Go to Sanity Studio
   - Show login (if not logged in)
   - Or show dashboard (if logged in)

**Time**: 1 minute

---

### Step 7.5: End-to-End Test

**Complete workflow**:

1. **Studio**: Create a category
   - Name: "Electronics"
   - Slug: "electronics"
   - Publish

2. **Studio**: Create a product
   - Name: "Laptop"
   - Category: Electronics
   - Price: 999.99
   - Upload image
   - Publish

3. **Website**: Verify product appears
   - Go to Products page
   - See "Laptop" card
   - Click to view details
   - Image loads properly

4. **Website**: Submit contact form
   - Go to Contact page
   - Fill form
   - Submit

5. **Studio**: Check contact submission
   - Go to "Contact Submissions"
   - See new entry
   - Update status

**✅ If all work**: You're production ready!

**Time**: 5 minutes

---

## 👥 PHASE 8: Client Handover

### Step 8.1: Create Client Sanity Account

**Option A: Invite to existing project**

1. **Sanity Dashboard**: Settings → Members
2. **Click**: "Invite Member"
3. **Enter**: Client's email
4. **Role**: "Editor" or "Administrator"
5. **Send**: Invitation

**Time**: 2 minutes

---

**Option B: Transfer project ownership**

1. **Sanity Dashboard**: Settings → General
2. **Transfer Project**: Enter client's email
3. **Confirm**: They accept

**Time**: 2 minutes

---

### Step 8.2: Document Client Credentials

Create a file for client:

```
CLIENT_CREDENTIALS.txt
=====================

Website: https://test-agency.vercel.app
Admin Panel: https://test-agency-cms.sanity.studio

Sanity Login:
Email: client@example.com
Password: [They set their own]

Quick Start:
1. Go to website
2. Click "Admin" button (top-right)
3. Login with email above
4. Start managing content!

Support Contact:
Email: your@email.com
Phone: +1 234 567 8900
```

**Time**: 3 minutes

---

### Step 8.3: Training Session

**15-Minute Walkthrough** (use CLIENT_HANDOVER.md):

1. **Login** (2 min)
   - Show how to access studio
   - Login process
   - Dashboard overview

2. **Create Product** (5 min)
   - Click Products → Create
   - Fill all fields
   - Upload images
   - Publish

3. **Create Category** (2 min)
   - Click Categories → Create
   - Basic fields
   - Publish

4. **Manage Announcements** (2 min)
   - Upload gallery images
   - Set active/inactive

5. **View Submissions** (2 min)
   - Contact forms
   - Quote requests
   - Update status

6. **Q&A** (2 min)

**Time**: 15 minutes

---

### Step 8.4: Handover Checklist

**Give Client**:
- [ ] Website URL
- [ ] Sanity Studio URL
- [ ] Login credentials
- [ ] CLIENT_HANDOVER.md guide
- [ ] VISUAL_GUIDE.md
- [ ] QUICK_REFERENCE_CARD.txt
- [ ] Support contact info

**Verify Client Can**:
- [ ] Access website
- [ ] Click Admin button
- [ ] Login to Studio
- [ ] Create/edit products
- [ ] Upload images
- [ ] View submissions

**Time**: 5 minutes

---

## 🎉 DEPLOYMENT COMPLETE!

### Your Live URLs:

```
✅ Website: https://test-agency.vercel.app
✅ Backend API: https://test-agency-backend.onrender.com
✅ Sanity Studio: https://test-agency-cms.sanity.studio
✅ Database: [Your MySQL host]
```

---

## 🆘 Troubleshooting

### Issue: "Backend not responding"

**Check**:
```bash
curl https://your-backend-url/api/health
```

**Solutions**:
1. Check Railway/Render logs
2. Verify environment variables
3. Check database connection
4. Restart backend service

---

### Issue: "Images not loading"

**Check**:
1. Sanity API token has "Editor" permissions
2. CORS origins include your domain
3. Image URLs in browser network tab

**Solution**:
```bash
# Test Sanity API
curl https://your-project-id.api.sanity.io/v2024-02-01/data/query/production?query=*[_type=="product"][0...5]
```

---

### Issue: "Admin button goes nowhere"

**Check**:
1. `NEXT_PUBLIC_SANITY_STUDIO_URL` in Vercel
2. Studio is deployed
3. Browser console for errors

**Solution**:
1. Redeploy Studio: `cd studio && npm run deploy`
2. Update Vercel env variable
3. Redeploy frontend

---

### Issue: "Products not showing on website"

**Check**:
1. Products published in Studio (not draft)
2. Backend can access Sanity API
3. Frontend API_URL correct

**Debug**:
```bash
# Check backend Sanity connection
curl https://your-backend-url/api/products

# Should return data from Sanity
```

---

### Issue: "Database connection failed"

**Check**:
1. Database is running
2. Credentials are correct
3. Database allows connections from backend IP

**Solution**:
1. Verify DB_HOST, DB_PORT, etc.
2. Check database firewall rules
3. Test connection manually

---

### Issue: "CORS errors"

**Symptoms**: Browser console shows CORS errors

**Solution**:
1. **Backend**: Add frontend URL to CORS
2. **Sanity**: Add both frontend and backend URLs
3. Redeploy services

---

## 📊 Cost Breakdown

### Free Tier Limits:

**Sanity** (Free):
- 3 users
- 100k API requests/month
- 5GB bandwidth/month
- 10GB assets

**Vercel** (Hobby - Free):
- Unlimited websites
- 100GB bandwidth/month
- Automatic SSL
- Global CDN

**Railway** (Trial - Free):
- $5 credit/month
- ~500 hours uptime
- Then $0.000463/GB-hour

**Render** (Free):
- 750 hours/month
- Spins down after 15 min inactivity
- 100GB bandwidth/month

**Total**: $0/month for hobby projects! 🎉

---

## 🔄 Maintenance Tasks

### Weekly:
- [ ] Check error logs (Railway/Render/Vercel)
- [ ] Monitor Sanity usage
- [ ] Test website loads properly

### Monthly:
- [ ] Review Sanity API usage
- [ ] Check hosting costs
- [ ] Update dependencies (optional)
- [ ] Database backup

### As Needed:
- [ ] Add new products (client does this)
- [ ] Respond to contact forms
- [ ] Handle quote requests

---

## 📈 Next Steps

### Upgrades to Consider:

1. **Custom Domain** ($10-15/year)
   - Professional look
   - Better branding

2. **Sanity Growth Plan** ($99/month)
   - More users
   - Unlimited API requests
   - Priority support

3. **Vercel Pro** ($20/month)
   - Team collaboration
   - Analytics
   - More bandwidth

4. **CDN for Images**
   - Faster loading
   - Better performance

5. **Email Service**
   - SendGrid/Mailgun
   - Automated notifications

---

## 🎯 Success Metrics

**You've succeeded when**:

✅ Client can click "Admin" on website  
✅ Client can login to Sanity Studio  
✅ Client can create/edit products  
✅ Client can upload images  
✅ Changes appear on website immediately  
✅ Contact forms work  
✅ Quote requests work  
✅ Website loads fast  
✅ Mobile responsive  
✅ SSL certificate active  

---

## 📞 Support Resources

**Documentation**:
- Sanity: https://www.sanity.io/docs
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- NestJS: https://docs.nestjs.com

**Communities**:
- Sanity Slack: https://slack.sanity.io
- Vercel Discord: https://vercel.com/discord
- Next.js Discussions: https://github.com/vercel/next.js/discussions

**Your Project Docs**:
- CLIENT_HANDOVER.md
- VISUAL_GUIDE.md
- SANITY_CMS_SETUP.md
- DOCUMENTATION_INDEX.md

---

## 🎊 Congratulations!

You've successfully deployed a production-ready website with:

🎨 **Sanity CMS** - Professional content management  
⚡ **Vercel** - Fast, global hosting  
🔐 **Secure** - JWT auth, SSL certificates  
📱 **Mobile Friendly** - Responsive design  
🖼️ **Image Optimization** - Automatic compression  
👥 **Client Ready** - Easy to use, no coding needed  

**Your client can now**:
- Manage content independently
- Add products 24/7
- Upload images
- Handle customer inquiries
- No coding required!

---

**Made with ❤️ for Test Agency**

**Questions?** Refer to other documentation files or contact support.

**Happy Managing! 🚀**

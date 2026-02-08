# AWS S3 + CloudFront Deployment Guide

Complete guide to deploy your Next.js solar agency website to AWS S3 with CloudFront CDN.

**Total Cost: ₹120-170/month (~$1.50-2/month)**

---

## 📋 What You're Deploying

- **Frontend**: Next.js static site (exported HTML/CSS/JS)
- **CMS**: Sanity (already deployed - FREE)
- **Images**: Sanity CDN (FREE)
- **Contact**: WhatsApp (no database needed)

---

## 🎯 Architecture

```
User Request
    ↓
CloudFront CDN (Global, Fast) - ₹100-150/mo
    ↓
S3 Static Website - ₹20-50/mo
    ├── index.html
    ├── _next/ (static assets)
    └── All pages (products, gallery, about, contact)

Sanity CMS API (FREE)
    └── Products, Gallery, Announcements, Settings
```

---

## 📦 Prerequisites

1. **AWS Account** (free tier available)
2. **AWS CLI installed** (optional but recommended)
3. **Domain name** (optional - can use CloudFront URL)
4. **Node.js 18+** (already installed)

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Next.js for Static Export

#### 1.1 Update next.config.js

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/frontend
```

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  trailingSlash: true, // Better for S3
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
}

module.exports = nextConfig
```

#### 1.2 Build Static Site

```bash
# Build the static site
npm run build

# This creates an 'out' folder with all static files
# The 'out' folder is what we'll upload to S3
```

**Expected output:**
```
✓ Generating static pages (10/10)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB       100 kB
├ ○ /about                               3 kB       98 kB
├ ○ /contact                             4 kB       99 kB
├ ○ /gallery                             6 kB       101 kB
└ ○ /products                            7 kB       102 kB

○  (Static)  prerendered as static content

Export successful. Files written to out folder.
```

---

### Step 2: Create S3 Bucket

#### 2.1 Log into AWS Console

1. Go to: https://console.aws.amazon.com/s3/
2. Sign in to your AWS account
3. **Select Region**: Choose **Asia Pacific (Mumbai) - ap-south-1** (closest to India)

#### 2.2 Create Bucket

Click **"Create bucket"** and configure:

**Basic Settings:**
- **Bucket name**: `your-solar-agency-website` (must be globally unique)
- **AWS Region**: `ap-south-1` (Mumbai)

**Object Ownership:**
- ✅ Select **"ACLs disabled (recommended)"**

**Block Public Access:**
- ⚠️ **UNCHECK** "Block all public access"
- ✅ Check the acknowledgment: "I acknowledge that the current settings might result in this bucket and objects becoming public"

**Bucket Versioning:**
- ⚪ Disable (optional - enable if you want version history)

**Default encryption:**
- ✅ Enable (use SSE-S3)

Click **"Create bucket"**

---

### Step 3: Configure S3 Bucket for Website Hosting

#### 3.1 Enable Static Website Hosting

1. Click on your bucket name
2. Go to **"Properties"** tab
3. Scroll to **"Static website hosting"** section
4. Click **"Edit"**

Configure:
- ✅ **Enable** static website hosting
- **Hosting type**: Host a static website
- **Index document**: `index.html`
- **Error document**: `404.html`

Click **"Save changes"**

**Note the Endpoint URL** (e.g., `http://your-bucket.s3-website.ap-south-1.amazonaws.com`)

#### 3.2 Add Bucket Policy

1. Go to **"Permissions"** tab
2. Scroll to **"Bucket policy"** section
3. Click **"Edit"**

Add this policy (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

Click **"Save changes"**

---

### Step 4: Upload Files to S3

#### Option A: Using AWS Console (GUI)

1. Go to **"Objects"** tab in your bucket
2. Click **"Upload"**
3. Click **"Add folder"**
4. Select the **`out`** folder from your frontend directory
5. Click **"Upload"**

**Wait for upload to complete** (shows all files green checkmarks)

#### Option B: Using AWS CLI (Faster - Recommended)

**Install AWS CLI:**
```bash
# macOS
brew install awscli

# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: ap-south-1
# - Default output format: json
```

**Sync files to S3:**
```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/frontend

# Upload all files from 'out' folder
aws s3 sync out/ s3://YOUR-BUCKET-NAME/ --delete

# Set correct content types
aws s3 cp out/ s3://YOUR-BUCKET-NAME/ --recursive --exclude "*" --include "*.html" --content-type "text/html" --metadata-directive REPLACE
aws s3 cp out/ s3://YOUR-BUCKET-NAME/ --recursive --exclude "*" --include "*.css" --content-type "text/css" --metadata-directive REPLACE
aws s3 cp out/ s3://YOUR-BUCKET-NAME/ --recursive --exclude "*" --include "*.js" --content-type "application/javascript" --metadata-directive REPLACE
```

**Expected output:**
```
upload: out/index.html to s3://your-bucket/index.html
upload: out/_next/static/... to s3://your-bucket/_next/static/...
...
Completed 150 files
```

---

### Step 5: Test S3 Website

Visit your S3 endpoint URL:
```
http://YOUR-BUCKET-NAME.s3-website.ap-south-1.amazonaws.com
```

**You should see your website!** ✅

---

### Step 6: Setup CloudFront CDN (For Speed & HTTPS)

#### 6.1 Create CloudFront Distribution

1. Go to: https://console.aws.amazon.com/cloudfront/
2. Click **"Create distribution"**

**Origin Settings:**
- **Origin domain**: Select your S3 bucket from dropdown
- **Origin path**: Leave empty
- **Name**: Auto-filled (keep it)
- **Origin access**: **Origin access control settings (recommended)**
  - Click **"Create control setting"**
  - Name: `S3-OAC-solar-agency`
  - Click **"Create"**

**Default cache behavior:**
- **Viewer protocol policy**: **Redirect HTTP to HTTPS** ✅
- **Allowed HTTP methods**: GET, HEAD, OPTIONS
- **Cache policy**: CachingOptimized
- **Origin request policy**: CORS-S3Origin

**Settings:**
- **Price class**: Use only North America, Europe, Asia, Middle East and Africa (cheaper)
- **Alternate domain names (CNAMEs)**: Leave empty (or add your domain)
- **Custom SSL certificate**: Default CloudFront certificate
- **Default root object**: `index.html`
- **Standard logging**: Off (to save costs)

Click **"Create distribution"**

**⏳ Wait 5-15 minutes for deployment** (Status: "Deploying" → "Enabled")

#### 6.2 Update S3 Bucket Policy for CloudFront

After CloudFront is created, AWS will show a notification to update bucket policy.

1. Click **"Copy policy"** from the notification
2. Go back to S3 bucket → **Permissions** → **Bucket policy**
3. **Replace** the existing policy with CloudFront policy

**Or manually add this policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

#### 6.3 Get CloudFront URL

Once deployment is complete:
- **Distribution domain name**: `d1234abcd.cloudfront.net`
- This is your **production URL** ✅

**Test it:**
```
https://d1234abcd.cloudfront.net
```

Your website should load **with HTTPS** and **fast globally**! 🎉

---

### Step 7: Configure Custom Domain (Optional)

If you have a domain (e.g., `solaragency.com`):

#### 7.1 Request SSL Certificate

1. Go to **AWS Certificate Manager**: https://console.aws.amazon.com/acm/
2. **IMPORTANT**: Switch region to **US East (N. Virginia) us-east-1** (CloudFront requires this)
3. Click **"Request certificate"**
4. Choose **"Request a public certificate"**
5. **Domain names**:
   - `solaragency.com`
   - `www.solaragency.com`
6. **Validation method**: DNS validation
7. Click **"Request"**

**Validate domain:**
- Click on certificate ID
- Copy **CNAME name** and **CNAME value**
- Add these records to your domain DNS (GoDaddy, Namecheap, etc.)
- Wait 5-30 minutes for validation

#### 7.2 Add Domain to CloudFront

1. Go back to CloudFront distribution
2. Click **"Edit"**
3. **Alternate domain names (CNAMEs)**:
   - Add `solaragency.com`
   - Add `www.solaragency.com`
4. **Custom SSL certificate**: Select your certificate from dropdown
5. Click **"Save changes"**

#### 7.3 Update DNS Records

In your domain registrar (GoDaddy, Namecheap, etc.):

**Add these records:**

| Type | Name | Value |
|------|------|-------|
| A | @ | CloudFront distribution URL (use ALIAS if available) |
| CNAME | www | d1234abcd.cloudfront.net |

**Or if ALIAS not available:**

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | d1234abcd.cloudfront.net |
| CNAME | www | d1234abcd.cloudfront.net |

**Wait 10-60 minutes for DNS propagation**

**Test your domain:**
```
https://solaragency.com
https://www.solaragency.com
```

---

## 🔄 How to Update Website (After Changes)

### Quick Update Process:

```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms/frontend

# 1. Build new version
npm run build

# 2. Upload to S3
aws s3 sync out/ s3://YOUR-BUCKET-NAME/ --delete

# 3. Invalidate CloudFront cache (force refresh)
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
```

**Or create a deployment script:**

```bash
# Create: deploy-to-s3.sh
#!/bin/bash

echo "🔨 Building Next.js site..."
npm run build

echo "📤 Uploading to S3..."
aws s3 sync out/ s3://your-solar-agency-website/ --delete

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E1234ABCD5678 --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Site: https://d1234abcd.cloudfront.net"
```

**Make it executable:**
```bash
chmod +x deploy-to-s3.sh

# Run deployment
./deploy-to-s3.sh
```

---

## 💰 Cost Breakdown

### Monthly Costs (For 500 visitors/month):

| Service | Usage | Cost |
|---------|-------|------|
| **S3 Storage** | ~500MB static files | ₹10 (~$0.12) |
| **S3 Requests** | 2,000 GET requests | ₹2 (~$0.03) |
| **CloudFront Data Transfer** | ~5GB (500 visitors × 10MB) | ₹80 (~$1.00) |
| **CloudFront Requests** | 5,000 requests | ₹8 (~$0.10) |
| **Sanity CMS** | FREE tier | ₹0 |
| **Sanity CDN** | FREE (images) | ₹0 |
| **SSL Certificate** | AWS Certificate Manager | ₹0 (FREE) |
| **TOTAL** | | **₹100-120/month** |

### If Traffic Increases (1,000 visitors/month):

| Service | Cost |
|---------|------|
| S3 | ₹15 |
| CloudFront | ₹150 |
| Sanity | ₹0 (still free) |
| **TOTAL** | **₹165/month** |

---

## 🔒 Security Best Practices

### 1. CloudFront Only Access

Update S3 bucket policy to **ONLY** allow CloudFront:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT-ID:distribution/DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

### 2. Enable CloudFront WAF (Optional - Costs Extra)

Protects against DDoS and common attacks.

### 3. Environment Variables

Never commit `.env` files. Use AWS Secrets Manager for sensitive data.

---

## 🐛 Troubleshooting

### Issue 1: 404 on Subpages

**Problem**: `https://yoursite.com/products/` shows 404

**Solution**: Configure CloudFront error pages:
1. Go to CloudFront distribution → **Error pages**
2. Click **"Create custom error response"**
3. **HTTP error code**: 404
4. **Customize error response**: Yes
5. **Response page path**: `/404.html`
6. **HTTP response code**: 404
7. Click **"Create"**

### Issue 2: Old Content Still Showing

**Problem**: Updated site but seeing old version

**Solution**: Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation --distribution-id YOUR-ID --paths "/*"
```

### Issue 3: Images Not Loading

**Problem**: Sanity images show 403 error

**Solution**: Check `next.config.js` has Sanity domain:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
    },
  ],
}
```

### Issue 4: CSS/JS Not Loading

**Problem**: Styles missing, JS not working

**Solution**: Set correct content types when uploading:
```bash
aws s3 cp out/ s3://YOUR-BUCKET/ --recursive --content-type "text/html" --exclude "*" --include "*.html"
aws s3 cp out/ s3://YOUR-BUCKET/ --recursive --content-type "text/css" --exclude "*" --include "*.css"
aws s3 cp out/ s3://YOUR-BUCKET/ --recursive --content-type "application/javascript" --exclude "*" --include "*.js"
```

---

## 📊 Monitoring & Analytics

### CloudWatch Metrics (Free)

1. Go to CloudWatch: https://console.aws.amazon.com/cloudwatch/
2. View metrics:
   - **CloudFront**: Requests, Data transfer, Error rate
   - **S3**: Storage size, Requests

### Google Analytics (Recommended)

Add to your site for visitor tracking:

```html
<!-- Add to frontend/src/app/layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎯 Performance Optimization

### 1. Enable Compression in CloudFront

Already enabled by default for:
- `.js`, `.css`, `.html`, `.json`
- Reduces file sizes by 60-80%

### 2. Set Cache Headers

Update build to include cache headers:

Create `frontend/public/_headers`:
```
/*
  Cache-Control: public, max-age=3600
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=31536000
```

### 3. Image Optimization

Already done! You're using Next.js Image with Sanity CDN ✅

---

## 🚀 Alternative: Automated Deployment with GitHub Actions

Create `.github/workflows/deploy-s3.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
          
      - name: Deploy to S3
        run: |
          cd frontend
          aws s3 sync out/ s3://your-bucket-name/ --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

**Setup secrets in GitHub:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `CLOUDFRONT_DISTRIBUTION_ID`

---

## 📝 Checklist

- [ ] AWS account created
- [ ] S3 bucket created and configured
- [ ] Static website hosting enabled
- [ ] Files uploaded to S3
- [ ] CloudFront distribution created
- [ ] CloudFront deployed (status: Enabled)
- [ ] Website accessible via CloudFront URL
- [ ] SSL certificate requested (optional)
- [ ] Custom domain configured (optional)
- [ ] DNS records updated (optional)
- [ ] Deployment script created
- [ ] Test all pages (home, products, gallery, contact)
- [ ] Test WhatsApp button
- [ ] Test Sanity content loading
- [ ] Check images loading from Sanity CDN
- [ ] Verify contact form opens WhatsApp

---

## 🎉 Success!

Your website is now:
- ✅ Deployed to AWS S3
- ✅ Accelerated by CloudFront CDN
- ✅ Secured with HTTPS
- ✅ Costing only ₹100-120/month
- ✅ Commercially legal
- ✅ Globally fast
- ✅ Highly available (99.99% uptime)

**Need help?** Contact AWS Support or check:
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- CloudFront Docs: https://docs.aws.amazon.com/cloudfront/
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports

---

**Deployment Time:** 1-2 hours (first time), 5 minutes (updates)
**Monthly Cost:** ₹100-170 (₹1,830-1,900 saved vs ₹2,000 budget!)

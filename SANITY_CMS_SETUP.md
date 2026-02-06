# 🚀 SANITY CMS INTEGRATION - COMPLETE SETUP GUIDE

## 📋 Overview

This project now includes **Sanity CMS** integration, allowing your client to manage all content through a beautiful, user-friendly admin interface without touching code. The website remains exactly the same - only the content management is upgraded!

## ✨ What's Included

### Sanity Studio
- **Modern CMS Interface**: Beautiful, intuitive content editor
- **Real-time Preview**: See changes instantly
- **Image Management**: Upload and optimize images directly
- **Content Schemas**: Products, Categories, Announcements, Contacts, Quotes

### Backend Integration
- **Sanity Service**: Complete API adapter for Sanity
- **Dual Mode Support**: Can work with Sanity OR MySQL
- **Seamless Integration**: Frontend doesn't need any changes

### Production Ready
- **Vercel Deployment**: One-click deployment
- **Environment Variables**: Secure configuration
- **TypeScript**: Full type safety
- **Image Optimization**: Automatic image handling

---

## 🎯 STEP-BY-STEP SETUP (For Client)

### Step 1: Create Sanity Account

1. Go to [https://www.sanity.io/](https://www.sanity.io/)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with:
   - Email
   - GitHub
   - Google
   - Or any preferred method

### Step 2: Create New Sanity Project

1. After login, click **"Create Project"**
2. Choose a project name: **"Test Agency CMS"** (or any name)
3. Choose dataset: **"production"**
4. Done! You'll get a **Project ID** - SAVE THIS!

### Step 3: Get API Token

1. In your Sanity project dashboard
2. Go to **Settings** → **API**
3. Click **"Add API Token"**
4. Name: **"Backend API Token"**
5. Permissions: **"Editor"** (allows read/write)
6. Click **"Add Token"**
7. **COPY THE TOKEN** - you won't see it again!

---

## 💻 INSTALLATION STEPS

### 1. Install Studio Dependencies

```bash
cd studio
npm install
```

### 2. Configure Studio

Create `studio/.env.local`:

```bash
SANITY_STUDIO_PROJECT_ID=your-project-id-from-step2
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2024-01-01
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install @sanity/client @sanity/image-url
```

### 4. Configure Backend

Update `backend/.env`:

```bash
# Sanity Configuration
SANITY_PROJECT_ID=your-project-id-from-step2
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_TOKEN=your-api-token-from-step3

# Set CMS Mode to Sanity
CMS_MODE=sanity
```

### 5. Start Sanity Studio

```bash
cd studio
npm run dev
```

Studio will open at: **http://localhost:3333**

### 6. Deploy Sanity Studio (Optional but Recommended)

```bash
cd studio
npm run deploy
```

This creates a hosted studio at: **https://your-project.sanity.studio**

---

## 📝 USING SANITY STUDIO

### Adding Products

1. Open Studio: http://localhost:3333 (or your hosted URL)
2. Click **"Products"** in the left menu
3. Click **"+"** to create new product
4. Fill in:
   - **Name**: Product name (e.g., "Solar Panel 300W")
   - **Slug**: Auto-generated URL (e.g., "solar-panel-300w")
   - **Description**: Product details
   - **Price**: Product price (number only, e.g., 299.99)
   - **Category**: Select from dropdown
   - **Featured Image**: Upload main product image
   - **Gallery**: Add multiple images
   - **Specifications**: Add key-value pairs (e.g., "Power: 300W")
   - **In Stock**: Check if available
   - **Featured**: Check if should appear on homepage
   - **Display Order**: Lower numbers appear first (0 = highest)
5. Click **"Publish"**

### Adding Categories

1. Click **"Categories"**
2. Click **"+"**
3. Fill in:
   - **Name**: Category name (e.g., "Solar Panels")
   - **Slug**: Auto-generated (e.g., "solar-panels")
   - **Description**: Category description
   - **Display Order**: Order in menu
4. Click **"Publish"**

### Adding Announcements (Gallery Images)

1. Click **"Announcements"**
2. Click **"+"**
3. Fill in:
   - **Title**: Announcement title
   - **Description**: Optional description
   - **Image**: Upload gallery image
   - **Status**: Active/Inactive
   - **Display Order**: Order in gallery
   - **Is Active**: Check to show
4. Click **"Publish"**

### Managing Contact Submissions

1. Click **"Contact Submissions"**
2. View all submitted contacts
3. Click on any to view details
4. Update **Status**: New → In Progress → Completed
5. Use as a task management system

### Managing Quote Requests

1. Click **"Quote Requests"**
2. View all quote requests
3. Click on any to see:
   - Customer details
   - Product requested
   - Quantity
   - Message
4. Add:
   - **Quoted Price**: Your price quote
   - **Notes**: Internal notes
   - **Status**: Pending → Quoted → Accepted/Declined
5. Click **"Save"**

---

## 🌐 VERCEL DEPLOYMENT

### Option 1: Deploy Frontend Only (Recommended)

#### Step 1: Prepare Frontend

1. Update `frontend/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

#### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository
5. **Framework Preset**: Next.js
6. **Root Directory**: `frontend`
7. **Environment Variables**: Add all from `.env.production`
8. Click **"Deploy"**
9. Done! Your site is live! 🎉

### Option 2: Deploy Backend (If Needed)

Backend can be deployed to:
- **Railway.app** (Recommended for Node.js)
- **Render.com**
- **Heroku**
- **DigitalOcean App Platform**

Example for Railway:

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Select `backend` folder
4. Add environment variables
5. Deploy!

---

## 🔄 MIGRATION FROM MYSQL TO SANITY

If you have existing data in MySQL:

### Step 1: Export MySQL Data

```bash
cd backend
node scripts/export-mysql-to-sanity.js
```

This creates JSON files of your data.

### Step 2: Import to Sanity

```bash
cd studio
sanity dataset import ../backend/exports/data.ndjson production --replace
```

### Step 3: Switch Mode

Update `backend/.env`:

```bash
CMS_MODE=sanity
```

Restart backend. Done! 🎉

---

## 🎨 CUSTOMIZING SANITY STUDIO

### Change Branding

Edit `studio/sanity.config.ts`:

```typescript
export default defineConfig({
  title: 'Your Company CMS',  // Change this
  // ... rest
})
```

### Add Custom Fields

Edit schema files in `studio/schemas/`:
- `product.ts` - Product fields
- `category.ts` - Category fields
- `announcement.ts` - Announcement fields
- `contact.ts` - Contact fields
- `quote.ts` - Quote fields

Example: Add "brand" field to products:

```typescript
defineField({
  name: 'brand',
  title: 'Brand',
  type: 'string',
}),
```

---

## 🔧 TROUBLESHOOTING

### Studio won't start
- Check if Project ID is correct in `.env.local`
- Run `npm install` again
- Delete `node_modules` and reinstall

### Backend can't fetch data
- Check SANITY_TOKEN is set correctly
- Verify Project ID matches
- Check dataset name (usually "production")

### Images not showing
- Sanity uses CDN URLs automatically
- Check if images are published in Studio
- Verify CORS settings in Sanity dashboard

### TypeScript errors
- Run `npm install` in both studio and backend
- Check `tsconfig.json` is present
- Restart TypeScript server in VSCode

---

## 📞 CLIENT SUPPORT

### Daily Use

Your client only needs to:
1. Open Sanity Studio (hosted URL or localhost)
2. Login with their Sanity account
3. Edit content
4. Click "Publish"
5. Changes appear on website instantly! ✨

### No Code Required!

Everything is point-and-click:
- ✅ Upload images by dragging
- ✅ Edit text in rich editor
- ✅ Reorder items by dragging
- ✅ Toggle active/inactive with checkbox
- ✅ See preview before publishing

---

## 🎯 ADVANTAGES FOR CLIENT

### Easy Content Management
- **No coding required**
- **Beautiful interface**
- **Real-time updates**
- **Image optimization automatic**
- **Mobile-friendly admin**

### Secure & Reliable
- **Enterprise-grade security**
- **Auto-backups**
- **99.99% uptime**
- **CDN for fast images**
- **Revision history** (undo changes)

### Scalable
- **Handles thousands of products**
- **Unlimited editors**
- **API access**
- **Webhooks for automation**
- **GraphQL support**

---

## 📚 FOLDER STRUCTURE

```
sanitycms/
├── studio/                    # Sanity Studio (CMS Admin)
│   ├── schemas/              # Content schemas
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── announcement.ts
│   │   ├── contact.ts
│   │   └── quote.ts
│   ├── sanity.config.ts      # Studio configuration
│   └── package.json
│
├── backend/                   # API Server
│   ├── src/
│   │   ├── sanity/           # Sanity integration
│   │   │   ├── sanity.service.ts
│   │   │   └── sanity.module.ts
│   │   └── ...
│   └── .env                  # Backend config
│
├── frontend/                  # Website (No changes needed!)
│   └── ...
│
└── vercel.json               # Deployment config
```

---

## 🚀 QUICK START CHECKLIST

For your client, print this checklist:

- [ ] Create Sanity account at sanity.io
- [ ] Create new project, get Project ID
- [ ] Generate API token with Editor permissions
- [ ] Install studio: `cd studio && npm install`
- [ ] Create `studio/.env.local` with Project ID
- [ ] Start studio: `npm run dev`
- [ ] Open http://localhost:3333
- [ ] Add first category
- [ ] Add first product
- [ ] Add first announcement
- [ ] Deploy studio: `npm run deploy`
- [ ] Update backend `.env` with Sanity credentials
- [ ] Set `CMS_MODE=sanity`
- [ ] Restart backend
- [ ] Test website - it works! 🎉
- [ ] Deploy to Vercel
- [ ] Share studio URL with client
- [ ] Client can now manage everything!

---

## 💰 PRICING (For Client Reference)

### Sanity CMS Pricing

**Free Plan** (Perfect for most clients):
- ✅ Unlimited API requests
- ✅ 3 admin users
- ✅ 10GB bandwidth
- ✅ 5GB assets
- ✅ Community support

**Growth Plan** ($99/month):
- Everything in Free
- ✅ Unlimited users
- ✅ 100GB bandwidth
- ✅ 100GB assets
- ✅ Premium support

**Enterprise** (Custom):
- Everything in Growth
- ✅ Unlimited everything
- ✅ SLA guarantees
- ✅ Dedicated support

### Vercel Hosting Pricing

**Hobby Plan** (Free):
- ✅ Perfect for client websites
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Unlimited bandwidth

**Pro Plan** ($20/month):
- Everything in Hobby
- ✅ Better analytics
- ✅ Team collaboration
- ✅ Priority support

---

## 🎓 LEARNING RESOURCES

### For Your Client

- **Sanity Studio Guide**: https://www.sanity.io/docs/sanity-studio
- **Video Tutorials**: https://www.sanity.io/learn
- **Help Center**: https://www.sanity.io/help

### For You (Developer)

- **Sanity Docs**: https://www.sanity.io/docs
- **Next.js + Sanity**: https://www.sanity.io/guides/nextjs
- **API Reference**: https://www.sanity.io/docs/http-api

---

## ✅ FINAL NOTES

### What Changes?

✅ **Content Management**: Now through Sanity Studio instead of admin panel
✅ **Data Storage**: Sanity cloud instead of MySQL
✅ **Image Hosting**: Sanity CDN (super fast!)

### What Stays the Same?

✅ **Website Design**: Exactly the same
✅ **Website Features**: Everything works
✅ **URLs**: Same structure
✅ **Performance**: Even better!

### Why This Is Better?

1. **Easier for Client**: Beautiful, modern interface
2. **No Server Management**: Sanity handles everything
3. **Automatic Backups**: Never lose data
4. **Better Images**: CDN delivery worldwide
5. **Scalable**: Grows with business
6. **Secure**: Enterprise-grade security
7. **Fast**: Real-time updates
8. **Reliable**: 99.99% uptime guaranteed

---

## 🤝 SUPPORT

### For Client

Help your client with:
- Initial Sanity account setup
- First product/category creation
- Understanding Studio interface
- Deploying Studio to hosted URL

### Maintenance

After setup, client is 100% independent:
- ✅ Add/edit/delete content themselves
- ✅ Upload images themselves
- ✅ Manage orders/quotes themselves
- ✅ No developer needed for content!

---

## 🎉 YOU'RE DONE!

The project is now:
- ✅ **Production Ready**
- ✅ **Client Friendly**
- ✅ **Fully Documented**
- ✅ **Easy to Deploy**
- ✅ **Scalable**
- ✅ **Professional**

Your client can now manage their entire website without any coding knowledge!

**Good luck! 🚀**

---

*Questions? Check Sanity docs or create an issue in the repository.*

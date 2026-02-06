# 🚀 Quick Start Guide - Announcements Feature

## Get Started in 3 Steps!

### Step 1: Run Database Migration

Choose your database type:

**MySQL:**
```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms
mysql -u YOUR_USERNAME -p YOUR_DATABASE < backend/src/database/migrations/001-add-announcements-mysql.sql
```

**PostgreSQL:**
```bash
cd /Users/mayurnikam/mytasks/freelance/deploy/sanitycms
psql -U YOUR_USERNAME -d YOUR_DATABASE -f backend/src/database/migrations/001-add-announcements.sql
```

**Or use the helper script:**
```bash
./deploy-announcements.sh mysql
# or
./deploy-announcements.sh postgresql
```

---

### Step 2: Restart Your Servers

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend (in another terminal):**
```bash
cd frontend
npm run dev
```

---

### Step 3: Create Your First Announcement

1. Open your browser: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. Click **"Announcements"** in the sidebar
4. Click **"+ Add Announcement"**
5. Fill in:
   - Title (required)
   - Description (optional)
   - Upload an image
   - Set display order (0 = top)
   - Keep status as "Active"
6. Click **"Create Announcement"**

---

## 🎉 Done!

The gallery will now be visible to the public at:
- **Public Gallery**: `http://localhost:3000/gallery`
- **Navigation Link**: Automatically appears in the header

---

## 📋 Quick Reference

### Admin URLs
- List: `http://localhost:3000/admin/announcements`
- Create: `http://localhost:3000/admin/announcements/new`
- Edit: `http://localhost:3000/admin/announcements/[id]`

### Public URLs
- Gallery: `http://localhost:3000/gallery`

### Features
- ✅ Upload images
- ✅ Active/Inactive status
- ✅ Display order control
- ✅ Lightbox viewer
- ✅ Responsive design
- ✅ Smart navigation (only shows when content exists)

---

## 🔧 Troubleshooting

**Gallery link not showing?**
- Make sure you've created at least one announcement
- Check that the announcement status is "Active"
- Refresh the page

**Images not uploading?**
- Check your upload service configuration
- Verify AWS S3 credentials (if using S3)
- Check file size (max 5MB)

**Backend errors?**
- Ensure database migration ran successfully
- Check backend logs: `cd backend && npm run start:dev`
- Verify all dependencies installed: `npm install`

---

## 📚 More Information

- **Full Documentation**: [ANNOUNCEMENTS_FEATURE.md](ANNOUNCEMENTS_FEATURE.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## 💡 Pro Tips

1. **Image Size**: Use 1920x1080px (16:9 ratio) for best results
2. **Display Order**: Start with 0 for highest priority, increment by 10 (0, 10, 20, 30...)
3. **Descriptions**: Keep them concise for better card display
4. **Status**: Use "Inactive" to hide announcements temporarily without deleting

---

## Need Help?

Check the troubleshooting section in [ANNOUNCEMENTS_FEATURE.md](ANNOUNCEMENTS_FEATURE.md) for detailed solutions.

Happy announcing! 🎊

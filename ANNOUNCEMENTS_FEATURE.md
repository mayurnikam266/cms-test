# Announcements & Image Gallery Feature

## Overview
The Announcements & Image Gallery feature allows administrators to create and manage announcements with images that are displayed in a public-facing gallery. The gallery is only visible when there is at least one active announcement.

## Features

### Admin Panel
- **Create Announcements**: Add new announcements with images, titles, and descriptions
- **Edit Announcements**: Update existing announcements
- **Delete Announcements**: Remove announcements from the system
- **Status Management**: Toggle announcements between active and inactive states
- **Display Order**: Control the order in which announcements appear in the gallery
- **Image Upload**: Upload announcement images to AWS S3 (or local storage)

### Public Gallery
- **Dynamic Visibility**: Gallery page and navigation link only appear when announcements exist
- **Grid Layout**: Responsive grid displaying all active announcements
- **Lightbox View**: Click on any announcement to view full-size image with details
- **Image Optimization**: Automatic image optimization and lazy loading

## Installation

### 1. Database Setup

#### For PostgreSQL:
```bash
psql -U your_user -d your_database -f backend/src/database/migrations/001-add-announcements.sql
```

#### For MySQL:
```bash
mysql -u your_user -p your_database < backend/src/database/migrations/001-add-announcements-mysql.sql
```

### 2. Backend Setup
The announcements module is already integrated into the backend. No additional setup required.

### 3. Frontend Setup
The gallery page and admin panel are already integrated. No additional setup required.

## Database Schema

### Announcements Table
```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(500) NOT NULL,
    imageKey VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    displayOrder INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Fields:
- **id**: Unique identifier (UUID)
- **title**: Announcement title (required)
- **description**: Optional detailed description
- **imageUrl**: URL to the uploaded image (required)
- **imageKey**: S3 key or file identifier (required)
- **status**: 'active' or 'inactive' (default: 'active')
- **displayOrder**: Sort order (lower numbers appear first, default: 0)
- **isActive**: Boolean flag for soft deletes (default: true)
- **createdAt**: Timestamp when created
- **updatedAt**: Timestamp when last updated

## API Endpoints

### Public Endpoints
- `GET /api/announcements?active=true` - Get all active announcements
- `GET /api/announcements/has-announcements` - Check if any announcements exist
- `GET /api/announcements/:id` - Get specific announcement

### Admin Endpoints (Requires Authentication)
- `POST /api/announcements` - Create new announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## Usage

### Admin Panel

1. **Navigate to Announcements**
   - Log into admin panel
   - Click "Announcements" in the sidebar

2. **Create New Announcement**
   - Click "+ Add Announcement"
   - Fill in title and optional description
   - Upload an image (recommended: 1920x1080px)
   - Set display order (0 = highest priority)
   - Set status (active/inactive)
   - Click "Create Announcement"

3. **Edit Announcement**
   - Click "Edit" on any announcement card
   - Modify fields as needed
   - Upload new image (optional)
   - Click "Update Announcement"

4. **Delete Announcement**
   - Click "Delete" on any announcement card
   - Confirm deletion

5. **Toggle Status**
   - Click "Activate" or "Deactivate" to change status quickly

### Public Gallery

The gallery is automatically available at `/gallery` when announcements exist.

- **View Gallery**: Navigate to the gallery page from the main navigation
- **View Full Image**: Click any announcement card to open lightbox view
- **Close Lightbox**: Click the X button or click outside the image

## Smart Navigation

The gallery link in the header navigation **only appears when there are active announcements**. This ensures:
- Clean navigation when no content is available
- Automatic visibility when content is added
- No broken or empty pages shown to users

## File Structure

### Backend
```
backend/src/announcements/
├── announcement.entity.ts       # TypeORM entity
├── announcement.dto.ts          # Data Transfer Objects
├── announcements.service.ts     # Business logic
├── announcements.controller.ts  # API endpoints
└── announcements.module.ts      # NestJS module
```

### Frontend
```
frontend/src/
├── app/
│   ├── admin/announcements/
│   │   ├── page.tsx             # Admin list view
│   │   ├── new/page.tsx         # Create form
│   │   └── [id]/page.tsx        # Edit form
│   └── (public)/gallery/
│       └── page.tsx             # Public gallery
├── lib/announcements.ts         # API client
└── components/Header.tsx        # Updated with conditional gallery link
```

## Image Guidelines

### Recommended Specifications:
- **Dimensions**: 1920x1080px (16:9 ratio) or similar
- **Format**: JPG, PNG, WebP
- **File Size**: Maximum 5MB
- **Quality**: High quality for best display

### Best Practices:
- Use consistent aspect ratios for all announcements
- Optimize images before upload for faster loading
- Use descriptive titles and descriptions
- Set appropriate display order for important announcements

## Maintenance

### Monitoring
- Check regularly for outdated announcements
- Remove inactive announcements that are no longer needed
- Update display order to prioritize current content

### Performance
- Images are automatically optimized
- Lazy loading is enabled
- Indexes ensure fast database queries

## Troubleshooting

### Gallery Not Showing
1. Check if any announcements exist in admin panel
2. Verify announcements have status = 'active'
3. Ensure isActive = true
4. Check browser console for API errors

### Images Not Loading
1. Verify image upload was successful
2. Check imageUrl is accessible
3. Verify AWS S3 permissions (if using S3)
4. Check CORS settings for external image hosting

### Admin Panel Issues
1. Ensure you're logged in as admin
2. Check JWT token is valid
3. Verify API endpoints are accessible
4. Check browser console for errors

## Future Enhancements

Potential features to add:
- Categories for announcements
- Scheduled publish/unpublish dates
- View count tracking
- Social media sharing
- Multiple images per announcement
- Video support
- Comments/reactions

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint responses
3. Check server logs in backend
4. Verify database connections

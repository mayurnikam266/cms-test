-- Migration: Add Announcements Table
-- Date: 2026-02-06
-- Description: Adds announcements/image gallery feature

-- Create announcements table for PostgreSQL
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "imageUrl" VARCHAR(500) NOT NULL,
    "imageKey" VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    "displayOrder" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements("isActive");
CREATE INDEX IF NOT EXISTS idx_announcements_order ON announcements("displayOrder");
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements("createdAt" DESC);

-- Create trigger for automatic updatedAt
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

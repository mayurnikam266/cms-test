-- Migration: Add Announcements Table (MySQL)
-- Date: 2026-02-06
-- Description: Adds announcements/image gallery feature for MySQL

-- Create announcements table for MySQL
CREATE TABLE IF NOT EXISTS announcements (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(500) NOT NULL,
    imageKey VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    displayOrder INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (status IN ('active', 'inactive'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for performance
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_active ON announcements(isActive);
CREATE INDEX idx_announcements_order ON announcements(displayOrder);
CREATE INDEX idx_announcements_created ON announcements(createdAt DESC);

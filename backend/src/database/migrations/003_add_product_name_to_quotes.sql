-- Migration: Add productName column to quotes table
-- Date: 2026-01-29
-- Description: Adds productName column to store product name at time of quote request for easier migration

-- Add productName column to quotes table
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS productName VARCHAR(255) NOT NULL DEFAULT '' AFTER productId;

-- Update existing quotes with current product names (if any exist)
UPDATE quotes q
INNER JOIN products p ON q.productId = p.id
SET q.productName = p.name
WHERE q.productName = '' OR q.productName IS NULL;

-- Make productName non-nullable (if it was nullable)
ALTER TABLE quotes MODIFY COLUMN productName VARCHAR(255) NOT NULL;

-- Migration: Add productName and productPrice columns to quotes table
-- Date: 2026-01-29
-- Description: Adds productName and productPrice columns to store product details at time of quote request

-- Add productName column to quotes table
ALTER TABLE quotes ADD COLUMN productName VARCHAR(255) NOT NULL DEFAULT '' AFTER productId;

-- Add productPrice column to quotes table
ALTER TABLE quotes ADD COLUMN productPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER productName;

-- Update existing quotes with current product names and prices (if any exist)
UPDATE quotes q
INNER JOIN products p ON q.productId = p.id
SET q.productName = p.name,
    q.productPrice = p.price
WHERE q.productPrice = 0.00 OR q.productName = '';

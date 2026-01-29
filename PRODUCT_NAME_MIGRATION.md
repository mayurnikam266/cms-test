# Database Migration Guide - Product Name in Quotes

## Overview
This migration adds `productName` column to the `quotes` table to store the product name at the time of quote request. This ensures product information is preserved even if the product is later deleted or renamed.

## Changes Made

### 1. Database Schema Changes
- **Table:** `quotes`
- **New Column:** `productName VARCHAR(255) NOT NULL`
- **Position:** After `productId` column

### 2. Backend Changes
- **File:** `/backend/src/quotes/quote.entity.ts`
  - Added `productName` property with TypeORM column decorator
  
- **File:** `/backend/src/quotes/quote.dto.ts`
  - Added `productName` validation with `@IsString()` decorator

- **File:** `/backend/src/quotes/quotes.service.ts`
  - Updated `findAll()` to explicitly load product relation using `leftJoinAndSelect`
  - Now loads product with images for comparison between quoted and current prices

### 3. Frontend Changes
- **File:** `/frontend/src/lib/contacts.ts`
  - Added `productName` to Quote interface

- **File:** `/frontend/src/app/(public)/products/[id]/quote/page.tsx`
  - Updated quote creation to send `productName` along with `productPrice`

- **File:** `/frontend/src/app/admin/quotes/page.tsx`
  - Updated to display `productName` from database instead of relying on relation
  - Maintains backward compatibility by showing product relation data when available

## Migration Instructions

### For Development Environment (MySQL)
```bash
# Connect to MySQL container
docker exec -it test_agency_mysql bash

# Run migration
mysql -u testuser -ptestpass test_agency_db < /path/to/migrations/003_add_product_name_to_quotes.sql
```

### For Production Environment

#### Option 1: Using MySQL Command Line
```bash
mysql -u your_user -p your_database < backend/src/database/migrations/003_add_product_name_to_quotes.sql
```

#### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your production database
3. Open the migration file: `backend/src/database/migrations/003_add_product_name_to_quotes.sql`
4. Execute the script

#### Option 3: Manual SQL Execution
```sql
-- Step 1: Add column
ALTER TABLE quotes ADD COLUMN productName VARCHAR(255) NOT NULL DEFAULT '' AFTER productId;

-- Step 2: Populate existing data
UPDATE quotes q
INNER JOIN products p ON q.productId = p.id
SET q.productName = p.name
WHERE q.productName = '';

-- Step 3: Ensure non-nullable
ALTER TABLE quotes MODIFY COLUMN productName VARCHAR(255) NOT NULL;
```

### For PostgreSQL Environment
```sql
-- Step 1: Add column
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS "productName" VARCHAR(255) NOT NULL DEFAULT '';

-- Step 2: Populate existing data
UPDATE quotes q
SET "productName" = p.name
FROM products p
WHERE q."productId" = p.id
AND (q."productName" = '' OR q."productName" IS NULL);

-- Step 3: Ensure non-nullable
ALTER TABLE quotes ALTER COLUMN "productName" SET NOT NULL;
```

## Verification

### Verify Column Was Added
```sql
DESCRIBE quotes;
-- or for PostgreSQL:
\d quotes
```

### Verify Data Was Populated
```sql
SELECT id, name, productId, productName, productPrice 
FROM quotes 
LIMIT 10;
```

### Expected Result
You should see:
1. `productName` column exists in table structure
2. All existing quotes have productName populated with product names
3. New quotes will have productName automatically set when created

## Rollback (If Needed)

### MySQL
```sql
ALTER TABLE quotes DROP COLUMN productName;
```

### PostgreSQL
```sql
ALTER TABLE quotes DROP COLUMN "productName";
```

## Testing After Migration

1. **Create a new quote:**
   - Go to any product page
   - Click "Request Quote"
   - Fill out the form and submit
   - Verify productName is saved in database

2. **View existing quotes:**
   - Login to admin panel
   - Go to "Quote Requests"
   - Verify all quotes show product names
   - Verify quoted price vs current price comparison works

3. **Test product deletion:**
   - Create a quote for a product
   - Delete the product
   - Verify the quote still shows the product name (from productName column)

## Benefits

1. **Data Preservation:** Product names are preserved even if product is deleted
2. **Performance:** Reduces dependency on product relation for basic display
3. **Migration Friendly:** All schema files updated for easy deployment
4. **Backward Compatible:** Still loads product relation for additional data (images, current price)
5. **Historical Accuracy:** Shows exact product name as it was when quote was requested

## Files Modified

### Schema Files (All Updated)
- `/backend/src/database/schema-mysql.sql`
- `/backend/src/database/schema.sql`
- `/backend/src/database/create-missing-tables.sql`
- `/backend/src/database/migrations/001_add_contacts_quotes_tables.sql`
- `/backend/src/database/migrations/002_add_product_price_to_quotes.sql`
- `/backend/src/database/migrations/003_add_product_name_to_quotes.sql` (NEW)

### Backend Files
- `/backend/src/quotes/quote.entity.ts`
- `/backend/src/quotes/quote.dto.ts`
- `/backend/src/quotes/quotes.service.ts`

### Frontend Files
- `/frontend/src/lib/contacts.ts`
- `/frontend/src/app/(public)/products/[id]/quote/page.tsx`
- `/frontend/src/app/admin/quotes/page.tsx`

## Support

If you encounter any issues during migration:
1. Check database credentials in `.env` file
2. Verify table exists: `SHOW TABLES LIKE 'quotes';`
3. Check for existing data: `SELECT COUNT(*) FROM quotes;`
4. Review error logs in application console
5. Ensure NestJS server is restarted after migration

## Version History
- **v1.0** (2026-01-29): Initial migration - Added productPrice column
- **v1.1** (2026-01-29): Added productName column for better data integrity

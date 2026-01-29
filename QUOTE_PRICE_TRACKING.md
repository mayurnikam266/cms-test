# Quote System - Product Price Tracking

## Overview

The quote system now tracks the product price at the time of quote request. This ensures that you have a historical record of what price was shown to the customer when they requested a quote, even if product prices change later.

## Features

### 1. **Product Price at Quote Time**
When a customer requests a quote, the system automatically captures and stores:
- Product ID
- Product name (via relation)
- **Product price at the time of quote** (new field: `productPrice`)
- Customer details
- Delivery requirements

### 2. **Admin Panel Display**

In the admin quotes panel (`/admin/quotes`), you can now see:
- **Quote Price**: The price that was shown to the customer when they requested the quote
- **Current Price**: If the product price has changed, it shows the current price with an "(Price changed!)" indicator
- Product thumbnail and name
- Complete customer details

### 3. **Detailed Quote View**

Clicking "View Details" shows:
- Customer information (name, email, phone, address)
- Product name
- Quoted price (price at time of request)
- Current price (if different from quoted price)
- Expected delivery date
- Request submission date
- Customer message

## Database Changes

### New Column: `productPrice`

Added to `quotes` table:
```sql
productPrice DECIMAL(10, 2) NOT NULL
```

This column stores the product price at the time the quote was requested.

## Files Updated

### Backend
1. **Entity**: `/backend/src/quotes/quote.entity.ts`
   - Added `productPrice` column

2. **DTO**: `/backend/src/quotes/quote.dto.ts`
   - Added `productPrice` validation

3. **Schemas** (All updated for easy migration):
   - `/backend/src/database/schema-mysql.sql` (MySQL full schema)
   - `/backend/src/database/schema.sql` (PostgreSQL full schema)
   - `/backend/src/database/migrations/001_add_contacts_quotes_tables.sql`
   - `/backend/src/database/migrations/002_add_product_price_to_quotes.sql` (New migration)
   - `/backend/src/database/create-missing-tables.sql`

### Frontend
1. **Types**: `/frontend/src/lib/contacts.ts`
   - Added `productPrice` to Quote interface

2. **Quote Request Form**: `/frontend/src/app/(public)/products/[id]/quote/page.tsx`
   - Automatically sends product price when creating quote

3. **Admin Panel**: `/frontend/src/app/admin/quotes/page.tsx`
   - Shows quoted price vs current price
   - Enhanced detail view with all information

## Migration Instructions

### For Existing Database

Run the migration script:
```bash
# Using Docker (development)
docker cp backend/src/database/migrations/002_add_product_price_to_quotes.sql test_agency_mysql:/tmp/migration.sql
docker exec test_agency_mysql sh -c "mysql -utestuser -ptestpass test_agency_db < /tmp/migration.sql"

# Direct MySQL (production)
mysql -u username -p database_name < backend/src/database/migrations/002_add_product_price_to_quotes.sql
```

This will:
1. Add the `productPrice` column to the `quotes` table
2. Update existing quotes with current product prices

### For Fresh Database

Use the full schema which already includes the `productPrice` column:
```bash
mysql -u username -p database_name < backend/src/database/schema-mysql.sql
```

## Benefits

1. **Price History**: Keep track of what price was communicated to customers
2. **Price Changes Detection**: Easily see if product prices have changed since the quote request
3. **Accurate Quoting**: Provide accurate quotes based on the price the customer saw
4. **Audit Trail**: Complete record of pricing at the time of customer interaction

## Testing

### Create a New Quote
1. Go to any product page
2. Click "Get a Quote"
3. Fill in the form
4. Submit

### View in Admin Panel
1. Login to admin (`/admin/login`)
2. Go to Quote Requests
3. See the quoted price for each request
4. Click "View Details" to see complete information

### Test Price Change Detection
1. Create a quote for a product
2. Change the product's price in admin
3. View the quote in admin panel
4. You'll see both the original quoted price and the new current price

## API Response Example

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "address": "123 Main St",
  "expectedDeliveryDate": "2026-02-15",
  "message": "Need urgent delivery",
  "productId": "product-uuid",
  "productPrice": 7200.00,
  "product": {
    "id": "product-uuid",
    "name": "Solar Panel 200W",
    "price": "7500.00",
    "images": [...]
  },
  "status": "pending",
  "createdAt": "2026-01-29T10:00:00Z",
  "updatedAt": "2026-01-29T10:00:00Z"
}
```

Note: `productPrice` (7200.00) vs `product.price` (7500.00) indicates the price increased after the quote request.

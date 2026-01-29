# Database Setup & Migration Guide

## Overview
The Test Agency application uses MySQL database with the following tables:
- `users` - User accounts and authentication
- `categories` - Product categories
- `products` - Product catalog
- `images` - Product images
- `contacts` - Customer contact form submissions
- `quotes` - Product quote requests

## Quick Setup

### For Local Development (Docker MySQL)

The tables are already created in your local Docker database. If you need to recreate them:

```bash
# Navigate to backend directory
cd backend

# Copy and run the full schema
docker cp src/database/schema-mysql.sql test_agency_mysql:/tmp/schema.sql
docker exec test_agency_mysql sh -c "mysql -utestuser -ptestpass test_agency_db < /tmp/schema.sql"
```

### For Production MySQL

1. **Create Database:**
```sql
CREATE DATABASE test_agency_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Run Full Schema:**
```bash
mysql -u your_username -p test_agency_db < backend/src/database/schema-mysql.sql
```

3. **Or Run Migrations Individually:**
```bash
# First, create base tables (users, categories, products, images)
mysql -u your_username -p test_agency_db < backend/src/database/schema-mysql.sql

# Then run additional migrations
mysql -u your_username -p test_agency_db < backend/src/database/migrations/001_add_contacts_quotes_tables.sql
```

### For PostgreSQL

```bash
psql -U your_username -d test_agency_db -f backend/src/database/schema.sql
```

## Verify Tables

### MySQL
```bash
# Check all tables
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e "SHOW TABLES;"

# Check specific table structure
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e "DESCRIBE contacts;"
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e "DESCRIBE quotes;"
```

### View Data
```bash
# View contacts
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e "SELECT * FROM contacts;"

# View quotes
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e "SELECT * FROM quotes;"
```

## Schema Files Location

- **MySQL Schema**: `backend/src/database/schema-mysql.sql`
- **PostgreSQL Schema**: `backend/src/database/schema.sql`
- **Migrations**: `backend/src/database/migrations/`

## Default Admin Account

After running the schema, you'll have a default admin account:
- **Email**: admin@test-agency.com
- **Password**: SecureAdminPassword123!

## Troubleshooting

### "Table doesn't exist" Error

If you get an error like `Table 'test_agency_db.contacts' doesn't exist`:

1. Run the migration:
```bash
docker cp backend/src/database/migrations/001_add_contacts_quotes_tables.sql test_agency_mysql:/tmp/migration.sql
docker exec test_agency_mysql sh -c "mysql -utestuser -ptestpass test_agency_db < /tmp/migration.sql"
```

2. Verify tables exist:
```bash
docker exec test_agency_mysql mysql -utestuser -ptestpass test_agency_db -e "SHOW TABLES;"
```

### Index Already Exists Error

This is safe to ignore. The indexes were already created when the tables were created.

### Foreign Key Constraint Fails

Make sure parent tables (like `products`) exist before creating tables with foreign keys (like `quotes`).

## Backup & Restore

### Backup
```bash
docker exec test_agency_mysql mysqldump -utestuser -ptestpass test_agency_db > backup.sql
```

### Restore
```bash
docker exec -i test_agency_mysql mysql -utestuser -ptestpass test_agency_db < backup.sql
```

## Production Deployment

1. Create database on production server
2. Run `schema-mysql.sql` to create all tables
3. Update `.env` file with production database credentials
4. Restart the application

## Environment Variables

Required in `.env`:
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=testuser
DATABASE_PASSWORD=testpass
DATABASE_NAME=test_agency_db
```

# Database Migrations

This directory contains SQL migration scripts for database schema changes.

## How to Run Migrations

### For MySQL (Development/Production)

Run a specific migration:
```bash
docker exec test_agency_mysql sh -c "mysql -utestuser -ptestpass test_agency_db < /path/to/migration.sql"
```

Or copy the file to the container first:
```bash
docker cp backend/src/database/migrations/001_add_contacts_quotes_tables.sql test_agency_mysql:/tmp/migration.sql
docker exec test_agency_mysql sh -c "mysql -utestuser -ptestpass test_agency_db < /tmp/migration.sql"
```

### For Production MySQL

1. Copy the migration file to your production server
2. Run the migration:
```bash
mysql -u username -p database_name < migrations/001_add_contacts_quotes_tables.sql
```

### For PostgreSQL

```bash
psql -U username -d database_name -f migrations/001_add_contacts_quotes_tables.sql
```

## Available Migrations

- `001_add_contacts_quotes_tables.sql` - Creates contacts and quotes tables with indexes

## Notes

- Migrations use `IF NOT EXISTS` to safely run multiple times
- Some SQL features may differ between MySQL and PostgreSQL
- Always backup your database before running migrations in production
- Index creation may fail if indexes already exist (this is safe to ignore)

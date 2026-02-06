#!/bin/bash

# Announcements Feature Deployment Script
# This script helps deploy the announcements feature to your database

echo "========================================"
echo "Announcements Feature Deployment"
echo "========================================"
echo ""

# Check if database type is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy-announcements.sh [mysql|postgresql]"
    echo "Example: ./deploy-announcements.sh mysql"
    exit 1
fi

DB_TYPE=$1

echo "Database Type: $DB_TYPE"
echo ""

# Set the migration file based on database type
if [ "$DB_TYPE" = "mysql" ]; then
    MIGRATION_FILE="backend/src/database/migrations/001-add-announcements-mysql.sql"
    echo "Using MySQL migration file"
elif [ "$DB_TYPE" = "postgresql" ]; then
    MIGRATION_FILE="backend/src/database/migrations/001-add-announcements.sql"
    echo "Using PostgreSQL migration file"
else
    echo "Error: Invalid database type. Use 'mysql' or 'postgresql'"
    exit 1
fi

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo ""
echo "Migration file: $MIGRATION_FILE"
echo ""
echo "========================================"
echo "IMPORTANT: Database Connection Required"
echo "========================================"
echo ""
echo "Please run the following command to apply the migration:"
echo ""

if [ "$DB_TYPE" = "mysql" ]; then
    echo "mysql -u YOUR_USERNAME -p YOUR_DATABASE < $MIGRATION_FILE"
    echo ""
    echo "Or with host:"
    echo "mysql -h YOUR_HOST -u YOUR_USERNAME -p YOUR_DATABASE < $MIGRATION_FILE"
elif [ "$DB_TYPE" = "postgresql" ]; then
    echo "psql -U YOUR_USERNAME -d YOUR_DATABASE -f $MIGRATION_FILE"
    echo ""
    echo "Or with host:"
    echo "psql -h YOUR_HOST -U YOUR_USERNAME -d YOUR_DATABASE -f $MIGRATION_FILE"
fi

echo ""
echo "========================================"
echo "After Running Migration"
echo "========================================"
echo ""
echo "1. Restart your backend server:"
echo "   cd backend && npm run start:dev"
echo ""
echo "2. The announcements feature will be available at:"
echo "   - Admin Panel: http://localhost:3000/admin/announcements"
echo "   - Public Gallery: http://localhost:3000/gallery"
echo ""
echo "3. The Gallery link will only appear in navigation after"
echo "   you create your first announcement."
echo ""
echo "========================================"
echo "Documentation"
echo "========================================"
echo ""
echo "For detailed documentation, see:"
echo "ANNOUNCEMENTS_FEATURE.md"
echo ""

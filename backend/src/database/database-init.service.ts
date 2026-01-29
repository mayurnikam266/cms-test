import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleInit() {
    console.log('🔍 Checking database schema...');
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Check if tables exist
      const tablesExist = await this.checkTablesExist();
      
      if (!tablesExist) {
        console.log('📋 Creating database schema...');
        await this.createSchema();
        console.log('✅ Database schema created successfully');
      } else {
        console.log('✅ Database schema already exists');
      }

      // Ensure admin user exists
      await this.ensureAdminUser();
      
      // Ensure default categories exist
      await this.ensureDefaultCategories();

    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async checkTablesExist(): Promise<boolean> {
    try {
      const result = await this.dataSource.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name IN ('users', 'categories', 'products', 'images')
      `);
      return result[0].count === 4;
    } catch (error) {
      return false;
    }
  }

  private async createSchema() {
    const schema = `
      -- Users Table
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user' NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- Categories Table
      CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- Products Table
      CREATE TABLE IF NOT EXISTS products (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        specifications TEXT,
        status VARCHAR(20) DEFAULT 'draft' NOT NULL,
        stock INT DEFAULT 0,
        sku VARCHAR(100),
        categoryId CHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_category (categoryId),
        INDEX idx_status (status),
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- Images Table
      CREATE TABLE IF NOT EXISTS images (
        id CHAR(36) PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        altText VARCHAR(255),
        isFeatured BOOLEAN DEFAULT FALSE,
        displayOrder INT DEFAULT 0,
        productId CHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_product (productId),
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await this.dataSource.query(statement);
      }
    }
  }

  private async ensureAdminUser() {
    try {
      // Check if admin exists
      const [admin] = await this.dataSource.query(
        'SELECT id FROM users WHERE email = ?',
        [process.env.ADMIN_EMAIL || 'admin@test-agency.com']
      );

      if (!admin) {
        console.log('👤 Creating admin user...');
        const hashedPassword = await bcrypt.hash(
          process.env.ADMIN_INITIAL_PASSWORD || 'SecureAdminPassword123!',
          parseInt(process.env.BCRYPT_ROUNDS || '10')
        );

        await this.dataSource.query(
          `INSERT INTO users (id, email, password, role, firstName, lastName, isActive) 
           VALUES (?, ?, ?, 'admin', 'Admin', 'User', TRUE)`,
          [uuidv4(), process.env.ADMIN_EMAIL || 'admin@test-agency.com', hashedPassword]
        );
        console.log('✅ Admin user created successfully');
        console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@test-agency.com'}`);
        console.log(`   Password: ${process.env.ADMIN_INITIAL_PASSWORD || 'SecureAdminPassword123!'}`);
      } else {
        console.log('✅ Admin user already exists');
      }
    } catch (error) {
      console.error('Failed to create admin user:', error);
    }
  }

  private async ensureDefaultCategories() {
    try {
      const [count] = await this.dataSource.query('SELECT COUNT(*) as count FROM categories');
      
      if (count.count === 0) {
        console.log('📁 Creating default categories...');
        const categories = [
          { name: 'Solar Panels', description: 'High-efficiency photovoltaic panels for residential and commercial use' },
          { name: 'Inverters', description: 'Power conversion systems for solar installations' },
          { name: 'Batteries', description: 'Energy storage solutions for solar systems' },
          { name: 'Mounting Systems', description: 'Racks and mounting hardware for solar panels' },
          { name: 'Electronics', description: 'Components, cables, and accessories' }
        ];

        for (const cat of categories) {
          await this.dataSource.query(
            'INSERT INTO categories (id, name, description, isActive) VALUES (?, ?, ?, TRUE)',
            [uuidv4(), cat.name, cat.description]
          );
        }
        console.log('✅ Default categories created');
      } else {
        console.log('✅ Categories already exist');
      }
    } catch (error) {
      console.error('Failed to create categories:', error);
    }
  }
}

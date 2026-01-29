-- MySQL Schema for Test Agency

-- Users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (role IN ('admin', 'user'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    specifications TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100),
    featured TINYINT(1) DEFAULT 0,
    categoryId CHAR(36),
    featuredImageUrl VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (status IN ('active', 'inactive', 'draft')),
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Images table
CREATE TABLE images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `key` VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    altText VARCHAR(255),
    isFeatured BOOLEAN DEFAULT false,
    productId CHAR(36),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts table
CREATE TABLE contacts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (status IN ('new', 'reviewed', 'responded'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quotes table
CREATE TABLE quotes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    expectedDeliveryDate DATE NOT NULL,
    message TEXT,
    productId CHAR(36) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    productPrice DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (status IN ('pending', 'reviewed', 'quoted', 'rejected')),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created ON products(createdAt DESC);
CREATE INDEX idx_images_product ON images(productId);
CREATE INDEX idx_categories_active ON categories(isActive);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(createdAt DESC);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_product ON quotes(productId);
CREATE INDEX idx_quotes_created ON quotes(createdAt DESC);

-- Insert initial admin user (password: SecureAdminPassword123!)
-- This is a bcrypt hash with 10 rounds
INSERT INTO users (id, email, password, role, firstName, lastName) 
VALUES (
    UUID(),
    'admin@test-agency.com',
    '$2b$10$BC40FKBoA6a1wy0E2DX4I.yvHBYMu1bWu8iaigFzpXVBZbPYF5Jhq',
    'admin',
    'Admin',
    'User'
);

-- Insert default categories
INSERT INTO categories (id, name, description, icon, isActive) VALUES
    (UUID(), 'Solar Panels', 'High-efficiency solar panels for residential and commercial use', '☀️', true),
    (UUID(), 'Inverters', 'Solar inverters and power conversion systems', '⚡', true),
    (UUID(), 'Batteries', 'Energy storage solutions and battery systems', '🔋', true),
    (UUID(), 'Electronics', 'Electronic components and accessories', '📱', true),
    (UUID(), 'Accessories', 'Cables, connectors, and mounting equipment', '🔧', true);

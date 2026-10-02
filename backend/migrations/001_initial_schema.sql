-- ================================================================
-- AURA Studio - Relational Database Schema (PostgreSQL / Supabase)
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. ADMIN REFRESH TOKENS TABLE
CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    image TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(255) NOT NULL DEFAULT 'AURA Atelier',
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255) NOT NULL,
    category_slug VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(12, 2) NULL CHECK (original_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    badge VARCHAR(50) NULL,
    description TEXT NOT NULL DEFAULT '',
    overview TEXT NOT NULL DEFAULT '',
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    is_flash_sale BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCT IMAGES TABLE (Metadata pointing to Supabase Storage)
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    storage_path TEXT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color_name VARCHAR(100) NULL,
    color_hex VARCHAR(50) NULL,
    size VARCHAR(50) NULL,
    price_override NUMERIC(12, 2) NULL CHECK (price_override >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. CUSTOMERS TABLE (Guest Patron aggregation)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    order_count INT NOT NULL DEFAULT 1,
    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
    last_order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
    minimum_order NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (minimum_order >= 0),
    start_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMPTZ NOT NULL,
    usage_limit INT NULL CHECK (usage_limit > 0),
    usage_count INT NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_apartment VARCHAR(255) NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_division VARCHAR(100) NULL,
    customer_postal_code VARCHAR(50) NULL,
    delivery_notes TEXT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    coupon_id VARCHAR(100) REFERENCES coupons(id) ON DELETE SET NULL,
    coupon_code VARCHAR(100) NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    payment_details JSONB NULL,
    delivered_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. ORDER ITEMS TABLE (Snapshot of product information)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    product_name_snapshot VARCHAR(255) NOT NULL,
    sku_snapshot VARCHAR(100) NOT NULL,
    selected_color VARCHAR(100) NULL,
    selected_size VARCHAR(50) NULL,
    image_snapshot TEXT NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. COUPON USAGES TABLE
CREATE TABLE IF NOT EXISTS coupon_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id VARCHAR(100) NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    discount_applied NUMERIC(12, 2) NOT NULL,
    used_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. HOMEPAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS homepage_content (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    hero JSONB NOT NULL,
    announcement JSONB NOT NULL,
    promotional_banner JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- PERFORMANCE INDEXES
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_admin_refresh_tokens_hash ON admin_refresh_tokens(token_hash);

-- ============================================================
-- E-Commerce Database Setup Script
-- Run this in MySQL Workbench (or terminal):
--   mysql -u root -p < setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200)   NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    image       VARCHAR(500)   DEFAULT NULL,
    rating      DECIMAL(3, 1)  DEFAULT 4.5,
    reviews     INT            DEFAULT 0,
    stock       TINYINT(1)     DEFAULT 1,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    cart_id    INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT            NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status       VARCHAR(50)    DEFAULT 'Completed',
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT            NOT NULL,
    product_id INT            NOT NULL,
    quantity   INT            NOT NULL,
    price      DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed Data — Categories
-- ============================================================

INSERT IGNORE INTO categories (id, name) VALUES
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Shoes'),
(4, 'Home & Living'),
(5, 'Beauty'),
(6, 'Accessories'),
(7, 'Sports');

-- ============================================================
-- Seed Data — Products  (each with a unique, matching image)
-- ============================================================

INSERT IGNORE INTO products (id, name, price, image, rating, reviews, stock, category_id) VALUES
(1,  'Wireless Headphones',   79.99,  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',  4.8, 124, 1, 1),
(2,  'Smart Watch Pro',       129.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',  4.6, 89,  1, 1),
(3,  'Wireless Mouse',        24.99,  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600',  4.4, 93,  1, 1),
(4,  'Classic White T-Shirt', 29.99,  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',  4.5, 156, 1, 2),
(5,  'Denim Jacket',          69.99,  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',     4.4, 78,  1, 2),
(6,  'Premium Sneakers',      89.99,  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',     4.7, 215, 1, 3),
(7,  'Running Shoes',         74.99,  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600',  4.6, 187, 1, 3),
(8,  'Modern Table Lamp',     44.99,  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',  4.3, 64,  1, 4),
(9,  'Ceramic Coffee Mug',    14.99,  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',  4.2, 45,  1, 4),
(10, 'Luxury Face Cream',     34.99,  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',     4.9, 302, 1, 5),
(11, 'Skincare Gift Set',     65.99,  'https://images.unsplash.com/photo-1556228720-da1ed2c3f9ef?w=600',     4.8, 92,  1, 5),
(12, 'Leather Handbag',       99.99,  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',  4.7, 118, 1, 6),
(13, 'Classic Sunglasses',    39.99,  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',  4.5, 102, 1, 6),
(14, 'Yoga Mat Premium',      45.99,  '/images/products/yoga-mat.svg',  4.9, 203, 1, 7),
(15, 'Running Shorts',        34.99,  '/images/products/running-shorts.svg',  4.4, 67,  1, 7);
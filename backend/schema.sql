-- ==========================================================
-- BẢNG USERS (Tài khoản người dùng & thông tin cửa hàng)
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  store_name VARCHAR(255),
  store_phone VARCHAR(50),
  store_address TEXT,
  store_fb VARCHAR(255),
  store_fb_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BẢNG MENU (Thực đơn món ăn)
-- ==========================================================
CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BẢNG STOCK (Quản lý kho nguyên vật liệu)
-- ==========================================================
CREATE TABLE IF NOT EXISTS stock (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  qty NUMERIC(12, 2) NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BẢNG ORDER_TYPES (Cấu hình loại đơn hàng)
-- ==========================================================
CREATE TABLE IF NOT EXISTS order_types (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  require_address BOOLEAN DEFAULT false,
  require_time BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BẢNG SALES_HISTORY (Lịch sử đơn hàng & doanh thu)
-- ==========================================================
CREATE TABLE IF NOT EXISTS sales_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  order_id VARCHAR(50),
  time VARCHAR(50),
  customer VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  pickup_time VARCHAR(50),
  subtotal NUMERIC(12, 2) DEFAULT 0,
  discount_percent NUMERIC(5, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  type VARCHAR(50),
  items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- BẢNG LANDING_PAGES (Trang web giới thiệu thực đơn quán)
-- ==========================================================
CREATE TABLE IF NOT EXISTS landing_pages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  title VARCHAR(255),
  description TEXT,
  hero_image TEXT,
  opening_hours VARCHAR(255),
  logo_url VARCHAR(255),
  theme_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- MIGRATION: BỔ SUNG CỘT CHO CÁC BẢNG ĐÃ TỒN TẠI TỪ TRƯỚC
-- ==========================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_phone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_fb VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_fb_url TEXT;

ALTER TABLE order_types ADD COLUMN IF NOT EXISTS require_address BOOLEAN DEFAULT false;
ALTER TABLE order_types ADD COLUMN IF NOT EXISTS require_time BOOLEAN DEFAULT false;

ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS time VARCHAR(50);
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS customer VARCHAR(255);
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(50);
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE sales_history ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12, 2) DEFAULT 0;

ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS opening_hours VARCHAR(255);

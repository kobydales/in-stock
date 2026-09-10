-- Adds staff-attribution tracking for products (needed for the "which
-- staff added this product" feature). Stock movements already tracked
-- user_id, so this brings products in line with that.
--
-- Run this once against your database, from the backend/ folder:
--   psql -U instock_user -d instock -f migrations/2026-09-add-created-by-to-products.sql
-- (adjust user/db name to match your .env if different)

ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);

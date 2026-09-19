-- Adds password reset token storage. A token is a random string, hashed
-- before storage (never store the raw token), with an expiry.
--
-- Run this once against your database, from the backend/ folder:
--   psql -U instock_user -d instock -f migrations/2026-09-add-password-reset.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;
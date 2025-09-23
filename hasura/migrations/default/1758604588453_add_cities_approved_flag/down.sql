-- File: migrations/[timestamp]_add_description_and_approved_to_venues/down.sql

DROP INDEX IF EXISTS idx_venues_approved;

ALTER TABLE venues
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS approved;

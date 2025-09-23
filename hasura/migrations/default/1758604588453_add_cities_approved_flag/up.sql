-- File: migrations/[timestamp]_add_description_and_approved_to_venues/up.sql

ALTER TABLE venues
ADD COLUMN description TEXT,
ADD COLUMN approved BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_venues_approved ON venues(approved);

COMMENT ON COLUMN venues.description IS 'Detailed description of the venue facilities and features';
COMMENT ON COLUMN venues.approved IS 'Administrative approval status - false by default, requires admin approval';

-- Down migration: convert text[] back to text
ALTER TABLE venues
ALTER COLUMN keywords TYPE text
USING array_to_string(keywords, ',');

ALTER TABLE venues
ALTER COLUMN keywords TYPE text[]
USING string_to_array(keywords, ',');

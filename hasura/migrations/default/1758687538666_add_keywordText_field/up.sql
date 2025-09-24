ALTER TABLE venues
ADD COLUMN keywords_text TEXT;

COMMENT ON COLUMN venues.keywords_text IS 'Keywords as free-form text for easy searching';



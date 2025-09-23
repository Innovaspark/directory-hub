ALTER TABLE venues
ADD COLUMN content TEXT;

COMMENT ON COLUMN venues.content IS 'HTML formatted description of the venue facilities and features';

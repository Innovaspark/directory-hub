-- Create tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Live Music Venues"
  slug TEXT NOT NULL UNIQUE, -- "live-music"
  description TEXT,
  domain_names TEXT[], -- ["gigawhat.com", "localhost:4200", "gigawhat.test"]

  -- API configuration
  search_terms TEXT[], -- ["live music", "concerts", "venues", "nightlife"]

  -- UI configuration
  keywords TEXT[], -- ["music", "concerts", "live shows", "nightlife"]

  -- Venue types as JSON with metadata
  venue_types JSONB DEFAULT '[]'::jsonb,

  -- Other settings
  settings JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

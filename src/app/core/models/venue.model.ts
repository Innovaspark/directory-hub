export interface Venue {
  id: string;
  name: string;
  keywords?: string;
  province?: string;
  city?: string;
  full_address?: string;
  street?: string;
  postal_code?: string;
  state?: string;
  country?: string;
  phone?: string;
  site?: string;
  review_count?: number;
  review_summary?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  photo?: string;
  street_view?: string;
  primary_type: string;
  venue_types: string;
  working_hours?: string;
  business_status?: string;
  location_link?: string;
  created_at?: string;
  updated_at?: string;
}

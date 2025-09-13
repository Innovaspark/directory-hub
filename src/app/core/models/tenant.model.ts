// models/tenant.model.ts
export interface VenueType {
  slug: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}


export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  domain_names: string[];
  search_terms: string[];
  keywords: string[];
  venue_types: VenueType[];
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

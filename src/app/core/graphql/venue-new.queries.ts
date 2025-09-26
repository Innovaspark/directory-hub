import { gql } from '@apollo/client/core';

export const VENUE_FIELDS = `
  id
  name
  description
  content
  keywords
  keywords_text
  province
  cityByCityId {
    id
    name
    slug
    is_live
    country {
      code
      name
    }
  }
  full_address
  street
  postal_code
  state
  country
  phone
  site
  review_count
  review_summary
  rating
  latitude
  longitude
  photo
  street_view
  primary_type
  venue_types
  working_hours
  business_status
  location_link
  approved
  created_at
  updated_at
`;

export const GET_VENUES = gql`
  query GetVenues($limit: Int, $offset: Int) {
    venues(limit: $limit, offset: $offset, order_by: {name: asc}) {
      ${VENUE_FIELDS}
    }
    venues_aggregate {
      aggregate { count }
    }
  }
`;

export const GET_VENUES_APPROVED = gql`
  query GetVenuesApproved($limit: Int, $offset: Int, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: { approved: { _eq: $approved } },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: { approved: { _eq: $approved } }) {
      aggregate { count }
    }
  }
`;

export const GET_VENUES_BY_CITY = gql`
  query GetVenuesByCity($limit: Int, $offset: Int, $citySlug: String!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: { cityByCityId: { slug: { _eq: $citySlug } } },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: { cityByCityId: { slug: { _eq: $citySlug } } }) {
      aggregate { count }
    }
  }
`;

export const GET_VENUES_BY_CITY_APPROVED = gql`
  query GetVenuesByCityApproved($limit: Int, $offset: Int, $citySlug: String!, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          { approved: { _eq: $approved } }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { slug: { _eq: $citySlug } } },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const GET_VENUES_BY_COUNTRY = gql`
  query GetVenuesByCountry($limit: Int, $offset: Int, $countryCode: String!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: { cityByCityId: { country: { code: { _eq: $countryCode } } } },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: { cityByCityId: { country: { code: { _eq: $countryCode } } } }) {
      aggregate { count }
    }
  }
`;

export const GET_VENUES_BY_COUNTRY_APPROVED = gql`
  query GetVenuesByCountryApproved($limit: Int, $offset: Int, $countryCode: String!, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { country: { code: { _eq: $countryCode } } } },
          { approved: { _eq: $approved } }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { country: { code: { _eq: $countryCode } } } },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const GET_VENUE_BY_ID = gql`
  query GetVenueById($id: uuid!) {
    venues_by_pk(id: $id) {
      ${VENUE_FIELDS}
    }
  }
`;

// Consolidated search queries - replaces all the individual SEARCH_ queries
export const SEARCH_VENUES_BY_CITY = gql`
  query SearchVenuesByCity(
    $where: venues_bool_exp!
    $limit: Int
    $offset: Int
  ) {
    venues(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { name: asc }
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: $where) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_COUNTRY = gql`
  query SearchVenuesByCountry(
    $where: venues_bool_exp!
    $limit: Int
    $offset: Int
  ) {
    venues(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { name: asc }
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: $where) {
      aggregate { count }
    }
  }
`;

// Type interfaces
interface CitySearchParams {
  countryCode: string;
  citySlug: string;
  searchTerm?: string;
  keywords?: string;
  showOnlyApproved?: boolean;
}

interface CountrySearchParams {
  countryCode: string;
  searchTerm?: string;
  keywords?: string;
  showOnlyApproved?: boolean;
}

// Helper function to build where clause for city-based searches (country + city required)
export const buildCitySearchWhere = (params: CitySearchParams) => {
  const { countryCode, citySlug, searchTerm, keywords, showOnlyApproved = false } = params;

  const conditions: any[] = [
    { cityByCityId: { country: { code: { _eq: countryCode } } } },
    { cityByCityId: { slug: { _eq: citySlug } } }
  ];

  // Handle both searchTerm and keywords as separate parameters
  const searchConditions: any[] = [];

  if (searchTerm) {
    searchConditions.push({ name: { _ilike: `%${searchTerm}%` } });
  }

  if (keywords) {
    searchConditions.push({ keywords_text: { _ilike: `%${keywords}%` } });
  }

  // If we have both, use AND logic. If we have either, use OR logic
  if (searchConditions.length > 0) {
    if (searchTerm && keywords) {
      // Both provided - use AND (both must match)
      conditions.push(...searchConditions);
    } else {
      // Only one provided - use OR (either can match)
      conditions.push({ _or: searchConditions });
    }
  }

  if (showOnlyApproved) {
    conditions.push({ approved: { _eq: true } });
  }

  return { _and: conditions };
};

// Helper function to build where clause for country-only searches (country required, no city)
export const buildCountrySearchWhere = (params: CountrySearchParams) => {
  const { countryCode, searchTerm, keywords, showOnlyApproved = false } = params;

  const conditions: any[] = [
    { cityByCityId: { country: { code: { _eq: countryCode } } } }
  ];

  // Handle both searchTerm and keywords as separate parameters
  const searchConditions: any[] = [];

  if (searchTerm) {
    searchConditions.push({ name: { _ilike: `%${searchTerm}%` } });
  }

  if (keywords) {
    searchConditions.push({ keywords_text: { _ilike: `%${keywords}%` } });
  }

  // If we have both, use AND logic. If we have either, use OR logic
  if (searchConditions.length > 0) {
    if (searchTerm && keywords) {
      // Both provided - use AND (both must match)
      conditions.push(...searchConditions);
    } else {
      // Only one provided - use OR (either can match)
      conditions.push({ _or: searchConditions });
    }
  }

  if (showOnlyApproved) {
    conditions.push({ approved: { _eq: true } });
  }

  return { _and: conditions };
};

// Wrapper functions that use the helpers - these are what you'll actually call
export const searchVenuesByCity = (client: any, params: {
  countryCode: string;
  citySlug: string;
  searchTerm?: string;
  keywords?: string;
  showOnlyApproved?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const { countryCode, citySlug, searchTerm, keywords, showOnlyApproved, limit, offset } = params;
  const where = buildCitySearchWhere({ countryCode, citySlug, searchTerm, keywords, showOnlyApproved });

  return client.query({
    query: SEARCH_VENUES_BY_CITY,
    variables: { where, limit, offset }
  });
};

export const searchVenuesByCountry = (client: any, params: {
  countryCode: string;
  searchTerm?: string;
  keywords?: string;
  showOnlyApproved?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const { countryCode, searchTerm, keywords, showOnlyApproved, limit, offset } = params;
  const where = buildCountrySearchWhere({ countryCode, searchTerm, keywords, showOnlyApproved });

  return client.query({
    query: SEARCH_VENUES_BY_COUNTRY,
    variables: { where, limit, offset }
  });
};

export const BULK_UPDATE_VENUES = gql`
  mutation BulkUpdateVenues($updates: [venues_updates!]!) {
    update_venues_many(updates: $updates) {
      affected_rows
      returning {
        ${VENUE_FIELDS}
      }
    }
  }
`;

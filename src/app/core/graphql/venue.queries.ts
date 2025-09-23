import { gql } from '@apollo/client/core';

export const VENUE_FIELDS = `
  id
  name
  description
  content
  keywords
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

export const SEARCH_VENUES_BY_CITY_AND_NAME = gql`
  query SearchVenuesByCityAndName($citySlug: String!, $venueName: String!, $limit: Int, $offset: Int) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          { name: { _ilike: $venueName } }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { slug: { _eq: $citySlug } } },
        { name: { _ilike: $venueName } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_CITY_AND_NAME_APPROVED = gql`
  query SearchVenuesByCityAndNameApproved($citySlug: String!, $venueName: String!, $limit: Int, $offset: Int, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          { name: { _ilike: $venueName } },
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
        { name: { _ilike: $venueName } },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS = gql`
  query SearchVenuesByCityNameAndKeywords($citySlug: String!, $venueName: String, $keywords: String, $limit: Int, $offset: Int) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          {
            _or: [
              { name: { _ilike: $venueName } },
              { keywords: { _ilike: $keywords } }
            ]
          }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { slug: { _eq: $citySlug } } },
        {
          _or: [
            { name: { _ilike: $venueName } },
            { keywords: { _ilike: $keywords } }
          ]
        }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS_APPROVED = gql`
  query SearchVenuesByCityNameAndKeywordsApproved($citySlug: String!, $venueName: String, $keywords: String, $limit: Int, $offset: Int, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          {
            _or: [
              { name: { _ilike: $venueName } },
              { keywords: { _ilike: $keywords } }
            ]
          },
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
        {
          _or: [
            { name: { _ilike: $venueName } },
            { keywords: { _ilike: $keywords } }
          ]
        },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS = gql`
  query SearchVenuesByCountryAndKeywords($countryCode: String!, $searchTerm: String!, $limit: Int, $offset: Int) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { country: { code: { _eq: $countryCode } } } },
          {
            _or: [
              { name: { _ilike: $searchTerm } },
              { keywords: { _ilike: $searchTerm } }
            ]
          }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { country: { code: { _eq: $countryCode } } } },
        {
          _or: [
            { name: { _ilike: $searchTerm } },
            { keywords: { _ilike: $searchTerm } }
          ]
        }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS_APPROVED = gql`
  query SearchVenuesByCountryAndKeywordsApproved($countryCode: String!, $searchTerm: String!, $limit: Int, $offset: Int, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { country: { code: { _eq: $countryCode } } } },
          {
            _or: [
              { name: { _ilike: $searchTerm } },
              { keywords: { _ilike: $searchTerm } }
            ]
          },
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
        {
          _or: [
            { name: { _ilike: $searchTerm } },
            { keywords: { _ilike: $searchTerm } }
          ]
        },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS = gql`
  query SearchVenuesByCityWithBothParams($citySlug: String!, $venueName: String!, $keywords: String!, $limit: Int, $offset: Int) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          { name: { _ilike: $venueName } },
          { keywords: { _ilike: $keywords } }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { slug: { _eq: $citySlug } } },
        { name: { _ilike: $venueName } },
        { keywords: { _ilike: $keywords } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS_APPROVED = gql`
  query SearchVenuesByCityWithBothParamsApproved($citySlug: String!, $venueName: String!, $keywords: String!, $limit: Int, $offset: Int, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { slug: { _eq: $citySlug } } },
          { name: { _ilike: $venueName } },
          { keywords: { _ilike: $keywords } },
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
        { name: { _ilike: $venueName } },
        { keywords: { _ilike: $keywords } },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS = gql`
  query SearchVenuesByCountryWithBothParams($countryCode: String!, $searchTerm: String!, $keywords: String!, $limit: Int, $offset: Int) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { country: { code: { _eq: $countryCode } } } },
          { name: { _ilike: $searchTerm } },
          { keywords: { _ilike: $keywords } }
        ]
      },
      order_by: {name: asc}
    ) {
      ${VENUE_FIELDS}
    }
    venues_aggregate(where: {
      _and: [
        { cityByCityId: { country: { code: { _eq: $countryCode } } } },
        { name: { _ilike: $searchTerm } },
        { keywords: { _ilike: $keywords } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

export const SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS_APPROVED = gql`
  query SearchVenuesByCountryWithBothParamsApproved($countryCode: String!, $searchTerm: String!, $keywords: String!, $limit: Int, $offset: Int, $approved: Boolean!) {
    venues(
      limit: $limit,
      offset: $offset,
      where: {
        _and: [
          { cityByCityId: { country: { code: { _eq: $countryCode } } } },
          { name: { _ilike: $searchTerm } },
          { keywords: { _ilike: $keywords } },
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
        { name: { _ilike: $searchTerm } },
        { keywords: { _ilike: $keywords } },
        { approved: { _eq: $approved } }
      ]
    }) {
      aggregate { count }
    }
  }
`;

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


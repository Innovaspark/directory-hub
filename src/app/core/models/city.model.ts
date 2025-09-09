import {Country} from "@core/models/country.model";

export interface City {
  slug: string;
  name: string;
  countryCode: string;
  country: Country;
  state: string;
  emoji: string;
  timezone: string;
  venueCount: number;
  isActive: boolean;
  is_live: boolean;
  launchDate: string;
}

// export interface City {
//   slug: string;
//   name: string;
//   countryCode: string;
//   emoji: string;
//   venueCount?: number;
// }

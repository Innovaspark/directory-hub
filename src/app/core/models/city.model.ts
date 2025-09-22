import {Country} from "@core/models/country.model";

export interface CityPhoto {
  url: string;
  alt: string;
  credit: string;
  primary: boolean;
}
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
  description: string;
  content: string;
  photos: CityPhoto[];
}

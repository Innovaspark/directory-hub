// models/country.model.ts
// export interface Country {
//   id: string;
//   code: string;
//   name: string;
//   is_live?: boolean;
//   created_at?: string;
//   updated_at?: string;
// }


export interface Country {
  code: string;
  name: string;
  emoji: string;
  slug: string;
  description: string;
  capital?: string;
  population?: number;
  language?: string;
  currency?: string;
  timezone?: string;
}


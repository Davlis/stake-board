export type ID = string;

export interface Indexed {
  id: ID;
}

export type Entity<T extends Record<string, any>> = T & Indexed;

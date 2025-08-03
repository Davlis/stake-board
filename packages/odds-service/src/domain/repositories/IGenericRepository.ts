import { Entity, ID } from 'domain/types';

export abstract class IGenericRepository<T extends Record<string, any>> {
  abstract getAll(): Promise<Entity<T>[]>;

  abstract getById(id: ID): Promise<Entity<T> | null>;

  abstract create(fields: T): Promise<Entity<T>>;

  abstract update(id: ID, fields: Partial<T>): Promise<void>;

  abstract delete(id: ID): Promise<void>;

  abstract createMany(fields: T[]): Promise<void>;
}

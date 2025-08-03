import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import { IGenericRepository } from 'domain/repositories/IGenericRepository';
import { Entity, ID } from 'domain/types';

export interface IndexedObjectLiteral extends ObjectLiteral {
  readonly id: ID;
}

abstract class GenericTypeORMRepository<
  T extends ObjectLiteral,
  D extends IndexedObjectLiteral,
> implements IGenericRepository<T>
{
  constructor(protected repository: Repository<D>) {}

  public abstract mapRowToEntity(doc: D): Entity<T>;

  public abstract mapEntityFieldsToRow(fields: Partial<T>): DeepPartial<D>;

  async create(fields: T): Promise<Entity<T>> {
    const row = this.repository.create(this.mapEntityFieldsToRow(fields));
    const result = await this.repository.save(row);
    return this.mapRowToEntity(result);
  }

  async delete(id: ID) {
    await this.repository.delete(id);
  }

  async getAll(): Promise<Entity<T>[]> {
    const rows = await this.repository.find();
    return rows.map((row) => this.mapRowToEntity(row));
  }

  async getById(id: ID): Promise<Entity<T> | null> {
    const findOptions = {
      id,
    } as FindOptionsWhere<D>;
    const row = await this.repository.findOne({
      where: findOptions,
    });
    return row ? this.mapRowToEntity(row) : null;
  }

  async update(id: ID, fields: Partial<T>) {
    await this.repository.update(id, this.mapEntityFieldsToRow(fields));
  }

  async createMany(fields: T[]): Promise<void> {
    const rows = this.repository.create(
      fields.map((f) => this.mapEntityFieldsToRow(f)),
    );
    await this.repository.save(rows);
  }
}

export default GenericTypeORMRepository;

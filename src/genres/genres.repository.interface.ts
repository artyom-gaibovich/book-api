import { inject } from 'inversify';
import { TYPES } from '../types';
import {PgPoolService} from "../database/pg-pool.service";

export class GenreRepository {
    constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

    async findAll(): Promise<any[]> {
        const query = 'SELECT * FROM genres';
        const result = await this.databaseService.query(query);
        return result;
    }

    async findById(title: string): Promise<string[]> {
        const query = 'SELECT * FROM genres WHERE id = $1';
        const result = await this.databaseService.query(query, [title]);
        return result.length > 0 ? result[0] : null;
    }
}

import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PgPoolService } from "../database/pg-pool.service";
import { GenresRepositoryInterface } from './genres.repository.interface';
import {GenreModel} from "./genre.model";

@injectable()
export class GenresRepository implements GenresRepositoryInterface {
    constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

    async findById(id: number): Promise<GenreModel | null> {
        const query = 'SELECT * FROM genres WHERE id = $1;';
        const result = await this.databaseService.query(query, [id]);
        if (result.length === 0) {
            return null;
        }
        const genre = result[0];
        return genre as GenreModel;
    }
}

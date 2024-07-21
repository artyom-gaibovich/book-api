import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PgPoolService } from "../database/pg-pool.service";
import {BookGenreModel} from "./book-genres.model";
import {BookGenresRepositoryInterface} from "./book-genres.repository.interface";

@injectable()
export class BookGenresRepository implements BookGenresRepositoryInterface {
    constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

    async findAll(): Promise<any[]> {
        const query = `
			SELECT b.id, b.title, b.author, b.publication_date, json_agg(json_build_object('id', g.id, 'title', g.title)) AS genres
			FROM books b
			JOIN book_genres bg ON b.id = bg.book_id
			JOIN genres g ON bg.genre_id = g.id
			GROUP BY b.id;
		`;
        const result = await this.databaseService.query(query);
        return result as any[];
    }

    async findByBookId(bookId: number): Promise<any | null> {
        const query = `
			SELECT b.id, b.title, b.author, b.publication_date, json_agg(json_build_object('id', g.id, 'title', g.title)) AS genres
			FROM books b
			JOIN book_genres bg ON b.id = bg.book_id
			JOIN genres g ON bg.genre_id = g.id
			WHERE b.id = $1
			GROUP BY b.id;
		`;
        const result = await this.databaseService.query(query, [bookId]);
        if (result.length === 0) {
            return null;
        }
        return result[0] as any;
    }




   /* async findAll(): Promise<BookGenreModel[]> {
        const query = 'SELECT * FROM book_genres;';
        const result = await this.databaseService.query(query);
        return result as BookGenreModel[];
    }

    async findByBookId(bookId: number): Promise<BookGenreModel[]> {
        const query = 'SELECT * FROM book_genres WHERE book_id = $1;';
        const result = await this.databaseService.query(query, [bookId]);
        return result as BookGenreModel[];
    }

*/

    async create(bookId: number, genreId: number): Promise<BookGenreModel | null> {
        const query = 'INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2) RETURNING *;';
        const result = await this.databaseService.query(query, [bookId, genreId]);
        if (result.length === 0) {
            //TODO Handler error correctly
            return null;
        }
        const bookGenre = result[0];
        return bookGenre as BookGenreModel;
    }

    async delete(bookId: number, genreId: number): Promise<void> {
        const query = 'DELETE FROM book_genres WHERE book_id = $1 AND genre_id = $2;';
        await this.databaseService.query(query, [bookId, genreId]);
    }
}

import {BookModel} from "../database/model/book.model";
import {BookRepositoryInterface} from "./book.repository.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PgPoolService} from "../database/pg-pool.service";


@injectable()
export class BookRepository implements BookRepositoryInterface {
    constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

    async findAll(): Promise<BookModel[] | null> {
        const query = `
            SELECT 
                b.id AS book_id, 
                b.title AS book_title, 
                b.publicationDate AS book_publication_date,
                g.title AS genre_title
            FROM books b
            LEFT JOIN book_genres bg ON b.id = bg.book_id
            LEFT JOIN genres g ON bg.genre_id = g.id
        `;

        const result = await this.databaseService.query(query);
        if (result.length === 0) {
            return null;
        }

        const booksMap: { [key: number]: BookModel } = {};

        result.forEach((row: any) => {
            const bookId = row.book_id;
            if (!booksMap[bookId]) {
                booksMap[bookId] = {
                    id: bookId,
                    author: row.book_author,
                    title: row.book_title,
                    publicationDate: row.book_publication_date,
                    genres: []
                };
            }
            if (row.genre_title) {
                booksMap[bookId].genres.push(row.genre_title);
            }
        });

        return Object.values(booksMap);
    }

    async findById(id: number): Promise<BookModel | null> {
        const query = `
            SELECT 
                b.id AS book_id, 
                b.title AS book_title, 
                b.publicationDate AS book_publication_date,
                g.title AS genre_title
            FROM books b
            LEFT JOIN book_genres bg ON b.id = bg.book_id
            LEFT JOIN genres g ON bg.genre_id = g.id
            WHERE b.id = $1
        `;

        const result = await this.databaseService.query(query, [id]);

        if (result.length === 0) {
            return null;
        }

        let book: BookModel | null = null;

        result.forEach((row: any) => {
            if (!book) {
                book = {
                    author: row.book_author,
                    id: row.book_id,
                    title: row.book_title,
                    publicationDate: row.book_publication_date,
                    genres: []
                };
            }
            if (row.genre_title) {
                book.genres.push(row.genre_title);
            }
        });

        return book;
    }
}
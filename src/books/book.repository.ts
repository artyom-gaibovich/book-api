import { BookModel } from "../database/model/book.model";
import {BookRepositoryInterface} from "./book.repository.interface";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PgPoolService} from "../database/pg-pool.service";
import {UserModel} from "../database/model/user.model";


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
}
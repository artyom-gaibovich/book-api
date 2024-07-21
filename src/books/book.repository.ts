import {BookModel} from "./book.model";
import {BookRepositoryInterface} from "./book.repository.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PgPoolService} from "../database/pg-pool.service";


@injectable()
export class BookRepository implements BookRepositoryInterface {
    constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}


    async findAll(): Promise<BookModel[]> {
        const query = 'SELECT * FROM books;';
        const result = await this.databaseService.query(query);
        return result as BookModel[];
    }

    async findById(id: number): Promise<BookModel | null> {
        const query = 'SELECT * FROM books WHERE id = $1;';
        const result = await this.databaseService.query(query, [id]);
        if (result.length === 0) {
            return null;
        }
        const book = result[0];
        return book as BookModel;
    }

    async create({ title, author, publicationDate }: { title : string, author : string, publicationDate : string }): Promise<BookModel | null> {
        const query = 'INSERT INTO books (title, author, publicationDate) VALUES ($1, $2, $3) RETURNING *;';
        const result = await this.databaseService.query(query, [title, author, publicationDate]);
        if (result.length === 0) {
            return null;
        }
        const book = result[0];
        return book as BookModel;
    }

    async delete(id: number): Promise<void> {
        const query = 'DELETE FROM books WHERE id = $1;';
        await this.databaseService.query(query, [id]);
    }
}
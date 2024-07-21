import {BookGenreModel} from "./book-genres.model";

export interface BookGenresRepositoryInterface {
    findByBookId(bookId: number): Promise<BookGenreModel[]>;
    findAll(): Promise<any[]>
}
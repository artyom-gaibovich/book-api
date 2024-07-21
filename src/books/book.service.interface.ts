import {BookInterface} from "./book.interface";

export interface BookServiceInterface {
    findAll(): Promise<any | null>;
    findById(id: number): Promise<any | null>;
    create(book: BookInterface): Promise<BookInterface | null>;
    //delete(id: number): Promise<null>;
    //update(id: number, book: BookInterface): Promise<BookInterface | null>;
}
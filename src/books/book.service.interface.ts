import {BookModel} from "./book.model";

export interface BookServiceInterface {
    createBook({ title, author, publicationDate, genres }: BookModel): Promise<BookModel | null>
    getBooks(): Promise<BookModel[] | null>
    getBookById(id: string): Promise<BookModel | null>
    updateBook(id: string, bookUpdates: BookModel): Promise<BookModel | null>
    deleteBook(id: string): Promise<void>
}


//updateBook(id: string, bookUpdates: Partial<BookModel>): Promise<BookModel | null>

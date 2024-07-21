import { BookModel } from './book.model';

export interface BookRepositoryInterface {
	deleteBook(id: string): Promise<void>;

	getBooks(): Promise<BookModel[]>;

	getBookById(id: string): Promise<BookModel | null>;

	addBook(book: BookModel): Promise<BookModel | null>;

	updateBook(id: string, bookUpdates: Partial<BookModel>): Promise<BookModel | null>;
}

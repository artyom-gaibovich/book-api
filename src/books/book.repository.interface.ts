import { BookModel } from './book.model';
import { DeleteResult } from 'mongodb';

export interface BookRepositoryInterface {
	deleteBook(id: string): Promise<DeleteResult>;

	getBooks(): Promise<BookModel[]>;

	getBookById(id: string): Promise<BookModel | null>;

	addBook(book: BookModel): Promise<BookModel | null>;

	updateBook(id: string, bookUpdates: Partial<BookModel>): Promise<BookModel | null>;
}

import { BookModel } from './book.model';
import { DeleteResult } from 'mongodb';

export interface BookServiceInterface {
	createBook({ title, author, publicationDate, genres }: BookModel): Promise<BookModel | null>;

	getBooks(): Promise<BookModel[] | null>;

	getBookById(id: string): Promise<BookModel | null>;

	updateBook(id: string, bookUpdates: BookModel): Promise<BookModel | null>;

	deleteBook(id: string): Promise<DeleteResult>;
}

// services/book.service.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { BookRepository } from './book.repository';
import { BookServiceInterface } from './book.service.interface';
import { BookModel } from './book.model';

@injectable()
export class BookService implements BookServiceInterface {
	constructor(@inject(TYPES.BookRepository) private bookRepository: BookRepository) {}

	async createBook({
		title,
		author,
		publicationDate,
		genres,
	}: BookModel): Promise<BookModel | null> {
		const newBook: BookModel = { title, author, publicationDate, genres };
		return this.bookRepository.addBook(newBook);
	}

	async getBooks(): Promise<BookModel[] | null> {
		return this.bookRepository.getBooks();
	}

	async getBookById(id: string): Promise<BookModel | null> {
		return this.bookRepository.getBookById(id);
	}

	async updateBook(id: string, bookUpdates: BookModel): Promise<BookModel | null> {
		return this.bookRepository.updateBook(id, bookUpdates);
	}

	async deleteBook(id: string): Promise<void> {
		await this.bookRepository.deleteBook(id);
	}
}

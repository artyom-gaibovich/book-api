// services/book.service.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {Book, BookRepository} from "./book.repository";

@injectable()
export class BookService {
    constructor(
        @inject(TYPES.BookRepository) private bookRepository: BookRepository
    ) {}

    async createBook({ title, author, publicationDate, genres }: Book): Promise<Book | null> {
        const newBook: Book = { title, author, publicationDate, genres };
        return this.bookRepository.addBook(newBook);
    }

    async getBooks(): Promise<Book[]> {
        return this.bookRepository.getBooks();
    }

    async getBookById(id: string): Promise<Book | null> {
        return this.bookRepository.getBookById(id);
    }

    async updateBook(id: string, bookUpdates: Partial<Book>): Promise<Book | null> {
        return this.bookRepository.updateBook(id, bookUpdates);
    }

    async deleteBook(id: string): Promise<void> {
        await this.bookRepository.deleteBook(id);
    }
}

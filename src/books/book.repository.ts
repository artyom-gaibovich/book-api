// repositories/book.repository.ts
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { MongoService } from '../database/mongo.service';
import { TYPES } from '../types';

export interface Genre {
    title: string;
}

export interface Book {
    title: string;
    author: string;
    publicationDate: string;
    genres: Genre[];
}

@injectable()
export class BookRepository {
    constructor(@inject(TYPES.MongoService) private mongoService: MongoService) {}

    async addBook(book: Book): Promise<any> {
        const db = this.mongoService.getDb();
        const result = await db.collection('books').insertOne(book);
        return { ...book, _id: result.insertedId };
    }

    async getBooks(): Promise<any[]> {
        const db = this.mongoService.getDb();
        return db.collection('books').find({}).toArray();
    }

    async getBookById(id: string): Promise<any | null> {
        const db = this.mongoService.getDb();
        return db.collection('books').findOne({ _id: new ObjectId(id) });
    }

    async updateBook(id: string, bookUpdates: Partial<Book>): Promise<any | null> {
        const db = this.mongoService.getDb();
        const result = await db.collection('books').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: bookUpdates },
            { }
        );
        return result?.value;
    }

    async deleteBook(id: string): Promise<any> {
        const db = this.mongoService.getDb();
        await db.collection('books').deleteOne({ _id: new ObjectId(id) });
    }
}

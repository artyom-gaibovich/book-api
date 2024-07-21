// repositories/book.repository.ts
import {inject, injectable} from 'inversify';
import {MongoService} from '../database/mongo.service';
import {TYPES} from '../types';
import {InsertOneResult, ObjectId} from "mongodb";

export interface Genre {
    title: string;
}

export interface Book {
    title: string;
    author: string;
    publicationDate: string;
    genres: string[];
}

@injectable()
export class BookRepository {
    constructor(@inject(TYPES.MongoService) private mongoService: MongoService) {
    }

    async addBook(book: Book): Promise<any> {
        const mongoClient = await this.mongoService.get()
        const result: InsertOneResult<Document> = await mongoClient.db('admin').collection('books').insertOne(book);
        if (!result) {
            throw new Error('Book creation failed');
        }
        return await mongoClient.db('admin').collection('books').findOne({_id: result.insertedId});

    }

    async getBooks(): Promise<any[]> {
        const mongoClient = await this.mongoService.get()
        return mongoClient.db('admin').collection('books').find({}).toArray();
    }

    async getBookById(id: string): Promise<any | null> {
        const mongoClient = await this.mongoService.get()
        return mongoClient.db('admin').collection('books').findOne({ _id: new ObjectId(id) });
    }

    async updateBook(id: string, bookUpdates: Partial<Book>): Promise<any | null> {
        const mongoClient = await this.mongoService.get()
        const result = await mongoClient.db('admin').collection('books').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: bookUpdates },
            { }
        );
        if (!result) {
            throw new Error('Book updating failed');
        }
        return mongoClient.db('admin').collection('books').findOne({ _id: new ObjectId(id) });

    }

    async deleteBook(id: string): Promise<any> {
        const mongoClient = await this.mongoService.get()
        return mongoClient.db('admin').collection('books').deleteOne({ _id: new ObjectId(id) });
    }
}

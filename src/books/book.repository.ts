import { inject, injectable } from 'inversify';
import { MongoService } from '../database/mongo.service';
import { TYPES } from '../types';
import { ObjectId } from 'mongodb';
import { BookModel } from './book.model';
import { BookServiceInterface } from './book.service.interface';
import { BookRepositoryInterface } from './book.repository.interface';

@injectable()
export class BookRepository implements BookRepositoryInterface {
	constructor(@inject(TYPES.MongoService) private mongoService: MongoService) {}

	async addBook(book: BookModel): Promise<BookModel | null> {
		const mongoClient = await this.mongoService.get();
		const result = await mongoClient.db('admin').collection('books').insertOne(book);
		if (!result) {
			return null;
		}
		return mongoClient
			.db('admin')
			.collection('books')
			.findOne<BookModel>({ _id: result.insertedId });
	}

	async getBooks(): Promise<BookModel[]> {
		const mongoClient = await this.mongoService.get();
		return mongoClient.db('admin').collection('books').find<BookModel>({}).toArray();
	}

	async getBookById(id: string): Promise<BookModel | null> {
		const mongoClient = await this.mongoService.get();
		return mongoClient
			.db('admin')
			.collection('books')
			.findOne<BookModel>({ _id: new ObjectId(id) });
	}

	async updateBook(id: string, bookUpdates: Partial<BookModel>): Promise<BookModel | null> {
		const mongoClient = await this.mongoService.get();
		const result = await mongoClient
			.db('admin')
			.collection('books')
			.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: bookUpdates }, {});
		if (!result) {
			return null;
		}
		return mongoClient
			.db('admin')
			.collection('books')
			.findOne<BookModel>({ _id: new ObjectId(id) });
	}

	async deleteBook(id: string): Promise<void> {
		const mongoClient = await this.mongoService.get();
		await mongoClient
			.db('admin')
			.collection('books')
			.deleteOne({ _id: new ObjectId(id) });
	}
}

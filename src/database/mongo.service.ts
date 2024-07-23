// database/mongo.service.ts
import { inject, injectable } from 'inversify';
import { MongoClient } from 'mongodb';
import { TYPES } from '../types';
import { LoggerInterface } from '../logger/logger.interface';
import { MongoClientFactory } from '../factory/mongo.factory';

@injectable()
export class MongoService {
	private readonly client: MongoClient;

	constructor(
		@inject(TYPES.Logger) private logger: LoggerInterface,
		@inject(TYPES.MongoClientFactory) mongoClientFactory: MongoClientFactory,
	) {
		this.client = mongoClientFactory.createClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			this.logger.log('[ MongoService ] Successfully connected to MongoDB');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[ MongoService ] Error connecting to MongoDB: ' + e.message);
			}
		}
	}

	async get() {
		return this.client;
	}

	async disconnect(): Promise<void> {
		await this.client.close();
	}
}

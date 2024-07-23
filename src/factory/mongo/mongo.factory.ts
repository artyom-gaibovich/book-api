import { MongoClient } from 'mongodb';
import { inject, injectable } from 'inversify';
import { ConfigService } from '../../config/config.service';
import { getMongoConfig } from '../../config/mongo.config';
import { TYPES } from '../../types';
import { MongoFactoryInterface } from './mongo.factory.interface';

@injectable()
export class MongoClientFactory implements MongoFactoryInterface{
	constructor(@inject(TYPES.ConfigService) private configService: ConfigService) {}

	createClient(): MongoClient {
		const config = getMongoConfig(this.configService);
		return new MongoClient(config.uri);
	}
}

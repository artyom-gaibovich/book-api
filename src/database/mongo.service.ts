// database/mongo.service.ts
import { inject, injectable } from 'inversify';
import {MongoClient, Db, MongoClientOptions} from 'mongodb';
import { TYPES } from '../types';
import { LoggerInterface } from '../logger/logger.interface';
import {getMongoConfig} from "../config/mongo.config";
import {ConfigService} from "../config/config.service";

@injectable()
export class MongoService {
    private client: MongoClient;
    private db: Db;

    constructor(
        @inject(TYPES.ILogger) private logger: LoggerInterface,
        @inject(TYPES.ConfigService) private configService: ConfigService
    ) {
        const config = getMongoConfig(this.configService);
        this.client = new MongoClient(config.uri);
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.configService.get('MONGO_DATABASE'));
            this.logger.log('[MongoService] Successfully connected to MongoDB');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error('[MongoService] Error connecting to MongoDB: ' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }

    getDb(): Db {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        return this.db;
    }
}

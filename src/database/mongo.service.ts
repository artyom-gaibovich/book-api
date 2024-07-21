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
            this.logger.log('[MongoService] Successfully connected to MongoDB');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error('[MongoService] Error connecting to MongoDB: ' + e.message);
            }
        }
    }

    async query(query: string, params: any[] = []): Promise<any> {
        try {
            const res = await this.client;
            console.log(res)
            return res;
        } finally {
            await this.client.close();
        }
    }

    async get() {
        return this.client;
    }
    async disconnect(): Promise<void> {
        await this.client.close();
    }


}

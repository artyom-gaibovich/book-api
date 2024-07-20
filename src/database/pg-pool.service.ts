import {inject, injectable} from 'inversify';
import { Client, Pool } from 'pg';
import {TYPES} from "../types";
import {ConfigService} from "../config/config.service";
import {IConfigService} from "../config/config.service.interface";
import {ILogger} from "../logger/logger.interface";
import {DatabaseConfig} from "./database.config";

@injectable()
export class PgPoolService {
    private client: Pool;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.DatabaseConfig) private databaseConfig: DatabaseConfig
    ) {
        this.client = new Pool(this.databaseConfig.getPoolConfig())
    }


    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.logger.log('[PgPoolService] Successfully connected to the database');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error('[PgPoolService] Error connecting to the database: ' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.end();
    }




    async query(query: string, params: any[] = []): Promise<any> {
        const client = await this.client.connect();
        try {
            const res = await client.query(query, params);
            return res.rows;
        } finally {
            client.release();
        }
    }
}

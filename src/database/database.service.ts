import {inject, injectable} from 'inversify';
import { Client, Pool } from 'pg';
import {TYPES} from "../types";
import {ConfigService} from "../config/config.service";

@injectable()
export class DatabaseService {
    private pool: Pool;

    constructor(@inject(TYPES.ConfigService) private readonly configService: ConfigService) {
        this.init();
    }

    private async init() {
        this.pool = new Pool({
            host: 'localhost',
            port: 3232, // стандартный порт для PostgreSQL
            user: 'root',
            password: 'root',
            database: 'root'
        });
    }



    async query(query: string, params: any[] = []): Promise<any> {
        const client = await this.pool.connect();
        try {
            const res = await client.query(query, params);
            return res.rows;
        } finally {
            client.release();
        }
    }
}

import { injectable } from 'inversify';
import { Client, Pool } from 'pg';

@injectable()
export class DatabaseService {
    private pool: Pool;

    constructor() {
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

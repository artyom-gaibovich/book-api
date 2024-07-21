import { Pool } from 'pg';
import {inject, injectable} from 'inversify';
import {DatabaseConfig} from "../database/database.config";
import {TYPES} from "../types";

@injectable()
export class PgPoolFactory {
    constructor(@inject(TYPES.DatabaseConfig) private databaseConfig: DatabaseConfig) {}

    createPool(): Pool {
        return new Pool(this.databaseConfig.getPoolConfig());
    }
}

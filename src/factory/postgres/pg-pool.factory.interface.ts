import { Pool } from 'pg';

export interface PgPoolFactoryInterface {
	createPool(): Pool;
}

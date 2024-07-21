import { inject, injectable } from 'inversify';
import { Pool } from 'pg';
import { TYPES } from '../types';
import { LoggerInterface } from '../logger/logger.interface';
import { PgPoolFactory } from '../factory/pg-pool.factory';

@injectable()
export class PgPoolService {
	private client: Pool;

	constructor(
		@inject(TYPES.Logger) private logger: LoggerInterface,
		@inject(TYPES.PgPoolFactory) pgPoolFactory: PgPoolFactory,
	) {
		this.client = pgPoolFactory.createPool();
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
		} catch (e) {
			this.logger.log('[PgPoolService] Error when you make query');
		} finally {
			client.release();
		}
	}
}

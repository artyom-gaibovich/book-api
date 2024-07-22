import { Pool } from 'pg';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { getPoolConfig } from '../config/pg-pool.config';
import { isNegative } from 'class-validator';
import { ConfigService } from '../config/config.service';

@injectable()
export class PgPoolFactory {
	constructor(@inject(TYPES.ConfigService) private readonly configService: ConfigService) {
	}
	createPool(): Pool {
		return new Pool(getPoolConfig(this.configService));
	}
}

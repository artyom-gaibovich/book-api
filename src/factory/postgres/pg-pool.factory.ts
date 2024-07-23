import { Pool } from 'pg';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { getPoolConfig } from '../../config/pg-pool.config';
import { ConfigService } from '../../config/config.service';
import { PgPoolFactoryInterface } from './pg-pool.factory.interface';

@injectable()
export class PgPoolFactory implements PgPoolFactoryInterface{
	constructor(@inject(TYPES.ConfigService) private readonly configService: ConfigService) {}
	createPool(): Pool {
		return new Pool(getPoolConfig(this.configService));
	}
}

import { PoolConfig } from 'pg';
import { ConfigService } from './config.service';

export const getPoolConfig = (configService: ConfigService): PoolConfig => {
	return {
		user: configService.get('PG_USER'),
		host: configService.get('PG_HOST'),
		database: configService.get('PG_NAME'),
		password: configService.get('PG_PASSWORD'),
		port: Number(configService.get('PG_PORT')),
	};
};

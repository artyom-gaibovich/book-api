import { ConfigServiceInterface } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ ConfigService ] cannot read .env');
		} else {
			this.logger.log('[ ConfigService ] Configuration .env has been loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}

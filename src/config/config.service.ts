import {ConfigServiceInterface} from './config.service.interface';
import {config, DotenvConfigOutput, DotenvParseOutput} from 'dotenv';
import {inject, injectable} from 'inversify';
import {ILogger} from '../logger/logger.interface';
import {TYPES} from "../types";

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.LoggerInterface) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Cannot read file .env or it is not exists');
		} else {
			this.logger.log('[ConfigService] Configure .env was loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}

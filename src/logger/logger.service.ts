import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { LoggerInterface } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements LoggerInterface {
	public logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
			logLevelsColors: {
				0: 'black',
				1: 'green',
				2: 'yellow',
				3: 'yellowBright',
				4: 'yellowBright',
				5: 'red',
				6: 'inverse',
			},
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}

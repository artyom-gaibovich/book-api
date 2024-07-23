import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ExceptionFilterInterface } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import 'reflect-metadata';
import { ErrorCodes } from '../constnats/error.constants';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
	constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {}

	catch(err: Error | HTTPError, req: Request, res: Response, _: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[ ${err.context} ] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(ErrorCodes.ServerError).send({ err: err.message });
		}
	}
}

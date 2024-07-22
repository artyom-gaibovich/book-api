import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ValidateMiddleware implements MiddlewareInterface {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}

export class ValidateParamIdIsMongoStringMiddleware implements MiddlewareInterface {
	constructor(private paramName: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const paramValue = req.params[this.paramName];
		if (!ObjectId.isValid(paramValue)) {
			res.status(400).send({ err: 'Invalid ID format. ID should be a Mongo String' });
		} else {
			next();
		}
	}
}

export class ValidateParamIdIsNumberMiddleware implements MiddlewareInterface {
	constructor(private paramName: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const paramValue = req.params[this.paramName];
		if (isNaN(Number(paramValue))) {
			res.status(400).send({ err: 'Invalid ID format. ID shout be a Number.' });
		} else {
			next();
		}
	}
}




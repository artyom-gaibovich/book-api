import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';

export class TransformerMiddleware implements MiddlewareInterface {
	constructor(private classToTransform: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		try {
			const transformedInstance = plainToClass(this.classToTransform, body);
			(body as any).transformedData = transformedInstance;
			next();
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).send({ error: 'Transformation failed', details: error.message });
			}
		}
	}
}

import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import {HTTPError} from "../errors/http-error.class";

export class TransformerMiddleware implements IMiddleware {
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

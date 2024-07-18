import { NextFunction, Request, Response } from 'express';

export interface ExecptionFilterInterface {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}

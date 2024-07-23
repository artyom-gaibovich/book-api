import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class AuthGuard implements MiddlewareInterface {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.username) {
			return next();
		}
		res.status(401).send({ error: 'You are not authorized' });
	}
}

export class AuthAdminGuard implements MiddlewareInterface {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.username) {
			res.status(401).send({ error: 'Unauthorized invalid JWT token. You dont set username' });
		}
		if (!req.roles.includes('ADMIN')) {
			res.status(401).send({ error: 'Unauthorized you dont have ADMIN role' });
		}
		if (req.roles && req.roles.includes('ADMIN')) {
			return next();
		}
	}
}

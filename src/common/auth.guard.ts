import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Вы не авторизован' });
	}
}


export class AuthAdminGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		console.log(req.roles, req.user)
		if (req.user && req.roles && req.roles.includes('ADMIN')) {
			return next();
		}
		res.status(401).send({ error: 'You are not authorized and you are not admin.' });
	}
}

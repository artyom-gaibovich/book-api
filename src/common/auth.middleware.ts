import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { injectable } from 'inversify';

@injectable()
export class AuthMiddleware {
	constructor(private secret: string, private ignoreJWTRoutes: string[]) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (this.ignoreJWTRoutes.includes(req.originalUrl)) {
			return next();
		}
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					return next();
				}
				if (payload) {
					req.username = payload.username;
					req.roles = payload.roles.map((role: any) => role.role_value);
					if (!req.roles) {
						return res.status(400).send({ err: 'Invalid JWT TOKEN. Dont set roles' });
					}
					if (!req.username) {
						return res.status(400).send({ err: 'Invalid JWT TOKEN. Dont set username' });
					}
					if (req.username || req.roles) {
						return next();
					}
				}
			});
		} else {
			res.status(400).send({ error: 'Invalid JWT TOKEN' });
		}
	}
}

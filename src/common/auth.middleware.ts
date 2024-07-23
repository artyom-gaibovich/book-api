import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthAdminMiddleware implements MiddlewareInterface {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					req.username = payload.username;
					req.roles = payload.roles.map((role: any) => role.role_value);
					if (!req.roles) {
						res.status(400).send({ err: 'Invalid JWT TOKEN. Dont set roles' });
					}
					if (!req.username) {
						res.status(400).send({ err: 'Invalid JWT TOKEN. Dont set username' });
					}
					if (req.username || req.roles) {
						next();
					}
				}
			});
		} else {
			res.status(400).send({ error: 'Invalid JWT TOKEN' });
		}
	}
}

import { MiddlewareInterface } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ErrorCodes } from '../constnats/error.constants';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { RolesService } from '../roles/roles.service';
import { RolesServiceInterface } from '../roles/roles.service.interface';

export class AuthGuard implements MiddlewareInterface {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.roles && req.username) {
			return next();
		}
		res.status(ErrorCodes.NotAuthorized).send({ error: 'You are not authorized' });
	}
}

@injectable()
export class AuthAdminGuard implements MiddlewareInterface {
	constructor(@inject(TYPES.RolesService) private rolesService: RolesServiceInterface) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.username) {
			res
				.status(ErrorCodes.Forbidden)
				.send({ error: 'Unauthorized invalid JWT token. You dont set username' });
		}
		if (!req.roles.includes(this.rolesService.getAdminRole())) {
			res.status(ErrorCodes.Forbidden).send({ error: 'You are not admin' });
		}
		if (req.roles && req.roles.includes('ADMIN')) {
			return next();
		}
	}
}

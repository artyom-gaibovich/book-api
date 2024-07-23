import { NextFunction, Request, Response } from 'express';
import { UpdateRolesDto } from './dto/update-roles.dto';

export interface UsersControllerInterface {
	login(req: Request, res: Response, next: NextFunction): void;

	register(req: Request, res: Response, next: NextFunction): void;

	info(req: Request, res: Response, next: NextFunction): void;

	updateRoles(
		req: Request<{ id: number }, {}, UpdateRolesDto>,
		res: Response,
		_: NextFunction,
	): void;
}

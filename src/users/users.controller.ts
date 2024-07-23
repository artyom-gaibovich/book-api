import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { UsersControllerInterface } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import {
	ValidateMiddleware,
	ValidateParamIdIsNumberMiddleware,
} from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UsersServiceInterface } from './users.service.interface';
import { AuthAdminGuard, AuthGuard } from '../common/auth.guard';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { TypesRoles } from '../roles/role.types';
import { UserModel } from './user.model';

@injectable()
export class UserController extends BaseController implements UsersControllerInterface {
	constructor(
		@inject(TYPES.Logger) private loggerService: LoggerInterface,
		@inject(TYPES.UserService) private userService: UsersServiceInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
	) {
		super(loggerService, 'users');
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/:id/role',
				method: 'put',
				func: this.updateRoles,
				middlewares: [
					new ValidateParamIdIsNumberMiddleware('id'),
					new ValidateMiddleware(UpdateRolesDto),
					new AuthAdminGuard(),
				],
			},
			{
				path: '/me',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.loggerService.log('[login] Attempting to login user');
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			this.loggerService.log('[login] User not found');
			return next(new HTTPError(401, 'user not found', 'login'));
		}
		const user = (await this.userService.getUserInfo(req.body.username)) as UserModel;
		const userRoles = (await this.userService.findRoles(user.id)) as TypesRoles[];
		const jwt = await this.signJWT(userRoles, req.body.username, this.configService.get('SECRET'));
		this.loggerService.log('[login] User successfully logged in');
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.loggerService.log('[register] Attempting to register new user');
		const result = await this.userService.createUser(body);
		if (!result) {
			this.loggerService.log('[register] User already exists');
			return next(new HTTPError(409, 'User is already exists'));
		}
		this.loggerService.log(`[register] User registered successfully with ID ${result.id}`);
		this.send(res, 201, { email: result.email, id: result.id });
	}

	async info(
		{ username, roles }: Request<{}, {}, {}>,
		res: Response,
		_: NextFunction,
	): Promise<void> {
		this.loggerService.log(`[info] Fetching info for user ${username}`);
		const userInfo = await this.userService.getUserInfo(username);
		this.loggerService.log(`[info] User info retrieved for ${username}`);
		this.ok(res, {
			username: userInfo?.username,
			mail: userInfo?.email,
			id: userInfo?.id,
			roles: roles,
		});
	}

	async updateRoles(
		req: Request<{ id: number }, {}, UpdateRolesDto>,
		res: Response,
		_: NextFunction,
	): Promise<void> {
		this.loggerService.log(`[updateRoles] Attempting to update roles for user ID ${req.params.id}`);
		const { id } = req.params;
		const transformRoles = Array.from<TypesRoles>(new Set(req.body.roles));
		const userRoles = await this.userService.updateRoles(id, transformRoles);
		if (!userRoles) {
			this.loggerService.log(`[updateRoles] User with ID ${id} not found`);
			this.send(res, 404, {
				status: 404,
				message: 'User not found',
			});
		} else {
			this.loggerService.log(`[updateRoles] User roles updated successfully for ID ${id}`);
			this.ok(res, userRoles);
		}
	}

	private signJWT(roles: TypesRoles[], username: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					roles: roles,
					username,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}

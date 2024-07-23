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
import { ValidateMiddleware, ValidateParamIdIsNumberMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UsersServiceInterface } from './users.service.interface';
import { AuthAdminGuard, AuthGuard } from '../common/auth.guard';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { TypesRoles } from '../roles/role.model';
import { UserModel } from './user.model';
import { ErrorCodes } from '../constnats/error.constants';
import { SuccessCodes } from '../constnats/success.constants';
import { RolesServiceInterface } from '../roles/roles.service.interface';

@injectable()
export class UserController extends BaseController implements UsersControllerInterface {
	constructor(
		@inject(TYPES.Logger) private loggerService: LoggerInterface,
		@inject(TYPES.UserService) private userService: UsersServiceInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.RolesService) private rolesService: RolesServiceInterface,
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
					new AuthAdminGuard(this.rolesService),
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
			return next(new HTTPError(ErrorCodes.NotFound, 'user not found', 'login'));
		}
		const user = (await this.userService.getUserInfo(req.body.username)) as UserModel;
		const userRoles = (await this.userService.findRoles(user.id)) as TypesRoles[];
		const jwt = await this.signJWT(userRoles, req.body.username, this.configService.get('SECRET'));
		this.loggerService.log('[login] User successfully logged in');
		this.send(res, SuccessCodes.Created, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.loggerService.log('[ register ] Attempting to register new user');
		const user = await this.userService.createUser(body);
		if (!user) {
			this.loggerService.log('[ register ] User already exists');
			return next(new HTTPError(ErrorCodes.Conflict, 'User is already exists', 'register'));
		}
		this.loggerService.log(`[ register ] User registered successfully with ID ${user.id}`);
		this.send(res, SuccessCodes.Created, {
			username: user.username,
			email: user.email,
			id: user.id,
		});
	}

	async info(
		{ username, roles }: Request<{}, {}, {}>,
		res: Response,
		_: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(username);
		if (!userInfo) {
			this.loggerService.log(`[ info ] User with ${username} not found`);
			this.send(res, ErrorCodes.NotFound, {
				status: ErrorCodes.NotFound,
				message: `User with id ${username} not found`,
			});
		} else {
			this.loggerService.log(`[ info ] User info retrieved for ${username}`);
			this.ok(res, {
				username: userInfo?.username,
				email: userInfo?.email,
				id: userInfo?.id,
				roles: roles,
			});
		}
	}

	async updateRoles(
		req: Request<{ id: number }, {}, UpdateRolesDto>,
		res: Response,
		_: NextFunction,
	): Promise<void> {
		this.loggerService.log(
			`[ updateRoles ] Attempting to update roles for user ID ${req.params.id}`,
		);
		const { id } = req.params;
		const transformRoles = Array.from<TypesRoles>(new Set(req.body.roles));
		const userRoles = await this.userService.updateRoles(id, transformRoles);
		if (!userRoles) {
			this.loggerService.log(`[ updateRoles ] User with ID ${id} not found`);
			this.send(res, ErrorCodes.NotFound, {
				status: ErrorCodes.NotFound,
				message: `User with id ${id} not found`,
			});
		} else {
			this.loggerService.log(`[ updateRoles ] User roles updated successfully for ID ${id}`);
			this.send(res, SuccessCodes.Created, userRoles);
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

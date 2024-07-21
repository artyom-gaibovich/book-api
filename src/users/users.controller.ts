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
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UsersServiceInterface } from './users.service.interface';
import { AuthAdminGuard } from '../common/auth.guard';
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
		super(loggerService);
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
				path: '/update-roles',
				method: 'post',
				func: this.updateRoles,
				middlewares: [new ValidateMiddleware(UpdateRolesDto), new AuthAdminGuard()],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthAdminGuard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'error authorization', 'login'));
		}
		const user = await this.userService.getUserInfo(req.body.email) as UserModel
		const userRoles = await this.userService.findRoles(user.id) as TypesRoles[]
		const jwt = await this.signJWT(userRoles, req.body.email, this.configService.get('SECRET'));
		console.log(userRoles, jwt)
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'User is already exists'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user, roles }: Request<{}, {}, {}>, res: Response, _: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id, roles : roles });
	}

	async updateRoles(req : Request<{}, {}, UpdateRolesDto>, res: Response, _: NextFunction) {
		const transformRoles = Array.from<TypesRoles>(new Set(req.body.roles))
		const userRoles = await this.userService.updateRoles(req.body.userId, transformRoles)
		this.ok(res, userRoles)
	}


	private signJWT(roles: TypesRoles[], email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					roles : roles,
					email,
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

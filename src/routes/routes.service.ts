import { RoutesServiceInterface } from './routes.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ConfigServiceInterface } from '../config/config.service.interface';

@injectable()
export class RoutesService implements RoutesServiceInterface {
	constructor(@inject(TYPES.ConfigService) private configService: ConfigServiceInterface) {}

	users(): '/users' {
		return this.configService.get('USERS_ROUTE') as '/users';
	}

	books(): '/books' {
		return this.configService.get('BOOKS_ROUTE') as '/books';
	}

	login(): '/users/login' {
		return this.configService.get('LOGIN_ROUTE') as '/users/login';
	}

	register(): '/users/register' {
		return this.configService.get('REGISTER_ROUTE') as '/users/register';
	}
}

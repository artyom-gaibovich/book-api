import { inject, injectable } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';
import { RolesServiceInterface } from './roles.service.interface';

@injectable()
export class RolesService implements RolesServiceInterface{
	constructor(@inject(TYPES.ConfigService) private configService: ConfigServiceInterface) {}

	getAdminRole(): 'ADMIN' {
		return this.configService.get('ADMIN_ROLE') as 'ADMIN';
	}

	getUserRole(): 'USER' {
		return this.configService.get('USER_ROLE') as 'USER';
	}
}

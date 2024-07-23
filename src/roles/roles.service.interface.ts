import { inject, injectable } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';

@injectable()
export class RolesService {
	constructor(@inject(TYPES.ConfigService) private configService: ConfigServiceInterface) {}

	getAdminRole(): 'ADMIN' {
		return this.configService.get('ADMIN_ROLE') as 'ADMIN';
	}

	getUserRole(): 'USER' {
		return this.configService.get('USER_ROLE') as 'USER';
	}
}

import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PgPoolService } from '../database/pg-pool.service';
import { RolesRepositoryInterface } from './roles.repository.interface';
import { TypesRoles, UserToRolesInterface } from './role.model';

@injectable()
export class RolesRepository implements RolesRepositoryInterface {
	constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

	async findByUserId(userId: number): Promise<UserToRolesInterface | null> {
		const query = 'SELECT * FROM "user".user_roles WHERE user_id = $1;';
		const result = await this.databaseService.query(query, [userId]);
		if (result.length === 0) {
			return null;
		}
		return {
			userId: userId,
			roles: result,
		};
	}

	async deleteByUserId(userId: number): Promise<void> {
		await this.databaseService.query('DELETE FROM "user".user_roles WHERE user_id = $1', [userId]);
	}

	async create(userId: number, newRoles: TypesRoles[]): Promise<void> {
		for (const newRole of newRoles) {
			await this.databaseService.query(
				'INSERT INTO "user".user_roles (user_id, role_value) VALUES ($1, $2)',
				[userId, newRole],
			);
		}
	}
}

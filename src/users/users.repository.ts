import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { PgPoolService } from "../database/pg-pool.service";
import {UserModel} from "../database/model/user.model";
import {TypesRoles} from "../roles/role.interface";
import {RolesRepositoryInterface} from "../roles/roles.repository.interface";



@injectable()
export class UsersRepository implements UsersRepositoryInterface {
	constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		const query = 'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *;';
		const result = await this.databaseService.query(query, [email, password, name]);
		if (result.length === 0) {
			throw new Error('User creation failed');
		}
		const user = result[0];
		return user as UserModel;
	}

	async find(email: string): Promise<UserModel | null> {
		const query = 'SELECT * FROM users WHERE email = $1;';
		const result = await this.databaseService.query(query, [email]);
		if (result.length === 0) {
			return null;
		}
		const user = result[0];
		return user as UserModel;
	}


	async patchRoles(userId : number, newRoles: TypesRoles[]) {
		await this.databaseService.query('BEGIN');

		try {
			await this.databaseService.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

			for (const newRole of newRoles) {
				await this.databaseService.query('INSERT INTO user_roles (user_id, role_value) VALUES ($1, $2)', [userId, newRole]);
			}

			await this.databaseService.query('COMMIT');
		} catch (error) {
			await this.databaseService.query('ROLLBACK');
			throw error;
		}
	}
}

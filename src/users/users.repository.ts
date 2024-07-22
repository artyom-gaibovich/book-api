import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { PgPoolService } from '../database/pg-pool.service';
import { UserModel } from './user.model';

@injectable()
export class UsersRepository implements UsersRepositoryInterface {
	constructor(@inject(TYPES.DatabaseService) private databaseService: PgPoolService) {}

	async create({ email, password, username }: User): Promise<UserModel> {
		const query = 'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *;';
		const result = await this.databaseService.query(query, [email, password, username]);
		if (result.length === 0) {
			throw new Error('User creation failed');
		}
		const user = result[0];
		return user as UserModel;
	}

	async find(username: string): Promise<UserModel | null> {
		const query = 'SELECT * FROM users WHERE username = $1;';
		const result = await this.databaseService.query(query, [username]);
		console.log(result, username)
		if (result.length === 0) {
			return null;
		}
		const user = result[0];
		return user as UserModel;
	}
}

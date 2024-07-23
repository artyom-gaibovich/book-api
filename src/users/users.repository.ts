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
		const query =
			'INSERT INTO "user".users (email, password, username) VALUES ($1, $2, $3) RETURNING *;';
		const result = await this.databaseService.query(query, [email, password, username]);
		const user = result[0];
		return user as UserModel;
	}

	async find(username: string, email?: string): Promise<UserModel | null> {
		const query = 'SELECT * FROM "user".users WHERE username = $1 OR email = $2;';
		const result = await this.databaseService.query(query, [username, email]);
		if (!result) {
			return null;
		}
		const user = result[0];
		return user as UserModel;
	}
}

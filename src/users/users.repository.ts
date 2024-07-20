import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { DatabaseService } from "../database/database.service";
import {UserModel} from "../database/model/user.model";



@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		const query = 'INSERT INTO UserModel (email, password, name) VALUES ($1, $2, $3) RETURNING *;';
		const result = await this.databaseService.query(query, [email, password, name]);
		if (result.length === 0) {
			throw new Error('User creation failed');
		}
		const user = result[0];
		return user as UserModel;
	}

	async find(email: string): Promise<UserModel | null> {
		const query = 'SELECT * FROM UserModel WHERE email = $1;';
		const result = await this.databaseService.query(query, [email]);
		if (result.length === 0) {
			return null;
		}
		const user = result[0];
		return user as UserModel;
	}
}

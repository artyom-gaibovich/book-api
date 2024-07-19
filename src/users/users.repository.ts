import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { DatabaseService } from "../database/database.service";

export interface UserModel {
	id: number;
	email: string;
	password: string;
	name: string;
}

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		const query = 'INSERT INTO UserModel (email, password, name) VALUES ($1, $2, $3) RETURNING *;';
		const result = await this.databaseService.query(query, [email, password, name]);
		if (result.length === 0) {
			throw new Error('User creation failed');
		}
		const user = result[0]; // Первый и единственный элемент в массиве
		return user as UserModel;
	}

	async find(email: string): Promise<UserModel | null> {
		const query = 'SELECT * FROM UserModel WHERE email = $1;';
		const result = await this.databaseService.query(query, [email]);
		if (result.length === 0) {
			return null; // Нет пользователя с таким email
		}
		const user = result[0]; // Первый элемент в массиве
		return user as UserModel;
	}
}

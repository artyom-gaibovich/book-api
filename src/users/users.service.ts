import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { UsersServiceInterface } from './users.service.interface';
import { UserModel } from './user.model';
import { RolesRepositoryInterface } from '../roles/roles.repository.interface';
import { TypesRoles } from '../roles/role.types';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UserToRolesInterface } from '../roles/user-to-roles.interface';
import { UsersRepository } from './users.repository';

@injectable()
export class UserService implements UsersServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
		@inject(TYPES.RolesRepository) private rolesRepository: RolesRepositoryInterface,
	) {}

	async createUser({ email, username, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, username);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(username, email);
		if (existedUser) {
			return null;
		}
		const createdUser = await this.usersRepository.create(newUser);
		await this.rolesRepository.create(createdUser.id, ['USER']);
		return createdUser;
	}

	async validateUser({ username, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(username);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}

	async findRoles(userId: number): Promise<TypesRoles[] | null> {
		const result = await this.rolesRepository.findByUserId(userId);
		if (!result) {
			return null;
		}
		return result.roles;
	}

	async getUserInfo(username: string): Promise<UserModel | null> {
		return this.usersRepository.find(username);
	}

	async updateRoles(userId: number, newRoles: TypesRoles[]): Promise<UserToRolesInterface | null> {
		await this.rolesRepository.deleteByUserId(userId);
		await this.rolesRepository.create(userId, newRoles);
		const result = this.rolesRepository.findByUserId(userId);
		if (!result) {
			return null;
		}
		return result;
	}
}

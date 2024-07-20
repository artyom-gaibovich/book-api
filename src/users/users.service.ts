import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import {UserModel} from "../database/model/user.model";
import {RolesRepositoryInterface} from "../roles/roles.repository.interface";
import {TypesRoles} from "../roles/role.interface";
import {UserToRolesInterface, UserToToRoles} from "../roles/user-to-roles.interface";

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
		@inject(TYPES.RolesRepository) private rolesRepository: RolesRepositoryInterface,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}

	async findRoles(userId: number) : Promise<TypesRoles[] | void>{
		const result = await this.rolesRepository.findByUserId(userId)
		console.log(result?.roles)
		if (!result) {
			return;
		}
		return result.roles;
	}
	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async updateRoles(userId: number, newRoles: TypesRoles[]) {
		await this.rolesRepository.deleteByUserId(userId)
		await this.rolesRepository.create(userId, newRoles)
		return this.rolesRepository.findByUserId(userId)
	}
}

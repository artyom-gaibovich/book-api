import {UserLoginDto} from './dto/user-login.dto';
import {UserRegisterDto} from './dto/user-register.dto';
import {UserModel} from "../database/model/user.model";
import {TypesRoles} from "../roles/role.interface";
import {UserToRolesInterface} from "../roles/user-to-roles.interface";

export interface IUserService {
	findRoles: (userId: number) => Promise<TypesRoles[] | void>
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	updateRoles: (userId: number, newRoles: TypesRoles[]) => Promise<UserToRolesInterface | null>
}

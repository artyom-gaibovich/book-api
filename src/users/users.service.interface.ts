import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserModel } from './user.model';
import { TypesRoles, UserToRolesInterface } from '../roles/role.model';

export interface UsersServiceInterface {
	findRoles(userId: number): Promise<TypesRoles[] | null>;

	createUser(dto: UserRegisterDto): Promise<UserModel | null>;

	validateUser(dto: UserLoginDto): Promise<boolean>;

	getUserInfo(username: string): Promise<UserModel | null>;

	updateRoles(userId: number, newRoles: TypesRoles[]): Promise<UserToRolesInterface | null>;
}

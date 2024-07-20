import {User} from './user.entity';
import {UserModel} from "../database/model/user.model";

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}

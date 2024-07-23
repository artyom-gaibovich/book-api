import { User } from './user.entity';
import { UserModel } from './user.model';

export interface UsersRepositoryInterface {
	create(user: User): Promise<UserModel>;

	find(username: string, email?: string): Promise<UserModel | null>;
}

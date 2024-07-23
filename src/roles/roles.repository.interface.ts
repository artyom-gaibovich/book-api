import { TypesRoles, UserToRolesInterface } from './role.model';

export interface RolesRepositoryInterface {
	findByUserId(userId: number): Promise<UserToRolesInterface | null>;

	deleteByUserId(userId: number): Promise<void>;

	create(userId: number, newRoles: TypesRoles[]): Promise<void>;
}

export type TypesRoles = 'ADMIN' | 'USER';
export interface UserToRolesInterface {
	userId: number;
	roles: TypesRoles[];
}

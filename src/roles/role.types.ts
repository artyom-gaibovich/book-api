export type TypesRoles = 'ADMIN' | 'USER';

export enum Roles {
	None = 0,
	User = 1 << 0,
	Admin = 1 << 1,
}

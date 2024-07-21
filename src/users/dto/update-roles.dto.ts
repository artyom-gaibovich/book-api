import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TypesRoles } from '../../roles/role.types';
import { Transform } from 'class-transformer';

export class UpdateRolesDto {
	@IsNotEmpty({ message: 'User ID is required.' })
	@IsNumber({}, { message: 'ID is a only number.' })
	userId: number;

	@IsArray()
	@IsString({ each: true })
	@IsIn(['ADMIN', 'USER'], { each: true, message: 'Role must be either "ADMIN" or "USER".' })
	@IsNotEmpty({ message: 'Roles are required.' })
	@Transform(({ value }) => Array.from(new Set(value)), { toClassOnly: true })
	roles: TypesRoles[];
}

import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TypesRoles } from '../../roles/role.model';
import { Transform } from 'class-transformer';

export class UpdateRolesDto {

	@IsArray()
	@IsString({ each: true })
	@IsIn(['ADMIN', 'USER'], { each: true, message: 'Role must be either "ADMIN" or "USER".' })
	@IsNotEmpty({ message: 'Roles are required.' })
	@Transform(({ value }) => Array.from(new Set(value)), { toClassOnly: true })
	roles: TypesRoles[];
}

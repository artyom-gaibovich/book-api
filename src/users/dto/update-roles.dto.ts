import {IsArray, IsEmail, IsIn, IsNegative, IsNumber, IsString} from 'class-validator';
import {TypesRoles} from "../../roles/role.interface";

export class UpdateRolesDto {
    @IsNumber({}, { message: 'ID - is a only number.' })
    userId: number;

    @IsArray()
    @IsString({ each: true })
    @IsIn(['ADMIN', 'USER'], { each: true, message: 'Role must be either "ADMIN" or "USER".' })
    roles: TypesRoles[];

}

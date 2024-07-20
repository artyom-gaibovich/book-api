import {IsArray, IsNotEmpty, IsString} from "class-validator";
import {TypesRoles} from "../../roles/role.interface";

export class CreateBookDto {

    @IsNotEmpty({ message: 'Title is required.' })
    @IsString()
    title: string;


    @IsNotEmpty({ message: 'Author is required.' })
    @IsString()
    author: string;

    @IsNotEmpty({ message: 'Date is required.' })
    @IsString()
    publicationDate: string; //While is set string.


    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ message: 'Genres are required.' })
    roles: TypesRoles[];


}
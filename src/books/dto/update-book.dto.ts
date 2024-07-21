import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookDto {

    @IsNotEmpty({ message: 'Title is required.' })
    @IsString()
    title: string;


    @IsNotEmpty({ message: 'Author is required.' })
    @IsString()
    author: string;

    @IsNotEmpty({ message: 'Date is required.' })
    @IsString()
    publicationDate: string; //While i set string value.


    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ message: 'Genres are required.' })
    genres: string[];

}
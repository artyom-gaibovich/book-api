import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Username is not correct' })
	username: string;

	@IsString()
	password: string;
}

import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Email is not correct' })
	email: string;

	@IsString({ message: 'Password is a string' })
	password: string;

	@IsString({ message: 'Message is string' })
	username: string;
}

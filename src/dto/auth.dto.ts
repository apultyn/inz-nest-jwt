import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsEmailConf } from './util';

export class RegisterDto {
    @IsEmail({}, IsEmailConf)
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}

export class LoginDto {
    @IsEmail({}, IsEmailConf)
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

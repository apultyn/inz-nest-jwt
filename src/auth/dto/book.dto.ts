import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookCreateReq {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;
}

export class BookUpdateReq {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    author: string;
}

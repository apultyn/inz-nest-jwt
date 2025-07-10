import { IsNotEmpty, IsString } from 'class-validator';

export class BookCreateReq {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;
}

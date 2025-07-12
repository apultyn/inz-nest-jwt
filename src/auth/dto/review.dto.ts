import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class ReviewCreateReq {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    stars: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    comment: string;

    @IsNotEmpty()
    @IsNumber()
    bookId: number;
}

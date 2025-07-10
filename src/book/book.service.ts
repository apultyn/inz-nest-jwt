import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BookCreateReq } from 'src/auth/dto/book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
    constructor(private prismaService: PrismaService) {}

    async getAll() {
        return await this.prismaService.book.findMany();
    }

    async getById(id: number) {
        const book = await this.prismaService.book.findUnique({
            where: {
                id: id,
            },
        });

        return book;
    }

    async create(dto: BookCreateReq) {
        try {
            const createdBook = await this.prismaService.book.create({
                data: {
                    title: dto.title,
                    author: dto.author,
                },
            });

            return createdBook;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException(
                        'Books must have unique combination of title and author',
                    );
                }
            }
            throw error;
        }
    }
}

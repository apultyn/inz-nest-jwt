import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateReq } from 'src/auth/dto/book.dto';
import { Roles } from 'src/auth/decorator';

@Controller('api/books')
export class BookController {
    constructor(private bookService: BookService) {}
    @Get('')
    getAll() {
        return this.bookService.getAll();
    }

    @Get(':id')
    getById(@Param() id: number) {
        return this.bookService.getById(id);
    }

    @Roles(['ADMIN'])
    create(@Body() dto: BookCreateReq) {
        return this.bookService.create(dto);
    }
}

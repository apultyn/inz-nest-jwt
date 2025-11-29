import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateReq, BookUpdateReq } from 'src/dto/book.dto';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('api/books')
export class BookController {
    constructor(private bookService: BookService) {}
    @Get()
    async getList(@Query('searchString') searchString: string = '') {
        return await this.bookService.getList(searchString);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.bookService.getById(Number(id));
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Post('')
    async create(@Body() dto: BookCreateReq) {
        return await this.bookService.create(dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: BookUpdateReq) {
        return await this.bookService.update(Number(id), dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.bookService.delete(Number(id));
    }
}

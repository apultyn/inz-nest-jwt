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
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateReq, BookUpdateReq } from 'src/auth/dto/book.dto';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('api/books')
export class BookController {
    constructor(private bookService: BookService) {}
    @Get()
    getList(@Query('searchString') searchString: string = '') {
        return this.bookService.getList(searchString);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.bookService.getById(Number(id));
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Post('')
    create(@Body() dto: BookCreateReq) {
        return this.bookService.create(dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: BookUpdateReq) {
        return this.bookService.update(Number(id), dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.bookService.delete(Number(id));
    }
}

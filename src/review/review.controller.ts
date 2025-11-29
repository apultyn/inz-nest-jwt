import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ReviewCreateReq, ReviewUpdateReq } from 'src/dto/review.dto';
import { GetUserId } from 'src/auth/decorator/user.decorator';

@Controller('api/reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}
    @Get('')
    async getAll() {
        return await this.reviewService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.reviewService.getById(Number(id));
    }

    @Roles(Role.USER)
    @UseGuards(JwtGuard, RolesGuard)
    @Post('')
    async create(
        @Body() dto: ReviewCreateReq,
        @GetUserId('id') userId: number,
    ) {
        return await this.reviewService.create(dto, userId);
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Patch(':id')
    async update(@Body() dto: ReviewUpdateReq, @Param('id') id: string) {
        return await this.reviewService.update(dto, Number(id));
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.reviewService.delete(Number(id));
    }
}

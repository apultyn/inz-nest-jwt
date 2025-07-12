import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ReviewCreateReq } from 'src/auth/dto/review.dto';
import { GetUserId } from 'src/auth/decorator/user.decorator';

@Controller('api/reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}
    @Get('')
    getAll() {
        return this.reviewService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.reviewService.getById(Number(id));
    }

    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Post('')
    create(@Body() dto: ReviewCreateReq, @GetUserId('id') userId: number) {
        return this.reviewService.create(dto, userId);
    }
}

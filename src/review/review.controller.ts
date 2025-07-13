import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
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

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Patch(':id')
    update(@Body() dto: ReviewUpdateReq, @Param('id') id: string) {
        return this.reviewService.update(dto, Number(id));
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.reviewService.delete(Number(id));
    }
}

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ReviewCreateReq } from 'src/auth/dto/review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { reviewSelect } from '../constants';

@Injectable()
export class ReviewService {
    constructor(private prismaService: PrismaService) {}

    async getAll() {
        return await this.prismaService.review.findMany({
            select: reviewSelect,
        });
    }

    async getById(id: number) {
        const review = await this.prismaService.review.findUnique({
            where: {
                id: id,
            },
            select: reviewSelect,
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }
    async create(dto: ReviewCreateReq, userId: number) {
        try {
            const createdReview = await this.prismaService.review.create({
                data: {
                    stars: dto.stars,
                    comment: dto.comment,
                    bookId: dto.bookId,
                    userId: userId,
                },
            });

            return createdReview;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException(
                        'Only one review per user per book',
                    );
                }
                if (error.code === 'P2003') {
                    throw new BadRequestException('Book does not exist');
                }
            }
            throw error;
        }
    }
}

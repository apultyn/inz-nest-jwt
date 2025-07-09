import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async register(dto: RegisterDto) {
        if (dto.password !== dto.confirmPassword) {
            return 'Passwd missmatch';
        }

        try {
            const hash = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                },
                select: {
                    id: true,
                    email: true,
                },
            });

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email taken');
                }
            }
            throw error;
        }
    }
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
            email: dto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const pwMatches = await argon.verify(user.password, dto.password);

        if (!pwMatches) {
            throw new UnauthorizedException('Password incorrect');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

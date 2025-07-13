import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from '../dto';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}
    async register(dto: RegisterDto) {
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Password missmatch');
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
                    role: true,
                },
            });

            return this.singToken(user.id, user.email, user.role);
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

        return this.singToken(user.id, user.email, user.role);
    }

    async singToken(
        userId: number,
        email: string,
        role: Role,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email: email,
            role: role,
        };

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });

        return {
            access_token: token,
        };
    }
}

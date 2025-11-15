import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { LoginDto, RegisterDto } from '../dto';
import { Role, UserRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { userSelect } from 'src/constants/user.select';

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
                },
            });

            await this.prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleName: Role.USER,
                },
            });

            return {
                message: 'Registered successfully',
                user,
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('Email taken');
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
            select: userSelect,
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const pwMatches = await argon.verify(user.password, dto.password);

        if (!pwMatches) {
            throw new UnauthorizedException('Password incorrect');
        }

        return this.singToken(user.id, user.email, user.roles);
    }

    async singToken(
        userId: number,
        email: string,
        roles: { roleName: Role }[],
    ): Promise<{ access_token: string; expires_in: number }> {
        const iat = Math.floor(Date.now() / 1000);
        const expires_in_seconds = +this.config.get('JWT_EXPIRE');
        const exp = iat + expires_in_seconds;

        const payload = {
            email: email,
            sub: userId,
            iat: iat,
            exp: exp,
            roles: roles,
        };

        const expires_in = +this.config.get('JWT_EXPIRE');

        const token = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
        });

        return {
            access_token: token,
            expires_in,
        };
    }
}

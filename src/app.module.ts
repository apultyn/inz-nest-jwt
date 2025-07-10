import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        AuthModule,
        BookModule,
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
})
export class AppModule {}

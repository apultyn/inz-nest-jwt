import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewModule } from './review/review.module';

@Module({
    imports: [
        AuthModule,
        BookModule,
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ReviewModule,
    ],
})
export class AppModule {}

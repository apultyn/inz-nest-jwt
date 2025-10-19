import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins = process.env.CORS_ALLOWED_ORIGIN;
    if (allowedOrigins) {
        app.enableCors({
            origin: allowedOrigins.split(','),
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            allowedHeaders: 'Content-Type, Accept, Authorization',
        });
    }
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.listen(3000);
}
bootstrap();

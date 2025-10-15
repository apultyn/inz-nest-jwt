import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:' + process.env.FRONTEND_LOCAL_PORT,
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.listen(8080);
}
bootstrap();

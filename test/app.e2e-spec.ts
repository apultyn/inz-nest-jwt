import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import * as argon from 'argon2';
import { LoginDto, RegisterDto } from 'src/dto';
import { Role } from '@prisma/client';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );
        await app.init();
        await app.listen(3333);
        pactum.request.setBaseUrl('http://localhost:3333');
    });

    beforeEach(async () => {
        prisma = app.get(PrismaService);
        await prisma.cleanDb();
        await prisma.user.create({
            data: {
                id: 1,
                email: 'admin@example.com',
                password: await argon.hash('passwd'),
                role: Role.ADMIN,
            },
        });
        await prisma.user.create({
            data: {
                id: 2,
                email: 'user@example.com',
                password: await argon.hash('passwd'),
                role: Role.USER,
            },
        });
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        describe('Register', () => {
            it('Register successfull', () => {
                const req: RegisterDto = {
                    email: 'test@example.com',
                    password: 'passwd',
                    confirmPassword: 'passwd',
                };
                return pactum
                    .spec()
                    .post('/api/auth/register')
                    .withBody(req)
                    .expectStatus(201);
            });
        });
        describe('Login', () => {
            it('Login successfull', () => {
                const req: LoginDto = {
                    email: 'user@example.com',
                    password: 'passwd',
                };
                return pactum
                    .spec()
                    .post('/api/auth/login')
                    .withBody(req)
                    .expectStatus(200);
            });
        });
    });
    describe('Book', () => {
        describe('Create', () => {});
        describe('Read', () => {});
        describe('Update', () => {});
        describe('Delete', () => {});
    });
    describe('Review', () => {
        describe('Create', () => {});
        describe('Read', () => {});
        describe('Update', () => {});
        describe('Delete', () => {});
    });
});

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

        const admin = {
            id: 1,
            email: 'admin@example.com',
            password: await argon.hash('passwd'),
            role: Role.ADMIN,
        };

        const user = {
            id: 2,
            email: 'user@example.com',
            password: await argon.hash('passwd'),
            role: Role.USER,
        };

        const book1 = {
            id: 1,
            title: 'Dune',
            author: 'Frank Herbert',
        };

        const book2 = {
            id: 2,
            title: 'Mistrz czystego kodu',
            author: 'Robert C. Martin',
        };

        const review1 = {
            id: 1,
            bookId: 1,
            userId: 2,
            stars: 5,
            comment: 'Awesome',
        };

        await prisma.user.createMany({
            data: [admin, user],
        });
        await prisma.book.createMany({ data: [book1, book2] });
        await prisma.review.create({ data: review1 });
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
                    .expectStatus(200)
                    .expectBodyContains('access_token');
            });
        });
    });
    describe('Book', () => {
        describe('Create', () => {});
        describe('Read', () => {
            it('Get list', () => {
                return pactum
                    .spec()
                    .get('/api/books')
                    .expectStatus(200)
                    .expectJsonLength(2);
            });
            it('Get list with searchString', async () => {
                await prisma.book.create({
                    data: {
                        id: 3,
                        title: 'Something',
                        author: 'Dune',
                    },
                });
                return pactum
                    .spec()
                    .get('/api/books?searchString=dune')
                    .expectStatus(200)
                    .expectJsonLength(2);
            });
            it('Get single', () => {
                return pactum
                    .spec()
                    .get('/api/books/1')
                    .expectStatus(200)
                    .expectBody({
                        id: 1,
                        title: 'Dune',
                        author: 'Frank Herbert',
                        reviews: [
                            {
                                id: 1,
                                stars: 5,
                                comment: 'Awesome',
                                user: {
                                    email: 'user@example.com',
                                },
                            },
                        ],
                    });
            });
        });
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

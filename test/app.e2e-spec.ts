import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as argon from 'argon2';
import * as pactum from 'pactum';

import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from 'src/dto';

let userToken = '';
let adminToken = '';
let passwd = '';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        passwd = await argon.hash('passwd');
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
            password: passwd,
        };

        const user = {
            id: 2,
            email: 'user@example.com',
            password: passwd,
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

        const review2 = {
            id: 2,
            bookId: 2,
            userId: 1,
            stars: 2,
            comment: 'Awfully boring',
        };

        const userRole1 = {
            id: 1,
            roleName: Role.USER,
            userId: 1,
        };

        const userRole2 = {
            id: 2,
            roleName: Role.USER,
            userId: 2,
        };

        const userAdmin1 = {
            id: 3,
            roleName: Role.ADMIN,
            userId: 1,
        };

        await prisma.user.createMany({
            data: [admin, user],
        });
        await prisma.book.createMany({ data: [book1, book2] });
        await prisma.review.createMany({ data: [review1, review2] });
        await prisma.userRole.createMany({
            data: [userRole1, userRole2, userAdmin1],
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
            it('Login user successfull', () => {
                const req: LoginDto = {
                    email: 'user@example.com',
                    password: 'passwd',
                };
                return pactum
                    .spec()
                    .post('/api/auth/login')
                    .withBody(req)
                    .expectStatus(200)
                    .expectBodyContains('access_token')
                    .then(
                        (res) => {
                            userToken = res.body.access_token;
                        },
                        () => {},
                    );
            });
            it('Login admin successfull', () => {
                const req: LoginDto = {
                    email: 'admin@example.com',
                    password: 'passwd',
                };
                return pactum
                    .spec()
                    .post('/api/auth/login')
                    .withBody(req)
                    .expectStatus(200)
                    .expectBodyContains('access_token')
                    .then(
                        (res) => {
                            adminToken = res.body.access_token;
                        },
                        () => {},
                    );
            });
        });
    });
    describe('Book', () => {
        describe('Create', () => {
            it('Create unauthorized', () => {
                return pactum
                    .spec()
                    .post('/api/books')
                    .withBody({ title: 'Dune 2', author: 'Frank Herbert' })
                    .expectStatus(401);
            });
            it('Create as user', async () => {
                return pactum
                    .spec()
                    .post('/api/books')
                    .withBearerToken(userToken)
                    .withBody({ title: 'Dune 2', author: 'Frank Herbert' })
                    .expectStatus(403);
            });
            it('Create as admin', () => {
                return pactum
                    .spec()
                    .post('/api/books')
                    .withBearerToken(adminToken)
                    .withBody({ title: 'Dune 2', author: 'Frank Herbert' })
                    .expectStatus(201);
            });
        });
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
                                bookId: 1,
                                user: {
                                    email: 'user@example.com',
                                },
                            },
                        ],
                    });
            });
        });
        describe('Update', () => {
            it('Update unauthorized', () => {
                return pactum
                    .spec()
                    .patch('/api/books/1')
                    .withBody({ title: 'Dune 2' })
                    .expectStatus(401);
            });
            it('Update as user', async () => {
                return pactum
                    .spec()
                    .patch('/api/books/1')
                    .withBody({ title: 'Dune 2' })
                    .withBearerToken(userToken)
                    .expectStatus(403);
            });
            it('Update as admin', () => {
                return pactum
                    .spec()
                    .patch('/api/books/1')
                    .withBody({ title: 'Dune 2' })
                    .withBearerToken(adminToken)
                    .expectStatus(200)
                    .expectBody({
                        id: 1,
                        title: 'Dune 2',
                        author: 'Frank Herbert',
                    });
            });
        });
        describe('Delete', () => {
            it('Delete unauthorized', () => {
                return pactum.spec().delete('/api/books/1').expectStatus(401);
            });
            it('Delete as user', async () => {
                return pactum
                    .spec()
                    .delete('/api/books/1')
                    .withBearerToken(userToken)
                    .expectStatus(403);
            });
            it('Delete as admin', () => {
                return pactum
                    .spec()
                    .delete('/api/books/1')
                    .withBearerToken(adminToken)
                    .expectStatus(204);
            });
        });
    });
    describe('Review', () => {
        describe('Create', () => {
            const req = {
                bookId: 2,
                stars: 4,
                comment: 'Fine',
            };
            it('Create unauthorized', () => {
                return pactum
                    .spec()
                    .post('/api/reviews')
                    .withBody(req)
                    .expectStatus(401);
            });
            it('Create as user', async () => {
                return pactum
                    .spec()
                    .post('/api/reviews')
                    .withBearerToken(userToken)
                    .withBody(req)
                    .expectStatus(201);
            });
            it('Create as admin', () => {
                return pactum
                    .spec()
                    .post('/api/reviews')
                    .withBearerToken(adminToken)
                    .withBody({ ...req, bookId: 1 })
                    .expectStatus(201);
            });
        });
        describe('Read', () => {
            it('Get list', () => {
                return pactum
                    .spec()
                    .get('/api/reviews')
                    .expectStatus(200)
                    .expectJsonLength(2);
            });
            it('Get single', () => {
                return pactum
                    .spec()
                    .get('/api/reviews/1')
                    .expectStatus(200)
                    .expectBody({
                        id: 1,
                        stars: 5,
                        comment: 'Awesome',
                        bookId: 1,
                        user: {
                            email: 'user@example.com',
                        },
                    });
            });
        });
        describe('Update', () => {
            it('Update unauthorized', () => {
                return pactum
                    .spec()
                    .patch('/api/reviews/1')
                    .withBody({ stars: 3 })
                    .expectStatus(401);
            });
            it('Update as user', async () => {
                return pactum
                    .spec()
                    .patch('/api/reviews/1')
                    .withBody({ stars: 3 })
                    .withBearerToken(userToken)
                    .expectStatus(403);
            });
            it('Update as admin', () => {
                return pactum
                    .spec()
                    .patch('/api/reviews/1')
                    .withBody({ stars: 3 })
                    .withBearerToken(adminToken)
                    .expectStatus(200)
                    .expectBody({
                        id: 1,
                        stars: 3,
                        comment: 'Awesome',
                        bookId: 1,
                        user: {
                            email: 'user@example.com',
                        },
                    });
            });
        });
        describe('Delete', () => {
            describe('Delete', () => {
                it('Delete unauthorized', () => {
                    return pactum
                        .spec()
                        .delete('/api/reviews/1')
                        .expectStatus(401);
                });
                it('Delete as user', async () => {
                    return pactum
                        .spec()
                        .delete('/api/reviews/1')
                        .withBearerToken(userToken)
                        .expectStatus(403);
                });
                it('Delete as admin', () => {
                    return pactum
                        .spec()
                        .delete('/api/reviews/1')
                        .withBearerToken(adminToken)
                        .expectStatus(204);
                });
            });
        });
    });
});

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'mysql://root:my-secret-pwd@localhost:3306/nest-jwt-db',
                },
            },
        });
    }
}

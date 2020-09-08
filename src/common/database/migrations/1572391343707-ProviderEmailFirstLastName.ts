import {In, MigrationInterface, QueryRunner} from 'typeorm';
import User from '../../../entities/user.entity';
import Provider from '../../../entities/provider.entity';

export class ProviderEmailFirstLastName1572391343707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "providers" ADD "first_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "last_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "email" character varying(255)`);

        const userRepo = queryRunner.manager.getRepository(User);
        const providerRepo = queryRunner.manager.getRepository(Provider);

        const providers = await providerRepo.find({select: ['userId']});

        const providersIds = providers.map(el => el.userId);
        const users = await userRepo.find({
            relations: ['providers'],
            where: {
                id: In(providersIds),
            },
        });
        for (const user of users) {
            for (const provider of user.providers) {
                provider.firstName = user.firstName;
                provider.lastName = user.lastName;
                provider.email = user.email;
            }
            await providerRepo.save(user.providers);
        }

        await queryRunner.query(`ALTER TABLE "providers" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "providers" ALTER COLUMN "first_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "providers" ALTER COLUMN "last_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "providers" ADD CONSTRAINT "UQ_32fe6bfe82d8e4959ba9d9fad42" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" type varchar(255)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" type varchar(255)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" type varchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "first_name"`);
    }

}

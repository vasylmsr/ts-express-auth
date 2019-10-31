import {MigrationInterface, QueryRunner} from "typeorm";

export class ProviderNewFields1572212414525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "providers" ADD "photo_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "email_verified" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "locale" character varying(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "locale"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "photo_url"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBugProspectTable1758903889765 implements MigrationInterface {
    name = 'FixBugProspectTable1758903889765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "prospect" DROP CONSTRAINT "UQ_600609771a0e53e9236635d04f5"
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect" DROP CONSTRAINT "UQ_785b3b65a559acf911b426980b8"
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect"
            ALTER COLUMN "otps"
            SET DEFAULT ARRAY []::text []
        `);
        await queryRunner.query(`
            ALTER TABLE "fpr_request"
            ALTER COLUMN "otps"
            SET DEFAULT ARRAY []::text []
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "fpr_request"
            ALTER COLUMN "otps"
            SET DEFAULT ARRAY []
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect"
            ALTER COLUMN "otps"
            SET DEFAULT ARRAY []
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect"
            ADD CONSTRAINT "UQ_785b3b65a559acf911b426980b8" UNIQUE ("last_name")
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect"
            ADD CONSTRAINT "UQ_600609771a0e53e9236635d04f5" UNIQUE ("first_name")
        `);
    }

}

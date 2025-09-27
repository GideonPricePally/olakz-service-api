import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContactMessageTable1758964753701 implements MigrationInterface {
    name = 'AddContactMessageTable1758964753701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "contact_message"
                RENAME COLUMN "phone" TO "mobile"
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
            ALTER TABLE "contact_message"
                RENAME COLUMN "mobile" TO "phone"
        `);
    }

}

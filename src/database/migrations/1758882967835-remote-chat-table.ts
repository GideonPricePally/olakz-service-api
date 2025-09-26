import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoteChatTable1758882967835 implements MigrationInterface {
    name = 'RemoteChatTable1758882967835'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

}

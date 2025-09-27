import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContactMessageTable1758964075413 implements MigrationInterface {
    name = 'AddContactMessageTable1758964075413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "contact_message" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying,
                "message" text NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_contact_message_id" PRIMARY KEY ("id")
            )
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
            DROP TABLE "contact_message"
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitApp1758782646305 implements MigrationInterface {
    name = 'InitApp1758782646305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."transaction_type_enum" AS ENUM('credit', 'debit', 'campaign')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."transaction_status_enum" AS ENUM(
                'not_paid',
                'awaiting',
                'captured',
                'partially_refunded',
                'refunded',
                'canceled',
                'requires_action',
                'in_complete'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."transaction_type_enum" NOT NULL,
                "amount" numeric(10, 2) NOT NULL,
                "currency_code" character varying NOT NULL,
                "currency_id" uuid,
                "data" character varying,
                "status" "public"."transaction_status_enum" DEFAULT 'awaiting',
                "metadata" character varying NOT NULL DEFAULT '{}',
                "wallet_id" uuid,
                "paymentId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_transaction_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_role" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "value" character varying NOT NULL,
                "display_name" character varying NOT NULL,
                "priority_level" integer NOT NULL DEFAULT '1',
                "is_external" boolean NOT NULL DEFAULT false,
                "actions" text array NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_role_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "permitted_role_key" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "resource_name" character varying NOT NULL,
                "resource_keys" text array NOT NULL DEFAULT '{}',
                "role_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_permitted_role_key_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_role" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "priority_level" integer NOT NULL DEFAULT '1',
                "actions" text array NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_admin_role_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "REL_a28028ba709cd7e5053a86857b" UNIQUE ("user_id"),
                CONSTRAINT "PK_admin_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "prospect" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type_of_user" character varying NOT NULL DEFAULT 'regular_user',
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "t_and_c" boolean NOT NULL,
                "otps" text array NOT NULL DEFAULT ARRAY []::text [],
                "otp_created_at" character varying NOT NULL,
                "signup_completed_at" character varying NOT NULL DEFAULT '',
                "otp_ttl" integer NOT NULL,
                "no_of_request_tries" integer NOT NULL,
                "request_tries_multiple" integer NOT NULL DEFAULT '0',
                "country_id" uuid,
                "user_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_6400214b8d1e8a0f91ac618e754" UNIQUE ("username"),
                CONSTRAINT "PK_prospect_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_prospect_username" ON "prospect" ("username")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE TABLE "session" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "hash" character varying(255) NOT NULL,
                "user_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'suspended', 'blocked', 'deleted')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying,
                "password" character varying NOT NULL,
                "bio" text NOT NULL DEFAULT 'Hi, I am new to Microtask',
                "thumbnail" character varying DEFAULT '',
                "updated_username" character varying NOT NULL,
                "referral_code" character varying NOT NULL,
                "status" "public"."user_status_enum" NOT NULL DEFAULT 'active',
                "first_name" character varying(20) NOT NULL DEFAULT '',
                "last_name" character varying(20) NOT NULL DEFAULT '',
                "mobile" character varying,
                "whatsapp_verified" boolean,
                "email_verified" boolean,
                "t_and_c" boolean NOT NULL,
                "active_token" character varying,
                "refresh_token" character varying,
                "token_expires" character varying,
                "gender" "public"."user_gender_enum",
                "is_onboarded" boolean NOT NULL DEFAULT false,
                "wallet_id" character varying,
                "role_id" uuid,
                "country_id" uuid,
                "referrer_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "UQ_b3a2ab3d9733917ef876376be38" UNIQUE ("referral_code"),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_username" ON "user" ("username")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_email" ON "user" ("email")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_referral" ON "user" ("referral_code")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_mobile" ON "user" ("mobile")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE TABLE "wallet" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "account_number_length" integer NOT NULL DEFAULT '10',
                "available_balance" numeric(12, 2) NOT NULL DEFAULT '0',
                "book_balance" numeric(12, 2) NOT NULL DEFAULT '0',
                "currency_id" uuid,
                "user_id" uuid,
                "default_bank_detail" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "REL_72548a47ac4a996cd254b08252" UNIQUE ("user_id"),
                CONSTRAINT "REL_8281cbd8f5b6cf8ad366b264e7" UNIQUE ("default_bank_detail"),
                CONSTRAINT "PK_wallet_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."bank_detail_status_enum" AS ENUM('active', 'expired')
        `);
        await queryRunner.query(`
            CREATE TABLE "bank_detail" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "wallet_id" uuid,
                "bank_code" character varying NOT NULL,
                "bank_name" character varying NOT NULL,
                "account_number" character varying NOT NULL,
                "status" "public"."bank_detail_status_enum" NOT NULL DEFAULT 'active',
                "countryId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_bank_detail_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "fulfillment_provider" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "is_installed" boolean NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_fulfillment_provider_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tax_provider" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "is_installed" boolean NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_tax_provider_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tax_rate" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rate" numeric NOT NULL,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "region_id" character varying,
                "metadata" jsonb NOT NULL DEFAULT '{}',
                "regionId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_tax_rate_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."region_status_enum" AS ENUM('enabled', 'disabled', 'draft')
        `);
        await queryRunner.query(`
            CREATE TABLE "region" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "currency_code" character varying NOT NULL,
                "gift_cards_taxable" boolean NOT NULL DEFAULT false,
                "automatic_taxes" boolean NOT NULL,
                "metadata" jsonb NOT NULL,
                "includes_tax" boolean NOT NULL,
                "is_default" boolean NOT NULL DEFAULT false,
                "status" "public"."region_status_enum" NOT NULL DEFAULT 'draft',
                "currency_id" uuid,
                "tax_provider_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_region_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "country" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "short_name" character varying NOT NULL,
                "unix_flag_code" character varying NOT NULL,
                "thumbnail_url" character varying NOT NULL,
                "emoji_flag" character varying NOT NULL,
                "active" boolean NOT NULL DEFAULT false,
                "default_currency_id" uuid,
                "regionId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE ("name"),
                CONSTRAINT "UQ_148d4b75e902797d5005be94136" UNIQUE ("short_name"),
                CONSTRAINT "UQ_fbfb922bc0bc00e21c6af856746" UNIQUE ("unix_flag_code"),
                CONSTRAINT "UQ_2a872a648f623efd7192165f7bc" UNIQUE ("thumbnail_url"),
                CONSTRAINT "UQ_465c8500bf09ee82ed6058ff60b" UNIQUE ("emoji_flag"),
                CONSTRAINT "PK_country_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "currency" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "symbol_native" character varying NOT NULL,
                "active" boolean NOT NULL DEFAULT true,
                "is_default" boolean NOT NULL DEFAULT false,
                "includes_tax" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_currency_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payment_status_enum" AS ENUM(
                'not_paid',
                'awaiting',
                'captured',
                'partially_refunded',
                'refunded',
                'canceled',
                'requires_action',
                'in_complete'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" numeric(10, 2) NOT NULL,
                "currency_code" character varying NOT NULL,
                "reference" character varying NOT NULL,
                "currency_id" uuid,
                "amount_refunded" character varying,
                "provider_id" character varying,
                "data" character varying,
                "captured_at" character varying,
                "canceled_at" character varying,
                "status" "public"."payment_status_enum" DEFAULT 'awaiting',
                "metadata" character varying NOT NULL DEFAULT '{}',
                "idempotency_key" character varying NOT NULL,
                "providerId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_4bf2af7227a0562a1fa747298aa" UNIQUE ("reference"),
                CONSTRAINT "PK_payment_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_provider" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "is_installed" boolean NOT NULL DEFAULT false,
                "is_base" boolean NOT NULL DEFAULT false,
                "slug" character varying NOT NULL,
                "regionId" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_payment_provider_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_payment_provider_slug" ON "payment_provider" ("slug")
            WHERE "deleted_at" IS NULL
                and "is_installed" IS TRUE
        `);
        await queryRunner.query(`
            CREATE TABLE "verification" (
                "id" text NOT NULL,
                "identifier" text NOT NULL,
                "value" text NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tag" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "is_system_tag" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"),
                CONSTRAINT "PK_tag_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_6a9775008add570dc3e5a0bab7" ON "tag" ("name")
        `);
        await queryRunner.query(`
            CREATE TABLE "order" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_order_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."idempotency_key_status_enum" AS ENUM('completed', 'in_progress')
        `);
        await queryRunner.query(`
            CREATE TABLE "idempotency_key" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL,
                "request_hash" character varying NOT NULL,
                "response" jsonb,
                "status" "public"."idempotency_key_status_enum" NOT NULL DEFAULT 'in_progress',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_idempotency_key_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "item" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_item_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "fpr_request" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "otps" text array NOT NULL DEFAULT ARRAY []::text [],
                "otp_created_at" character varying NOT NULL,
                "otp_ttl" integer NOT NULL,
                "no_of_request_tries" integer NOT NULL,
                "request_tries_multiple" integer NOT NULL DEFAULT '0',
                "request_completed_at" character varying NOT NULL DEFAULT '',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_98e264e4e67d757ec542d3a6f94" UNIQUE ("username"),
                CONSTRAINT "PK_fpr_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_fpr_username" ON "fpr_request" ("username")
            WHERE "deleted_at" IS NULL
        `);
        await queryRunner.query(`
            CREATE TABLE "chat" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_chat_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "chat_reply" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_chat_reply_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "cart" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_cart_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "account" (
                "id" text NOT NULL,
                "accountId" text NOT NULL,
                "providerId" text NOT NULL,
                "userId" uuid NOT NULL,
                "accessToken" text,
                "refreshToken" text,
                "idToken" text,
                "accessTokenExpiresAt" TIMESTAMP,
                "refreshTokenExpiresAt" TIMESTAMP,
                "scope" text,
                "password" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_role_role_admin" (
                "adminId" uuid NOT NULL,
                "adminRoleId" uuid NOT NULL,
                CONSTRAINT "PK_ae4e983996e146b0a4edb299698" PRIMARY KEY ("adminId", "adminRoleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_74342fb1fcdc0b6bd34f180ead" ON "admin_role_role_admin" ("adminId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_23447ed9e789eb7414284a1ff6" ON "admin_role_role_admin" ("adminRoleId")
        `);
        await queryRunner.query(`
            CREATE TABLE "region_fulfillment_provider_fulfillment_provider_region" (
                "regionId" uuid NOT NULL,
                "fulfillmentProviderId" uuid NOT NULL,
                CONSTRAINT "PK_352d0e0bd57c086ec4927758dc2" PRIMARY KEY ("regionId", "fulfillmentProviderId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c26670123334e09c79ba41bf4b" ON "region_fulfillment_provider_fulfillment_provider_region" ("regionId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e987f01d5ff918cd4061a96b6e" ON "region_fulfillment_provider_fulfillment_provider_region" ("fulfillmentProviderId")
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_595f8b5303f23e9c063fda56fae" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_08081d10759ec250c557cebd81a" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_26ba3b75368b99964d6dea5cc2c" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "permitted_role_key"
            ADD CONSTRAINT "FK_6fd8ddc059417d6176113391645" FOREIGN KEY ("role_id") REFERENCES "user_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin"
            ADD CONSTRAINT "FK_a28028ba709cd7e5053a86857b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect"
            ADD CONSTRAINT "FK_490811aca54e7007439673f5004" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect"
            ADD CONSTRAINT "FK_9c8eab33dae5b77ecabb546eec0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "session"
            ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "user_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_b89cdc0829042ce01f20140eced" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_1c1cdd6ef02ae157f3ee8f0e5aa" FOREIGN KEY ("referrer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_72548a47ac4a996cd254b082522" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_3a458d3da4096019c5cd630c22e" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_8281cbd8f5b6cf8ad366b264e7a" FOREIGN KEY ("default_bank_detail") REFERENCES "bank_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_detail"
            ADD CONSTRAINT "FK_2635c61a521de774037140a063c" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_detail"
            ADD CONSTRAINT "FK_edfd57f4276f324bd2cd677fac2" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tax_rate"
            ADD CONSTRAINT "FK_6d21ab15317a024483816ab3784" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "region"
            ADD CONSTRAINT "FK_a60e879c6664a23f0a40fb90e6e" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "region"
            ADD CONSTRAINT "FK_91f88052197680f9790272aaf5b" FOREIGN KEY ("tax_provider_id") REFERENCES "tax_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "country"
            ADD CONSTRAINT "FK_a4c8808a795cd689a9acffb4c79" FOREIGN KEY ("default_currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "country"
            ADD CONSTRAINT "FK_adda353c674d16613298959d5bc" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD CONSTRAINT "FK_0c2788c000c47176b48596cad1a" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD CONSTRAINT "FK_f4c3d03dc45416b0392b55c63ca" FOREIGN KEY ("providerId") REFERENCES "payment_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_provider"
            ADD CONSTRAINT "FK_39df0042b3b99144aad3f7df7a4" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "account"
            ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_role_role_admin"
            ADD CONSTRAINT "FK_74342fb1fcdc0b6bd34f180ead6" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_role_role_admin"
            ADD CONSTRAINT "FK_23447ed9e789eb7414284a1ff6a" FOREIGN KEY ("adminRoleId") REFERENCES "admin_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "region_fulfillment_provider_fulfillment_provider_region"
            ADD CONSTRAINT "FK_c26670123334e09c79ba41bf4be" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "region_fulfillment_provider_fulfillment_provider_region"
            ADD CONSTRAINT "FK_e987f01d5ff918cd4061a96b6e1" FOREIGN KEY ("fulfillmentProviderId") REFERENCES "fulfillment_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "region_fulfillment_provider_fulfillment_provider_region" DROP CONSTRAINT "FK_e987f01d5ff918cd4061a96b6e1"
        `);
        await queryRunner.query(`
            ALTER TABLE "region_fulfillment_provider_fulfillment_provider_region" DROP CONSTRAINT "FK_c26670123334e09c79ba41bf4be"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_role_role_admin" DROP CONSTRAINT "FK_23447ed9e789eb7414284a1ff6a"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_role_role_admin" DROP CONSTRAINT "FK_74342fb1fcdc0b6bd34f180ead6"
        `);
        await queryRunner.query(`
            ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_provider" DROP CONSTRAINT "FK_39df0042b3b99144aad3f7df7a4"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP CONSTRAINT "FK_f4c3d03dc45416b0392b55c63ca"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP CONSTRAINT "FK_0c2788c000c47176b48596cad1a"
        `);
        await queryRunner.query(`
            ALTER TABLE "country" DROP CONSTRAINT "FK_adda353c674d16613298959d5bc"
        `);
        await queryRunner.query(`
            ALTER TABLE "country" DROP CONSTRAINT "FK_a4c8808a795cd689a9acffb4c79"
        `);
        await queryRunner.query(`
            ALTER TABLE "region" DROP CONSTRAINT "FK_91f88052197680f9790272aaf5b"
        `);
        await queryRunner.query(`
            ALTER TABLE "region" DROP CONSTRAINT "FK_a60e879c6664a23f0a40fb90e6e"
        `);
        await queryRunner.query(`
            ALTER TABLE "tax_rate" DROP CONSTRAINT "FK_6d21ab15317a024483816ab3784"
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_detail" DROP CONSTRAINT "FK_edfd57f4276f324bd2cd677fac2"
        `);
        await queryRunner.query(`
            ALTER TABLE "bank_detail" DROP CONSTRAINT "FK_2635c61a521de774037140a063c"
        `);
        await queryRunner.query(`
            ALTER TABLE "wallet" DROP CONSTRAINT "FK_8281cbd8f5b6cf8ad366b264e7a"
        `);
        await queryRunner.query(`
            ALTER TABLE "wallet" DROP CONSTRAINT "FK_3a458d3da4096019c5cd630c22e"
        `);
        await queryRunner.query(`
            ALTER TABLE "wallet" DROP CONSTRAINT "FK_72548a47ac4a996cd254b082522"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_1c1cdd6ef02ae157f3ee8f0e5aa"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_b89cdc0829042ce01f20140eced"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"
        `);
        await queryRunner.query(`
            ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect" DROP CONSTRAINT "FK_9c8eab33dae5b77ecabb546eec0"
        `);
        await queryRunner.query(`
            ALTER TABLE "prospect" DROP CONSTRAINT "FK_490811aca54e7007439673f5004"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin" DROP CONSTRAINT "FK_a28028ba709cd7e5053a86857b4"
        `);
        await queryRunner.query(`
            ALTER TABLE "permitted_role_key" DROP CONSTRAINT "FK_6fd8ddc059417d6176113391645"
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_26ba3b75368b99964d6dea5cc2c"
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_08081d10759ec250c557cebd81a"
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_595f8b5303f23e9c063fda56fae"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e987f01d5ff918cd4061a96b6e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c26670123334e09c79ba41bf4b"
        `);
        await queryRunner.query(`
            DROP TABLE "region_fulfillment_provider_fulfillment_provider_region"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23447ed9e789eb7414284a1ff6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_74342fb1fcdc0b6bd34f180ead"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_role_role_admin"
        `);
        await queryRunner.query(`
            DROP TABLE "account"
        `);
        await queryRunner.query(`
            DROP TABLE "cart"
        `);
        await queryRunner.query(`
            DROP TABLE "chat_reply"
        `);
        await queryRunner.query(`
            DROP TABLE "chat"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_fpr_username"
        `);
        await queryRunner.query(`
            DROP TABLE "fpr_request"
        `);
        await queryRunner.query(`
            DROP TABLE "item"
        `);
        await queryRunner.query(`
            DROP TABLE "idempotency_key"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."idempotency_key_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "order"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6a9775008add570dc3e5a0bab7"
        `);
        await queryRunner.query(`
            DROP TABLE "tag"
        `);
        await queryRunner.query(`
            DROP TABLE "verification"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_payment_provider_slug"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_provider"
        `);
        await queryRunner.query(`
            DROP TABLE "payment"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "currency"
        `);
        await queryRunner.query(`
            DROP TABLE "country"
        `);
        await queryRunner.query(`
            DROP TABLE "region"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."region_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "tax_rate"
        `);
        await queryRunner.query(`
            DROP TABLE "tax_provider"
        `);
        await queryRunner.query(`
            DROP TABLE "fulfillment_provider"
        `);
        await queryRunner.query(`
            DROP TABLE "bank_detail"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."bank_detail_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "wallet"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_mobile"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_referral"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_gender_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "session"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."UQ_prospect_username"
        `);
        await queryRunner.query(`
            DROP TABLE "prospect"
        `);
        await queryRunner.query(`
            DROP TABLE "admin"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_role"
        `);
        await queryRunner.query(`
            DROP TABLE "permitted_role_key"
        `);
        await queryRunner.query(`
            DROP TABLE "user_role"
        `);
        await queryRunner.query(`
            DROP TABLE "transaction"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."transaction_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."transaction_type_enum"
        `);
    }

}

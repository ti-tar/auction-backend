import {MigrationInterface, QueryRunner} from 'typeorm';

export class MigrationFirst1570025319453 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "lots_status_enum" AS ENUM('pending', 'inProcess', 'closed')`);
        await queryRunner.query(`CREATE TABLE "lots" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "image" character varying(255), "description" text, "status" "lots_status_enum" NOT NULL DEFAULT 'pending', "current_price" double precision NOT NULL, "estimated_price" double precision NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "user_id" integer, CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "users_status_enum" AS ENUM('pending', 'approved')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(12) NOT NULL, "password" character varying(255) NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "status" "users_status_enum" NOT NULL DEFAULT 'pending', "token" character varying(255), CONSTRAINT "UQ_9117cd802f56e45adfaeb567438" UNIQUE ("email", "phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bids" ("id" SERIAL NOT NULL, "bid_creation_time" TIMESTAMP NOT NULL, "proposed_price" integer NOT NULL, "user_id" integer, "lot_id" integer, CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "orders_type_enum" AS ENUM('Royal Mail', 'United States Postal Service', 'DHL Express')`);
        await queryRunner.query(`CREATE TYPE "orders_status_enum" AS ENUM('pending', 'sent', 'delivered')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "arrival_location" text, "type" "orders_type_enum" NOT NULL, "status" "orders_status_enum" NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "FK_0d5475dec78022776a348ce133f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_cd7b0cdcb890ad457b676c0dfe8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bids" ADD CONSTRAINT "FK_45780bd8ce7162c644f6aa5c53a" FOREIGN KEY ("lot_id") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_45780bd8ce7162c644f6aa5c53a"`);
        await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_cd7b0cdcb890ad457b676c0dfe8"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "FK_0d5475dec78022776a348ce133f"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "orders_type_enum"`);
        await queryRunner.query(`DROP TABLE "bids"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_status_enum"`);
        await queryRunner.query(`DROP TABLE "lots"`);
        await queryRunner.query(`DROP TYPE "lots_status_enum"`);
    }

}

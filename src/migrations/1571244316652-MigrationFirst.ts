import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationFirst1571244316652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."orders_type_enum" RENAME TO "orders_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "orders_type_enum" AS ENUM('pending', 'Royal Mail', 'United States Postal Service', 'DHL Express')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "type" TYPE "orders_type_enum" USING "type"::"text"::"orders_type_enum"`);
        await queryRunner.query(`DROP TYPE "orders_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "orders_type_enum_old" AS ENUM('Royal Mail', 'United States Postal Service', 'DHL Express')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "type" TYPE "orders_type_enum_old" USING "type"::"text"::"orders_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "orders_type_enum"`);
        await queryRunner.query(`ALTER TYPE "orders_type_enum_old" RENAME TO  "orders_type_enum"`);
    }

}

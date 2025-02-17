import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecipesTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        preparation_time TIME NOT NULL,
        is_fitness BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE recipes`);
  }
}
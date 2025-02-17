import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecipesStepsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE recipes_steps (
        id SERIAL PRIMARY KEY,
        description VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE recipes_steps`);
  }
}
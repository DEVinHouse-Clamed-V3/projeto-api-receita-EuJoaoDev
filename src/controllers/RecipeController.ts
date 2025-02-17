import { Request, Response } from "express";
import { AppDataSource } from "../utils/data-source";
import { Recipe } from "../entities/Recipe";
import { RecipeIngredient } from "../entities/RecipeIngredient";
import { RecipeStep } from "../entities/RecipeStep";

export class RecipeController {
  // Método para cadastrar uma nova receita
  async createRecipe(req: Request, res: Response) {
    const { name, preparation_time, is_fitness, ingredients, steps } = req.body;

    // Inicia uma transação
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cria a receita
      const recipe = new Recipe();
      recipe.name = name;
      recipe.preparation_time = preparation_time;
      recipe.is_fitness = is_fitness;

      // Salva a receita
      await queryRunner.manager.save(recipe);

      // Cria e salva os ingredientes
      const recipeIngredients = ingredients.map((ingredientName: string) => {
        const ingredient = new RecipeIngredient();
        ingredient.name = ingredientName;
        ingredient.recipe = recipe; // Associa o ingrediente à receita
        return ingredient;
      });
      await queryRunner.manager.save(recipeIngredients);

      // Cria e salva os passos
      const recipeSteps = steps.map((stepDescription: string) => {
        const step = new RecipeStep();
        step.description = stepDescription;
        step.recipe = recipe; // Associa o passo à receita
        return step;
      });
      await queryRunner.manager.save(recipeSteps);

      // Confirma a transação
      await queryRunner.commitTransaction();

      return res.status(201).json({ message: "Receita criada com sucesso!", recipe });
    } catch (error) {
      // Reverte a transação em caso de erro
      await queryRunner.rollbackTransaction();
      return res.status(500).json({ message: "Erro ao criar a receita", error });
    } finally {
      // Libera o queryRunner
      await queryRunner.release();
    }
  }

  // Método para listar todas as receitas com relacionamentos
  async listRecipes(req: Request, res: Response) {
    try {
      const recipeRepository = AppDataSource.getRepository(Recipe);

      // Busca todas as receitas com seus ingredientes e passos
      const recipes = await recipeRepository.find({
        relations: ["ingredients", "steps"],
      });

      return res.status(200).json(recipes);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar as receitas", error });
    }
  }
}
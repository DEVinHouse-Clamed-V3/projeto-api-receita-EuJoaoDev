import express from "express";
import { RecipeController } from "../controllers/RecipeController";

const router = express.Router();
const recipeController = new RecipeController();

router.post("/recipes", recipeController.createRecipe);
router.get("/recipes", recipeController.listRecipes);

export default router;
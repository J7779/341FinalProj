const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/", isAuthenticated, recipeController.createRecipe);
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.put("/:id", isAuthenticated, recipeController.updateRecipe);
router.delete("/:id", isAuthenticated, recipeController.deleteRecipe);

module.exports = router;

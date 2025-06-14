// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { isAuthenticated } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - instructions
 *         - category
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the recipe.
 *           example: "60d0fe4f5311236168a109cb"
 *         title:
 *           type: string
 *           description: The title of the recipe.
 *           example: "Classic Spaghetti Carbonara"
 *         description:
 *           type: string
 *           description: A brief summary of the recipe.
 *           example: "A creamy and delicious Italian pasta dish."
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of ingredients required for the recipe.
 *           example: ["Spaghetti", "Eggs", "Pancetta", "Parmesan Cheese", "Black Pepper"]
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Step-by-step cooking instructions.
 *           example: ["Boil the spaghetti.", "Fry the pancetta.", "Mix eggs and cheese.", "Combine everything."]
 *         category:
 *           type: string
 *           description: The ID of the category this recipe belongs to.
 *           example: "60d0fe4f5311236168a109cc"
 *         author:
 *           type: string
 *           description: The ID of the user who created the recipe.
 *           example: "60d0fe4f5311236168a109cd"
 *         prepTime:
 *           type: integer
 *           description: Preparation time in minutes.
 *           example: 10
 *         cookTime:
 *           type: integer
 *           description: Cooking time in minutes.
 *           example: 15
 *         servings:
 *           type: integer
 *           description: Number of servings the recipe makes.
 *           example: 4
 *         imageUrl:
 *           type: string
 *           description: URL of an image for the recipe (optional).
 *           example: "https://example.com/images/carbonara.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the recipe was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the recipe was last updated.
 *
 *   requestBodies:
 *     RecipePostBody:
 *       description: Recipe object that needs to be added. `author` is derived from the authenticated user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - ingredients
 *               - instructions
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Spicy Thai Green Curry"
 *               description:
 *                 type: string
 *                 example: "A fragrant and spicy curry with chicken and vegetables."
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Chicken Breast", "Green Curry Paste", "Coconut Milk", "Bamboo Shoots"]
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Sauté curry paste.", "Add chicken and cook through.", "Add coconut milk and vegetables."]
 *               category:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109cc"
 *               prepTime:
 *                 type: integer
 *                 example: 15
 *               cookTime:
 *                 type: integer
 *                 example: 20
 *               servings:
 *                 type: integer
 *                 example: 4
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/images/thaicurry.jpg"
 *     RecipePutBody:
 *       description: Recipe fields to update. Only include fields that need to be changed.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: # All fields are optional for update
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               prepTime:
 *                 type: integer
 *               cookTime:
 *                 type: integer
 *               servings:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API for managing recipes
 */

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe (Protected)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/RecipePostBody'
 *     responses:
 *       201:
 *         description: Recipe created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Bad Request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/", isAuthenticated, recipeController.createRecipe);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Retrieve a list of all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: A list of recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Internal server error.
 */
router.get("/", recipeController.getAllRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe.
 *     responses:
 *       200:
 *         description: The recipe data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", recipeController.getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update an existing recipe (Protected)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to update.
 *     requestBody:
 *       $ref: '#/components/requestBodies/RecipePutBody'
 *     responses:
 *       200:
 *         description: Recipe updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Bad Request. Invalid ID or input.
 *       401:
 *         description: Unauthorized. You can only update your own recipes.
 *       404:
 *         description: Recipe not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", isAuthenticated, recipeController.updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe (Protected)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to delete.
 *     responses:
 *       200:
 *         description: Recipe deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recipe deleted successfully"
 *       401:
 *         description: Unauthorized. You can only delete your own recipes.
 *       404:
 *         description: Recipe not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", isAuthenticated, recipeController.deleteRecipe);

module.exports = router;

// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { isAuthenticated } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - recipe
 *         - user
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the review.
 *           example: "61e0c3b8d6e3f4a8e6b1c2d3"
 *         recipe:
 *           type: string
 *           description: The ID of the recipe being reviewed.
 *           example: "60d0fe4f5311236168a109cb"
 *         user:
 *           type: string
 *           description: The ID of the user who wrote the review.
 *           example: "60d0fe4f5311236168a109cd"
 *         rating:
 *           type: integer
 *           description: The rating given, from 1 to 5.
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           description: The text content of the review (optional).
 *           example: "This was the best carbonara I have ever made!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the review was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the review was last updated.
 *
 *   requestBodies:
 *     ReviewPostBody:
 *       description: Review object that needs to be added. `user` is derived from the authenticated user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *               - rating
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: The ID of the recipe to review.
 *                 example: "60d0fe4f5311236168a109cb"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great recipe, very easy to follow."
 *     ReviewPutBody:
 *       description: Review fields to update. Only include fields that need to be changed.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: # All fields are optional for update
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing recipe reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review for a recipe (Protected)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/ReviewPostBody'
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request. Invalid input (e.g., recipe not found, already reviewed).
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/", isAuthenticated, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/recipe/{recipeId}:
 *   get:
 *     summary: Get all reviews for a specific recipe
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to fetch reviews for.
 *     responses:
 *       200:
 *         description: A list of reviews for the recipe.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Recipe not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/recipe/:recipeId", reviewController.getReviewsForRecipe);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review (Protected)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review to update.
 *     requestBody:
 *       $ref: '#/components/requestBodies/ReviewPutBody'
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request. Invalid ID or input.
 *       401:
 *         description: Unauthorized. You can only update your own reviews.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", isAuthenticated, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Protected)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review to delete.
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       401:
 *         description: Unauthorized. You can only delete your own reviews.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", isAuthenticated, reviewController.deleteReview);

module.exports = router;

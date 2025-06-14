// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { isAuthenticated } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the category.
 *           example: "60d0fe4f5311236168a109aa"
 *         name:
 *           type: string
 *           description: The name of the category. Must be unique.
 *           example: "Italian"
 *         description:
 *           type: string
 *           description: A short description of the category (optional).
 *           example: "Classic dishes from Italy"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the category was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the category was last updated.
 *
 *   requestBodies:
 *     CategoryPostBody:
 *       description: Category object that needs to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Desserts"
 *               description:
 *                 type: string
 *                 example: "Sweet treats and baked goods"
 *     CategoryPutBody:
 *       description: Category fields to update. Only include fields that need to be changed.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing recipe categories
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Protected)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CategoryPostBody'
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad Request. Category name already exists or input is invalid.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/", isAuthenticated, categoryController.createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error.
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category.
 *     responses:
 *       200:
 *         description: The category data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update an existing category (Protected)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to update.
 *     requestBody:
 *       $ref: '#/components/requestBodies/CategoryPutBody'
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad Request. Invalid ID or input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", isAuthenticated, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Protected)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", isAuthenticated, categoryController.deleteCategory);

module.exports = router;

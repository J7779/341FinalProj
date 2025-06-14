const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/", isAuthenticated, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", isAuthenticated, categoryController.updateCategory);
router.delete("/:id", isAuthenticated, categoryController.deleteCategory);

module.exports = router;

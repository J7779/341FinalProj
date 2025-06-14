const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/", isAuthenticated, reviewController.createReview);
router.get("/recipe/:recipeId", reviewController.getReviewsForRecipe);
router.put("/:id", isAuthenticated, reviewController.updateReview);
router.delete("/:id", isAuthenticated, reviewController.deleteReview);

module.exports = router;

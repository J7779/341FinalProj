const Review = require("../models/reviewModel");
const Recipe = require("../models/recipeModel");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
  try {
    const recipeId = req.body.recipe;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid Recipe ID format" });
    }
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const review = new Review({
      ...req.body,
      author: req.user.id,
    });
    await review.save();
    recipe.reviews.push(review.id);
    await recipe.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReviewsForRecipe = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.recipeId)) {
      return res.status(400).json({ message: "Invalid Recipe ID format" });
    }
    const reviews = await Review.find({ recipe: req.params.recipeId }).populate(
      "author",
      "displayName"
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this review" });
    }
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this review" });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

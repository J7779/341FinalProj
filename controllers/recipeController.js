const Recipe = require("../models/recipeModel");
const mongoose = require("mongoose");

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user.id,
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "displayName")
      .populate("category", "name");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "displayName")
      .populate("category", "name")
      .populate("reviews");
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this recipe" });
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this recipe" });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

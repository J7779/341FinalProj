const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const API_URL = process.env.API_URL || "http://localhost:5000";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${API_URL}/auth/failed`,
    session: false,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${API_URL}/auth/failed?error=authentication_failed`);
    }
    const token = generateToken(req.user._id);
    res.redirect(`/?token=${token}`);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${API_URL}/?message=Logged%20Out`);
  });
});

router.get("/profile", isAuthenticated, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.status(200).json(req.user);
});

router.get("/failed", (req, res) => {
  const errorMessage =
    req.query.error || "Google authentication failed. Please try again.";
  res
    .status(401)
    .send(
      `<h1>Authentication Failed</h1><p>${decodeURIComponent(errorMessage)}</p>`
    );
});

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
require("./config/passport-setup");

dotenv.config();

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const API_URL = process.env.API_URL || "http://localhost:5000";

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const token = req.query.token;
  const message = req.query.message;
  let tokenDisplay = "";
  if (token) {
    tokenDisplay = `
      <h3>Your JWT Token:</h3>
      <p style="word-break: break-all;">${token}</p>
      <p><strong>Copy this token</strong> to use with API clients for accessing protected routes.</p>
      <p>Set Header: <code>Authorization: Bearer ${token}</code></p>`;
  }
  let pageMessage = "";
  if (message) {
    pageMessage = `<p style="color: green;"><strong>Message:</strong> ${decodeURIComponent(
      message
    )}</p>`;
  }

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Recipe API</title></head>
    <body style="font-family: sans-serif; margin: 20px;">
        <h1>Recipe API</h1>
        ${pageMessage}
        <p><a href="${API_URL}/auth/google">Login with Google to get a JWT Token</a></p>
        <p>Use the token to access protected routes for creating, updating, or deleting recipes, categories, and reviews.</p>
        ${tokenDisplay}
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}. Main page at ${API_URL}/`)
  );
}

module.exports = app;

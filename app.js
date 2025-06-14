const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const swaggerSetup = require("./config/swagger");
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

swaggerSetup(app);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const token = req.query.token;
  const message = req.query.message;
  let tokenDisplay = "";
  if (token) {
    tokenDisplay = `
      <h3>Your JWT Token:</h3>
      <div class="token-container">
          <pre id="jwt-token">${token}</pre>
          <button onclick="copyToken()">Copy Token</button>
      </div>
      <p><strong>Copy this token</strong> to use with API clients or the "Authorize" button in the API Docs for accessing protected routes.</p>
      <p>Set Header: <code>Authorization: Bearer YOUR_TOKEN</code></p>`;
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
    <head>
        <title>Recipe API</title>
        <style>
            body { font-family: sans-serif; margin: 40px; line-height: 1.6; }
            code { background-color: #f0f0f0; padding: 2px 5px; border-radius: 4px; }
            .token-container { display: flex; align-items: center; gap: 10px; background-color: #eee; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
            #jwt-token { margin: 0; white-space: pre-wrap; word-break: break-all; flex-grow: 1; }
            button, .button-link { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; font-size: 16px; display: inline-block; }
            .button-link { margin-top: 20px; }
            button:hover, .button-link:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        <h1>Recipe API</h1>
        ${pageMessage}
        <p><a href="${API_URL}/auth/google">Login with Google to get a JWT Token</a></p>
        <a href="/api-docs" class="button-link">View API Docs</a>
        <hr style="margin: 20px 0;">
        ${tokenDisplay}
        <script>
            function copyToken() {
                const tokenText = document.getElementById('jwt-token').innerText;
                navigator.clipboard.writeText(tokenText).then(() => {
                    alert('Token copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy token: ', err);
                    alert('Could not copy token.');
                });
            }
        </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(
      `Server running on port ${PORT}. API Docs at ${API_URL}/api-docs`
    )
  );
}

module.exports = app;

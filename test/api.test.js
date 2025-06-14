const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../app");

let mongoServer;
let testUser;
let testCategory;
let testRecipe;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  testUser = await mongoose.model("User").create({
    email: "test@example.com",
    displayName: "Test User",
  });

  token = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.model("Recipe").deleteMany({});
  await mongoose.model("Category").deleteMany({});

  testCategory = await mongoose.model("Category").create({ name: "Desserts" });
});

describe("Category API", () => {
  it("GET /api/categories - should get all categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Desserts");
  });

  it("POST /api/categories - should fail without auth", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send({ name: "Breakfast" });
    expect(res.statusCode).toEqual(401);
  });
});

describe("Recipe API", () => {
  it("POST /api/recipes - should create a recipe with auth", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Cake",
        description: "A yummy cake.",
        ingredients: ["flour", "sugar"],
        instructions: "Mix and bake.",
        category: testCategory.id,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe("Test Cake");
    expect(res.body.author).toBe(testUser.id);
    testRecipe = res.body;
  });

  it("GET /api/recipes - should get all recipes", async () => {
    const res = await request(app).get("/api/recipes");
    expect(res.statusCode).toEqual(200);
  });
});

describe("Review API", () => {
  it("POST /api/reviews - should fail for a non-existent recipe", async () => {
    const fakeRecipeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        rating: 5,
        comment: "Amazing!",
        recipe: fakeRecipeId,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Recipe not found");
  });

  it("POST /api/reviews - should create a review for an existing recipe", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        rating: 4,
        comment: "Pretty good!",
        recipe: testRecipe._id,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.comment).toBe("Pretty good!");
    expect(res.body.author).toBe(testUser.id);
  });
});

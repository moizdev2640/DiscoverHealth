const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const db = require("./db");
const resourceRoutes = require("./routes/healthcareResourceRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DiscoverHealth API",
      version: "1.0.0",
      description: "API documentation for DiscoverHealth web application",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        HealthcareResource: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            category: { type: "string" },
            country: { type: "string" },
            region: { type: "string" },
            lat: { type: "number" },
            lon: { type: "number" },
            description: { type: "string" },
            recommendations: { type: "integer" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            password: { type: "string" },
            isAdmin: { type: "integer" },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "integer" },
            resource_id: { type: "integer" },
            review: { type: "string" },
            user_id: { type: "integer" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://nominatim.openstreetmap.org"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.send("DiscoverHealth API is running");
});

app.use("/resources", resourceRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

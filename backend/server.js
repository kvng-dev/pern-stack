import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { configDotenv } from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/test", (req, res) => {
  console.log(res.getHeaders());
  res.json({ message: "Hello, World!" });
});

app.use("/api/products", productRoutes);

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

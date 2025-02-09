import express from "express";
import { getAllProducts } from "../controllers/productController";

const route = express.Router();

route.get("/", getAllProducts);

export default route;

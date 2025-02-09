import express from "express";
import { sql } from "../config/db.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    console.log("fetched products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
const createProduct = async (req, res) => {
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }
  try {
    const product = await sql`
      INSERT INTO products (name, image, price)
      VALUES (${name}, ${image}, ${price})
      RETURNING *
    `;
    console.log("created product", product);
    res.status(201).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Error creating product", error);
    res.status(400).json({ success: false, error: "Invalid request payload" });
  }
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required ID" });
  }
  try {
    const product = await sql`
      SELECT * FROM products
      WHERE id = ${id}
    `;
    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    console.log("fetched product", product[0]);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;
  if (!id || (!name && !image && !price)) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }
  try {
    const update = await sql`
      UPDATE products
      SET ${name ? `name = ${name},` : ""}
          ${image ? `image = ${image},` : ""}
          ${price ? `price = ${price}` : ""}
      WHERE id = ${id}
      RETURNING *
    `;

    if (update.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    console.log("updated product", update[0]);
    res.status(200).json({ success: true, data: update[0] });
  } catch (error) {
    console.error("Error updating product", error);
    res.status(400).json({ success: false, error: "Invalid request payload" });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required ID" });
  }
  try {
    const deleteResult = await sql`
      DELETE FROM products
      WHERE id = ${id}
    `;

    if (deleteResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    console.log("deleted product with ID", id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deleteResult,
    });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
